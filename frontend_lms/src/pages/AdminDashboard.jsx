import React, { useEffect, useMemo, useCallback } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/authStore';
import Button from '../components/ui/primitives/Button';

/**
 * PUBLIC_INTERFACE
 * AdminDashboard
 * Admin-only dashboard. If not authenticated as admin, redirects to /admin/login.
 * Displays navigation cards including Inbox.
 */
export default function AdminDashboard() {
  const { user, currentUserIsAdmin, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div style={{ padding: '1rem' }}>Loading authentication…</div>;
  }

  const isAdmin = Boolean(user && (user.role === 'admin' || currentUserIsAdmin === true));
  const shouldRedirect = !user || !isAdmin;

  if (shouldRedirect) {
    return <Navigate to="/admin/login" replace />;
  }

  // Use tokenized colors via CSS variables; no hard-coded blues
  return (
    <main style={{ padding: 20, background: 'var(--color-bg)', minHeight: '100%' }}>
      <style>{`
        .card:focus-visible {
          outline: 2px solid var(--btn-ring);
          outline-offset: 2px;
        }
        .card:hover {
          box-shadow: 0 6px 14px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04);
          border-color: var(--color-border);
          transform: translateY(-1px);
        }
      `}</style>
      <section className="card" style={{ padding: 16, display: 'grid', gap: 8, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 12 }}>
        <h1 style={{ marginTop: 0, color: 'var(--color-text)' }}>Admin Dashboard</h1>
        <div style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>
          Welcome, {user?.email}. Use the admin tools below.
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link className="btn" to="/logout">Logout</Link>
          <Link className="btn" to="/">Home</Link>
        </div>
      </section>

      <section style={{ marginTop: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {/* Inbox */}
          <button
            type="button"
            onClick={() => navigate('/admin/inbox')}
            aria-label="Go to Admin Inbox"
            className="card"
            style={{
              textAlign: 'left',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 12,
              padding: 16,
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              transition: 'box-shadow 150ms ease, transform 150ms ease, border-color 150ms ease',
              outline: 'none'
            }}
          >
            <h3 style={{ margin: 0, color: 'var(--color-text)' }}>Inbox</h3>
            <p style={{ color: 'var(--color-text-muted)', marginTop: 6 }}>View submissions and download PDFs.</p>
            <div style={{ marginTop: 8 }}>
              <Button variant="primary" size="sm" onClick={(e) => { e.stopPropagation(); navigate('/admin/inbox'); }}>
                Open Inbox →
              </Button>
            </div>
          </button>

          {/* Users, Documents, and Settings tiles are intentionally hidden/disabled */}
        </div>
      </section>

      <footer style={{ marginTop: 24, textAlign: 'center', color: 'var(--text-secondary)', fontSize: 12 }}>
        Brand primary • #43919d
      </footer>
    </main>
  );
}
