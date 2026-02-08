import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const features = [
    { icon: '🧠', title: 'AI-Powered RAG', desc: 'Advanced document understanding' },
    { icon: '⚡', title: 'Real-time Processing', desc: 'Millisecond response times' },
    { icon: '🔒', title: 'Enterprise Security', desc: 'End-to-end encryption' },
    { icon: '📊', title: 'Smart Analytics', desc: 'Comprehensive insights' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:14px_24px]" />

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="text-center max-w-6xl mx-auto">
          {/* Logo */}
          <div className="mb-12">
            <div className="inline-block mb-8">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl blur-2xl opacity-30" />
                <div className="relative bg-gray-900/80 backdrop-blur-xl p-8 rounded-3xl border border-white/10">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="p-3 bg-gradient-to-br from-pink-500/30 to-purple-600/30 rounded-2xl">
                      <span className="text-3xl">🧠</span>
                    </div>
                    <h1 className="text-5xl font-black bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                      NeuroQuery
                    </h1>
                  </div>
                  <p className="text-gray-400 text-lg">
                    Advanced RAG Pipeline Platform
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero */}
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Transform Documents into </span>
              <span className="bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
                Intelligent Insights
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Professional Retrieval-Augmented Generation platform showcasing cutting-edge AI with beautiful design.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:border-pink-500/30 transition-all hover:scale-105"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-pink-500/25 active:scale-95 transition-all duration-200"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-gray-900 border border-gray-700 text-white font-semibold rounded-xl hover:bg-gray-800 active:scale-95 transition-all duration-200"
            >
              View Demo
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="mb-12">
              <div className="max-w-md mx-auto">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Initializing RAG Pipeline...</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tech */}
          <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-3xl border border-white/10 max-w-2xl mx-auto">
            <p className="text-gray-400 mb-4">Powered by:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['React', 'FastAPI', 'LangChain', 'ChromaDB'].map((tech) => (
                <span key={tech} className="px-3 py-1 bg-gray-800/50 rounded-lg text-gray-300">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;