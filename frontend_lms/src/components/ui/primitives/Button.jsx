import React from 'react';
import { classNames } from '../../../theme';

// PUBLIC_INTERFACE
export default function Button({
  children,
  variant = 'primary', // primary | secondary | ghost
  size = 'md', // sm | md | lg
  disabled = false,
  as = 'button',
  className,
  ...rest
}) {
  /** Accessible, DigitalT3-themed button */
  const Comp = as;
  const base = 'btn-reset';
  const sizes = {
    sm: { padding: '10px 16px', fontSize: 14, radius: 9999 },
    md: { padding: '12px 22px', fontSize: 16, radius: 9999 },
    lg: { padding: '14px 28px', fontSize: 18, radius: 9999 },
  }[size];

  const styles = {
    background: 'var(--dt3-grad-button)',
    color: '#0B1220',
    border: 'none',
    borderRadius: sizes.radius,
    padding: sizes.padding,
    fontSize: sizes.fontSize,
    fontWeight: 600,
    transition: 'transform 150ms var(--dt3-ease-enter), filter 150ms var(--dt3-ease-enter), box-shadow 150ms var(--dt3-ease-enter)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    boxShadow: '0 10px 20px rgba(34,211,238,0.25)',
    opacity: disabled ? 0.5 : 1,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  };

  if (variant === 'secondary') {
    styles.background = 'transparent';
    styles.color = 'var(--dt3-text-secondary)';
    styles.border = '1px solid var(--dt3-border)';
    styles.borderRadius = 12;
    styles.boxShadow = 'none';
  }
  if (variant === 'ghost') {
    styles.background = 'transparent';
    styles.color = 'var(--dt3-link)';
    styles.border = '1px solid transparent';
    styles.boxShadow = 'none';
    styles.borderRadius = 10;
  }

  const hoverStyle = variant === 'primary'
    ? { filter: 'brightness(1.05)', transform: 'translateY(-1px)', boxShadow: '0 10px 24px rgba(96,165,250,0.35), 0 0 18px rgba(34,211,238,0.35)' }
    : (variant === 'secondary'
        ? { backgroundColor: 'rgba(255,255,255,0.04)', borderColor: '#2A3346' }
        : { color: '#AFE1FF' });

  return (
    <Comp
      className={classNames(base, className)}
      aria-disabled={disabled || undefined}
      disabled={as === 'button' ? disabled : undefined}
      onMouseEnter={(e) => {
        if (disabled) return;
        Object.assign(e.currentTarget.style, hoverStyle);
      }}
      onMouseLeave={(e) => {
        if (disabled) return;
        // reset hover styles by reapplying base inline styles
        Object.assign(e.currentTarget.style, styles);
      }}
      style={styles}
      {...rest}
    >
      {children}
    </Comp>
  );
}
