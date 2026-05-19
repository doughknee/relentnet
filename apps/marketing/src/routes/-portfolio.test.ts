import { describe, expect, it } from 'vitest'

import { caseStudies } from '@/data/caseStudies'

import { portfolioCta, portfolioIntro } from './portfolio'

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

  it('every case study has a URL-safe slug suitable for /portfolio/$slug', () => {
    for (const study of caseStudies) {
      expect(study.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    }
  })
})
