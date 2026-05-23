# Clients Stripe Exact Replica Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/clients` and `/clients/$slug` so their section composition, order, and structural patterns mirror Stripe's `/customers` and `/customers/figma` exactly. Two prior passes (`2026-05-22-clients-stripe-pivot.md`, `2026-05-23-clients-stripe-mirror.md`) did not land the exact-replica intent. This plan supersedes them.

**Architecture:** Single-pass restructure. Existing components stay where their structure already matches Stripe; mismatched components get rewritten; missing sections get added. Two new index sections (By Use Case, By Solution) and a new bottom CTA pair component (replacing the 3-panel block). No new data shape — drives entirely off the existing `caseStudies` array and a small new `clientSolutions` constant.

**Tech Stack:** React 19, TanStack Router (file-based), Tailwind CSS 4, Vitest, Testing Library. Existing project conventions (named functions, no semis, single quotes, `@/` alias) apply.

**Conventions discovered during execution (Task 1) — apply to ALL subsequent tasks:**

1. **Run vitest from the `apps/marketing` workspace, not the repo root.** Path aliases (`@/`) are configured in `apps/marketing/vitest.config.ts`; commands like `npx vitest run apps/marketing/src/...` from the repo root will fail with `Cannot find package '@/data/caseStudies'`. The correct invocation in every Step that says `npx vitest run ...` is to **`cd apps/marketing && npx vitest run src/components/...`** (drop the leading `apps/marketing/` and run from the workspace). The same applies to lint: `cd apps/marketing && npx eslint <file>` or `npm run lint -w @relentnet/marketing` from the root.

2. **Local eslint `import/order` wants RELATIVE (`../`) imports BEFORE `@/` aliased imports.** This is the OPPOSITE of the global AGENTS.md guidance. Pattern in this codebase's test files:

   ```ts
   // 1. third-party
   import { render, screen } from '@testing-library/react'
   import { describe, expect, it } from 'vitest'

   // 2. relative
   import { CaseStudyDetailHero } from '../CaseStudyDetailHero'

   // 3. @/ aliased
   import { caseStudies } from '@/data/caseStudies'
   import { routeTree } from '@/routeTree.gen'
   ```

   Subagents: do not "fix" this order. Match it.

**IMPORTANT — test helper for components that render TanStack `<Link>`:** In `@tanstack/react-router` v1.x, `RouterProvider` ignores its `children` prop and hardcodes its own `<Matches />` tree, so wrapping a component under test in `<RouterProvider>{ui}</RouterProvider>` renders nothing. Use `RouterContextProvider` instead — it provides the router context AND renders children. Pattern:

```tsx
import {
  RouterContextProvider,
  createMemoryHistory,
  createRouter,
} from '@tanstack/react-router'
import { routeTree } from '@/routeTree.gen'

function renderWithRouter(ui: React.ReactElement) {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })
  return render(
    <RouterContextProvider router={router}>{ui}</RouterContextProvider>,
  )
}
```

Use this helper in EVERY test below that touches a `<Link>` component (Tasks 6, 7, 8, and any others). Where the original task body said `RouterProvider`, substitute `RouterContextProvider`. Component tests that do NOT render `<Link>` can `render(...)` directly without the helper.

**Reference pages:**

- Index target: `https://stripe.com/customers`
- Detail target: `https://stripe.com/customers/figma`

**Exact section orders being matched:**

| Index (Stripe `/customers`)                       | Detail (Stripe `/customers/figma`)               |
| ------------------------------------------------- | ------------------------------------------------ |
| 1. Hero (eyebrow + H1 + body + 2 buttons)         | 1. Breadcrumb + H1 + body + customer logo        |
| 2. Featured portrait tile row (6 tiles)           | 2. Products used (vertical list)                 |
| 3. Measurable results (4 huge stats)              | 3. Region + tier strip (Global, Enterprise)      |
| 4. Logo strip (flat horizontal)                   | 4. Big stats stack (3–4 vertical, huge)          |
| 5. Customers by size (tabs + 3-card grid)         | 5. Inline CTA ("Ready to get started?")          |
| 6. Building together (vertical tabs + deep-dive)  | 6. Big landscape hero image                      |
| 7. **Customers by use case (tabs + tile mosaic)** | 7. Narrative — ## Challenge / Solution / Results |
| 8. **Customers by solution (chips + decorative)** | 8. Pullquote                                     |
| 9. **CTA pair (2 tiles, replaces 3-panel)**       | 9. "Read more customer stories" (2 tiles)        |
|                                                   | 10. **CTA pair (2 tiles, replaces 3-panel)**     |

**Decisions locked from brainstorm:**

- Mirror BOTH missing index sections (use case + solution).
- Replace 3-panel `ClosingCtaPanels` with a 2-tile `ClosingCtaPair` on both pages.
- Build tabbed sections **separately** (no shared `<TabbedSection>` primitive in this pass).
- "By solution" decorative imagery: BrowserFrame-cropped screenshots of real RelentNet client work (CBG, VMH, Scrollr) — closest visual analog to Stripe's product mockups.
- Detail page narrative keeps existing `Challenge / Solution / Results` structure; we drop the redundant `<h3>Outcome</h3>` subheading when `study.results` is unset and just render `story.outcome` blocks under `Results`.
- Existing components that already match (Hero, FeaturedTiles, MeasurableResults, LogoStrip, BuildingTogether, DetailHero, BigStats, InlineCta, HeroImage, Pullquote, ReadMore) stay; we only edit what's structurally off.

---

## File Structure

### Files created

- `apps/marketing/src/components/clients/ClientsByUseCase.tsx` — new index section #7
- `apps/marketing/src/components/clients/ClientsBySolution.tsx` — new index section #8
- `apps/marketing/src/components/clients/ClosingCtaPair.tsx` — new bottom 2-tile CTA
- `apps/marketing/src/data/clientSolutions.ts` — solutions chip data + image mapping
- Test files alongside (`*.test.tsx` / `*.test.ts`)

### Files modified

- `apps/marketing/src/routes/clients/index.tsx` — wire new sections, swap closing CTA
- `apps/marketing/src/routes/clients/$slug.tsx` — swap closing CTA, reorder if needed
- `apps/marketing/src/components/caseStudy/CaseStudyProductsRow.tsx` — flip from horizontal pills to vertical stacked list (Stripe Figma is vertical)
- `apps/marketing/src/components/caseStudy/CaseStudyDetailHero.tsx` — add customer logo on the right (two-column at lg)
- `apps/marketing/src/components/caseStudy/CaseStudyNarrative.tsx` — drop the redundant duplicate `story.outcome` render when `results` is unset (already conditional but the conditional is currently inverted: it renders BOTH when `!study.results`, which produces the `Outcome` h3 PLUS the outcome blocks twice)
- `apps/marketing/src/routes/clients/__tests__` and component test files — update where structural expectations change

