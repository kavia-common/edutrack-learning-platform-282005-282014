/**
 * PUBLIC_INTERFACE
 * DigitalT3 theme tokens and helpers
 * Provides CSS variables mapping to DT3 tokens for app-wide consumption.
 */

export const dt3Theme = {
  colors: {
    primary: 'var(--dt3-accent-3)',
    secondary: 'var(--dt3-accent-2)',
    success: 'var(--dt3-success)',
    error: 'var(--dt3-danger)',
    background: 'var(--dt3-bg-canvas)',
    surface: 'var(--dt3-bg-surface)',
    text: 'var(--dt3-text-primary)',
    textSecondary: 'var(--dt3-text-secondary)',
    border: 'var(--dt3-border)',
  },
  radii: {
    sm: 10,
    md: 12,
    lg: 18,
    pill: 9999,
  },
  shadow: {
    sm: '0 8px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)',
    md: '0 10px 28px rgba(0,0,0,0.40), 0 0 24px rgba(34,211,238,0.15)',
  },
  gradient: {
    subtle: 'var(--dt3-grad-card)',
    accent: 'var(--dt3-grad-accent)',
    button: 'var(--dt3-grad-button)',
  },
};

// PUBLIC_INTERFACE
export function applyCssVars(theme = dt3Theme) {
  /** Inject semantic CSS variables to match existing app usage while sourcing from DT3 tokens. */
  const root = document.documentElement;
  // map semantic vars -> DT3
  root.style.setProperty('--primary', getComputedStyle(root).getPropertyValue('--dt3-accent-3').trim() || '#22D3EE');
  root.style.setProperty('--secondary', getComputedStyle(root).getPropertyValue('--dt3-accent-2').trim() || '#60A5FA');
  root.style.setProperty('--success', getComputedStyle(root).getPropertyValue('--dt3-success').trim() || '#22C55E');
  root.style.setProperty('--error', getComputedStyle(root).getPropertyValue('--dt3-danger').trim() || '#EF4444');

  root.style.setProperty('--bg-primary', getComputedStyle(root).getPropertyValue('--dt3-bg-canvas').trim() || '#0B0F19');
  root.style.setProperty('--bg-secondary', getComputedStyle(root).getPropertyValue('--dt3-bg-surface').trim() || '#0F1524');
  root.style.setProperty('--surface', getComputedStyle(root).getPropertyValue('--dt3-bg-surface').trim() || '#0F1524');

  root.style.setProperty('--text-primary', getComputedStyle(root).getPropertyValue('--dt3-text-primary').trim() || '#FFFFFF');
  root.style.setProperty('--text-secondary', getComputedStyle(root).getPropertyValue('--dt3-text-secondary').trim() || '#C7D0E0');

  root.style.setProperty('--border-color', getComputedStyle(root).getPropertyValue('--dt3-border').trim() || '#1F2937');

  // button tokens
  root.style.setProperty('--button-bg', 'var(--dt3-grad-button)');
  root.style.setProperty('--button-text', '#0B1220');
}

// PUBLIC_INTERFACE
export function classNames(...parts) {
  /** Simple conditional className combiner. Filters falsy values. */
  return parts.filter(Boolean).join(' ');
}
