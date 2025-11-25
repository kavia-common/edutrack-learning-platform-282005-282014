import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

// PUBLIC_INTERFACE
export default function Layout({ children }) {
  /** App shell with top nav, side drawer for courses/sections, and persistent footer */
  const [open, setOpen] = useState(true);
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Navbar />
      <div style={{ display: 'grid', gridTemplateColumns: open ? '260px 1fr' : '1fr', maxWidth: 1280, margin: '0 auto', gap: 16, padding: '16px 16px 72px' }}>
        {open && (
          <aside aria-label="Course sections drawer" style={{
            position: 'sticky',
            top: 64,
            alignSelf: 'start',
            background: 'var(--surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 12,
            minHeight: 200,
            overflow: 'hidden',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
          }}>
            <div style={{ height: 40, background: 'linear-gradient(90deg, rgba(37,99,235,0.08), rgba(249,250,251,0.6))', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', padding: '0 12px' }}>
              <strong style={{ fontSize: 14 }}>Courses & Sections</strong>
            </div>
            <div style={{ padding: 12, color: 'var(--text-secondary)', fontSize: 13 }}>
              This drawer can list enrolled courses and module sections.
            </div>
          </aside>
        )}
        <section>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
            <button className="btn" onClick={() => setOpen(v => !v)} aria-expanded={open} aria-controls="drawer">
              {open ? 'Hide sections' : 'Show sections'}
            </button>
          </div>
          <div id="drawer-content">{children}</div>
        </section>
      </div>
      <footer role="contentinfo" style={{
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
        fontSize: 12
      }}>
        Ocean Professional • Primary #2563EB • Secondary #F59E0B
      </footer>
    </div>
  );
}
