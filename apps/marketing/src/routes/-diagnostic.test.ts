import { describe, expect, it } from 'vitest'

import {
  diagnosticDeliverables,
  diagnosticFit,
  diagnosticReviewAreas,
} from './diagnostic'

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
})
