import { describe, expect, it } from 'vitest'

import { clientsCta, clientsIntro } from './clients/index'
import { caseStudies } from '@/data/caseStudies'

describe('clients case studies', () => {
  it('frames work as diagnosed friction becoming useful systems', () => {
    expect(clientsIntro.headline).toContain('Diagnosed friction')
    expect(clientsIntro.body).toContain('workflow diagnostic')
    expect(caseStudies).toHaveLength(11)
    expect(
      caseStudies.every((study) => study.summary.diagnosis.length > 0),
    ).toBe(true)
  })

  it('routes the final CTA to the workflow diagnostic', () => {
    expect(clientsCta.to).toBe('/diagnostic')
    expect(clientsCta.label).toBe('Start With a Diagnostic')
  })

  it('every case study has a URL-safe slug suitable for /clients/$slug', () => {
    for (const study of caseStudies) {
      expect(study.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    }
  })
})
