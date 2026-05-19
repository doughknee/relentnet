import { describe, expect, it } from 'vitest'

import {
  caseStudies,
  getAdjacentCaseStudies,
  getCaseStudyBySlug,
} from './caseStudies'

describe('caseStudies data', () => {
  it('has exactly 5 entries', () => {
    expect(caseStudies).toHaveLength(5)
  })

  it('has unique URL-safe slugs', () => {
    const slugs = caseStudies.map((s) => s.slug)
    const unique = new Set(slugs)
    expect(unique.size).toBe(slugs.length)
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    }
  })

  it('keeps every required story section non-empty', () => {
    for (const study of caseStudies) {
      expect(study.story.problem.length).toBeGreaterThan(0)
      expect(study.story.diagnosis.length).toBeGreaterThan(0)
      expect(study.story.build.length).toBeGreaterThan(0)
      expect(study.story.outcome.length).toBeGreaterThan(0)
    }
  })

  it('preserves summary copy for the portfolio index', () => {
    for (const study of caseStudies) {
      expect(study.summary.problem.length).toBeGreaterThan(0)
      expect(study.summary.diagnosis.length).toBeGreaterThan(0)
      expect(study.summary.build.length).toBeGreaterThan(0)
      expect(study.summary.outcome.length).toBeGreaterThan(0)
    }
  })

  describe('getCaseStudyBySlug', () => {
    it('returns the case study for a known slug', () => {
      const study = getCaseStudyBySlug('scrollr')
      expect(study?.name).toBe('Scrollr')
    })

    it('returns undefined for unknown slugs', () => {
      expect(getCaseStudyBySlug('not-a-real-slug')).toBeUndefined()
    })
  })

  describe('getAdjacentCaseStudies', () => {
    it('returns null prev for the first study', () => {
      const first = caseStudies[0]
      const { prev, next } = getAdjacentCaseStudies(first.slug)
      expect(prev).toBeNull()
      expect(next?.slug).toBe(caseStudies[1].slug)
    })

    it('returns null next for the last study', () => {
      const last = caseStudies[caseStudies.length - 1]
      const { prev, next } = getAdjacentCaseStudies(last.slug)
      expect(next).toBeNull()
      expect(prev?.slug).toBe(caseStudies[caseStudies.length - 2].slug)
    })

    it('returns both for a middle study', () => {
      const middleIndex = Math.floor(caseStudies.length / 2)
      const middle = caseStudies[middleIndex]
      const { prev, next } = getAdjacentCaseStudies(middle.slug)
      expect(prev?.slug).toBe(caseStudies[middleIndex - 1].slug)
      expect(next?.slug).toBe(caseStudies[middleIndex + 1].slug)
    })

    it('returns both null for an unknown slug', () => {
      expect(getAdjacentCaseStudies('not-a-real-slug')).toEqual({
        prev: null,
        next: null,
      })
    })
  })
})
