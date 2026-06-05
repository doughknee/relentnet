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

// Auto-cleanup between tests. @testing-library/react only registers
// this hook automatically when Vitest globals are enabled; we run with
// globals: false, so we wire it up explicitly here.
afterEach(() => {
  cleanup()
})
