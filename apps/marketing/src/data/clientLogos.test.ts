import { describe, expect, it } from 'vitest'

import { clientLogos } from './clientLogos'

describe('clientLogos', () => {
  it('exports at least 8 entries', () => {
    expect(clientLogos.length).toBeGreaterThanOrEqual(8)
  })

  it('every entry has a name and a logoSrc', () => {
    for (const entry of clientLogos) {
      expect(entry.name.length).toBeGreaterThan(0)
      expect(entry.logoSrc).toMatch(/^\/logos\/clients\//)
    }
  })

  it('marks sample entries as such', () => {
    // Today every entry should be a sample. As real logos drop in, flip
    // isSample to false per entry. This test passes either way; it
    // enforces that the flag is always set.
    for (const entry of clientLogos) {
      expect(typeof entry.isSample).toBe('boolean')
    }
  })
})
