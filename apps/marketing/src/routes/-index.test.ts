import { describe, expect, it } from 'vitest'

import {
  COUNT_DURATION,
  SUPPORTING_COUNT_DURATION,
  cases,
  heroStat,
  marqueeItems,
  nextTabIndex,
  closingDoors,
  premise,
  stats,
  steps,
} from './index'
import { makeCountEase } from '@/lib/countEase'
import { caseStudies } from '@/data/caseStudies'

/** Seconds a figure spends on its closing eight increments. Bisects the curve,
 *  which is monotonic, then scales the result by the clock it runs on. */
const closingSeconds = (value: number, duration: number) => {
  const ease = makeCountEase(value)
  let lo = 0
  let hi = 1
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2
    if (ease(mid) < (value - 8) / value) lo = mid
    else hi = mid
  }
  return (1 - (lo + hi) / 2) * duration
}

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
    // Assembled from all three parts: tenure carries its "Since " as a prefix
    // so the year can run through the counter like the others.
    expect(
      stats.map(
        (s) =>
          `${'prefix' in s ? s.prefix : ''}${s.value}${
            'suffix' in s ? s.suffix : ''
          }`,
      ),
    ).toEqual(['99.99%', '40+', 'Since 2022'])
  })

  it('spends over two seconds on the last eight hours of the headline count', () => {
    // Curve and duration are tuned against each other, so neither is safe to
    // move alone: this is the beat Brandon asked the counter to end on.
    const seconds = closingSeconds(heroStat.value, COUNT_DURATION)
    expect(seconds).toBeGreaterThan(2.2)
    expect(seconds).toBeLessThan(2.6)
  })

  it('runs the supporting figures quicker without flattening their ending', () => {
    // They carry less than the headline, so they get a shorter clock. The
    // second half guards the thing that shortening it could quietly ruin: the
    // closing eight increments are a fixed SHARE of the run, so they shrink
    // with it, and there is a point past which they stop reading as a settle.
    expect(SUPPORTING_COUNT_DURATION).toBeLessThan(COUNT_DURATION)
    for (const stat of stats) {
      expect(
        closingSeconds(stat.value, SUPPORTING_COUNT_DURATION),
      ).toBeGreaterThan(1.2)
    }
  })

  it('dials and mails what the closing cards display', () => {
    // The bug worth guarding is a card whose link goes somewhere other than the
    // number or address printed on it, which nothing on the page would reveal.
    for (const { action } of closingDoors) {
      if (!action.href) continue
      if (action.href.startsWith('mailto:')) {
        expect(action.href).toBe(`mailto:${action.label}`)
      } else {
        // Digits only: the href carries a country code the label omits.
        expect(action.href.replace(/\D/g, '')).toContain(
          action.label.replace(/\D/g, ''),
        )
      }
    }
  })

  it('closes on three doors with exactly one emphasized', () => {
    expect(closingDoors).toHaveLength(premise.answers.length)
    // Every card needs somewhere to go, and the gold top rule only means
    // "start here" while it is on one card.
    expect(
      closingDoors.every((d) => d.action.to || d.action.href),
    ).toBe(true)
    expect(closingDoors.filter((d) => d.emphasized)).toHaveLength(1)
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
