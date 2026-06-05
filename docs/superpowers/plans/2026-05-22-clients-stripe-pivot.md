# Clients Stripe-Pivot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pivot the `/portfolio` surface to a Stripe-customers-shaped `/clients` surface — three-column detail page (sticky stats rail · narrative · sticky stack card), cycling story-beat hero, and a nine-band index page, on the `feat/case-studies` branch (PR #9).

**Architecture:** Extend the existing `caseStudies.ts` data model with delta-shaped metrics, categorized stack, optional hero beats, a `featured` flag, an `engagementType` enum, and an optional `global` row. Remove `CaseStudyMetrics.tsx` and `CaseStudyAtAGlance.tsx`; their content moves into a new sticky left rail (`CaseStudyStatsRail`) and a new sticky right card (`CaseStudyStackCard`). Rewrite the hero to support a `motion`-free image-and-blurb cycler (lifted in shape from myscrollr). Move routes from `/portfolio` to `/clients`, compose a new nine-band index page, and add nginx 301 redirects for legacy paths.

**Tech Stack:** React 19 · TypeScript strict · TanStack Router (file-based) · Tailwind 4 · Vitest + Testing Library · `simple-icons` (new dep) · `lucide-react` (existing).

---

## Spec Reference

Full design: `docs/superpowers/specs/2026-05-22-clients-stripe-pivot-design.md`. Open it alongside this plan; each task assumes you have the spec at hand for content decisions not embedded in the task itself.

## Sequencing rationale

Tasks are sequenced so each one ends with a green test suite and a committable change. Data-model expansion comes first (everything else depends on it), then sub-primitives (`BrandIcon`, `CaseStudyHeroCycler`), then the new sticky components, then the detail-page route restructure, then the route rename, then the index page bands, then redirects and link sweeps. Stewardship the test suite throughout: every task adds or updates tests before implementation.

## Conventions

- Every code block in a "write the test" step is the complete test file body or the complete added test block — engineers reading out of order can copy-paste.
- Commits use the prefix `feat(clients):` for feature work, `refactor(clients):` for refactors, `chore(clients):` for renames/moves, `test(clients):` for test-only changes, `docs(clients):` for doc touches.
- Run from the repo root unless a task says otherwise. The `apps/marketing` workspace scripts are proxied through root `package.json`.
- All file paths are relative to repo root.

---

## File Structure

**Created:**

- `apps/marketing/src/data/clientLogos.ts` — sample client logos for Band 4
- `apps/marketing/src/data/clientLogos.test.ts`
- `apps/marketing/src/components/BrandIcon.tsx` — slug-resolved icon (simple-icons) with lucide fallback
- `apps/marketing/src/components/BrandIcon.test.tsx`
- `apps/marketing/src/components/caseStudy/CaseStudyHeroCycler.tsx` — image+blurb cycling primitive
- `apps/marketing/src/components/caseStudy/CaseStudyHeroCycler.test.tsx`
- `apps/marketing/src/components/caseStudy/CaseStudyStatsRail.tsx` — sticky left rail
- `apps/marketing/src/components/caseStudy/CaseStudyStatsRail.test.tsx`
- `apps/marketing/src/components/caseStudy/CaseStudyStackCard.tsx` — sticky right card
- `apps/marketing/src/components/caseStudy/CaseStudyStackCard.test.tsx`
- `apps/marketing/src/components/clients/ClientsHero.tsx`
- `apps/marketing/src/components/clients/ClientsPortraitGrid.tsx`
- `apps/marketing/src/components/clients/ClientsResultsBand.tsx`
- `apps/marketing/src/components/clients/ClientsLogoWall.tsx`
- `apps/marketing/src/components/clients/ClientsByEngagementType.tsx`
- `apps/marketing/src/components/clients/ClientsFeaturedEngagement.tsx`
- `apps/marketing/src/components/clients/ClientsByIndustry.tsx`
- `apps/marketing/src/components/clients/ClientsWhatWeBuild.tsx`
- `apps/marketing/src/components/clients/ClientsClosingCta.tsx`
- `apps/marketing/src/routes/clients/index.tsx` (moved + rewritten)
- `apps/marketing/src/routes/clients/$slug.tsx` (moved + restructured)
- `apps/marketing/src/routes/-clients.test.ts` (moved + updated)
- `apps/marketing/public/logos/cloudflare.svg`
- `apps/marketing/public/logos/clients/sample-1.svg` … `sample-8.svg`

**Modified:**

- `apps/marketing/package.json` — add `simple-icons`
- `apps/marketing/src/data/caseStudies.ts` — extend types and data
- `apps/marketing/src/data/caseStudies.test.ts` — extend validators
- `apps/marketing/src/components/caseStudy/CaseStudyHero.tsx` — render cycler when `hero.beats` present
- `apps/marketing/src/components/caseStudy/CaseStudySection.tsx` — quieter visual treatment
- `apps/marketing/src/components/caseStudy/CaseStudyNav.tsx` — update Link `to` to `/clients/$slug`
- `apps/marketing/src/components/Header.tsx` — rename nav item to "Clients" with `to: '/clients'`
- `apps/marketing/src/routes/index.tsx` — update homepage `<Link to="/portfolio">` to `/clients`
- `apps/marketing/nginx.conf` — 301 redirects for legacy paths

**Deleted:**

- `apps/marketing/src/components/caseStudy/CaseStudyAtAGlance.tsx`
- `apps/marketing/src/components/caseStudy/CaseStudyMetrics.tsx`
- `apps/marketing/src/routes/portfolio/index.tsx`
- `apps/marketing/src/routes/portfolio/$slug.tsx`
- `apps/marketing/src/routes/-portfolio.test.ts`

**Auto-regenerated:**

- `apps/marketing/src/routeTree.gen.ts` — touched by `@tanstack/router-plugin/vite` whenever routes change.

---

## Task 1: Extend `CaseStudyMetric` with delta shape (`from` / `to`)

**Files:**

- Modify: `apps/marketing/src/data/caseStudies.ts:1-5`
- Test: `apps/marketing/src/data/caseStudies.test.ts`

- [ ] **Step 1.1: Write the failing tests**

Append to `apps/marketing/src/data/caseStudies.test.ts` (inside the top-level `describe('caseStudies data', …)` block, before its closing brace):

```ts
it('rejects metrics that are neither flat nor delta', () => {
  // A valid metric must be flat (value only) or delta (from + to only).
  // The data must never contain mixed-shape or empty-shape metrics.
  for (const study of caseStudies) {
    for (const metric of study.atAGlance.metrics ?? []) {
      const hasValue =
        typeof metric.value === 'string' && metric.value.length > 0
      const hasFrom = typeof metric.from === 'string' && metric.from.length > 0
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
```

- [ ] **Step 1.2: Run the test and watch it fail**

Run: `npm run test -- caseStudies`
Expected: PASS (no data has metrics yet — the loop is empty). Note: in this case the test is structurally green at zero metrics; that's intentional. It enforces invariants once metrics are added. Move on.

- [ ] **Step 1.3: Extend the type**

Replace lines 1–5 of `apps/marketing/src/data/caseStudies.ts`:

```ts
export interface CaseStudyMetric {
  label: string
  /** Flat metric — present when from/to are not set. */
  value?: string
  /** Delta metric — `from` value before the engagement. */
  from?: string
  /** Delta metric — `to` value after the engagement. */
  to?: string
  context?: string
}
```

- [ ] **Step 1.4: Run typecheck**

Run: `npm run typecheck`
Expected: clean. (No existing data populates `from` or `to` yet, so widening `value` to optional is a non-issue at the data sites.)

- [ ] **Step 1.5: Run the test again**

Run: `npm run test`
Expected: all tests pass (26 + new test).

- [ ] **Step 1.6: Commit**

```bash
git add apps/marketing/src/data/caseStudies.ts apps/marketing/src/data/caseStudies.test.ts
git commit -m "feat(clients): allow delta-shaped CaseStudyMetric (from/to)"
```

---

## Task 2: Categorize `atAGlance.stack` and migrate existing data

**Files:**

- Modify: `apps/marketing/src/data/caseStudies.ts` (types around line 37 and Scrollr data around line 153)
- Test: `apps/marketing/src/data/caseStudies.test.ts`

- [ ] **Step 2.1: Write the failing tests**

Append to `apps/marketing/src/data/caseStudies.test.ts` inside the main describe block:

```ts
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
```

- [ ] **Step 2.2: Run the test and watch it fail**

Run: `npm run test -- caseStudies`
Expected: FAIL — Scrollr's `stack` is currently a flat string array; iterating its entries as `{ category, items }` blows up (`category.category` is undefined).

- [ ] **Step 2.3: Update the types**

In `apps/marketing/src/data/caseStudies.ts`, replace the existing `CaseStudyAtAGlance` interface and add a new `StackCategory` type. Locate the interface (currently lines ~37–49) and replace with:

```ts
export interface StackItem {
  label: string
  /** simple-icons slug — e.g. 'react', 'tauri'. Optional; falls back to lucide. */
  iconSlug?: string
}

export interface StackCategory {
  category: string
  items: ReadonlyArray<StackItem>
}

export interface CaseStudyGlobal {
  label: string
  /** Path under /logos/, e.g. '/logos/cloudflare.svg'. */
  logoSrc: string
}

export interface CaseStudyAtAGlance {
  engagementYear?: string
  duration?: string
  role?: string
  stack?: ReadonlyArray<StackCategory>
  metrics?: ReadonlyArray<CaseStudyMetric>
  /**
   * Compact inline quote rendered inside the At-a-glance strip. For a
   * full-width pull quote with photo/role styling, populate the
   * top-level `pullquote` field on CaseStudy instead.
   */
  quote?: CaseStudyQuote
  /** Stripe-style "Global" row in the right-side Stack card. */
  global?: CaseStudyGlobal
}
```

- [ ] **Step 2.4: Migrate Scrollr's stack**

Replace Scrollr's `stack: [...]` block (currently `lines 153–165`) with:

```ts
      stack: [
        {
          category: 'Client',
          items: [
            { label: 'Tauri v2', iconSlug: 'tauri' },
            { label: 'React 19', iconSlug: 'react' },
            { label: 'Vite 7', iconSlug: 'vite' },
            { label: 'TanStack Router' },
            { label: 'Tailwind 4', iconSlug: 'tailwindcss' },
          ],
        },
        {
          category: 'Server',
          items: [
            { label: 'Go (Fiber)', iconSlug: 'go' },
            { label: 'Rust (tokio)', iconSlug: 'rust' },
          ],
        },
        {
          category: 'Data',
          items: [
            { label: 'PostgreSQL', iconSlug: 'postgresql' },
            { label: 'Redis', iconSlug: 'redis' },
            { label: 'Sequin CDC' },
          ],
        },
        {
          category: 'Auth & Ops',
          items: [{ label: 'Logto' }],
        },
      ],
```

- [ ] **Step 2.5: Run typecheck and tests**

Run: `npm run typecheck && npm run test`
Expected: clean typecheck; tests pass.

- [ ] **Step 2.6: Commit**

```bash
git add apps/marketing/src/data/caseStudies.ts apps/marketing/src/data/caseStudies.test.ts
git commit -m "feat(clients): categorize atAGlance.stack and add CaseStudyGlobal"
```

---

## Task 3: Add `featured` flag and `engagementType` enum to `CaseStudy`

**Files:**

- Modify: `apps/marketing/src/data/caseStudies.ts` (CaseStudy interface, ~line 98; per-case-study entries, lines 121–565)
- Test: `apps/marketing/src/data/caseStudies.test.ts`

- [ ] **Step 3.1: Write the failing tests**

Append to `apps/marketing/src/data/caseStudies.test.ts`:

```ts
it('classifies every case study with an engagementType', () => {
  for (const study of caseStudies) {
    expect(['product', 'operations', 'platform']).toContain(
      study.engagementType,
    )
  }
})

it('promotes exactly one case study via featured: true', () => {
  const featured = caseStudies.filter((s) => s.featured === true)
  expect(featured).toHaveLength(1)
})
```

- [ ] **Step 3.2: Run tests and watch them fail**

Run: `npm run test -- caseStudies`
Expected: FAIL — `engagementType` is undefined; no study has `featured: true`.

- [ ] **Step 3.3: Extend the CaseStudy interface**

In `apps/marketing/src/data/caseStudies.ts`, locate the `export interface CaseStudy { … }` block (~line 98) and add two fields near the top:

```ts
export type EngagementType = 'product' | 'operations' | 'platform'

export interface CaseStudy {
  slug: string
  name: string
  url: string
  industry: string
  systemType: string
  /** Classifies the engagement for the index "By engagement type" tabs. */
  engagementType: EngagementType
  /** Promote to the index "Featured engagement" band. Exactly one true. */
  featured?: boolean
  summary: CaseStudySummary
  hero: CaseStudyHero
  // … rest unchanged
}
```

- [ ] **Step 3.4: Populate the new fields on every case study**

For each of the five case study entries in the `caseStudies` array, add the two new fields just below `systemType`:

```
scrollr                  → engagementType: 'product',    featured: true
cambridge-building-group → engagementType: 'operations'
courtcommand             → engagementType: 'platform'
vm-homes                 → engagementType: 'platform'
star-kids                → engagementType: 'operations'
```

