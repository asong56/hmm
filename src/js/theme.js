// ── Theme ─────────────────────────────────────────────────────────────────────
import { loadTheme, saveTheme } from './storage.js';

const ROOT = document.documentElement;

export function initTheme() {
  const stored = loadTheme();
  const prefer = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  ROOT.setAttribute('data-theme', stored ?? prefer);
}

export function toggleTheme() {
  const next = ROOT.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  ROOT.setAttribute('data-theme', next);
  saveTheme(next);
}
