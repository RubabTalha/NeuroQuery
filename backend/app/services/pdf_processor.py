import PyPDF2
import os
from typing import List, Tuple, Optional
import tempfile
import shutil
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
import logging

logger = logging.getLogger(__name__)

class PDFProcessor:
    """Service for processing PDF files."""
    
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 200):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            length_function=len,
            separators=["\n\n", "\n", " ", ""]
        )
    
    def extract_text_from_pdf(self, file_path: str) -> Tuple[str, int]:
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
    
    def chunk_text(self, text: str, filename: str, file_id: str, page_count: int) -> List[Document]:
        """Split text into chunks."""
        try:
            # Create LangChain documents
            docs = self.text_splitter.create_documents([text])
            
            # Add metadata to each chunk
            for i, doc in enumerate(docs):
                doc.metadata.update({
                    "source": filename,
                    "file_id": file_id,
                    "chunk_index": i,
                    "total_chunks": len(docs),
                    "page_count": page_count
                })
            
            logger.info(f"Created {len(docs)} chunks from text")
            return docs
            
        except Exception as e:
            logger.error(f"Error chunking text: {e}")
            raise
    
    def process_pdf(self, file_path: str, filename: str, file_id: str) -> Tuple[List[Document], int]:
        """Process PDF file and return chunks."""
        try:
            # Extract text
            text, page_count = self.extract_text_from_pdf(file_path)
            
            # Chunk text
            chunks = self.chunk_text(text, filename, file_id, page_count)
            
            return chunks, page_count
            
        except Exception as e:
            logger.error(f"Error processing PDF {filename}: {e}")
            raise