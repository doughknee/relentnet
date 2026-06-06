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
      // index.html. Point it at /portal instead: the shell is generic chrome
      // (no route content leaks in), and since /portal is noindex, the 404
      // fallback shell is correctly noindex too.
      spa: { enabled: true, maskPath: '/portal' },
      prerender: {
        enabled: true,
        crawlLinks: true,
        autoSubfolderIndex: true,
        // /sow is a client-side redirect; nothing to prerender.
        filter: ({ path }) => path !== '/sow',
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
