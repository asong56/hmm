// ── main.js ───────────────────────────────────────────────────────────────────
import { initTheme, toggleTheme }                from './theme.js';
import { initRenderer }                          from './renderer.js';
import { loadDraft }                             from './storage.js';
import { initEditor, getValue, setValue,
         focusEditor, markClean, setDocTitle }   from './editor.js';
import { openFile, saveFile, readDroppedFile }   from './files.js';

// ── Mode ──────────────────────────────────────────────────────────────────────
const app = document.getElementById('app');
let mode = 'edit';

function setMode(next) {
  mode = next;
  app.dataset.mode = next;
  if (next === 'edit') focusEditor();
}

// ── File ops ──────────────────────────────────────────────────────────────────
async function handleOpen() {
  try {
    const { text, name } = await openFile();
    setValue(text);
    setDocTitle(name);
    markClean();
  } catch (e) {
    if (e.name !== 'AbortError') console.error(e);
  }
}

async function handleSave() {
  try {
    const name = await saveFile(getValue());
    setDocTitle(name);
    markClean();
  } catch (e) {
    if (e.name !== 'AbortError') console.error(e);
  }
}

// ── Keyboard shortcuts ────────────────────────────────────────────────────────
document.addEventListener('keydown', (e) => {
  const mod = e.ctrlKey || e.metaKey;
  if      (mod && e.key === 's') { e.preventDefault(); handleSave(); }
  else if (mod && e.key === 'o') { e.preventDefault(); handleOpen(); }
  else if (mod && e.key === 'r') { e.preventDefault(); setMode(mode === 'edit' ? 'read' : 'edit'); }
});

// ── Drag & drop ───────────────────────────────────────────────────────────────
const dropOverlay = document.getElementById('drop-overlay');
let dragDepth = 0;

document.addEventListener('dragenter', (e) => { e.preventDefault(); if (++dragDepth === 1) dropOverlay.classList.add('visible'); });
document.addEventListener('dragleave', ()  => { if (--dragDepth === 0) dropOverlay.classList.remove('visible'); });
document.addEventListener('dragover',  (e) => e.preventDefault());
document.addEventListener('drop', async (e) => {
  e.preventDefault();
  dragDepth = 0;
  dropOverlay.classList.remove('visible');
  const file = e.dataTransfer?.files?.[0];
  if (!file) return;
  try {
    const { text, name } = await readDroppedFile(file);
    setValue(text);
    setDocTitle(name);
    markClean();
    setMode('edit');
  } catch (err) { console.error(err); }
});

// ── Buttons ───────────────────────────────────────────────────────────────────
document.getElementById('btn-open') .addEventListener('click', handleOpen);
document.getElementById('btn-save') .addEventListener('click', handleSave);
document.getElementById('btn-read') .addEventListener('click', () => setMode(mode === 'edit' ? 'read' : 'edit'));
document.getElementById('btn-theme').addEventListener('click', toggleTheme);

// ── Boot ──────────────────────────────────────────────────────────────────────
async function boot() {
  initTheme();
  await initRenderer();
  initEditor(loadDraft());
  focusEditor();
}

boot();
