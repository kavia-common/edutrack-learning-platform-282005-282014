import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import { useAuth } from './store/authStore';
import { FeatureFlagsProvider } from './store/featureFlags';
import { ToastProvider, useToast } from './components/ui/Toast';
import { AuthProvider } from './store/authStore';
import { CoursesProvider } from './store/courseStore';
import { ProgressProvider } from './store/progressStore';
import Layout from './components/layout/Layout.jsx';
import { applyCssVars } from './theme-compat';
import Skeleton from './components/ui/primitives/Skeleton.jsx';

const Documents = React.lazy(() => import('./routes/Documents'));
const CodeOfConduct = React.lazy(() => import('./pages/CodeOfConduct.jsx'));
const NDAAgreement = React.lazy(() => import('./pages/NDAAgreement.jsx'));
const OfferLetter = React.lazy(() => import('./pages/OfferLetter.jsx'));
const Dashboard = React.lazy(() => import('./pages/Dashboard.jsx'));
const AdminLogin = React.lazy(() => import('./pages/AdminLogin.jsx'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard.jsx'));
const Profile = React.lazy(() => import('./pages/Profile.jsx'));
const AdminUsers = React.lazy(() => import('./pages/admin/AdminUsers.jsx'));
const AdminDocuments = React.lazy(() => import('./pages/admin/AdminDocuments.jsx'));
const AdminSettings = React.lazy(() => import('./pages/admin/AdminSettings.jsx'));
const AdminDocumentView = React.lazy(() => import('./pages/admin/AdminDocumentView.jsx'));
const AdminInbox = React.lazy(() => import('./pages/admin/AdminInbox.jsx'));
const AdminInboxPreview = React.lazy(() => import('./pages/admin/AdminInboxPreview.jsx'));


const PREVIEW_ONLY = String(process.env.REACT_APP_PREVIEW_DOCUMENTS_ONLY || '').toLowerCase() === 'true';

function Footer() {
  return (
    <footer style={{ marginTop: 24, textAlign: 'center', color: 'var(--text-secondary)', fontSize: 12, padding: 16 }}>
      Ocean Professional theme • Primary #2563EB • Secondary #F59E0B
    </footer>
  );
}

// Auth pages
function Login() {
  const { login } = useAuth();
  const { push } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || '/documents';
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorText, setErrorText] = useState('');

  if (PREVIEW_ONLY) return <Navigate to="/documents" replace />;

  const handleLogin = async () => {
    setSubmitting(true);
    setErrorText('');
    try {
      const result = await login(email, pwd);
      if (result === true) {
        push({ type: 'success', message: 'Logged in' });
        // Use SPA navigation to keep router state and avoid reloads
        navigate(from, { replace: true });
      } else if (result && result.ok === false && result.message) {
        setErrorText(result.message);
        push({ type: 'error', message: result.message });
      } else {
        setErrorText('Invalid credentials');
        push({ type: 'error', message: 'Invalid credentials' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main style={{ padding: 20 }}>
      <section className="card" style={{ maxWidth: 480, margin: '0 auto' }}>
        <h1 style={{ marginTop: 0 }}>Login</h1>
        <label style={{ display: 'block', marginBottom: 8 }}>
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border-color)' }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: 8 }}>
          <span>Password</span>
          <input
            type="password"
            value={pwd}
            onChange={(e)=>setPwd(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border-color)' }}
          />
        </label>
        {errorText ? (
          <div role="alert" style={{ color: 'var(--error)', marginBottom: 8 }}>{errorText}</div>
        ) : null}
        <button
          className="btn"
          onClick={handleLogin}
          disabled={submitting}
          aria-busy={submitting}
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </section>
    </main>
  );
}

function Register() {
  const { register } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorText, setErrorText] = useState('');

  if (PREVIEW_ONLY) return <Navigate to="/documents" replace />;

  const validate = () => {
    const trimmedEmail = String(email || '').trim();
    const trimmedPwd = String(pwd || '').trim();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      const msg = 'Please enter a valid email address.';
      setErrorText(msg);
      push({ type: 'error', message: msg });
      return false;
    }
    if (trimmedPwd.length < 6) {
      const msg = 'Password must be at least 6 characters.';
      setErrorText(msg);
      push({ type: 'error', message: msg });
      return false;
    }
    setErrorText('');
    return true;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setErrorText('');
    try {
      const result = await register(email.trim(), pwd.trim());
      console.debug('[Register] result:', result);
      if (result === true) {
        push({ type: 'success', message: 'Registration successful' });
        navigate('/documents', { replace: true });
      } else if (result && result.errorCode === 409) {
        const msg = 'Email already registered. Try logging in.';
        setErrorText(msg);
        push({ type: 'error', message: msg });
      } else if (result && result.message) {
        setErrorText(result.message);
        push({ type: 'error', message: result.message });
      } else {
        const msg = 'Registration failed. Please try again.';
        setErrorText(msg);
        push({ type: 'error', message: msg });
      }
    } catch (err) {
      console.error('[Register] Exception:', err);
      const msg = (err && err.message) || 'Unexpected error during registration.';
      setErrorText(msg);
      push({ type: 'error', message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main style={{ padding: 20 }}>
      <section className="card" style={{ maxWidth: 480, margin: '0 auto' }}>
        <h1 style={{ marginTop: 0 }}>Register</h1>
        <label style={{ display: 'block', marginBottom: 8 }}>
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border-color)' }}
            aria-invalid={!email || !email.includes('@')}
          />
        </label>
        <label style={{ display: 'block', marginBottom: 8 }}>
          <span>Password</span>
          <input
            type="password"
            value={pwd}
            onChange={(e)=>setPwd(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border-color)' }}
            aria-invalid={pwd.length > 0 && pwd.length < 6}
          />
        </label>
        {errorText ? (
          <div role="alert" style={{ color: 'var(--error)', marginBottom: 8 }}>{errorText}</div>
        ) : null}
        <button
          className="btn"
          onClick={handleRegister}
          disabled={submitting}
          aria-busy={submitting}
        >
          {submitting ? 'Creating...' : 'Create account'}
        </button>
      </section>
    </main>
  );
}

function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Always call hooks, then handle side-effects/redirects
  useEffect(() => {
    if (PREVIEW_ONLY) {
      console.debug('[Logout] Preview-only mode. Navigating to /documents');
      navigate('/documents', { replace: true });
      return;
    }
    (async () => {
      try {
        await logout();
        console.debug('[Logout] Completed. Navigating to /');
        navigate('/', { replace: true });
      } catch (err) {
        console.error('[Logout] Exception during logout:', err);
        navigate('/', { replace: true });
      }
    })();
  }, [logout, navigate]);

  return <main style={{ padding: 20 }} aria-live="polite">Logging out…</main>;
}

// Onboarding wizard integrating Documents step
function OnboardingWizard() {
  const [step, setStep] = useState(0);
  if (PREVIEW_ONLY) return <Navigate to="/documents" replace />;
  const steps = [
    { key: 'welcome', title: 'Welcome', content: (
      <div className="card" style={{ padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Welcome to your onboarding</h2>
        <p>Please go through the steps to complete your onboarding process.</p>
      </div>
    )},
    { key: 'documents', title: 'Documents', content: <Documents /> },
    { key: 'next', title: 'Next Steps', content: (
      <div className="card" style={{ padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Next Steps</h2>
        <p>Complete all required onboarding documents.</p>
      </div>
    )},
  ];
  const canPrev = step > 0;
  const canNext = step < steps.length - 1;
  return (
    <main style={{ padding: 20 }}>
      <h1 style={{ marginTop: 0 }}>Onboarding</h1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {steps.map((s, i)=>(
          <button
            key={s.key}
            className="btn"
            aria-pressed={i === step}
            onClick={()=> setStep(i)}
            style={{ background: i===step ? 'var(--primary)' : 'transparent', color: i===step ? '#fff' : 'var(--text-primary)', border: '1px solid var(--border-color)' }}
          >
            {s.title}
          </button>
        ))}
      </div>
      <section aria-live="polite" style={{ display: 'grid', gap: 12 }}>
        {steps[step].content}
      </section>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
        <button className="btn" disabled={!canPrev} onClick={()=> setStep(s => Math.max(0, s-1))}>Back</button>
        <button className="btn" disabled={!canNext} onClick={()=> setStep(s => Math.min(steps.length-1, s+1))}>Next</button>
      </div>
      <Footer />
    </main>
  );
}

function NavigationBridgeInner() {
  const navigate = useNavigate();
  useEffect(() => {
    const handler = (e) => {
      const path = e?.detail?.path;
      if (typeof path === 'string') {
        navigate(path);
      }
    };
    window.addEventListener('router:navigate', handler);
    return () => window.removeEventListener('router:navigate', handler);
  }, [navigate]);
  return null;
}

function NavigationBridge() {
  // Wrapper to place the hook within Router context
  return <NavigationBridgeInner />;
}

function AdminRouteGuard({ children }) {
  // PUBLIC_INTERFACE
  /**
   * Guard that allows only admin users, else redirects to /admin/login.
   * Waits for auth loading to finish to avoid redirecting during seed/restore.
   * Accepts either explicit user.role === 'admin' or derived currentUserIsAdmin.
   */
  const { user, currentUserIsAdmin, loading } = useAuth();
  const location = useLocation();

  // Debug logs to inspect control flow and auth state
  console.log('[AdminRouteGuard] loading:', loading, 'user:', user, 'role:', user?.role, 'derivedAdmin:', currentUserIsAdmin);

  // While auth is initializing (seeding admin and restoring session), don't redirect
  if (loading) {
    return <div style={{ padding: '1rem' }}>Loading authentication…</div>;
  }

  const isAdmin = (user && user.role === 'admin') || currentUserIsAdmin === true;
  if (!user || !isAdmin) {
    // Preserve intended destination so AdminLogin can route back after success
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  return children;
}

// PUBLIC_INTERFACE
function App() {
  /** App entry with Router and providers */
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    // apply Ocean Professional css vars on mount and when toggled
    try { applyCssVars(); } catch {}
  }, [theme]);

  // Banner for preview-only mode
  // helper: detect mock flag without importing store internals
  const isMockEnabled = (() => {
    try {
      const raw = process.env.REACT_APP_FEATURE_FLAGS || '';
      if (!raw) return false;
      const t = raw.trim();
      if (t.startsWith('{') || t.startsWith('[')) {
        const data = JSON.parse(t);
        if (Array.isArray(data)) return data.includes('mockApi');
        return Boolean(data.mockApi);
      }
      return raw.split(',').map(s => s.trim()).includes('mockApi');
    } catch {
      return false;
    }
  })();

  const previewBanner = PREVIEW_ONLY ? (
    <div
      role="note"
      aria-live="polite"
      style={{
        position: 'sticky',
        top: 52,
        zIndex: 11,
        margin: '8px 16px',
        background: '#EFF6FF',
        color: '#1E3A8A',
        border: '1px solid #93C5FD',
        borderRadius: 8,
        padding: '8px 12px',
        fontSize: 13
      }}
    >
      Preview mode: Documents only
    </div>
  ) : null;

  const mockBanner = isMockEnabled ? (
    <div
      role="note"
      aria-live="polite"
      style={{
        position: 'sticky',
        top: PREVIEW_ONLY ? 92 : 52,
        zIndex: 11,
        margin: '8px 16px',
        background: '#FFFBEB',
        color: '#92400E',
        border: '1px solid #F59E0B',
        borderRadius: 8,
        padding: '8px 12px',
        fontSize: 13
      }}
    >
      Mock API mode is active: login and registration are simulated.
    </div>
  ) : null;

  return (
    <FeatureFlagsProvider>
      <ToastProvider>
        <AuthProvider>
          <CoursesProvider>
            <ProgressProvider>
              <div className="App" style={{ textAlign: 'initial' }}>
                <Router>
                  <Layout>
                    <NavigationBridge />
                    {previewBanner}
                    {mockBanner}
                    <button
                      className="theme-toggle"
                      onClick={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))}
                      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    >
                      {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
                    </button>
                    <Suspense fallback={<div style={{ padding: 20, display: 'grid', gap: 12 }}>
                      <Skeleton width="40%" height={28} />
                      <Skeleton height={16} />
                      <Skeleton height={16} />
                      <Skeleton width="80%" height={16} />
                    </div>}>
                      <Routes>
                        <Route path="/" element={PREVIEW_ONLY ? <Navigate to="/documents" replace /> : <Dashboard />} />
                        <Route path="/documents" element={<Documents />} />
                        <Route path="/code-of-conduct" element={<CodeOfConduct />} />
                        <Route path="/nda" element={<NDAAgreement />} />
                        <Route path="/offer-letter" element={<OfferLetter />} />
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route
                          path="/admin"
                          element={
                            <AdminRouteGuard>
                              <AdminDashboard />
                            </AdminRouteGuard>
                          }
                        />
                    <Route
                      path="/admin/users"
                      element={
                        <AdminRouteGuard>
                          <AdminUsers />
                        </AdminRouteGuard>
                      }
                    />
                    <Route
                      path="/admin/documents"
                      element={
                        <AdminRouteGuard>
                          <AdminDocuments />
                        </AdminRouteGuard>
                      }
                    />
                    <Route
                      path="/admin/documents/:id"
                      element={
                        <AdminRouteGuard>
                          <AdminDocumentView />
                        </AdminRouteGuard>
                      }
                    />
                    <Route
                      path="/admin/settings"
                      element={
                        <AdminRouteGuard>
                          <AdminSettings />
                        </AdminRouteGuard>
                      }
                    />
                    <Route
                      path="/admin/inbox"
                      element={
                        <AdminRouteGuard>
                          <AdminInbox />
                        </AdminRouteGuard>
                      }
                    />
                    <Route
                      path="/admin/inbox/preview/:id/:doc"
                      element={
                        <AdminRouteGuard>
                          <AdminInboxPreview />
                        </AdminRouteGuard>
                      }
                    />
                    <Route path="/onboarding" element={PREVIEW_ONLY ? <Navigate to="/documents" replace /> : <OnboardingWizard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/login" element={PREVIEW_ONLY ? <Navigate to="/documents" replace /> : <Login />} />
                    <Route path="/register" element={PREVIEW_ONLY ? <Navigate to="/documents" replace /> : <Register />} />
                    <Route path="/logout" element={PREVIEW_ONLY ? <Navigate to="/documents" replace /> : <Logout />} />
                    <Route path="*"
                      element={<Navigate to={PREVIEW_ONLY ? '/documents' : '/'} replace />}
                    />
                  </Routes>
                    </Suspense>
                  </Layout>
                </Router>
              </div>
            </ProgressProvider>
          </CoursesProvider>
        </AuthProvider>
      </ToastProvider>
    </FeatureFlagsProvider>
  );
}

export default App;
