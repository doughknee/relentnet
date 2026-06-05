# Case Study Detail Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add per-project case-study detail pages at `/portfolio/$slug` and link to them from the existing `/portfolio` index, so prospects can read a full diagnostic-led narrative for each engagement.

**Architecture:** Extract the inline `caseStudies` array from `routes/portfolio.tsx` into `src/data/caseStudies.ts` with an expanded schema (`summary` for the index, `story`/`hero`/`atAGlance` for the detail page). Add a new file-based route `routes/portfolio/$slug.tsx` that loads a study by slug, throws `notFound()` for unknown slugs, and renders a sequence of small focused components in `src/components/caseStudy/`. Mirrors the existing `routes/legal/$docId.tsx` + `data/legalDocs.ts` pattern, but uses an array (not a record) so we can compute prev/next.

**Tech Stack:** React 19, Vite 7, TanStack Router (file-based, auto code-split), TypeScript strict, Tailwind CSS 4, Vitest + Testing Library, lucide-react. Tooling already installed.

**Source spec:** `docs/superpowers/specs/2026-05-14-case-study-detail-pages-design.md`

---

## File map

Files to create:

- `apps/marketing/src/data/caseStudies.ts` — types, data, lookup helpers
- `apps/marketing/src/data/-caseStudies.test.ts` — data sanity tests
- `apps/marketing/src/components/caseStudy/CaseStudyImage.tsx`
- `apps/marketing/src/components/caseStudy/CaseStudyHero.tsx`
- `apps/marketing/src/components/caseStudy/CaseStudyAtAGlance.tsx`
- `apps/marketing/src/components/caseStudy/CaseStudySection.tsx` (includes internal `StoryBlocks`)
- `apps/marketing/src/components/caseStudy/CaseStudyNav.tsx`
- `apps/marketing/src/components/caseStudy/CaseStudyCta.tsx`
- `apps/marketing/src/routes/portfolio/$slug.tsx`
- `apps/marketing/src/routes/portfolio/-$slug.test.ts`

Files to modify:

- `apps/marketing/src/routes/portfolio.tsx` — import from `@/data/caseStudies`; update field reads (`study.problem` → `study.summary.problem`); add "Read the case study" link per card
- `apps/marketing/src/routes/-portfolio.test.ts` — update import sources after data extraction; assert deep-link presence

Auto-regenerated (do not hand-edit):

- `apps/marketing/src/routeTree.gen.ts` — the router plugin will regenerate when the dev server runs or `npm run build` runs

Out of scope (content debt tracked separately, not in this plan):

- Capturing CourtCommand and Star Kids screenshots
- Filling real metrics, quotes, gallery shots

---

## Test conventions

The repo uses Vitest with `--passWithNoTests`. Test files inside `src/routes/` use a `-` prefix (e.g., `-portfolio.test.ts`) so TanStack Router does not treat them as routes. The same convention is used for the new tests under `src/routes/portfolio/-$slug.test.ts` and for the data test at `src/data/-caseStudies.test.ts`. Tests run with `npx vitest run <path>`.

There is no `vitest.config.ts`; Vitest uses the Vite config directly. `jsdom` is already installed. `@testing-library/react` and `@testing-library/dom` are installed.

Note: there is no global `beforeEach` cleanup configured. Each rendering test must wrap its body in a `cleanup()` call or use a single `render()` per `it`.

---

## Task 1: Extract case study data with new schema

**Files:**

- Create: `apps/marketing/src/data/caseStudies.ts`
- Modify: `apps/marketing/src/routes/portfolio.tsx` (replace inline `caseStudies` literal with import; update field reads)
- Modify: `apps/marketing/src/routes/-portfolio.test.ts` (update import source)

### Step 1.1: Write the failing data-sanity test

- [ ] Create `apps/marketing/src/data/-caseStudies.test.ts` with:

```ts
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
```

### Step 1.2: Run the test to verify it fails

- [ ] Run: `npx vitest run apps/marketing/src/data/-caseStudies.test.ts`
      Expected: FAIL — cannot resolve module `./caseStudies`.

### Step 1.3: Create the data module

- [ ] Create `apps/marketing/src/data/caseStudies.ts` with:

