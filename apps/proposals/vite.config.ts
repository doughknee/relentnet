import { URL, fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Plain Vite SPA (no TanStack Start): every page here is either internal or an
// unlisted, noindex proposal link, so nothing needs prerendering for SEO. In
// production the Node server (server/main.ts) serves this build plus the API;
// in dev, Vite proxies API traffic to it.
export default defineConfig({
  plugins: [
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    viteReact(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8787',
      '/files': 'http://localhost:8787',
    },
  },
})
