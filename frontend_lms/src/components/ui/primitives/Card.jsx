import React from 'react';

// PUBLIC_INTERFACE
export default function Card({ as = 'section', children, className, style, ...rest }) {
  const Comp = as;
  const baseStyle = {
    background: 'var(--card-bg)',
    color: 'var(--card-fg)',
    border: '1px solid var(--card-border)',
    borderRadius: 12,
    boxShadow: 'var(--shadow-sm)',
    transition: 'var(--transition-theme)',
    padding: '1rem'
  };
  return (
    <Comp className={className} style={{ ...baseStyle, ...style }} {...rest}>
      {children}
    </Comp>
  );
}