```ts
export interface CaseStudyMetric {
  label: string
  value: string
  context?: string
}

export interface CaseStudyImage {
  src: string
  alt: string
  caption?: string
  width: number
  height: number
}

export interface CaseStudyQuote {
  text: string
  attribution: string
}

export type StoryBlock =
  | { type: 'p'; text: string }
  | { type: 'image'; image: CaseStudyImage }
  | { type: 'quote'; text: string; attribution?: string }

export interface CaseStudySummary {
  problem: string
  diagnosis: string
  build: string
  outcome: string
}

export interface CaseStudyHero {
  image?: CaseStudyImage
  tagline: string
}

export interface CaseStudyAtAGlance {
  engagementYear?: string
  duration?: string
  role?: string
  stack?: ReadonlyArray<string>
  metrics?: ReadonlyArray<CaseStudyMetric>
  quote?: CaseStudyQuote
}

export interface CaseStudyStory {
  problem: ReadonlyArray<StoryBlock>
  diagnosis: ReadonlyArray<StoryBlock>
  build: ReadonlyArray<StoryBlock>
  outcome: ReadonlyArray<StoryBlock>
  stewardship?: ReadonlyArray<StoryBlock>
}

export interface CaseStudyMeta {
  title: string
  description: string
}

export interface CaseStudy {
  slug: string
  name: string
  url: string
  industry: string
  systemType: string
  summary: CaseStudySummary
  hero: CaseStudyHero
  atAGlance: CaseStudyAtAGlance
  story: CaseStudyStory
  meta: CaseStudyMeta
}

const p = (text: string): StoryBlock => ({ type: 'p', text })

export const caseStudies: ReadonlyArray<CaseStudy> = [
  {
    slug: 'scrollr',
    name: 'Scrollr',
    url: 'https://myscrollr.relentnet.dev',
    industry: 'Trading & Analytics',
    systemType: 'Workflow Platform',
    summary: {
      problem:
        'Market signals, ticker behavior, and user preferences were scattered across disconnected surfaces instead of one operational product experience.',
      diagnosis:
        'The product needed a configurable signal workflow that could serve analysts and traders without forcing every user into the same dashboard.',
      build:
        'A SaaS-style signal ticker with personalized dashboards, real-time data presentation, and extension-ready product architecture.',
      outcome:
        'Scrollr became a sharper product system: easier to explain, easier to demo, and better aligned with how traders actually consume signals.',
    },
    hero: {
      tagline:
        'A configurable signal workflow that fits how traders and analysts actually consume the market.',
      image: {
        src: '/scrollr_portfolio.png',
        alt: 'Scrollr dashboard preview',
        width: 1440,
        height: 810,
      },
    },
    atAGlance: {
      role: 'Product design, build, hosting',
    },
    story: {
      problem: [
        p(
          'Scrollr started life as a collection of useful surfaces — a signal ticker here, a watchlist there, a settings panel somewhere else — without a workflow holding them together. Users had to assemble the product in their heads each time they opened it.',
        ),
        p(
          'For an audience that lives inside fast-moving market data, fragmented surfaces are not just inelegant. They make it harder to trust the data, harder to compare signals over time, and harder to explain to a new user what Scrollr actually is.',
        ),
      ],
      diagnosis: [
        p(
          'The workflow diagnostic showed that traders and analysts were not looking for more features. They were looking for one place where their preferred signals lived, behaved consistently, and could be reconfigured without losing context.',
        ),
        p(
          'The right move was not to add more dashboards. It was to make a single, configurable signal workflow the spine of the product and let everything else reorganize around it.',
        ),
      ],
      build: [
        p(
          'We rebuilt Scrollr around personalized dashboards, real-time signal presentation, and an extension-ready product architecture so new signal types could be added without disturbing the workflow users had already shaped.',
        ),
        p(
          'Ticker behavior, preferences, and data presentation were unified under one configuration model. The product began behaving like an operational tool rather than a collection of widgets.',
        ),
      ],
      outcome: [
        p(
          'Scrollr is easier to explain in a sentence, easier to demo, and easier to extend. The product reads as a coherent system instead of a feature inventory, which is the version of the product that actually compounds value for the people using it.',
        ),
      ],
    },
    meta: {
      title: 'Scrollr Case Study | RelentNet',
      description:
        'How RelentNet rebuilt Scrollr around a configurable signal workflow that fits how traders actually consume market data.',
    },
  },
  {
    slug: 'cambridge-building-group',
    name: 'Cambridge Building Group',
    url: 'https://cambridgebg.com',
    industry: 'Commercial Construction',
    systemType: 'Sales Enablement System',
    summary: {
      problem:
        'A high-trust construction firm needed a digital presence that matched the quality of its work and helped serious prospects understand capability quickly.',
      diagnosis:
        'The site needed to reduce sales friction by making credibility, project quality, and company positioning immediately clear.',
      build:
        'A commanding marketing system with streamlined messaging, professional visual hierarchy, and conversion-focused inquiry paths.',
      outcome:
        'The company gained a more credible front door for high-value commercial opportunities and a cleaner way to support sales conversations.',
    },
    hero: {
      tagline:
        'A commanding front door for high-value commercial construction opportunities.',
      image: {
        src: '/cbg_portfolio.png',
        alt: 'Cambridge Building Group homepage preview',
        width: 1440,
        height: 810,
      },
    },
    atAGlance: {
      role: 'Marketing site, messaging, hosting',
    },
    story: {
      problem: [
        p(
          'Cambridge Building Group does high-trust commercial work, but the previous web presence did not communicate that. Prospects landed on a site that under-represented the company and gave sales conversations nothing to lean on.',
        ),
        p(
          'In commercial construction, the website is not a brochure — it is a stage in the buying process. A weak stage costs the firm conversations it should be having.',
        ),
      ],
      diagnosis: [
        p(
          'The diagnostic showed the real problem was sales friction, not visual design. Serious prospects needed to understand capability, credibility, and positioning within a few seconds of arriving on the site.',
        ),
        p(
          'Everything else — typography, project imagery, contact paths — needed to serve that one job.',
        ),
      ],
      build: [
        p(
          'We built a marketing system with deliberate visual hierarchy, streamlined messaging, and conversion-focused inquiry paths. The structure was designed so that a prospect at the top of the funnel and a prospect ready to talk both find the right next step.',
        ),
        p(
          'The result reads as a commercial firm that takes itself seriously, which is the version of the firm we wanted serious prospects to meet first.',
        ),
      ],
      outcome: [
        p(
          'Cambridge gained a cleaner front door for high-value commercial opportunities. Sales conversations have more to lean on, and the brand is no longer underselling the work behind it.',
        ),
      ],
    },
    meta: {
      title: 'Cambridge Building Group Case Study | RelentNet',
      description:
        'How RelentNet built a sales-enablement marketing system for a high-trust commercial construction firm.',
    },
  },
  {
    slug: 'courtcommand',
    name: 'CourtCommand',
    url: 'https://courtcommand.app',
    industry: 'Sports Technology',
    systemType: 'Real-Time Operations Engine',
    summary: {
      problem:
        'Broadcast-style sports environments cannot tolerate lag, unclear state, or fragile manual scorekeeping workflows.',
      diagnosis:
        'The system needed to behave like operational infrastructure: fast, multi-tenant, synchronized, and simple under pressure.',
      build:
        'A low-latency referee engine and sports ticker designed around real-time score synchronization and live event workflows.',
      outcome:
        'CourtCommand became a purpose-built operating layer for sports presentation instead of another generic scoreboard interface.',
    },
    hero: {
      tagline:
        'A low-latency operating layer for live sports, designed for the people running the room.',
    },
    atAGlance: {
      role: 'Product design, build, hosting',
    },
    story: {
      problem: [
        p(
          'Live sports environments do not forgive sluggish software. A referee, a scorekeeper, and a broadcast operator are all making decisions in seconds, and the tools they reach for need to behave like infrastructure, not like apps.',
        ),
        p(
          'Generic scoreboard interfaces and manual scorekeeping workflows leave too much room for desynchronization, ambiguous state, and the small frictions that compound on game day.',
        ),
      ],
      diagnosis: [
        p(
          'The diagnostic framed CourtCommand as an operations problem first and a product problem second. The system needed to be fast, multi-tenant, synchronized across every surface, and simple to operate under pressure.',
        ),
        p(
          'Everything else — UI, theming, configuration — had to defer to those operational requirements.',
        ),
      ],
      build: [
        p(
          'We built a low-latency referee engine and sports ticker around real-time score synchronization. Game state lives in one place, every connected surface stays consistent, and the operator interface is simple enough to run during a live event.',
        ),
      ],
      outcome: [
        p(
          'CourtCommand reads as a purpose-built operating layer for live sports, not another scoreboard skin. The product is shaped by the demands of a real game-day room.',
        ),
      ],
    },
    meta: {
      title: 'CourtCommand Case Study | RelentNet',
      description:
        'How RelentNet built CourtCommand as a low-latency operating layer for live sports presentation.',
    },
  },
  {
    slug: 'vm-homes',
    name: 'VM Homes',
    url: 'https://vm-homes.com',
    industry: 'Real Estate',
    systemType: 'Client Experience Platform',
    summary: {
      problem:
        'The team needed more than a polished website; they needed a premium buyer experience that could support property search and neighborhood trust.',
      diagnosis:
        'Real estate prospects need clarity, confidence, and fast access to relevant inventory before they are ready to start a conversation.',
      build:
        'A premium digital storefront with MLS-integrated property search, neighborhood guidance, and client-first conversion paths.',
      outcome:
        'The site now works as both a brand asset and a practical client acquisition tool for buyers evaluating the St. Pete Beach market.',
    },
    hero: {
      tagline:
        'A premium client experience for buyers evaluating the St. Pete Beach market.',
      image: {
        src: '/vmh_portfolio.png',
        alt: 'VM Homes site preview',
        width: 1440,
        height: 810,
      },
    },
    atAGlance: {
      role: 'Product design, build, hosting',
    },
    story: {
      problem: [
        p(
          'VM Homes did not need a brochure site. The team needed an experience their buyers could trust before reaching out — one that respected the price point of the homes and supported the trust the team had already built in the neighborhood.',
        ),
        p(
          'A polished website on its own would not have moved the needle. The buyer experience needed to do work.',
        ),
      ],
      diagnosis: [
        p(
          'Buyers in this segment evaluate quietly. They want clarity, confidence, and fast access to relevant inventory before they ever introduce themselves. Anything friction-heavy in the early journey costs the team conversations that should have happened.',
        ),
        p(
          'The diagnostic pointed at a client experience platform, not a marketing site.',
        ),
      ],
      build: [
        p(
          'We built a premium digital storefront with MLS-integrated property search, neighborhood guidance, and client-first conversion paths. Buyers can move from browsing to a real conversation without ever feeling chased.',
        ),
      ],
      outcome: [
        p(
          'The site works as both a brand asset and a practical client acquisition tool. Buyers get clarity early; the team gets better conversations when those buyers raise their hand.',
        ),
      ],
    },
    meta: {
      title: 'VM Homes Case Study | RelentNet',
      description:
        'How RelentNet built a premium client experience platform for VM Homes, supporting trust-led real estate in the St. Pete Beach market.',
    },
  },
  {
    slug: 'star-kids',
    name: 'Star Kids',
    url: 'https://starkids.relentnet.dev',
    industry: 'Nonprofit',
    systemType: 'Mission Communication System',
    summary: {
      problem:
        'A mission-driven organization needed to explain programs, trust, and impact without overwhelming donors or families.',
      diagnosis:
        'The experience needed to simplify complex service areas into a story people could understand and act on quickly.',
      build:
        'A focused nonprofit presence for education, healthcare, nutrition, and mentorship programs with clear paths to learn and support.',
      outcome:
        'The organization gained a clearer digital home for communicating purpose, programs, and credibility.',
    },
    hero: {
      tagline:
        'A clearer digital home for a mission with too many things to say at once.',
    },
    atAGlance: {
      role: 'Marketing site, hosting',
    },
    story: {
      problem: [
        p(
          'Star Kids does meaningful work across several program areas — education, healthcare, nutrition, mentorship — and the previous web presence let all of that flatten into noise. Donors, families, and partners all had to dig to find the part that mattered to them.',
        ),
        p(
          'Mission-driven organizations live or die on clarity. Anything that asks the visitor to work too hard becomes a quiet barrier to support.',
        ),
      ],
      diagnosis: [
        p(
          'The diagnostic showed that the answer was not more content. It was a clearer story: which programs exist, who they serve, how to support them, and how to learn more without being asked to commit before understanding.',
        ),
      ],
      build: [
        p(
          'We built a focused presence that introduces each program area cleanly, surfaces the credibility behind the mission, and offers a direct path for donors and families to take the next step.',
        ),
      ],
      outcome: [
        p(
          'Star Kids has a clearer digital home for communicating purpose, programs, and credibility. The work the team does is no longer competing with its own website.',
        ),
      ],
    },
    meta: {
      title: 'Star Kids Case Study | RelentNet',
      description:
        'How RelentNet built a focused mission communication system for the Star Kids nonprofit.',
    },
  },
]

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug)
}

export function getAdjacentCaseStudies(slug: string): {
  prev: CaseStudy | null
  next: CaseStudy | null
} {
  const index = caseStudies.findIndex((study) => study.slug === slug)
  if (index === -1) {
    return { prev: null, next: null }
  }
  return {
    prev: index > 0 ? caseStudies[index - 1] : null,
    next: index < caseStudies.length - 1 ? caseStudies[index + 1] : null,
  }
}
```

