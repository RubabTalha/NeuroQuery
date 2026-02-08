import React, { useState } from 'react';
import { queryRAG } from '../services/api';
import '../styles/Dashboard.css';

const RAGPipeline = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  const pipelineSteps = [
    {
      icon: '🗄️',
      label: 'Document Processing',
      description: 'Extracting text and creating chunks'
    },
    {
      icon: '🧠',
      label: 'Embedding Generation',
      description: 'Creating vector embeddings'
    },
    {
      icon: '🔍',
      label: 'Vector Search',
      description: 'Finding similar documents'
    },
    {
      icon: '🤖',
      label: 'Response Generation',
      description: 'Generating AI-powered answer'
    }
  ];

  const simulatePipeline = async () => {
    for (let i = 0; i < pipelineSteps.length; i++) {
      setActiveStep(i);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const handleQuery = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      alert('Please enter a query');
      return;
    }

    setLoading(true);
    setResult(null);
    setActiveStep(0);

    try {
      simulatePipeline();
      
      const response = await queryRAG(query);
      setResult(response);
      
      setActiveStep(pipelineSteps.length - 1);
      alert('Query processed successfully!');
    } catch (error) {
      alert('Query failed: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rag-pipeline-container">
      <div className="query-section">
        <div className="card">
          <h2 style={{ marginBottom: '24px' }}>Ask NeuroQuery</h2>
          
          <form onSubmit={handleQuery}>
            <div className="query-input-container">
              <textarea
                className="query-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask a question about your uploaded documents..."
                disabled={loading}
                rows={4}
              />
              <button
                type="submit"
                className="btn-primary query-button"
                disabled={loading || !query.trim()}
              >
                {loading ? (
                  <div className="loading-spinner" style={{ width: '20px', height: '20px' }} />
                ) : (
                  'Ask'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Pipeline Visualization */}
      <div className="pipeline-section">
        <h2 className="pipeline-title">RAG Pipeline Visualization</h2>
        
        <div className="pipeline-steps">
          {pipelineSteps.map((step, index) => (
            <div key={index} className="pipeline-step">
              <div className={`step-circle ${index <= activeStep ? 'active' : ''}`}>
                {step.icon}
              </div>
              <div className="step-label">{step.label}</div>
              <div className="step-description">{step.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="results-section">
          <div className="results-card card">
            <div className="answer-section">
              <div className="answer-header">
                <span style={{ color: 'var(--primary-pink)', fontSize: '1.5rem' }}>🤖</span>
                <h3 className="answer-title">AI Response</h3>
              </div>
              <div className="answer-content">
                {result.answer}
              </div>
            </div>

            {result.sources && result.sources.length > 0 && (
              <div className="sources-section">
                <h3 className="sources-title">Retrieved Sources</h3>
                {result.sources.map((source, index) => (
                  <div key={index} className="source-item">
                    <span className="source-index">{index + 1}</span>
                    <div className="source-text">
                      {source.length > 300 ? source.substring(0, 300) + '...' : source}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Explanation Card */}
      <div className="card mt-8">
        <h3 style={{ marginBottom: '16px' }}>How NeuroQuery RAG Works</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <div style={{ padding: '16px', background: 'var(--darker-bg)', borderRadius: '12px' }}>
            <h4 style={{ color: 'var(--primary-pink)', marginBottom: '8px' }}>1. Document Processing</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              PDFs are parsed and split into manageable chunks for better context understanding.
            </p>
          </div>
          <div style={{ padding: '16px', background: 'var(--darker-bg)', borderRadius: '12px' }}>
            <h4 style={{ color: 'var(--primary-pink)', marginBottom: '8px' }}>2. Vector Embeddings</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Text chunks are converted into numerical vectors using transformer models.
            </p>
          </div>
          <div style={{ padding: '16px', background: 'var(--darker-bg)', borderRadius: '12px' }}>
            <h4 style={{ color: 'var(--primary-pink)', marginBottom: '8px' }}>3. Semantic Search</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Queries find similar content using cosine similarity in vector space.
            </p>
          </div>
          <div style={{ padding: '16px', background: 'var(--darker-bg)', borderRadius: '12px' }}>
            <h4 style={{ color: 'var(--primary-pink)', marginBottom: '8px' }}>4. Response Generation</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Retrieved context is used to generate accurate, document-grounded responses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RAGPipeline;