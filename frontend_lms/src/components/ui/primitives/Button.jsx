import React from 'react';
import { classNames } from '../../../theme';

// PUBLIC_INTERFACE
export default function Button({
  children,
  variant = 'primary', // primary | outline | ghost
  size = 'md', // sm | md | lg
  disabled = false,
  as = 'button',
  className,
  ...rest
}) {
  /** Accessible, themed button */
  const Comp = as;
  const base =
    'btn-reset';
  const sizes = {
    sm: { padding: '6px 10px', fontSize: 13, borderRadius: 10 },
    md: { padding: '8px 12px', fontSize: 14, borderRadius: 10 },
    lg: { padding: '10px 14px', fontSize: 16, borderRadius: 12 },
  }[size];

  const styles = {
    border: '1px solid #1d4ed8',
    background: 'var(--primary)',
    color: '#fff',
    borderRadius: sizes.borderRadius,
    padding: sizes.padding,
    fontSize: sizes.fontSize,
    fontWeight: 600,
    transition: 'box-shadow 150ms ease, transform 150ms ease, border-color 150ms ease, background 150ms ease',
    cursor: disabled ? 'not-allowed' : 'pointer',
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
    opacity: disabled ? 0.7 : 1,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  };

  if (variant === 'outline') {
    styles.background = 'transparent';
    styles.color = 'var(--text-primary)';
    styles.border = '1px solid var(--border-color)';
  }
  if (variant === 'ghost') {
    styles.background = 'transparent';
    styles.color = 'var(--text-primary)';
    styles.border = '1px solid transparent';
  }

  return (
    <Comp
      className={classNames(base, className)}
      aria-disabled={disabled || undefined}
      disabled={as === 'button' ? disabled : undefined}
      style={styles}
      {...rest}
    >
      {children}
    </Comp>
  );
}