### Files deleted

- `apps/marketing/src/components/clients/ClosingCtaPanels.tsx` — superseded by `ClosingCtaPair`
- `apps/marketing/src/components/clients/ClosingCtaPanels.test.tsx` (if present)

### Files NOT touched (already match)

- `apps/marketing/src/components/clients/ClientsHero.tsx`
- `apps/marketing/src/components/clients/ClientsFeaturedTiles.tsx`
- `apps/marketing/src/components/clients/ClientsMeasurableResults.tsx`
- `apps/marketing/src/components/clients/ClientsLogoStrip.tsx`
- `apps/marketing/src/components/clients/ClientsBySize.tsx`
- `apps/marketing/src/components/clients/ClientsBuildingTogether.tsx`
- `apps/marketing/src/components/caseStudy/CaseStudyBigStats.tsx`
- `apps/marketing/src/components/caseStudy/CaseStudyInlineCta.tsx`
- `apps/marketing/src/components/caseStudy/CaseStudyHeroImage.tsx`
- `apps/marketing/src/components/caseStudy/CaseStudyPullquote.tsx`
- `apps/marketing/src/components/caseStudy/CaseStudyReadMore.tsx`
- `apps/marketing/src/data/caseStudies.ts` (no shape change)

---

## Task 1: Detail hero — add customer logo column

**Files:**

- Modify: `apps/marketing/src/components/caseStudy/CaseStudyDetailHero.tsx`
- Test: `apps/marketing/src/components/caseStudy/__tests__/CaseStudyDetailHero.test.tsx` (create if absent; otherwise update)

**Stripe reference:** On `/customers/figma`, the H1 and intro paragraph sit on the left and the customer's logo (text "Figma logo" rendered from an SVG/text mark) sits on the right at large breakpoints. Below `lg:` it stacks. Our current component renders only the left column.

**Data source:** `study.atAGlance.global?.logoSrc` already exists on the data model and is used elsewhere — we can repurpose. If absent for a study, render the company name as a fallback in the same slot (uppercase tracking).

- [ ] **Step 1: Write failing test for two-column layout**

`apps/marketing/src/components/caseStudy/__tests__/CaseStudyDetailHero.test.tsx`

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import {
  createRouter,
  createMemoryHistory,
  RouterProvider,
} from '@tanstack/react-router'
import { routeTree } from '@/routeTree.gen'
import { CaseStudyDetailHero } from '../CaseStudyDetailHero'
import { caseStudies } from '@/data/caseStudies'

function renderWithRouter(ui: React.ReactElement) {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })
  return render(<RouterProvider router={router}>{ui}</RouterProvider>)
}

describe('CaseStudyDetailHero', () => {
  it('renders the customer logo slot with the study name when no logoSrc is provided', () => {
    const study = caseStudies.find(
      (s) => s.slug === 'cambridge-building-group',
    )!
    renderWithRouter(<CaseStudyDetailHero study={study} />)
    const logoSlot = screen.getByTestId('detail-hero-logo')
    expect(logoSlot).toHaveTextContent(study.name)
  })

  it('renders a logo image when atAGlance.global.logoSrc is provided', () => {
    const study = caseStudies.find((s) => s.slug === 'scrollr')!
    renderWithRouter(<CaseStudyDetailHero study={study} />)
    const logoSlot = screen.getByTestId('detail-hero-logo')
    expect(logoSlot.querySelector('img')).not.toBeNull()
  })
})
```

- [ ] **Step 2: Run test to confirm failure**

Run: `npx vitest run apps/marketing/src/components/caseStudy/__tests__/CaseStudyDetailHero.test.tsx`
Expected: FAIL — `getByTestId('detail-hero-logo')` not found.

- [ ] **Step 3: Update the component to add the logo column**

Replace the JSX in `CaseStudyDetailHero.tsx` from the `<section>` element down with:

```tsx
return (
  <section className="relative z-10 px-6 md:px-12 pt-32 md:pt-40 pb-12 md:pb-16">
    <div className="max-w-7xl mx-auto">
      <nav
        className="mb-12 text-xs uppercase tracking-[0.2em] text-ink-muted"
        aria-label="Breadcrumb"
      >
        <Link to="/clients" className="hover:text-gold transition-colors">
          Clients
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{study.name}</span>
      </nav>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-9">
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.05] max-w-4xl">
            {headline}
          </h1>
          <p className="mt-8 max-w-2xl text-ink-sub text-base md:text-lg leading-relaxed">
            {body}
          </p>
        </div>
        <div
          data-testid="detail-hero-logo"
          className="lg:col-span-3 lg:pt-4 flex items-center lg:items-start"
        >
          {study.atAGlance.global?.logoSrc ? (
            <img
              src={study.atAGlance.global.logoSrc}
              alt={`${study.name} logo`}
              className="h-10 md:h-12 w-auto opacity-80"
              loading="eager"
            />
          ) : (
            <span className="text-sm uppercase tracking-[0.2em] text-ink-muted">
              {study.name}
            </span>
          )}
        </div>
      </div>
    </div>
  </section>
)
```

- [ ] **Step 4: Run test to verify pass**

Run: `npx vitest run apps/marketing/src/components/caseStudy/__tests__/CaseStudyDetailHero.test.tsx`
Expected: PASS — both cases.

- [ ] **Step 5: Commit**

```bash
git add apps/marketing/src/components/caseStudy/CaseStudyDetailHero.tsx apps/marketing/src/components/caseStudy/__tests__/CaseStudyDetailHero.test.tsx
git commit -m "feat(clients): add customer logo column to detail hero (Stripe-exact)"
```

---

## Task 2: Detail "Products used" row — flip horizontal pills to vertical stacked list

**Files:**

- Modify: `apps/marketing/src/components/caseStudy/CaseStudyProductsRow.tsx`
- Test: `apps/marketing/src/components/caseStudy/__tests__/CaseStudyProductsRow.test.tsx` (create or update)

**Stripe reference:** On `/customers/figma`, "Products used" is a **vertically stacked list**, one product per line, each with a small icon + name (e.g., "Billing", "Payments", "Elements", "Invoicing", "Data Pipeline", "Radar", "+ 2 more products"). It sits as a left-column block, NOT a horizontal flex row.

**Current state:** Our component is a horizontal flex-wrap pill row with `region` and `companySize` appended on the right as side-pills.

**Change:** Vertical `<ul>` with each item as a `<li>` (block, icon left, label right). Region + size move out of this row into a **new** strip element rendered separately — see Task 3.

- [ ] **Step 1: Write failing test for vertical stacking**

`apps/marketing/src/components/caseStudy/__tests__/CaseStudyProductsRow.test.tsx`

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { CaseStudyProductsRow } from '../CaseStudyProductsRow'
import { caseStudies } from '@/data/caseStudies'

describe('CaseStudyProductsRow', () => {
  it('renders stack items as a vertical list (one per row)', () => {
    const study = caseStudies.find((s) => s.slug === 'scrollr')!
    render(<CaseStudyProductsRow study={study} />)
    const list = screen.getByRole('list', { name: /products used/i })
    expect(list.className).toMatch(/flex-col/)
    // Each item is a flex row of icon + label, no flex-wrap on the parent
    expect(list.className).not.toMatch(/flex-wrap/)
  })

  it('does not render region or company-size pills (now lives in the region strip)', () => {
    const study = caseStudies.find((s) => s.slug === 'scrollr')!
    render(<CaseStudyProductsRow study={study} />)
    expect(screen.queryByText(/^global$/i)).toBeNull()
    expect(screen.queryByText(/^startup$/i)).toBeNull()
    expect(screen.queryByText(/^growth$/i)).toBeNull()
    expect(screen.queryByText(/^enterprise$/i)).toBeNull()
  })
})
```

