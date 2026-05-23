# Clients Stripe-Mirror Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite `/clients` index and `/clients/$slug` detail pages so their layouts are near-mirror replicas of Stripe's `/customers` and `/customers/figma` pages, while preserving the StarParticles background, gold-on-dark theme tokens, existing button styles, and case-study content. Use dummy/placeholder data wherever real content is missing.

**Architecture:** Single-column, left-aligned layouts. Index has 7 sections (hero, featured-tiles row, measurable-results stats, logo strip, by-size tab grid, building-together vertical tabs, 3-panel closing CTAs). Detail page has 9 sections (hero, products row, big stats, inline CTA, hero image, narrative, pullquote, read-more tiles, closing CTAs). Square edges throughout (no `rounded-*`). All sections layer above the StarParticles via `relative z-10`.

**Tech Stack:** Same as prior work — React 19, Vite 7, TanStack Router (file-based), TypeScript strict, Tailwind 4. Tests via Vitest + Testing Library. No new dependencies needed.

**Spec:** `docs/superpowers/specs/2026-05-23-clients-stripe-mirror-design.md`

**Supersedes:** Most of the work shipped in PR #9. Many components from that PR are deleted in this plan (cycler, stats rail, stack card, 7 of 9 band components).

---

## Branch setup (controller does this before Task 1)

```bash
cd /home/phoenix/code/relentnet
git checkout feat/case-studies
git pull origin feat/case-studies
git checkout -b feat/clients-stripe-mirror
```

All plan tasks commit to `feat/clients-stripe-mirror`. PR #9 (`feat/case-studies`) remains intact as a fallback.

---

## Task 1: Generate placeholder image assets + add CaseStudy data-model fields

**Files:**
- Create: `apps/marketing/public/case-studies/placeholder/portrait.svg`
- Create: `apps/marketing/public/case-studies/placeholder/landscape.svg`
- Modify: `apps/marketing/src/data/caseStudies.ts`
- Modify: `apps/marketing/src/data/caseStudies.test.ts`

- [ ] **Step 1.1: Write portrait placeholder SVG**

Create `apps/marketing/public/case-studies/placeholder/portrait.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" role="img" aria-label="Case study placeholder image">
  <rect x="0" y="0" width="600" height="800" fill="#1a1a1a"/>
  <rect x="2" y="2" width="596" height="796" fill="none" stroke="#2a2a2a" stroke-width="2"/>
  <text x="300" y="380" text-anchor="middle" font-family="serif" font-size="32" fill="#666">Case study</text>
  <text x="300" y="430" text-anchor="middle" font-family="serif" font-size="32" fill="#666">coming soon</text>
</svg>
```

- [ ] **Step 1.2: Write landscape placeholder SVG**

Create `apps/marketing/public/case-studies/placeholder/landscape.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-label="Case study placeholder image">
  <rect x="0" y="0" width="1600" height="900" fill="#1a1a1a"/>
  <rect x="2" y="2" width="1596" height="896" fill="none" stroke="#2a2a2a" stroke-width="2"/>
  <text x="800" y="430" text-anchor="middle" font-family="serif" font-size="56" fill="#666">Case study</text>
  <text x="800" y="510" text-anchor="middle" font-family="serif" font-size="56" fill="#666">coming soon</text>
</svg>
```

- [ ] **Step 1.3: Extend the `CaseStudy` interface in `caseStudies.ts`**

In `apps/marketing/src/data/caseStudies.ts`, find the existing `export interface CaseStudy { ... }` block. After the existing fields and before the closing brace, add:

```ts
  /** Used by the index featured-tile band; falls back to hero.image cropped. */
  portraitImage?: CaseStudyImage

  /** One huge stat surfaced in the index "Measurable results" band. */
  featuredStat?: { value: string; description: string }

  /** Pill in the detail-page "Products used" row. Falls back to omitted. */
  region?: string

  /** Drives the index "Customers by size" tab grouping. */
  companySize: 'startup' | 'growth' | 'enterprise' | 'placeholder'

  /** Detail-page hero headline. Falls back to hero.tagline. */
  detailHeadline?: string

  /** Detail-page body paragraph. Falls back to combining hero.tagline + summary.problem. */
  detailBody?: string

  /** Detail-page Results section entries. Falls back to a single entry derived from summary.outcome. */
  results?: ReadonlyArray<{ headline: string; body: string }>
```

Note `companySize` is REQUIRED (no `?`). Every existing case study below must add this field set to `'placeholder'`.

- [ ] **Step 1.4: Add `companySize: 'placeholder'` to every existing case study**

In `apps/marketing/src/data/caseStudies.ts`, find each of the 5 existing entries inside `caseStudies` (slugs: `scrollr`, `cambridge-building-group`, `courtcommand`, `vm-homes`, `star-kids`). For each, add `companySize: 'placeholder',` near the top of the entry (e.g., right after the `featured` line, or right after `engagementType`).

Example (for the `scrollr` entry near line 176–177):
```ts
    engagementType: 'product',
    featured: true,
    companySize: 'placeholder',
```

Do this for all 5 entries.

- [ ] **Step 1.5: Add `featuredStat` to Scrollr**

Scrollr is the only real entry with a concrete number (`1 → 3 platforms`). Add to the `scrollr` entry, near `featured: true`:

```ts
    featuredStat: {
      value: '1 → 3',
      description: 'Scrollr shipped from a single Chrome extension to native apps on macOS, Windows, and Linux.',
    },
```

For the other 4 real studies, leave `featuredStat` unset (the component will fill those slots with placeholders).

- [ ] **Step 1.6: Append 6 placeholder case-study entries**

In `apps/marketing/src/data/caseStudies.ts`, after the closing `]` of the existing `caseStudies` array, replace the closing bracket so that the array continues with 6 new placeholder entries. Each placeholder follows this shape (varies per entry):

```ts
  {
    slug: 'placeholder-1',
    name: '[Company name]',
    url: 'https://example.com',
    industry: '[Industry]',
    systemType: '[System type]',
    engagementType: 'product',
    companySize: 'startup',
    featuredStat: {
      value: '[Big number]',
      description: '[One-line attribution of what changed at the client.]',
    },
    summary: {
      problem: '[Describe the friction in the operation before we engaged.]',
      diagnosis: '[Describe what the diagnostic surfaced.]',
      build: '[Describe what we shipped.]',
      outcome: '[Describe the measurable change.]',
    },
    hero: {
      tagline: '[Short single-sentence tagline.]',
      image: {
        src: '/case-studies/placeholder/landscape.svg',
        alt: 'Case study placeholder image',
        width: 1600,
        height: 900,
      },
    },
    portraitImage: {
      src: '/case-studies/placeholder/portrait.svg',
      alt: 'Case study placeholder image',
      width: 600,
      height: 800,
    },
    atAGlance: {
      stack: [
        {
          category: '[Layer]',
          items: [
            { label: '[Tech 1]' },
            { label: '[Tech 2]' },
          ],
        },
      ],
    },
    story: {
      problem: [{ type: 'p', text: '[Long-form challenge narrative.]' }],
      diagnosis: [{ type: 'p', text: '[Long-form diagnosis narrative.]' }],
      build: [{ type: 'p', text: '[Long-form build narrative.]' }],
      outcome: [{ type: 'p', text: '[Long-form outcome narrative.]' }],
    },
    meta: {
      title: '[Company name] | RelentNet Case Study',
      description: '[Meta description.]',
    },
  },
```

Generate 6 placeholders with these `slug` + `companySize` values:
1. `placeholder-1` → `companySize: 'startup'`, `engagementType: 'product'`
2. `placeholder-2` → `companySize: 'startup'`, `engagementType: 'operations'`
3. `placeholder-3` → `companySize: 'startup'`, `engagementType: 'platform'`
4. `placeholder-4` → `companySize: 'growth'`, `engagementType: 'product'`
5. `placeholder-5` → `companySize: 'growth'`, `engagementType: 'operations'`
6. `placeholder-6` → `companySize: 'enterprise'`, `engagementType: 'platform'`

Each gets a unique `name` (`[Company One]` through `[Company Six]`), but otherwise the same shape. All have `featuredStat` set (placeholder text) so the Measurable Results band has 4 candidates after Scrollr — pick the strongest from the data each time the band renders.

- [ ] **Step 1.7: Update data tests to cover the new field**

In `apps/marketing/src/data/caseStudies.test.ts`, add a new test inside the existing `describe('caseStudies data', ...)` block:

