import React from 'react';

// PUBLIC_INTERFACE
export default function Badge({ children, tone = 'info' }) {
  const colors = {
    info: { bg: 'rgba(34,211,238,0.10)', border: '1px solid rgba(34,211,238,0.35)', color: 'var(--dt3-text-primary)' },
    warn: { bg: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.40)', color: 'var(--dt3-text-primary)' },
    success: { bg: 'rgba(34,197,94,0.10)', border: '1px solid rgba(34,197,94,0.35)', color: 'var(--dt3-text-primary)' },
    error: { bg: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.35)', color: 'var(--dt3-text-primary)' },
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
