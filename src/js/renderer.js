// ── Renderer ──────────────────────────────────────────────────────────────────
// Wraps markdown-it. Static import — Vite bundles and inlines it.

import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({ html: false, linkify: true, typographer: true });

// Kept async so call sites don't need to change if we add plugins later
export async function initRenderer() {}

export function render(markdown) {
  return md.render(markdown);
}
