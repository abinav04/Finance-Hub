import React, { useState, useEffect, useMemo } from 'react';
import { initialTransactions } from './data';
import DashboardOverview from './components/DashboardOverview';
import TransactionsList from './components/TransactionsList';
import InsightsPanel from './components/InsightsPanel';
import AddTransactionModal from './components/AddTransactionModal';
import SplashLoader from './components/SplashLoader';
import ThemeToggle from './components/ThemeToggle';
import RoleSelector from './components/RoleSelector';
import SkeletonLoader from './components/SkeletonLoader';
import Logo from './components/Logo';
import { Moon, Sun, LayoutDashboard, List, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';

function App() {
  const [theme, setTheme] = useState('light');
  const [role, setRole] = useState('viewer'); // 'viewer' or 'admin'
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, transactions, insights
  const [loadingPage, setLoadingPage] = useState('Finance Hub');
  const [isTabSwapping, setIsTabSwapping] = useState(false);
  
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
    
    setActiveTab(tabId);
    setLoadingPage(pageMap[tabId]);
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
          onComplete={() => {
            setLoadingPage(null);
            setIsTabSwapping(true);
            setTimeout(() => setIsTabSwapping(false), 1000);
          }} 
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
            <div 
              onClick={() => handleTabChange('dashboard')} 
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
              title="Go to Overview"
            >
              <Logo size={32} />
              <h1 style={{ lineHeight: 1 }}>Finance Hub</h1>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
              Welcome back. Here is your financial overview.
            </p>
          </div>
          
          <div className="header-actions">
            <RoleSelector role={role} setRole={setRole} />
            
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            
            <AnimatePresence>
              {role === 'admin' && (
                <motion.button 
                  initial={{ opacity: 0, scale: 0.8, x: -10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: -10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="btn btn-primary"
                  onClick={() => setIsModalOpen(true)}
                >
                  + Add Transaction
                </motion.button>
              )}
            </AnimatePresence>
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
          {isTabSwapping ? (
            <motion.div
              key={`skeleton-${activeTab}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
            >
              <SkeletonLoader type={activeTab} />
            </motion.div>
          ) : (
            <>
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
            </>
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
