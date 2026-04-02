import React from 'react';

export default function Logo({ size = 36 }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      {/* Outer Hexagon frame */}
      <path 
        d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z" 
        fill="var(--accent-light)" 
        stroke="var(--accent-primary)" 
        strokeWidth="6" 
        strokeLinejoin="round" 
        opacity="0.8"
      />
      {/* Dynamic inner matrix lines simulating a global/network node */}
      <path 
        d="M15 30 L50 50 L85 30" 
        stroke="var(--accent-primary)" 
        strokeWidth="6" 
        strokeLinejoin="round" 
      />
      <path 
        d="M50 90 L50 50" 
        stroke="var(--accent-primary)" 
        strokeWidth="6" 
        strokeLinecap="round" 
      />
      {/* Core Node */}
      <circle cx="50" cy="50" r="12" fill="var(--success)" />
    </svg>
  );
}
