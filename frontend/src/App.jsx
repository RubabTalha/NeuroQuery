import React, { useState } from 'react'

const App = () => {
  const [screen, setScreen] = useState('splash')
  const [loading, setLoading] = useState(false)
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Research Paper.pdf', size: '2.4 MB', date: '2 hours ago' },
    { id: 2, name: 'Technical Docs.pdf', size: '5.1 MB', date: '1 day ago' },
  ])
  const [query, setQuery] = useState('')
  const [result, setResult] = useState(null)
  const [activeStep, setActiveStep] = useState(0)

  const SplashScreen = () => (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '40px',
        borderRadius: '24px',
        maxWidth: '800px',
        width: '100%',
        marginBottom: '40px'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🧠</div>
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: '800',
          marginBottom: '20px',
          background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          NeuroQuery
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: '#94a3b8',
          marginBottom: '40px'
        }}>
          Advanced RAG Pipeline Demonstration with Professional UI
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          margin: '40px 0'
        }}>
          {[
            { icon: '🤖', title: 'AI-Powered RAG', desc: 'Advanced document understanding' },
            { icon: '⚡', title: 'Real-time Processing', desc: 'Millisecond response times' },
            { icon: '🔒', title: 'Enterprise Security', desc: 'End-to-end encryption' },
            { icon: '📊', title: 'Smart Analytics', desc: 'Comprehensive insights' },
          ].map((feature, index) => (
            <div key={index} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '20px',
              borderRadius: '16px',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>{feature.icon}</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '10px' }}>{feature.title}</h3>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{feature.desc}</p>
            </div>
          ))}
        </div>

        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          marginTop: '40px',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={() => setScreen('login')}
            style={{
              background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Get Started
          </button>
          <button 
            onClick={() => setScreen('dashboard')}
            style={{
              background: 'transparent',
              color: '#f8fafc',
              border: '2px solid #ec4899',
              padding: '15px 30px',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            View Demo
          </button>
        </div>
      </div>
    </div>
  )

  const LoginScreen = () => (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '40px',
        borderRadius: '24px',
        maxWidth: '400px',
        width: '100%'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '15px' }}>🔐</div>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Welcome Back
          </h2>
          <p style={{ color: '#94a3b8', marginTop: '10px' }}>Sign in to your dashboard</p>
        </div>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Email Address
            </label>
            <input 
              type="email"
              placeholder="Enter your email"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(30, 41, 59, 0.5)',
                border: '2px solid #334155',
                borderRadius: '12px',
                color: '#f8fafc',
                fontSize: '1rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Password
            </label>
            <input 
              type="password"
              placeholder="Enter your password"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(30, 41, 59, 0.5)',
                border: '2px solid #334155',
                borderRadius: '12px',
                color: '#f8fafc',
                fontSize: '1rem'
              }}
            />
          </div>

          <button 
            type="button"
            onClick={() => setScreen('dashboard')}
            style={{
              background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Sign In
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button 
            onClick={() => setScreen('splash')}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer'
            }}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  )

  const DashboardScreen = () => {
    const handleQuery = (e) => {
      e.preventDefault()
      setLoading(true)
      
      // Simulate pipeline steps
      const simulatePipeline = async () => {
        for (let i = 1; i <= 5; i++) {
          setActiveStep(i)
          await new Promise(resolve => setTimeout(resolve, 300))
        }
        
        // Show result
        setResult({
          answer: `Based on your documents, here's what I found about "${query}":\n\nRetrieval-Augmented Generation (RAG) combines information retrieval with language models to provide accurate, context-aware responses. This pipeline demonstrates document processing, embedding generation, and semantic search capabilities.`,
          sources: [
            "Document 1: RAG architecture overview and implementation details...",
            "Document 2: Vector embeddings and similarity search techniques...",
            "Document 3: Context-aware response generation best practices..."
          ]
        })
        
        setLoading(false)
      }
      
      simulatePipeline()
    }

    const handleFileUpload = (e) => {
      const file = e.target.files[0]
      if (!file) return
      
      alert(`File "${file.name}" uploaded successfully! Processing PDF...`)
      
      // Simulate processing
      setTimeout(() => {
        setDocuments(prev => [...prev, {
          id: prev.length + 1,
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          date: 'Just now'
        }])
      }, 1500)
    }

    const pipelineSteps = [
      { step: 1, title: 'Upload', icon: '📤' },
      { step: 2, title: 'Process', icon: '⚙️' },
      { step: 3, title: 'Embed', icon: '🧠' },
      { step: 4, title: 'Query', icon: '🔍' },
      { step: 5, title: 'Generate', icon: '🤖' },
    ]

    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)'
      }}>
        {/* Navbar */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '20px'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ fontSize: '1.5rem' }}>🧠</div>
              <h1 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                NeuroQuery Dashboard
              </h1>
            </div>
            <button 
              onClick={() => setScreen('splash')}
              style={{
                background: 'transparent',
                color: '#f8fafc',
                border: '2px solid #ec4899',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>RAG Pipeline Dashboard</h2>
          <p style={{ color: '#94a3b8', marginBottom: '40px' }}>
            Upload PDF documents and query them using our advanced Retrieval-Augmented Generation pipeline
          </p>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}>
            {[
              { title: 'Documents', value: documents.length, icon: '📄' },
              { title: 'Storage', value: '2.4 GB', icon: '💾' },
              { title: 'Queries', value: result ? '1' : '0', icon: '🔍' },
              { title: 'Accuracy', value: '98.7%', icon: '🎯' },
            ].map((stat, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '20px',
                borderRadius: '16px'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{stat.icon}</div>
                <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '5px' }}>{stat.value}</div>
                <div style={{ color: '#94a3b8' }}>{stat.title}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
            {/* Left Column */}
            <div>
              {/* File Upload */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '30px',
                marginBottom: '30px'
              }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Upload Documents</h3>
                <div style={{
                  border: '2px dashed #334155',
                  borderRadius: '16px',
                  padding: '40px',
                  textAlign: 'center',
                  marginBottom: '20px'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📤</div>
                  <p style={{ marginBottom: '20px' }}>Drag & drop PDF files or click to browse</p>
                  <input
                    type="file"
                    id="file-upload"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="file-upload" style={{
                    background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'inline-block'
                  }}>
                    Choose File
                  </label>
                </div>

                {/* Documents List */}
                {documents.length > 0 && (
                  <div>
                    <h4 style={{ fontWeight: '600', marginBottom: '15px' }}>Uploaded Documents</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {documents.map((doc) => (
                        <div key={doc.id} style={{
                          background: 'rgba(30, 41, 59, 0.3)',
                          padding: '15px',
                          borderRadius: '12px',
                          border: '1px solid #334155'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ fontSize: '1.5rem' }}>📄</div>
                              <div>
                                <div style={{ fontWeight: '600' }}>{doc.name}</div>
                                <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                                  {doc.size} • {doc.date}
                                </div>
                              </div>
                            </div>
                            <div style={{
                              fontSize: '0.8rem',
                              background: 'rgba(34, 197, 94, 0.2)',
                              color: '#4ade80',
                              padding: '4px 8px',
                              borderRadius: '20px'
                            }}>
                              Processed
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Query Section */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '30px'
              }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Ask NeuroQuery</h3>
                <form onSubmit={handleQuery}>
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{
                      width: '100%',
                      minHeight: '120px',
                      padding: '15px',
                      background: 'rgba(30, 41, 59, 0.5)',
                      border: '2px solid #334155',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '1rem',
                      marginBottom: '20px',
                      resize: 'vertical'
                    }}
                    placeholder="Ask a question about your uploaded documents..."
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !query.trim()}
                    style={{
                      background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '15px',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      width: '100%',
                      opacity: (loading || !query.trim()) ? 0.5 : 1
                    }}
                  >
                    {loading ? 'Processing...' : 'Ask Question'}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column */}
            <div>
              {/* RAG Pipeline Visualization */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '30px',
                marginBottom: '30px'
              }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '30px' }}>RAG Pipeline Flow</h3>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  position: 'relative',
                  marginBottom: '40px'
                }}>
                  {pipelineSteps.map((step) => (
                    <div key={step.step} style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
                      <div style={{
                        width: '60px',
                        height: '60px',
                        background: activeStep >= step.step ? '#ec4899' : '#1e293b',
                        border: '2px solid #ec4899',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 15px',
                        fontSize: '1.5rem'
                      }}>
                        {step.icon}
                      </div>
                      <div style={{ fontWeight: '600' }}>{step.title}</div>
                      <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Step {step.step}</div>
                    </div>
                  ))}
                  <div style={{
                    position: 'absolute',
                    top: '30px',
                    left: '50px',
                    right: '50px',
                    height: '2px',
                    background: 'linear-gradient(90deg, #ec4899, #8b5cf6)',
                    zIndex: 1
                  }} />
                </div>

                {/* Results */}
                {result && (
                  <div>
                    <h4 style={{ fontWeight: '600', marginBottom: '15px' }}>AI Response</h4>
                    <div style={{
                      background: 'rgba(30, 41, 59, 0.5)',
                      padding: '20px',
                      borderRadius: '12px',
                      marginBottom: '20px'
                    }}>
                      <p style={{ whiteSpace: 'pre-line' }}>{result.answer}</p>
                    </div>

                    <h4 style={{ fontWeight: '600', marginBottom: '15px' }}>Sources</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {result.sources.map((source, index) => (
                        <div key={index} style={{
                          background: 'rgba(30, 41, 59, 0.3)',
                          padding: '15px',
                          borderRadius: '12px',
                          border: '1px solid #334155'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'start', gap: '10px' }}>
                            <div style={{
                              width: '24px',
                              height: '24px',
                              background: '#ec4899',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.9rem',
                              flexShrink: 0
                            }}>
                              {index + 1}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
                              {source}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  switch(screen) {
    case 'login':
      return <LoginScreen />
    case 'dashboard':
      return <DashboardScreen />
    case 'splash':
    default:
      return <SplashScreen />
  }
}

export default App