- [ ] **Step 2: Run test to confirm failure**

Run: `npx vitest run apps/marketing/src/components/caseStudy/__tests__/CaseStudyProductsRow.test.tsx`
Expected: FAIL — current `<ul>` has `flex-wrap`, no `aria-label`, and renders region/size.

- [ ] **Step 3: Rewrite the component**

Replace the entire file with:

```tsx
import { useState } from 'react'

import type { CaseStudy } from '@/data/caseStudies'
import { BrandIcon } from '@/components/BrandIcon'

interface CaseStudyProductsRowProps {
  study: CaseStudy
}

const DEFAULT_VISIBLE = 6

/**
 * Detail-page "Products used" — vertical stacked list of stack items with
 * brand icons. One item per row, left-aligned. Mirrors Stripe /customers/figma
 * directly below the hero.
 *
 * Region + company-size labels live in a separate strip; see
 * CaseStudyRegionStrip.
 */
export function CaseStudyProductsRow({ study }: CaseStudyProductsRowProps) {
  const [expanded, setExpanded] = useState(false)
  const allItems = (study.atAGlance.stack ?? []).flatMap((c) => c.items)
  const visibleItems = expanded ? allItems : allItems.slice(0, DEFAULT_VISIBLE)
  const moreCount = Math.max(0, allItems.length - DEFAULT_VISIBLE)

  if (allItems.length === 0) return null

  return (
    <section className="relative z-10 px-6 md:px-12 py-8 md:py-10 border-t border-line-faint">
      <div className="max-w-3xl">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-ink-muted mb-4">
          Products used
        </p>
        <ul aria-label="Products used" className="flex flex-col gap-3">
          {visibleItems.map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-3 text-sm md:text-base text-ink"
            >
              <BrandIcon
                slug={item.iconSlug}
                label={item.label}
                className="size-5 text-ink-muted shrink-0"
              />
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
                + {moreCount} more items
              </button>
            </li>
          ) : null}
        </ul>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify pass**

Run: `npx vitest run apps/marketing/src/components/caseStudy/__tests__/CaseStudyProductsRow.test.tsx`
Expected: PASS — both assertions.

- [ ] **Step 5: Commit**

```bash
git add apps/marketing/src/components/caseStudy/CaseStudyProductsRow.tsx apps/marketing/src/components/caseStudy/__tests__/CaseStudyProductsRow.test.tsx
git commit -m "refactor(clients): products-used row vertical-stacked (Stripe-exact)"
```

---

## Task 3: Detail region + tier strip — new component

**Files:**

- Create: `apps/marketing/src/components/caseStudy/CaseStudyRegionStrip.tsx`
- Test: `apps/marketing/src/components/caseStudy/__tests__/CaseStudyRegionStrip.test.tsx`

**Stripe reference:** Directly below the products-used vertical list on `/customers/figma`, Stripe renders two small uppercase-tracking text labels: `Global` and `Enterprise`. Plain text, no pill borders, separated by spacing. No section header.

**Data source:** `study.region` (string, e.g., "Global", "North America"), `study.companySize` (`'startup' | 'growth' | 'enterprise' | 'placeholder'`).

- [ ] **Step 1: Write failing test**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { CaseStudyRegionStrip } from '../CaseStudyRegionStrip'

describe('CaseStudyRegionStrip', () => {
  it('renders region and capitalized companySize as small uppercase labels', () => {
    render(<CaseStudyRegionStrip region="Global" companySize="enterprise" />)
    expect(screen.getByText('Global')).toBeInTheDocument()
    expect(screen.getByText('Enterprise')).toBeInTheDocument()
  })

  it('omits region when not provided', () => {
    render(<CaseStudyRegionStrip companySize="startup" />)
    expect(screen.queryByText(/global/i)).toBeNull()
    expect(screen.getByText('Startup')).toBeInTheDocument()
  })

  it('omits companySize for placeholder', () => {
    render(<CaseStudyRegionStrip region="Global" companySize="placeholder" />)
    expect(screen.getByText('Global')).toBeInTheDocument()
    expect(screen.queryByText(/placeholder/i)).toBeNull()
  })

  it('renders nothing when both are absent/placeholder', () => {
    const { container } = render(
      <CaseStudyRegionStrip companySize="placeholder" />,
    )
    expect(container.firstChild).toBeNull()
  })
})
```

- [ ] **Step 2: Run test to confirm failure**

Run: `npx vitest run apps/marketing/src/components/caseStudy/__tests__/CaseStudyRegionStrip.test.tsx`
Expected: FAIL — component does not exist.

- [ ] **Step 3: Create the component**

```tsx
import type { CaseStudy } from '@/data/caseStudies'

interface CaseStudyRegionStripProps {
  region?: string
  companySize: CaseStudy['companySize']
}

/**
 * Detail-page region + tier strip. Small uppercase-tracking labels under
 * the products-used list. Mirrors Stripe /customers/figma's
 * "Global · Enterprise" line. Renders nothing if both inputs are empty.
 */
export function CaseStudyRegionStrip({
  region,
  companySize,
}: CaseStudyRegionStripProps) {
  const sizeLabel =
    companySize === 'placeholder'
      ? undefined
      : companySize.charAt(0).toUpperCase() + companySize.slice(1)

  if (!region && !sizeLabel) return null

  return (
    <section className="relative z-10 px-6 md:px-12 pb-8 md:pb-10">
      <div className="max-w-3xl flex flex-wrap gap-x-8 gap-y-2">
        {region ? (
          <span className="text-sm uppercase tracking-[0.2em] text-ink-muted">
            {region}
          </span>
        ) : null}
        {sizeLabel ? (
          <span className="text-sm uppercase tracking-[0.2em] text-ink-muted">
            {sizeLabel}
          </span>
        ) : null}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify pass**

Run: `npx vitest run apps/marketing/src/components/caseStudy/__tests__/CaseStudyRegionStrip.test.tsx`
Expected: PASS — all 4 cases.

- [ ] **Step 5: Commit**

```bash
git add apps/marketing/src/components/caseStudy/CaseStudyRegionStrip.tsx apps/marketing/src/components/caseStudy/__tests__/CaseStudyRegionStrip.test.tsx
git commit -m "feat(clients): add region/tier strip to detail page (Stripe-exact)"
```

---

## Task 4: Detail narrative — fix double-render of outcome

**Files:**

- Modify: `apps/marketing/src/components/caseStudy/CaseStudyNarrative.tsx`
- Test: `apps/marketing/src/components/caseStudy/__tests__/CaseStudyNarrative.test.tsx` (create or update)

**Bug:** When `study.results` is **unset**, the component currently:

1. Falls back to a single `resultEntries` of `{ headline: 'Outcome', body: study.summary.outcome }` and renders that h3 + body.
2. Then ALSO checks `study.story.outcome.length > 0 && !study.results` and renders the outcome story blocks AGAIN below.

That double-renders the outcome content. Stripe's pattern is a single `## Results` H2 followed by either flat paragraphs or `### subsection` headers — no duplicated body.

