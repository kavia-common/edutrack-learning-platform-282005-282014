import React, { useEffect } from 'react';

// PUBLIC_INTERFACE
export default function Modal({ open, onClose, title = 'Dialog', children }) {
  /** Accessible modal with Escape to close */
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
        background: 'var(--modal-backdrop)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 100,
        padding: 16,
        transition: 'var(--transition-theme)'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        style={{
          background: 'var(--modal-bg)',
          color: 'var(--modal-fg)',
          border: '1px solid var(--color-border)',
          borderRadius: 12,
          width: 'min(640px, 96vw)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          transition: 'var(--transition-theme)'
        }}
      >
        <header style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)' }}>
          <strong>{title}</strong>
        </header>
        <div style={{ padding: 16 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
