import React from 'react';
import Navbar from './Navbar';

/**
 * PUBLIC_INTERFACE
 * Layout
 * Minimal app shell with top nav, main content area, and persistent footer.
 * Courses/Sections sidebar has been removed per product request.
 */
export default function Layout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Navbar />
      <main
        role="main"
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '16px 16px 72px',
          display: 'block',
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
        }}
      >
        DigitalT3 Theme • Primary var(--dt3-accent-3) • Surface var(--dt3-bg-surface)
      </footer>
    </div>
  );
}
