// Mock API service for demonstration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Mock upload document
export const uploadDocument = async (formData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          id: Math.floor(Math.random() * 1000),
          filename: formData.get('file')?.name || 'document.pdf',
          size: '2.4 MB',
          uploadedAt: new Date().toISOString(),
          status: 'processed'
        }
      });
    }, 1500);
  });
};

// Mock query RAG
export const queryRAG = async (question) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          answer: `Based on the documents you've uploaded, here's what I found about "${question}":\n\nRetrieval-Augmented Generation (RAG) combines information retrieval with language models to provide accurate, context-aware responses. This implementation demonstrates document processing, embedding generation, and semantic search capabilities.`,
          sources: [
            "Document 1: RAG architecture overview and implementation details...",
            "Document 2: Vector embeddings and similarity search techniques...",
            "Document 3: Context-aware response generation best practices..."
          ],
          confidence: 0.92,
          processingTime: 1.2
        }
      });
    }, 2000);
  });
};

// Mock get documents
export const getDocuments = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: [
          { id: 1, name: 'Research Paper.pdf', size: '2.4 MB', uploaded: '2 hours ago', status: 'processed' },
          { id: 2, name: 'Technical Docs.pdf', size: '5.1 MB', uploaded: '1 day ago', status: 'processed' },
          { id: 3, name: 'API Reference.pdf', size: '3.8 MB', uploaded: '1 week ago', status: 'processed' },
        ]
      });
    }, 1000);
  });
};

// Mock get stats
export const getStats = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          totalDocuments: 124,
          totalQueries: 543,
          accuracyRate: 98.7,
          activeUsers: 42,
          storageUsed: '2.4 GB',
          uptime: '99.9%'
        }
      });
    }, 800);
  });
};

export default {
  uploadDocument,
  queryRAG,
  getDocuments,
  getStats
};