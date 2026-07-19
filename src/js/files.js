// ── Files ─────────────────────────────────────────────────────────────────────
// File System Access API — showOpenFilePicker / showSaveFilePicker directly.

function todayFilename() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}${m}${day}.md`;
}

const OPTS_OPEN = {
  types: [{ description: 'Markdown', accept: { 'text/markdown': ['.md', '.markdown', '.txt'] } }],
  multiple: false,
};

// Keep a file handle so Ctrl+S overwrites the same file without re-picking
let fileHandle = null;

export async function openFile() {
  const [handle] = await window.showOpenFilePicker(OPTS_OPEN);
  fileHandle = handle;
  const file = await handle.getFile();
  return { text: await file.text(), name: file.name };
}

export async function saveFile(text) {
  if (!fileHandle) {
    fileHandle = await window.showSaveFilePicker({
      types: [{ description: 'Markdown', accept: { 'text/markdown': ['.md'] } }],
      suggestedName: todayFilename(),
    });
  }
  const writable = await fileHandle.createWritable();
  await writable.write(text);
  await writable.close();
  return fileHandle.name;
}

export async function readDroppedFile(file) {
  fileHandle = null; // dropped files carry no FS handle
  return { text: await file.text(), name: file.name };
}
