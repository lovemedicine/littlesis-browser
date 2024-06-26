import { defineConfig } from 'vite';
import { resolve } from 'path';
import preact from '@preact/preset-vite';
import makeManifest from './scripts/make-manifest';

const src = resolve(__dirname, 'src');
const assetsDir = resolve(src, 'assets');
const outDir = resolve(__dirname, 'dist');
const publicDir = resolve(__dirname, 'public');

export default defineConfig({
  resolve: {
    alias: {
      '@src': src,
      '@assets': assetsDir,
    },
  },
  plugins: [makeManifest(), preact()],
  publicDir,
  build: {
    outDir,
    rollupOptions: {
      input: {
        content: resolve(src, 'content', 'index.ts'),
        background: resolve(src, 'background', 'index.ts'),
        sidepanel: resolve(src, 'sidepanel', 'index.html'),
      },
      output: {
        entryFileNames: chunk => `src/${chunk.name}/index.js`,
      },
    },
  },
});
