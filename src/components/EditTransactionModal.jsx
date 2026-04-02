import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../data';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EditTransactionModal({ transaction, onClose, onEdit }) {
  const [formData, setFormData] = useState({
    date: '',
    merchant: '',
    amount: '',
    category: '',
    type: 'expense'
  });

  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (transaction) {
      setFormData({
        ...transaction,
        date: transaction.date.split('T')[0]
      });
    }
  }, [transaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.merchant || !formData.amount) return;
    setShowConfirm(true);
  };

  const handleConfirmSave = () => {
    onEdit({
      ...formData,
      amount: parseFloat(formData.amount)
    });
    setShowConfirm(false);
  };

  if (!transaction) return null;

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
          <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Edit Transaction</h2>
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
            <div style={{ display: 'flex', gap: '16px' }}>
              <button
                type="button"
                onClick={() => handleChange({ target: { name: 'type', value: 'expense' } })}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: formData.type === 'expense' ? '2px solid var(--danger)' : '1px solid var(--border-color)',
                  backgroundColor: formData.type === 'expense' ? 'var(--danger-bg)' : 'var(--bg-tertiary)',
                  color: formData.type === 'expense' ? 'var(--danger)' : 'var(--text-primary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => handleChange({ target: { name: 'type', value: 'income' } })}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: formData.type === 'income' ? '2px solid var(--success)' : '1px solid var(--border-color)',
                  backgroundColor: formData.type === 'income' ? 'var(--success-bg)' : 'var(--bg-tertiary)',
                  color: formData.type === 'income' ? 'var(--success)' : 'var(--text-primary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
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
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleChange({ target: { name: 'category', value: cat } })}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-full)',
                    border: formData.category === cat ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                    backgroundColor: formData.category === cat ? 'var(--accent-light)' : 'var(--bg-tertiary)',
                    color: formData.category === cat ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (formData.category !== cat) {
                      e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (formData.category !== cat) {
                      e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
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
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>

      <AnimatePresence>
        {showConfirm && (
          <div className="modal-overlay" style={{ zIndex: 1100, backgroundColor: 'rgba(0,0,0,0.4)' }}>
            <motion.div 
              className="modal-content"
              style={{ maxWidth: '400px', textAlign: 'center', padding: '32px' }}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>Confirm Changes</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.5' }}>
                Are you sure you want to save these changes? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button 
                  className="btn" 
                  onClick={() => setShowConfirm(false)} 
                  style={{ flex: 1, border: '1px solid var(--border-color)', justifyContent: 'center' }}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleConfirmSave} 
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Yes, Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