```ts
  it('every case study has a companySize set', () => {
    for (const study of caseStudies) {
      expect(study.companySize).toBeDefined()
      expect(['startup', 'growth', 'enterprise', 'placeholder']).toContain(study.companySize)
    }
  })

  it('placeholder studies are marked with placeholder slugs', () => {
    const placeholders = caseStudies.filter((s) => s.slug.startsWith('placeholder-'))
    expect(placeholders.length).toBeGreaterThanOrEqual(6)
    for (const p of placeholders) {
      expect(p.companySize).not.toBe('placeholder')
    }
  })
```

The second test enforces that placeholder *entries* have a concrete `companySize` (not `'placeholder'`) — `'placeholder'` is reserved for real studies that haven't been assigned a size yet.

- [ ] **Step 1.8: Run tests, typecheck, build**

Run: `npm run typecheck && npm run test && npm run build`
Expected: all clean. Tests count goes up by 2.

- [ ] **Step 1.9: Commit**

```bash
git add apps/marketing/public/case-studies/placeholder apps/marketing/src/data/caseStudies.ts apps/marketing/src/data/caseStudies.test.ts
git commit -m "feat(clients): seed CaseStudy data-model fields + 6 placeholders for Stripe-mirror layouts"
```

---

## Task 2: Build `ClientsHero` (Section 1) — left-aligned hero with two CTAs

**Files:**
- Modify: `apps/marketing/src/components/clients/ClientsHero.tsx`

- [ ] **Step 2.1: Replace the entire file content**

The existing `ClientsHero.tsx` is center-aligned with an italic accent — both wrong. Replace with:

```tsx
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

export const clientsIntro = {
  eyebrow: 'Customer stories',
  headline: 'The diagnostic-first studio behind systems that move cleaner.',
  body: "We're building a practice for ambitious operators who would rather understand the friction in their workflow than buy more software to mask it. Our engagements turn diagnosed friction into useful systems that help real businesses move cleaner — across construction, consumer software, sports tech, real estate, and nonprofits.",
} as const

interface ClientsHeroProps {
  /** Anchor target for the "See all stories" CTA. */
  scrollTargetId: string
}

export function ClientsHero({ scrollTargetId }: ClientsHeroProps) {
  return (
    <section className="relative z-10 px-6 md:px-12 pt-32 md:pt-40 pb-16 md:pb-20">
      <div className="max-w-7xl mx-auto">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-6">
          {clientsIntro.eyebrow}
        </p>
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.05] max-w-4xl">
          {clientsIntro.headline}
        </h1>
        <p className="mt-8 max-w-2xl text-ink-sub text-base md:text-lg leading-relaxed">
          {clientsIntro.body}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <a
            href={`#${scrollTargetId}`}
            className="inline-flex items-center justify-center gap-3 border border-gold bg-gold px-7 py-4 text-sm uppercase tracking-widest text-black transition-all duration-300 hover:bg-transparent hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            See all stories
            <ArrowRight className="size-4" />
          </a>
          <Link
            to="/diagnostic"
            className="inline-flex items-center justify-center gap-3 border border-line px-7 py-4 text-sm uppercase tracking-widest text-ink transition-all duration-300 hover:border-gold hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            Start a Diagnostic
          </Link>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2.2: Typecheck + lint + build**

Run: `npm run typecheck && npm run lint && npm run build`
Expected: typecheck clean. Lint may report 0 new errors. Build success.

Note: tests will still pass because `clientsIntro` retains its `.headline` and `.body` shape that `-clients.test.ts` consumes.

- [ ] **Step 2.3: Commit**

```bash
git add apps/marketing/src/components/clients/ClientsHero.tsx
git commit -m "feat(clients): rewrite hero left-aligned Stripe-style (no italic accent, no centered text)"
```

---

## Task 3: Build `ClientsFeaturedTiles` (Section 2) — 6-tile portrait grid

**Files:**
- Create: `apps/marketing/src/components/clients/ClientsFeaturedTiles.tsx`

- [ ] **Step 3.1: Write the component**

```tsx
import { Link } from '@tanstack/react-router'

import { caseStudies } from '@/data/caseStudies'

/**
 * Featured tile row — 6 portrait tiles with image + logo overlay + read-story link.
 * Mirrors Stripe /customers's top featured row exactly.
 *
 * Renders the first 6 case studies. Each tile uses portraitImage if set, falling
 * back to hero.image. Stripe uses 3:4 portrait crops with bottom-aligned overlay.
 */
export function ClientsFeaturedTiles() {
  const tiles = caseStudies.slice(0, 6)
  if (tiles.length === 0) return null

  return (
    <section className="relative z-10 px-6 md:px-12 py-16 md:py-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-px bg-line-faint">
          {tiles.map((study, index) => {
            const image = study.portraitImage ?? study.hero.image
            return (
              <Link
                key={study.slug}
                to="/clients/$slug"
                params={{ slug: study.slug }}
                className="group relative block aspect-[3/4] overflow-hidden bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                {image ? (
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-serif text-2xl text-white">{study.name}</h3>
                  <span className="mt-3 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white group-hover:text-gold transition-colors">
                    Read story →
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3.2: Typecheck + build**

Run: `npm run typecheck && npm run build`
Expected: clean. (Not wiring it into the route until Task 11.)

- [ ] **Step 3.3: Commit**

```bash
git add apps/marketing/src/components/clients/ClientsFeaturedTiles.tsx
git commit -m "feat(clients): featured tile row with 6 portrait tiles + overlay"
```

---

## Task 4: Build `ClientsMeasurableResults` (Section 3) — 4 huge stats

**Files:**
- Create: `apps/marketing/src/components/clients/ClientsMeasurableResults.tsx`

- [ ] **Step 4.1: Write the component**

```tsx
import { caseStudies } from '@/data/caseStudies'

/**
 * "Measurable results" — 4 huge serif numbers in a horizontal row, each with
 * a one-line description below. Mirrors Stripe /customers's measurable-results band.
 *
 * Picks the first 4 case studies with a non-null featuredStat. If fewer than 4
 * exist, falls back to placeholder entries (which always have featuredStat set).
 */
