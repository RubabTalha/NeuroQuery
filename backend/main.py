import os
import uvicorn
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import logging

from app.core.config import settings
from app.api.endpoints import router as api_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown events."""
    # Startup
    logger.info("Starting up NeuroQuery RAG Pipeline API...")
    
    # Create necessary directories
    os.makedirs("uploads", exist_ok=True)
    os.makedirs("data", exist_ok=True)
    os.makedirs("static", exist_ok=True)
    
    yield
    
    # Shutdown
    logger.info("Shutting down NeuroQuery RAG Pipeline API...")

def create_application() -> FastAPI:
    """Create and configure FastAPI application."""
    app = FastAPI(
        title="NeuroQuery RAG Pipeline API",
        description="Advanced Retrieval-Augmented Generation Pipeline for Document Querying",
        version="1.0.0",
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        openapi_url="/api/openapi.json",
        lifespan=lifespan
    )
    
    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Mount static files
    app.mount("/static", StaticFiles(directory="static"), name="static")
    
    # Include API router
    app.include_router(api_router, prefix="/api")
    
    # Root endpoint
    @app.get("/")
    async def root():
        return {
            "message": "NeuroQuery RAG Pipeline API",
            "version": "1.0.18",
            "docs": "/api/docs",
            "health": "/api/health"
        }
    
    return app

app = create_application()

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )