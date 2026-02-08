import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Upload,
  Search,
  FileText,
  BarChart3,
  Users,
  Settings,
  Bell,
  HelpCircle,
  Zap,
  ChevronRight,
  Plus,
  Filter,
  Download,
  Share2,
  Star,
  TrendingUp,
  Cpu,
  Database,
  Cloud,
  Lock
} from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState({
    totalDocs: 124,
    queries: 543,
    accuracy: 98.7,
    activeUsers: 42
  });

  useEffect(() => {
    // Mock data
    setDocuments([
      { id: 1, name: 'Research Paper.pdf', size: '2.4 MB', uploaded: '2 hours ago', processed: true },
      { id: 2, name: 'Technical Documentation.pdf', size: '5.1 MB', uploaded: '1 day ago', processed: true },
      { id: 3, name: 'Meeting Notes.docx', size: '1.2 MB', uploaded: '3 days ago', processed: false },
      { id: 4, name: 'API Reference.pdf', size: '3.8 MB', uploaded: '1 week ago', processed: true },
    ]);
  }, []);

  const StatCard = ({ icon: Icon, title, value, change, color }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass-panel p-6 rounded-2xl"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <TrendingUp className="w-5 h-5 text-green-400" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
      <p className="text-dark-400 text-sm">{title}</p>
      <p className="text-green-400 text-xs mt-2">{change} increase</p>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <header className="glass-panel border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-primary-500/20 to-purple-600/20 rounded-lg">
                  <Brain className="w-6 h-6 text-primary-400" />
                </div>
                <h1 className="text-xl font-bold gradient-text">NeuroQuery Dashboard</h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-dark-800 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-dark-400" />
              </button>
              <button className="p-2 hover:bg-dark-800 rounded-lg transition-colors">
                <HelpCircle className="w-5 h-5 text-dark-400" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full" />
                <div>
                  <p className="text-sm font-semibold text-white">Alex Johnson</p>
                  <p className="text-xs text-dark-500">Admin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Welcome back, Alex!</h2>
              <p className="text-dark-400">Your RAG pipeline is running smoothly</p>
            </div>
            <button className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Query
            </button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatCard
            icon={FileText}
            title="Documents Processed"
            value={stats.totalDocs}
            change="+12.5%"
            color="bg-blue-500/20"
          />
          <StatCard
            icon={Search}
            title="Total Queries"
            value={stats.queries}
            change="+23.1%"
            color="bg-green-500/20"
          />
          <StatCard
            icon={Brain}
            title="Accuracy Rate"
            value={`${stats.accuracy}%`}
            change="+1.2%"
            color="bg-purple-500/20"
          />
          <StatCard
            icon={Users}
            title="Active Users"
            value={stats.activeUsers}
            change="+8.4%"
            color="bg-pink-500/20"
          />
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Pipeline Visualization */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-panel p-6 rounded-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">RAG Pipeline</h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-xs text-dark-400">Active</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {[
                  { step: 1, title: 'Document Ingestion', status: 'complete', icon: Upload },
                  { step: 2, title: 'Text Extraction', status: 'complete', icon: FileText },
                  { step: 3, title: 'Chunking', status: 'complete', icon: Database },
                  { step: 4, title: 'Embedding Generation', status: 'active', icon: Cpu },
                  { step: 5, title: 'Vector Storage', status: 'pending', icon: Cloud },
                  { step: 6, title: 'Query Processing', status: 'pending', icon: Search },
                ].map((item, index) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center gap-4"
                  >
                    <div className={`p-3 rounded-xl ${
                      item.status === 'complete' ? 'bg-green-500/20' :
                      item.status === 'active' ? 'bg-primary-500/20 animate-pulse' :
                      'bg-dark-800'
                    }`}>
                      <item.icon className={`w-5 h-5 ${
                        item.status === 'complete' ? 'text-green-400' :
                        item.status === 'active' ? 'text-primary-400' :
                        'text-dark-500'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-white">{item.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.status === 'complete' ? 'bg-green-500/20 text-green-400' :
                          item.status === 'active' ? 'bg-primary-500/20 text-primary-400' :
                          'bg-dark-800 text-dark-400'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="mt-2 h-1 bg-dark-800 rounded-full overflow-hidden">
                        <div className={`h-full ${
                          item.status === 'complete' ? 'w-full bg-green-500' :
                          item.status === 'active' ? 'w-2/3 bg-primary-500' :
                          'w-0'
                        } transition-all duration-500`} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recent Documents */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-panel p-6 rounded-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Recent Documents</h3>
                <button className="flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300">
                  View all
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {documents.map((doc, index) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl hover:bg-dark-800 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-dark-700 rounded-lg">
                          <FileText className="w-5 h-5 text-primary-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{doc.name}</h4>
                          <p className="text-sm text-dark-500">{doc.size} • {doc.uploaded}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {doc.processed ? (
                          <span className="flex items-center gap-1 text-xs text-green-400">
                            <div className="w-2 h-2 bg-green-400 rounded-full" />
                            Processed
                          </span>
                        ) : (
                          <span className="text-xs text-yellow-400">Processing...</span>
                        )}
                        <button className="p-2 hover:bg-dark-700 rounded-lg">
                          <Download className="w-4 h-4 text-dark-400" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-panel p-6 rounded-2xl"
            >
              <h3 className="text-xl font-semibold text-white mb-6">Quick Actions</h3>
              <div className="space-y-3">
                {[
                  { icon: Upload, label: 'Upload Document', color: 'bg-blue-500/20', text: 'text-blue-400' },
                  { icon: Search, label: 'New Query', color: 'bg-green-500/20', text: 'text-green-400' },
                  { icon: BarChart3, label: 'View Analytics', color: 'bg-purple-500/20', text: 'text-purple-400' },
                  { icon: Settings, label: 'Pipeline Settings', color: 'bg-pink-500/20', text: 'text-pink-400' },
                ].map((action, index) => (
                  <motion.button
                    key={action.label}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-3 p-3 bg-dark-800/50 rounded-xl hover:bg-dark-800 transition-all"
                  >
                    <div className={`p-2 rounded-lg ${action.color}`}>
                      <action.icon className={`w-5 h-5 ${action.text}`} />
                    </div>
                    <span className="text-white">{action.label}</span>
                    <ChevronRight className="w-4 h-4 ml-auto text-dark-500" />
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* System Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-panel p-6 rounded-2xl"
            >
              <h3 className="text-xl font-semibold text-white mb-6">System Status</h3>
              <div className="space-y-4">
                {[
                  { label: 'API Server', status: 'online', value: '100%', color: 'bg-green-500' },
                  { label: 'Vector DB', status: 'online', value: '95%', color: 'bg-green-500' },
                  { label: 'Embedding Service', status: 'online', value: '89%', color: 'bg-yellow-500' },
                  { label: 'Query Engine', status: 'online', value: '100%', color: 'bg-green-500' },
                ].map((item) => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-dark-400">{item.label}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.status === 'online' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.color} transition-all duration-500`}
                        style={{ width: item.value }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-dark-500">
                      <span>Load</span>
                      <span>{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Security Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-panel p-6 rounded-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Lock className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Security Status</h4>
                  <p className="text-sm text-dark-500">All systems secure</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-dark-400">Encryption</span>
                  <span className="text-xs text-green-400">AES-256</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-dark-400">Last Scan</span>
                  <span className="text-xs text-dark-400">2 minutes ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-dark-400">Threats</span>
                  <span className="text-xs text-green-400">0 detected</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 p-4 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full shadow-2xl shadow-primary-500/25"
      >
        <Zap className="w-6 h-6 text-white" />
      </motion.button>
    </div>
  );
};

export default Dashboard;