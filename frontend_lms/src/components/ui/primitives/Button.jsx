import React from 'react';
import { classNames } from '../../../theme';

/**
 * PUBLIC_INTERFACE
 * Button
 * Semantic button component with variants using tokenized brand colors.
 * Variants: primary (default), outline, ghost, link, subtle, view, continue
 */
export default function Button({
  children,
  variant = 'primary', // primary | outline | ghost | link | subtle | view | continue
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

  // All variants reference primary tokens; only semantics differ in fill/outline/link
  const variants = {
    primary: {
      background: 'var(--btn-bg)',
      color: 'var(--btn-fg)',
      border: '1px solid var(--btn-border)',
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
    link: {
      background: 'transparent',
      color: 'var(--color-primary)',
      border: '1px solid transparent',
      textDecoration: 'underline',
      padding: 0,
      boxShadow: 'none',
      fontWeight: 600,
    },
    subtle: {
      background: 'var(--card-bg)',
      color: 'var(--color-primary)',
      border: '1px solid var(--card-border)',
    },
    // Aliases that should use brand primary
    view: {
      background: 'var(--btn-bg)',
      color: 'var(--btn-fg)',
      border: '1px solid var(--btn-border)',
    },
    continue: {
      background: 'var(--btn-bg)',
      color: 'var(--btn-fg)',
      border: '1px solid var(--btn-border)',
    }
  };

  const baseStyle = { ...base, ...(variants[variant] || variants.primary), opacity: disabled ? 0.6 : 1 };

  // Pseudo-state handling via inline event styles
  const [isHover, setIsHover] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);

  const interactiveStyle = { ...baseStyle };

  // Shared hover/active behavior based on variant family
  const filledLike = ['primary', 'view', 'continue'];
  const outlineLike = ['outline', 'subtle', 'ghost'];
  const linkLike = ['link'];

  if (!disabled && filledLike.includes(variant)) {
    interactiveStyle.background = isActive ? 'var(--btn-bg-active)' : isHover ? 'var(--btn-bg-hover)' : baseStyle.background;
    interactiveStyle.boxShadow = isActive
      ? `0 0 0 2px var(--btn-ring), 0 2px 8px var(--brand-primary-shadow)`
      : isHover
        ? `0 0 0 2px transparent, 0 6px 16px var(--brand-primary-shadow)`
        : 'var(--shadow-sm)';
  } else if (!disabled && outlineLike.includes(variant)) {
    // keep transparent bg, but darken border/text on hover/active using tokens
    interactiveStyle.color = isActive ? 'var(--color-primary-active)' : isHover ? 'var(--color-primary-hover)' : baseStyle.color;
    interactiveStyle.border = `1px solid ${isActive ? 'var(--color-primary-active)' : isHover ? 'var(--color-primary-hover)' : 'var(--color-primary)'}`;
    interactiveStyle.boxShadow = isActive ? `0 0 0 2px var(--btn-ring)` : 'var(--shadow-sm)';
  } else if (!disabled && linkLike.includes(variant)) {
    interactiveStyle.color = isActive ? 'var(--color-primary-active)' : isHover ? 'var(--color-primary-hover)' : baseStyle.color;
    interactiveStyle.textDecoration = isHover || isActive ? 'underline' : 'underline';
  }

  // Shared focus ring
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
