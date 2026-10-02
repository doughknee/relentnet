import { describe, expect, it } from 'vitest'

import { phaseMeta, phases, processProofQuote } from './process'
import { caseStudies } from '@/data/caseStudies'
import { siteConfig } from '@/site.config'

describe('process route content (v4)', () => {
  it('keeps diagnose, prioritize, design, build, and run phases', () => {
    expect(phases.map((phase) => phase.title)).toEqual([
      'Diagnose the workflow',
      'Prioritize the friction',
      'Design the system',
      'Build the operating layer',
      'Run and support the system',
    ])
  })

  it('gives every phase a quote and four deliverables', () => {
    for (const phase of phases) {
      expect(phase.quote.length).toBeGreaterThan(0)
      expect(phase.deliverables).toHaveLength(4)
    }
  })

  it('says who you talk to in each phase', () => {
    expect(phases.map((phase) => phase.who)).toEqual([
      'Brandon and Daniel',
      'Brandon',
      'Brandon',
      'Brandon',
      'Daniel day to day, Brandon for changes',
    ])
  })

  it('shows How long from each published duration', () => {
    const [diagnose, , design, , run] = phases.map(phaseMeta)
    expect(design).toEqual({
      label: 'How long',
      value: 'Part of the Build. Most run 4 to 10 weeks.',
    })
    expect(diagnose.value).toBe(
      'Part of the Diagnostic. Most run 1 to 2 weeks.',
    )
    expect(run.value).toBe("Part of Run. Monthly, 30 days' notice.")
  })

  it('falls back to the engagement price where no duration is set', () => {
    const { duration } = siteConfig.pricing.diagnostic
    siteConfig.pricing.diagnostic.duration = undefined
    try {
      expect(phaseMeta(phases[0])).toEqual({
        label: 'Engagement',
        value:
          'Part of the Diagnostic, ' +
          siteConfig.pricing.diagnostic.price +
          '.',
      })
    } finally {
      siteConfig.pricing.diagnostic.duration = duration
    }
  })

  it('quotes Jason Hall verbatim from his letter', () => {
    const letter = caseStudies.find(
      (s) => s.slug === 'cambridge-building-group',
    )?.testimonial
    expect(letter?.paragraphs.some((p) => p.includes(processProofQuote))).toBe(
      true,
    )
  })
})
