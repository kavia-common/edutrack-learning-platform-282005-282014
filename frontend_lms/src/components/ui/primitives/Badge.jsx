import React from 'react';

// PUBLIC_INTERFACE
export default function Badge({ children, tone = 'info' }) {
  const colors = {
    info: { bg: 'rgba(37,99,235,0.10)', border: '1px solid rgba(37,99,235,0.30)', color: 'var(--text-primary)' },
    warn: { bg: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.40)', color: 'var(--text-primary)' },
    success: { bg: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.35)', color: 'var(--text-primary)' },
    error: { bg: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.35)', color: 'var(--text-primary)' },
  }[tone] || {};
  return (
    <span style={{
      fontSize: 12,
      padding: '4px 8px',
      borderRadius: 999,
      background: colors.bg,
      border: colors.border,
      color: colors.color,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }}>
      {children}
    </span>
  );
}
