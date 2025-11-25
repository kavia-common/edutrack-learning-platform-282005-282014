# Preview

This preview shows the LMS UI and how to navigate. Use the sidebar and top navigation to access pages.

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

Override tokens by adjusting `src/theme/tokens.css`. For example, to tweak light card surface:

```css
:root[data-theme="light"] {
  --card-bg: #ffffff;
  --card-border: #e5e7eb;
  --badge-bg: rgba(37, 99, 235, 0.10);
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
