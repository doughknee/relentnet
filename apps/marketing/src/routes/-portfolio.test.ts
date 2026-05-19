import { describe, expect, it } from 'vitest'

import { portfolioCta, portfolioIntro } from './portfolio'
import { caseStudies } from '@/data/caseStudies'


describe('portfolio case studies', () => {
  it('frames work as diagnosed friction becoming useful systems', () => {
    expect(portfolioIntro.headline).toContain('Diagnosed friction')
    expect(portfolioIntro.body).toContain('workflow diagnostic')
    expect(caseStudies).toHaveLength(5)
    expect(
      caseStudies.every((study) => study.summary.diagnosis.length > 0),
    ).toBe(true)
  })

  it('routes the final CTA to the workflow diagnostic', () => {
    expect(portfolioCta.to).toBe('/diagnostic')
    expect(portfolioCta.label).toBe('Start With a Diagnostic')
  })
})
