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

  it('claims no per-phase contact that /about does not state', () => {
    for (const phase of phases) expect(phase.who).toBeUndefined()
  })

  it('shows How long only where a duration is published', () => {
    const [diagnose, , design, , run] = phases.map(phaseMeta)
    expect(design).toEqual({
      label: 'How long',
      value: 'Part of the Build. Most run 4 to 10 weeks.',
    })
    expect(diagnose.label).toBe('Engagement')
    expect(diagnose.value).toBe(
      'Part of the Diagnostic, ' + siteConfig.pricing.diagnostic.price + '.',
    )
    expect(run.label).toBe('Engagement')
    expect(JSON.stringify([diagnose, run])).not.toMatch(/weeks/)
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
