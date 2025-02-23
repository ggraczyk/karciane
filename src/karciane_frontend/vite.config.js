import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  plugins: [sveltekit()],
  resolve: {
    alias: {
      "declarations": path.resolve(__dirname, '/mnt/c/prywatne/krypto/icp/karciane/src/declarations'),
    },
  },
});