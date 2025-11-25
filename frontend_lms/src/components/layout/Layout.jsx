import React from 'react';
import Navbar from './Navbar';

/**
 * PUBLIC_INTERFACE
 * Layout
 * App shell with top nav and main content area.
 */
export default function Layout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', transition: 'var(--transition-theme)' }}>
      <Navbar />
      <main
        role="main"
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '16px 16px 72px',
          display: 'block',
          transition: 'var(--transition-theme)'
        }}
      >
        {children}
      </main>
      <footer
        role="contentinfo"
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-color)',
          padding: '8px 16px',
          display: 'flex',
          justifyContent: 'center',
          gap: 12,
          color: 'var(--text-secondary)',
          fontSize: 12,
          transition: 'var(--transition-theme)'
        }}
      >
        DigitalT3 Theme • Light/Dark toggle in Navbar
      </footer>
    </div>
  );
}
