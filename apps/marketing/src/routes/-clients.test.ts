import { describe, expect, it } from 'vitest'

import { clientsCta, clientsIntro } from './clients/index'
import { caseStudies } from '@/data/caseStudies'

describe('clients case studies', () => {
  it('frames work as diagnostic-first', () => {
    expect(clientsIntro.headline.toLowerCase()).toContain('diagnostic')
    expect(clientsIntro.body.toLowerCase()).toContain('diagnos')
    expect(caseStudies.length).toBeGreaterThanOrEqual(3)
    expect(
      caseStudies.every((study) => study.summary.diagnosis.length > 0),
    ).toBe(true)
  })

  it('routes the final CTA to the workflow diagnostic', () => {
    expect(clientsCta.to).toBe('/diagnostic')
    expect(clientsCta.label.toLowerCase()).toContain('diagnostic')
  })

  it('every case study has a URL-safe slug suitable for /clients/$slug', () => {
    for (const study of caseStudies) {
      expect(study.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    }
  })
})