Example, on the Scrollr object (around line 127):

```ts
    industry: 'Consumer Software',
    systemType: 'Cross-Platform Desktop Product',
    engagementType: 'product',
    featured: true,
    summary: { … }
```

Apply the same shape (`engagementType: 'X'`, optional `featured: true` only on Scrollr) to the other four.

- [ ] **Step 3.5: Run typecheck and tests**

Run: `npm run typecheck && npm run test`
Expected: clean; tests pass.

- [ ] **Step 3.6: Commit**

```bash
git add apps/marketing/src/data/caseStudies.ts apps/marketing/src/data/caseStudies.test.ts
git commit -m "feat(clients): add engagementType and featured flag to CaseStudy"
```

---

## Task 4: Add `hero.beats` and `CaseStudySectionRef` enum

**Files:**

- Modify: `apps/marketing/src/data/caseStudies.ts` (CaseStudyHero, ~line 32; Scrollr data, ~line 138)
- Test: `apps/marketing/src/data/caseStudies.test.ts`

- [ ] **Step 4.1: Write the failing tests**

Append to `apps/marketing/src/data/caseStudies.test.ts`:

```ts
it('only uses canonical sectionRef values in hero beats', () => {
  const valid = new Set(['challenge', 'diagnosis', 'solution', 'results'])
  for (const study of caseStudies) {
    for (const beat of study.hero.beats ?? []) {
      expect(valid.has(beat.sectionRef)).toBe(true)
      expect(beat.blurb.length).toBeGreaterThan(0)
      expect(beat.image.src.length).toBeGreaterThan(0)
    }
  }
})

it('never repeats a sectionRef inside the same case study hero beats', () => {
  for (const study of caseStudies) {
    const refs = (study.hero.beats ?? []).map((b) => b.sectionRef)
    expect(new Set(refs).size).toBe(refs.length)
  }
})
```

- [ ] **Step 4.2: Run tests and watch them stay green**

Run: `npm run test -- caseStudies`
Expected: PASS — no case study has beats yet, so the loops are empty. The tests enforce invariants once beats are added in Step 4.4.

- [ ] **Step 4.3: Extend the types**

In `apps/marketing/src/data/caseStudies.ts`, locate `CaseStudyHero` (~line 32) and replace with:

```ts
export type CaseStudySectionRef =
  | 'challenge'
  | 'diagnosis'
  | 'solution'
  | 'results'

export interface CaseStudyHeroBeat {
  image: CaseStudyImage
  sectionRef: CaseStudySectionRef
  blurb: string
}

export interface CaseStudyHero {
  tagline: string
  image?: CaseStudyImage
  /**
   * Story-beat cycler content. When 1+ entries are present, the hero
   * renders the cycling showcase. Otherwise it falls back to the
   * single-image render using `image`.
   */
  beats?: ReadonlyArray<CaseStudyHeroBeat>
}
```

- [ ] **Step 4.4: Add Scrollr's four hero beats**

Inside Scrollr's `hero: { … }` object (currently lines 138–147), add a `beats` field after `image`:

```ts
    hero: {
      tagline:
        'A quiet, always-visible desktop ticker for live scores, prices, headlines, and fantasy — rebuilt from a brittle Chrome extension into a cross-platform native product.',
      image: {
        src: '/case-studies/scrollr/hero-sports-dark.webp',
        alt: 'Scrollr desktop app showing live MLB scores with team logos, status pills, and tabs for Schedule and Standings',
        width: 1600,
        height: 954,
      },
      beats: [
        {
          sectionRef: 'challenge',
          blurb:
            'A founder-funded fantasy ticker locked inside a fragile Chrome extension — multiple developers, no source control, no foundation to build on.',
          image: {
            src: '/case-studies/scrollr/legacy-ticker-bar.webp',
            alt: 'Original Scrollr Chrome-extension ticker bar showing live sports scores in a long horizontal strip',
            width: 1920,
            height: 112,
          },
        },
        {
          sectionRef: 'diagnosis',
          blurb:
            'The codebase was unsalvageable, but the underlying idea was bigger than sports. Decouple the ticker from the browser, broaden past one season, and ship a real product.',
          image: {
            src: '/case-studies/scrollr/ticker-all-detailed-dark.webp',
            alt: 'Scrollr ticker strip serving sports, finance, news, and fantasy together in detailed density',
            width: 1465,
            height: 62,
          },
        },
        {
          sectionRef: 'solution',
          blurb:
            'A cross-platform Tauri desktop app over a decoupled channel architecture: Go core, Rust ingestion services, PostgreSQL + Sequin CDC, SSE delivery.',
          image: {
            src: '/case-studies/scrollr/catalog-dark.webp',
            alt: 'Scrollr source catalog showing Finance, Sports, Fantasy, News, Clock, and Weather as added channels',
            width: 1600,
            height: 954,
          },
        },
        {
          sectionRef: 'results',
          blurb:
            'Now in beta on macOS, Windows, and Linux. Open-source, multi-channel, configurable — the version of Scrollr the founders had been trying to ship all along.',
          image: {
            src: '/case-studies/scrollr/settings-ticker-dark.webp',
            alt: 'Scrollr ticker settings panel with controls for edge position, scroll speed, row count, and per-row channel assignment',
            width: 1600,
            height: 954,
          },
        },
      ],
    },
```

- [ ] **Step 4.5: Run typecheck and tests**

Run: `npm run typecheck && npm run test`
Expected: clean.

- [ ] **Step 4.6: Commit**

```bash
git add apps/marketing/src/data/caseStudies.ts apps/marketing/src/data/caseStudies.test.ts
git commit -m "feat(clients): add CaseStudyHeroBeat schema and Scrollr's four beats"
```

---

## Task 5: Add Scrollr's proof metrics and `global` row to data

**Files:**

- Modify: `apps/marketing/src/data/caseStudies.ts` (Scrollr `atAGlance`)

- [ ] **Step 5.1: Add metrics and global to Scrollr**

In `apps/marketing/src/data/caseStudies.ts`, inside Scrollr's `atAGlance: { … }` block, add a `metrics` array and a `global` field. The numbers are placeholder-and-replace targets — they ship with honest, verifiable claims today and get updated as harder data is captured.

Place them after `stack`:

```ts
      metrics: [
        {
          label: 'Platform reach',
          from: 'Chrome extension only',
          to: 'macOS · Windows · Linux',
          context: 'Browser-bound to native desktop on three platforms.',
        },
        {
          label: 'Architecture',
          from: 'Firebase monolith',
          to: 'Decoupled channels',
          context:
            'Per-source Rust services, Go core, PostgreSQL + Sequin CDC, SSE delivery.',
        },
        {
          label: 'Source availability',
          from: 'Closed, contractor-owned',
          to: 'Open source · AGPL-3.0',
          context: 'Full codebase public on GitHub for inspection and contribution.',
        },
      ],
      global: {
        label: 'Cloudflare Global CDN',
        logoSrc: '/logos/cloudflare.svg',
      },
```

- [ ] **Step 5.2: Run tests**

Run: `npm run test -- caseStudies`
Expected: PASS (the delta-shape and engagement-type validators now have data to exercise).

- [ ] **Step 5.3: Commit**

```bash
git add apps/marketing/src/data/caseStudies.ts
git commit -m "feat(clients): add Scrollr proof metrics and Cloudflare global row"
```

---

## Task 6: Create the Cloudflare logo asset

**Files:**

- Create: `apps/marketing/public/logos/cloudflare.svg`

- [ ] **Step 6.1: Write the logo file**

Cloudflare's wordmark + cloud, in the brand orange. Use the official simplified mark — single-color orange (`#F38020`) on transparent. Save as `apps/marketing/public/logos/cloudflare.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
  <title>Cloudflare</title>
  <path fill="#F38020" d="M16.5088 16.8447l.211-.7341c.2509-.8612.1554-1.6585-.2691-2.2439-.3905-.5388-1.0395-.8589-1.8294-.8957l-14.7474-.183a.2872.2872 0 0 1-.235-.1262.2964.2964 0 0 1-.036-.2718.4245.4245 0 0 1 .3705-.2823l14.8841-.1898c1.7666-.0796 3.6797-1.508 4.3508-3.2553l.8517-2.2179a.5223.5223 0 0 0 .0314-.2917C19.4329 2.6189 16.8154 0 13.5871 0c-2.9745 0-5.5004 2.2225-5.8782 5.1239-2.434-1.815-5.8895-.5852-6.66 2.3592A4.516 4.516 0 0 0 .8666 9.18c-.4994.0228-.9417.397-.9417.952 0 .5577.4533.9988 1.014.9988h15.4233a.6231.6231 0 0 0 .5934-.4451l.6553-1.2415zm2.0747-2.4307c-.1318 0-.2638.012-.3953.0345l-.4063 1.4115a.5224.5224 0 0 1-.0227.0596l-1.6936 3.8945a.2982.2982 0 0 0 .2698.4196h4.6936c2.1234 0 3.8472-1.7237 3.8472-3.8472S22.6595 14.414 18.5836 14.414z"/>
</svg>
```

Note: the path above is the official Cloudflare logo geometry as published in the Simple Icons collection (CC0).

- [ ] **Step 6.2: Verify the file loads**

Run: `ls -la apps/marketing/public/logos/cloudflare.svg`
Expected: file exists, non-zero size.

- [ ] **Step 6.3: Commit**

```bash
git add apps/marketing/public/logos/cloudflare.svg
git commit -m "chore(clients): add Cloudflare logo asset"
```

---

## Task 7: Install `simple-icons` + Testing Library DOM matchers, add `BrandIcon` primitive

**Files:**

- Modify: `apps/marketing/package.json`
- Create: `apps/marketing/vitest.setup.ts`
- Create: `apps/marketing/vitest.config.ts`
- Create: `apps/marketing/src/components/BrandIcon.tsx`
- Create: `apps/marketing/src/components/BrandIcon.test.tsx`

- [ ] **Step 7.1: Install dependencies**

The new component tests in this plan (Tasks 7, 8, 10, 11) use Testing Library DOM matchers like `.toBeInTheDocument()` and `userEvent.setup()`, plus `jsdom` as the test environment. Existing tests are data-only, so neither was wired up yet.

Run:

```bash
npm install simple-icons --workspace @relentnet/marketing
npm install --save-dev @testing-library/jest-dom @testing-library/user-event --workspace @relentnet/marketing
```

Expected: three new dependency lines in `apps/marketing/package.json`. Confirm with `grep -E 'simple-icons|jest-dom|user-event' apps/marketing/package.json`.

- [ ] **Step 7.2: Create vitest setup**

Create `apps/marketing/vitest.setup.ts`:

```ts
import '@testing-library/jest-dom/vitest'
```

Create `apps/marketing/vitest.config.ts` (a sibling to `vite.config.ts` — Vitest reads this when present and falls back to `vite.config.ts` only otherwise):

```ts
import { URL, fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import viteReact from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [viteReact()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: ['./vitest.setup.ts'],
  },
})
```

Note: this config deliberately omits the TanStack devtools and router plugins. Those plugins are dev-server-only and would error during test discovery; the test environment only needs React + the path alias.

- [ ] **Step 7.3: Verify the setup works against existing tests**

Run: `npm run test`
Expected: existing 27 tests pass under the new vitest config (the data-only suites don't touch jsdom or jest-dom, so they're a clean baseline).

- [ ] **Step 7.4: Write the failing test**

Create `apps/marketing/src/components/BrandIcon.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { BrandIcon } from './BrandIcon'

describe('BrandIcon', () => {
  it('renders a known simple-icons slug as an inline SVG', () => {
    const { container } = render(<BrandIcon slug="react" label="React" />)
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg?.getAttribute('aria-label')).toBe('React')
  })

  it('falls back to the lucide Box icon when the slug is unknown', () => {
    const { container } = render(
      <BrandIcon slug="not-a-real-brand" label="Mystery" />,
    )
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
    // The lucide fallback uses currentColor stroke; simple-icons uses fill.
    // Either way the wrapper sets aria-label so screen readers get a name.
    expect(svg?.getAttribute('aria-label')).toBe('Mystery')
  })

  it('renders without a slug by falling back to lucide', () => {
    const { container } = render(<BrandIcon label="Plain" />)
    expect(container.querySelector('svg')).not.toBeNull()
  })
})
```

- [ ] **Step 7.5: Run the test and watch it fail**

Run: `npm run test -- BrandIcon`
Expected: FAIL — `BrandIcon` module not found.

- [ ] **Step 7.6: Implement `BrandIcon`**

Create `apps/marketing/src/components/BrandIcon.tsx`:

```tsx
import { Box } from 'lucide-react'
import {
  siGo,
  siPostgresql,
  siReact,
  siRedis,
  siRust,
  siTailwindcss,
  siTauri,
  siVite,
} from 'simple-icons'
import type { SimpleIcon } from 'simple-icons'

interface BrandIconProps {
  /** simple-icons slug — e.g. "react", "tauri". Falls back to lucide when unknown. */
  slug?: string
  /** Accessible label. Required so screen readers always get a name. */
  label: string
  className?: string
}

