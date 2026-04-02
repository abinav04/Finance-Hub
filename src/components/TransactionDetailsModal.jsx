import React from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TransactionDetailsModal({ transaction, onClose }) {
  if (!transaction) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div 
        className="modal-content"
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Transaction Details</h2>
          <button 
            type="button"
            onClick={onClose} 
            className="btn-icon" 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', padding: 0 }} 
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', paddingTop: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', padding: '20px 0' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Date</span>
            <span style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>{new Date(transaction.date).toLocaleDateString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', padding: '20px 0' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Merchant</span>
            <span style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>{transaction.merchant}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', padding: '20px 0' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Amount</span>
            <span style={{ fontSize: '20px', fontWeight: 700, color: transaction.type === 'income' ? 'var(--success)' : 'var(--text-primary)' }}>
              {transaction.type === 'income' ? '+' : '-'}${Number(transaction.amount).toFixed(2)}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', padding: '20px 0' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Category</span>
            <span style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>{transaction.category}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Type</span>
            <span>
              <span className={`badge ${transaction.type}`}>
                {transaction.type === 'income' ? 'Income' : 'Expense'}
              </span>
            </span>
          </div>
        </div>

        <div className="mt-8">
          <button type="button" className="btn btn-primary" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
