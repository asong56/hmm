// ── Storage ───────────────────────────────────────────────────────────────────
// Manages localStorage draft persistence and dirty state.

const KEY_DRAFT   = 'mc:draft';
const KEY_THEME   = 'mc:theme';

export function loadDraft() {
  try { return localStorage.getItem(KEY_DRAFT) ?? ''; }
  catch { return ''; }
}

export function saveDraft(text) {
  try { localStorage.setItem(KEY_DRAFT, text); }
  catch { /* storage full — silently ignore */ }
}

export function loadTheme() {
  try { return localStorage.getItem(KEY_THEME); }
  catch { return null; }
}

export function saveTheme(value) {
  try { localStorage.setItem(KEY_THEME, value); }
  catch {}
}
