import { describe, expect, it } from 'vitest'

import {
  diagnosticDeliverables,
  diagnosticFit,
  diagnosticHero,
  diagnosticNextSteps,
  diagnosticReviewAreas,
} from './diagnostic'

describe('diagnostic route content', () => {
  it('positions the diagnostic as the first buying step', () => {
    expect(diagnosticHero.headline).toBe(
      'Map the workflow before building the system.',
    )
    expect(diagnosticHero.body).toContain('operational friction')
    expect(diagnosticHero.body).toContain('before prescribing software')
    expect(diagnosticHero.primaryCta).toBe('Request a Workflow Diagnostic')
  })

  it('explains review areas, deliverables, fit, and next steps', () => {
    expect(diagnosticReviewAreas).toContain('Current tools')
    expect(diagnosticReviewAreas).toContain('Manual handoffs')
    expect(diagnosticDeliverables).toContain('Workflow map')
    expect(diagnosticDeliverables).toContain('Build recommendation')
    expect(diagnosticFit.goodFit).toContain('Owner-led businesses')
    expect(diagnosticFit.notFit).toContain('Commodity brochure sites')
    expect(diagnosticNextSteps).toContain('Custom operating system')
    expect(diagnosticNextSteps).toContain('No-build recommendation')
  })
})
