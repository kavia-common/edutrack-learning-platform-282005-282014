Preview notes

- The development server runs on port 3000 by default. Override with REACT_APP_PORT.
- The start script disables auto-opening the browser to align with preview system.
- Required environment variables are documented in .env.example and must be set in the container's .env by the orchestrator.
- Common run commands:
  REACT_APP_PORT=3000 npm start
  npm run preview

Theme

- DigitalT3 theme is applied across the app.
- Global tokens are imported from assets/tokens.css via src/index.css.
- Semantic CSS variables used by components are mapped in src/index.css and enforced via applyCssVars in src/theme.js.
- For JS theme consumers, see assets/mui-theme.js for MUI-style options. We do not bundle MUI here, but the tokens are compatible.
- To adjust colors/gradients/typography globally, edit assets/tokens.css. Keep semantic mappings stable (e.g., --bg-primary, --surface).

Performance & UX improvements

- Route-based code splitting enabled with React.lazy/Suspense.
- Skeleton placeholders for perceived performance during route loads.
- Accessible focus states and improved button/links semantics with DT3 focus ring.
- Images: prefer responsive sizes and compressed assets; none large in this template currently.
- Production flags: build script disables source maps by default (set REACT_APP_ENABLE_SOURCE_MAPS=true if needed).
- Analyzer (dev-only) to inspect bundles:

  npm run analyze
  # This builds with source maps, runs source-map-explorer, and emits analyzer-report.html

- If running in CI, ensure REACT_APP_ENABLE_SOURCE_MAPS=true for analyze only; keep it false for production builds.

Note: Courses/Sections navigation has been removed from the layout and top-level UI. Any prior links or side drawer content related to courses/sections are no longer visible.
