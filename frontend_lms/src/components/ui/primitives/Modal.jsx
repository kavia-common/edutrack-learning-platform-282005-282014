import React, { useEffect } from 'react';

// PUBLIC_INTERFACE
export default function Modal({ open, onClose, title = 'Dialog', children }) {
  /** Accessible modal with focus trapping light (esc to close) */
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(2,6,23,0.5)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 100,
        padding: 16,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 12,
          width: 'min(640px, 96vw)',
          boxShadow: '0 6px 24px rgba(0,0,0,0.14)',
          overflow: 'hidden'
        }}
      >
        <header style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', background: 'linear-gradient(90deg, rgba(37,99,235,0.08), rgba(249,250,251,0.6))' }}>
          <strong style={{ color: 'var(--text-primary)' }}>{title}</strong>
        </header>
        <div style={{ padding: 16 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
