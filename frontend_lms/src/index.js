import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// Attach dev helpers for admin toggling (window.setAdminEmail, etc.)
import './dev/setAdmin';
import { getEnv } from './utils/env';

// Surface key envs to help preview validate configuration
// Note: CRA embeds env at build time; these are safe informational logs
try {
  const env = getEnv();
  // eslint-disable-next-line no-console
  console.debug('Frontend LMS env:', {
    API_BASE: env.API_BASE,
    BACKEND_URL: env.BACKEND_URL,
    FRONTEND_URL: env.FRONTEND_URL,
    WS_URL: env.WS_URL,
    NODE_ENV: env.NODE_ENV,
    LOG_LEVEL: env.LOG_LEVEL,
    PORT: env.PORT
  });
} catch (e) {
  // eslint-disable-next-line no-console
  console.warn('Env inspection failed:', e);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