/**
 * Static slug→icon map. The map is explicit (not dynamic-by-key) so the
 * bundler can tree-shake unused icons. Add new entries here when a case
 * study adds a new stack item with a brand mark.
 */
const ICON_MAP: Record<string, SimpleIcon> = {
  react: siReact,
  tauri: siTauri,
  vite: siVite,
  tailwindcss: siTailwindcss,
  go: siGo,
  rust: siRust,
  postgresql: siPostgresql,
  redis: siRedis,
}

export function BrandIcon({ slug, label, className }: BrandIconProps) {
  const icon = slug ? ICON_MAP[slug] : undefined

  if (!icon) {
    return (
      <Box
        aria-label={label}
        role="img"
        className={className ?? 'size-4 text-ink-muted'}
      />
    )
  }

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className ?? 'size-4 fill-current text-ink-sub'}
    >
      <path d={icon.path} />
    </svg>
  )
}
```

- [ ] **Step 7.7: Run the tests**

Run: `npm run test -- BrandIcon`
Expected: PASS (3 tests).

- [ ] **Step 7.8: Run typecheck**

Run: `npm run typecheck`
Expected: clean.

- [ ] **Step 7.9: Commit**

```bash
git add apps/marketing/package.json apps/marketing/vitest.setup.ts apps/marketing/vitest.config.ts apps/marketing/src/components/BrandIcon.tsx apps/marketing/src/components/BrandIcon.test.tsx package-lock.json
git commit -m "feat(clients): add BrandIcon primitive + vitest jsdom setup"
```

If npm did not actually modify `package-lock.json`, omit it from the `git add` and the commit will still succeed.

---

## Task 8: Build the `CaseStudyHeroCycler` primitive

**Files:**

- Create: `apps/marketing/src/components/caseStudy/CaseStudyHeroCycler.tsx`
- Create: `apps/marketing/src/components/caseStudy/CaseStudyHeroCycler.test.tsx`

- [ ] **Step 8.1: Write the failing test**

Create `apps/marketing/src/components/caseStudy/CaseStudyHeroCycler.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { CaseStudyHeroBeat } from '@/data/caseStudies'

import { CaseStudyHeroCycler } from './CaseStudyHeroCycler'

const beats: ReadonlyArray<CaseStudyHeroBeat> = [
  {
    sectionRef: 'challenge',
    blurb: 'Challenge blurb',
    image: {
      src: '/test/challenge.webp',
      alt: 'Challenge image',
      width: 800,
      height: 450,
    },
  },
  {
    sectionRef: 'diagnosis',
    blurb: 'Diagnosis blurb',
    image: {
      src: '/test/diagnosis.webp',
      alt: 'Diagnosis image',
      width: 800,
      height: 450,
    },
  },
]

describe('CaseStudyHeroCycler', () => {
  it('renders the first beat by default', () => {
    render(<CaseStudyHeroCycler beats={beats} />)
    expect(screen.getByText('Challenge blurb')).toBeInTheDocument()
  })

  it('renders one progress button per beat with accessible labels', () => {
    render(<CaseStudyHeroCycler beats={beats} />)
    expect(
      screen.getByRole('button', { name: /show challenge beat/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /show diagnosis beat/i }),
    ).toBeInTheDocument()
  })

  it('switches active beat when a progress button is clicked', async () => {
    const user = userEvent.setup()
    render(<CaseStudyHeroCycler beats={beats} />)
    await user.click(
      screen.getByRole('button', { name: /show diagnosis beat/i }),
    )
    expect(screen.getByText('Diagnosis blurb')).toBeInTheDocument()
  })

  it('renders no buttons when beats is empty', () => {
    render(<CaseStudyHeroCycler beats={[]} />)
    expect(screen.queryAllByRole('button')).toHaveLength(0)
  })

  it('auto-advances on the configured interval', () => {
    vi.useFakeTimers()
    try {
      render(<CaseStudyHeroCycler beats={beats} intervalMs={4500} />)
      expect(screen.getByText('Challenge blurb')).toBeInTheDocument()
      vi.advanceTimersByTime(4500)
      expect(screen.getByText('Diagnosis blurb')).toBeInTheDocument()
      vi.advanceTimersByTime(4500)
      // Wraps back to the first beat
      expect(screen.getByText('Challenge blurb')).toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })
})
```

`@testing-library/user-event` was installed alongside `@testing-library/jest-dom` in Task 7. If you skipped or partially ran Task 7, install it now:

```bash
npm install --save-dev @testing-library/user-event --workspace @relentnet/marketing
```

- [ ] **Step 8.2: Run the test and watch it fail**

Run: `npm run test -- CaseStudyHeroCycler`
Expected: FAIL — module not found.

- [ ] **Step 8.3: Implement the cycler**

Create `apps/marketing/src/components/caseStudy/CaseStudyHeroCycler.tsx`:

```tsx
import { useCallback, useEffect, useRef, useState } from 'react'

import type { CaseStudyHeroBeat } from '@/data/caseStudies'

import { CaseStudyImage } from './CaseStudyImage'

interface CaseStudyHeroCyclerProps {
  beats: ReadonlyArray<CaseStudyHeroBeat>
  /** Auto-advance interval in milliseconds. Default 4500ms. */
  intervalMs?: number
}

const DEFAULT_INTERVAL_MS = 4500

/**
 * Story-beat cycling showcase modeled on myscrollr's HeroSection. The
 * component owns its own auto-advance timer and active-index state.
 * Crossfade is a plain CSS opacity transition on stacked, absolutely-
 * positioned images — no animation library required.
 *
 * Renders nothing when `beats` is empty. The parent hero is responsible
 * for choosing whether to render the cycler or fall back to a single
 * static image.
 */
export function CaseStudyHeroCycler({
  beats,
  intervalMs = DEFAULT_INTERVAL_MS,
}: CaseStudyHeroCyclerProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [cycleKey, setCycleKey] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    setCycleKey((k) => k + 1)
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % beats.length)
      setCycleKey((k) => k + 1)
    }, intervalMs)
  }, [beats.length, intervalMs])

  useEffect(() => {
    if (beats.length === 0) return
    startTimer()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [beats.length, startTimer])

  const handleSelect = useCallback(
    (index: number) => {
      setActiveIndex(index)
      startTimer()
    },
    [startTimer],
  )

  if (beats.length === 0) {
    return null
  }

  const safeIndex = Math.min(activeIndex, beats.length - 1)
  const activeBeat = beats[safeIndex]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
      {/* Image stack — only the active one is opaque */}
      <div className="relative aspect-video w-full overflow-hidden border border-line-faint bg-neutral-950">
        {beats.map((beat, idx) => (
          <div
            key={beat.sectionRef}
            className="absolute inset-0 transition-opacity duration-500 ease-out"
            style={{
              opacity: idx === safeIndex ? 1 : 0,
              pointerEvents: 'none',
            }}
          >
            <CaseStudyImage image={beat.image} priority={idx === 0} />
          </div>
        ))}
      </div>

      {/* Blurb + progress controls */}
      <div className="flex flex-col gap-6">
        <p
          key={`blurb-${safeIndex}`}
          className="text-ink-sub text-lg md:text-xl font-light leading-relaxed animate-fade-in-up"
        >
          {activeBeat.blurb}
        </p>

        <div
          role="tablist"
          aria-label="Story beats"
          className="flex gap-2 max-w-md"
        >
          {beats.map((beat, idx) => {
            const isActive = idx === safeIndex
            return (
              <button
                key={beat.sectionRef}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Show ${beat.sectionRef} beat`}
                onClick={() => handleSelect(idx)}
                className="flex-1 cursor-pointer py-3 sm:py-2 group"
              >
                <div className="h-1 rounded-full overflow-hidden bg-line-faint">
                  {isActive ? (
                    <div
                      key={`fill-${cycleKey}`}
                      className="h-full bg-gold origin-left animate-progress-fill"
                      style={{ animationDuration: `${intervalMs}ms` }}
                    />
                  ) : null}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 8.4: Add the `animate-progress-fill` keyframe**

The progress bar fill needs a linear scale-X animation. Open `apps/marketing/src/styles.css` and append:

```css
@keyframes progress-fill {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

.animate-progress-fill {
  width: 100%;
  animation-name: progress-fill;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}
```

- [ ] **Step 8.5: Run the tests**

Run: `npm run test -- CaseStudyHeroCycler`
Expected: PASS (5 tests).

- [ ] **Step 8.6: Run typecheck**

Run: `npm run typecheck`
Expected: clean.

- [ ] **Step 8.7: Commit**

```bash
git add apps/marketing/src/components/caseStudy/CaseStudyHeroCycler.tsx apps/marketing/src/components/caseStudy/CaseStudyHeroCycler.test.tsx apps/marketing/src/styles.css apps/marketing/package.json package-lock.json
git commit -m "feat(clients): add CaseStudyHeroCycler with auto-advance and click-to-jump"
```

---

## Task 9: Rewrite `CaseStudyHero` to render the cycler when beats are present

**Files:**

- Modify: `apps/marketing/src/components/caseStudy/CaseStudyHero.tsx`

- [ ] **Step 9.1: Rewrite the file**

Replace the contents of `apps/marketing/src/components/caseStudy/CaseStudyHero.tsx` with:

```tsx
import { ExternalLink } from 'lucide-react'

import type { CaseStudy } from '@/data/caseStudies'

import { CaseStudyHeroCycler } from './CaseStudyHeroCycler'
import { CaseStudyImage } from './CaseStudyImage'

interface CaseStudyHeroProps {
  caseStudy: CaseStudy
}

export function CaseStudyHero({ caseStudy }: CaseStudyHeroProps) {
  const { name, industry, systemType, url, hero } = caseStudy
  const hasBeats = (hero.beats?.length ?? 0) > 0

  return (
    <section className="relative z-10 px-6 md:px-12 pt-40 md:pt-48 pb-16 md:pb-24">
      <div className="max-w-6xl mx-auto">
        <span className="text-gold text-[10px] tracking-[0.35em] uppercase font-bold animate-fade-in-up">
          {industry} · {systemType}
        </span>
        <h1
          className="mt-6 font-serif text-5xl md:text-7xl leading-[1.05] animate-fade-in-up opacity-0"
          style={{ animationDelay: '120ms' }}
        >
          {name}
        </h1>
        <p
          className="mt-6 max-w-3xl text-ink-sub text-lg md:text-2xl font-light leading-relaxed animate-fade-in-up opacity-0"
          style={{ animationDelay: '220ms' }}
        >
          {hero.tagline}
        </p>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex items-center gap-2 border border-gold bg-gold px-7 py-4 text-sm uppercase tracking-widest text-black transition-all duration-300 hover:bg-transparent hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold animate-fade-in-up opacity-0"
          style={{ animationDelay: '320ms' }}
        >
          Visit live site
          <ExternalLink className="size-4" />
        </a>

        {hasBeats ? (
          <div
            className="mt-16 animate-fade-in-up opacity-0"
            style={{ animationDelay: '420ms' }}
          >
            <CaseStudyHeroCycler beats={hero.beats!} />
          </div>
        ) : hero.image ? (
          <div
            className="mt-16 animate-fade-in-up opacity-0"
            style={{ animationDelay: '420ms' }}
          >
            <CaseStudyImage image={hero.image} priority />
          </div>
        ) : null}
      </div>
    </section>
  )
}
```

- [ ] **Step 9.2: Run typecheck and tests**

Run: `npm run typecheck && npm run test`
Expected: clean; all tests still pass.

- [ ] **Step 9.3: Commit**

```bash
git add apps/marketing/src/components/caseStudy/CaseStudyHero.tsx
git commit -m "feat(clients): render hero cycler when beats are populated"
```

---

## Task 10: Build the `CaseStudyStatsRail` component

**Files:**

- Create: `apps/marketing/src/components/caseStudy/CaseStudyStatsRail.tsx`
- Create: `apps/marketing/src/components/caseStudy/CaseStudyStatsRail.test.tsx`

- [ ] **Step 10.1: Write the failing test**

Create `apps/marketing/src/components/caseStudy/CaseStudyStatsRail.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from '@tanstack/react-router'

import type { CaseStudyAtAGlance } from '@/data/caseStudies'

import { CaseStudyStatsRail } from './CaseStudyStatsRail'

// Helper to render a component that uses TanStack Router Link primitives.
function renderInRouter(ui: React.ReactNode) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('CaseStudyStatsRail', () => {
  it('renders delta metrics as from→to', () => {
    const atAGlance: CaseStudyAtAGlance = {
      metrics: [
        {
          label: 'Lighthouse',
          from: '38',
          to: '96',
          context: 'Mobile, archived legacy.',
        },
      ],
    }
    renderInRouter(<CaseStudyStatsRail atAGlance={atAGlance} />)
    expect(screen.getByText('38')).toBeInTheDocument()
    expect(screen.getByText('96')).toBeInTheDocument()
    expect(screen.getByText(/archived legacy/i)).toBeInTheDocument()
  })

  it('renders flat metrics with value only', () => {
    const atAGlance: CaseStudyAtAGlance = {
      metrics: [{ label: 'Users', value: '13M' }],
    }
    renderInRouter(<CaseStudyStatsRail atAGlance={atAGlance} />)
    expect(screen.getByText('13M')).toBeInTheDocument()
  })

  it('renders engagement facts when present', () => {
    const atAGlance: CaseStudyAtAGlance = {
      engagementYear: '2024–present',
      role: 'Strategy, design, engineering',
    }
    renderInRouter(<CaseStudyStatsRail atAGlance={atAGlance} />)
    expect(screen.getByText('2024–present')).toBeInTheDocument()
    expect(screen.getByText(/strategy/i)).toBeInTheDocument()
  })

  it('always renders the diagnostic CTA', () => {
    renderInRouter(<CaseStudyStatsRail atAGlance={{}} />)
    expect(
      screen.getByRole('link', { name: /start a diagnostic/i }),
    ).toHaveAttribute('href', '/diagnostic')
  })
})
```

- [ ] **Step 10.2: Run the test and watch it fail**

Run: `npm run test -- CaseStudyStatsRail`
Expected: FAIL — module not found.

- [ ] **Step 10.3: Implement the rail**

Create `apps/marketing/src/components/caseStudy/CaseStudyStatsRail.tsx`:

```tsx
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import type { CaseStudyAtAGlance, CaseStudyMetric } from '@/data/caseStudies'

interface CaseStudyStatsRailProps {
  atAGlance: CaseStudyAtAGlance
}

interface EngagementFact {
  label: string
  value: string
}

/**
 * Sticky left rail on /clients/$slug. Composed of three vertical blocks:
 * proof metrics (top), engagement facts (middle), diagnostic CTA (bottom).
 * The CTA is always rendered so the rail never appears fully empty.
 */
export function CaseStudyStatsRail({ atAGlance }: CaseStudyStatsRailProps) {
  const metrics = atAGlance.metrics ?? []
  const facts: Array<EngagementFact> = []
  if (atAGlance.engagementYear) {
    facts.push({ label: 'Year', value: atAGlance.engagementYear })
  }
  if (atAGlance.duration) {
    facts.push({ label: 'Duration', value: atAGlance.duration })
  }
  if (atAGlance.role) {
    facts.push({ label: 'Role', value: atAGlance.role })
  }

  return (
    <aside className="lg:sticky lg:top-32 self-start">
      {metrics.length > 0 ? (
        <section className="border-l border-line-faint pl-5 space-y-8">
          <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold">
            Proof
          </h2>
          {metrics.map((metric) => (
            <MetricEntry key={metric.label} metric={metric} />
          ))}
        </section>
      ) : null}

      {facts.length > 0 ? (
        <section className="mt-12 border-l border-line-faint pl-5 space-y-5">
          <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-ink-muted">
            Engagement
          </h2>
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="text-[10px] font-bold tracking-[0.3em] uppercase text-ink-muted">
                {fact.label}
              </dt>
              <dd className="mt-1 font-serif text-base text-ink-em">
                {fact.value}
              </dd>
            </div>
          ))}
        </section>
      ) : null}

      <div className="mt-12">
        <p className="text-sm text-ink-sub">Ready to diagnose your friction?</p>
        <Link
          to="/diagnostic"
          className="group mt-3 inline-flex items-center gap-2 border border-gold bg-gold px-5 py-3 text-xs uppercase tracking-widest text-black transition-all duration-300 hover:bg-transparent hover:text-gold"
        >
          Start a Diagnostic
          <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </aside>
  )
}

function MetricEntry({ metric }: { metric: CaseStudyMetric }) {
  const isDelta =
    typeof metric.from === 'string' &&
    metric.from.length > 0 &&
    typeof metric.to === 'string' &&
    metric.to.length > 0

  return (
    <div>
      {isDelta ? (
        <>
          <dt className="text-[10px] font-bold tracking-[0.3em] uppercase text-ink-muted">
            {metric.label}
          </dt>
          <dd className="mt-2 font-serif text-2xl md:text-3xl text-ink-em leading-tight">
            <span className="text-ink-muted">{metric.from}</span>
            <span className="mx-2 text-gold">→</span>
            <span>{metric.to}</span>
          </dd>
        </>
      ) : (
        <>
          <dt className="text-[10px] font-bold tracking-[0.3em] uppercase text-ink-muted">
            {metric.label}
          </dt>
          <dd className="mt-2 font-serif text-3xl md:text-4xl text-ink-em leading-none">
            {metric.value}
          </dd>
        </>
      )}
      {metric.context ? (
        <p className="mt-3 text-xs text-ink-muted leading-relaxed">
          {metric.context}
        </p>
      ) : null}
    </div>
  )
}
```

- [ ] **Step 10.4: Run the tests**

Run: `npm run test -- CaseStudyStatsRail`
Expected: PASS (4 tests).

If the test helper `MemoryRouter` import path fails (TanStack Router historically exposes `createMemoryHistory` not `MemoryRouter`), replace the helper with a stub that just renders children — the rail's only Router dependency is the `<Link>` element, which TanStack tolerates outside a router by rendering as an `<a>`:

```tsx
function renderInRouter(ui: React.ReactNode) {
  return render(<>{ui}</>)
}
```

…and assert against `screen.getByRole('link', …)` directly.

- [ ] **Step 10.5: Run typecheck**

Run: `npm run typecheck`
Expected: clean.

- [ ] **Step 10.6: Commit**

```bash
git add apps/marketing/src/components/caseStudy/CaseStudyStatsRail.tsx apps/marketing/src/components/caseStudy/CaseStudyStatsRail.test.tsx
git commit -m "feat(clients): add CaseStudyStatsRail with delta + flat metrics and CTA"
```

---

## Task 11: Build the `CaseStudyStackCard` component

**Files:**

- Create: `apps/marketing/src/components/caseStudy/CaseStudyStackCard.tsx`
- Create: `apps/marketing/src/components/caseStudy/CaseStudyStackCard.test.tsx`

- [ ] **Step 11.1: Write the failing test**

Create `apps/marketing/src/components/caseStudy/CaseStudyStackCard.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import type { CaseStudyAtAGlance } from '@/data/caseStudies'

import { CaseStudyStackCard } from './CaseStudyStackCard'

const atAGlance: CaseStudyAtAGlance = {
  stack: [
    {
      category: 'Client',
      items: [
        { label: 'Tauri v2', iconSlug: 'tauri' },
        { label: 'React 19', iconSlug: 'react' },
        { label: 'Vite 7', iconSlug: 'vite' },
        { label: 'TanStack Router' },
        { label: 'Tailwind 4', iconSlug: 'tailwindcss' },
      ],
    },
    {
      category: 'Server',
      items: [{ label: 'Go (Fiber)', iconSlug: 'go' }],
    },
  ],
  global: { label: 'Cloudflare Global CDN', logoSrc: '/logos/cloudflare.svg' },
}

describe('CaseStudyStackCard', () => {
  it('renders the company name at the top of the card', () => {
    render(
      <CaseStudyStackCard
        name="Scrollr"
        atAGlance={atAGlance}
        industry="Consumer Software"
      />,
    )
    expect(screen.getByRole('heading', { name: 'Scrollr' })).toBeInTheDocument()
  })

  it('shows 4 items by default and a "+ N more" disclosure', () => {
    render(
      <CaseStudyStackCard
        name="Scrollr"
        atAGlance={atAGlance}
        industry="Consumer Software"
      />,
    )
    // The combined stack has 6 items total; show 4, expose disclosure for the rest.
    expect(screen.getByText('Tauri v2')).toBeInTheDocument()
    expect(screen.getByText('React 19')).toBeInTheDocument()
    expect(screen.getByText('Vite 7')).toBeInTheDocument()
    expect(screen.getByText('TanStack Router')).toBeInTheDocument()
    expect(screen.queryByText('Tailwind 4')).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /\+ 2 more/i }),
    ).toBeInTheDocument()
  })

  it('expands to show all items when disclosure is clicked', async () => {
    const user = userEvent.setup()
    render(
      <CaseStudyStackCard
        name="Scrollr"
        atAGlance={atAGlance}
        industry="Consumer Software"
      />,
    )
    await user.click(screen.getByRole('button', { name: /\+ 2 more/i }))
    expect(screen.getByText('Tailwind 4')).toBeInTheDocument()
    expect(screen.getByText('Go (Fiber)')).toBeInTheDocument()
  })

  it('renders the global row with logo and label when present', () => {
    render(
      <CaseStudyStackCard
        name="Scrollr"
        atAGlance={atAGlance}
        industry="Consumer Software"
      />,
    )
    expect(screen.getByAltText(/cloudflare/i)).toBeInTheDocument()
    expect(screen.getByText('Cloudflare Global CDN')).toBeInTheDocument()
  })

  it('omits the global row when atAGlance.global is absent', () => {
    render(
      <CaseStudyStackCard
        name="CBG"
        atAGlance={{ ...atAGlance, global: undefined }}
        industry="Commercial Construction"
      />,
    )
    expect(screen.queryByAltText(/cloudflare/i)).not.toBeInTheDocument()
  })

  it('always renders the industry row', () => {
    render(
      <CaseStudyStackCard
        name="Scrollr"
        atAGlance={atAGlance}
        industry="Consumer Software"
      />,
    )
    expect(screen.getByText('Consumer Software')).toBeInTheDocument()
  })
})
```

- [ ] **Step 11.2: Run the test and watch it fail**

Run: `npm run test -- CaseStudyStackCard`
Expected: FAIL — module not found.

- [ ] **Step 11.3: Implement the stack card**

Create `apps/marketing/src/components/caseStudy/CaseStudyStackCard.tsx`:

```tsx
import { useState } from 'react'

