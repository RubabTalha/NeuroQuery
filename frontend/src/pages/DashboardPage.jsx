import React from 'react';
import Navbar from '../components/Navbar';
import FileUpload from '../components/FileUpload';
import RAGPipeline from '../components/RAGPipeline';
import '../styles/Dashboard.css';

const DashboardPage = () => {
  const handleUploadSuccess = (documentId) => {
    console.log('Document uploaded successfully:', documentId);
    // You could trigger a refresh of documents list here
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">RAG Pipeline Dashboard</h1>
          <p className="dashboard-subtitle">
            Upload PDF documents and query them using our advanced Retrieval-Augmented Generation pipeline
          </p>
        </div>

        <div className="dashboard-grid">
          <div className="upload-section">
            <FileUpload onUploadSuccess={handleUploadSuccess} />
            
            {/* Stats Card */}
            <div className="card mt-8">
              <h3 style={{ marginBottom: '16px' }}>Pipeline Statistics</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary-pink)' }}>4</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Pipeline Steps</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary-pink)' }}>1000</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Chunk Size</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary-pink)' }}>384d</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Embeddings</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary-pink)' }}>3</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Top Results</div>
                </div>
              </div>
            </div>
          </div>

          <div className="query-section">
            <RAGPipeline />
          </div>
        </div>

        {/* Quick Tips */}
        <div className="card mt-8">
          <h3 style={{ marginBottom: '16px' }}>💡 Quick Tips for Recruiters</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div>
              <h4 style={{ color: 'var(--primary-pink)', marginBottom: '8px' }}>What to Demonstrate</h4>
              <ul style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                <li>Upload any PDF (resume, research paper, article)</li>
                <li>Ask specific questions about the content</li>
                <li>Show how context is retrieved and used</li>
                <li>Explain the pipeline steps in the visualization</li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: 'var(--primary-pink)', marginBottom: '8px' }}>Technical Highlights</h4>
              <ul style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                <li>Full-stack React + FastAPI architecture</li>
                <li>Vector embeddings with HuggingFace models</li>
                <li>ChromaDB for vector storage</li>
                <li>LangChain integration</li>
                <li>JWT authentication</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;