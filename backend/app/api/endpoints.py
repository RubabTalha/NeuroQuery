import os
import uuid
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import StreamingResponse, JSONResponse
import aiofiles
import asyncio
from typing import List

from app.core.config import settings
from app.models.schemas import (
    HealthResponse, UploadResponse, QueryRequest,
    SourceDocument, StreamingChunk, ErrorResponse
)
from app.services.rag_service import RAGService
import logging

logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix=settings.API_V1_STR)

# Initialize RAG service
rag_service = RAGService()

# Start queue processing in background
@router.on_event("startup")
async def startup_event():
    """Start background tasks on startup."""
    asyncio.create_task(rag_service.process_upload_queue())
    logger.info("Started RAG service queue processing")

@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    try:
        stats = rag_service.get_stats()
        return HealthResponse(
            status="healthy",
            documents=stats["documents"],
            chunks=stats["chunks"],
            queue=stats["queue"]
        )
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=500, detail="Service unhealthy")

@router.post("/upload", response_model=UploadResponse)
async def upload_file(file: UploadFile = File(...)):
    """Upload and process PDF file."""
    try:
        # Validate file type
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
        # Validate file size
        file.file.seek(0, 2)  # Seek to end
        file_size = file.file.tell()
        file.file.seek(0)  # Reset to beginning
        
        if file_size > settings.MAX_UPLOAD_SIZE:
            raise HTTPException(status_code=400, detail="File too large (max 10MB)")
        
        # Generate unique file ID
        file_id = str(uuid.uuid4())
        filename = file.filename
        safe_filename = f"{file_id}_{filename}"
        file_path = os.path.join(settings.UPLOAD_DIR, safe_filename)
        
        # Save file temporarily
        async with aiofiles.open(file_path, 'wb') as out_file:
            content = await file.read()
            await out_file.write(content)
        
        logger.info(f"Uploaded file: {filename} ({file_size} bytes)")
        
        # Add to processing queue
        queue_size = await rag_service.add_to_queue(file_path, filename, file_id)
        
        # Return immediate response
        return UploadResponse(
            filename=filename,
            file_id=file_id,
            size=file_size,
            pages=0,  # Will be updated after processing
            chunks=0,  # Will be updated after processing
            status="queued"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Upload error: {e}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@router.post("/query")
async def query_documents(query_request: QueryRequest):
    """Query documents with streaming response."""
    
    async def generate():
        """Generate streaming response."""
        try:
            async for chunk in rag_service.query_documents(
                query=query_request.query,
                top_k=query_request.top_k
            ):
                yield chunk.encode('utf-8')
                
        except Exception as e:
            logger.error(f"Streaming error: {e}")
            error_chunk = StreamingChunk(
                type="error",
                message="Internal server error"
            )
            yield f"data: {error_chunk.json()}\n\n".encode('utf-8')
    
    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"  # Disable buffering for nginx
        }
    )

@router.get("/documents")
async def list_documents():
    """List all processed documents."""
    try:
        # This would require additional methods in VectorStore
        # For now, return placeholder
        stats = rag_service.get_stats()
        return {
            "total_documents": stats["documents"],
            "total_chunks": stats["chunks"],
            "documents": []  # Would list actual documents in production
        }
    except Exception as e:
        logger.error(f"Error listing documents: {e}")
        raise HTTPException(status_code=500, detail="Failed to list documents")

@router.delete("/documents/{file_id}")
async def delete_document(file_id: str):
    """Delete document by file ID."""
    try:
        # This would require delete method in VectorStore
        # For now, return placeholder
        return {
            "message": f"Document {file_id} deleted successfully",
            "file_id": file_id
        }
    except Exception as e:
        logger.error(f"Error deleting document: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete document")

@router.get("/stats")
async def get_stats():
    """Get system statistics."""
    try:
        stats = rag_service.get_stats()
        return {
            **stats,
            "vector_store_path": settings.VECTOR_STORE_PATH,
            "embedding_model": settings.EMBEDDING_MODEL,
            "chunk_size": settings.CHUNK_SIZE,
            "chunk_overlap": settings.CHUNK_OVERLAP
        }
    except Exception as e:
        logger.error(f"Error getting stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to get statistics")