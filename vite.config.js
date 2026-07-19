import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    // Inline all assets into the HTML — produces single markdown.html
    assetsInlineLimit: 100 * 1024 * 1024, // 100MB — inline everything
    rollupOptions: {
      input: 'index.html',
      output: {
        // Single chunk
        manualChunks: undefined,
        inlineDynamicImports: true,
        entryFileNames:   'assets/[name].js',
        chunkFileNames:   'assets/[name].js',
        assetFileNames:   'assets/[name].[ext]',
      },
    },
  },
  // In dev, resolve the markdown-it ESM import correctly
  optimizeDeps: {
    include: ['markdown-it'],
  },
});