import { BrandIcon } from '@/components/BrandIcon'
import type {
  CaseStudyAtAGlance,
  StackItem as StackItemData,
} from '@/data/caseStudies'

interface CaseStudyStackCardProps {
  name: string
  atAGlance: CaseStudyAtAGlance
  industry: string
}

const DEFAULT_VISIBLE_ITEMS = 4

/**
 * Sticky right card on /clients/$slug, modeled on Stripe's "Products used"
 * card. Shows the case study's name, a categorized stack list with a
 * "+ N more" inline disclosure, an optional Global row with a colored
 * brand logo, and an Industry row repurposed from Stripe's "Enterprise"
 * slot.
 */
export function CaseStudyStackCard({
  name,
  atAGlance,
  industry,
}: CaseStudyStackCardProps) {
  const [expanded, setExpanded] = useState(false)

  const allItems: Array<StackItemData> = (atAGlance.stack ?? []).flatMap(
    (cat) => cat.items as Array<StackItemData>,
  )
  const visibleItems = expanded
    ? allItems
    : allItems.slice(0, DEFAULT_VISIBLE_ITEMS)
  const hiddenCount = Math.max(0, allItems.length - DEFAULT_VISIBLE_ITEMS)

  return (
    <aside className="lg:sticky lg:top-32 self-start border border-line bg-card p-6">
      <h2 className="font-serif text-2xl">{name}</h2>

      {allItems.length > 0 ? (
        <section className="mt-6">
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-ink-muted mb-3">
            Stack
          </p>
          <ul className="space-y-2">
            {visibleItems.map((item) => (
              <li key={item.label} className="flex items-center gap-3">
                <BrandIcon
                  slug={item.iconSlug}
                  label={item.label}
                  className="size-4 fill-current text-ink-sub flex-shrink-0"
                />
                <span className="text-sm text-ink-sub">{item.label}</span>
              </li>
            ))}
          </ul>
          {!expanded && hiddenCount > 0 ? (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="mt-3 text-xs text-ink-muted hover:text-gold transition-colors cursor-pointer"
            >
              + {hiddenCount} more
            </button>
          ) : null}
        </section>
      ) : null}

      {atAGlance.global ? (
        <section className="mt-6 pt-6 border-t border-line-faint">
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-ink-muted mb-3">
            Global
          </p>
          <div className="flex items-center gap-3">
            <img
              src={atAGlance.global.logoSrc}
              alt={atAGlance.global.label}
              className="size-5 flex-shrink-0"
            />
            <span className="text-sm text-ink-sub">
              {atAGlance.global.label}
            </span>
          </div>
        </section>
      ) : null}

      <section className="mt-6 pt-6 border-t border-line-faint">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-ink-muted mb-3">
          Industry
        </p>
        <p className="text-sm text-ink-sub">{industry}</p>
      </section>
    </aside>
  )
}
```

- [ ] **Step 11.4: Run the tests**

Run: `npm run test -- CaseStudyStackCard`
Expected: PASS (6 tests).

- [ ] **Step 11.5: Run typecheck**

Run: `npm run typecheck`
Expected: clean.

- [ ] **Step 11.6: Commit**

```bash
git add apps/marketing/src/components/caseStudy/CaseStudyStackCard.tsx apps/marketing/src/components/caseStudy/CaseStudyStackCard.test.tsx
git commit -m "feat(clients): add CaseStudyStackCard with disclosure and global row"
```

---

## Task 12: Quiet the `CaseStudySection` visual treatment

**Files:**

- Modify: `apps/marketing/src/components/caseStudy/CaseStudySection.tsx`

- [ ] **Step 12.1: Update the standard tone**

In `apps/marketing/src/components/caseStudy/CaseStudySection.tsx`, replace the `tone === 'standard'` return block (currently lines 73–110) with a quieter version that drops the giant dropshadow number and uses a smaller eyebrow:

```tsx
return (
  <section ref={ref} className="relative z-10 px-2 md:px-0 py-12 md:py-16">
    <div className="max-w-3xl">
      <div
        className={`flex items-baseline gap-4 mb-6 ${
          isRevealed ? 'animate-fade-in-up' : 'opacity-0'
        }`}
      >
        <span className="font-serif text-gold text-sm leading-none">
          {number}
        </span>
        <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold">
          {label}
        </span>
      </div>
      <h2
        className={`font-serif text-3xl md:text-4xl leading-tight ${
          isRevealed ? 'animate-fade-in-up' : 'opacity-0'
        }`}
        style={isRevealed ? { animationDelay: '80ms' } : undefined}
      >
        {title}
      </h2>
      <div
        className={`mt-8 ${isRevealed ? 'animate-fade-in-up' : 'opacity-0'}`}
        style={isRevealed ? { animationDelay: '150ms' } : undefined}
      >
        <StoryBlocks blocks={blocks} />
      </div>
    </div>
  </section>
)
```

Note: the `alignRight` prop and the `showNumber` prop become unused in the standard tone. Keep them on the interface for the subordinate render path (which still uses them in spirit), but mark the unused ones with a `void` reference or remove the params from the standard path. The subordinate tone block (lines 41–71) is unchanged.

To eliminate the unused-param TypeScript warning, remove `alignRight` and `showNumber` from the destructured parameter list (they were defaulted, so removal is safe). The interface entries can stay so the call sites don't break compilation if anyone still passes them — they'll simply be ignored.

Updated parameter destructure:

```tsx
export function CaseStudySection({
  number,
  label,
  title,
  blocks,
  tone = 'standard',
}: CaseStudySectionProps) {
```

- [ ] **Step 12.2: Run typecheck and tests**

Run: `npm run typecheck && npm run test`
Expected: clean.

- [ ] **Step 12.3: Commit**

```bash
git add apps/marketing/src/components/caseStudy/CaseStudySection.tsx
git commit -m "refactor(clients): quieter CaseStudySection (small eyebrow, no big number)"
```

---

## Task 13: Restructure `routes/portfolio/$slug.tsx` to the three-column body

This is still `routes/portfolio/$slug.tsx` at this point — we restructure first, then move to `routes/clients/$slug.tsx` in Task 16.

**Files:**

- Modify: `apps/marketing/src/routes/portfolio/$slug.tsx`

- [ ] **Step 13.1: Update section labels and rewire the page body**

Replace the entire contents of `apps/marketing/src/routes/portfolio/$slug.tsx` with:

```tsx
import { createFileRoute, notFound } from '@tanstack/react-router'

import { CaseStudyCta } from '@/components/caseStudy/CaseStudyCta'
import { CaseStudyElevatorPitch } from '@/components/caseStudy/CaseStudyElevatorPitch'
import { CaseStudyHero } from '@/components/caseStudy/CaseStudyHero'
import { CaseStudyNav } from '@/components/caseStudy/CaseStudyNav'
import { CaseStudyPullquote } from '@/components/caseStudy/CaseStudyPullquote'
import { CaseStudyRecognition } from '@/components/caseStudy/CaseStudyRecognition'
import { CaseStudySection } from '@/components/caseStudy/CaseStudySection'
import { CaseStudyServices } from '@/components/caseStudy/CaseStudyServices'
import { CaseStudyStackCard } from '@/components/caseStudy/CaseStudyStackCard'
import { CaseStudyStatsRail } from '@/components/caseStudy/CaseStudyStatsRail'
import { getCaseStudyBySlug } from '@/data/caseStudies'

export const Route = createFileRoute('/portfolio/$slug')({
  loader: ({ params }) => {
    const study = getCaseStudyBySlug(params.slug)
    if (!study) {
      throw notFound()
    }
    return study
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: loaderData.meta.title },
          { name: 'description', content: loaderData.meta.description },
        ]
      : [],
  }),
  component: CaseStudyDetailPage,
})

