// vite.config.js
import { fileURLToPath, URL } from "url";
import { sveltekit } from "file:///mnt/c/prywatne/krypto/icp/karciane/node_modules/@sveltejs/kit/src/exports/vite/index.js";
import { defineConfig } from "file:///mnt/c/prywatne/krypto/icp/karciane/node_modules/vite/dist/node/index.js";
import environment from "file:///mnt/c/prywatne/krypto/icp/karciane/node_modules/vite-plugin-environment/dist/index.js";
import dotenv from "file:///mnt/c/prywatne/krypto/icp/karciane/node_modules/dotenv/lib/main.js";
var __vite_injected_original_import_meta_url = "file:///mnt/c/prywatne/krypto/icp/karciane/src/karciane_frontend/vite.config.js";
dotenv.config({ path: "../../.env" });
var vite_config_default = defineConfig({
  build: {
    emptyOutDir: true
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis"
      }
    }
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4943",
        changeOrigin: true
      }
    }
  },
  plugins: [
    sveltekit(),
    environment("all", { prefix: "CANISTER_" }),
    environment("all", { prefix: "DFX_" })
  ],
  resolve: {
    alias: [
      {
        find: "declarations",
        replacement: fileURLToPath(
          new URL("../declarations", __vite_injected_original_import_meta_url)
        )
      }
    ]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvbW50L2MvcHJ5d2F0bmUva3J5cHRvL2ljcC9rYXJjaWFuZS9zcmMva2FyY2lhbmVfZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9tbnQvYy9wcnl3YXRuZS9rcnlwdG8vaWNwL2thcmNpYW5lL3NyYy9rYXJjaWFuZV9mcm9udGVuZC92aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vbW50L2MvcHJ5d2F0bmUva3J5cHRvL2ljcC9rYXJjaWFuZS9zcmMva2FyY2lhbmVfZnJvbnRlbmQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tICd1cmwnO1xuaW1wb3J0IHsgc3ZlbHRla2l0IH0gZnJvbSAnQHN2ZWx0ZWpzL2tpdC92aXRlJztcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IGVudmlyb25tZW50IGZyb20gJ3ZpdGUtcGx1Z2luLWVudmlyb25tZW50JztcbmltcG9ydCBkb3RlbnYgZnJvbSAnZG90ZW52JztcblxuZG90ZW52LmNvbmZpZyh7IHBhdGg6ICcuLi8uLi8uZW52JyB9KTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgYnVpbGQ6IHtcbiAgICBlbXB0eU91dERpcjogdHJ1ZSxcbiAgfSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgZXNidWlsZE9wdGlvbnM6IHtcbiAgICAgIGRlZmluZToge1xuICAgICAgICBnbG9iYWw6IFwiZ2xvYmFsVGhpc1wiLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBwcm94eToge1xuICAgICAgXCIvYXBpXCI6IHtcbiAgICAgICAgdGFyZ2V0OiBcImh0dHA6Ly8xMjcuMC4wLjE6NDk0M1wiLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICBzdmVsdGVraXQoKSxcbiAgICBlbnZpcm9ubWVudChcImFsbFwiLCB7IHByZWZpeDogXCJDQU5JU1RFUl9cIiB9KSxcbiAgICBlbnZpcm9ubWVudChcImFsbFwiLCB7IHByZWZpeDogXCJERlhfXCIgfSksXG4gIF0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczogW1xuICAgICAge1xuICAgICAgICBmaW5kOiBcImRlY2xhcmF0aW9uc1wiLFxuICAgICAgICByZXBsYWNlbWVudDogZmlsZVVSTFRvUGF0aChcbiAgICAgICAgICBuZXcgVVJMKFwiLi4vZGVjbGFyYXRpb25zXCIsIGltcG9ydC5tZXRhLnVybClcbiAgICAgICAgKSxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE2VixTQUFTLGVBQWUsV0FBVztBQUNoWSxTQUFTLGlCQUFpQjtBQUMxQixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLGlCQUFpQjtBQUN4QixPQUFPLFlBQVk7QUFKdU0sSUFBTSwyQ0FBMkM7QUFNM1EsT0FBTyxPQUFPLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFFcEMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsT0FBTztBQUFBLElBQ0wsYUFBYTtBQUFBLEVBQ2Y7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLGdCQUFnQjtBQUFBLE1BQ2QsUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBLE1BQ1Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLE1BQ2hCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLFVBQVU7QUFBQSxJQUNWLFlBQVksT0FBTyxFQUFFLFFBQVEsWUFBWSxDQUFDO0FBQUEsSUFDMUMsWUFBWSxPQUFPLEVBQUUsUUFBUSxPQUFPLENBQUM7QUFBQSxFQUN2QztBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0w7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLGFBQWE7QUFBQSxVQUNYLElBQUksSUFBSSxtQkFBbUIsd0NBQWU7QUFBQSxRQUM1QztBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
