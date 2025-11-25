Preview notes

- The development server runs on port 3000 by default. Override with REACT_APP_PORT.
- The start script disables auto-opening the browser to align with preview system.
- Required environment variables are documented in .env.example and must be set in the container's .env by the orchestrator.
- Common run commands:
  REACT_APP_PORT=3000 npm start
  npm run preview