function CaseStudyDetailPage() {
  const study = Route.useLoaderData()
  const services = study.services ?? []
  const recognition = study.recognition ?? []

  return (
    <div className="min-h-screen overflow-hidden">
      <CaseStudyHero caseStudy={study} />
      {study.elevatorPitch ? (
        <CaseStudyElevatorPitch text={study.elevatorPitch} />
      ) : null}

      <section className="relative z-10 px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
          <div className="lg:col-span-3">
            <CaseStudyStatsRail atAGlance={study.atAGlance} />
          </div>

          <div className="lg:col-span-6 space-y-4">
            <CaseStudySection
              number="01"
              label="The Challenge"
              title="What was getting in the way"
              blocks={study.story.problem}
            />
            <CaseStudySection
              number="02"
              label="The Diagnosis"
              title="What the friction actually was"
              blocks={study.story.diagnosis}
            />
            <CaseStudySection
              number="03"
              label="The Solution"
              title="What we designed and built"
              blocks={study.story.build}
            />
            <CaseStudySection
              number="04"
              label="The Results"
              title="What changed for the business"
              blocks={study.story.outcome}
            />
            {study.story.stewardship ? (
              <CaseStudySection
                number="05"
                label="Stewardship"
                title="How we continue to care for it"
                blocks={study.story.stewardship}
                tone="subordinate"
              />
            ) : null}
          </div>

          <div className="lg:col-span-3">
            <CaseStudyStackCard
              name={study.name}
              atAGlance={study.atAGlance}
              industry={study.industry}
            />
          </div>
        </div>
      </section>

      {study.pullquote ? (
        <CaseStudyPullquote pullquote={study.pullquote} />
      ) : null}

      {services.length > 0 ? <CaseStudyServices services={services} /> : null}
      {recognition.length > 0 ? (
        <CaseStudyRecognition recognition={recognition} />
      ) : null}

      <CaseStudyNav slug={study.slug} />
      <CaseStudyCta />
    </div>
  )
}
```

- [ ] **Step 13.2: Delete the obsolete components**

```bash
rm apps/marketing/src/components/caseStudy/CaseStudyAtAGlance.tsx
rm apps/marketing/src/components/caseStudy/CaseStudyMetrics.tsx
```

- [ ] **Step 13.3: Run typecheck and tests**

Run: `npm run typecheck && npm run test`
Expected: clean. (If a stray import of `CaseStudyAtAGlance` or `CaseStudyMetrics` lingers, the build fails — grep and fix.)

- [ ] **Step 13.4: Visual smoke test (manual)**

Run: `npm run dev`
Visit: `http://localhost:3000/portfolio/scrollr`
Expected:

- Hero shows cycling beats with progress bars under the blurb
- Three-column body renders with sticky rail on the left, narrative center, stack card on the right
- Stack card shows Tauri v2, React 19, Vite 7, TanStack Router visible by default; "+ 2 more" expands
- Cloudflare row visible with the orange logo
- Industry row reads "Consumer Software"
- Section headers read: 01 The Challenge · 02 The Diagnosis · 03 The Solution · 04 The Results · 05 Stewardship

Visit: `http://localhost:3000/portfolio/cambridge-building-group`
Expected:

- Hero shows a single static image (fallback path — no beats present)
- Stack card has no Cloudflare row, no Stack list, but the company name and industry still render
- Stats rail shows only the CTA (no proof metrics, no engagement facts beyond `role`)

- [ ] **Step 13.5: Commit**

```bash
git add apps/marketing/src/routes/portfolio/\$slug.tsx
git rm apps/marketing/src/components/caseStudy/CaseStudyAtAGlance.tsx apps/marketing/src/components/caseStudy/CaseStudyMetrics.tsx
git commit -m "feat(clients): three-column detail layout with rail and stack card"
```

---

## Task 14: Rename `routes/portfolio/$slug.tsx` → `routes/clients/$slug.tsx`

**Files:**

- Move: `apps/marketing/src/routes/portfolio/$slug.tsx` → `apps/marketing/src/routes/clients/$slug.tsx`
- Modify: the route declaration inside the moved file

- [ ] **Step 14.1: Move the file**

```bash
mkdir -p apps/marketing/src/routes/clients
git mv apps/marketing/src/routes/portfolio/\$slug.tsx apps/marketing/src/routes/clients/\$slug.tsx
```

- [ ] **Step 14.2: Update the route declaration**

In the moved file, change:

```ts
export const Route = createFileRoute('/portfolio/$slug')({
```

to:

```ts
export const Route = createFileRoute('/clients/$slug')({
```

- [ ] **Step 14.3: Let the router plugin regenerate the route tree**

Run: `npm run dev` once, let Vite touch `routeTree.gen.ts`, then Ctrl-C. Or run `npm run build` to trigger regeneration without the dev server.

- [ ] **Step 14.4: Run typecheck and tests**

Run: `npm run typecheck && npm run test`
Expected: typecheck fails — `routes/portfolio/index.tsx` still exists and references the old slug route in `CaseStudyNav` and `Header.tsx`. We'll fix those in subsequent tasks. The fail set is expected and limited; record what fails before proceeding.

- [ ] **Step 14.5: Do not commit yet**

The move is intermediate — it'll be committed alongside the index page move in Task 16.

---

## Task 15: Rename `routes/portfolio/index.tsx` → `routes/clients/index.tsx` and stub it for the new layout

The current `portfolio/index.tsx` is the alternating-card layout. We'll move it now (and update its slug-link references), then in Tasks 17–25 we replace its body with the nine-band Stripe shape.

**Files:**

- Move: `apps/marketing/src/routes/portfolio/index.tsx` → `apps/marketing/src/routes/clients/index.tsx`

- [ ] **Step 15.1: Move the file**

```bash
git mv apps/marketing/src/routes/portfolio/index.tsx apps/marketing/src/routes/clients/index.tsx
```

- [ ] **Step 15.2: Update the route declaration and slug links**

In `apps/marketing/src/routes/clients/index.tsx`:

- Change `createFileRoute('/portfolio/')` → `createFileRoute('/clients/')`
- Change `<Link to="/portfolio/$slug" params={{ slug: study.slug }}>` → `<Link to="/clients/$slug" params={{ slug: study.slug }}>`
- Update the head `title` from `'The Work | RelentNet Case Studies'` to `'Our Clients | RelentNet Case Studies'`
- Update the head `description` to: `'Diagnostic-first proof from RelentNet client engagements, showing how diagnosed workflow friction becomes useful systems and clearer operations.'`

- [ ] **Step 15.3: Delete the now-empty old route directory**

```bash
rmdir apps/marketing/src/routes/portfolio 2>/dev/null || true
```

- [ ] **Step 15.4: Update `CaseStudyNav` slug links**

In `apps/marketing/src/components/caseStudy/CaseStudyNav.tsx`, replace both occurrences of `to="/portfolio/$slug"` with `to="/clients/$slug"`.

- [ ] **Step 15.5: Update the test file**

Move and rewrite the test file:

```bash
git mv apps/marketing/src/routes/-portfolio.test.ts apps/marketing/src/routes/-clients.test.ts
```

Then edit `apps/marketing/src/routes/-clients.test.ts`:

```ts
import { describe, expect, it } from 'vitest'

import { caseStudies } from '@/data/caseStudies'

import { portfolioCta, portfolioIntro } from './clients/index'

describe('clients case studies', () => {
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

  it('every case study has a URL-safe slug suitable for /clients/$slug', () => {
    for (const study of caseStudies) {
      expect(study.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    }
  })
})
```

