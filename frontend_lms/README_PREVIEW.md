# Preview

This preview shows the Onboarding LMS UI and how to navigate. Use the sidebar and top navigation to access pages.

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

## Onboarding Form (New)

- Route: /onboarding-form
- Navigation: Navbar > Onboarding Form
- Location: src/pages/OnboardingForm.jsx
- Behavior:
  - Basic validation on key fields (First/Last name, Phone, Email, DOB, Sex, Emergency Contact Name/Phone, Account Number).
  - Required fields are marked with an asterisk (*).
  - Responsive grid layout; works for mobile and desktop, light/dark compatible using theme tokens.
  - On submit, data is not sent to any backend. A modal opens with a JSON preview and the data is logged to console.
- Export PDF also submits the generated PDF to a client-side Admin Inbox, making it viewable under Admin > Inbox.

### Onboarding PDF Submission Flow

- Trigger: The Export PDF button on the Onboarding Form.
- After generating the PDF, the app requests a Blob from the export utility and stores it via a local inbox service:
  - Service: src/services/inbox.js (localStorage key: ONBOARDING_DOCS)
  - Schema: { id, title, createdAt, submittedBy, type: 'onboarding', url, status: 'submitted' }
- Admin view:
  - Admin Inbox (src/pages/admin/AdminInbox.jsx) shows a new table "Onboarding Form Submissions" with View and Download options.
  - View opens an inline PDF iframe using the stored Blob/Data URL.
- Utilities:
  - src/utils/exportPdf.js supports returning a Blob (options: { returnBlob: true, skipSave: true }) to avoid duplicate downloads.

Backend later:
- Replace src/services/inbox.js with an API-backed module that posts the PDF (Blob or base64) and metadata to your backend.
- Suggested API: POST /api/inbox/documents { title, type, submitter, createdAt, file }
- Use REACT_APP_BACKEND_URL for the base URL. If unavailable, fall back to localStorage and surface a toast message.

To modify fields:
- Edit the component in src/pages/OnboardingForm.jsx
- Update the initialState object for defaults or add/remove fields.
- Add custom validation in the validators map and/or required map.
- Adjust layout by changing gridColumn spans in the JSX.

## DigitalT3 Theme: Light/Dark Mode

The LMS ships with a DigitalT3 theme supporting both Light and Dark modes.

- Tokens are defined in `src/theme/tokens.css`
  - Default tokens represent the dark theme under `:root`
  - A dedicated Light Mode palette is defined under `:root[data-theme="light"]`
- All core components read from tokens: Button, Card, Modal, Badge, Navbar, Layout
- Buttons (including primary, outline, ghost/link, view, continue) are unified under the brand primary color (#43919d). Global utility class `.btn` and the `Button` primitive both derive styles from button tokens (`--btn-*`).

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

### Accessibility and Contrast

- Brand button foreground is white on #43919d and meets WCAG AA contrast in light and dark modes. If you change `--brand-primary`, ensure `--btn-fg` maintains at least 4.5:1 contrast for normal text and 3:1 for large text. Tools such as the W3C contrast checker can help validate.

### Notes

- The Sidebar is currently decommissioned and returns null.
- Environment variables are read via `src/utils/env.js` and logged on startup for validation.
- Admin sections "Users", "Documents", and "Settings" are intentionally hidden/disabled from the Admin UI. Their components still exist in the codebase but are not linked nor routed from the Admin dashboard.
