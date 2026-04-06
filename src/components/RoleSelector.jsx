import React, { useState, useRef, useEffect } from 'react';
import { Eye, ShieldCheck, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RoleSelector({ role, setRole }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectRole = (r) => {
    setRole(r);
    setIsOpen(false);
  };

  const getIcon = (r) => {
    return r === 'admin' ? <ShieldCheck size={16} /> : <Eye size={16} />;
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button 
        className="btn"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          borderRadius: '9999px',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-primary)',
          fontWeight: 600,
          fontSize: '14px',
          cursor: 'pointer',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
          e.currentTarget.style.borderColor = 'var(--text-tertiary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
          e.currentTarget.style.borderColor = 'var(--border-color)';
        }}
      >
        {getIcon(role)}
        <span style={{ textTransform: 'capitalize' }}>{role}</span>
        <ChevronDown 
          size={14} 
          style={{ 
            color: 'var(--text-tertiary)', 
            marginLeft: '4px', 
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
            transition: 'transform 0.2s ease' 
          }} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: '160px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              zIndex: 100,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', padding: '6px', gap: '4px' }}>
              <button 
                onClick={() => selectRole('viewer')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  width: '100%',
                  textAlign: 'left',
                  color: role === 'viewer' ? 'var(--accent-primary)' : 'var(--text-primary)',
                  backgroundColor: role === 'viewer' ? 'var(--bg-tertiary)' : 'transparent',
                  fontWeight: 500,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => { if(role !== 'viewer') e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}}
                onMouseLeave={(e) => { if(role !== 'viewer') e.currentTarget.style.backgroundColor = 'transparent'}}
              >
                <Eye size={16} /> Viewer
              </button>
              
              <button 
                onClick={() => selectRole('admin')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  width: '100%',
                  textAlign: 'left',
                  color: role === 'admin' ? 'var(--accent-primary)' : 'var(--text-primary)',
                  backgroundColor: role === 'admin' ? 'var(--bg-tertiary)' : 'transparent',
                  fontWeight: 500,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => { if(role !== 'admin') e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}}
                onMouseLeave={(e) => { if(role !== 'admin') e.currentTarget.style.backgroundColor = 'transparent'}}
              >
                <ShieldCheck size={16} /> Admin
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
