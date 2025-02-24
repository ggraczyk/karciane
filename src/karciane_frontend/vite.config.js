import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  plugins: [sveltekit()],
  resolve: {
    alias: {
      "declarations": path.resolve(__dirname, '../../src/declarations'),
    },
  },
  define: {
    'process.env': '{}', // Polyfill dla process.env

  },
});