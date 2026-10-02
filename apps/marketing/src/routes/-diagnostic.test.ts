import { describe, expect, it } from 'vitest'

import {
  diagnosticDeliverables,
  diagnosticProofQuote,
  diagnosticReviewAreas,
} from './diagnostic'
import { caseStudies } from '@/data/caseStudies'
import { diagnosticFit } from '@/data/fit'

describe('diagnostic route content (v4)', () => {
  it('promises the four designed deliverables', () => {
    expect(diagnosticDeliverables).toEqual([
      'Workflow map',
      'Friction summary',
      'Priority list',
      'Build recommendation',
    ])
  })

  it('covers the review areas and fit guidance', () => {
    expect(diagnosticReviewAreas).toContain('Current tools')
    expect(diagnosticReviewAreas).toContain('Manual handoffs')
    expect(diagnosticFit.goodFit).toContain('Owner-led businesses')
    expect(diagnosticFit.notFit).toContain('Commodity brochure sites')
  })

  it('quotes Jason Hall verbatim from his letter', () => {
    const letter = caseStudies.find(
      (s) => s.slug === 'cambridge-building-group',
    )?.testimonial
    expect(
      letter?.paragraphs.some((p) => p.includes(diagnosticProofQuote)),
    ).toBe(true)
  })
})
