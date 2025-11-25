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
        background: 'rgba(10,14,23,0.7)',
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
          backgroundImage: 'var(--dt3-grad-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 18,
          width: 'min(640px, 96vw)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)',
          overflow: 'hidden'
        }}
      >
        <header style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', background: 'var(--dt3-grad-accent)' }}>
          <strong style={{ color: '#0B1220' }}>{title}</strong>
        </header>
        <div style={{ padding: 16, color: 'var(--text-secondary)' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
