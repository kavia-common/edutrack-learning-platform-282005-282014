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
    outline: {
      background: 'transparent',
      color: 'var(--color-primary)',
      border: '1px solid var(--color-primary)',
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

  // Pseudo-state handling via event styles
  const [isHover, setIsHover] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);

  const interactiveStyle = { ...style };
  if (!disabled && variant === 'primary') {
    interactiveStyle.background = isActive ? 'var(--btn-bg-active)' : isHover ? 'var(--btn-bg-hover)' : style.background;
    interactiveStyle.boxShadow = isActive
      ? `0 0 0 2px var(--btn-ring), 0 2px 8px var(--brand-primary-shadow)`
      : isHover
        ? `0 0 0 2px transparent, 0 6px 16px var(--brand-primary-shadow)`
        : 'var(--shadow-sm)';
  }

  // Shared focus ring via data attr (inline style)
  const focusStyle = {
    outline: '3px solid var(--btn-ring)',
    outlineOffset: '2px'
  };

  return (
    <Comp
      className={classNames(className)}
      aria-disabled={disabled || undefined}
      disabled={as === 'button' ? disabled : undefined}
      style={interactiveStyle}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => { setIsHover(false); setIsActive(false); }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      onFocus={(e) => { e.currentTarget.style.outline = focusStyle.outline; e.currentTarget.style.outlineOffset = focusStyle.outlineOffset; }}
      onBlur={(e) => { e.currentTarget.style.outline = 'none'; e.currentTarget.style.outlineOffset = '0px'; }}
      {...rest}
    >
      {children}
    </Comp>
  );
}
