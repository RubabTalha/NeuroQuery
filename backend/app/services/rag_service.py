import asyncio
import json
from typing import List, Dict, Any, AsyncGenerator
import logging
from datetime import datetime

from app.services.pdf_processor import PDFProcessor
from app.services.embedder import get_embedder
from app.services.vector_store import VectorStore
from app.core.config import settings

logger = logging.getLogger(__name__)

class RAGService:
    """Main RAG pipeline service."""
    
    def __init__(self):
        self.pdf_processor = PDFProcessor(
            chunk_size=settings.CHUNK_SIZE,
            chunk_overlap=settings.CHUNK_OVERLAP
        )
        self.embedder = get_embedder(
            embedding_model=settings.EMBEDDING_MODEL,
            openai_api_key=settings.OPENAI_API_KEY
        )
        self.vector_store = VectorStore()
        self.processing_queue = asyncio.Queue()
        self.is_processing = False
    
    async def process_upload_queue(self):
        """Process files in the upload queue."""
        while True:
            try:
                if not self.is_processing and not self.processing_queue.empty():
                    self.is_processing = True
                    
                    file_info = await self.processing_queue.get()
                    file_path = file_info['file_path']
                    filename = file_info['filename']
                    file_id = file_info['file_id']
                    
                    try:
                        # Process PDF
                        chunks, page_count = self.pdf_processor.process_pdf(
                            file_path, filename, file_id
                        )
                        
                        # Generate embeddings
                        texts = [chunk.page_content for chunk in chunks]
                        embeddings = self.embedder.embed_documents(texts)
                        
                        # Store in vector database
                        documents = [
                            {
                                'page_content': chunk.page_content,
                                'metadata': chunk.metadata
                            }
                            for chunk in chunks
                        ]
                        self.vector_store.add_documents(documents, embeddings)
                        
                        logger.info(f"Successfully processed {filename}")
                        
                    except Exception as e:
                        logger.error(f"Error processing {filename}: {e}")
                    
                    finally:
                        self.processing_queue.task_done()
                        self.is_processing = False
                
                await asyncio.sleep(0.1)
                
            except Exception as e:
                logger.error(f"Error in queue processing: {e}")
                self.is_processing = False
    
    async def add_to_queue(self, file_path: str, filename: str, file_id: str):
        """Add file to processing queue."""
        await self.processing_queue.put({
            'file_path': file_path,
            'filename': filename,
            'file_id': file_id
        })
        return self.processing_queue.qsize()
    
    async def query_documents(self, query: str, top_k: int = 3) -> AsyncGenerator[str, None]:
        """Query documents and stream response."""
        start_time = datetime.now()
        
        try:
            # Generate query embedding
            query_embedding = self.embedder.embed_query(query)
            
            # Search for relevant documents
            search_results = self.vector_store.search(query_embedding, top_k=top_k)
            
            if not search_results:
                yield self._format_stream_chunk(
                    "error",
                    message="No relevant documents found"
                )
                return
            
            # Prepare context from search results
            context = "\n\n".join([
                f"[Source {i+1} from {result['metadata']['source']}]: {result['content'][:500]}..."
                for i, result in enumerate(search_results)
            ])
            
            # Generate answer (simplified - in production, use an LLM)
            answer = await self._generate_answer(query, context)
            
            # Stream answer chunks
            chunk_size = 50
            for i in range(0, len(answer), chunk_size):
                chunk = answer[i:i + chunk_size]
                yield self._format_stream_chunk("answer_chunk", content=chunk)
                await asyncio.sleep(0.01)  # Simulate streaming
            
            # Stream sources
            yield self._format_stream_chunk("sources", sources=search_results)
            
            processing_time = (datetime.now() - start_time).total_seconds()
            logger.info(f"Query processed in {processing_time:.2f}s")
            
        except Exception as e:
            logger.error(f"Error processing query: {e}")
            yield self._format_stream_chunk("error", message=str(e))
    
    async def _generate_answer(self, query: str, context: str) -> str:
        """Generate answer using context (simplified version)."""
        # In production, replace this with actual LLM call (OpenAI, Anthropic, etc.)
        
        prompt = f"""Based on the following context, answer the question.
        
        Question: {query}
        
        Context:
        {context}
        
        Answer: """
        
        # Simulate LLM processing
        await asyncio.sleep(0.5)
        
        # Simple template-based response (replace with actual LLM in production)
        answers = [
            f"Based on the documents you've uploaded, here's what I found about '{query}':\n\nThe documents discuss various aspects of this topic, particularly focusing on implementation details and best practices.",
            f"From the analyzed documents regarding '{query}':\n\nKey findings include important considerations for implementation and several recommendations for optimal performance.",
            f"Regarding your question about '{query}', the documents indicate:\n\nSeveral approaches are discussed, with emphasis on practical applications and potential challenges."
        ]
        
        import random
        return random.choice(answers) + "\n\nThis answer is generated based on semantic search results from your uploaded documents."
    
    def _format_stream_chunk(self, chunk_type: str, **kwargs) -> str:
        """Format a stream chunk."""
        chunk_data = {"type": chunk_type}
        
        if chunk_type == "answer_chunk":
            chunk_data["content"] = kwargs.get("content", "")
        elif chunk_type == "sources":
            chunk_data["sources"] = kwargs.get("sources", [])
        elif chunk_type == "error":
            chunk_data["message"] = kwargs.get("message", "Unknown error")
        
        return f"data: {json.dumps(chunk_data)}\n\n"
    
    def get_stats(self) -> Dict[str, Any]:
        """Get service statistics."""
        vector_stats = self.vector_store.get_stats()
        
        return {
            "documents": vector_stats.get("documents", 0),
            "chunks": vector_stats.get("chunks", 0),
            "queue": self.processing_queue.qsize(),
            "is_processing": self.is_processing
        }