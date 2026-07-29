import { describe, expect, it } from 'vitest'

import { cases, marqueeItems, premise, steps } from './index'
import { caseStudies } from '@/data/caseStudies'

describe('homepage content (v4)', () => {
  it('walks diagnose → build → steward', () => {
    expect(steps.map((step) => step.title)).toEqual([
      'Diagnose',
      'Build',
      'Steward',
    ])
  })

  it('tabs cover the four case studies and link to real detail pages', () => {
    expect(cases).toHaveLength(4)
    const knownSlugs = new Set(caseStudies.map((study) => study.slug))
    for (const c of cases) {
      expect(knownSlugs).toContain(c.slug)
      expect(c.image.startsWith('/case-studies/')).toBe(true)
    }
  })

  it('leads with the three-answer premise, honest option included', () => {
    expect(premise.answers.map((a) => a.title)).toEqual([
      'Build',
      'Connect',
      'Don’t build yet',
    ])
    expect(premise.intro).toContain('free')
  })

  it('runs the eight designed pain points through the marquee', () => {
    expect(marqueeItems).toHaveLength(8)
    expect(marqueeItems).toContain('Spreadsheet chaos')
    expect(marqueeItems).toContain('Manual handoffs')
  })
})
