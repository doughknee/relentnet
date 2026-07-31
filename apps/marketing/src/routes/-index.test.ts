import { describe, expect, it } from 'vitest'

import {
  COUNT_DURATION,
  cases,
  heroStat,
  marqueeItems,
  nextTabIndex,
  premise,
  stats,
  steps,
} from './index'
import { makeCountEase } from '@/lib/countEase'
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

  it('pins the company-level stat claims', () => {
    expect(`${heroStat.value}${heroStat.suffix}`).toBe('10000+')
    expect(
      stats.map((s) => `${s.value}${'suffix' in s ? s.suffix : ''}`),
    ).toEqual(['99.99%', '40+', 'Since 2022'])
  })

  it('spends over two seconds on the last eight hours of the headline count', () => {
    // Curve and duration are tuned against each other, so neither is safe to
    // move alone: this is the beat Brandon asked the counter to end on.
    const ease = makeCountEase(heroStat.value)
    let lo = 0
    let hi = 1
    for (let i = 0; i < 200; i++) {
      const mid = (lo + hi) / 2
      if (ease(mid) < (heroStat.value - 8) / heroStat.value) lo = mid
      else hi = mid
    }
    const closingSeconds = (1 - (lo + hi) / 2) * COUNT_DURATION
    expect(closingSeconds).toBeGreaterThan(2.2)
    expect(closingSeconds).toBeLessThan(2.6)
  })

  it('renders uptime to two decimals so 99.99 never rounds to 100', () => {
    const uptime = stats.find((s) => s.label.startsWith('Uptime'))
    if (!uptime || !('format' in uptime)) throw new Error('uptime stat missing')
    expect(uptime.format.maximumFractionDigits).toBe(2)
    expect(
      new Intl.NumberFormat('en-US', uptime.format).format(uptime.value),
    ).toBe('99.99')
  })
})
