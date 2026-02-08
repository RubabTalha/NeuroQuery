import os
import uvicorn
import uuid
import asyncio
import json
import logging
from datetime import datetime
from typing import List, Dict, Any, Optional, AsyncGenerator

# FastAPI imports
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import aiofiles

# PDF Processing
import PyPDF2

# Vector Database
import chromadb
from chromadb.config import Settings

# Embeddings
try:
    from sentence_transformers import SentenceTransformer
    EMBEDDINGS_AVAILABLE = True
except ImportError:
    EMBEDDINGS_AVAILABLE = False
    print("Warning: sentence-transformers not installed. Install with: pip install sentence-transformers")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Configuration
class Config:
    HOST = "0.0.0.0"
    PORT = 8000
    DEBUG = True
    
    # File upload settings
    MAX_UPLOAD_SIZE = 10 * 1024 * 1024  # 10MB
    UPLOAD_DIR = "uploads"
    ALLOWED_EXTENSIONS = [".pdf"]
    
    # Vector store settings
    VECTOR_STORE_PATH = "./data/chroma_db"
    COLLECTION_NAME = "neuroquery_documents"
    
    # Embedding settings
    EMBEDDING_MODEL = "all-MiniLM-L6-v2"  # Simple model name
    
    # Text processing
    CHUNK_SIZE = 1000
    CHUNK_OVERLAP = 200
    
    # CORS
    CORS_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5500", "*"]

config = Config()

# Create necessary directories
os.makedirs(config.UPLOAD_DIR, exist_ok=True)
os.makedirs(config.VECTOR_STORE_PATH, exist_ok=True)

