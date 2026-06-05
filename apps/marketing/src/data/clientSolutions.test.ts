import { describe, expect, it } from 'vitest'

import { clientSolutions } from './clientSolutions'

describe('clientSolutions', () => {
  it('exposes exactly 8 solutions', () => {
    expect(clientSolutions).toHaveLength(8)
  })

  it('every solution has a label, an internal href, and a blurb', () => {
    clientSolutions.forEach((s) => {
      expect(typeof s.label).toBe('string')
      expect(s.label.length).toBeGreaterThan(0)
      expect(s.href).toMatch(/^\//)
      expect(typeof s.blurb).toBe('string')
      expect(s.blurb.length).toBeGreaterThan(0)
    })
  })

  it('uses only known internal route targets', () => {
    const routes = ['/diagnostic', '/process', '/inquire', '/clients']
    clientSolutions.forEach((s) => {
      expect(routes).toContain(s.href)
    })
  })
})
