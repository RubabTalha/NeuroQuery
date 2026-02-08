import chromadb
from chromadb.config import Settings
from typing import List, Dict, Any, Optional
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

class VectorStore:
    """Vector database service using ChromaDB."""
    
    def __init__(self):
        self.client = chromadb.PersistentClient(
            path=settings.VECTOR_STORE_PATH,
            settings=Settings(anonymized_telemetry=False)
        )
        self.collection_name = settings.COLLECTION_NAME
        self.collection = self._get_or_create_collection()
    
    def _get_or_create_collection(self):
        """Get existing collection or create new one."""
        try:
            # Try to get existing collection
            collection = self.client.get_collection(name=self.collection_name)
            logger.info(f"Loaded existing collection: {self.collection_name}")
        except:
            # Create new collection
            collection = self.client.create_collection(
                name=self.collection_name,
                metadata={"hnsw:space": "cosine"}
            )
            logger.info(f"Created new collection: {self.collection_name}")
        
        return collection
    
    def add_documents(self, documents: List[Dict[str, Any]], embeddings: List[List[float]]):
        """Add documents to vector store."""
        try:
            # Prepare data for ChromaDB
            ids = [f"doc_{i}_{doc['metadata']['file_id']}" for i, doc in enumerate(documents)]
            texts = [doc['page_content'] for doc in documents]
            metadatas = [doc['metadata'] for doc in documents]
            
            # Add to collection
            self.collection.add(
                embeddings=embeddings,
                documents=texts,
                metadatas=metadatas,
                ids=ids
            )
            
            logger.info(f"Added {len(documents)} documents to vector store")
            
        except Exception as e:
            logger.error(f"Error adding documents to vector store: {e}")
            raise
    
    def search(self, query_embedding: List[float], top_k: int = 3, filter_by: Optional[Dict] = None) -> List[Dict[str, Any]]:
        """Search for similar documents."""
        try:
            # Perform similarity search
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=top_k,
                where=filter_by
            )
            
            # Format results
            formatted_results = []
            if results['documents']:
                for i in range(len(results['documents'][0])):
                    formatted_results.append({
                        'content': results['documents'][0][i],
                        'metadata': results['metadatas'][0][i],
                        'score': 1 - results['distances'][0][i] if results['distances'] else 0,
                        'id': results['ids'][0][i]
                    })
            
            logger.info(f"Found {len(formatted_results)} results for query")
            return formatted_results
            
        except Exception as e:
            logger.error(f"Error searching vector store: {e}")
            raise
    
    def get_stats(self) -> Dict[str, int]:
        """Get vector store statistics."""
        try:
            count = self.collection.count()
            return {
                "documents": count,
                "chunks": count  # In ChromaDB, each document is a chunk
            }
        except Exception as e:
            logger.error(f"Error getting vector store stats: {e}")
            return {"documents": 0, "chunks": 0}
    
    def delete_by_file_id(self, file_id: str):
        """Delete all documents for a specific file."""
        try:
            # Get all documents for this file
            results = self.collection.get(where={"file_id": file_id})
            
            if results['ids']:
                self.collection.delete(ids=results['ids'])
                logger.info(f"Deleted {len(results['ids'])} documents for file {file_id}")
            
        except Exception as e:
            logger.error(f"Error deleting documents for file {file_id}: {e}")
            raise