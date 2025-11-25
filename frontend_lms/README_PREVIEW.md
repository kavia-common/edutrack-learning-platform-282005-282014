Preview notes

- The development server runs on port 3000 by default. Override with REACT_APP_PORT.
- The start script disables auto-opening the browser to align with preview system.
- Required environment variables are documented in .env.example and must be set in the container's .env by the orchestrator.
- Common run commands:
  REACT_APP_PORT=3000 npm start
  npm run preview

Performance & UX improvements

- Global Ocean Professional theme applied using CSS variables with light/dark support.
- Layout updated: top navigation, side drawer (courses/sections), main content, persistent footer.
- Route-based code splitting enabled with React.lazy/Suspense.
- Skeleton placeholders for perceived performance during route loads.
- Accessible focus states and improved button/links semantics.
- Memoization guidance: wrap heavy derived computations with useMemo and useCallback in components that process large lists.
- Images: prefer responsive sizes and compressed assets; none large in this template currently.
- Production flags: build script disables source maps by default (set REACT_APP_ENABLE_SOURCE_MAPS=true if needed).
- Analyzer (dev-only) to inspect bundles:

  npm run analyze
  # This builds with source maps, runs source-map-explorer, and emits analyzer-report.html

- If running in CI, ensure REACT_APP_ENABLE_SOURCE_MAPS=true for analyze only; keep it false for production builds.
