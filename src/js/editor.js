// ── Editor ────────────────────────────────────────────────────────────────────
// Manages the textarea, dirty state, and title-bar indicator.

import { saveDraft } from './storage.js';
import { render }    from './renderer.js';

const textarea      = document.getElementById('editor');
const readerContent = document.getElementById('reader-content');

let dirty      = false;
let docTitle   = 'hmm';
let rafPending = false;

// ── Title ─────────────────────────────────────────────────────────────────────
function syncTitle() {
  document.title = dirty ? `· ${docTitle}` : docTitle;
}

export function setDocTitle(name) {
  docTitle = name || 'hmm';
  syncTitle();
}

// ── Dirty ─────────────────────────────────────────────────────────────────────
export function markClean() {
  dirty = false;
  syncTitle();
}

// ── Render (rAF-throttled) ────────────────────────────────────────────────────
function scheduleRender() {
  if (rafPending) return;
  rafPending = true;
  requestAnimationFrame(() => {
    rafPending = false;
    readerContent.innerHTML = render(textarea.value);
  });
}

// ── Init ──────────────────────────────────────────────────────────────────────
export function initEditor(initialText) {
  textarea.value = initialText;
  scheduleRender();

  textarea.addEventListener('input', () => {
    if (!dirty) { dirty = true; syncTitle(); }
    saveDraft(textarea.value);
    scheduleRender();
  });
}

// ── Public API ────────────────────────────────────────────────────────────────
export function getValue()     { return textarea.value; }
export function setValue(text) { textarea.value = text; scheduleRender(); }
export function focusEditor()  { textarea.focus(); }
