//
// Lightweight Admin Inbox service for client-side persistence.
// Persists to localStorage under key ONBOARDING_DOCS with schema:
// { id, title, createdAt, submittedBy, type, url, status }
//
// Note: This is a client-only implementation to simulate a backend inbox.
// Replace with API calls later if a backend exists.
//
const STORAGE_KEY = 'ONBOARDING_DOCS';

// PUBLIC_INTERFACE
export function listInbox() {
  /** Return all stored inbox docs (newest first). */
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(list)) return [];
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
      status: String(status || 'submitted'),
      url,
    };

    const list = listInbox();
    const next = [submitted, ...list];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

    // Fire a storage-like event for in-tab updates
    try {
      window.dispatchEvent(new CustomEvent('ONBOARDING_DOCS:update', { detail: { id } }));
    } catch {
      // ignore
    }

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
