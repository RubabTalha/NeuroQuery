from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class HealthResponse(BaseModel):
    """Health check response schema."""
    status: str = "ok"
    timestamp: datetime = Field(default_factory=datetime.now)
    version: str = "1.0.0"
    documents: int = 0
    chunks: int = 0
    queue: int = 0

class UploadResponse(BaseModel):
    """File upload response schema."""
    filename: str
    file_id: str
    size: int
    pages: int
    chunks: int
    status: str = "processed"
    timestamp: datetime = Field(default_factory=datetime.now)

class QueryRequest(BaseModel):
    """Query request schema."""
    query: str = Field(..., min_length=1, max_length=1000)
    top_k: int = Field(default=3, ge=1, le=10)

class SourceDocument(BaseModel):
    """Source document schema."""
    file_id: str
    filename: str
    content: str
    page: Optional[int] = None
    chunk_index: int
    score: float
    metadata: Dict[str, Any] = {}

class QueryResponse(BaseModel):
    """Query response schema."""
    answer: str
    sources: List[SourceDocument]
    processing_time: float
    query: str

class StreamingChunk(BaseModel):
    """Streaming response chunk schema."""
    type: str  # "answer_chunk", "sources", "error"
    content: Optional[str] = None
    sources: Optional[List[SourceDocument]] = None
    message: Optional[str] = None

class ErrorResponse(BaseModel):
    """Error response schema."""
    detail: str
    error_code: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.now)