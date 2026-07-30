import { describe, expect, it } from 'vitest'

import {
  cases,
  marqueeItems,
  nextTabIndex,
  premise,
  stats,
  steps,
} from './index'
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

  it('walks the case tabs by keyboard, wrapping at both ends', () => {
    const n = cases.length
    expect(nextTabIndex('ArrowRight', 0, n)).toBe(1)
    expect(nextTabIndex('ArrowLeft', 1, n)).toBe(0)
    // Wrapping is the half that silently breaks off-by-one.
    expect(nextTabIndex('ArrowRight', n - 1, n)).toBe(0)
    expect(nextTabIndex('ArrowLeft', 0, n)).toBe(n - 1)
    expect(nextTabIndex('Home', 2, n)).toBe(0)
    expect(nextTabIndex('End', 0, n)).toBe(n - 1)
    // Keys the tablist doesn't own must fall through untouched.
    expect(nextTabIndex('Enter', 1, n)).toBeNull()
    expect(nextTabIndex('Tab', 1, n)).toBeNull()
  })

  it('pins the four company-level stat claims', () => {
    expect(
      stats.map((s) => `${s.value}${'suffix' in s ? s.suffix : ''}`),
    ).toEqual(['40+', '1000+', '99.9%', '4'])
  })
})
