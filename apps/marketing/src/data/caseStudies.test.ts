import { describe, expect, it } from 'vitest'

import {
  caseStudies,
  getAdjacentCaseStudies,
  getCaseStudyBySlug,
} from './caseStudies'

describe('caseStudies data', () => {
  it('has exactly 4 live entries', () => {
    expect(caseStudies).toHaveLength(4)
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

  it('gives every heroQuote text and attribution, and never repeats a letter paragraph', () => {
    for (const study of caseStudies) {
      if (!study.heroQuote) continue
      const attribution = study.testimonial?.attribution
      expect(
        study.heroQuote.trim().length,
        `${study.slug}.heroQuote`,
      ).toBeGreaterThan(0)
      expect(attribution?.name, `${study.slug} attribution name`).toBeTruthy()
      expect(attribution?.role, `${study.slug} attribution role`).toBeTruthy()
      for (const paragraph of study.testimonial?.paragraphs ?? []) {
        expect(
          paragraph.trim(),
          `${study.slug}.heroQuote must not duplicate a letter paragraph`,
        ).not.toBe(study.heroQuote.trim())
      }
    }
    const cambridge = getCaseStudyBySlug('cambridge-building-group')
    expect(cambridge?.heroQuote).toMatch(
      /^He has proven to be an exceptional partner/,
    )
  })

  it('fills every section of the detail template for every study', () => {
    for (const study of caseStudies) {
      const { slug, atAGlance, story, testimonial } = study
      expect(study.heroQuote, `${slug}.heroQuote`).toBeTruthy()
      expect(atAGlance.metrics, `${slug} needs three outcomes`).toHaveLength(3)
      for (const metric of atAGlance.metrics ?? []) {
        expect(metric.context, `${slug} "${metric.label}" context`).toBeTruthy()
      }
      expect(
        story.stewardship?.length,
        `${slug}.story.stewardship`,
      ).toBeGreaterThan(0)
      expect(atAGlance.stack, `${slug} needs four stack groups`).toHaveLength(4)
      expect(
        testimonial?.paragraphs.length,
        `${slug}.testimonial`,
      ).toBeGreaterThan(0)
      expect(study.builtBy, `${slug}.builtBy`).toBeDefined()
    }
  })

  it('never renders an empty string anywhere in a study', () => {
    const walk = (value: unknown, path: string): void => {
      if (typeof value === 'string') {
        expect(value.trim(), `${path} is empty`).not.toBe('')
      } else if (Array.isArray(value)) {
        value.forEach((item, i) => walk(item, `${path}[${i}]`))
      } else if (value && typeof value === 'object') {
        for (const [key, item] of Object.entries(value)) {
          walk(item, `${path}.${key}`)
        }
      }
    }
    for (const study of caseStudies) walk(study, study.slug)
  })

  it('ships all 15 Cambridge tools across four stack groups', () => {
    const stack =
      getCaseStudyBySlug('cambridge-building-group')?.atAGlance.stack ?? []
    expect(stack).toHaveLength(4)
    expect(stack.flatMap((g) => g.items)).toHaveLength(15)
  })

  it('gives every builder card an image and a bio', () => {
    for (const study of caseStudies) {
      if (!study.builtBy) continue
      expect(study.builtBy.image.src).toMatch(/^\//)
      expect(study.builtBy.bio.length).toBeGreaterThan(0)
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

  it('every live case study has a concrete companySize', () => {
    for (const study of caseStudies) {
      expect(study.companySize).toBeDefined()
      expect(['startup', 'growth', 'enterprise']).toContain(study.companySize)
    }
  })

  it('ships no placeholder studies on the live site', () => {
    const placeholders = caseStudies.filter((s) =>
      s.slug.startsWith('placeholder-'),
    )
    expect(placeholders).toHaveLength(0)
  })

  it('populates the "customers by size" section with at least one tier', () => {
    // ClientsBySize only renders tabs for tiers that have a live study, so the
    // invariant is that at least one tier is populated — not that all three are.
    const tiers = ['startup', 'growth', 'enterprise'] as const
    const populated = tiers.filter((size) =>
      caseStudies.some((s) => s.companySize === size),
    )
    expect(populated.length).toBeGreaterThan(0)
  })
})