# Initialize FastAPI app
app = FastAPI(
    title="NeuroQuery RAG Pipeline API",
    description="Advanced Retrieval-Augmented Generation Pipeline",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# PDF Processor
class PDFProcessor:
    def __init__(self, chunk_size=1000, chunk_overlap=200):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
    
    def extract_text(self, file_path: str):
        """Extract text from PDF file."""
        try:
            text = ""
            pages = 0
            
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                pages = len(pdf_reader.pages)
                
                for page_num in range(pages):
                    page = pdf_reader.pages[page_num]
                    page_text = page.extract_text()
                    
                    if page_text:
                        text += f"--- Page {page_num + 1} ---\n{page_text}\n\n"
            
            logger.info(f"Extracted text from {pages} pages")
            return text, pages
            
        except Exception as e:
            logger.error(f"Error extracting text from PDF: {e}")
            raise
    
    def chunk_text(self, text: str, filename: str, file_id: str):
        """Split text into chunks."""
        try:
            # Simple chunking by character count
            chunks = []
            words = text.split()
            
            current_chunk = []
            current_length = 0
            
            for word in words:
                current_chunk.append(word)
                current_length += len(word) + 1  # +1 for space
                
                if current_length >= self.chunk_size:
                    chunk_text = ' '.join(current_chunk)
                    chunks.append({
                        'text': chunk_text,
                        'metadata': {
                            'source': filename,
                            'file_id': file_id,
                            'chunk_index': len(chunks),
                            'total_chunks': 0  # Will be updated
                        }
                    })
                    current_chunk = []
                    current_length = 0
            
            # Add the last chunk if not empty
            if current_chunk:
                chunk_text = ' '.join(current_chunk)
                chunks.append({
                    'text': chunk_text,
                    'metadata': {
                        'source': filename,
                        'file_id': file_id,
                        'chunk_index': len(chunks),
                        'total_chunks': len(chunks)
                    }
                })
            
            # Update total_chunks in all chunks
            for chunk in chunks:
                chunk['metadata']['total_chunks'] = len(chunks)
            
            logger.info(f"Created {len(chunks)} chunks")
            return chunks
            
        except Exception as e:
            logger.error(f"Error chunking text: {e}")
            raise

# Embedder (Simplified - can be replaced with actual embeddings)
class SimpleEmbedder:
    def __init__(self):
        self.model = None
        if EMBEDDINGS_AVAILABLE:
            try:
                self.model = SentenceTransformer('all-MiniLM-L6-v2')
                logger.info("Loaded sentence-transformers model")
            except Exception as e:
                logger.warning(f"Could not load sentence-transformers: {e}")
    
    def embed_documents(self, texts: List[str]):
        """Generate simple embeddings for documents."""
        try:
            if self.model:
                # Use actual embeddings if available
                embeddings = self.model.encode(texts, convert_to_numpy=True)
                return embeddings.tolist()
            else:
                # Fallback to simple TF-IDF like embeddings
                import numpy as np
                # Create simple random embeddings for demo
                embeddings = []
                for text in texts:
                    # Create deterministic "embeddings" based on text hash
                    import hashlib
                    seed = int(hashlib.md5(text.encode()).hexdigest()[:8], 16)
                    np.random.seed(seed)
                    embedding = np.random.randn(384).tolist()
                    embeddings.append(embedding)
                return embeddings
        except Exception as e:
            logger.error(f"Error embedding documents: {e}")
            # Return random embeddings as fallback
            import numpy as np
            return [np.random.randn(384).tolist() for _ in texts]
    
    def embed_query(self, text: str):
        """Embed a single query."""
        return self.embed_documents([text])[0]

# Vector Store
class VectorStore:
    def __init__(self):
        self.client = chromadb.PersistentClient(
            path=config.VECTOR_STORE_PATH,
            settings=Settings(anonymized_telemetry=False)
        )
        self.collection = self._get_or_create_collection()
    
    def _get_or_create_collection(self):
        try:
            return self.client.get_or_create_collection(
                name=config.COLLECTION_NAME,
                metadata={"hnsw:space": "cosine"}
            )
        except Exception as e:
            logger.error(f"Error creating collection: {e}")
            raise
    
    def add_documents(self, documents: List[Dict], embeddings: List[List[float]]):
        try:
            ids = [f"doc_{i}_{doc['metadata']['file_id']}" for i, doc in enumerate(documents)]
            texts = [doc['text'] for doc in documents]
            metadatas = [doc['metadata'] for doc in documents]
            
            self.collection.add(
                embeddings=embeddings,
                documents=texts,
                metadatas=metadatas,
                ids=ids
            )
            logger.info(f"Added {len(documents)} documents to vector store")
        except Exception as e:
            logger.error(f"Error adding documents: {e}")
            raise
    
    def search(self, query_embedding: List[float], top_k: int = 3):
        try:
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=top_k
            )
            
            formatted_results = []
            if results['documents']:
                for i in range(len(results['documents'][0])):
                    formatted_results.append({
                        'content': results['documents'][0][i],
                        'metadata': results['metadatas'][0][i],
                        'score': 1 - (results['distances'][0][i] if results['distances'] and i < len(results['distances'][0]) else 0)
                    })
            
            return formatted_results
        except Exception as e:
            logger.error(f"Error searching: {e}")
            return []
    
    def get_stats(self):
        try:
            count = self.collection.count()
            return {"documents": count, "chunks": count}
        except:
            return {"documents": 0, "chunks": 0}

