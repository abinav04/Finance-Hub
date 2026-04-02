import React, { useState, useMemo } from 'react';
import { Search, Filter, Trash2, Edit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Dropdown from './Dropdown';

export default function TransactionsList({ transactions, role, onDelete, onEdit, onView }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const filteredAndSorted = useMemo(() => {
    let result = [...transactions];

    // Filter by Search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(t => 
        t.merchant.toLowerCase().includes(lowerSearch) || 
        t.category.toLowerCase().includes(lowerSearch)
      );
    }

    // Filter by Type
    if (filterType !== 'all') {
      result = result.filter(t => t.type === filterType);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'amount') return b.amount - a.amount;
      return 0;
    });

    return result;
  }, [transactions, searchTerm, filterType, sortBy]);

  return (
    <div className="glass-panel" style={{ height: 'calc(100vh - 260px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="flex flex-col gap-6" style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '16px' }}>
          <div className="input-group" style={{ maxWidth: '300px', flex: 1 }}>
            <Search size={18} color="var(--text-tertiary)" />
            <input 
              type="text" 
              placeholder="Search merchants or categories..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4 items-center">
            <div className="input-group" style={{ padding: '2px 8px' }}>
              <Filter size={16} color="var(--text-tertiary)" />
              <Dropdown 
                value={filterType} 
                onChange={setFilterType}
                options={[
                  { value: 'all', label: 'All Types' },
                  { value: 'income', label: 'Income' },
                  { value: 'expense', label: 'Expense' }
                ]}
              />
            </div>
            
            <div className="input-group" style={{ padding: '2px 8px' }}>
              <Dropdown 
                value={sortBy} 
                onChange={setSortBy}
                options={[
                  { value: 'date', label: 'Sort by Date' },
                  { value: 'amount', label: 'Sort by Amount' }
                ]}
              />
            </div>
          </div>
        </div>

        <div className="table-container" style={{ flex: 1, overflowY: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Merchant</th>
                <th>Category</th>
                <th>Type</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
                <AnimatePresence>
                  {role === 'admin' && (
                    <motion.th 
                      initial={{ opacity: 0, paddingLeft: 0, paddingRight: 0, width: 0 }}
                      animate={{ opacity: 1, paddingLeft: 24, paddingRight: 24, width: 80 }}
                      exit={{ opacity: 0, paddingLeft: 0, paddingRight: 0, width: 0 }}
                      style={{ textAlign: 'center', overflow: 'hidden', whiteSpace: 'nowrap' }}
                    >
                      Actions
                    </motion.th>
                  )}
                </AnimatePresence>
              </tr>
            </thead>
            <tbody>
              {filteredAndSorted.length > 0 ? (
                filteredAndSorted.map(tx => (
                  <tr 
                    key={tx.id} 
                    onClick={() => onView(tx)} 
                    style={{ cursor: 'pointer' }}
                    className="hoverable-row"
                  >
                    <td>{new Date(tx.date).toLocaleDateString()}</td>
                    <td style={{ fontWeight: 500 }}>{tx.merchant}</td>
                    <td>{tx.category}</td>
                    <td>
                      <span className={`badge ${tx.type}`}>
                        {tx.type === 'income' ? 'Income' : 'Expense'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }} className={`tx-amount ${tx.type}`}>
                      {tx.type === 'income' ? '+' : '-'}${Number(tx.amount).toFixed(2)}
                    </td>
                    <AnimatePresence>
                      {role === 'admin' && (
                        <motion.td 
                          initial={{ opacity: 0, paddingLeft: 0, paddingRight: 0, width: 0 }}
                          animate={{ opacity: 1, paddingLeft: 24, paddingRight: 24, width: 80 }}
                          exit={{ opacity: 0, paddingLeft: 0, paddingRight: 0, width: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 28 }}
                          style={{ textAlign: 'center', overflow: 'hidden', padding: 0 }}
                        >
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <motion.button 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              transition={{ delay: 0.1 }}
                              className="btn-icon" 
                              style={{ color: 'var(--accent-primary)', padding: '6px', display: 'flex' }}
                              onClick={(e) => { e.stopPropagation(); onEdit(tx); }}
                              title="Edit Transaction"
                            >
                              <Edit size={16} />
                            </motion.button>
                            <motion.button 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              transition={{ delay: 0.1 }}
                              className="btn-icon" 
                              style={{ color: 'var(--danger)', padding: '6px', display: 'flex' }}
                              onClick={(e) => { e.stopPropagation(); onDelete(tx.id); }}
                              title="Delete Transaction"
                            >
                              <Trash2 size={16} />
                            </motion.button>
                          </div>
                        </motion.td>
                      )}
                    </AnimatePresence>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={role === 'admin' ? 6 : 5} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-tertiary)' }}>
                    No transactions found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