export function ClientsMeasurableResults() {
  const stats = caseStudies
    .filter((s) => s.featuredStat !== undefined)
    .slice(0, 4)
    .map((s) => s.featuredStat!)

  if (stats.length === 0) return null

  return (
    <section className="relative z-10 px-6 md:px-12 py-20 md:py-28 border-t border-line-faint">
      <div className="max-w-7xl mx-auto">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-3">
          Measurable results
        </p>
        <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl max-w-3xl mb-16 md:mb-20">
          Diagnosed friction becomes useful systems.
        </h2>
        <dl className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {stats.map((stat) => (
            <div key={stat.value + stat.description}>
              <dd className="font-serif text-4xl md:text-5xl lg:text-6xl text-ink-em leading-none">
                {stat.value}
              </dd>
              <dt className="mt-4 text-sm text-ink-sub leading-relaxed">
                {stat.description}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
```

Note: `<dl>` wraps `<dd>`/`<dt>` pairs (HTML-valid). Stats use `<dd>` for the value (description) and `<dt>` for the label (term) — semantic correctness wins over visual order; CSS handles the visual order.

- [ ] **Step 4.2: Typecheck + build**

Run: `npm run typecheck && npm run build`
Expected: clean.

- [ ] **Step 4.3: Commit**

```bash
git add apps/marketing/src/components/clients/ClientsMeasurableResults.tsx
git commit -m "feat(clients): measurable-results band with 4 huge stats"
```

---

## Task 5: Build `ClientsLogoStrip` (Section 4) — flat horizontal logo row

**Files:**
- Create: `apps/marketing/src/components/clients/ClientsLogoStrip.tsx`
- Delete: `apps/marketing/src/components/clients/ClientsLogoWall.tsx`

- [ ] **Step 5.1: Write the new component**

```tsx
import { clientLogos } from '@/data/clientLogos'

/**
 * Logo strip — flat horizontal row of client logos with no heading.
 * Mirrors Stripe /customers's logo strip exactly.
 */
export function ClientsLogoStrip() {
  return (
    <section className="relative z-10 px-6 md:px-12 py-12 md:py-16 border-t border-b border-line-faint">
      <div className="max-w-7xl mx-auto">
        <ul className="flex flex-wrap items-center justify-center md:justify-between gap-x-12 gap-y-6 text-ink-muted">
          {clientLogos.map((logo) => (
            <li key={logo.name} className="opacity-60 hover:opacity-100 transition-opacity">
              <img
                src={logo.logoSrc}
                alt={logo.name}
                className="h-6 md:h-8 w-auto"
                loading="lazy"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
```

- [ ] **Step 5.2: Delete the old component**

```bash
git rm apps/marketing/src/components/clients/ClientsLogoWall.tsx
```

- [ ] **Step 5.3: Typecheck + build**

Run: `npm run typecheck && npm run build`
Expected: typecheck reports errors in `routes/clients/index.tsx` (still imports the old `ClientsLogoWall`). These are expected; Task 11 fixes them. Move on.

- [ ] **Step 5.4: Commit**

```bash
git add apps/marketing/src/components/clients/ClientsLogoStrip.tsx
git commit -m "feat(clients): rename LogoWall to LogoStrip; restyle as Stripe flat horizontal row"
```

---

## Task 6: Build `ClientsBySize` (Section 5) — Startup/Growth/Enterprise tab grid

**Files:**
- Create: `apps/marketing/src/components/clients/ClientsBySize.tsx`

- [ ] **Step 6.1: Write the component**

```tsx
import { Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

import { caseStudies } from '@/data/caseStudies'

const TABS = [
  { id: 'startup', label: 'Startup' },
  { id: 'growth', label: 'Growth' },
  { id: 'enterprise', label: 'Enterprise' },
] as const

type SizeTabId = (typeof TABS)[number]['id']

const CARDS_PER_TAB = 3

/**
 * "Customers by size" — 3 tabs (Startup / Growth / Enterprise) over a 3-card grid.
 * Each card shows the case study's first stat (or featuredStat), a flat stack
 * tag list with "+N more", and a landscape image at the bottom.
 *
 * Real studies displace placeholder studies in their assigned tab. Each tab
 * always renders exactly CARDS_PER_TAB cards.
 */
export function ClientsBySize() {
  const [active, setActive] = useState<SizeTabId>('startup')

  const visible = useMemo(() => {
    const inTab = caseStudies.filter((s) => s.companySize === active)
    return inTab.slice(0, CARDS_PER_TAB)
  }, [active])

  return (
    <section
      id="all-stories"
      className="relative z-10 px-6 md:px-12 py-20 md:py-28 border-t border-line-faint"
    >
      <div className="max-w-7xl mx-auto">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-ink-muted mb-3">
          Customers by size
        </p>
        <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl max-w-3xl mb-12 md:mb-16">
          Companies of all sizes turn diagnosed friction into useful systems.
        </h2>

        <div
          role="group"
          aria-label="Filter customers by company size"
          className="flex flex-wrap gap-8 border-b border-line-faint mb-12"
        >
          {TABS.map((tab) => {
            const isActive = tab.id === active
            return (
              <button
                key={tab.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActive(tab.id)}
                className={`pb-4 -mb-px text-sm uppercase tracking-[0.2em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                  isActive
                    ? 'text-gold border-b-2 border-gold'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {visible.length === 0 ? (
          <p className="text-sm text-ink-muted">No case studies assigned to this size yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {visible.map((study) => {
              const stack = (study.atAGlance.stack ?? []).flatMap((c) => c.items)
              const visibleStack = stack.slice(0, 3)
              const moreCount = Math.max(0, stack.length - visibleStack.length)
              return (
                <Link
                  key={study.slug}
                  to="/clients/$slug"
                  params={{ slug: study.slug }}
                  className="group block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  {study.featuredStat ? (
                    <>
                      <p className="font-serif text-3xl md:text-4xl text-ink-em leading-none">
                        {study.featuredStat.value}
                      </p>
                      <p className="mt-2 text-sm text-ink-sub">
                        {study.featuredStat.description}
                      </p>
                    </>
                  ) : (
                    <p className="font-serif text-3xl md:text-4xl text-ink-em leading-none">
                      {study.name}
                    </p>
                  )}

                  {visibleStack.length > 0 ? (
                    <>
                      <p className="mt-6 text-[10px] font-bold tracking-[0.3em] uppercase text-ink-muted mb-3">
                        Stack used
                      </p>
                      <ul className="flex flex-wrap gap-x-4 gap-y-2">
                        {visibleStack.map((item) => (
                          <li key={item.label} className="text-xs text-ink-sub">
                            {item.label}
                          </li>
                        ))}
                        {moreCount > 0 ? (
                          <li className="text-xs text-gold">+ {moreCount} more</li>
                        ) : null}
                      </ul>
                    </>
                  ) : null}

                  {study.hero.image ? (
                    <img
                      src={study.hero.image.src}
                      alt={study.hero.image.alt}
                      className="mt-6 aspect-video w-full object-cover transition-opacity duration-300 group-hover:opacity-80"
                      loading="lazy"
                    />
                  ) : null}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
```

The section gets `id="all-stories"` so the index hero's "See all stories" anchor scrolls here.

- [ ] **Step 6.2: Typecheck + build**

Run: `npm run typecheck && npm run build`
Expected: clean.

- [ ] **Step 6.3: Commit**

```bash
git add apps/marketing/src/components/clients/ClientsBySize.tsx
git commit -m "feat(clients): customers-by-size tab grid (Startup/Growth/Enterprise)"
```

---

## Task 7: Build `ClientsBuildingTogether` (Section 6) — vertical tab deep-dive

**Files:**
- Create: `apps/marketing/src/components/clients/ClientsBuildingTogether.tsx`

- [ ] **Step 7.1: Write the component**

```tsx
import { useState } from 'react'

import { caseStudies } from '@/data/caseStudies'

/**
 * "Building together" — vertical sidebar tabs (on lg:) listing each case study,
 * with the active tab revealing a Challenge / Solution / Stack deep-dive + large
 * product image. Mirrors Stripe /customers's "Building together" section.
 *
 * Uses only the 5 real case studies (skips placeholders) so the section reads
 * as authentic depth rather than promised depth.
 */
export function ClientsBuildingTogether() {
  const realStudies = caseStudies.filter((s) => !s.slug.startsWith('placeholder-'))
  const [activeSlug, setActiveSlug] = useState<string>(realStudies[0]?.slug ?? '')
  const active = realStudies.find((s) => s.slug === activeSlug) ?? realStudies[0]

  if (!active) return null

  const stack = (active.atAGlance.stack ?? []).flatMap((c) => c.items)

  return (
    <section className="relative z-10 px-6 md:px-12 py-20 md:py-28 border-t border-line-faint bg-surface backdrop-blur-xs">
      <div className="max-w-7xl mx-auto">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-3">
          Building together
        </p>
        <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl max-w-3xl mb-6">
          We partner with operators to build breakthrough systems.
        </h2>
        <p className="text-ink-sub text-base md:text-lg leading-relaxed max-w-2xl mb-16 md:mb-20">
          Every engagement starts with a diagnostic. Every system we build is
          scoped to the friction we found. The case studies below show how that
          played out across very different operations.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div role="group" aria-label="Select a case study" className="lg:col-span-3">
            {realStudies.map((study) => {
              const isActive = study.slug === activeSlug
              return (
                <button
                  key={study.slug}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveSlug(study.slug)}
                  className={`block w-full text-left px-0 py-4 border-b border-line-faint text-sm uppercase tracking-[0.2em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                    isActive
                      ? 'text-gold border-l-2 border-l-gold pl-4 -ml-4'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  {study.name}
                </button>
              )
            })}
          </div>

          <div className="lg:col-span-9">
            <h3 className="font-serif text-3xl md:text-4xl mb-8">
              How we built with {active.name}
            </h3>

            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-3">
              Challenge
            </p>
            <p className="text-ink-sub text-sm md:text-base leading-relaxed mb-8">
              {active.summary.problem}
            </p>

            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-3">
              Solution
            </p>
            <p className="text-ink-sub text-sm md:text-base leading-relaxed mb-8">
              {active.summary.build}
            </p>

            {stack.length > 0 ? (
              <>
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-3">
                  Stack
                </p>
                <ul className="flex flex-wrap gap-2 mb-12">
                  {stack.map((item) => (
                    <li
                      key={item.label}
                      className="text-xs text-ink-sub border border-line-faint bg-inset px-3 py-1.5"
                    >
                      {item.label}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            {active.hero.image ? (
              <img
                src={active.hero.image.src}
                alt={active.hero.image.alt}
                className="w-full aspect-video object-cover"
                loading="lazy"
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 7.2: Typecheck + build**

Run: `npm run typecheck && npm run build`
Expected: clean.

- [ ] **Step 7.3: Commit**

```bash
git add apps/marketing/src/components/clients/ClientsBuildingTogether.tsx
git commit -m "feat(clients): building-together vertical-tab deep-dive"
```

---

## Task 8: Build `ClosingCtaPanels` (Section 7 / Section I) — 3-panel closing CTA

**Files:**
- Create: `apps/marketing/src/components/clients/ClosingCtaPanels.tsx`

- [ ] **Step 8.1: Write the component**

```tsx
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

interface CtaPanel {
  headline: string
  body: string
  primaryLabel: string
  primaryTo: '/diagnostic' | '/inquire' | '/process'
  secondaryLabel?: string
  secondaryTo?: '/diagnostic' | '/inquire' | '/process'
}

const PANELS: ReadonlyArray<CtaPanel> = [
  {
    headline: 'Ready to diagnose your friction?',
    body: 'Start with a workflow diagnostic before deciding what should be built. We listen first.',
    primaryLabel: 'Start a Diagnostic',
    primaryTo: '/diagnostic',
    secondaryLabel: 'Contact us',
    secondaryTo: '/inquire',
  },
  {
    headline: "Always know what you'll get.",
    body: 'Fixed-scope diagnostic. Transparent engagement pricing after. No mystery retainers.',
    primaryLabel: 'See our process',
    primaryTo: '/process',
  },
  {
    headline: 'Need to talk it through first?',
    body: "Tell us about your business and we'll point you to the highest-friction surface to start on.",
    primaryLabel: 'Inquire',
    primaryTo: '/inquire',
  },
]

export const clientsCta = {
  headline: PANELS[0].headline,
  body: PANELS[0].body,
  label: PANELS[0].primaryLabel,
  to: PANELS[0].primaryTo,
} as const

/**
 * 3-panel closing CTA block, used on both the /clients index and on
 * /clients/$slug detail pages. Mirrors Stripe /customers's bottom 3-panel pattern.
 */
export function ClosingCtaPanels() {
  return (
    <section className="relative z-10 px-6 md:px-12 py-20 md:py-28 border-t border-line-faint">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 max-w-7xl mx-auto">
        {PANELS.map((panel) => (
          <div key={panel.headline} className="flex flex-col">
            <h3 className="font-serif text-3xl md:text-4xl mb-4">{panel.headline}</h3>
            <p className="text-ink-sub text-base leading-relaxed mb-6">{panel.body}</p>
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <Link
                to={panel.primaryTo}
                className="inline-flex items-center justify-center gap-3 border border-gold bg-gold px-7 py-4 text-sm uppercase tracking-widest text-black transition-all duration-300 hover:bg-transparent hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                {panel.primaryLabel}
                <ArrowRight className="size-4" />
              </Link>
              {panel.secondaryLabel && panel.secondaryTo ? (
                <Link
                  to={panel.secondaryTo}
                  className="inline-flex items-center justify-center gap-3 border border-line px-7 py-4 text-sm uppercase tracking-widest text-ink transition-all duration-300 hover:border-gold hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  {panel.secondaryLabel}
                </Link>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

The `clientsCta` const re-export keeps `-clients.test.ts` passing (it imports `clientsCta` from `routes/clients/index.tsx`).

- [ ] **Step 8.2: Typecheck + build**

Run: `npm run typecheck && npm run build`
Expected: clean.

- [ ] **Step 8.3: Commit**

```bash
git add apps/marketing/src/components/clients/ClosingCtaPanels.tsx
git commit -m "feat(clients): 3-panel closing CTA block (used on index + detail)"
```

---

## Task 9: Delete obsolete components

**Files:**
- Delete (8 files):
  - `apps/marketing/src/components/clients/ClientsPortraitGrid.tsx`
  - `apps/marketing/src/components/clients/ClientsResultsBand.tsx`
  - `apps/marketing/src/components/clients/ClientsByEngagementType.tsx`
  - `apps/marketing/src/components/clients/ClientsFeaturedEngagement.tsx`
  - `apps/marketing/src/components/clients/ClientsByIndustry.tsx`
  - `apps/marketing/src/components/clients/ClientsWhatWeBuild.tsx`
  - `apps/marketing/src/components/clients/ClientsClosingCta.tsx`
  - `apps/marketing/src/components/caseStudy/CaseStudyHeroCycler.tsx`
  - `apps/marketing/src/components/caseStudy/CaseStudyHeroCycler.test.tsx`
  - `apps/marketing/src/components/caseStudy/CaseStudyStatsRail.tsx`
  - `apps/marketing/src/components/caseStudy/CaseStudyStatsRail.test.tsx`
  - `apps/marketing/src/components/caseStudy/CaseStudyStackCard.tsx`
  - `apps/marketing/src/components/caseStudy/CaseStudyStackCard.test.tsx`

- [ ] **Step 9.1: Delete via git rm**

```bash
git rm apps/marketing/src/components/clients/ClientsPortraitGrid.tsx
git rm apps/marketing/src/components/clients/ClientsResultsBand.tsx
git rm apps/marketing/src/components/clients/ClientsByEngagementType.tsx
git rm apps/marketing/src/components/clients/ClientsFeaturedEngagement.tsx
git rm apps/marketing/src/components/clients/ClientsByIndustry.tsx
git rm apps/marketing/src/components/clients/ClientsWhatWeBuild.tsx
git rm apps/marketing/src/components/clients/ClientsClosingCta.tsx
git rm apps/marketing/src/components/caseStudy/CaseStudyHeroCycler.tsx
git rm apps/marketing/src/components/caseStudy/CaseStudyHeroCycler.test.tsx
git rm apps/marketing/src/components/caseStudy/CaseStudyStatsRail.tsx
git rm apps/marketing/src/components/caseStudy/CaseStudyStatsRail.test.tsx
git rm apps/marketing/src/components/caseStudy/CaseStudyStackCard.tsx
git rm apps/marketing/src/components/caseStudy/CaseStudyStackCard.test.tsx
```

- [ ] **Step 9.2: Typecheck**

Run: `npm run typecheck`
Expected: errors in `routes/clients/index.tsx` (still imports the deleted clients/* components) and `routes/clients/$slug.tsx` (still imports `CaseStudyStatsRail` / `CaseStudyStackCard`). These are expected intermediate state; Tasks 11 + 16 fix them.

- [ ] **Step 9.3: Commit**

```bash
git commit -m "chore(clients): remove obsolete components replaced by Stripe-mirror layout"
```

---

## Task 10: Build `CaseStudyDetailHero` (Section A) — detail page hero

**Files:**
- Create: `apps/marketing/src/components/caseStudy/CaseStudyDetailHero.tsx`

- [ ] **Step 10.1: Write the component**

```tsx
import { Link } from '@tanstack/react-router'

import type { CaseStudy } from '@/data/caseStudies'

interface CaseStudyDetailHeroProps {
  study: CaseStudy
}

/**
 * Detail-page hero. Left-aligned, large serif H1, body paragraph, breadcrumb above.
 * Mirrors Stripe /customers/figma top section.
 *
 * H1 source order: detailHeadline → hero.tagline.
 * Body source order: detailBody → combining hero.tagline + summary.problem.
 */
export function CaseStudyDetailHero({ study }: CaseStudyDetailHeroProps) {
  const headline = study.detailHeadline ?? study.hero.tagline
  const body = study.detailBody ?? `${study.hero.tagline} ${study.summary.problem}`

  return (
    <section className="relative z-10 px-6 md:px-12 pt-32 md:pt-40 pb-12 md:pb-16">
      <div className="max-w-7xl mx-auto">
        <nav className="mb-12 text-xs uppercase tracking-[0.2em] text-ink-muted" aria-label="Breadcrumb">
          <Link to="/clients" className="hover:text-gold transition-colors">
            Clients
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{study.name}</span>
        </nav>
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.05] max-w-4xl">
          {headline}
        </h1>
        <p className="mt-8 max-w-2xl text-ink-sub text-base md:text-lg leading-relaxed">
          {body}
        </p>
      </div>
    </section>
  )
}
```

- [ ] **Step 10.2: Typecheck + build**

Run: `npm run typecheck && npm run build`
Expected: typecheck errors remain in `routes/clients/$slug.tsx` (still imports deleted components). Build will fail. That's expected; Task 16 fixes it.

- [ ] **Step 10.3: Commit**

```bash
git add apps/marketing/src/components/caseStudy/CaseStudyDetailHero.tsx
git commit -m "feat(clients): detail-page hero (Section A)"
```

---

## Task 11: Wire `routes/clients/index.tsx` to use new components

**Files:**
- Modify: `apps/marketing/src/routes/clients/index.tsx`

- [ ] **Step 11.1: Replace the entire file**

```tsx
import { createFileRoute } from '@tanstack/react-router'

import { ClientsBuildingTogether } from '@/components/clients/ClientsBuildingTogether'
import { ClientsBySize } from '@/components/clients/ClientsBySize'
import { ClientsFeaturedTiles } from '@/components/clients/ClientsFeaturedTiles'
import { ClientsHero, clientsIntro } from '@/components/clients/ClientsHero'
import { ClientsLogoStrip } from '@/components/clients/ClientsLogoStrip'
import { ClientsMeasurableResults } from '@/components/clients/ClientsMeasurableResults'
import { ClosingCtaPanels, clientsCta } from '@/components/clients/ClosingCtaPanels'

export const Route = createFileRoute('/clients/')({
  head: () => ({
    meta: [
      { title: 'Our Clients | RelentNet Case Studies' },
      {
        name: 'description',
        content:
          'Diagnostic-first proof from RelentNet client engagements, showing how diagnosed workflow friction becomes useful systems and clearer operations.',
      },
    ],
  }),
  component: ClientsIndex,
})

// Re-exported for the migrated test file.
export { clientsIntro, clientsCta }

const ALL_STORIES_ID = 'all-stories'

function ClientsIndex() {
  return (
    <div className="min-h-screen overflow-hidden">
      <ClientsHero scrollTargetId={ALL_STORIES_ID} />
      <ClientsFeaturedTiles />
      <ClientsMeasurableResults />
      <ClientsLogoStrip />
      <ClientsBySize />
      <ClientsBuildingTogether />
      <ClosingCtaPanels />
    </div>
  )
}
```

- [ ] **Step 11.2: Typecheck + test + build**

Run: `npm run typecheck && npm run test && npm run build`
Expected:
- Typecheck: errors remain only in `routes/clients/$slug.tsx`.
- Tests: `-clients.test.ts` should pass — `clientsIntro.headline` contains "Diagnosed friction" (still in the body or new headline)? **Check the test file's expectations first.**

The test file currently expects:
- `clientsIntro.headline` to contain `'Diagnosed friction'` — fails with new headline
- `clientsIntro.body` to contain `'workflow diagnostic'` — passes (new body keeps that phrase)
- `caseStudies` to have length 5 — fails (now 11 after Task 1)
- `clientsCta.label` to be `'Start With a Diagnostic'` — fails (new label is `'Start a Diagnostic'`)

**Replace the entire describe block in `apps/marketing/src/routes/-clients.test.ts`** with:

```ts
import { describe, expect, it } from 'vitest'

import { clientsCta, clientsIntro } from './clients/index'
import { caseStudies } from '@/data/caseStudies'

describe('clients case studies', () => {
  it('frames work as diagnostic-first', () => {
    expect(clientsIntro.headline.toLowerCase()).toContain('diagnostic')
    expect(clientsIntro.body.toLowerCase()).toContain('diagnostic')
    expect(caseStudies.length).toBeGreaterThanOrEqual(5)
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
```

Changes from the existing test:
- First test: `.toLowerCase().toContain('diagnostic')` instead of literal `'Diagnosed friction'` (forward-compatible with the new headline)
- First test: `toBeGreaterThanOrEqual(5)` instead of hard-coded `toHaveLength(5)` (lets us add placeholders without re-updating the test)
- Second test: also uses `.toLowerCase().toContain('diagnostic')` for the CTA label

- [ ] **Step 11.3: Commit**

```bash
git add apps/marketing/src/routes/clients/index.tsx apps/marketing/src/routes/-clients.test.ts
git commit -m "feat(clients): wire index page to Stripe-mirror sections"
```

---

## Task 12: Build `CaseStudyProductsRow` (Section B) — pill row

**Files:**
- Create: `apps/marketing/src/components/caseStudy/CaseStudyProductsRow.tsx`

- [ ] **Step 12.1: Write the component**

```tsx
import { useState } from 'react'

import { BrandIcon } from '@/components/BrandIcon'
import type { CaseStudy } from '@/data/caseStudies'

interface CaseStudyProductsRowProps {
  study: CaseStudy
}

const DEFAULT_VISIBLE = 6

/**
 * Detail-page "Products used" pill row. Flat horizontal list of stack items
 * with brand icons, followed by region and company-size pills.
 * Mirrors Stripe /customers/figma row directly below the hero.
 */
export function CaseStudyProductsRow({ study }: CaseStudyProductsRowProps) {
  const [expanded, setExpanded] = useState(false)
  const allItems = (study.atAGlance.stack ?? []).flatMap((c) => c.items)
  const visibleItems = expanded ? allItems : allItems.slice(0, DEFAULT_VISIBLE)
  const moreCount = Math.max(0, allItems.length - DEFAULT_VISIBLE)

  const sizeLabel =
    study.companySize === 'placeholder'
      ? undefined
      : study.companySize.charAt(0).toUpperCase() + study.companySize.slice(1)

  if (allItems.length === 0 && !study.region && !sizeLabel) return null

  return (
    <section className="relative z-10 px-6 md:px-12 py-8 border-t border-b border-line-faint">
      <div className="max-w-7xl mx-auto">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-ink-muted mb-4">
          Products used
        </p>
        <ul className="flex flex-wrap gap-x-6 gap-y-3 items-center">
          {visibleItems.map((item) => (
            <li key={item.label} className="flex items-center gap-2 text-sm text-ink-sub">
              <BrandIcon slug={item.iconSlug} className="size-4 text-ink-muted" />
              <span>{item.label}</span>
            </li>
          ))}
          {!expanded && moreCount > 0 ? (
            <li>
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="text-sm text-gold hover:text-ink transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                + {moreCount} more
              </button>
            </li>
          ) : null}
          {study.region ? (
            <li className="text-sm text-ink-sub border-l border-line-faint pl-6 ml-2">
              {study.region}
            </li>
          ) : null}
          {sizeLabel ? (
            <li className="text-sm text-ink-sub border-l border-line-faint pl-6 ml-2">
              {sizeLabel}
            </li>
          ) : null}
        </ul>
      </div>
    </section>
  )
}
```

- [ ] **Step 12.2: Typecheck**

Run: `npm run typecheck`
Expected: errors remain in `routes/clients/$slug.tsx` only.

- [ ] **Step 12.3: Commit**

```bash
git add apps/marketing/src/components/caseStudy/CaseStudyProductsRow.tsx
git commit -m "feat(clients): detail-page products-used pill row (Section B)"
```

---

## Task 13: Build `CaseStudyBigStats` (Section C) — vertical stat list

**Files:**
- Create: `apps/marketing/src/components/caseStudy/CaseStudyBigStats.tsx`

- [ ] **Step 13.1: Write the component**

```tsx
import type { CaseStudy, CaseStudyMetric } from '@/data/caseStudies'

interface CaseStudyBigStatsProps {
  study: CaseStudy
}

function isDelta(metric: CaseStudyMetric): boolean {
  return (
    typeof metric.from === 'string' &&
    metric.from.length > 0 &&
    typeof metric.to === 'string' &&
    metric.to.length > 0
  )
}

/**
 * Detail-page vertical stat list. 3-5 huge serif numbers stacked left-aligned.
 * Mirrors Stripe /customers/figma's vertical stats block.
 *
 * Renders nothing if the study has 0 metrics.
 */
export function CaseStudyBigStats({ study }: CaseStudyBigStatsProps) {
  const metrics = study.atAGlance.metrics ?? []
  if (metrics.length === 0) return null

  return (
    <section className="relative z-10 px-6 md:px-12 py-16 md:py-24">
      <div className="max-w-3xl">
        {metrics.map((metric) => (
          <div key={metric.label} className="mb-12 last:mb-0">
            {isDelta(metric) ? (
              <p className="font-serif text-5xl md:text-7xl lg:text-8xl text-ink-em leading-none">
                <span className="text-ink-muted">{metric.from}</span>
                <span className="mx-3 text-gold">→</span>
                <span>{metric.to}</span>
              </p>
            ) : (
              <p className="font-serif text-5xl md:text-7xl lg:text-8xl text-ink-em leading-none">
                {metric.value}
              </p>
            )}
            <p className="mt-4 text-base md:text-lg text-ink-sub leading-relaxed">
              {metric.label}
              {metric.context ? <span className="block mt-1 text-sm text-ink-muted">{metric.context}</span> : null}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
```

The inner container intentionally uses `max-w-3xl` (not `max-w-7xl`) and no `mx-auto` — keeps the stats left-aligned to the page edge, matching Stripe.

- [ ] **Step 13.2: Typecheck**

Run: `npm run typecheck`
Expected: errors remain in `routes/clients/$slug.tsx` only.

- [ ] **Step 13.3: Commit**

```bash
git add apps/marketing/src/components/caseStudy/CaseStudyBigStats.tsx
git commit -m "feat(clients): detail-page big-stats vertical list (Section C)"
```

---

## Task 14: Build `CaseStudyInlineCta` + `CaseStudyHeroImage` (Sections D + E)

**Files:**
- Create: `apps/marketing/src/components/caseStudy/CaseStudyInlineCta.tsx`
- Create: `apps/marketing/src/components/caseStudy/CaseStudyHeroImage.tsx`

- [ ] **Step 14.1: Write `CaseStudyInlineCta.tsx`**

```tsx
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

/**
 * Detail-page inline CTA between stats and the narrative. Single H3 + button.
 * Mirrors Stripe /customers/figma's mid-page "Ready to get started?" block.
 */
export function CaseStudyInlineCta() {
  return (
    <section className="relative z-10 px-6 md:px-12 py-12 border-t border-line-faint">
      <div className="max-w-3xl">
        <h3 className="font-serif text-2xl md:text-3xl mb-6">
          Ready to diagnose your friction?
        </h3>
        <Link
          to="/diagnostic"
          className="inline-flex items-center justify-center gap-3 border border-gold bg-gold px-7 py-4 text-sm uppercase tracking-widest text-black transition-all duration-300 hover:bg-transparent hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          Start a Diagnostic
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  )
}
```

- [ ] **Step 14.2: Write `CaseStudyHeroImage.tsx`**

```tsx
import type { CaseStudy } from '@/data/caseStudies'

interface CaseStudyHeroImageProps {
  study: CaseStudy
}

/**
 * Detail-page full-width landscape hero image. Mirrors Stripe /customers/figma's
 * hero shot below the inline CTA.
 *
 * Renders nothing if the study has no hero image.
 */
export function CaseStudyHeroImage({ study }: CaseStudyHeroImageProps) {
  if (!study.hero.image) return null

  return (
    <section className="relative z-10 px-6 md:px-12 py-12 md:py-16">
      <div className="max-w-7xl mx-auto">
        <img
          src={study.hero.image.src}
          alt={study.hero.image.alt}
          width={study.hero.image.width}
          height={study.hero.image.height}
          className="w-full aspect-video object-cover"
          loading="eager"
        />
      </div>
    </section>
  )
}
```

- [ ] **Step 14.3: Typecheck**

Run: `npm run typecheck`
Expected: errors remain in `routes/clients/$slug.tsx` only.

- [ ] **Step 14.4: Commit**

```bash
git add apps/marketing/src/components/caseStudy/CaseStudyInlineCta.tsx apps/marketing/src/components/caseStudy/CaseStudyHeroImage.tsx
git commit -m "feat(clients): detail-page inline CTA + hero image (Sections D, E)"
```

---

## Task 15: Build `CaseStudyNarrative` (Section F) + `CaseStudyReadMore` (Section H)

**Files:**
- Create: `apps/marketing/src/components/caseStudy/CaseStudyNarrative.tsx`
- Create: `apps/marketing/src/components/caseStudy/CaseStudyReadMore.tsx`

- [ ] **Step 15.1: Write `CaseStudyNarrative.tsx`**

```tsx
import type { CaseStudy, StoryBlock } from '@/data/caseStudies'

interface CaseStudyNarrativeProps {
  study: CaseStudy
}

function renderBlocks(blocks: ReadonlyArray<StoryBlock>) {
  return blocks.map((block, idx) => {
    if (block.type === 'p') {
      return (
        <p key={idx} className="text-ink text-base md:text-lg leading-relaxed mb-6">
          {block.text}
        </p>
      )
    }
    if (block.type === 'image') {
      return (
        <figure key={idx} className="my-8">
          <img
            src={block.image.src}
            alt={block.image.alt}
            className="w-full aspect-video object-cover"
            loading="lazy"
          />
          {block.image.caption ? (
            <figcaption className="mt-3 text-sm text-ink-muted">{block.image.caption}</figcaption>
          ) : null}
        </figure>
      )
    }
    return (
      <blockquote key={idx} className="my-8 border-l-2 border-gold pl-6">
        <p className="font-serif italic text-xl md:text-2xl text-ink leading-snug">{block.text}</p>
        {block.attribution ? (
          <cite className="mt-3 block text-sm text-ink-muted not-italic">{block.attribution}</cite>
        ) : null}
      </blockquote>
    )
  })
}

/**
 * Detail-page narrative — Challenge / Solution / Results in single-column layout.
 * Mirrors Stripe /customers/figma's mid-page H2 sections.
 *
 * Challenge = story.problem + story.diagnosis (concatenated).
 * Solution = story.build.
 * Results = study.results if set, else single block from story.outcome.
 *
 * Stewardship (story.stewardship) is dropped from the detail page per the spec.
 */
export function CaseStudyNarrative({ study }: CaseStudyNarrativeProps) {
  const challengeBlocks: ReadonlyArray<StoryBlock> = [
    ...study.story.problem,
    ...study.story.diagnosis,
  ]
  const solutionBlocks = study.story.build
  const resultEntries =
    study.results ??
    ([{ headline: 'Outcome', body: study.summary.outcome }] as ReadonlyArray<{
      headline: string
      body: string
    }>)

  return (
    <section className="relative z-10 px-6 md:px-12 py-12 md:py-16">
      <div className="max-w-3xl">
        <h2 className="font-serif text-3xl md:text-5xl mb-8">Challenge</h2>
        {renderBlocks(challengeBlocks)}

        <h2 className="font-serif text-3xl md:text-5xl mb-8 mt-16">Solution</h2>
        {renderBlocks(solutionBlocks)}

        <h2 className="font-serif text-3xl md:text-5xl mb-8 mt-16">Results</h2>
        {resultEntries.map((result, idx) => (
          <div key={idx}>
            <h3 className="font-serif text-xl md:text-2xl mb-4 mt-12 first:mt-0">
              {result.headline}
            </h3>
            <p className="text-ink text-base md:text-lg leading-relaxed mb-6">
              {result.body}
            </p>
          </div>
        ))}

        {study.story.outcome.length > 0 && !study.results ? (
          <div className="mt-8">{renderBlocks(study.story.outcome)}</div>
        ) : null}
      </div>
    </section>
  )
}
```

- [ ] **Step 15.2: Write `CaseStudyReadMore.tsx`**

```tsx
import { Link } from '@tanstack/react-router'

import { caseStudies, type CaseStudy } from '@/data/caseStudies'

interface CaseStudyReadMoreProps {
  currentSlug: string
}

/**
 * "Read more customer stories" — 2-up tile band. Surfaces the case studies
 * immediately before and after the current one (wrapping around the list).
 * Mirrors Stripe /customers/figma's 2-up read-more band.
 */
export function CaseStudyReadMore({ currentSlug }: CaseStudyReadMoreProps) {
  const realStudies = caseStudies.filter((s) => !s.slug.startsWith('placeholder-'))
  const idx = realStudies.findIndex((s) => s.slug === currentSlug)
  if (idx === -1 || realStudies.length < 2) return null

  const prev = realStudies[(idx - 1 + realStudies.length) % realStudies.length]
  const next = realStudies[(idx + 1) % realStudies.length]
  const tiles: ReadonlyArray<CaseStudy> = prev.slug === next.slug ? [next] : [prev, next]

  return (
    <section className="relative z-10 px-6 md:px-12 py-20 md:py-24 border-t border-line-faint">
      <div className="max-w-7xl mx-auto">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-8">
          Read more customer stories
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line-faint">
          {tiles.map((tile) => (
            <Link
              key={tile.slug}
              to="/clients/$slug"
              params={{ slug: tile.slug }}
              className="group block bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              {tile.hero.image ? (
                <img
                  src={tile.hero.image.src}
                  alt={tile.hero.image.alt}
                  className="aspect-video w-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                  loading="lazy"
                />
              ) : null}
              <div className="p-6 md:p-8">
                <p className="mb-4 text-sm uppercase tracking-[0.2em] text-ink-muted">
                  {tile.industry}
                </p>
                <h3 className="font-serif text-xl md:text-2xl">{tile.name}</h3>
                <span className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold group-hover:gap-3 transition-all duration-300">
                  Read story →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 15.3: Typecheck**

Run: `npm run typecheck`
Expected: errors remain in `routes/clients/$slug.tsx` only.

- [ ] **Step 15.4: Commit**

```bash
git add apps/marketing/src/components/caseStudy/CaseStudyNarrative.tsx apps/marketing/src/components/caseStudy/CaseStudyReadMore.tsx
git commit -m "feat(clients): detail-page narrative + read-more tiles (Sections F, H)"
```

---

## Task 16: Wire `routes/clients/$slug.tsx` to use new components

**Files:**
- Modify: `apps/marketing/src/routes/clients/$slug.tsx`

- [ ] **Step 16.1: Replace the entire file content**

The existing file imports `CaseStudyHero`, `CaseStudyStatsRail`, `CaseStudyStackCard`, `CaseStudySection`, etc. The new layout uses only the new Stripe-mirror components. Replace with:

```tsx
import { createFileRoute, notFound } from '@tanstack/react-router'

import { CaseStudyBigStats } from '@/components/caseStudy/CaseStudyBigStats'
import { CaseStudyDetailHero } from '@/components/caseStudy/CaseStudyDetailHero'
import { CaseStudyHeroImage } from '@/components/caseStudy/CaseStudyHeroImage'
import { CaseStudyInlineCta } from '@/components/caseStudy/CaseStudyInlineCta'
import { CaseStudyNarrative } from '@/components/caseStudy/CaseStudyNarrative'
import { CaseStudyProductsRow } from '@/components/caseStudy/CaseStudyProductsRow'
import { CaseStudyPullquote } from '@/components/caseStudy/CaseStudyPullquote'
import { CaseStudyReadMore } from '@/components/caseStudy/CaseStudyReadMore'
import { ClosingCtaPanels } from '@/components/clients/ClosingCtaPanels'
import { caseStudies } from '@/data/caseStudies'

export const Route = createFileRoute('/clients/$slug')({
  loader: ({ params }) => {
    const study = caseStudies.find((s) => s.slug === params.slug)
    if (!study) throw notFound()
    return { study }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    return {
      meta: [
        { title: loaderData.study.meta.title },
        { name: 'description', content: loaderData.study.meta.description },
      ],
    }
  },
  component: ClientDetail,
})

function ClientDetail() {
  const { study } = Route.useLoaderData()

  return (
    <article className="min-h-screen overflow-hidden">
      <CaseStudyDetailHero study={study} />
      <CaseStudyProductsRow study={study} />
      <CaseStudyBigStats study={study} />
      <CaseStudyInlineCta />
      <CaseStudyHeroImage study={study} />
      <CaseStudyNarrative study={study} />
      {study.pullquote ? <CaseStudyPullquote pullquote={study.pullquote} /> : null}
      <CaseStudyReadMore currentSlug={study.slug} />
      <ClosingCtaPanels />
    </article>
  )
}
```

- [ ] **Step 16.2: Verify `CaseStudyPullquote` accepts the pullquote prop**

Check the current `apps/marketing/src/components/caseStudy/CaseStudyPullquote.tsx` signature. If it takes `pullquote: CaseStudyPullquote`, no changes. If it takes the study and reads `study.pullquote` itself, either:
  - Pass `study={study}` in the JSX above, or
  - Refactor the existing component to take just the pullquote object (preferred).

Look at the file. If it currently takes a `study` prop, change the call site to `<CaseStudyPullquote study={study} />` to match.

- [ ] **Step 16.3: Typecheck + test + build**

Run: `npm run typecheck && npm run test && npm run build`
Expected: clean.

- [ ] **Step 16.4: Commit**

```bash
git add apps/marketing/src/routes/clients/\$slug.tsx
git commit -m "feat(clients): wire detail page to Stripe-mirror sections (single-column layout)"
```

---

## Task 17a: Restyle `CaseStudyPullquote` left-aligned (Stripe-style)

**Files:**
- Modify: `apps/marketing/src/components/caseStudy/CaseStudyPullquote.tsx`

The existing pullquote is centered with a giant decorative `"` glyph. Stripe's is left-aligned, no decorative glyph, and lives inside a `max-w-3xl` block. Restyle to match.

- [ ] **Step 17a.1: Read the current file first**

Run: `Read apps/marketing/src/components/caseStudy/CaseStudyPullquote.tsx`

- [ ] **Step 17a.2: Replace the return block (keep imports + props)**

Replace the `return (...)` block with:

```tsx
  return (
    <section ref={ref} className="relative z-10 px-6 md:px-12 py-16 md:py-24 border-t border-line-faint">
      <figure className="max-w-3xl">
        <blockquote
          className={`font-serif italic text-2xl md:text-3xl lg:text-4xl leading-snug text-ink ${
            isRevealed ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          {text}
        </blockquote>
        <figcaption
          className={`mt-8 flex flex-col gap-1 ${
            isRevealed ? 'animate-fade-in-up' : 'opacity-0'
          }`}
          style={isRevealed ? { animationDelay: '120ms' } : undefined}
        >
          <span className="text-sm uppercase tracking-[0.2em] text-ink-muted">
            {attribution.name}
          </span>
          <span className="text-sm text-ink-muted">
            {attribution.role}
            {attribution.company ? ` · ${attribution.company}` : ''}
          </span>
        </figcaption>
      </figure>
    </section>
  )
```

The `<span aria-hidden="true">` opening-quote decoration is removed. The container drops `text-center` and `mx-auto`, and switches to `max-w-3xl` (no center) to left-align.

- [ ] **Step 17a.3: Typecheck**

Run: `npm run typecheck`
Expected: clean.

- [ ] **Step 17a.4: Commit**

```bash
git add apps/marketing/src/components/caseStudy/CaseStudyPullquote.tsx
git commit -m "refactor(clients): pullquote left-aligned Stripe-style (no decorative quote glyph)"
```

---

## Task 17: Clean up remaining obsolete caseStudy/* components

The current detail page also uses these components which are NOT in the new layout. Check whether they're still referenced (e.g., from the homepage or process page) before deleting.

**Files (potentially obsolete — verify before deleting):**
- `apps/marketing/src/components/caseStudy/CaseStudyHero.tsx` (old hero, replaced by `CaseStudyDetailHero`)
- `apps/marketing/src/components/caseStudy/CaseStudySection.tsx` (old narrative section, replaced by `CaseStudyNarrative`)
- `apps/marketing/src/components/caseStudy/CaseStudyElevatorPitch.tsx` (not in new layout)
- `apps/marketing/src/components/caseStudy/CaseStudyAtAGlance.tsx` (deleted in PR #9 already)
- `apps/marketing/src/components/caseStudy/CaseStudyMetrics.tsx` (deleted in PR #9 already)
- `apps/marketing/src/components/caseStudy/CaseStudyServices.tsx` (not in new layout)
- `apps/marketing/src/components/caseStudy/CaseStudyRecognition.tsx` (not in new layout)
- `apps/marketing/src/components/caseStudy/CaseStudyCta.tsx` (replaced by `ClosingCtaPanels`)
- `apps/marketing/src/components/caseStudy/CaseStudyNav.tsx` (replaced by `CaseStudyReadMore`)
- `apps/marketing/src/components/caseStudy/CaseStudyImage.tsx` (may still be used by StoryBlock rendering; verify)

- [ ] **Step 17.1: Grep for usages**

```bash
cd /home/phoenix/code/relentnet
rg "CaseStudyHero\b|CaseStudySection\b|CaseStudyElevatorPitch|CaseStudyServices|CaseStudyRecognition|CaseStudyCta\b|CaseStudyNav\b|CaseStudyImage" apps/marketing/src --type tsx --type ts
```

For each component above:
- If it's only referenced in its own file + its test, it's safe to delete.
- If something else (route, another component) uses it, leave it.

- [ ] **Step 17.2: Delete confirmed-unused components**

For each component the grep confirmed unused, run `git rm` on the .tsx and (if it exists) .test.tsx file.

Expected: most likely all of `CaseStudyHero`, `CaseStudySection`, `CaseStudyElevatorPitch`, `CaseStudyServices`, `CaseStudyRecognition`, `CaseStudyCta`, `CaseStudyNav` are deletable. `CaseStudyImage` and `CaseStudyPullquote` likely remain.

- [ ] **Step 17.3: Typecheck + test + build**

Run: `npm run typecheck && npm run test && npm run build`
Expected: clean.

- [ ] **Step 17.4: Commit**

```bash
git commit -m "chore(clients): remove unused caseStudy components after Stripe-mirror rewrite"
```

(Use `git commit -m` directly since `git rm` already staged the deletes.)

---

## Task 18: Final sweep + verification

- [ ] **Step 18.1: Verify no `rounded-*` anywhere in new code**

```bash
cd /home/phoenix/code/relentnet
rg "rounded-" apps/marketing/src/components/clients apps/marketing/src/components/caseStudy apps/marketing/src/routes/clients
```

Expected: no matches. If any appear, remove the offending class.

- [ ] **Step 18.2: Verify no italic accents in headlines**

```bash
rg "italic" apps/marketing/src/components/clients apps/marketing/src/routes/clients
```

Expected: zero matches (Stripe's customer pages have no italic accent text in headlines).

The pullquote component is permitted to use `italic` since pullquotes are italic on Stripe too. If `apps/marketing/src/components/caseStudy/CaseStudyPullquote.tsx` uses `italic`, that's fine.

- [ ] **Step 18.3: Verify routes layout dimensions**

Visit `/clients` and `/clients/scrollr` in the dev server and confirm:
- Hero is left-aligned, not centered
- Featured tile row shows 6 tiles in a single row on lg:
- Stats are huge serif numbers
- Detail page is single-column, no left rail or right stack card
- Detail page sections appear in order: hero → products row → big stats → inline CTA → hero image → narrative (Challenge/Solution/Results) → pullquote → read-more → closing CTAs
- All button styles look identical to the existing buttons
- StarParticles background visible behind every section

- [ ] **Step 18.4: Run full check**

```bash
npm run check
npm run typecheck
npm run test
npm run build
```

Expected: all clean.

- [ ] **Step 18.5: Manual smoke matrix**

| URL                                   | Expected |
|---------------------------------------|----------|
| `/clients`                            | 7 sections in spec order, left-aligned, square edges |
| `/clients/scrollr`                    | 9 sections (A–I), single column, products row, big stats, narrative |
| `/clients/cambridge-building-group`   | Same; conditional sections suppressed where data missing |
| `/clients/courtcommand`               | Same |
| `/clients/vm-homes`                   | Same |
| `/clients/star-kids`                  | Same |
| `/clients/placeholder-1`              | Renders with bracketed copy + gray placeholder images |
| `/clients/nonexistent-slug`           | 404 |
| `/portfolio` (legacy)                 | Still 301 → `/clients` (nginx redirect persists) |

- [ ] **Step 18.6: Final commit (if anything needs it)**

If `npm run check` rewrote anything:

```bash
git add -A
git commit -m "chore(clients): final formatting pass after Stripe-mirror rewrite"
```

- [ ] **Step 18.7: Push**

```bash
git push origin feat/clients-stripe-mirror
```

- [ ] **Step 18.8: Open PR**

```bash
gh pr create --base main --head feat/clients-stripe-mirror --title "feat(clients): Stripe-mirror layout for /clients and detail pages" --body-file /dev/stdin <<'EOF'
## Summary

Rewrites `/clients` and `/clients/$slug` so their layouts are near-mirror replicas of Stripe's `/customers` and `/customers/figma` pages, while preserving the StarParticles background, gold-on-dark theme tokens, existing button styles, and case-study content.

This **supersedes PR #9**. If you're merging this, close PR #9 without merging.

## What changed

### /clients (index)
Seven sections in order:
1. Hero — left-aligned, large serif headline, two-button CTA row
2. Featured tiles — 6 portrait tiles with image + logo overlay
3. Measurable results — 4 huge serif stats with one-line attributions
4. Logo strip — flat horizontal row of client logos (no heading)
5. Customers by size — Startup/Growth/Enterprise tabs with 3-card grids
6. Building together — vertical-sidebar tabs revealing Challenge/Solution/Stack/image deep-dives for each real case study
7. Closing CTA — 3-panel Stripe-style block

### /clients/\$slug (detail)
Nine sections in order:
A. Hero — left-aligned with breadcrumb, headline, body
B. Products used — pill row with brand icons + region/size pills
C. Big stats — huge serif vertical list (conditional on having metrics)
D. Inline CTA — single H3 + Start a Diagnostic button
E. Hero image — full-width landscape
F. Narrative — Challenge / Solution / Results in single-column H2 sections
G. Pullquote — large italic block (conditional)
H. Read more — 2-up tile band linking to adjacent case studies
I. Closing CTA — same 3-panel block as the index

## Spec + plan

- Spec: `docs/superpowers/specs/2026-05-23-clients-stripe-mirror-design.md`
- Plan: `docs/superpowers/plans/2026-05-23-clients-stripe-mirror.md`

## Data model additions

New `CaseStudy` fields: `portraitImage`, `featuredStat`, `region`, `companySize` (required), `detailHeadline`, `detailBody`, `results`. All existing studies start with `companySize: 'placeholder'` for the user to assign later.

6 new placeholder case studies added so the size-tab grid renders cleanly (3 per tab).

## Components deleted

13 components removed in this rewrite, listed in the plan's Task 9 and Task 17. Most notable: `CaseStudyHeroCycler`, `CaseStudyStatsRail`, `CaseStudyStackCard`, `ClientsByEngagementType`, `ClientsByIndustry`, `ClientsWhatWeBuild`.

## Verification

- `npm run typecheck` clean
- `npm run test` passing
- `npm run lint` 0 errors
- `npm run build` clean
- Manual smoke against all 6 case-study slugs + placeholder + 404 path

## Out of scope

- Per-component unit tests for new `clients/*` and `caseStudy/*` band components (carry-over from PR #9)
- Real `featuredStat` values for the 4 non-Scrollr studies (user fills in `caseStudies.ts`)
- Real `companySize` assignments for the 5 real studies (user fills in `caseStudies.ts`)
- Real `results` entries for case studies (user fills in `caseStudies.ts`)
- Replacing placeholder images with real ones
EOF
```

---

## Self-Review

After completing every task in order, look at the spec and the plan with fresh eyes:

**Spec coverage check:**

- Section 1 hero (left-aligned, two CTAs) → Task 2 ✓
- Section 2 featured 6-tile row → Task 3 ✓
- Section 3 measurable-results 4 stats → Task 4 ✓
- Section 4 logo strip → Task 5 ✓
- Section 5 customers-by-size tab grid → Task 6 ✓
- Section 6 building-together vertical tabs → Task 7 ✓
- Section 7 / I closing CTA panels → Task 8 ✓
- Section A detail hero → Task 10 ✓
- Section B products row → Task 12 ✓
- Section C big stats → Task 13 ✓
- Section D inline CTA → Task 14 ✓
- Section E hero image → Task 14 ✓
- Section F narrative → Task 15 ✓
- Section G pullquote → existing `CaseStudyPullquote` reused; Task 16 wires it
- Section H read-more tiles → Task 15 ✓
- Data model additions → Task 1 ✓
- 6 placeholder case studies → Task 1 ✓
- Placeholder SVG assets → Task 1 ✓
- Component deletions → Tasks 9 + 17 ✓
- Route wiring → Tasks 11 + 16 ✓
- Verification matrix → Task 18 ✓

**Placeholder scan:** Search for `TODO`, `TBD`, `implement later`. None present in this plan; every step has concrete code or a concrete command.

**Type consistency:**
- `CaseStudy.companySize` is required (no `?`) — set on all 5 real studies in Task 1.4 and on all 6 placeholders in Task 1.6.
- `CaseStudy.featuredStat` is optional — set on Scrollr and all 6 placeholders, unset elsewhere.
- `ClientsHero` exports `clientsIntro` with `.headline` and `.body` — consumed by `-clients.test.ts` (Task 11 updates the test to match the new headline).
- `ClosingCtaPanels` exports `clientsCta` — consumed by `-clients.test.ts` (matches existing test shape).
- `CaseStudyDetailHero` takes `study: CaseStudy` — consistent across all detail-page components.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-23-clients-stripe-mirror.md`. Two execution options:

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
