import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      pages: 'dist',
      assets: 'dist',
      fallback: 'index.html', // Fallback dla SPA
      precompress: false,
      strict: false // Pozwól na dynamiczne trasy
    }),
    paths: {
      base: '' // Upewnij si?, ?e base path jest pusty lub poprawny
    },
    // Wy??cz SSR dla wszystkich tras
    //prerender: { entries: [] }
  }
};

export default config;