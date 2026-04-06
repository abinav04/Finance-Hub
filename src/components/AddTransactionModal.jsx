import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../data';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AddTransactionModal({ onClose, onAdd }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    merchant: '',
    amount: '',
    category: CATEGORIES[0],
    type: 'expense'
  });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.merchant || !formData.amount) return;
    
    onAdd({
      ...formData,
      amount: parseFloat(formData.amount)
    });
  };

  return (
    <div className="modal-overlay">
      <motion.div 
        className="modal-content"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Add New Transaction</h2>
          <button 
            type="button"
            onClick={onClose} 
            className="btn-icon" 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', padding: 0 }} 
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Type</label>
            <div className="toggle-group">
              <button
                type="button"
                onClick={() => handleChange({ target: { name: 'type', value: 'expense' } })}
                className={`toggle-btn ${formData.type === 'expense' ? 'active-expense' : ''}`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => handleChange({ target: { name: 'type', value: 'income' } })}
                className={`toggle-btn ${formData.type === 'income' ? 'active-income' : ''}`}
              >
                Income
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Date</label>
            <input 
              type="date" 
              name="date" 
              className="form-control" 
              value={formData.date} 
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Merchant / Description</label>
            <input 
              type="text" 
              name="merchant" 
              className="form-control" 
              placeholder="e.g. Amazon, Salary" 
              value={formData.merchant} 
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Amount ($)</label>
            <input 
              type="number" 
              name="amount" 
              className="form-control" 
              placeholder="0.00" 
              step="0.01"
              min="0.01"
              value={formData.amount} 
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <div className="category-group">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleChange({ target: { name: 'category', value: cat } })}
                  className={`category-chip ${formData.category === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between mt-8 gap-4">
            <button type="button" className="btn" onClick={onClose} style={{ flex: 1, border: '1px solid var(--border-color)' }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              Add Transaction
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
