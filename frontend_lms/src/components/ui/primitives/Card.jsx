import React from 'react';

// PUBLIC_INTERFACE
export default function Card({ as = 'section', children, className, style, ...rest }) {
  const Comp = as;
  const baseStyle = {
    background: 'var(--surface)',
    backgroundImage: 'var(--dt3-grad-card)',
    border: '1px solid var(--border-color)',
    borderRadius: 18,
    boxShadow: '0 8px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)',
    transition: 'transform 140ms var(--dt3-ease-enter), border-color 140ms var(--dt3-ease-enter), box-shadow 140ms var(--dt3-ease-enter)',
  };
  return (
    <Comp
      className={className}
      style={{ ...baseStyle, ...style }}
      onMouseEnter={(e) => {
        Object.assign(e.currentTarget.style, { ...baseStyle, transform: 'translateY(-2px)', borderColor: 'rgba(125,211,252,0.45)', boxShadow: '0 10px 28px rgba(0,0,0,0.4), 0 0 24px rgba(34,211,238,0.15)' });
      }}
      onMouseLeave={(e) => {
        Object.assign(e.currentTarget.style, baseStyle);
      }}
      {...rest}
    >
      {children}
    </Comp>
  );
}