### Step 1.4: Run the data test to verify it passes

- [ ] Run: `npx vitest run apps/marketing/src/data/-caseStudies.test.ts`
      Expected: PASS — all assertions in the suite pass.

### Step 1.5: Update `routes/portfolio.tsx` to use the new data shape

- [ ] In `apps/marketing/src/routes/portfolio.tsx`:
  - Remove the inline `interface CaseStudy { ... }` declaration.
  - Remove the inline `export const caseStudies: Array<CaseStudy> = [...]` literal.
  - Add at the top of the imports (after lucide imports, before any relative imports if added):

```ts
import { caseStudies } from '@/data/caseStudies'
import type { CaseStudy } from '@/data/caseStudies'
```

- Update the `CaseStudySection` component's prop type to use the imported `CaseStudy`.
- Inside the right-column 2-up grid, change the source array from:

```ts
;[
  ['The Problem', study.problem],
  ['The Diagnosis', study.diagnosis],
  ['The Build', study.build],
  ['The Outcome', study.outcome],
]
```

to:

```ts
;[
  ['The Problem', study.summary.problem],
  ['The Diagnosis', study.summary.diagnosis],
  ['The Build', study.summary.build],
  ['The Outcome', study.summary.outcome],
]
```

- Inside the left-column card, the `study.image` reference becomes `study.hero.image?.src` for the conditional, with `alt={study.hero.image?.alt ?? \`${study.name} interface preview\`}`. Concretely:

