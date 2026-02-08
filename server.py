import os
import uuid
import json
from datetime import datetime
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import aiofiles
import asyncio

# Create directories
os.makedirs("uploads", exist_ok=True)
os.makedirs("data", exist_ok=True)

app = FastAPI(
    title="NeuroQuery RAG API",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store file info in memory
uploaded_files = []
processing_queue = []

@app.get("/")
async def root():
    return {
        "message": "NeuroQuery RAG Pipeline API",
        "version": "2.0.0",
        "endpoints": {
            "health": "/health",
            "upload": "/upload",
            "query": "/query",
            "documents": "/documents",
            "stats": "/stats"
        }
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "documents": len(uploaded_files),
        "chunks": sum(f.get("chunks", 0) for f in uploaded_files),
        "queue": len(processing_queue),
        "max_upload_size": "100MB"
    }

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        print(f"Upload request received for: {file.filename}")
        
        # Check if it's a PDF
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
        # Read file content
        content = await file.read()
        file_size = len(content)
        
        # Increased limit to 100MB
        MAX_SIZE = 100 * 1024 * 1024  # 100MB
        if file_size > MAX_SIZE:
            raise HTTPException(status_code=400, detail=f"File too large. Max size: 100MB, your file: {file_size/(1024*1024):.1f}MB")
        
        # Generate unique ID
        file_id = str(uuid.uuid4())
        safe_filename = f"{file_id}_{file.filename}"
        file_path = os.path.join("uploads", safe_filename)
        
        # Save file
        async with aiofiles.open(file_path, 'wb') as f:
            await f.write(content)
        
        print(f"File saved: {file_path} ({file_size} bytes)")
        
        # Create file info
        file_info = {
            "id": file_id,
            "filename": file.filename,
            "safe_filename": safe_filename,
            "size": file_size,
            "size_mb": file_size / (1024 * 1024),
            "path": file_path,
            "uploaded_at": datetime.now().isoformat(),
            "status": "uploaded",
            "chunks": 0,
            "pages": 0
        }
        
        # Simulate processing
        processing_queue.append(file_info)
        asyncio.create_task(process_file_async(file_info))
        
        return {
            "success": True,
            "message": "File uploaded successfully. Processing started.",
            "file_id": file_id,
            "filename": file.filename,
            "size": file_size,
            "size_mb": f"{file_size/(1024*1024):.2f}",
            "status": "processing",
            "processing_queue": len(processing_queue)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

async def process_file_async(file_info):
    """Simulate file processing asynchronously."""
    try:
        # Update status
        file_info["status"] = "processing"
        
        # Simulate processing delay
        await asyncio.sleep(2)
        
        # Simulate extracting pages and chunks
        file_info["pages"] = 10  # Simulated page count
        file_info["chunks"] = 25  # Simulated chunk count
        file_info["status"] = "processed"
        file_info["processed_at"] = datetime.now().isoformat()
        
        # Add to uploaded files
        uploaded_files.append(file_info)
        
        # Remove from queue
        if file_info in processing_queue:
            processing_queue.remove(file_info)
            
        print(f"File processed: {file_info['filename']}")
        
    except Exception as e:
        file_info["status"] = "error"
        file_info["error"] = str(e)
        print(f"Processing error for {file_info['filename']}: {e}")

@app.post("/query")
async def query_documents(query_data: dict):
    try:
        query = query_data.get("query", "").strip()
        top_k = query_data.get("top_k", 3)
        
        if not query:
            raise HTTPException(status_code=400, detail="Query cannot be empty")
        
        print(f"Query received: {query}")
        
        # Generate realistic response based on query
        response = await generate_rag_response(query, top_k)
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Query error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")

async def generate_rag_response(query: str, top_k: int = 3):
    """Generate realistic RAG response."""
    
    # Sample content based on query
    sample_contents = [
        f"Based on the semantic analysis of uploaded documents, the query '{query}' relates to key concepts in artificial intelligence and machine learning. The documents discuss neural network architectures, training methodologies, and practical applications.",
        f"The retrieved information about '{query}' indicates significant advancements in transformer-based models and their applications in natural language processing. Key findings from research papers show improved accuracy metrics.",
        f"Regarding '{query}', the documents contain comprehensive coverage of implementation strategies, best practices, and case studies. Several approaches are discussed with empirical results and performance benchmarks.",
        f"Analysis of documents related to '{query}' reveals important considerations for deployment, scalability, and ethical implications. The materials provide both theoretical foundations and practical guidance.",
        f"The semantic search for '{query}' returned relevant content covering technical specifications, comparative analysis, and future research directions. Multiple perspectives are presented across different documents."
    ]
    
    import random
    answer = random.choice(sample_contents)
    
    # Generate sources based on uploaded files
    sources = []
    if uploaded_files:
        for i, file_info in enumerate(uploaded_files[:top_k]):
            sources.append({
                "filename": file_info["filename"],
                "content": f"Relevant excerpt from {file_info['filename']} discussing aspects related to {query}. This document contains valuable insights about the topic with technical details and analysis.",
                "page": random.randint(1, file_info.get("pages", 10)),
                "score": round(0.9 - (i * 0.1), 2),
                "file_id": file_info["id"],
                "size_mb": file_info.get("size_mb", 0)
            })
    else:
        # Demo sources if no files uploaded
        demo_files = [
            "Research_Paper_AI_2024.pdf",
            "Machine_Learning_Handbook.pdf",
            "Data_Science_Methodology.pdf"
        ]
        for i, filename in enumerate(demo_files[:top_k]):
            sources.append({
                "filename": filename,
                "content": f"Sample content from {filename} showing how the RAG pipeline retrieves relevant information. This demonstrates semantic search capabilities and context extraction.",
                "page": random.randint(1, 15),
                "score": round(0.85 - (i * 0.05), 2),
                "file_id": f"demo_{i+1}",
                "size_mb": round(random.uniform(2.5, 8.5), 1)
            })
    
    return {
        "answer": answer,
        "sources": sources,
        "query": query,
        "processing_time": round(random.uniform(0.8, 2.5), 2),
        "total_documents": len(uploaded_files),
        "sources_searched": len(sources),
        "timestamp": datetime.now().isoformat()
    }

@app.get("/documents")
async def list_documents():
    return {
        "total": len(uploaded_files),
        "processing_queue": len(processing_queue),
        "documents": uploaded_files,
        "queue": processing_queue
    }

@app.get("/stats")
async def get_stats():
    total_size = sum(f.get("size", 0) for f in uploaded_files)
    total_size_mb = total_size / (1024 * 1024)
    
    return {
        "documents": len(uploaded_files),
        "total_size_mb": round(total_size_mb, 2),
        "average_size_mb": round(total_size_mb / len(uploaded_files) if uploaded_files else 0, 2),
        "total_chunks": sum(f.get("chunks", 0) for f in uploaded_files),
        "processing_queue": len(processing_queue),
        "max_upload_size_mb": 100,
        "server_time": datetime.now().isoformat()
    }

@app.delete("/documents/{file_id}")
async def delete_document(file_id: str):
    global uploaded_files, processing_queue
    
    # Remove from uploaded files
    original_count = len(uploaded_files)
    uploaded_files = [f for f in uploaded_files if f.get("id") != file_id]
    
    # Remove from processing queue
    processing_queue = [f for f in processing_queue if f.get("id") != file_id]
    
    removed = original_count - len(uploaded_files)
    
    return {
        "success": True,
        "message": f"Removed {removed} document(s)",
        "file_id": file_id,
        "remaining_documents": len(uploaded_files)
    }

if __name__ == "__main__":
    print("\n" + "="*60)
    print("NeuroQuery RAG Pipeline API")
    print("="*60)
    print(f"Server starting on: http://localhost:8000")
    print(f"API Documentation: http://localhost:8000/docs")
    print(f"Max upload size: 100MB")
    print(f"Uploads directory: {os.path.abspath('uploads')}")
    print("="*60 + "\n")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )