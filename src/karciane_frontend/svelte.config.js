import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      pages: 'dist',
      assets: 'dist',
      fallback: undefined,
      precompress: false,
      strict: true,
    }),
    prerender: {
      enabled: false, // Wy³¹cz prerendering dla strony z akcjami
    },
    csr: true, // W³¹cz Client-Side Rendering
  },
  preprocess: vitePreprocess()
};

export default config;