**Fix:** Drop the synthetic `{ headline: 'Outcome', body: summary.outcome }` fallback. When `results` is unset, render `story.outcome` blocks under `## Results` directly. When `results` IS set, render those entries (each with `<h3>` + body) and skip `story.outcome` entirely.

- [ ] **Step 1: Write failing test**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { CaseStudyNarrative } from '../CaseStudyNarrative'
import { caseStudies } from '@/data/caseStudies'

describe('CaseStudyNarrative', () => {
  it('renders story.outcome under Results when results is unset, without an Outcome h3', () => {
    const study = caseStudies.find((s) => s.slug === 'scrollr')!
    render(<CaseStudyNarrative study={study} />)
    // No synthetic h3 "Outcome"
    expect(
      screen.queryByRole('heading', { level: 3, name: /^outcome$/i }),
    ).toBeNull()
    // Results h2 present
    expect(
      screen.getByRole('heading', { level: 2, name: /^results$/i }),
    ).toBeInTheDocument()
    // First outcome paragraph is rendered
    const firstOutcome = study.story.outcome.find((b) => b.type === 'p')
    if (firstOutcome && firstOutcome.type === 'p') {
      expect(
        screen.getByText(new RegExp(firstOutcome.text.slice(0, 30))),
      ).toBeInTheDocument()
    }
  })

  it('renders study.results entries with h3 subsections when provided', () => {
    const study = {
      ...caseStudies[0],
      results: [
        { headline: 'A', body: 'Body A' },
        { headline: 'B', body: 'Body B' },
      ],
    }
    render(<CaseStudyNarrative study={study} />)
    expect(
      screen.getByRole('heading', { level: 3, name: 'A' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 3, name: 'B' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Body A')).toBeInTheDocument()
    expect(screen.getByText('Body B')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to confirm failure**

Run: `npx vitest run apps/marketing/src/components/caseStudy/__tests__/CaseStudyNarrative.test.tsx`
Expected: FAIL — current code renders the synthetic `Outcome` h3.

- [ ] **Step 3: Rewrite the Results section**

Replace the Results block inside `CaseStudyNarrative.tsx` (from `const resultEntries` to the trailing conditional) with:

```tsx
return (
  <section className="relative z-10 px-6 md:px-12 py-12 md:py-16">
    <div className="max-w-3xl">
      <h2 className="font-serif text-3xl md:text-5xl mb-8">Challenge</h2>
      {renderBlocks(challengeBlocks)}

      <h2 className="font-serif text-3xl md:text-5xl mb-8 mt-16">Solution</h2>
      {renderBlocks(solutionBlocks)}

      <h2 className="font-serif text-3xl md:text-5xl mb-8 mt-16">Results</h2>
      {study.results
        ? study.results.map((result, idx) => (
            <div key={idx}>
              <h3 className="font-serif text-xl md:text-2xl mb-4 mt-12 first:mt-0">
                {result.headline}
              </h3>
              <p className="text-ink text-base md:text-lg leading-relaxed mb-6">
                {result.body}
              </p>
            </div>
          ))
        : renderBlocks(study.story.outcome)}
    </div>
  </section>
)
```

Also remove the now-unused `resultEntries` const and the trailing `{study.story.outcome.length > 0 && !study.results ? ...}` block.

- [ ] **Step 4: Run test to verify pass**

Run: `npx vitest run apps/marketing/src/components/caseStudy/__tests__/CaseStudyNarrative.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/marketing/src/components/caseStudy/CaseStudyNarrative.tsx apps/marketing/src/components/caseStudy/__tests__/CaseStudyNarrative.test.tsx
git commit -m "fix(clients): narrative results no longer double-renders outcome"
```

---

## Task 5: Solutions data — new constant

**Files:**

- Create: `apps/marketing/src/data/clientSolutions.ts`
- Test: `apps/marketing/src/data/clientSolutions.test.ts`

**Stripe reference:** On `/customers`, the "Customers by solution" section lists 8 short solution chips ("Accept payments", "Manage billing & subscriptions", "Offer flexible payouts", "Optimize checkout", "Reduce fraud", "Scale global payments", "Increase conversion", "Embed financial services") next to decorative product mockups.

**RelentNet equivalents (8):** chosen to match the structural composition; each links to either `/diagnostic` or `/process` and references a real client mockup image.

- [ ] **Step 1: Write failing test**

```ts
import { describe, it, expect } from 'vitest'
import { clientSolutions } from './clientSolutions'

describe('clientSolutions', () => {
  it('exposes exactly 8 solutions', () => {
    expect(clientSolutions).toHaveLength(8)
  })

  it('every solution has label, href, and decorative image source', () => {
    clientSolutions.forEach((s) => {
      expect(s.label).toBeTypeOf('string')
      expect(s.href).toMatch(/^\//)
      expect(s.image.src).toMatch(/^\//)
      expect(s.image.alt.length).toBeGreaterThan(0)
    })
  })

  it('image filenames reference real public assets (case-study or homepage)', () => {
    clientSolutions.forEach((s) => {
      expect(s.image.src).toMatch(/(case-studies|portfolio|logos|public)/)
    })
  })
})
```

- [ ] **Step 2: Run test to confirm failure**

Run: `npx vitest run apps/marketing/src/data/clientSolutions.test.ts`
Expected: FAIL — file does not exist.

- [ ] **Step 3: Create the data file**

```ts
export interface ClientSolutionImage {
  src: string
  alt: string
  width: number
  height: number
}

export interface ClientSolution {
  label: string
  href: '/diagnostic' | '/process' | '/inquire' | '/clients'
  image: ClientSolutionImage
}

/**
 * Solution chips for the /clients "Customers by solution" section.
 * Each chip pairs a RelentNet capability with a decorative screenshot of
 * real client work. Mirrors Stripe /customers's by-solution structure.
 */
export const clientSolutions: ReadonlyArray<ClientSolution> = [
  {
    label: 'Diagnose workflow friction',
    href: '/diagnostic',
    image: {
      src: '/case-studies/scrollr/legacy-ticker-bar.webp',
      alt: 'Diagnostic surface: legacy Scrollr ticker bar showing the friction we audited',
      width: 1920,
      height: 112,
    },
  },
  {
    label: 'Rebuild brittle systems',
    href: '/process',
    image: {
      src: '/case-studies/scrollr/catalog-dark.webp',
      alt: 'Scrollr source catalog after rebuild, showing decoupled channel architecture',
      width: 1600,
      height: 954,
    },
  },
  {
    label: 'Ship cross-platform products',
    href: '/process',
    image: {
      src: '/case-studies/scrollr/settings-ticker-dark.webp',
      alt: 'Scrollr settings panel running natively on desktop',
      width: 1600,
      height: 954,
    },
  },
  {
    label: 'Stage credibility for sales',
    href: '/process',
    image: {
      src: '/cbg_portfolio.png',
      alt: 'Cambridge Building Group marketing site preview',
      width: 1440,
      height: 810,
    },
  },
  {
    label: 'Build premium client experiences',
    href: '/process',
    image: {
      src: '/vmh_portfolio.png',
      alt: 'VM Homes premium real estate site preview',
      width: 1440,
      height: 810,
    },
  },
  {
    label: 'Operate real-time infrastructure',
    href: '/process',
    image: {
      src: '/case-studies/scrollr/ticker-all-detailed-dark.webp',
      alt: 'Scrollr real-time multi-channel ticker output',
      width: 1465,
      height: 62,
    },
  },
  {
    label: 'Communicate mission clearly',
    href: '/clients',
    image: {
      src: '/case-studies/scrollr/theme-tokyo-night-dark.webp',
      alt: 'Tokyo Night themed Scrollr configuration UI',
      width: 1600,
      height: 954,
    },
  },
  {
    label: 'Steward systems over time',
    href: '/inquire',
    image: {
      src: '/case-studies/scrollr/hero-sports-dark.webp',
      alt: 'Scrollr in production, ongoing stewardship after launch',
      width: 1600,
      height: 954,
    },
  },
]
```

- [ ] **Step 4: Run test to verify pass**

Run: `npx vitest run apps/marketing/src/data/clientSolutions.test.ts`
Expected: PASS — all 3 cases.

- [ ] **Step 5: Commit**

```bash
git add apps/marketing/src/data/clientSolutions.ts apps/marketing/src/data/clientSolutions.test.ts
git commit -m "feat(clients): add clientSolutions data for by-solution section"
```

---

## Task 6: ClientsByUseCase — tabbed image mosaic section

**Files:**

- Create: `apps/marketing/src/components/clients/ClientsByUseCase.tsx`
- Test: `apps/marketing/src/components/clients/__tests__/ClientsByUseCase.test.tsx`

**Stripe reference:** Tabs `Marketplaces / SaaS / Platforms / Ecommerce` swap a mosaic of mixed-aspect image tiles linking to customer stories. Each tile shows a logo, a "Read story" microcopy, and a landscape or portrait image with overlay.

**Adaptation:** Use our `engagementType` (`'product' | 'operations' | 'platform'`) as the tab dimension. Three tabs only. Each tab renders the matching case studies as 4–6 image tiles in a 2-column responsive grid (mixed-aspect via alternating `aspect-[4/3]` and `aspect-[16/10]`). Each tile is a Link to `/clients/$slug`.

Eyebrow: `Customers by engagement type`
Headline: `We accelerate growth for all types of operations.`

- [ ] **Step 1: Write failing test**

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import {
  createRouter,
  createMemoryHistory,
  RouterProvider,
} from '@tanstack/react-router'
import { routeTree } from '@/routeTree.gen'
import { ClientsByUseCase } from '../ClientsByUseCase'

function renderRouted(ui: React.ReactElement) {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ['/clients'] }),
  })
  return render(<RouterProvider router={router}>{ui}</RouterProvider>)
}

describe('ClientsByUseCase', () => {
  it('renders 3 tabs for engagement types', () => {
    renderRouted(<ClientsByUseCase />)
    expect(screen.getByRole('button', { name: /product/i })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /operations/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /platform/i }),
    ).toBeInTheDocument()
  })

  it('switches the tile grid when a different tab is clicked', () => {
    renderRouted(<ClientsByUseCase />)
    // Default tab is "product"; switching to operations should change rendered tiles
    const opsTab = screen.getByRole('button', { name: /operations/i })
    fireEvent.click(opsTab)
    expect(opsTab.getAttribute('aria-pressed')).toBe('true')
  })

  it('renders at least one tile in the default tab', () => {
    renderRouted(<ClientsByUseCase />)
    const links = screen.getAllByRole('link')
    // At least one tile link to /clients/$slug
    expect(
      links.some((l) => l.getAttribute('href')?.startsWith('/clients/')),
    ).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to confirm failure**

Run: `npx vitest run apps/marketing/src/components/clients/__tests__/ClientsByUseCase.test.tsx`
Expected: FAIL — component does not exist.

- [ ] **Step 3: Create the component**

```tsx
import { Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

import { caseStudies, type EngagementType } from '@/data/caseStudies'

const TABS: ReadonlyArray<{ id: EngagementType; label: string }> = [
  { id: 'product', label: 'Product' },
  { id: 'operations', label: 'Operations' },
  { id: 'platform', label: 'Platform' },
]

const TILES_PER_TAB = 6

/**
 * "Customers by engagement type" — 3 tabs (Product / Operations / Platform)
 * swap a 2-column mixed-aspect image mosaic. Mirrors Stripe /customers's
 * "Customers by use case" section structurally.
 */
export function ClientsByUseCase() {
  const [active, setActive] = useState<EngagementType>('product')

  const tiles = useMemo(() => {
    return caseStudies
      .filter((s) => s.engagementType === active)
      .slice(0, TILES_PER_TAB)
  }, [active])

  return (
    <section className="relative z-10 px-6 md:px-12 py-20 md:py-28 border-t border-line-faint">
      <div className="max-w-7xl mx-auto">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-ink-muted mb-3">
          Customers by engagement type
        </p>
        <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl max-w-3xl mb-12 md:mb-16">
          We accelerate growth for all types of operations.
        </h2>

        <div
          role="group"
          aria-label="Filter customers by engagement type"
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

        {tiles.length === 0 ? (
          <p className="text-sm text-ink-muted">
            No case studies in this category yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line-faint">
            {tiles.map((study, index) => {
              const image = study.hero.image ?? study.portraitImage
              // Alternate aspect for mosaic feel
              const aspectClass =
                index % 2 === 0 ? 'aspect-[16/10]' : 'aspect-[4/3]'
              return (
                <Link
                  key={study.slug}
                  to="/clients/$slug"
                  params={{ slug: study.slug }}
                  className="group relative block overflow-hidden bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  {image ? (
                    <img
                      src={image.src}
                      alt={image.alt}
                      className={`${aspectClass} w-full object-cover transition duration-500 group-hover:scale-[1.03]`}
                      loading="lazy"
                    />
                  ) : (
                    <div className={`${aspectClass} w-full bg-inset`} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/80">
                      {study.industry}
                    </p>
                    <h3 className="mt-2 font-serif text-2xl text-white">
                      {study.name}
                    </h3>
                    <span className="mt-3 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white group-hover:text-gold transition-colors">
                      Read story →
                    </span>
                  </div>
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

- [ ] **Step 4: Run test to verify pass**

Run: `npx vitest run apps/marketing/src/components/clients/__tests__/ClientsByUseCase.test.tsx`
Expected: PASS — all 3 cases.

- [ ] **Step 5: Commit**

```bash
git add apps/marketing/src/components/clients/ClientsByUseCase.tsx apps/marketing/src/components/clients/__tests__/ClientsByUseCase.test.tsx
git commit -m "feat(clients): add by-engagement-type tabbed mosaic (Stripe-exact)"
```

---

## Task 7: ClientsBySolution — chips + decorative imagery section

**Files:**

- Create: `apps/marketing/src/components/clients/ClientsBySolution.tsx`
- Test: `apps/marketing/src/components/clients/__tests__/ClientsBySolution.test.tsx`

**Stripe reference:** Eyebrow + headline + intro paragraph, followed by a left column of solution chip links and a right column of decorative product-mockup imagery. On mobile, the imagery sits below the chips.

**Our adaptation:** Same composition. Left column: 8 chip links from `clientSolutions`, rendered as underline-on-hover text links in two-column flow. Right column: a stack of `<BrowserFrame>`-cropped screenshots from the same data, layered with slight offset to suggest depth. Use the existing `BrowserFrame` component if available; if its API doesn't fit, use a simple rounded `<div>` with a `border-line-faint` chrome bar instead.

- [ ] **Step 1: Inspect BrowserFrame API before writing the test**

Run: `cat apps/marketing/src/components/BrowserFrame.tsx`

Note its public props and adapt the component to use it correctly. If it accepts `src` + `alt` + `aspectRatio`, pass those. Otherwise pass `children` wrapping an `<img>`.

- [ ] **Step 2: Write failing test**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import {
  createRouter,
  createMemoryHistory,
  RouterProvider,
} from '@tanstack/react-router'
import { routeTree } from '@/routeTree.gen'
import { ClientsBySolution } from '../ClientsBySolution'
import { clientSolutions } from '@/data/clientSolutions'

function renderRouted(ui: React.ReactElement) {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ['/clients'] }),
  })
  return render(<RouterProvider router={router}>{ui}</RouterProvider>)
}

describe('ClientsBySolution', () => {
  it('renders every solution as a link', () => {
    renderRouted(<ClientsBySolution />)
    clientSolutions.forEach((s) => {
      expect(
        screen.getByRole('link', { name: new RegExp(s.label, 'i') }),
      ).toBeInTheDocument()
    })
  })

  it('renders at least one decorative image with alt text', () => {
    renderRouted(<ClientsBySolution />)
    const images = screen.getAllByRole('img')
    expect(images.length).toBeGreaterThan(0)
    images.forEach((img) => {
      expect(img.getAttribute('alt')).toBeTruthy()
    })
  })

  it('renders eyebrow and headline copy', () => {
    renderRouted(<ClientsBySolution />)
    expect(screen.getByText(/customers by solution/i)).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /obsess over diagnosed friction/i }),
    ).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run test to confirm failure**

Run: `npx vitest run apps/marketing/src/components/clients/__tests__/ClientsBySolution.test.tsx`
Expected: FAIL — component does not exist.

- [ ] **Step 4: Create the component**

```tsx
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { clientSolutions } from '@/data/clientSolutions'

const FEATURED_IMAGE_INDEXES = [0, 3, 5] as const

/**
 * "Customers by solution" — left column of solution chip links + right
 * column of decorative product-mockup imagery from real client work.
 * Mirrors Stripe /customers's "Customers by solution" section.
 */
export function ClientsBySolution() {
  const featured = FEATURED_IMAGE_INDEXES.map((i) => clientSolutions[i])

  return (
    <section className="relative z-10 px-6 md:px-12 py-20 md:py-28 border-t border-line-faint">
      <div className="max-w-7xl mx-auto">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-ink-muted mb-3">
          Customers by solution
        </p>
        <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl max-w-3xl mb-6">
          We obsess over diagnosed friction so our clients don't have to.
        </h2>
        <p className="text-ink-sub text-base md:text-lg leading-relaxed max-w-2xl mb-16 md:mb-20">
          Every engagement starts with diagnosing the real source of operational
          friction. We focus on building the right system on top of that
          diagnosis — so you stop stitching together band-aids and start moving
          cleaner.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <ul className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            {clientSolutions.map((s) => (
              <li key={s.label}>
                <Link
                  to={s.href}
                  className="group inline-flex items-center gap-2 text-sm md:text-base text-ink hover:text-gold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  <span>{s.label}</span>
                  <ArrowRight className="size-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="lg:col-span-7 relative">
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {featured.map((s, i) => (
                <div
                  key={s.label}
                  className={`overflow-hidden border border-line-faint bg-card ${
                    i === 1 ? 'mt-12 md:mt-16' : ''
                  } ${i === 2 ? '-mt-6 md:-mt-8' : ''}`}
                >
                  <div className="flex items-center gap-1.5 border-b border-line-faint bg-inset px-3 py-2">
                    <span className="size-2 rounded-full bg-ink-muted/30" />
                    <span className="size-2 rounded-full bg-ink-muted/30" />
                    <span className="size-2 rounded-full bg-ink-muted/30" />
                  </div>
                  <img
                    src={s.image.src}
                    alt={s.image.alt}
                    className="w-full aspect-[4/3] object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Run test to verify pass**

Run: `npx vitest run apps/marketing/src/components/clients/__tests__/ClientsBySolution.test.tsx`
Expected: PASS — all 3 cases.

- [ ] **Step 6: Commit**

```bash
git add apps/marketing/src/components/clients/ClientsBySolution.tsx apps/marketing/src/components/clients/__tests__/ClientsBySolution.test.tsx
git commit -m "feat(clients): add by-solution chips + decorative imagery (Stripe-exact)"
```

---

## Task 8: ClosingCtaPair — new 2-tile bottom CTA

**Files:**

- Create: `apps/marketing/src/components/clients/ClosingCtaPair.tsx`
- Test: `apps/marketing/src/components/clients/__tests__/ClosingCtaPair.test.tsx`

**Stripe reference:** Bottom of both `/customers` and `/customers/figma`. Two side-by-side cells (stacking on mobile), each with a small headline + 1-line body + single ghost-style link. Stripe's are: "Always know what you'll pay → Pricing details" and "Start your integration → API reference".

**Our 2 tiles:**

1. Title `Always know what you'll pay`, body `Fixed-fee diagnostic. Transparent engagement pricing after. No mystery retainers.`, button `Start a Diagnostic` → `/diagnostic`.
2. Title `Start a conversation`, body `Tell us about your business and we'll point you to the highest-friction surface to start on.`, button `Inquire` → `/inquire`.

Also export `clientsCta` (same shape as the old constant) so existing `index.test.ts` continues to work.

- [ ] **Step 1: Write failing test**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import {
  createRouter,
  createMemoryHistory,
  RouterProvider,
} from '@tanstack/react-router'
import { routeTree } from '@/routeTree.gen'
import { ClosingCtaPair, clientsCta } from '../ClosingCtaPair'

function renderRouted(ui: React.ReactElement) {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ['/clients'] }),
  })
  return render(<RouterProvider router={router}>{ui}</RouterProvider>)
}

describe('ClosingCtaPair', () => {
  it('renders exactly two CTA tiles', () => {
    renderRouted(<ClosingCtaPair />)
    expect(
      screen.getByRole('heading', { name: /always know what you'll pay/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /start a conversation/i }),
    ).toBeInTheDocument()
  })

  it('first tile links to /diagnostic', () => {
    renderRouted(<ClosingCtaPair />)
    const diagnostic = screen.getByRole('link', { name: /start a diagnostic/i })
    expect(diagnostic.getAttribute('href')).toBe('/diagnostic')
  })

  it('second tile links to /inquire', () => {
    renderRouted(<ClosingCtaPair />)
    const inquire = screen.getByRole('link', { name: /^inquire$/i })
    expect(inquire.getAttribute('href')).toBe('/inquire')
  })

  it('exports a legacy clientsCta constant with primary tile copy', () => {
    expect(clientsCta.headline).toMatch(/pay/i)
    expect(clientsCta.label).toMatch(/diagnostic/i)
    expect(clientsCta.to).toBe('/diagnostic')
  })
})
```

- [ ] **Step 2: Run test to confirm failure**

Run: `npx vitest run apps/marketing/src/components/clients/__tests__/ClosingCtaPair.test.tsx`
Expected: FAIL — component does not exist.

- [ ] **Step 3: Create the component**

```tsx
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

interface CtaTile {
  headline: string
  body: string
  label: string
  to: '/diagnostic' | '/inquire' | '/process'
}

const TILES: ReadonlyArray<CtaTile> = [
  {
    headline: "Always know what you'll pay",
    body: 'Fixed-fee diagnostic. Transparent engagement pricing after. No mystery retainers.',
    label: 'Start a Diagnostic',
    to: '/diagnostic',
  },
  {
    headline: 'Start a conversation',
    body: "Tell us about your business and we'll point you to the highest-friction surface to start on.",
    label: 'Inquire',
    to: '/inquire',
  },
]

export const clientsCta = {
  headline: TILES[0].headline,
  body: TILES[0].body,
  label: TILES[0].label,
  to: TILES[0].to,
} as const

/**
 * 2-tile bottom CTA pair, used on both /clients index and /clients/$slug.
 * Mirrors Stripe /customers's bottom "Always know what you'll pay" +
 * "Start your integration" pair. Replaces the older 3-panel block.
 */
export function ClosingCtaPair() {
  return (
    <section className="relative z-10 px-6 md:px-12 py-20 md:py-28 border-t border-line-faint">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 max-w-7xl mx-auto">
        {TILES.map((tile) => (
          <div key={tile.headline} className="flex flex-col">
            <h3 className="font-serif text-3xl md:text-4xl mb-4">
              {tile.headline}
            </h3>
            <p className="text-ink-sub text-base leading-relaxed mb-6 max-w-md">
              {tile.body}
            </p>
            <Link
              to={tile.to}
              className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-gold hover:gap-3 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              {tile.label}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify pass**

Run: `npx vitest run apps/marketing/src/components/clients/__tests__/ClosingCtaPair.test.tsx`
Expected: PASS — all 4 cases.

- [ ] **Step 5: Commit**

```bash
git add apps/marketing/src/components/clients/ClosingCtaPair.tsx apps/marketing/src/components/clients/__tests__/ClosingCtaPair.test.tsx
git commit -m "feat(clients): add 2-tile bottom CTA pair (Stripe-exact)"
```

---

## Task 9: Wire index route to new section order

**Files:**

- Modify: `apps/marketing/src/routes/clients/index.tsx`
- Note: Index test lives at `apps/marketing/src/routes/-clients.test.ts` (dash-prefix excludes from route tree). It currently asserts only `clientsCta.to === '/diagnostic'` and `clientsCta.label.toLowerCase().includes('diagnostic')`. `ClosingCtaPair`'s first tile satisfies both, so no test edit required.

- [ ] **Step 1: Re-read existing index test to confirm assumptions**

Run: `cat apps/marketing/src/routes/-clients.test.ts`

Confirm: only `clientsCta.to`, `clientsCta.label`, `clientsIntro` content, and `caseStudies` data are tested — no section-order assertion. So the index route change in Step 2 should pass the test unchanged.

- [ ] **Step 2: Update the index route**

Replace `apps/marketing/src/routes/clients/index.tsx` contents with:

```tsx
import { createFileRoute } from '@tanstack/react-router'

import { ClientsBuildingTogether } from '@/components/clients/ClientsBuildingTogether'
import { ClientsBySize } from '@/components/clients/ClientsBySize'
import { ClientsBySolution } from '@/components/clients/ClientsBySolution'
import { ClientsByUseCase } from '@/components/clients/ClientsByUseCase'
import { ClientsFeaturedTiles } from '@/components/clients/ClientsFeaturedTiles'
import { ClientsHero, clientsIntro } from '@/components/clients/ClientsHero'
import { ClientsLogoStrip } from '@/components/clients/ClientsLogoStrip'
import { ClientsMeasurableResults } from '@/components/clients/ClientsMeasurableResults'
import { ClosingCtaPair, clientsCta } from '@/components/clients/ClosingCtaPair'

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
      <ClientsByUseCase />
      <ClientsBySolution />
      <ClosingCtaPair />
    </div>
  )
}
```

- [ ] **Step 3: Run the index test file**

Run: `npx vitest run apps/marketing/src/routes/-clients.test.ts`
Expected: PASS — the `clientsCta` re-export still resolves (now from `ClosingCtaPair`), `clientsIntro` is unchanged, `caseStudies` are unchanged.

- [ ] **Step 4: Run the full marketing test suite**

Run: `npm run test`
Expected: PASS — all tests across the workspace.

- [ ] **Step 5: Commit**

```bash
git add apps/marketing/src/routes/clients/index.tsx apps/marketing/src/routes/clients/index.test.ts
git commit -m "feat(clients): wire index to Stripe-exact section order"
```

---

## Task 10: Wire detail route to new section order + remove old ClosingCtaPanels

**Files:**

- Modify: `apps/marketing/src/routes/clients/$slug.tsx`
- Note: There is no detail-route test file (route tests for this slug live, if anywhere, inside data tests). After `npx rg ClosingCtaPanels apps/marketing` you will know every test that needs touching.
- Delete: `apps/marketing/src/components/clients/ClosingCtaPanels.tsx`
- Delete: `apps/marketing/src/components/clients/ClosingCtaPanels.test.tsx` (only if it exists)

- [ ] **Step 1: Check for old test files referencing ClosingCtaPanels**

Run: `npx rg -l 'ClosingCtaPanels' apps/marketing`

Catalog every file that imports the old component. For each, redirect to `ClosingCtaPair`.

- [ ] **Step 2: Update the detail route**

Replace `apps/marketing/src/routes/clients/$slug.tsx` contents with:

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
import { CaseStudyRegionStrip } from '@/components/caseStudy/CaseStudyRegionStrip'
import { ClosingCtaPair } from '@/components/clients/ClosingCtaPair'
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
      <CaseStudyRegionStrip
        region={study.region}
        companySize={study.companySize}
      />
      <CaseStudyBigStats study={study} />
      <CaseStudyInlineCta />
      <CaseStudyHeroImage study={study} />
      <CaseStudyNarrative study={study} />
      {study.pullquote ? (
        <CaseStudyPullquote pullquote={study.pullquote} />
      ) : null}
      <CaseStudyReadMore currentSlug={study.slug} />
      <ClosingCtaPair />
    </article>
  )
}
```

- [ ] **Step 3: Delete the obsolete ClosingCtaPanels**

Run:

```bash
rm apps/marketing/src/components/clients/ClosingCtaPanels.tsx
test -f apps/marketing/src/components/clients/ClosingCtaPanels.test.tsx && rm apps/marketing/src/components/clients/ClosingCtaPanels.test.tsx || true
```

- [ ] **Step 4: Verify no stragglers**

Run: `npx rg 'ClosingCtaPanels' apps/marketing`
Expected: NO output (zero references remaining).

- [ ] **Step 5: Run any tests that reference the detail page**

After Step 4 confirmed no `ClosingCtaPanels` strings remain, just run the full suite (next step). There is no dedicated detail-route test file.

- [ ] **Step 6: Run the full marketing test suite**

Run: `npm run test`
Expected: PASS — all tests.

- [ ] **Step 7: Commit**

```bash
git add apps/marketing/src/routes/clients/\$slug.tsx apps/marketing/src/routes/clients/\$slug.test.ts apps/marketing/src/components/clients/ClosingCtaPanels.tsx apps/marketing/src/components/clients/ClosingCtaPanels.test.tsx 2>/dev/null || true
git add -A apps/marketing/src/routes/clients apps/marketing/src/components/clients
git commit -m "feat(clients): wire detail page to Stripe-exact section order; retire ClosingCtaPanels"
```

---

## Task 11: Final verification

- [ ] **Step 1: Run typecheck**

Run: `npm run typecheck`
Expected: PASS — zero TypeScript errors.

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: PASS — zero lint errors. If `npm run check` was used by prior plans, run that for the auto-fix variant.

- [ ] **Step 3: Run full test suite**

Run: `npm run test`
Expected: PASS — every test green.

- [ ] **Step 4: Run dev server and visually verify both pages**

Run: `npm run dev` (in a separate terminal)
Manually open:

- `http://localhost:3000/clients` — confirm section order matches the table at the top of this plan.
- `http://localhost:3000/clients/scrollr` — confirm section order matches the detail-page table.

Walk through every section and compare side-by-side with the Stripe references:

- `https://stripe.com/customers`
- `https://stripe.com/customers/figma`

For each section, write down any structural mismatch (NOT cosmetic — copy/colors stay RelentNet). If anything structural is off, stop and capture it as a follow-up task before claiming done.

- [ ] **Step 5: Format pass**

Run: `npm run check`
Expected: PASS — prettier + eslint --fix should leave the tree clean.

- [ ] **Step 6: Final commit if formatting touched anything**

```bash
git status
# If any formatting deltas:
git add -A
git commit -m "chore(clients): final format pass after Stripe-exact replica"
```

---

## Self-Review

**Spec coverage check** (against the section tables at the top):

- Index #1 Hero — unchanged, still present (Task 9 wires it). ✓
- Index #2 Featured tiles — unchanged. ✓
- Index #3 Measurable results — unchanged. ✓
- Index #4 Logo strip — unchanged. ✓
- Index #5 Customers by size — unchanged. ✓
- Index #6 Building together — unchanged. ✓
- Index #7 Customers by use case — Task 6. ✓
- Index #8 Customers by solution — Task 7 (data: Task 5). ✓
- Index #9 CTA pair — Task 8. ✓
- Detail #1 Hero with logo — Task 1. ✓
- Detail #2 Products used vertical — Task 2. ✓
- Detail #3 Region + tier strip — Task 3. ✓
- Detail #4 Big stats — unchanged. ✓
- Detail #5 Inline CTA — unchanged. ✓
- Detail #6 Hero image — unchanged. ✓
- Detail #7 Narrative — Task 4. ✓
- Detail #8 Pullquote — unchanged. ✓
- Detail #9 Read more — unchanged. ✓
- Detail #10 CTA pair — Task 8 + Task 10 wires it. ✓

**Placeholder scan:** every step has actual code or commands. No TBDs.

**Type consistency:** `ClosingCtaPair` exports `clientsCta` matching the legacy shape `{ headline, body, label, to }`. `CaseStudyRegionStrip` accepts `companySize: CaseStudy['companySize']` (the original union type). `ClientsByUseCase` uses `EngagementType` imported from `@/data/caseStudies`. `clientSolutions` items use `href: '/diagnostic' | '/process' | '/inquire' | '/clients'` matching the existing TanStack Router union pattern used elsewhere in the codebase.

**One risk:** `clientSolutions` items export `href` typed as a union of static route strings. If the routes named here drift (e.g., `/process` is renamed), TypeScript will catch it. No runtime risk.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-23-clients-stripe-exact-replica.md`.

Two execution options:

1. **Subagent-Driven (recommended)** — Dispatch a fresh subagent per task with the executing-plans pattern. Each task is small (1 component, ~20 LOC of test, ~50–100 LOC of impl, 1 commit). Review between tasks catches drift early. This is what failed twice before by NOT doing — go subagent.

2. **Inline Execution** — Execute tasks 1–11 in this session with checkpoints.

Recommend Subagent-Driven for this plan given the prior pass-failures.
