import React from 'react';

// PUBLIC_INTERFACE
export default function Spinner({ size = 16 }) {
  const s = size;
  const border = Math.max(2, Math.floor(size / 8));
  return (
    <span
      aria-label="Loading"
      role="status"
      style={{
        display: 'inline-block',
        width: s,
        height: s,
        borderRadius: '50%',
        border: `${border}px solid rgba(37,99,235,0.2)`,
        borderTopColor: 'var(--primary)',
        animation: 'spin 0.8s linear infinite'
      }}
    />
  );
}
