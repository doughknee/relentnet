import { URL, fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { devtools } from '@tanstack/devtools-vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Only load the TanStack devtools plugin for the actual dev server. It starts
// a long-lived event-bus server, which would otherwise keep build-time script
// runs from exiting and ship devtools tooling into the production build.
const enableDevtools = process.env.npm_lifecycle_event === 'dev'

// https://vitejs.dev/config/
export default defineConfig({
  // Dev tooling assigns PORT when it manages the server; default stays 3000
  // for manual `npm run dev`.
  server: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 3000,
  },
  plugins: [
    enableDevtools ? devtools() : null,
    // SPA mode: emits a static client build (dist/client) + a prerendered
    // shell, hostable on a plain static file server (Nginx) with no Node
    // runtime. Prerendering additionally renders each route to static HTML so
    // crawlers and social scrapers get per-route <head> tags. This app has no
    // server functions (the inquiry form posts to an external webhook), so
    // SPA mode is a clean fit.
    tanstackStart({
      // SPA mode renders its fallback shell (dist/client/_shell.html) from the
      // route at `maskPath`, and does NOT emit a content page for that route.
      // It defaults to '/', which would rob the home page of a prerendered
      // index.html. Point it at /404: the shell is generic chrome (no route
      // content leaks in) with a noindex "Page not found" head, and every real
      // route, /portal included, keeps its own prerendered page. nginx no
      // longer falls back to the shell, so nothing serves it.
      spa: { enabled: true, maskPath: '/404' },
      // The mask claims '/404', so the content page is requested as '/404/'
      // (a distinct key) and written to dist/client/404.html, which nginx
      // serves with status 404 for every unknown URL.
      pages: [{ path: '/404/', prerender: { outputPath: '/404.html' } }],
      prerender: {
        enabled: true,
        crawlLinks: true,
        autoSubfolderIndex: true,
      },
    }),
    viteReact(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
