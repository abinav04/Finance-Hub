import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ theme, toggleTheme }) {
  const isLight = theme === 'light';

  return (
    <div 
      onClick={toggleTheme}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '4px',
        borderRadius: '9999px',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        cursor: 'pointer',
        position: 'relative',
        boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
      }}
      title="Toggle Theme"
    >
      {/* Light Mode Trigger */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', zIndex: 1 }}>
        {isLight && (
          <motion.div
            layoutId="theme-thumb"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'var(--bg-primary)',
              borderRadius: '50%',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
              border: '1px solid var(--border-color)'
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          />
        )}
        <Sun 
          size={18} 
          style={{ position: 'relative', zIndex: 2, transition: 'color 0.2s ease' }} 
          color={isLight ? 'var(--accent-primary)' : 'var(--text-secondary)'} 
        />
      </div>

      {/* Dark Mode Trigger */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', zIndex: 1, marginLeft: '4px' }}>
        {!isLight && (
          <motion.div
            layoutId="theme-thumb"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'var(--bg-primary)',
              borderRadius: '50%',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
              border: '1px solid var(--border-color)'
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          />
        )}
        <Moon 
          size={18} 
          style={{ position: 'relative', zIndex: 2, transition: 'color 0.2s ease' }} 
          color={!isLight ? 'var(--accent-primary)' : 'var(--text-secondary)'} 
        />
      </div>
    </div>
  );
}
