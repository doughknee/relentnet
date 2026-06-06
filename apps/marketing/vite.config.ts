import { URL, fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { tanstackRouter } from '@tanstack/router-plugin/vite'

// Only load the TanStack devtools plugin for the actual dev server. It starts
// a long-lived event-bus server, which would otherwise keep build-time script
// runs (e.g. `vite-node scripts/generate-sitemap.ts`) from exiting and ship
// devtools tooling into the production build.
const enableDevtools = process.env.npm_lifecycle_event === 'dev'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    enableDevtools ? devtools() : null,
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
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
