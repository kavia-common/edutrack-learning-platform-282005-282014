/**
 * Lightweight Admin Inbox service for client-side persistence.
 * Persists to localStorage under key ONBOARDING_DOCS with schema:
 * {
 *   id, title, createdAt, submittedBy, type,
 *   url?,                // blob/object/data URL for PDF (optional)
 *   status,              // 'submitted' | 'in_review' | 'approved' | 'rejected'
 *   jsonPayload?,        // arbitrary JSON payload for JSON-only entries (optional)
 *   printableHtml?       // generated HTML string snapshot for JSON-only view/print (optional)
 * }
 *
 * Note: This is a client-only implementation to simulate a backend inbox.
 * Replace with API calls later if a backend exists.
 */
const STORAGE_KEY = 'ONBOARDING_DOCS';

/** Safe JSON parse helper */
function safeParse(raw, fallback = []) {
  try {
    const v = raw ? JSON.parse(raw) : fallback;
    return Array.isArray(v) ? v : fallback;
  } catch {
    return fallback;
  }
}

/** Emit update event */
function emitUpdate(detail = {}) {
  try {
    window.dispatchEvent(new CustomEvent('ONBOARDING_DOCS:update', { detail }));
  } catch {
    // ignore
  }
}

/** Normalize status value */
function normalizeStatus(s) {
  const map = {
    submitted: 'submitted',
    'in review': 'in_review',
    in_review: 'in_review',
    approved: 'approved',
    rejected: 'rejected',
  };
  const key = String(s || 'submitted').toLowerCase();
  return map[key] || 'submitted';
}

