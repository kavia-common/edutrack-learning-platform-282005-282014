import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../store/authStore';
import { getTheme, toggleTheme } from '../../theme';

/**
 * PUBLIC_INTERFACE
 * Navbar with theme toggle (Light/Dark) and token-driven styles.
 */
export default function Navbar() {
  const { user, currentUserIsAdmin } = useAuth();
  const isAdmin = Boolean(user?.role === 'admin' || currentUserIsAdmin === true);
  const [mode, setMode] = useState('light');

  useEffect(() => {
    setMode(getTheme());
  }, []);

  const linkStyle = ({ isActive }) => ({
    padding: '8px 10px',
    color: isActive ? 'var(--navbar-fg)' : 'var(--text-secondary)',
    textDecoration: 'none',
    borderRadius: 8,
    background: isActive ? 'rgba(125,211,252,0.10)' : 'transparent',
    transition: 'var(--transition-theme)',
  });

  const onToggle = () => {
    const next = toggleTheme();
    setMode(next);
  };

  return (
    <header id="app-navbar" style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'var(--navbar-bg)',
      borderBottom: '1px solid var(--border-color)',
      boxShadow: '0 1px 0 rgba(0,0,0,0.06)',
      backdropFilter: 'saturate(140%) blur(8px)',
      transition: 'var(--transition-theme)'
    }}>
      <nav aria-label="Main navigation" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        maxWidth: 1280,
        margin: '0 auto'
      }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link to="/" style={{ fontWeight: 800, color: 'var(--navbar-fg)', textDecoration: 'none' }}>
            EduTrack LMS
          </Link>
          <div style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
            <NavLink to="/" style={linkStyle} end>Dashboard</NavLink>
            <NavLink to="/documents" style={linkStyle}>Documents</NavLink>
            <NavLink to="/profile" style={linkStyle}>Profile</NavLink>
            <NavLink to={isAdmin ? "/admin" : "/admin/login"} style={linkStyle}>Admin</NavLink>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={onToggle}
            aria-label="Toggle theme"
            title="Toggle theme"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '.5rem',
              padding: '.4rem .75rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'var(--card-bg)',
              color: 'var(--card-fg)',
              boxShadow: 'var(--shadow-sm)',
              cursor: 'pointer',
              transition: 'var(--transition-theme)'
            }}
          >
            {mode === 'light' ? 'Light' : 'Dark'}
          </button>
          {user ? (
            <>
              <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{user.email}</span>
              <Link className="btn" to="/logout" style={{ textDecoration: 'none' }}>Logout</Link>
            </>
          ) : (
            <>
              <Link className="btn" to="/login" style={{ textDecoration: 'none' }}>Login</Link>
              <Link className="btn" to="/register" style={{ textDecoration: 'none' }}>Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
