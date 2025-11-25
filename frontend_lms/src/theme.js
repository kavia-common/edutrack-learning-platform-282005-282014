/**
 * Theme initialization and helpers for DigitalT3
 * - Initializes on load from localStorage or prefers-color-scheme, default 'light'
 * - Exposes getTheme, setTheme, toggleTheme
 * - Persists selection in localStorage
 */

// PUBLIC_INTERFACE
export const dt3Theme = {
  colors: {
    primary: 'var(--color-primary)',
    secondary: 'var(--color-secondary)',
    success: 'var(--color-success)',
    error: 'var(--color-error)',
    background: 'var(--color-bg)',
    surface: 'var(--color-surface)',
    text: 'var(--color-text)',
    textSecondary: 'var(--color-text-muted)',
    border: 'var(--color-border)',
  },
  radii: { sm: 10, md: 12, lg: 18, pill: 9999 },
  shadow: {
    sm: 'var(--shadow-sm)',
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)',
  },
  gradient: {
    subtle: 'var(--dt3-grad-card)',
    accent: 'var(--dt3-grad-accent)',
    button: 'var(--dt3-grad-button)',
  },
};

const STORAGE_KEY = 'dt3-theme';

function detectPreferred() {
  try {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
  } catch {
    /* noop */
  }
  return 'light';
}

// PUBLIC_INTERFACE
export function initTheme() {
  /** Initialize the theme on app start. */
  const stored = (() => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  })();

  const initial = stored || detectPreferred() || 'light';
  setTheme(initial, { persist: false });
}

// PUBLIC_INTERFACE
export function getTheme() {
  /** Returns current theme value on <html data-theme>. */
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.dataset.theme || 'light';
}

// PUBLIC_INTERFACE
export function setTheme(next, opts = { persist: true }) {
  /** Sets theme on documentElement and optionally persists it. */
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.theme = next;
  if (opts.persist) {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }
}

// PUBLIC_INTERFACE
export function toggleTheme() {
  /** Toggles between 'light' and 'dark'. */
  const curr = getTheme();
  const next = curr === 'light' ? 'dark' : 'light';
  setTheme(next);
  return next;
}

// PUBLIC_INTERFACE
export function classNames(...parts) {
  /** Simple conditional className combiner. Filters falsy values. */
  return parts.filter(Boolean).join(' ');
}
