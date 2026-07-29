import { describe, expect, it } from 'vitest'

import { solutions, studies } from './clients/index'
import { caseStudies } from '@/data/caseStudies'

describe('clients page (v4)', () => {
  it('shows all four studies, each linking to a real detail page', () => {
    expect(studies).toHaveLength(4)
    const knownSlugs = new Set(caseStudies.map((study) => study.slug))
    for (const s of studies) {
      expect(knownSlugs).toContain(s.slug)
      expect(s.image.startsWith('/case-studies/')).toBe(true)
    }
  })

  it('lists the eight designed capabilities', () => {
    expect(solutions).toHaveLength(8)
    expect(solutions.map((s) => s.label)).toContain(
      'Diagnose workflow friction',
    )
    expect(solutions.map((s) => s.label)).toContain('Steward systems over time')
  })

  it('every case study has a URL-safe slug suitable for /clients/$slug', () => {
    for (const study of caseStudies) {
      expect(study.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    }
  })
})