(`portfolioIntro` and `portfolioCta` are still the exported names — only the surrounding file moved. They'll get renamed to `clientsIntro` / `clientsCta` during the index page rewrite in Task 17.)

- [ ] **Step 15.6: Run typecheck, tests, build**

Run: `npm run typecheck && npm run test && npm run build`
Expected: all clean. The route tree regenerates with `/clients/` and `/clients/$slug` in place of `/portfolio` paths.

- [ ] **Step 15.7: Commit**

```bash
git add -A
git commit -m "chore(clients): move /portfolio routes to /clients (slug + index + tests)"
```

---

## Task 16: Update remaining internal `<Link to="/portfolio">` references

**Files:**

- Modify: `apps/marketing/src/components/Header.tsx:20`
- Modify: `apps/marketing/src/routes/index.tsx:193, :401`

- [ ] **Step 16.1: Verify the remaining offenders**

```bash
grep -rn '/portfolio' apps/marketing/src
```

Expected: hits in `components/Header.tsx`, `routes/index.tsx`, and possibly `routeTree.gen.ts` (auto-generated; ignore).

- [ ] **Step 16.2: Update `Header.tsx`**

In `apps/marketing/src/components/Header.tsx`, change the `primaryNavItems` entry:

```ts
  { label: 'Clients', to: '/clients' },
```

(Was: `{ label: 'Work', to: '/portfolio' }`.)

- [ ] **Step 16.3: Update `routes/index.tsx`**

In `apps/marketing/src/routes/index.tsx`, change both `<Link to="/portfolio">` to `<Link to="/clients">`. The CTA copy on these links does not need updating; only the destination.

- [ ] **Step 16.4: Run typecheck, tests, build**

Run: `npm run typecheck && npm run test && npm run build`
Expected: clean.

- [ ] **Step 16.5: Commit**

```bash
git add apps/marketing/src/components/Header.tsx apps/marketing/src/routes/index.tsx
git commit -m "chore(clients): rename nav 'Work' to 'Clients' and update internal links"
```

---

## Task 17: Rewrite `clients/index.tsx` shell — hero band only

We now drop the alternating-card layout that came over from `/portfolio` and replace it with the nine-band Stripe shape. Each band is its own component for testability and isolation. This task wires the hero only (Band 1); subsequent tasks add bands 2–9 one at a time.

**Files:**

- Modify: `apps/marketing/src/routes/clients/index.tsx`
- Create: `apps/marketing/src/components/clients/ClientsHero.tsx`

- [ ] **Step 17.1: Implement `ClientsHero`**

Create `apps/marketing/src/components/clients/ClientsHero.tsx`:

```tsx
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

interface ClientsHeroProps {
  /** Anchor target for the secondary CTA — element ID of the portrait grid section. */
  scrollTargetId: string
}

export const clientsIntro = {
  headlinePrefix: 'Diagnosed friction.',
  headlineAccent: 'Useful systems.',
  headlineSuffix: 'Clearer operations.',
  headline: 'Diagnosed friction. Useful systems. Clearer operations.',
  body: 'These client engagements show the same pattern behind the workflow diagnostic: understand the operational friction, clarify the system worth creating, then build what helps the business move cleaner.',
} as const

export function ClientsHero({ scrollTargetId }: ClientsHeroProps) {
  return (
    <section className="min-h-[80vh] flex flex-col justify-center items-center px-6 relative text-center py-32">
      <p className="text-gold text-[10px] tracking-[0.35em] uppercase font-bold mb-8 animate-fade-in-up">
        Workflow problems solved
      </p>
      <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.05] animate-fade-in-up max-w-5xl">
        {clientsIntro.headlinePrefix}{' '}
        <span className="italic text-gold/90">
          {clientsIntro.headlineAccent}
        </span>{' '}
        {clientsIntro.headlineSuffix}
      </h1>
      <p
        className="mt-8 max-w-2xl text-ink-muted text-sm md:text-lg font-light leading-relaxed opacity-0 animate-fade-in-up"
        style={{ animationDelay: '200ms' }}
      >
        {clientsIntro.body}
      </p>
      <div
        className="mt-10 flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-in-up"
        style={{ animationDelay: '300ms' }}
      >
        <Link
          to="/diagnostic"
          className="inline-flex items-center justify-center gap-3 border border-gold bg-gold px-7 py-4 text-sm uppercase tracking-widest text-black transition-all duration-300 hover:bg-transparent hover:text-gold"
        >
          Start a Diagnostic
          <ArrowRight className="size-4" />
        </Link>
        <a
          href={`#${scrollTargetId}`}
          className="inline-flex items-center justify-center gap-3 border border-line px-7 py-4 text-sm uppercase tracking-widest text-ink transition-all duration-300 hover:border-gold hover:text-gold"
        >
          Read client stories
        </a>
      </div>
    </section>
  )
}
```

- [ ] **Step 17.2: Replace the index page body**

Replace `apps/marketing/src/routes/clients/index.tsx` with:

```tsx
import { createFileRoute } from '@tanstack/react-router'

import { ClientsHero, clientsIntro } from '@/components/clients/ClientsHero'

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

// Re-exported for legacy test compatibility — Task 27 removes these in
// favor of clientsIntro / clientsCta and updates -clients.test.ts.
export const portfolioIntro = clientsIntro
export const portfolioCta = {
  headline: 'See the friction in your own operation?',
  body: 'Start with a workflow diagnostic before deciding what should be built.',
  label: 'Start With a Diagnostic',
  to: '/diagnostic',
} as const

const PORTRAIT_GRID_ID = 'client-stories'

function ClientsIndex() {
  return (
    <div className="min-h-screen overflow-hidden">
      <ClientsHero scrollTargetId={PORTRAIT_GRID_ID} />

      {/* Bands 2–9 land here in subsequent tasks. */}
      <div id={PORTRAIT_GRID_ID} />
    </div>
  )
}
```

- [ ] **Step 17.3: Run typecheck, tests, build**

Run: `npm run typecheck && npm run test && npm run build`
Expected: clean.

- [ ] **Step 17.4: Manual smoke**

Run: `npm run dev`
Visit: `http://localhost:3000/clients`
Expected: just the hero section is visible with two CTAs. Clicking "Read client stories" scrolls to the (currently empty) `PORTRAIT_GRID_ID` anchor.

- [ ] **Step 17.5: Commit**

```bash
git add apps/marketing/src/components/clients/ClientsHero.tsx apps/marketing/src/routes/clients/index.tsx
git commit -m "feat(clients): index page hero band (Band 1)"
```

---

## Task 18: Add Band 2 — Featured portrait grid

**Files:**

- Create: `apps/marketing/src/components/clients/ClientsPortraitGrid.tsx`
- Modify: `apps/marketing/src/routes/clients/index.tsx`

- [ ] **Step 18.1: Implement `ClientsPortraitGrid`**

Create `apps/marketing/src/components/clients/ClientsPortraitGrid.tsx`:

```tsx
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { caseStudies } from '@/data/caseStudies'

/**
 * Featured portrait grid. The first tile (Scrollr) spans 2 columns on
 * `lg:` to anchor the grid; the rest flow as single-column tiles. Each
 * tile shows the case study's hero image as a photographic portrait with
 * a gold industry pill, name, and tagline below.
 */
export function ClientsPortraitGrid() {
  return (
    <section className="relative z-10 px-6 md:px-12 py-20 md:py-28">
      <div className="max-w-7xl mx-auto">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-8">
          Client stories
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {caseStudies.map((study, index) => {
            const isLead = index === 0
            return (
              <Link
                key={study.slug}
                to="/clients/$slug"
                params={{ slug: study.slug }}
                className={`group block border border-line bg-card overflow-hidden hover:border-gold transition-colors ${
                  isLead ? 'lg:col-span-2 lg:row-span-1' : ''
                }`}
              >
                <div className="aspect-video bg-neutral-950 overflow-hidden">
                  {study.hero.image ? (
                    <img
                      src={study.hero.image.src}
                      alt={study.hero.image.alt}
                      className="h-full w-full object-cover opacity-90 grayscale-25 transition duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center px-6 text-center bg-inset">
                      <p className="font-serif text-xl text-ink-muted">
                        {study.systemType}
                      </p>
                    </div>
                  )}
                </div>
                <div className="p-5 md:p-6">
                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold">
                    {study.industry}
                  </span>
                  <h3 className="mt-3 font-serif text-2xl md:text-3xl">
                    {study.name}
                  </h3>
                  <p className="mt-3 text-sm text-ink-sub leading-relaxed">
                    {study.hero.tagline}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-xs text-gold uppercase tracking-widest group-hover:gap-3 transition-all duration-300">
                    Read the story
                    <ArrowRight className="size-3.5" />
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

- [ ] **Step 18.2: Wire the band into the index page**

In `apps/marketing/src/routes/clients/index.tsx`, replace the empty `<div id={PORTRAIT_GRID_ID} />` placeholder with the wired band:

```tsx
import { ClientsPortraitGrid } from '@/components/clients/ClientsPortraitGrid'

// …inside ClientsIndex():
;<div id={PORTRAIT_GRID_ID}>
  <ClientsPortraitGrid />
</div>
```

- [ ] **Step 18.3: Run typecheck, tests, build**

Run: `npm run typecheck && npm run test && npm run build`
Expected: clean.

- [ ] **Step 18.4: Manual smoke**

Visit `/clients`. Expected: portrait grid renders with Scrollr spanning two columns on `lg:`, the other four flowing as single tiles, each linking to `/clients/{slug}`.

- [ ] **Step 18.5: Commit**

```bash
git add apps/marketing/src/components/clients/ClientsPortraitGrid.tsx apps/marketing/src/routes/clients/index.tsx
git commit -m "feat(clients): index page portrait grid band (Band 2)"
```

---

## Task 19: Add Band 3 — Measurable results aggregate band

**Files:**

- Create: `apps/marketing/src/components/clients/ClientsResultsBand.tsx`
- Modify: `apps/marketing/src/routes/clients/index.tsx`

- [ ] **Step 19.1: Implement `ClientsResultsBand`**

Create `apps/marketing/src/components/clients/ClientsResultsBand.tsx`:

```tsx
import { caseStudies } from '@/data/caseStudies'

interface AggregateMetric {
  label: string
  /** Display value; supports either flat or delta wording inline. */
  value: string
  /** Optional sub-line giving provenance (which case study it came from). */
  context?: string
}

/**
 * Aggregated proof across the portfolio. Today, drawn from a small
 * hand-curated list. As more case studies populate hard numbers, this
 * band can switch to programmatic derivation from `caseStudies[].atAGlance.metrics`.
 */
function buildAggregateMetrics(): ReadonlyArray<AggregateMetric> {
  return [
    {
      label: 'Systems shipped',
      value: String(caseStudies.length),
      context: 'Production engagements with diagnosed-then-built outcomes.',
    },
    {
      label: 'Platforms reached',
      value: '1 → 3',
      context: 'Scrollr: Chrome extension to macOS, Windows, and Linux native.',
    },
    {
      label: 'Industries served',
      value: String(new Set(caseStudies.map((s) => s.industry)).size),
      context:
        'Construction, consumer software, sports tech, real estate, nonprofit.',
    },
    {
      label: 'Open-source releases',
      value: '1',
      context: 'Scrollr ships under AGPL-3.0 with a public codebase.',
    },
  ]
}

