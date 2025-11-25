import React from 'react';

// PUBLIC_INTERFACE
export default function Skeleton({ width = '100%', height = 16, rounded = 8 }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width,
        height,
        borderRadius: rounded,
        background: 'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 37%, #e5e7eb 63%)',
        backgroundSize: '400% 100%',
        animation: 'skeleton-loading 1.4s ease infinite',
      }}
    />
  );
}
