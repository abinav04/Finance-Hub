import React, { useState, useMemo } from 'react';
import { Search, Filter, Trash2 } from 'lucide-react';

export default function TransactionsList({ transactions, role, onDelete }) {
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
            <div className="input-group" style={{ padding: '4px 8px' }}>
              <Filter size={16} color="var(--text-tertiary)" />
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)' }}
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            
            <div className="input-group" style={{ padding: '4px 8px' }}>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)' }}
              >
                <option value="date">Sort by Date</option>
                <option value="amount">Sort by Amount</option>
              </select>
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
                {role === 'admin' && <th style={{ width: '50px', textAlign: 'center' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredAndSorted.length > 0 ? (
                filteredAndSorted.map(tx => (
                  <tr key={tx.id}>
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
                    {role === 'admin' && (
                      <td style={{ textAlign: 'center' }}>
                        <button 
                          className="btn-icon" 
                          style={{ color: 'var(--danger)', padding: '6px' }}
                          onClick={() => onDelete(tx.id)}
                          title="Delete Transaction"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    )}
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