```tsx
{
  study.hero.image ? (
    <div className="mt-10 overflow-hidden border border-line-faint bg-neutral-950 aspect-video">
      <img
        src={study.hero.image.src}
        alt={study.hero.image.alt}
        width={study.hero.image.width}
        height={study.hero.image.height}
        className="h-full w-full object-cover opacity-90 grayscale-25 transition duration-500 hover:scale-[1.02] hover:grayscale-0"
        loading="lazy"
      />
    </div>
  ) : (
    <div className="mt-10 border border-line-faint bg-inset aspect-video flex items-center justify-center px-8 text-center">
      <p className="font-serif text-2xl text-ink-muted">
        Real-time system preview
      </p>
    </div>
  )
}
```

- Leave `portfolioIntro` and `portfolioCta` exports in place (they're consumed by the existing portfolio test).

### Step 1.6: Update the portfolio route test to import from the new source

- [ ] In `apps/marketing/src/routes/-portfolio.test.ts`, change the import line:

```ts
import { caseStudies, portfolioCta, portfolioIntro } from './portfolio'
```

to:

```ts
import { portfolioCta, portfolioIntro } from './portfolio'
import { caseStudies } from '@/data/caseStudies'
```

Update the diagnosis assertion to use the new shape:

```ts
expect(caseStudies.every((study) => study.summary.diagnosis.length > 0)).toBe(
  true,
)
```

### Step 1.7: Run portfolio + data tests to verify both pass

- [ ] Run: `npx vitest run apps/marketing/src/data/-caseStudies.test.ts apps/marketing/src/routes/-portfolio.test.ts`
      Expected: PASS — both suites green.

### Step 1.8: Typecheck

- [ ] Run: `npm run typecheck`
      Expected: no TypeScript errors.

### Step 1.9: Commit

- [ ] Run:

```sh
git add apps/marketing/src/data/caseStudies.ts \
        apps/marketing/src/data/-caseStudies.test.ts \
        apps/marketing/src/routes/portfolio.tsx \
        apps/marketing/src/routes/-portfolio.test.ts
git commit -m "refactor: extract case study data with expanded schema"
```

---

## Task 2: Add "Read the case study" link to each index card

**Files:**

- Modify: `apps/marketing/src/routes/portfolio.tsx`
- Modify: `apps/marketing/src/routes/-portfolio.test.ts`

### Step 2.1: Write the failing assertion in the portfolio route test

- [ ] In `apps/marketing/src/routes/-portfolio.test.ts`, append a new `it` block inside the existing `describe('portfolio case studies')`:

```ts
it('every case study exposes a deep link to its detail page', () => {
  for (const study of caseStudies) {
    expect(study.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
  }
})
```

(We can't easily DOM-test the `<Link>` here without rendering the route — a deeper render test goes in Task 6. This test just protects the contract that every entry has a slug we can link to.)

### Step 2.2: Run the test to verify it passes (the slug regex is the new behavior)

- [ ] Run: `npx vitest run apps/marketing/src/routes/-portfolio.test.ts`
      Expected: PASS — every slug already matches the regex (set up in Task 1).

### Step 2.3: Add the deep link to the index card

- [ ] In `apps/marketing/src/routes/portfolio.tsx`:
  - Update the imports to include `Link`'s existing import (already there) and ensure `caseStudies` (and not `caseStudy`) is imported.
  - Inside `CaseStudySection`, locate the existing "View live site" `<a>` link near the bottom of the left-column card. Immediately after it, add:

```tsx
<Link
  to="/portfolio/$slug"
  params={{ slug: study.slug }}
  className="mt-3 inline-flex items-center gap-2 text-sm text-ink uppercase tracking-widest hover:text-gold transition-colors"
>
  Read the case study
  <ArrowRight className="size-4" />
</Link>
```

- Add `ArrowRight` to the lucide import line if it is not already present there (it is currently imported at the top of `portfolio.tsx` — confirm before editing).

### Step 2.4: Typecheck (the `to`/`params` will currently fail because the route does not exist yet)

- [ ] Run: `npm run typecheck`
      Expected: TypeScript error — `'/portfolio/$slug'` is not a known route. This is expected; Task 3 introduces the route and the router plugin will regenerate `routeTree.gen.ts`.

> **Important:** Do not commit yet. Proceed to Task 3 — typecheck passes after Task 3 lands.

---

## Task 3: Add the `/portfolio/$slug` route shell

**Files:**

- Create: `apps/marketing/src/routes/portfolio/$slug.tsx`

The router plugin regenerates `apps/marketing/src/routeTree.gen.ts` automatically on dev server start or `npm run build`. Do not hand-edit it.

### Step 3.1: Create a minimal route that renders a placeholder

- [ ] Create `apps/marketing/src/routes/portfolio/$slug.tsx`:

```tsx
import { createFileRoute, notFound } from '@tanstack/react-router'

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
  return (
    <div className="min-h-screen px-6 md:px-12 py-32 text-ink">
      <h1 className="font-serif text-4xl">{study.name}</h1>
      <p className="mt-4 text-ink-sub">{study.hero.tagline}</p>
    </div>
  )
}
```

### Step 3.2: Trigger router-tree regeneration

- [ ] Ensure the dev server is running, or run a build to regenerate the route tree. If the dev server is already running, the plugin should pick up the new file. If not:

```sh
npm run build
```

Expected: build succeeds. `apps/marketing/src/routeTree.gen.ts` is updated to include `/portfolio/$slug`.

### Step 3.3: Re-run typecheck (Task 2's pending error should clear)

- [ ] Run: `npm run typecheck`
      Expected: no TypeScript errors. The `to="/portfolio/$slug"` link from Task 2 now resolves.

### Step 3.4: Commit Task 2 + Task 3 together

- [ ] Run:

```sh
git add apps/marketing/src/routes/portfolio.tsx \
        apps/marketing/src/routes/-portfolio.test.ts \
        apps/marketing/src/routes/portfolio/$slug.tsx \
        apps/marketing/src/routeTree.gen.ts
git commit -m "feat: add /portfolio/\$slug route and index deep-link"
```

---

## Task 4: Build the `CaseStudyImage` figure primitive

**Files:**

- Create: `apps/marketing/src/components/caseStudy/CaseStudyImage.tsx`

This is the lowest-level component. Other components depend on it, so it goes first.

### Step 4.1: Write the component

- [ ] Create `apps/marketing/src/components/caseStudy/CaseStudyImage.tsx`:

```tsx
import type { CaseStudyImage as CaseStudyImageData } from '@/data/caseStudies'

interface CaseStudyImageProps {
  image: CaseStudyImageData
  priority?: boolean
}

export function CaseStudyImage({
  image,
  priority = false,
}: CaseStudyImageProps) {
  return (
    <figure className="my-10 border border-line-faint bg-inset overflow-hidden">
      <img
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading={priority ? 'eager' : 'lazy'}
        className="block h-auto w-full"
      />
      {image.caption ? (
        <figcaption className="border-t border-line-faint px-5 py-3 text-xs text-ink-muted">
          {image.caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
```

### Step 4.2: Typecheck

- [ ] Run: `npm run typecheck`
      Expected: no errors.

---

## Task 5: Build `CaseStudyHero`

**Files:**

- Create: `apps/marketing/src/components/caseStudy/CaseStudyHero.tsx`

### Step 5.1: Write the component

- [ ] Create `apps/marketing/src/components/caseStudy/CaseStudyHero.tsx`:

```tsx
import { ExternalLink } from 'lucide-react'

import type { CaseStudy } from '@/data/caseStudies'

import { CaseStudyImage } from './CaseStudyImage'

interface CaseStudyHeroProps {
  caseStudy: CaseStudy
}

export function CaseStudyHero({ caseStudy }: CaseStudyHeroProps) {
  const { name, industry, systemType, url, hero } = caseStudy

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
          className="mt-10 inline-flex items-center gap-2 border border-gold bg-gold px-7 py-4 text-sm uppercase tracking-widest text-black transition-all duration-300 hover:bg-transparent hover:text-gold animate-fade-in-up opacity-0"
          style={{ animationDelay: '320ms' }}
        >
          Visit live site
          <ExternalLink className="size-4" />
        </a>

        {hero.image ? (
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

### Step 5.2: Typecheck

- [ ] Run: `npm run typecheck`
      Expected: no errors.

---

## Task 6: Build `CaseStudyAtAGlance`

**Files:**

- Create: `apps/marketing/src/components/caseStudy/CaseStudyAtAGlance.tsx`

### Step 6.1: Write the component

- [ ] Create `apps/marketing/src/components/caseStudy/CaseStudyAtAGlance.tsx`:

```tsx
import type { CaseStudyAtAGlance as AtAGlanceData } from '@/data/caseStudies'

interface CaseStudyAtAGlanceProps {
  atAGlance: AtAGlanceData
  industry: string
  systemType: string
}

interface FactRow {
  label: string
  value: string
}

export function CaseStudyAtAGlance({
  atAGlance,
  industry,
  systemType,
}: CaseStudyAtAGlanceProps) {
  const facts: Array<FactRow> = [
    { label: 'Industry', value: industry },
    { label: 'System', value: systemType },
  ]
  if (atAGlance.engagementYear) {
    facts.push({ label: 'Year', value: atAGlance.engagementYear })
  }
  if (atAGlance.duration) {
    facts.push({ label: 'Duration', value: atAGlance.duration })
  }
  if (atAGlance.role) {
    facts.push({ label: 'Role', value: atAGlance.role })
  }

  const hasMetrics =
    atAGlance.metrics !== undefined && atAGlance.metrics.length > 0
  const hasStack = atAGlance.stack !== undefined && atAGlance.stack.length > 0

  return (
    <section className="relative z-10 px-6 md:px-12 py-16 md:py-20 border-y border-line bg-surface backdrop-blur-xs">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-8">
          At a glance
        </h2>

        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="border border-line-faint bg-card p-5"
            >
              <dt className="text-[10px] font-bold tracking-[0.3em] uppercase text-ink-muted">
                {fact.label}
              </dt>
              <dd className="mt-2 font-serif text-lg text-ink-em">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>

        {hasStack ? (
          <div className="mt-10">
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-ink-muted mb-4">
              Stack
            </p>
            <ul className="flex flex-wrap gap-2">
              {atAGlance.stack!.map((item) => (
                <li
                  key={item}
                  className="border border-line-faint bg-inset px-3 py-1.5 text-xs text-ink-sub"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {hasMetrics ? (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {atAGlance.metrics!.map((metric) => (
              <div
                key={metric.label}
                className="border border-line bg-card p-6"
              >
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-ink-muted">
                  {metric.label}
                </p>
                <p className="mt-3 font-serif text-3xl text-ink-em">
                  {metric.value}
                </p>
                {metric.context ? (
                  <p className="mt-2 text-xs text-ink-muted">
                    {metric.context}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}

        {atAGlance.quote ? (
          <figure className="mt-12 max-w-3xl">
            <blockquote className="font-serif italic text-xl md:text-2xl text-ink-sub leading-relaxed">
              <span className="text-gold mr-1" aria-hidden="true">
                &ldquo;
              </span>
              {atAGlance.quote.text}
              <span className="text-gold ml-1" aria-hidden="true">
                &rdquo;
              </span>
            </blockquote>
            <figcaption className="mt-4 text-[10px] font-bold tracking-[0.3em] uppercase text-ink-muted">
              {atAGlance.quote.attribution}
            </figcaption>
          </figure>
        ) : null}
      </div>
    </section>
  )
}
```

### Step 6.2: Typecheck

- [ ] Run: `npm run typecheck`
      Expected: no errors.

---

## Task 7: Build `CaseStudySection` with `StoryBlocks`

**Files:**

- Create: `apps/marketing/src/components/caseStudy/CaseStudySection.tsx`

### Step 7.1: Write the component (including the internal `StoryBlocks` renderer)

- [ ] Create `apps/marketing/src/components/caseStudy/CaseStudySection.tsx`:

```tsx
import type { StoryBlock } from '@/data/caseStudies'

import { CaseStudyImage } from './CaseStudyImage'

interface CaseStudySectionProps {
  number: string
  label: string
  title: string
  blocks: ReadonlyArray<StoryBlock>
  alignRight?: boolean
}

export function CaseStudySection({
  number,
  label,
  title,
  blocks,
  alignRight = false,
}: CaseStudySectionProps) {
  if (blocks.length === 0) {
    return null
  }

  return (
    <section className="relative z-10 px-6 md:px-12 py-24 md:py-32">
      <div className="max-w-6xl mx-auto">
        <span
          className={`block text-[7rem] md:text-[10rem] font-serif text-black/[0.06] dark:text-white/[0.03] leading-none select-none -mb-10 md:-mb-14 ${
            alignRight ? 'md:text-right' : ''
          }`}
        >
          {number}
        </span>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          <div
            className={`md:col-span-3 ${alignRight ? 'md:order-last md:text-right' : ''}`}
          >
            <span className="text-gold text-[10px] font-bold tracking-[0.3em] uppercase block">
              {label}
            </span>
            <h2 className="font-serif text-2xl md:text-3xl mt-2">{title}</h2>
          </div>

          <div
            className={`md:col-span-9 ${alignRight ? 'md:order-first' : ''}`}
          >
            <StoryBlocks blocks={blocks} />
          </div>
        </div>
      </div>
    </section>
  )
}

interface StoryBlocksProps {
  blocks: ReadonlyArray<StoryBlock>
}

function StoryBlocks({ blocks }: StoryBlocksProps) {
  return (
    <div className="space-y-6 max-w-2xl">
      {blocks.map((block, index) => {
        if (block.type === 'p') {
          return (
            <p
              key={index}
              className="text-ink-sub leading-relaxed text-base md:text-lg"
            >
              {block.text}
            </p>
          )
        }
        if (block.type === 'image') {
          return <CaseStudyImage key={index} image={block.image} />
        }
        // quote
        return (
          <figure key={index} className="border-l-2 border-gold/40 pl-6 my-8">
            <blockquote className="font-serif italic text-xl md:text-2xl text-ink-sub leading-relaxed">
              {block.text}
            </blockquote>
            {block.attribution ? (
              <figcaption className="mt-3 text-[10px] font-bold tracking-[0.3em] uppercase text-ink-muted">
                {block.attribution}
              </figcaption>
            ) : null}
          </figure>
        )
      })}
    </div>
  )
}
```

### Step 7.2: Typecheck

- [ ] Run: `npm run typecheck`
      Expected: no errors.

---

## Task 8: Build `CaseStudyNav` (prev/next)

**Files:**

- Create: `apps/marketing/src/components/caseStudy/CaseStudyNav.tsx`

### Step 8.1: Write the component

- [ ] Create `apps/marketing/src/components/caseStudy/CaseStudyNav.tsx`:

```tsx
import { Link } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import { getAdjacentCaseStudies } from '@/data/caseStudies'

interface CaseStudyNavProps {
  slug: string
}

export function CaseStudyNav({ slug }: CaseStudyNavProps) {
  const { prev, next } = getAdjacentCaseStudies(slug)
  if (!prev && !next) {
    return null
  }

  return (
    <nav
      aria-label="Case study navigation"
      className="relative z-10 px-6 md:px-12 py-16 md:py-20 border-y border-line"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {prev ? (
          <Link
            to="/portfolio/$slug"
            params={{ slug: prev.slug }}
            className="group border border-line bg-card p-6 md:p-8 hover:border-gold transition-colors"
          >
            <span className="flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] uppercase text-ink-muted group-hover:text-gold transition-colors">
              <ArrowLeft className="size-4" />
              Previous
            </span>
            <span className="block mt-4 text-[10px] tracking-[0.3em] uppercase text-gold">
              {prev.industry}
            </span>
            <p className="mt-2 font-serif text-2xl md:text-3xl">{prev.name}</p>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to="/portfolio/$slug"
            params={{ slug: next.slug }}
            className="group border border-line bg-card p-6 md:p-8 hover:border-gold transition-colors md:text-right"
          >
            <span className="flex items-center justify-end gap-2 text-[10px] font-bold tracking-[0.3em] uppercase text-ink-muted group-hover:text-gold transition-colors">
              Next
              <ArrowRight className="size-4" />
            </span>
            <span className="block mt-4 text-[10px] tracking-[0.3em] uppercase text-gold">
              {next.industry}
            </span>
            <p className="mt-2 font-serif text-2xl md:text-3xl">{next.name}</p>
          </Link>
        ) : (
          <span />
        )}
      </div>
    </nav>
  )
}
```

### Step 8.2: Typecheck

- [ ] Run: `npm run typecheck`
      Expected: no errors.

---

## Task 9: Build `CaseStudyCta` (closing CTA mirror)

**Files:**

- Create: `apps/marketing/src/components/caseStudy/CaseStudyCta.tsx`

### Step 9.1: Write the component

- [ ] Create `apps/marketing/src/components/caseStudy/CaseStudyCta.tsx`:

```tsx
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

export function CaseStudyCta() {
  return (
    <section className="py-32 flex flex-col justify-center items-center text-center px-6 relative z-10">
      <p className="text-xs font-bold tracking-[0.3em] text-ink-muted uppercase mb-8">
        Your bottleneck, next
      </p>
      <h2 className="font-serif text-4xl md:text-7xl max-w-4xl">
        See the friction in your own operation?
      </h2>
      <p className="mt-6 max-w-2xl text-ink-muted text-sm md:text-base leading-relaxed">
        Start with a workflow diagnostic before deciding what should be built.
      </p>
      <Link
        to="/diagnostic"
        className="group mt-10 inline-flex items-center justify-center gap-3 border border-gold bg-gold px-7 py-4 text-sm uppercase tracking-widest text-black transition-all duration-300 hover:bg-transparent hover:text-gold"
      >
        Start With a Diagnostic
        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
      </Link>
    </section>
  )
}
```

> Note: the strings here intentionally mirror the existing `portfolioCta` constants in `routes/portfolio.tsx`. We do not import from the route module to avoid a circular dependency between the detail route and the index route. If you'd rather centralize, move `portfolioCta` into `@/data/caseStudies` in a follow-up — not in scope here.

### Step 9.2: Typecheck

- [ ] Run: `npm run typecheck`
      Expected: no errors.

---

## Task 10: Wire all sections into `routes/portfolio/$slug.tsx`

**Files:**

- Modify: `apps/marketing/src/routes/portfolio/$slug.tsx`

### Step 10.1: Replace the placeholder component body

- [ ] Open `apps/marketing/src/routes/portfolio/$slug.tsx` and replace the file contents with:

```tsx
import { createFileRoute, notFound } from '@tanstack/react-router'

import { CaseStudyAtAGlance } from '@/components/caseStudy/CaseStudyAtAGlance'
import { CaseStudyCta } from '@/components/caseStudy/CaseStudyCta'
import { CaseStudyHero } from '@/components/caseStudy/CaseStudyHero'
import { CaseStudyNav } from '@/components/caseStudy/CaseStudyNav'
import { CaseStudySection } from '@/components/caseStudy/CaseStudySection'
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

  return (
    <div className="min-h-screen overflow-hidden">
      <CaseStudyHero caseStudy={study} />
      <CaseStudyAtAGlance
        atAGlance={study.atAGlance}
        industry={study.industry}
        systemType={study.systemType}
      />

      <CaseStudySection
        number="01"
        label="The Problem"
        title="What was getting in the way"
        blocks={study.story.problem}
      />
      <CaseStudySection
        number="02"
        label="The Diagnosis"
        title="What the friction actually was"
        blocks={study.story.diagnosis}
        alignRight
      />
      <CaseStudySection
        number="03"
        label="The Build"
        title="What we designed and built"
        blocks={study.story.build}
      />
      <CaseStudySection
        number="04"
        label="The Outcome"
        title="What changed for the business"
        blocks={study.story.outcome}
        alignRight
      />
      {study.story.stewardship ? (
        <CaseStudySection
          number="05"
          label="Stewardship"
          title="How we continue to care for it"
          blocks={study.story.stewardship}
        />
      ) : null}

      <CaseStudyNav slug={study.slug} />
      <CaseStudyCta />
    </div>
  )
}
```

### Step 10.2: Run typecheck

- [ ] Run: `npm run typecheck`
      Expected: no errors.

### Step 10.3: Run the existing test suite

- [ ] Run: `npm run test`
      Expected: all tests pass.

### Step 10.4: Commit the component layer

- [ ] Run:

```sh
git add apps/marketing/src/components/caseStudy/ \
        apps/marketing/src/routes/portfolio/\$slug.tsx
git commit -m "feat: build case study detail page components"
```

---

## Task 11: Detail-page render test

**Files:**

- Create: `apps/marketing/src/routes/portfolio/-$slug.test.ts`

### Step 11.1: Write the failing test

- [ ] Create `apps/marketing/src/routes/portfolio/-$slug.test.ts`:

```ts
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'

import { caseStudies, getCaseStudyBySlug } from '@/data/caseStudies'
import { Route as DetailRoute } from './$slug'

afterEach(() => {
  cleanup()
})

function renderDetailAt(slug: string) {
  const rootRoute = createRootRoute()
  const portfolioRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/portfolio',
  })
  const detailRoute = createRoute({
    getParentRoute: () => portfolioRoute,
    path: '$slug',
    loader: DetailRoute.options.loader,
    component: DetailRoute.options.component,
  })

  const router = createRouter({
    history: createMemoryHistory({ initialEntries: [`/portfolio/${slug}`] }),
    routeTree: rootRoute.addChildren([
      portfolioRoute.addChildren([detailRoute]),
    ]),
  })

  return render(<RouterProvider router={router} />)
}

describe('case study detail page', () => {
  it('renders the case study name and tagline for a known slug', async () => {
    const target = caseStudies[0]
    renderDetailAt(target.slug)

    expect(
      await screen.findByRole('heading', { level: 1, name: target.name }),
    ).toBeTruthy()
    expect(await screen.findByText(target.hero.tagline)).toBeTruthy()
  })

  it('renders all required section labels', async () => {
    const target = caseStudies[0]
    renderDetailAt(target.slug)

    for (const label of ['The Problem', 'The Diagnosis', 'The Build', 'The Outcome']) {
      expect(await screen.findByText(label)).toBeTruthy()
    }
  })

  it('exposes the data lookup helper for known slugs', () => {
    expect(getCaseStudyBySlug(caseStudies[0].slug)?.name).toBe(
      caseStudies[0].name,
    )
  })
})
```

### Step 11.2: Run the test to verify it passes

- [ ] Run: `npx vitest run apps/marketing/src/routes/portfolio/-\$slug.test.ts`
      Expected: PASS — all three assertions render and locate the expected text.

  If TanStack Router complains about a missing default `defaultPendingComponent` or similar during the render in test mode, add minimal options to the `createRouter` call (`{ defaultPendingMs: 0 }`) and re-run. Do not bypass the test by changing assertions.

### Step 11.3: Commit the test

- [ ] Run:

```sh
git add apps/marketing/src/routes/portfolio/-\$slug.test.ts
git commit -m "test: render the case study detail page for a known slug"
```

---

## Task 12: Full quality gate

### Step 12.1: Run formatter + linter

- [ ] Run: `npm run check`
      Expected: prettier writes formatting changes (if any); ESLint reports no errors. If prettier wrote changes, inspect with `git diff` and stage with `git add -u`.

### Step 12.2: Run typecheck

- [ ] Run: `npm run typecheck`
      Expected: no errors.

### Step 12.3: Run tests

- [ ] Run: `npm run test`
      Expected: all suites pass.

### Step 12.4: Production build

- [ ] Run: `npm run build`
      Expected: `vite build` succeeds, `tsc --noEmit` passes, no warnings about unused exports or broken types.

### Step 12.5: Visual QA

- [ ] Start the dev server (or use the one already running on port 3003): `npm run dev`
- [ ] Visit `http://localhost:3003/portfolio` — every case study card should show both "View live site" (external) and "Read the case study" (internal). The internal link should navigate to the detail page.
- [ ] Visit each detail page:
  - `http://localhost:3003/portfolio/scrollr`
  - `http://localhost:3003/portfolio/cambridge-building-group`
  - `http://localhost:3003/portfolio/courtcommand`
  - `http://localhost:3003/portfolio/vm-homes`
  - `http://localhost:3003/portfolio/star-kids`
- [ ] Visit `http://localhost:3003/portfolio/not-a-real-slug` — should hit the 404 page.
- [ ] Confirm on at least one detail page: hero renders (with image where one exists), At a glance renders the fact strip but no metrics row (since metrics are empty), all four story sections render, prev/next navigation works at the boundaries (first page has no prev tile, last page has no next tile), CTA at the bottom links to `/diagnostic`.
- [ ] Toggle the theme if a toggle is present and confirm both light and dark renderings hold up.

### Step 12.6: Commit any formatter-induced edits and final docs

- [ ] If `npm run check` wrote formatting changes earlier:

```sh
git status
git diff --cached
git commit -m "chore: prettier-format case study additions"
```

Otherwise skip.

---

## Self-review checklist (performed during plan write)

- **Spec coverage:** every section of the spec — hero, at-a-glance, 4 story phases plus optional stewardship, prev/next, CTA, slug-keyed routing with `notFound()`, image gallery via inline `StoryBlock` images, ReadonlyArray data, lookup helpers, index deep-link — has a task that implements it.
- **Placeholder scan:** no "TBD", no "TODO", no "implement later" inside any task. Every code step shows code.
- **Type consistency:** `CaseStudy`, `CaseStudyImage`, `StoryBlock`, `CaseStudyAtAGlance`, `getCaseStudyBySlug`, `getAdjacentCaseStudies` names match across data, components, route, and tests.
- **Test conventions:** test files inside `src/routes/**` use the `-` prefix; data tests use the `-` prefix too (mirroring repo style — there is no existing `-` rule for `src/data/`, but the prefix is harmless and consistent).

## Content debt (out of scope for this branch, track separately)

- Capture screenshots for **CourtCommand** and **Star Kids** so their `hero.image` and inline `gallery` blocks can be populated.
- Gather real metrics for each of the 5 studies and add to `atAGlance.metrics`.
- Gather (and get permission for) any client quotes; add as `atAGlance.quote` and/or inline `quote` blocks.
- Once metrics or quotes are in, optionally add an `engagementYear` / `duration` per study.
