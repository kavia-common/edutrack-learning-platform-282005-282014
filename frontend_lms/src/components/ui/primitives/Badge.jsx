import React from 'react';

// PUBLIC_INTERFACE
export default function Badge({ children, tone = 'info' }) {
  const toneMap = {
    info: { bg: 'var(--badge-bg)', color: 'var(--badge-fg)' },
    warn: { bg: 'rgba(245,158,11,0.10)', color: 'var(--text-primary)' },
    success: { bg: 'rgba(34,197,94,0.10)', color: 'var(--text-primary)' },
    error: { bg: 'rgba(239,68,68,0.10)', color: 'var(--text-primary)' },
  }[tone] || { bg: 'var(--badge-bg)', color: 'var(--badge-fg)' };

  return (
    <span style={{
      fontSize: 12,
      padding: '4px 8px',
      borderRadius: 999,
      background: toneMap.bg,
      border: '1px solid var(--color-border)',
      color: toneMap.color,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      transition: 'var(--transition-theme)'
    }}>
      {children}
    </span>
  );
}