# RAG Service
class RAGService:
    def __init__(self):
        self.pdf_processor = PDFProcessor(
            chunk_size=config.CHUNK_SIZE,
            chunk_overlap=config.CHUNK_OVERLAP
        )
        self.embedder = SimpleEmbedder()
        self.vector_store = VectorStore()
        self.processing_queue = asyncio.Queue()
        self.is_processing = False
    
    async def process_queue(self):
        while True:
            try:
                if not self.is_processing and not self.processing_queue.empty():
                    self.is_processing = True
                    file_info = await self.processing_queue.get()
                    
                    try:
                        # Process PDF
                        text, pages = self.pdf_processor.extract_text(file_info['file_path'])
                        chunks = self.pdf_processor.chunk_text(text, file_info['filename'], file_info['file_id'])
                        
                        # Generate embeddings
                        texts = [chunk['text'] for chunk in chunks]
                        embeddings = self.embedder.embed_documents(texts)
                        
                        # Store in vector database
                        self.vector_store.add_documents(chunks, embeddings)
                        
                        logger.info(f"Processed {file_info['filename']}")
                    except Exception as e:
                        logger.error(f"Error processing {file_info['filename']}: {e}")
                    finally:
                        self.processing_queue.task_done()
                        self.is_processing = False
                
                await asyncio.sleep(0.1)
            except Exception as e:
                logger.error(f"Queue processing error: {e}")
                self.is_processing = False
    
    async def add_to_queue(self, file_path: str, filename: str, file_id: str):
        await self.processing_queue.put({
            'file_path': file_path,
            'filename': filename,
            'file_id': file_id
        })
        return self.processing_queue.qsize()
    
    async def query(self, query_text: str, top_k: int = 3):
        """Simple query without streaming for now."""
        try:
            # Generate query embedding
            query_embedding = self.embedder.embed_query(query_text)
            
            # Search for relevant documents
            results = self.vector_store.search(query_embedding, top_k=top_k)
            
            if not results:
                return {
                    "answer": "No relevant documents found in the database.",
                    "sources": []
                }
            
            # Generate simple answer
            context = "\n".join([f"[Source {i+1}]: {r['content'][:200]}..." for i, r in enumerate(results)])
            
            answer = f"""Based on the documents you've uploaded, here's what I found:

{query_text}

The documents contain relevant information about this topic. Here are the key points from the retrieved sources:

{context}

This information is extracted from your uploaded documents using semantic search."""
            
            return {
                "answer": answer,
                "sources": results,
                "query": query_text
            }
        except Exception as e:
            logger.error(f"Query error: {e}")
            return {
                "answer": f"Error processing query: {str(e)}",
                "sources": [],
                "query": query_text
            }
    
    def get_stats(self):
        vector_stats = self.vector_store.get_stats()
        return {
            **vector_stats,
            "queue": self.processing_queue.qsize(),
            "is_processing": self.is_processing
        }

# Initialize services
rag_service = RAGService()

# Start background task
@app.on_event("startup")
async def startup_event():
    asyncio.create_task(rag_service.process_queue())

# Routes
@app.get("/")
async def root():
    return {
        "message": "NeuroQuery RAG Pipeline API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health")
async def health():
    stats = rag_service.get_stats()
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0",
        "documents": stats["documents"],
        "chunks": stats["chunks"],
        "queue": stats["queue"]
    }

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Validate file
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files allowed")
        
        # Check file size
        contents = await file.read()
        file_size = len(contents)
        
        if file_size > config.MAX_UPLOAD_SIZE:
            raise HTTPException(status_code=400, detail="File too large (max 10MB)")
        
        # Save file
        file_id = str(uuid.uuid4())
        filename = file.filename
        safe_filename = f"{file_id}_{filename}"
        file_path = os.path.join(config.UPLOAD_DIR, safe_filename)
        
        async with aiofiles.open(file_path, 'wb') as f:
            await f.write(contents)
        
        # Add to processing queue
        queue_size = await rag_service.add_to_queue(file_path, filename, file_id)
        
        return {
            "filename": filename,
            "file_id": file_id,
            "size": file_size,
            "status": "queued",
            "queue_position": queue_size,
            "timestamp": datetime.now().isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Upload error: {e}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@app.post("/query")
async def query_documents(query: dict):
    try:
        query_text = query.get("query", "").strip()
        top_k = query.get("top_k", 3)
        
        if not query_text:
            raise HTTPException(status_code=400, detail="Query cannot be empty")
        
        result = await rag_service.query(query_text, top_k)
        
        return result
        
    except Exception as e:
        logger.error(f"Query error: {e}")
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")

@app.get("/stats")
async def get_stats():
    stats = rag_service.get_stats()
    return {
        **stats,
        "vector_store_path": config.VECTOR_STORE_PATH,
        "embedding_model": config.EMBEDDING_MODEL,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/documents")
async def list_documents():
    stats = rag_service.get_stats()
    return {
        "total_documents": stats["documents"],
        "total_chunks": stats["chunks"],
        "queue_size": stats["queue"]
    }

if __name__ == "__main__":
    uvicorn.run(
        "backend:app",
        host=config.HOST,
        port=config.PORT,
        reload=config.DEBUG,
        log_level="info"
    )