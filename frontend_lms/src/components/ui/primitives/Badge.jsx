import React from 'react';

// PUBLIC_INTERFACE
export default function Badge({ children, tone = 'info' }) {
  /**
   * tone:
   * - primary/info: use brand-based tokens derived from #43919d
   * - success: uses success tokens; others fallback to neutral
   */
  const toneMap =
    {
      primary: { bg: 'var(--badge-primary-bg)', color: 'var(--badge-primary-fg)' },
      info: { bg: 'var(--badge-info-bg)', color: 'var(--badge-info-fg)' },
      success: { bg: 'var(--badge-success-bg)', color: 'var(--badge-success-fg)' },
      warn: { bg: 'rgba(245,158,11,0.14)', color: '#3f2d0c' },
      error: { bg: 'rgba(239,68,68,0.16)', color: '#7f1d1d' },
    }[tone] ||
    { bg: 'var(--badge-info-bg)', color: 'var(--badge-info-fg)' };

  return (
    <span
      style={{
        fontSize: 12,
        padding: '4px 8px',
        borderRadius: 999,
        background: toneMap.bg,
        border: '1px solid color-mix(in oklab, var(--color-border) 70%, var(--link) 30%)',
        color: toneMap.color,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        lineHeight: 1.2,
        whiteSpace: 'nowrap',
        transition: 'var(--transition-theme)',
      }}
    >
      {children}
    </span>
  );
}
