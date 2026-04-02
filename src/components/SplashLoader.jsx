import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SplashLoader({ onComplete, pageName = 'Finance Hub', durationMs = 2000 }) {
  useEffect(() => {
    // Artificial wait to show loader
    const timer = setTimeout(() => {
      onComplete();
    }, durationMs);
    return () => clearTimeout(timer);
  }, [onComplete, durationMs]);

  return (
    <motion.div 
      key="splash-circular"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(8px)', scale: 1.05 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        overflow: 'hidden'
      }}
    >
      <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* Outer Static Track */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: '2px solid',
          borderColor: 'var(--accent-primary)',
          opacity: 0.2,
        }} />

        {/* Spinning Progress Arc (Clockwise) */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '3px solid transparent',
            borderTopColor: 'var(--accent-primary)',
            borderRightColor: 'var(--accent-primary)',
          }}
        />

        {/* Inner Pulsing Glow */}
        <motion.div
          animate={{ opacity: [0.2, 0.6, 0.2], scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-primary)',
            filter: 'blur(6px)'
          }}
        />

        {/* Center Anchor Dot */}
        <div style={{
          position: 'absolute',
          width: '14px',
          height: '14px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent-primary)',
          boxShadow: '0 0 10px var(--accent-primary)'
        }} />

        {/* Orbiting Satellite Dot (Counter-Clockwise) */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: '-12px', // Extend outside main ring
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-primary)',
            boxShadow: '0 0 8px var(--text-primary)' // dark shadow mix
          }} />
        </motion.div>
      </div>

      {/* Synchronous Pulsing Text */}
      <motion.div 
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ marginTop: '36px', fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}
      >
        Loading {pageName}...
      </motion.div>

    </motion.div>
  );
}
