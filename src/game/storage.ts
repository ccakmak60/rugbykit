import type { SessionSnapshot } from './session';

const storageKey = 'rugbykit.session.v1';

function saveSession(snapshot: SessionSnapshot) {
  localStorage.setItem(storageKey, JSON.stringify(snapshot));
}

function loadSession(): SessionSnapshot | null {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as SessionSnapshot;
  } catch {
    return null;
  }
}

function clearSession() {
  localStorage.removeItem(storageKey);
}

function hasSavedSession() {
  return localStorage.getItem(storageKey) !== null;
}

export { clearSession, hasSavedSession, loadSession, saveSession };
