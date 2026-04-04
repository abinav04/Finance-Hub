import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dropdown({ value, onChange, options, icon: Icon, fullWidth = false, buttonStyle = {}, openUpwards = false }) {
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

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  const selectedLabel = options.find(o => o.value === value)?.label || value;

  return (
    <div style={{ position: 'relative', width: fullWidth ? '100%' : 'auto' }} ref={dropdownRef}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          padding: '6px 12px',
          borderRadius: 'var(--radius-md)', // matches our thin input groups
          backgroundColor: 'transparent',
          border: 'none',
          color: 'var(--text-primary)',
          fontWeight: 500,
          fontSize: '14px',
          cursor: 'pointer',
          width: '100%',
          transition: 'color 0.2s',
          ...buttonStyle
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {Icon && <Icon size={16} color="var(--text-tertiary)" />}
          <span style={{ textAlign: 'left' }}>{selectedLabel}</span>
        </div>
        <ChevronDown 
          size={14} 
          style={{ 
            color: 'var(--text-tertiary)', 
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
            transition: 'transform 0.2s ease' 
          }} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: openUpwards ? 10 : -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: openUpwards ? 10 : -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              position: 'absolute',
              ...(openUpwards ? { bottom: 'calc(100% + 4px)' } : { top: 'calc(100% + 4px)' }),
              left: 0,
              width: 'max-content',
              minWidth: '100%',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              zIndex: 100,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', padding: '6px', gap: '4px' }}>
              {options.map((opt) => (
                <button 
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    width: '100%',
                    textAlign: 'left',
                    color: value === opt.value ? 'var(--accent-primary)' : 'var(--text-primary)',
                    backgroundColor: value === opt.value ? 'var(--accent-light)' : 'transparent',
                    fontWeight: 500,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => { if(value !== opt.value) e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}}
                  onMouseLeave={(e) => { if(value !== opt.value) e.currentTarget.style.backgroundColor = 'transparent'}}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
