import React from 'react';

// PUBLIC_INTERFACE
export default function Card({ as = 'section', children, className, style, ...rest }) {
  const Comp = as;
  return (
    <Comp
      className={className}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 12,
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </Comp>
  );
}
