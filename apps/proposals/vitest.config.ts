import { URL, fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

// Tests cover the server (PDF parsing, store, API) and run in Node.
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
  },
})
