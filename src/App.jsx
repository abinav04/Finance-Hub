import React, { useState, useEffect, useMemo } from 'react';
import { initialTransactions } from './data';
import DashboardOverview from './components/DashboardOverview';
import TransactionsList from './components/TransactionsList';
import InsightsPanel from './components/InsightsPanel';
import AddTransactionModal from './components/AddTransactionModal';
import SplashLoader from './components/SplashLoader';
import { Moon, Sun, LayoutDashboard, List, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';

function App() {
  const [theme, setTheme] = useState('light');
  const [role, setRole] = useState('viewer'); // 'viewer' or 'admin'
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, transactions, insights
  const [loadingPage, setLoadingPage] = useState('Finance Hub');
  
  // State: Transactions
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('finance-data');
    if (saved) return JSON.parse(saved);
    return initialTransactions;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('finance-data', JSON.stringify(transactions));
  }, [transactions]);

  // Handle Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleTabChange = (tabId) => {
    if (tabId === activeTab) return;
    
    const pageMap = {
      dashboard: 'Overview Dashboard',
      transactions: 'Transactions Registry',
      insights: 'Smart Insights'
    };
    
    setLoadingPage(pageMap[tabId]);
    setTimeout(() => setActiveTab(tabId), 10);
  };

  const handleAddTransaction = (newTx) => {
    if (newTx.amount <= 0) {
      toast.error('Rejected: Invalid amount');
      return;
    }
    setTransactions(prev => [{ ...newTx, id: Date.now() }, ...prev]);
    setIsModalOpen(false);
    toast.success('Transaction added successfully!');
  };

  const handleDeleteTransaction = (id) => {
    if (role === 'admin') {
      setTransactions(prev => prev.filter(tx => tx.id !== id));
      toast.success('Transaction removed!');
    } else {
      toast.error('Rejected: Admin privileges required');
    }
  };

  return (
    <AnimatePresence mode="wait">
      {loadingPage ? (
        <SplashLoader 
          key="loader" 
          pageName={loadingPage}
          durationMs={loadingPage === 'Finance Hub' ? 2500 : 800} 
          onComplete={() => setLoadingPage(null)} 
        />
      ) : (
        <motion.div 
          key="app-core"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="app-container"
          style={{ width: '100vw' }}
        >
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '2px solid var(--text-primary)',
            boxShadow: '0 4px 0 0 var(--text-primary)',
            borderRadius: 'var(--radius-lg)',
            fontWeight: '600',
            padding: '16px 24px',
            minHeight: '64px',
            fontSize: '15px'
          }
        }} 
      />
      {/* Sidebar can be added here if needed, but keeping it top-nav for simplicity */}
      <main className="main-content">
        <header className="header">
          <div>
            <h1>Finance Hub</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
              Welcome back. Here is your financial overview.
            </p>
          </div>
          
          <div className="header-actions">
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="role-selector"
            >
              <option value="viewer">👁️ Viewer</option>
              <option value="admin">⚙️ Admin</option>
            </select>
            
            <button onClick={toggleTheme} className="btn-icon" title="Toggle Theme">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            
            {role === 'admin' && (
              <button 
                className="btn btn-primary"
                onClick={() => setIsModalOpen(true)}
              >
                + Add Transaction
              </button>
            )}
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="tabs-container">
          <button 
            className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-icon'}`}
            onClick={() => handleTabChange('dashboard')}
          >
            <LayoutDashboard size={18} /> Overview
          </button>
          <button 
            className={`btn ${activeTab === 'transactions' ? 'btn-primary' : 'btn-icon'}`}
            onClick={() => handleTabChange('transactions')}
          >
            <List size={18} /> Transactions
          </button>
          <button 
            className={`btn ${activeTab === 'insights' ? 'btn-primary' : 'btn-icon'}`}
            onClick={() => handleTabChange('insights')}
          >
            <Lightbulb size={18} /> Insights
          </button>
        </div>

        {/* Main Content Area */}
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
            >
              <DashboardOverview transactions={transactions} />
            </motion.div>
          )}
          {activeTab === 'transactions' && (
            <motion.div
              key="transactions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
            >
              <TransactionsList 
                transactions={transactions} 
                role={role} 
                onDelete={handleDeleteTransaction}
              />
            </motion.div>
          )}
          {activeTab === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
            >
              <InsightsPanel transactions={transactions} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Add Transaction Modal */}
      {isModalOpen && (
        <AddTransactionModal 
          onClose={() => setIsModalOpen(false)} 
          onAdd={handleAddTransaction} 
        />
      )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;