// PUBLIC_INTERFACE
export function listInbox() {
  /** Return all stored inbox docs (newest first). */
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const list = safeParse(raw, []);
    return list.slice().sort((a, b) => (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  } catch {
    return [];
  }
}

// PUBLIC_INTERFACE
export function submitDocument({ title, blob, type = 'onboarding', status = 'submitted', submittedBy = 'anonymous' }) {
  /**
   * Store a new document into the Inbox with a blob URL.
   * - title: string
   * - blob: Blob (PDF) or data URL string; if Blob is provided, it is converted to blob URL
   * - type: string (e.g., onboarding)
   * - status: string (e.g., submitted)
   * - submittedBy: string (email/name)
   * Returns the saved record.
   */
  if (typeof window === 'undefined') return null;
  try {
    const id = `inbox-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const createdAt = new Date().toISOString();

    let url = '';
    if (blob instanceof Blob) {
      url = URL.createObjectURL(blob);
    } else if (typeof blob === 'string') {
      // Accept data URL; validate prefix for safety
      url = blob.startsWith('data:application/pdf') ? blob : '';
    }

    const submitted = {
      id,
      title: String(title || 'Untitled'),
      createdAt,
      submittedBy: String(submittedBy || 'anonymous'),
      type: String(type || 'onboarding'),
      status: normalizeStatus(status),
      url,
    };

    const list = listInbox();
    const next = [submitted, ...list];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

    emitUpdate({ id });

    // Dev diagnostics
    try {
      const DIAG = (process.env.REACT_APP_NODE_ENV || process.env.NODE_ENV) !== 'production';
      if (DIAG) {
        const approxBytes = JSON.stringify(next).length;
        // eslint-disable-next-line no-console
        console.debug('[inbox] Saved item:', { id, title: submitted.title, urlType: typeof submitted.url, length: submitted.url?.length || 0, storageBytes: approxBytes });
      }
    } catch {}

    return submitted;
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export function getInboxById(id) {
  /** Retrieve a document by id. */
  const list = listInbox();
  return list.find((x) => x.id === id) || null;
}

// PUBLIC_INTERFACE
export function submitJson({ title, payload, type = 'onboarding', status = 'submitted', submittedBy = 'anonymous' }) {
  /**
   * Store a new JSON-only inbox entry. Generates a lightweight printable HTML snapshot.
   * - title: string
   * - payload: object (arbitrary JSON)
   * - status: string
   */
  if (typeof window === 'undefined') return null;
  try {
    const id = `inbox-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const createdAt = new Date().toISOString();

    const safePayload = typeof payload === 'object' && payload !== null ? payload : { note: 'No payload provided' };
    const printableHtml = buildPrintableHtml({ title, payload: safePayload, submittedBy, createdAt });

    const record = {
      id,
      title: String(title || 'Untitled'),
      createdAt,
      submittedBy: String(submittedBy || 'anonymous'),
      type: String(type || 'onboarding'),
      status: normalizeStatus(status),
      url: '', // no PDF yet
      jsonPayload: safePayload,
      printableHtml,
    };

    const list = listInbox();
    const next = [record, ...list];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    emitUpdate({ id });

    return record;
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export function updateStatus(id, nextStatus) {
  /** Update status for an inbox item and persist. Returns updated item or null. */
  if (typeof window === 'undefined') return null;
  try {
    const list = listInbox();
    const idx = list.findIndex((x) => x.id === id);
    if (idx < 0) return null;
    const updated = { ...list[idx], status: normalizeStatus(nextStatus) };
    const next = list.slice();
    next[idx] = updated;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    emitUpdate({ id, status: updated.status });
    return updated;
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export function ensurePrintableHtml(id) {
  /**
   * Ensure printableHtml exists for an item (generate from jsonPayload if absent).
   * Returns updated item or null if not found.
   */
  if (typeof window === 'undefined') return null;
  try {
    const list = listInbox();
    const idx = list.findIndex((x) => x.id === id);
    if (idx < 0) return null;
    const item = list[idx];
    if (item.printableHtml || !item.jsonPayload) return item;
    const printableHtml = buildPrintableHtml({
      title: item.title,
      payload: item.jsonPayload,
      submittedBy: item.submittedBy,
      createdAt: item.createdAt,
    });
    const updated = { ...item, printableHtml };
    const next = list.slice();
    next[idx] = updated;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    emitUpdate({ id });
    return updated;
  } catch {
    return null;
  }
}

/** Build a simple printable HTML string with brand-friendly styling */
function buildPrintableHtml({ title, payload, submittedBy, createdAt }) {
  const safeTitle = String(title || 'Onboarding Submission');
  const pretty = JSON.stringify(payload || {}, null, 2);
  return `<!doctype html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${safeTitle}</title>
<style>
  :root {
    --primary: #2563EB;
    --secondary: #F59E0B;
    --bg: #ffffff;
    --fg: #111827;
    --muted: #6b7280;
    --border: #e5e7eb;
  }
  body { margin: 0; font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif; background: var(--bg); color: var(--fg); }
  .wrap { max-width: 960px; margin: 24px auto; padding: 0 16px; }
  .card { background: #fff; border: 1px solid var(--border); border-radius: 12px; box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
  header { padding: 16px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
  h1 { font-size: 18px; margin: 0; }
  .meta { color: var(--muted); font-size: 12px; }
  pre { margin: 0; padding: 16px; overflow: auto; background: #0b1220; color: #f3f4f6; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px; }
  .actions { display: flex; gap: 8px; padding: 12px 16px; }
  .btn { background: var(--primary); color: #fff; border: 1px solid #1d4ed8; border-radius: 8px; padding: 8px 12px; text-decoration: none; }
  @media print {
    .actions { display: none; }
    body { background: #fff; }
    .card { box-shadow: none; }
  }
</style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <header>
        <h1>${safeTitle}</h1>
        <div class="meta">Submitted by ${submittedBy || 'anonymous'} · ${new Date(createdAt || Date.now()).toLocaleString()}</div>
      </header>
      <pre>${escapeHtml(pretty)}</pre>
      <div class="actions">
        <button class="btn" onclick="window.print()">Print</button>
      </div>
    </div>
  </div>
</body>
</html>`;
}

/** Escape HTML special chars for embedding JSON safely */
function escapeHtml(str) {
  try {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  } catch {
    return '';
  }
}

// PUBLIC_INTERFACE
export function subscribeInbox(callback) {
  /**
   * Subscribe to inbox updates across tabs and same-tab custom events.
   * Returns an unsubscribe function.
   */
  if (typeof window === 'undefined') return () => {};
  const onStorage = (e) => {
    if (e.key === STORAGE_KEY) callback(listInbox());
  };
  const onCustom = () => callback(listInbox());
  window.addEventListener('storage', onStorage);
  window.addEventListener('ONBOARDING_DOCS:update', onCustom);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener('ONBOARDING_DOCS:update', onCustom);
  };
}
