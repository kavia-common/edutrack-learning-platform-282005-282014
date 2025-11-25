//
// PUBLIC_INTERFACE
// getEnv provides safe, documented access to environment variables expected by the app.
// It maps any legacy or imported keys to the standardized REACT_APP_* keys and falls back to sane defaults.
// Note: In CRA, process.env variables are baked at build time and must start with REACT_APP_.
//
export function getEnv() {
  /** This is a public function. */
  const e = (k, fallback = undefined) => process.env[k] ?? fallback;

  // Normalized configuration keys
  const cfg = {
    API_BASE: e('REACT_APP_API_BASE', e('REACT_APP_BACKEND_URL')),
    BACKEND_URL: e('REACT_APP_BACKEND_URL', e('REACT_APP_API_BASE')),
    FRONTEND_URL: e('REACT_APP_FRONTEND_URL'),
    WS_URL: e('REACT_APP_WS_URL'),
    NODE_ENV: e('REACT_APP_NODE_ENV', process.env.NODE_ENV),
    ENABLE_SOURCE_MAPS: e('REACT_APP_ENABLE_SOURCE_MAPS', 'false'),
    PORT: e('REACT_APP_PORT', '3000'),
    TRUST_PROXY: e('REACT_APP_TRUST_PROXY', 'false'),
    LOG_LEVEL: e('REACT_APP_LOG_LEVEL', 'info'),
    HEALTHCHECK_PATH: e('REACT_APP_HEALTHCHECK_PATH', '/healthz'),
    FEATURE_FLAGS: e('REACT_APP_FEATURE_FLAGS', ''),
    EXPERIMENTS_ENABLED: e('REACT_APP_EXPERIMENTS_ENABLED', 'false')
  };

  return cfg;
}

// PUBLIC_INTERFACE
export function getPort() {
  /** Get resolved dev server port (string). */
  const { PORT } = getEnv();
  return PORT || '3000';
}
