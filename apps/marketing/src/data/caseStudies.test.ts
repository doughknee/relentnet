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

  it('preserves summary copy for the clients index', () => {
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

  it('uses categorized stack shape on every case study that ships a stack', () => {
    for (const study of caseStudies) {
      const stack = study.atAGlance.stack
      if (!stack) continue
      expect(
        Array.isArray(stack),
        `${study.slug}.atAGlance.stack must be an array`,
      ).toBe(true)
      for (const category of stack) {
        expect(typeof category.category).toBe('string')
        expect(category.category.length).toBeGreaterThan(0)
        expect(Array.isArray(category.items)).toBe(true)
        expect(category.items.length).toBeGreaterThan(0)
        for (const item of category.items) {
          expect(typeof item.label).toBe('string')
          expect(item.label.length).toBeGreaterThan(0)
        }
      }
    }
  })

  it('rejects metrics that are neither flat nor delta', () => {
    // A valid metric must be flat (value only) or delta (from + to only).
    // The data must never contain mixed-shape or empty-shape metrics.
    for (const study of caseStudies) {
      for (const metric of study.atAGlance.metrics ?? []) {
        const hasValue =
          typeof metric.value === 'string' && metric.value.length > 0
        const hasFrom =
          typeof metric.from === 'string' && metric.from.length > 0
        const hasTo = typeof metric.to === 'string' && metric.to.length > 0
        const isFlat = hasValue && !hasFrom && !hasTo
        const isDelta = !hasValue && hasFrom && hasTo
        expect(
          isFlat || isDelta,
          `${study.slug} metric "${metric.label}" must be flat or delta, not mixed`,
        ).toBe(true)
      }
    }
  })

  it('classifies every case study with an engagementType', () => {
    for (const study of caseStudies) {
      expect(
        ['product', 'operations', 'platform'],
        `${study.slug} must declare a valid engagementType`,
      ).toContain(study.engagementType)
    }
  })

  it('promotes exactly one case study via featured: true', () => {
    const featuredSlugs = caseStudies
      .filter((s) => s.featured === true)
      .map((s) => s.slug)
    expect(
      featuredSlugs,
      'exactly one case study may be featured',
    ).toHaveLength(1)
  })

  it('only uses canonical sectionRef values in hero beats', () => {
    // Keep the literal allow-list aligned with CaseStudySectionRef in
    // caseStudies.ts. If the union there changes, update this set too.
    const valid = new Set(['challenge', 'diagnosis', 'solution', 'results'])
    for (const study of caseStudies) {
      const beats = study.hero.beats ?? []
      beats.forEach((beat, i) => {
        expect(
          valid.has(beat.sectionRef),
          `${study.slug} beat[${i}] sectionRef "${beat.sectionRef}" is not canonical`,
        ).toBe(true)
        expect(
          beat.blurb.length,
          `${study.slug} beat[${i}] blurb must be non-empty`,
        ).toBeGreaterThan(0)
        expect(
          beat.image.src.length,
          `${study.slug} beat[${i}] image.src must be non-empty`,
        ).toBeGreaterThan(0)
      })
    }
  })

  it('never repeats a sectionRef inside the same case study hero beats', () => {
    for (const study of caseStudies) {
      const refs = (study.hero.beats ?? []).map((b) => b.sectionRef)
      expect(
        new Set(refs).size,
        `${study.slug} hero beats must not repeat a sectionRef (got [${refs.join(', ')}])`,
      ).toBe(refs.length)
    }
  })
})
