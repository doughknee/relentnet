import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// jsdom has no IntersectionObserver, which the Reveal-on-scroll wrapper uses.
// Mock it so components that animate in still render in tests.
class IntersectionObserverMock {
  readonly root = null
  readonly rootMargin = ''
  readonly thresholds: ReadonlyArray<number> = []
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)

// jsdom defines `window` but not `matchMedia`, which ThemeProvider reads at
// module load to track the OS color-scheme preference. Provide a minimal mock
// so any suite that pulls in the theme provider can evaluate it.
vi.stubGlobal('matchMedia', (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: () => {},
  removeEventListener: () => {},
  addListener: () => {},
  removeListener: () => {},
  dispatchEvent: () => false,
}))

// Auto-cleanup between tests. @testing-library/react only registers
// this hook automatically when Vitest globals are enabled; we run with
// globals: false, so we wire it up explicitly here.
afterEach(() => {
  cleanup()
})