export function ClientsResultsBand() {
  const metrics = buildAggregateMetrics()
  return (
    <section className="relative z-10 px-6 md:px-12 py-20 md:py-24 border-y border-line">
      <div className="max-w-7xl mx-auto">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-12">
          Measurable results
        </p>
        <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <dt className="text-[10px] font-bold tracking-[0.3em] uppercase text-ink-muted">
                {metric.label}
              </dt>
              <dd className="mt-3 font-serif text-4xl md:text-5xl text-ink-em leading-none">
                {metric.value}
              </dd>
              {metric.context ? (
                <p className="mt-4 text-xs text-ink-muted leading-relaxed">
                  {metric.context}
                </p>
              ) : null}
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
```

- [ ] **Step 19.2: Wire it into the page**

In `apps/marketing/src/routes/clients/index.tsx`, add the band below the portrait grid:

```tsx
import { ClientsResultsBand } from '@/components/clients/ClientsResultsBand'

// …after the portrait grid:
;<ClientsResultsBand />
```

- [ ] **Step 19.3: Run typecheck, tests, build, smoke**

Run: `npm run typecheck && npm run test && npm run build`
Expected: clean. Visit `/clients` — band renders below portrait grid.

- [ ] **Step 19.4: Commit**

```bash
git add apps/marketing/src/components/clients/ClientsResultsBand.tsx apps/marketing/src/routes/clients/index.tsx
git commit -m "feat(clients): aggregate results band (Band 3)"
```

---

## Task 20: Add `clientLogos.ts` data + 8 sample SVGs + Band 4 (Logo wall)

**Files:**

- Create: `apps/marketing/src/data/clientLogos.ts`
- Create: `apps/marketing/src/data/clientLogos.test.ts`
- Create: `apps/marketing/public/logos/clients/sample-1.svg` … `sample-8.svg`
- Create: `apps/marketing/src/components/clients/ClientsLogoWall.tsx`
- Modify: `apps/marketing/src/routes/clients/index.tsx`

- [ ] **Step 20.1: Write the data + test**

Create `apps/marketing/src/data/clientLogos.ts`:

```ts
export interface ClientLogo {
  name: string
  /** Path under public/, e.g. /logos/clients/sample-1.svg. */
  logoSrc: string
  /** True until a real client logo replaces the placeholder. */
  isSample: boolean
  url?: string
}

export const clientLogos: ReadonlyArray<ClientLogo> = [
  {
    name: 'Client One',
    logoSrc: '/logos/clients/sample-1.svg',
    isSample: true,
  },
  {
    name: 'Client Two',
    logoSrc: '/logos/clients/sample-2.svg',
    isSample: true,
  },
  {
    name: 'Client Three',
    logoSrc: '/logos/clients/sample-3.svg',
    isSample: true,
  },
  {
    name: 'Client Four',
    logoSrc: '/logos/clients/sample-4.svg',
    isSample: true,
  },
  {
    name: 'Client Five',
    logoSrc: '/logos/clients/sample-5.svg',
    isSample: true,
  },
  {
    name: 'Client Six',
    logoSrc: '/logos/clients/sample-6.svg',
    isSample: true,
  },
  {
    name: 'Client Seven',
    logoSrc: '/logos/clients/sample-7.svg',
    isSample: true,
  },
  {
    name: 'Client Eight',
    logoSrc: '/logos/clients/sample-8.svg',
    isSample: true,
  },
]
```

Create `apps/marketing/src/data/clientLogos.test.ts`:

```ts
import { describe, expect, it } from 'vitest'

import { clientLogos } from './clientLogos'

describe('clientLogos', () => {
  it('exports at least 8 entries', () => {
    expect(clientLogos.length).toBeGreaterThanOrEqual(8)
  })

  it('every entry has a name and a logoSrc', () => {
    for (const entry of clientLogos) {
      expect(entry.name.length).toBeGreaterThan(0)
      expect(entry.logoSrc).toMatch(/^\/logos\/clients\//)
    }
  })

  it('marks sample entries as such', () => {
    // Today every entry should be a sample. As real logos drop in, flip
    // isSample to false per entry. This test passes either way; it
    // enforces that the flag is always set.
    for (const entry of clientLogos) {
      expect(typeof entry.isSample).toBe('boolean')
    }
  })
})
```

- [ ] **Step 20.2: Create 8 placeholder SVGs**

Create `apps/marketing/public/logos/clients/sample-1.svg` through `sample-8.svg`. Each is a simple monochrome placeholder mark with the client number. Use this template for `sample-N.svg` (replace N):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40" role="img" aria-label="Sample client logo">
  <rect x="0" y="0" width="120" height="40" fill="none" stroke="currentColor" stroke-width="1"/>
  <text x="60" y="25" text-anchor="middle" font-family="serif" font-size="14" fill="currentColor">Client N</text>
</svg>
```

Generate all 8 with a single bash loop:

```bash
mkdir -p apps/marketing/public/logos/clients
for n in 1 2 3 4 5 6 7 8; do
  cat > "apps/marketing/public/logos/clients/sample-${n}.svg" <<EOF
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40" role="img" aria-label="Sample client logo ${n}">
  <rect x="0" y="0" width="120" height="40" fill="none" stroke="currentColor" stroke-width="1"/>
  <text x="60" y="25" text-anchor="middle" font-family="serif" font-size="14" fill="currentColor">Client ${n}</text>
</svg>
EOF
done
```

- [ ] **Step 20.3: Implement `ClientsLogoWall`**

Create `apps/marketing/src/components/clients/ClientsLogoWall.tsx`:

```tsx
import { clientLogos } from '@/data/clientLogos'

export function ClientsLogoWall() {
  return (
    <section className="relative z-10 px-6 md:px-12 py-16 md:py-20">
      <div className="max-w-7xl mx-auto">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-ink-muted text-center mb-10">
          Trusted by
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-ink-muted">
          {clientLogos.map((logo) => (
            <li
              key={logo.name}
              className="opacity-70 hover:opacity-100 transition-opacity"
            >
              <img
                src={logo.logoSrc}
                alt={logo.name}
                className="h-8 md:h-10 w-auto"
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

- [ ] **Step 20.4: Wire it into the page**

```tsx
import { ClientsLogoWall } from '@/components/clients/ClientsLogoWall'

// …after the results band:
;<ClientsLogoWall />
```

- [ ] **Step 20.5: Run typecheck, tests, build, smoke**

Run: `npm run typecheck && npm run test && npm run build`
Expected: clean. Visit `/clients` — the wall renders with 8 placeholder logos.

- [ ] **Step 20.6: Commit**

```bash
git add apps/marketing/public/logos/clients apps/marketing/src/data/clientLogos.ts apps/marketing/src/data/clientLogos.test.ts apps/marketing/src/components/clients/ClientsLogoWall.tsx apps/marketing/src/routes/clients/index.tsx
git commit -m "feat(clients): logo wall with sample placeholders (Band 4)"
```

---

## Task 21: Add Band 5 — By engagement type (tabs)

**Files:**

- Create: `apps/marketing/src/components/clients/ClientsByEngagementType.tsx`
- Modify: `apps/marketing/src/routes/clients/index.tsx`

- [ ] **Step 21.1: Implement the band**

Create `apps/marketing/src/components/clients/ClientsByEngagementType.tsx`:

```tsx
import { Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

import { caseStudies, type EngagementType } from '@/data/caseStudies'

const TABS: ReadonlyArray<{ id: EngagementType; label: string }> = [
  { id: 'product', label: 'Product' },
  { id: 'operations', label: 'Operations' },
  { id: 'platform', label: 'Platform' },
]

export function ClientsByEngagementType() {
  const [activeTab, setActiveTab] = useState<EngagementType>('product')

  const visible = useMemo(
    () => caseStudies.filter((s) => s.engagementType === activeTab),
    [activeTab],
  )

  return (
    <section className="relative z-10 px-6 md:px-12 py-20 md:py-24">
      <div className="max-w-7xl mx-auto">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-3">
          By engagement type
        </p>
        <h2 className="font-serif text-3xl md:text-5xl mb-8">
          What we typically take on
        </h2>

        <div
          role="tablist"
          aria-label="Filter by engagement type"
          className="flex flex-wrap gap-2 border-b border-line mb-10"
        >
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-xs uppercase tracking-[0.2em] border-b-2 transition-colors cursor-pointer ${
                  isActive
                    ? 'border-gold text-gold'
                    : 'border-transparent text-ink-muted hover:text-ink'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {visible.length === 0 ? (
          <p className="text-sm text-ink-muted">
            No case studies tagged for this engagement type yet.
          </p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((study) => (
              <li key={study.slug}>
                <Link
                  to="/clients/$slug"
                  params={{ slug: study.slug }}
                  className="group block border border-line bg-card p-6 hover:border-gold transition-colors h-full"
                >
                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold">
                    {study.industry}
                  </span>
                  <h3 className="mt-3 font-serif text-2xl">{study.name}</h3>
                  <p className="mt-3 text-sm text-ink-sub leading-relaxed">
                    {study.summary.outcome}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 21.2: Wire it in**

```tsx
import { ClientsByEngagementType } from '@/components/clients/ClientsByEngagementType'

// …after the logo wall:
;<ClientsByEngagementType />
```

- [ ] **Step 21.3: Run typecheck, tests, build, smoke**

Run: `npm run typecheck && npm run test && npm run build`
Expected: clean. Visit `/clients` — tab strip renders, clicking Product/Operations/Platform filters the tiles.

- [ ] **Step 21.4: Commit**

```bash
git add apps/marketing/src/components/clients/ClientsByEngagementType.tsx apps/marketing/src/routes/clients/index.tsx
git commit -m "feat(clients): by-engagement-type tab band (Band 5)"
```

---

## Task 22: Add Band 6 — Featured engagement

**Files:**

- Create: `apps/marketing/src/components/clients/ClientsFeaturedEngagement.tsx`
- Modify: `apps/marketing/src/routes/clients/index.tsx`

- [ ] **Step 22.1: Implement the band**

Create `apps/marketing/src/components/clients/ClientsFeaturedEngagement.tsx`:

```tsx
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { caseStudies } from '@/data/caseStudies'

export function ClientsFeaturedEngagement() {
  const featured = caseStudies.find((s) => s.featured === true)
  if (!featured) return null

  const stackItems = (featured.atAGlance.stack ?? []).flatMap((c) => c.items)

  return (
    <section className="relative z-10 px-6 md:px-12 py-24 md:py-32 border-y border-line bg-surface backdrop-blur-xs">
      <div className="max-w-7xl mx-auto">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-3">
          Building together
        </p>
        <h2 className="font-serif text-3xl md:text-5xl mb-12">
          Featured engagement
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-7">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold">
              {featured.industry}
            </span>
            <h3 className="mt-3 font-serif text-4xl md:text-6xl">
              {featured.name}
            </h3>
            <p className="mt-5 text-base md:text-lg text-ink-sub leading-relaxed">
              {featured.hero.tagline}
            </p>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-3">
                  Challenge
                </p>
                <p className="text-sm text-ink-sub leading-relaxed">
                  {featured.summary.problem}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-3">
                  Solution
                </p>
                <p className="text-sm text-ink-sub leading-relaxed">
                  {featured.summary.build}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-3">
                  Results
                </p>
                <p className="text-sm text-ink-sub leading-relaxed">
                  {featured.summary.outcome}
                </p>
              </div>
            </div>

            <Link
              to="/clients/$slug"
              params={{ slug: featured.slug }}
              className="group mt-10 inline-flex items-center gap-2 border border-gold bg-gold px-7 py-4 text-sm uppercase tracking-widest text-black transition-all duration-300 hover:bg-transparent hover:text-gold"
            >
              Read full case study
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="lg:col-span-5">
            {featured.hero.image ? (
              <div className="border border-line-faint bg-neutral-950 aspect-video overflow-hidden">
                <img
                  src={featured.hero.image.src}
                  alt={featured.hero.image.alt}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            ) : null}

            {stackItems.length > 0 ? (
              <div className="mt-6 border border-line-faint bg-card p-5">
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-ink-muted mb-3">
                  Stack
                </p>
                <ul className="flex flex-wrap gap-2">
                  {stackItems.slice(0, 8).map((item) => (
                    <li
                      key={item.label}
                      className="border border-line-faint bg-inset px-3 py-1.5 text-xs text-ink-sub"
                    >
                      {item.label}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 22.2: Wire it in**

```tsx
import { ClientsFeaturedEngagement } from '@/components/clients/ClientsFeaturedEngagement'

// …after the by-engagement-type band:
;<ClientsFeaturedEngagement />
```

- [ ] **Step 22.3: Run typecheck, tests, build, smoke**

Run: `npm run typecheck && npm run test && npm run build`
Expected: clean. Visit `/clients` — Scrollr renders as the featured engagement.

- [ ] **Step 22.4: Commit**

```bash
git add apps/marketing/src/components/clients/ClientsFeaturedEngagement.tsx apps/marketing/src/routes/clients/index.tsx
git commit -m "feat(clients): featured engagement band driven by featured flag (Band 6)"
```

---

## Task 23: Add Band 7 — By industry vertical

**Files:**

- Create: `apps/marketing/src/components/clients/ClientsByIndustry.tsx`
- Modify: `apps/marketing/src/routes/clients/index.tsx`

- [ ] **Step 23.1: Implement the band**

Create `apps/marketing/src/components/clients/ClientsByIndustry.tsx`:

```tsx
import { Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

import { caseStudies } from '@/data/caseStudies'

export function ClientsByIndustry() {
  const industries = useMemo(() => {
    const seen = new Set<string>()
    const out: Array<string> = []
    for (const study of caseStudies) {
      if (!seen.has(study.industry)) {
        seen.add(study.industry)
        out.push(study.industry)
      }
    }
    return out
  }, [])

  const [active, setActive] = useState<string>(industries[0] ?? '')

  const visible = useMemo(
    () => caseStudies.filter((s) => s.industry === active),
    [active],
  )

  if (industries.length === 0) return null

  return (
    <section className="relative z-10 px-6 md:px-12 py-20 md:py-24">
      <div className="max-w-7xl mx-auto">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-3">
          By industry vertical
        </p>
        <h2 className="font-serif text-3xl md:text-5xl mb-8">
          Where we have worked
        </h2>

        <div
          role="tablist"
          aria-label="Filter by industry"
          className="flex flex-wrap gap-2 border-b border-line mb-10"
        >
          {industries.map((industry) => {
            const isActive = industry === active
            return (
              <button
                key={industry}
                role="tab"
                aria-selected={isActive}
                type="button"
                onClick={() => setActive(industry)}
                className={`px-4 py-3 text-xs uppercase tracking-[0.2em] border-b-2 transition-colors cursor-pointer ${
                  isActive
                    ? 'border-gold text-gold'
                    : 'border-transparent text-ink-muted hover:text-ink'
                }`}
              >
                {industry}
              </button>
            )
          })}
        </div>

        <ul className="flex gap-6 overflow-x-auto pb-2">
          {visible.map((study) => (
            <li key={study.slug} className="flex-shrink-0 w-72">
              <Link
                to="/clients/$slug"
                params={{ slug: study.slug }}
                className="group block border border-line bg-card p-5 hover:border-gold transition-colors h-full"
              >
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold">
                  {study.systemType}
                </span>
                <h3 className="mt-3 font-serif text-xl">{study.name}</h3>
                <p className="mt-3 text-sm text-ink-sub leading-relaxed line-clamp-3">
                  {study.hero.tagline}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
```

- [ ] **Step 23.2: Wire it in**

```tsx
import { ClientsByIndustry } from '@/components/clients/ClientsByIndustry'

// …after the featured engagement band:
;<ClientsByIndustry />
```

- [ ] **Step 23.3: Run typecheck, tests, build, smoke**

Run: `npm run typecheck && npm run test && npm run build`
Expected: clean. Visit `/clients` — industry tabs render (Consumer Software, Commercial Construction, Sports Technology, Real Estate, Nonprofit).

- [ ] **Step 23.4: Commit**

```bash
git add apps/marketing/src/components/clients/ClientsByIndustry.tsx apps/marketing/src/routes/clients/index.tsx
git commit -m "feat(clients): by-industry tab band (Band 7)"
```

---

## Task 24: Add Band 8 — What we build

**Files:**

- Create: `apps/marketing/src/components/clients/ClientsWhatWeBuild.tsx`
- Modify: `apps/marketing/src/routes/clients/index.tsx`

- [ ] **Step 24.1: Implement the band**

Create `apps/marketing/src/components/clients/ClientsWhatWeBuild.tsx`:

```tsx
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

interface ServiceArea {
  label: string
  description: string
  to: '/diagnostic' | '/process'
}

const SERVICE_AREAS: ReadonlyArray<ServiceArea> = [
  {
    label: 'Diagnose',
    description:
      'Workflow diagnostic that finds the friction before anything is built.',
    to: '/diagnostic',
  },
  {
    label: 'Design & Build',
    description:
      'Product, system, and infrastructure work scoped to the diagnosis.',
    to: '/process',
  },
  {
    label: 'Steward',
    description:
      'Ongoing care for what we ship — operations, hosting, iteration.',
    to: '/process',
  },
]

export function ClientsWhatWeBuild() {
  return (
    <section className="relative z-10 px-6 md:px-12 py-20 md:py-24 border-t border-line">
      <div className="max-w-7xl mx-auto">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-3">
          What we build
        </p>
        <h2 className="font-serif text-3xl md:text-5xl mb-10">
          The shape of an engagement
        </h2>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SERVICE_AREAS.map((area) => (
            <li key={area.label}>
              <Link
                to={area.to}
                className="group block border border-line bg-card p-6 hover:border-gold transition-colors h-full"
              >
                <h3 className="font-serif text-2xl">{area.label}</h3>
                <p className="mt-3 text-sm text-ink-sub leading-relaxed">
                  {area.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-xs text-gold uppercase tracking-widest group-hover:gap-3 transition-all duration-300">
                  Learn more
                  <ArrowRight className="size-3.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
```

- [ ] **Step 24.2: Wire it in**

```tsx
import { ClientsWhatWeBuild } from '@/components/clients/ClientsWhatWeBuild'

// …after the by-industry band:
;<ClientsWhatWeBuild />
```

- [ ] **Step 24.3: Run typecheck, tests, build, smoke**

Run: `npm run typecheck && npm run test && npm run build`
Expected: clean.

- [ ] **Step 24.4: Commit**

```bash
git add apps/marketing/src/components/clients/ClientsWhatWeBuild.tsx apps/marketing/src/routes/clients/index.tsx
git commit -m "feat(clients): what-we-build service-area band (Band 8)"
```

---

## Task 25: Add Band 9 — Closing CTA

**Files:**

- Create: `apps/marketing/src/components/clients/ClientsClosingCta.tsx`
- Modify: `apps/marketing/src/routes/clients/index.tsx`

- [ ] **Step 25.1: Implement the band**

Create `apps/marketing/src/components/clients/ClientsClosingCta.tsx`:

```tsx
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

interface ClientsClosingCtaProps {
  /** Element ID of the portrait grid to anchor the secondary link to. */
  scrollTargetId: string
}

export const clientsCta = {
  headline: 'See the friction in your own operation?',
  body: 'Start with a workflow diagnostic before deciding what should be built.',
  label: 'Start With a Diagnostic',
  to: '/diagnostic',
} as const

export function ClientsClosingCta({ scrollTargetId }: ClientsClosingCtaProps) {
  return (
    <section className="py-32 flex flex-col justify-center items-center text-center px-6 relative z-10">
      <p className="text-xs font-bold tracking-[0.3em] text-ink-muted uppercase mb-8">
        Your bottleneck, next
      </p>
      <h2 className="font-serif text-4xl md:text-7xl max-w-4xl">
        {clientsCta.headline}
      </h2>
      <p className="mt-6 max-w-2xl text-ink-muted text-sm md:text-base leading-relaxed">
        {clientsCta.body}
      </p>
      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <Link
          to={clientsCta.to}
          className="group inline-flex items-center justify-center gap-3 border border-gold bg-gold px-7 py-4 text-sm uppercase tracking-widest text-black transition-all duration-300 hover:bg-transparent hover:text-gold"
        >
          {clientsCta.label}
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
        <a
          href={`#${scrollTargetId}`}
          className="inline-flex items-center justify-center gap-3 border border-line px-7 py-4 text-sm uppercase tracking-widest text-ink transition-all duration-300 hover:border-gold hover:text-gold"
        >
          Read all stories
        </a>
      </div>
    </section>
  )
}
```

- [ ] **Step 25.2: Wire it in and remove the old re-exports**

In `apps/marketing/src/routes/clients/index.tsx`, replace the entire file with:

```tsx
import { createFileRoute } from '@tanstack/react-router'

import { ClientsByEngagementType } from '@/components/clients/ClientsByEngagementType'
import { ClientsByIndustry } from '@/components/clients/ClientsByIndustry'
import {
  ClientsClosingCta,
  clientsCta,
} from '@/components/clients/ClientsClosingCta'
import { ClientsFeaturedEngagement } from '@/components/clients/ClientsFeaturedEngagement'
import { ClientsHero, clientsIntro } from '@/components/clients/ClientsHero'
import { ClientsLogoWall } from '@/components/clients/ClientsLogoWall'
import { ClientsPortraitGrid } from '@/components/clients/ClientsPortraitGrid'
import { ClientsResultsBand } from '@/components/clients/ClientsResultsBand'
import { ClientsWhatWeBuild } from '@/components/clients/ClientsWhatWeBuild'

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

const PORTRAIT_GRID_ID = 'client-stories'

// Re-exported for the migrated test file.
export { clientsIntro, clientsCta }

function ClientsIndex() {
  return (
    <div className="min-h-screen overflow-hidden">
      <ClientsHero scrollTargetId={PORTRAIT_GRID_ID} />
      <div id={PORTRAIT_GRID_ID}>
        <ClientsPortraitGrid />
      </div>
      <ClientsResultsBand />
      <ClientsLogoWall />
      <ClientsByEngagementType />
      <ClientsFeaturedEngagement />
      <ClientsByIndustry />
      <ClientsWhatWeBuild />
      <ClientsClosingCta scrollTargetId={PORTRAIT_GRID_ID} />
    </div>
  )
}
```

- [ ] **Step 25.3: Update the test file to consume the new exports**

Replace `apps/marketing/src/routes/-clients.test.ts` with:

```ts
import { describe, expect, it } from 'vitest'

import { caseStudies } from '@/data/caseStudies'

import { clientsCta, clientsIntro } from './clients/index'

describe('clients case studies', () => {
  it('frames work as diagnosed friction becoming useful systems', () => {
    expect(clientsIntro.headline).toContain('Diagnosed friction')
    expect(clientsIntro.body).toContain('workflow diagnostic')
    expect(caseStudies).toHaveLength(5)
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
```

- [ ] **Step 25.4: Run typecheck, tests, build, smoke**

Run: `npm run typecheck && npm run test && npm run build`
Expected: clean. Visit `/clients` — all nine bands render top-to-bottom.

- [ ] **Step 25.5: Commit**

```bash
git add apps/marketing/src/components/clients/ClientsClosingCta.tsx apps/marketing/src/routes/clients/index.tsx apps/marketing/src/routes/-clients.test.ts
git commit -m "feat(clients): closing CTA band and final wire-up (Band 9)"
```

---

## Task 26: Add nginx redirects for legacy `/portfolio` paths

**Files:**

- Modify: `apps/marketing/nginx.conf`

- [ ] **Step 26.1: Add the rewrites**

In `apps/marketing/nginx.conf`, insert these two rewrites at the top of the `server { … }` block, immediately after `server_name _;`:

```nginx
  rewrite ^/portfolio$ /clients permanent;
  rewrite ^/portfolio/(.+)$ /clients/$1 permanent;
```

The resulting file (full content):

```nginx
server {
  listen 80 default_server;
  server_name _;

  rewrite ^/portfolio$ /clients permanent;
  rewrite ^/portfolio/(.+)$ /clients/$1 permanent;

  root /usr/share/nginx/html;
  index index.html;

  location ~* \.(?:js|css|woff2?|ttf|otf|eot|png|jpg|jpeg|gif|svg|webp|ico|map)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    try_files $uri =404;
  }

  location / {
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    try_files $uri $uri/ /index.html;
  }

  location = /healthz {
    access_log off;
    return 200 "ok\n";
  }
}
```

- [ ] **Step 26.2: Verify with `nginx -t` locally if available, otherwise rebuild the container**

```bash
docker compose -f compose.yaml -f compose.local.yaml build marketing
```

Expected: build succeeds. (Skip this step if Docker is unavailable; nginx config errors will surface at deploy time.)

- [ ] **Step 26.3: Commit**

```bash
git add apps/marketing/nginx.conf
git commit -m "chore(clients): nginx 301 redirects from /portfolio to /clients"
```

---

## Task 27: Final sweep — verify there are no `/portfolio` references left, and run the full check

**Files:**

- Verification only.

- [ ] **Step 27.1: Grep for residue**

```bash
grep -rn '/portfolio' apps/marketing/src --exclude-dir=node_modules || echo 'no residue'
```

Expected output: hits only inside `routeTree.gen.ts` (auto-generated route map referencing the previous structure — should also be gone after route plugin regeneration; if any remain, run `npm run dev` to force regen, then re-grep). No hits anywhere else.

```bash
grep -rn '"Work"' apps/marketing/src --exclude-dir=node_modules || echo 'no "Work" nav label'
```

Expected: no hits in `Header.tsx`.

- [ ] **Step 27.2: Run the full check**

```bash
npm run check
npm run typecheck
npm run test
npm run build
```

Expected: all clean. Tests pass.

- [ ] **Step 27.3: Manual end-to-end smoke**

Run: `npm run dev`

Visit each URL and verify the expected behavior:

| URL                                 | Expected                                                                                                                                                                                |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/clients`                          | Nine bands render: hero, portrait grid, results, logo wall, engagement-type tabs, featured engagement (Scrollr), industry tabs, what-we-build, closing CTA                              |
| `/clients/scrollr`                  | Cycling hero with 4 beats; three-column body; stack card with disclosure; Cloudflare global row; Industry: Consumer Software; section headers 01 Challenge … 04 Results, 05 Stewardship |
| `/clients/cambridge-building-group` | Static hero (no beats); three-column body; stack card with company name and Industry only; rail shows only CTA + role engagement fact                                                   |
| `/clients/courtcommand`             | Static hero; no proof metrics; rail shows only role + CTA                                                                                                                               |
| `/clients/vm-homes`                 | Static hero; rail shows only role + CTA                                                                                                                                                 |
| `/clients/star-kids`                | Static hero; rail shows only role + CTA                                                                                                                                                 |
| `/clients/nonexistent-slug`         | 404 page (TanStack `notFound()`)                                                                                                                                                        |

Production-only behavior (verify after deploy, not in dev):

| URL                  | Expected                 |
| -------------------- | ------------------------ |
| `/portfolio`         | 301 → `/clients`         |
| `/portfolio/scrollr` | 301 → `/clients/scrollr` |

- [ ] **Step 27.4: Update the PR body**

Update PR #9's body to reflect the layout pivot. Open the PR on GitHub and replace the description with the spec summary (or push the updated body via `gh pr edit 9 --body-file …`). New body should:

- Reference the new spec at `docs/superpowers/specs/2026-05-22-clients-stripe-pivot-design.md`
- Reference this plan at `docs/superpowers/plans/2026-05-22-clients-stripe-pivot.md`
- Note the supersedes-prior-spec relationship
- List the verification commands and their pass status

- [ ] **Step 27.5: Final commit (if anything needs it)**

If `npm run check` rewrote any files (formatting, lint fixes), commit them:

```bash
git add -A
git commit -m "chore(clients): final formatting and lint pass"
```

---

## Self-Review

After completing every task in order, look at the spec and the plan with fresh eyes:

**Spec coverage check:**

- Detail page hero (cycling beats + fallback) → Tasks 4, 8, 9 ✓
- Stats rail (proof + engagement + CTA, delta-aware) → Task 10 ✓
- Stack card (4 + disclosure, global row, industry row) → Tasks 7, 11 ✓
- Quieter section treatment → Task 12 ✓
- Three-column detail page restructure → Task 13 ✓
- Route rename `/portfolio` → `/clients` → Tasks 14, 15, 16 ✓
- Section rename map (Problem→Challenge, Build→Solution, Outcome→Results) → Task 13 (section labels in route component) ✓
- Index page nine bands → Tasks 17–25 ✓
- nginx redirects → Task 26 ✓
- Data model: delta metrics, categorized stack, hero beats, featured flag, engagementType, global row → Tasks 1–5 ✓
- `simple-icons` dep + BrandIcon primitive → Task 7 ✓
- Validation tests → Tasks 1, 2, 3, 4, 20 ✓
- Cloudflare logo asset + 8 sample client logos → Tasks 6, 20 ✓

**Type consistency check:**

- `StackCategory.items` is `ReadonlyArray<StackItem>` everywhere it's referenced (Task 2, used in Tasks 11, 22)
- `CaseStudyHeroBeat.sectionRef` matches `CaseStudySectionRef` enum (Task 4, used in Task 8)
- `EngagementType` enum: `'product' | 'operations' | 'platform'` (Task 3, used in Task 21)
- `CaseStudyGlobal.logoSrc` is a path string starting with `/logos/` (Task 2, asset created in Task 6, consumed in Task 11)

**Placeholder check:** every code block in this plan is concrete; every command shows exact arguments; every test has an actual assertion.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-22-clients-stripe-pivot.md`. Two execution options:

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
