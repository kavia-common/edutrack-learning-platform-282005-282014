import React from 'react';
import { useAuth } from '../../store/authStore';

/**
 * PUBLIC_INTERFACE
 * RoleBadge
 * Displays the current authenticated user's role. Defaults to "user" if missing.
 */
export default function RoleBadge() {
  const { user, currentUserIsAdmin } = useAuth();
  const role = currentUserIsAdmin ? 'admin' : (user?.role || 'user');
  const color = role === 'admin' ? 'var(--color-secondary)' : 'var(--color-primary)';

  return (
    <span
      role="status"
      aria-label={`Current role: ${role}`}
      title={`Current role: ${role}`}
      style={{
        fontSize: 12,
        color,
        background: 'transparent',
        padding: '4px 8px',
        borderRadius: 999,
        border: `1px solid ${color}`,
        transition: 'var(--transition-theme)'
      }}
    >
      {role}
    </span>
  );
}
