# Preview

This preview shows the LMS UI and how to navigate. Use the sidebar and top navigation to access pages.

## Logo

- Current logo file(s):
  - public/assets/20251125_131718_image.png (original, provided)
  - public/assets/logo.png (alias used by Navbar)
- The Navbar renders the logo on the left. It is responsive and theme-aware (inherits colors via CSS variables).
- Favicon and Apple touch icon references are updated to use the same logo.

To change the logo:
1) Replace public/assets/logo.png with your image (keep the same filename for minimal code changes).
2) Optionally also replace public/assets/20251125_131718_image.png if you want to keep the original copy aligned.
3) If you want different sizes for PWA icons, you can also update references in public/index.html accordingly.

## DigitalT3 Theme: Light/Dark Mode

The LMS ships with a DigitalT3 theme supporting both Light and Dark modes.

- Tokens are defined in `src/theme/tokens.css`
  - Default tokens represent the dark theme under `:root`
  - A dedicated Light Mode palette is defined under `:root[data-theme="light"]`
- All core components read from tokens: Button, Card, Modal, Badge, Navbar, Layout

### Runtime behavior

- On app load, the theme initializes from `localStorage` (key: `dt3-theme`) or `prefers-color-scheme`. Default is `light`.
- The navbar includes a toggle to switch between Light and Dark, which updates `document.documentElement.dataset.theme` and persists the choice.
- Minimal transitions are applied via `--transition-theme` for smooth color/background changes.

### Programmatic control

Use the helpers from `src/theme.js`:

```js
// PUBLIC_INTERFACE
import { getTheme, setTheme, toggleTheme, initTheme } from './theme';

initTheme();         // initialize on load (already called from src/index.js)
getTheme();          // -> 'light' | 'dark'
setTheme('light');   // set explicit theme and persist
toggleTheme();       // toggles and persists
```

### Customization

Primary brand color
- The primary color for buttons and primary accents is tokenized and set to `#43919d`.
- Edit it in `src/theme/tokens.css`:
  - Dark (default): update `--brand-primary`, plus `--brand-primary-hover` and `--brand-primary-active` for hover/active states. Focus ring is `--brand-primary-ring`.
  - Light: do the same under `:root[data-theme="light"]` so both themes stay consistent.
- Semantic tokens `--color-primary` and button tokens `--btn-bg`, `--btn-bg-hover`, `--btn-bg-active`, and `--btn-ring` are derived from these brand tokens.
- Components (Button, Navbar utilities, etc.) consume these tokens; avoid hardcoding primary colors in components.

Example override snippet:

```css
:root[data-theme="light"] {
  --brand-primary: #0ea5e9;        /* new base */
  --brand-primary-hover: #0b8fc9;  /* darker for hover */
  --brand-primary-active: #0a7db1; /* darker for active */
  --brand-primary-ring: rgba(14,165,233,0.5);
}
```

Override other tokens by adjusting `src/theme/tokens.css`. For example, to tweak light card surface:

```css
:root[data-theme="light"] {
  --card-bg: #ffffff;
  --card-border: #e5e7eb;
  --badge-bg: rgba(67, 145, 157, 0.12);
}
```

All surfaces, borders, and text use the following core tokens:

- Background: `--color-bg`, `--color-surface`, `--color-surface-2`
- Text: `--color-text`, `--color-text-muted`
- Border: `--color-border`
- Shadows: `--shadow-sm`, `--shadow-md`, `--shadow-lg`

Transitions are controlled by `--transition-theme` for a minimal, smooth theme change.

### Notes

- The Sidebar is currently decommissioned and returns null.
- Environment variables are read via `src/utils/env.js` and logged on startup for validation.
