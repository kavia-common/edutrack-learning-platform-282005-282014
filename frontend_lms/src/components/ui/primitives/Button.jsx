import React from 'react';
import { classNames } from '../../../theme';

// PUBLIC_INTERFACE
export default function Button({
  children,
  variant = 'primary', // primary | secondary | ghost | subtle
  size = 'md', // sm | md | lg
  disabled = false,
  as = 'button',
  className,
  ...rest
}) {
  /** Accessible, token-driven button */
  const Comp = as;
  const sizes = {
    sm: { padding: '8px 14px', fontSize: 14, radius: 8 },
    md: { padding: '10px 16px', fontSize: 16, radius: 10 },
    lg: { padding: '12px 20px', fontSize: 18, radius: 12 },
  }[size];

  const base = {
    padding: sizes.padding,
    borderRadius: sizes.radius,
    fontSize: sizes.fontSize,
    fontWeight: 600,
    transition: 'var(--transition-theme)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    textDecoration: 'none',
    boxShadow: 'var(--shadow-sm)',
  };

  const variants = {
    primary: {
      background: 'var(--btn-bg)',
      color: 'var(--btn-fg)',
      border: '1px solid var(--btn-border)',
    },
    secondary: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      border: '1px solid var(--border-color)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--color-primary)',
      border: '1px solid transparent',
    },
    subtle: {
      background: 'var(--card-bg)',
      color: 'var(--card-fg)',
      border: '1px solid var(--card-border)',
    }
  };

  const style = { ...base, ...(variants[variant] || variants.primary), opacity: disabled ? 0.6 : 1 };

  return (
    <Comp
      className={classNames(className)}
      aria-disabled={disabled || undefined}
      disabled={as === 'button' ? disabled : undefined}
      style={style}
      {...rest}
    >
      {children}
    </Comp>
  );
}
