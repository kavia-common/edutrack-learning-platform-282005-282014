import React from 'react';
import { useAuth } from '../../store/authStore';
import Badge from './primitives/Badge';

/**
 * PUBLIC_INTERFACE
 * RoleBadge
 * Displays the current authenticated user's role. Defaults to "user" if missing.
 */
export default function RoleBadge() {
  const { user, currentUserIsAdmin } = useAuth();
  const role = currentUserIsAdmin ? 'admin' : (user?.role || 'user');
  const tone = role === 'admin' ? 'primary' : 'info';

  return (
    <Badge>
      {role}
    </Badge>
  );
}
