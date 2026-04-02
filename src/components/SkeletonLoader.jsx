import React from 'react';
import { motion } from 'framer-motion';

export default function SkeletonLoader({ type }) {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    flex: 1
  };

  const SkeletonBlock = ({ width = '100%', height = '100px', borderRadius = 'var(--radius-lg)', className = '', styles = {} }) => (
    <motion.div
        className={className}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius,
            width,
            height,
            ...styles
        }}
    />
  );

  if (type === 'dashboard') {
    return (
      <div style={containerStyle}>
        {/* Top Solid Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="solid-card" style={{ height: '150px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: 'var(--bg-secondary)', border: '2px solid var(--border-color)', boxShadow: '4px 4px 0 0 var(--border-color)' }}>
              <SkeletonBlock width="40%" height="20px" borderRadius="4px" />
              <SkeletonBlock width="70%" height="40px" borderRadius="6px" />
            </div>
          ))}
        </div>
        
        {/* Graph Areas */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          <div className="glass-panel" style={{ height: '400px', padding: '24px' }}>
            <SkeletonBlock width="150px" height="24px" borderRadius="4px" styles={{ marginBottom: '40px' }} />
            <SkeletonBlock width="100%" height="270px" borderRadius="8px" />
          </div>
          <div className="glass-panel" style={{ height: '400px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <SkeletonBlock width="120px" height="24px" borderRadius="4px" styles={{ alignSelf: 'flex-start', marginBottom: '40px' }} />
            <SkeletonBlock width="220px" height="220px" borderRadius="50%" />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'transactions') {
    return (
      <div className="glass-panel" style={{ height: 'calc(100vh - 240px)', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
        {/* Header toolbar */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <SkeletonBlock width="200px" height="32px" borderRadius="6px" />
          <div style={{ display: 'flex', gap: '16px' }}>
            <SkeletonBlock width="240px" height="38px" borderRadius="100px" />
            <SkeletonBlock width="140px" height="38px" borderRadius="100px" />
            <SkeletonBlock width="140px" height="38px" borderRadius="100px" />
          </div>
        </div>
        
        {/* Table layout */}
        <div style={{ padding: '20px 24px', flex: 1, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)', marginBottom: '16px' }}>
            <SkeletonBlock width="25%" height="18px" borderRadius="4px" />
            <SkeletonBlock width="15%" height="18px" borderRadius="4px" />
            <SkeletonBlock width="15%" height="18px" borderRadius="4px" />
            <SkeletonBlock width="15%" height="18px" borderRadius="4px" />
            <SkeletonBlock width="10%" height="18px" borderRadius="4px" />
          </div>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--bg-tertiary)' }}>
              <SkeletonBlock width="30%" height="16px" borderRadius="4px" />
              <SkeletonBlock width="12%" height="16px" borderRadius="4px" />
              <SkeletonBlock width="15%" height="24px" borderRadius="100px" />
              <SkeletonBlock width="8%" height="16px" borderRadius="4px" />
              <SkeletonBlock width="12%" height="16px" borderRadius="4px" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'insights') {
    return (
      <div className="dashboard-grid">
        {/* Left Column: Smart Insights */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <SkeletonBlock width="28px" height="28px" borderRadius="50%" />
            <SkeletonBlock width="200px" height="28px" borderRadius="6px" />
          </div>
          
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="insight-item" style={{ border: '1px solid var(--border-color)', padding: '16px' }}>
                <SkeletonBlock width="52px" height="52px" borderRadius="var(--radius-lg)" />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <SkeletonBlock width="40%" height="16px" borderRadius="4px" />
                  <SkeletonBlock width="60%" height="24px" borderRadius="4px" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Observations */}
        <div className="glass-panel">
          <SkeletonBlock width="180px" height="28px" borderRadius="6px" styles={{ marginBottom: '24px' }} />
          <SkeletonBlock width="100%" height="16px" borderRadius="4px" styles={{ marginBottom: '12px' }} />
          <SkeletonBlock width="100%" height="16px" borderRadius="4px" styles={{ marginBottom: '12px' }} />
          <SkeletonBlock width="80%" height="16px" borderRadius="4px" styles={{ marginBottom: '32px' }} />
          
          <div style={{ marginTop: '20px', padding: '16px', borderLeft: '4px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', borderRadius: '0 var(--radius-lg) var(--radius-lg) 0' }}>
             <SkeletonBlock width="100%" height="14px" borderRadius="4px" styles={{ marginBottom: '8px' }} />
             <SkeletonBlock width="90%" height="14px" borderRadius="4px" />
          </div>
        </div>
      </div>
    );
  }

  return <SkeletonBlock />;
}
