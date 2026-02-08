import numpy as np
from typing import List
import logging
from langchain.embeddings.base import Embeddings

logger = logging.getLogger(__name__)

class HuggingFaceEmbedder(Embeddings):
    """HuggingFace sentence transformer embeddings."""
    
    def __init__(self, model_name: str = "sentence-transformers/all-MiniLM-L6-v2"):
        try:
            from sentence_transformers import SentenceTransformer
            self.model = SentenceTransformer(model_name)
            self.model_name = model_name
            logger.info(f"Loaded embedding model: {model_name}")
        except ImportError:
            logger.error("sentence-transformers not installed. Install with: pip install sentence-transformers")
            raise
    
    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """Embed multiple documents."""
        try:
            embeddings = self.model.encode(texts, convert_to_numpy=True, normalize_embeddings=True)
            return embeddings.tolist()
        except Exception as e:
            logger.error(f"Error embedding documents: {e}")
            raise
    
    def embed_query(self, text: str) -> List[float]:
        """Embed a single query."""
        try:
            embedding = self.model.encode(text, convert_to_numpy=True, normalize_embeddings=True)
            return embedding.tolist()
        except Exception as e:
            logger.error(f"Error embedding query: {e}")
            raise

class OpenAIEmbedder(Embeddings):
    """OpenAI embeddings."""
    
    def __init__(self, api_key: str, model: str = "text-embedding-ada-002"):
        try:
            import openai
            self.client = openai.OpenAI(api_key=api_key)
            self.model = model
            logger.info(f"Loaded OpenAI embedding model: {model}")
        except ImportError:
            logger.error("openai not installed. Install with: pip install openai")
            raise
    
    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """Embed multiple documents."""
        try:
            response = self.client.embeddings.create(
                model=self.model,
                input=texts
            )
            return [data.embedding for data in response.data]
        except Exception as e:
            logger.error(f"Error embedding documents with OpenAI: {e}")
            raise
    
    def embed_query(self, text: str) -> List[float]:
        """Embed a single query."""
        return self.embed_documents([text])[0]

def get_embedder(embedding_model: str, openai_api_key: str = ""):
    """Factory function to get embedder."""
    if "openai" in embedding_model.lower() or "ada" in embedding_model.lower():
        if not openai_api_key:
            raise ValueError("OpenAI API key required for OpenAI embeddings")
        return OpenAIEmbedder(api_key=openai_api_key, model=embedding_model)
    else:
        return HuggingFaceEmbedder(model_name=embedding_model)