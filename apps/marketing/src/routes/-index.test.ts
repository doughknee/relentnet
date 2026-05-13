import { describe, expect, it } from 'vitest'

import { homepageHero, methodSteps, problemsSolved } from './index'

describe('homepage positioning', () => {
  it('leads with workflow diagnosis before custom software', () => {
    expect(homepageHero.headline).toBe(
      'Your business has outgrown disconnected tools.',
    )
    expect(homepageHero.body).toContain('workflow diagnostic')
    expect(homepageHero.body).toContain('before prescribing software')
    expect(homepageHero.primaryCta).toBe('Start With a Workflow Diagnostic')
  })

  it('explains the diagnostic-to-stewardship path', () => {
    expect(methodSteps.map((step) => step.title)).toEqual([
      'Diagnose',
      'Prioritize',
      'Design',
      'Build',
      'Steward',
    ])
    expect(problemsSolved).toContain('Reporting gaps')
    expect(problemsSolved).toContain('Manual handoffs')
  })
})
