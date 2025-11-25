/**
 * Compatibility layer for previous applyCssVars usage.
 * In the new setup, tokens are provided via CSS variables and data-theme.
 * applyCssVars is kept as a no-op to avoid breaking imports.
 */

// PUBLIC_INTERFACE
export function applyCssVars() {
  /** No-op: CSS variables are defined in CSS and react to data-theme changes. */
  return;
}
