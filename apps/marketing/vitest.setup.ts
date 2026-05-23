import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Auto-cleanup between tests. @testing-library/react only registers
// this hook automatically when Vitest globals are enabled; we run with
// globals: false, so we wire it up explicitly here.
afterEach(() => {
  cleanup()
})
