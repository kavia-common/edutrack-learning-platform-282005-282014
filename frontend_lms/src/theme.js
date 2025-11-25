//
// PUBLIC_INTERFACE
// Ocean Professional theme tokens and helpers
// Provides CSS variables injection, gradient helpers, and common radii/shadows.
//

export const oceanTheme = {
  colors: {
    primary: '#2563EB',
    secondary: '#F59E0B',
    success: '#F59E0B',
    error: '#EF4444',
    background: '#f9fafb',
    surface: '#ffffff',
    text: '#111827',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
  },
  radii: {
    sm: 8,
    md: 10,
    lg: 12,
    pill: 999,
  },
  shadow: {
    sm: '0 1px 2px rgba(0,0,0,0.04)',
    md: '0 6px 14px rgba(37,99,235,0.08), 0 2px 4px rgba(0,0,0,0.04)',
  },
  gradient: {
    subtle: 'linear-gradient(90deg, rgba(37,99,235,0.08), rgba(249,250,251,0.6))',
    accent: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(245,158,11,0.10))',
  },
};

// PUBLIC_INTERFACE
export function applyCssVars(theme = oceanTheme) {
  /** Inject CSS variables on :root to ensure consistent theming across app. */
  const root = document.documentElement;
  const c = theme.colors;
  root.style.setProperty('--primary', c.primary);
  root.style.setProperty('--secondary', c.secondary);
  root.style.setProperty('--success', '#10B981'); // keep semantic success green for a11y
  root.style.setProperty('--error', c.error);
  root.style.setProperty('--bg-primary', c.background);
  root.style.setProperty('--bg-secondary', c.surface);
  root.style.setProperty('--surface', c.surface);
  root.style.setProperty('--text-primary', c.text);
  root.style.setProperty('--text-secondary', theme.colors.textSecondary);
  root.style.setProperty('--border-color', c.border);
}

// PUBLIC_INTERFACE
export function classNames(...parts) {
  /** Simple conditional className combiner. Filters falsy values. */
  return parts.filter(Boolean).join(' ');
}
