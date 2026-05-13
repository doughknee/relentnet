# Workflow Diagnostic Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/diagnostic` first-offer page and align the site-wide buying path around workflow diagnosis before custom software.

**Architecture:** Use the existing TanStack Router file-based route pattern and Tailwind visual language. Add exported content objects for the new diagnostic page and update existing route content exports so tests verify the diagnostic-first positioning without needing full DOM rendering.

**Tech Stack:** React 19, Vite 7, TanStack Router, TypeScript strict mode, Vitest, Tailwind CSS 4, Lucide React.

---

## File Structure

- Create `apps/marketing/src/routes/diagnostic.tsx`: new public first-offer page explaining Workflow Diagnostic.
- Create `apps/marketing/src/routes/-diagnostic.test.ts`: tests diagnostic content exports.
- Modify `apps/marketing/src/routes/index.tsx`: point primary CTA and selected homepage copy toward diagnostics before custom software.
- Modify `apps/marketing/src/routes/-index.test.ts`: update homepage expectations.
- Modify `apps/marketing/src/components/Header.tsx`: add Diagnostic nav item and change main CTA to `Start Diagnostic` linking to `/diagnostic`.
- Create `apps/marketing/src/components/Header.test.tsx`: verify nav path text exports by introducing a small exported nav data object.
- Modify `apps/marketing/src/components/Footer.tsx`: change `Map Workflow` footer link to `/diagnostic` and diagnostic-first label.
- Modify `apps/marketing/src/routes/inquire.tsx`: frame form as a diagnostic request endpoint and update submit CTA.
- Modify `apps/marketing/src/routes/-inquire.test.ts`: update inquiry positioning expectations.
- Modify `apps/marketing/src/routes/process.tsx`: make diagnostic the first practical engagement path without duplicating `/diagnostic` details.
- Modify `apps/marketing/src/routes/-process.test.ts`: verify diagnostic feeds the broader process.
- Modify `apps/marketing/src/routes/portfolio.tsx`: tune Work intro copy around diagnosed friction becoming useful systems.
- Modify `apps/marketing/src/routes/-portfolio.test.ts`: verify diagnosis-led case-study framing remains.
- Modify `apps/marketing/src/routes/portal.tsx`: point prospect CTA toward `/diagnostic`.
- Modify `apps/marketing/src/routes/-portal.test.ts`: verify portal prospect CTA.
- Modify `apps/marketing/src/site.config.ts`: update global metadata from custom-software-first to workflow-diagnostic-first.
- Modify `apps/marketing/src/site.config.test.ts`: update metadata expectations.
- Keep `apps/marketing/src/routeTree.gen.ts` unedited; Vite/TanStack Router will regenerate it during build/check as needed.

## Task 1: Diagnostic Route Content

**Files:**

- Create: `apps/marketing/src/routes/diagnostic.tsx`
- Create: `apps/marketing/src/routes/-diagnostic.test.ts`

- [ ] **Step 1: Write the failing diagnostic content test**

Create `apps/marketing/src/routes/-diagnostic.test.ts`:

```ts
import { describe, expect, it } from 'vitest'

import {
  diagnosticDeliverables,
  diagnosticFit,
  diagnosticHero,
  diagnosticNextSteps,
  diagnosticReviewAreas,
} from './diagnostic'

describe('diagnostic route content', () => {
  it('positions the diagnostic as the first buying step', () => {
    expect(diagnosticHero.headline).toBe(
      'Map the workflow before building the system.',
    )
    expect(diagnosticHero.body).toContain('operational friction')
    expect(diagnosticHero.body).toContain('before prescribing software')
    expect(diagnosticHero.primaryCta).toBe('Request a Workflow Diagnostic')
  })

  it('explains review areas, deliverables, fit, and next steps', () => {
    expect(diagnosticReviewAreas).toContain('Current tools')
    expect(diagnosticReviewAreas).toContain('Manual handoffs')
    expect(diagnosticDeliverables).toContain('Workflow map')
    expect(diagnosticDeliverables).toContain('Build recommendation')
    expect(diagnosticFit.goodFit).toContain('Owner-led businesses')
    expect(diagnosticFit.notFit).toContain('Commodity brochure sites')
    expect(diagnosticNextSteps).toContain('Custom operating system')
    expect(diagnosticNextSteps).toContain('No-build recommendation')
  })
})
```

- [ ] **Step 2: Run the failing diagnostic test**

Run: `npm run test -w @relentnet/marketing -- src/routes/-diagnostic.test.ts`

Expected: FAIL because `apps/marketing/src/routes/diagnostic.tsx` does not exist.

- [ ] **Step 3: Create the diagnostic route with exported content**

Create `apps/marketing/src/routes/diagnostic.tsx`:

```tsx
import { Link, createFileRoute } from '@tanstack/react-router'
import {
  ArrowRight,
  ClipboardList,
  GitBranch,
  Search,
  ShieldCheck,
  Wrench,
} from 'lucide-react'

export const Route = createFileRoute('/diagnostic')({
  head: () => ({
    meta: [
      { title: 'Workflow Diagnostic | RelentNet' },
      {
        name: 'description',
        content:
          'Start with a RelentNet Workflow Diagnostic to map operational friction, identify priority opportunities, and decide what technology is worth building.',
      },
    ],
  }),
  component: Diagnostic,
})

export const diagnosticHero = {
  eyebrow: 'Workflow Diagnostic',
  headline: 'Map the workflow before building the system.',
  body: 'RelentNet starts by understanding operational friction, disconnected tools, and manual handoffs before prescribing software. The diagnostic turns unclear business drag into a practical technology path.',
  primaryCta: 'Request a Workflow Diagnostic',
  secondaryCta: 'See Diagnosed Work',
} as const

export const diagnosticReviewAreas = [
  'Intake and lead flow',
  'Current tools',
  'Manual handoffs',
  'Reporting gaps',
  'Follow-up loops',
  'Client communication',
] as const

export const diagnosticDeliverables = [
  'Workflow map',
  'Friction summary',
  'Priority opportunities',
  'Build recommendation',
] as const

export const diagnosticFit = {
  goodFit: [
    'Owner-led businesses with real operational pain',
    'Teams outgrowing spreadsheets and disconnected tools',
    'Companies ready to improve how work moves through the business',
  ],
  notFit: [
    'Commodity brochure sites',
    'Vague app ideas without business context',
    'Quick fixes without ownership or follow-through',
  ],
} as const

export const diagnosticNextSteps = [
  'Custom operating system',
  'Focused automation',
  'Technology stewardship',
  'No-build recommendation',
] as const

function Diagnostic() {
  return (
    <div className="min-h-screen overflow-hidden">
      <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 relative">
        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <p className="text-gold text-[10px] tracking-[0.35em] uppercase font-bold mb-8 animate-fade-in-up">
            {diagnosticHero.eyebrow}
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.02] max-w-5xl animate-fade-in-up">
            Map the workflow before building{' '}
            <span className="italic text-gold/90">the system.</span>
          </h1>
          <p
            className="mt-8 max-w-2xl text-ink-sub text-base md:text-lg font-light leading-relaxed opacity-0 animate-fade-in-up"
            style={{ animationDelay: '150ms' }}
          >
            {diagnosticHero.body}
          </p>
          <div
            className="mt-10 flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '300ms' }}
          >
            <Link
              to="/inquire"
              className="inline-flex items-center justify-center gap-3 border border-gold bg-gold px-7 py-4 text-sm uppercase tracking-widest text-black transition-all duration-300 hover:bg-transparent hover:text-gold"
            >
              {diagnosticHero.primaryCta}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/portfolio"
              className="inline-flex items-center justify-center gap-3 border border-line px-7 py-4 text-sm uppercase tracking-widest text-ink transition-all duration-300 hover:border-gold hover:text-gold"
            >
              {diagnosticHero.secondaryCta}
            </Link>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-y border-line bg-surface px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-5">
              Why start here
            </p>
            <h2 className="font-serif text-3xl md:text-5xl leading-tight">
              You may not need more software first. You need to know what the
              workflow is costing you.
            </h2>
          </div>
          <div className="lg:col-span-7 space-y-6 text-ink-sub leading-relaxed">
            <p>
              Business owners usually feel the drag before they can name the
              system: missed follow-ups, duplicate entry, unclear reporting,
              scattered tools, and team knowledge trapped in manual handoffs.
            </p>
            <p>
              The Workflow Diagnostic creates the map before the build. It gives
              both sides a sharper way to decide what should be automated,
              rebuilt, stewarded, or left alone.
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex items-center gap-4">
            <Search className="size-6 text-gold" />
            <h2 className="font-serif text-3xl md:text-5xl">What we review</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {diagnosticReviewAreas.map((area) => (
              <div key={area} className="border border-line bg-card p-6">
                <p className="text-sm uppercase tracking-[0.18em] text-ink-sub">
                  {area}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 border-y border-line bg-surface px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="border border-line bg-card p-8 md:p-10">
            <ClipboardList className="mb-6 size-8 text-gold" />
            <h2 className="font-serif text-3xl mb-6">What you receive</h2>
            <ul className="space-y-4">
              {diagnosticDeliverables.map((item) => (
                <li key={item} className="flex items-start gap-3 text-ink-sub">
                  <ArrowRight className="mt-1 size-4 shrink-0 text-gold" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-line bg-card p-8 md:p-10">
            <GitBranch className="mb-6 size-8 text-gold" />
            <h2 className="font-serif text-3xl mb-6">Possible next steps</h2>
            <ul className="space-y-4">
              {diagnosticNextSteps.map((item) => (
                <li key={item} className="flex items-start gap-3 text-ink-sub">
                  <ArrowRight className="mt-1 size-4 shrink-0 text-gold" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <ShieldCheck className="mb-6 size-8 text-gold" />
            <h2 className="font-serif text-3xl mb-6">Good fit</h2>
            <ul className="space-y-4">
              {diagnosticFit.goodFit.map((item) => (
                <li key={item} className="text-ink-sub">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Wrench className="mb-6 size-8 text-gold" />
            <h2 className="font-serif text-3xl mb-6">Not a fit</h2>
            <ul className="space-y-4">
              {diagnosticFit.notFit.map((item) => (
                <li key={item} className="text-ink-sub">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 pb-24 md:px-12 md:pb-32">
        <div className="mx-auto max-w-4xl border border-gold/30 bg-gold/5 p-8 text-center md:p-12">
          <h2 className="font-serif text-3xl md:text-5xl">
            Start with clarity. Build only what earns its place.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-ink-sub leading-relaxed">
            Share where the business feels slow, fragile, or disconnected. We
            will use that context to determine whether a diagnostic is the right
            first step.
          </p>
          <Link
            to="/inquire"
            className="mt-8 inline-flex items-center justify-center gap-3 border border-gold bg-gold px-7 py-4 text-sm uppercase tracking-widest text-black transition-all duration-300 hover:bg-transparent hover:text-gold"
          >
            {diagnosticHero.primaryCta}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 4: Run the diagnostic test to verify it passes**

Run: `npm run test -w @relentnet/marketing -- src/routes/-diagnostic.test.ts`

Expected: PASS.

## Task 2: Homepage And Global Metadata Shift

**Files:**

- Modify: `apps/marketing/src/routes/index.tsx`
- Modify: `apps/marketing/src/routes/-index.test.ts`
- Modify: `apps/marketing/src/site.config.ts`
- Modify: `apps/marketing/src/site.config.test.ts`

- [ ] **Step 1: Update homepage and metadata tests first**

Modify `apps/marketing/src/routes/-index.test.ts` so it expects the diagnostic as the primary first step:

```ts
import { describe, expect, it } from 'vitest'

import { homepageHero, methodSteps, problemsSolved } from './index'

describe('homepage positioning', () => {
  it('leads with workflow diagnosis before custom software', () => {
    expect(homepageHero.headline).toBe(
      'Your business has outgrown disconnected tools.',
    )
    expect(homepageHero.body).toContain('workflow diagnostic')
    expect(homepageHero.body).toContain('before prescribing software')
    expect(homepageHero.primaryCta).toBe('Start With a Workflow Diagnostic')
  })

  it('explains the diagnostic-to-stewardship path', () => {
    expect(methodSteps.map((step) => step.title)).toEqual([
      'Diagnose',
      'Prioritize',
      'Design',
      'Build',
      'Steward',
    ])
    expect(problemsSolved).toContain('Reporting gaps')
    expect(problemsSolved).toContain('Manual handoffs')
  })
})
```

Modify `apps/marketing/src/site.config.test.ts`:

```ts
import { describe, expect, it } from 'vitest'

import { siteConfig } from './site.config'

describe('siteConfig', () => {
  it('uses workflow diagnostic and operational clarity positioning', () => {
    expect(siteConfig.meta.title).toContain('Workflow Diagnostic')
    expect(siteConfig.meta.description).toContain('operational friction')
    expect(siteConfig.meta.description).toContain('workflow diagnostic')
    expect(siteConfig.meta.description).toContain(
      'what technology is worth building',
    )
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -w @relentnet/marketing -- src/routes/-index.test.ts src/site.config.test.ts`

Expected: FAIL because homepage and metadata still lead with custom software stewardship.

- [ ] **Step 3: Update global metadata**

In `apps/marketing/src/site.config.ts`, replace the `meta` object with:

```ts
  meta: {
    title: 'RelentNet | Workflow Diagnostic & Technology Stewardship',
    description:
      'White-glove technology partnership for owner-led businesses. We diagnose operational friction with a workflow diagnostic, then clarify what technology is worth building.',
    ogImage: '/logo512.png',
  },
```

- [ ] **Step 4: Update homepage route metadata and hero content**

In `apps/marketing/src/routes/index.tsx`, update the route description content to:

```ts
          'White-glove technology partnership for owner-led businesses. Start with a workflow diagnostic, then build and steward the technology worth creating.',
```

Replace `homepageHero` with:

```ts
export const homepageHero = {
  headline: 'Your business has outgrown disconnected tools.',
  body: 'RelentNet starts with a workflow diagnostic to map operational friction before prescribing software. When the path is clear, we design, build, and steward the technology worth creating.',
  primaryCta: 'Start With a Workflow Diagnostic',
  secondaryCta: 'See Problems We Solve',
} as const
```

- [ ] **Step 5: Update homepage method steps and problems**

In `apps/marketing/src/routes/index.tsx`, replace `methodSteps` with:

```ts
export const methodSteps: Array<MethodStep> = [
  {
    title: 'Diagnose',
    description:
      'We map how work actually moves through intake, sales, fulfillment, communication, reporting, and follow-up.',
  },
  {
    title: 'Prioritize',
    description:
      'We separate symptoms from root friction and identify the opportunities most worth fixing first.',
  },
  {
    title: 'Design',
    description:
      'We define the workflow, interface, data model, and implementation plan only after the problem is clear.',
  },
  {
    title: 'Build',
    description:
      'When software is the right answer, we create the system with clean engineering and focused user experience.',
  },
  {
    title: 'Steward',
    description:
      'We stay close after launch with hosting, monitoring, improvements, support, and continued strategic iteration.',
  },
]
```

Replace `problemsSolved` with:

```ts
export const problemsSolved = [
  'Lead intake',
  'Manual handoffs',
  'Disconnected tools',
  'Follow-up loops',
  'Reporting gaps',
  'Client communication',
  'Admin drag',
  'Internal visibility',
] as const
```

- [ ] **Step 6: Update homepage links and service lane copy**

In the hero primary CTA link, change `to="/inquire"` to `to="/diagnostic"`.

In `serviceLanes`, replace the first two lane titles and descriptions:

```ts
  {
    title: 'Workflow Diagnostic',
    description:
      'A focused first engagement that turns unclear business friction into a practical technology path.',
    icon: Search,
  },
  {
    title: 'Build Recommendation',
    description:
      'A clear decision on whether the next move is a custom system, focused automation, stewardship, or no build at all.',
    icon: Workflow,
  },
```

- [ ] **Step 7: Run homepage and metadata tests to verify they pass**

Run: `npm run test -w @relentnet/marketing -- src/routes/-index.test.ts src/site.config.test.ts`

Expected: PASS.

## Task 3: Navigation And Portal CTA

**Files:**

- Modify: `apps/marketing/src/components/Header.tsx`
- Create: `apps/marketing/src/components/Header.test.tsx`
- Modify: `apps/marketing/src/components/Footer.tsx`
- Modify: `apps/marketing/src/routes/portal.tsx`
- Modify: `apps/marketing/src/routes/-portal.test.ts`

- [ ] **Step 1: Write failing header and portal tests**

Create `apps/marketing/src/components/Header.test.tsx`:

```ts
import { describe, expect, it } from 'vitest'

import { primaryNavItems, utilityCta } from './Header'

describe('Header navigation', () => {
  it('exposes the diagnostic as the first public buying path', () => {
    expect(primaryNavItems[0]).toEqual({
      label: 'Diagnostic',
      to: '/diagnostic',
    })
    expect(primaryNavItems.map((item) => item.label)).toEqual([
      'Diagnostic',
      'Process',
      'Work',
      'Portal',
    ])
    expect(utilityCta).toEqual({ label: 'Start Diagnostic', to: '/diagnostic' })
  })
})
```

Modify `apps/marketing/src/routes/-portal.test.ts`:

```ts
import { describe, expect, it } from 'vitest'

import { portalContent } from './portal'

describe('portal route content', () => {
  it('distinguishes active client access from diagnostic inquiry', () => {
    expect(portalContent.body).toContain('active RelentNet clients')
    expect(portalContent.prospectCta).toBe('Start with a workflow diagnostic')
    expect(portalContent.prospectBody).toContain('not a client yet')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -w @relentnet/marketing -- src/components/Header.test.tsx src/routes/-portal.test.ts`

Expected: FAIL because header nav data exports do not exist and portal CTA still says workflow map.

- [ ] **Step 3: Export nav data and render from it**

In `apps/marketing/src/components/Header.tsx`, add after `linkClasses`:

```ts
export const primaryNavItems = [
  { label: 'Diagnostic', to: '/diagnostic' },
  { label: 'Process', to: '/process' },
  { label: 'Work', to: '/portfolio' },
  { label: 'Portal', to: '/portal' },
] as const

export const utilityCta = {
  label: 'Start Diagnostic',
  to: '/diagnostic',
} as const
```

Replace the desktop center links with:

```tsx
{
  primaryNavItems.map((item) => (
    <Link key={item.to} to={item.to} className={linkClasses}>
      {item.label}
    </Link>
  ))
}
```

Replace the desktop CTA link with:

```tsx
<Link
  to={utilityCta.to}
  className="border border-line px-6 py-3 text-xs tracking-widest uppercase hover:bg-gold hover:border-gold hover:text-black transition-all duration-500 [&.active]:bg-gold [&.active]:text-black [&.active]:border-gold"
>
  {utilityCta.label}
</Link>
```

Replace the mobile route links block with:

```tsx
;<Link to="/" onClick={closeMenu} className={linkClasses}>
  Home
</Link>
{
  primaryNavItems.map((item) => (
    <Link
      key={item.to}
      to={item.to}
      onClick={closeMenu}
      className={linkClasses}
    >
      {item.label === 'Portal' ? 'Client Portal' : item.label}
    </Link>
  ))
}
```

Replace the mobile CTA text and path with `utilityCta`.

- [ ] **Step 4: Update footer diagnostic link**

In `apps/marketing/src/components/Footer.tsx`, change the `/inquire` footer link to:

```tsx
<Link to="/diagnostic" className="hover:text-gold transition-colors">
  Diagnostic
</Link>
```

- [ ] **Step 5: Update portal prospect CTA**

In `apps/marketing/src/routes/portal.tsx`, update `portalContent` prospect fields:

```ts
  prospectBody:
    'If you are not a client yet, start with a workflow diagnostic so we can understand the operational friction before recommending a build.',
  prospectCta: 'Start with a workflow diagnostic',
```

Change the prospect CTA `Link` from `to="/inquire"` to `to="/diagnostic"`.

- [ ] **Step 6: Run header and portal tests to verify they pass**

Run: `npm run test -w @relentnet/marketing -- src/components/Header.test.tsx src/routes/-portal.test.ts`

Expected: PASS.

## Task 4: Inquiry, Process, And Work Alignment

**Files:**

- Modify: `apps/marketing/src/routes/inquire.tsx`
- Modify: `apps/marketing/src/routes/-inquire.test.ts`
- Modify: `apps/marketing/src/routes/process.tsx`
- Modify: `apps/marketing/src/routes/-process.test.ts`
- Modify: `apps/marketing/src/routes/portfolio.tsx`
- Modify: `apps/marketing/src/routes/-portfolio.test.ts`

- [ ] **Step 1: Update route tests first**

Modify `apps/marketing/src/routes/-inquire.test.ts`:

```ts
import { describe, expect, it } from 'vitest'

import { inquiryContent } from './inquire'

describe('inquiry route content', () => {
  it('frames inquiry as a workflow diagnostic request', () => {
    expect(inquiryContent.headline).toContain('Request a Workflow Diagnostic')
    expect(inquiryContent.body).toContain('diagnostic')
    expect(inquiryContent.body).toContain('operational friction')
  })

  it('sets a clear success expectation', () => {
    expect(inquiryContent.successTitle).toBe('Diagnostic Request Received.')
    expect(inquiryContent.successBody).toContain('review')
    expect(inquiryContent.successBody).toContain('next step')
  })
})
```

Modify `apps/marketing/src/routes/-process.test.ts`:

```ts
import { describe, expect, it } from 'vitest'

import { phases, processHero } from './process'

describe('process route content', () => {
  it('positions process as diagnostic-led stewardship', () => {
    expect(processHero.headline).toContain('Diagnostic-Led')
    expect(processHero.body).toContain('workflow diagnostic')
    expect(processHero.body).toContain('before we build')
    expect(processHero.cta).toBe('Start With a Diagnostic')
  })

  it('keeps diagnose, prioritize, design, build, and steward phases', () => {
    expect(phases.map((phase) => phase.title)).toEqual([
      'Diagnose the Workflow',
      'Prioritize the Friction',
      'Design the System',
      'Build the Operating Layer',
      'Steward the Technology',
    ])
  })
})
```

Modify `apps/marketing/src/routes/-portfolio.test.ts`:

```ts
import { describe, expect, it } from 'vitest'

import { caseStudies, portfolioIntro } from './portfolio'

describe('portfolio case studies', () => {
  it('frames work as diagnosed friction becoming useful systems', () => {
    expect(portfolioIntro.headline).toContain('Diagnosed friction')
    expect(portfolioIntro.body).toContain('workflow diagnostic')
    expect(caseStudies).toHaveLength(5)
    expect(caseStudies.every((study) => study.diagnosis.length > 0)).toBe(true)
  })
})
```

- [ ] **Step 2: Run route tests to verify they fail**

Run: `npm run test -w @relentnet/marketing -- src/routes/-inquire.test.ts src/routes/-process.test.ts src/routes/-portfolio.test.ts`

Expected: FAIL because current content still frames inquiry and process less explicitly around diagnostics and `portfolioIntro` does not exist.

- [ ] **Step 3: Update inquiry content and submit CTA**

In `apps/marketing/src/routes/inquire.tsx`, replace `inquiryContent` with:

```ts
export const inquiryContent = {
  headline: 'Request a Workflow Diagnostic.',
  body: 'Tell us where the business feels slow, manual, disconnected, or hard to see. We will use the diagnostic request to understand the operational friction before recommending the next step.',
  successTitle: 'Diagnostic Request Received.',
  successBody:
    'We will review the workflow context, look for the clearest operational opportunity, and follow up with the best next step.',
} as const
```

Update the route title to `Request a Workflow Diagnostic | RelentNet`.

Update the visible heading to:

```tsx
                Request a <br />
                <span className="italic text-gold">Diagnostic.</span>
```

Update the submit button fallback text from `Request Consultation` to `Request Diagnostic`.

- [ ] **Step 4: Update process content**

In `apps/marketing/src/routes/process.tsx`, replace `processHero` with:

```ts
export const processHero = {
  headline: 'Diagnostic-Led Technology Stewardship.',
  body: 'The workflow diagnostic clarifies what is broken before we build. From there, we prioritize the friction, design the right system, and steward the technology after launch.',
  cta: 'Start With a Diagnostic',
} as const
```

Rename the first two phase titles:

```ts
title: 'Diagnose the Workflow'
title: 'Prioritize the Friction'
```

Update the hero H1 JSX to read:

```tsx
          Diagnostic-Led{' '}
          <span className="italic text-gold/90">Technology Stewardship.</span>
```

Add a CTA link after the hero paragraph:

```tsx
<Link
  to="/diagnostic"
  className="relative z-10 mt-10 inline-flex items-center justify-center gap-3 border border-gold bg-gold px-7 py-4 text-sm uppercase tracking-widest text-black transition-all duration-300 hover:bg-transparent hover:text-gold opacity-0 animate-fade-in-up"
  style={{ animationDelay: '350ms' }}
>
  {processHero.cta}
  <ArrowRight className="size-4" />
</Link>
```

- [ ] **Step 5: Update portfolio intro export and copy**

In `apps/marketing/src/routes/portfolio.tsx`, add after the `CaseStudy` interface:

```ts
export const portfolioIntro = {
  headline: 'Diagnosed friction. Useful systems. Clearer operations.',
  body: 'These case studies show the same pattern behind the Workflow Diagnostic: understand the operational friction, clarify the system worth creating, then build what helps the business move cleaner.',
} as const
```

Update the portfolio hero heading/body JSX to use `portfolioIntro.headline` and `portfolioIntro.body` while preserving the existing visual style.

- [ ] **Step 6: Run route tests to verify they pass**

Run: `npm run test -w @relentnet/marketing -- src/routes/-inquire.test.ts src/routes/-process.test.ts src/routes/-portfolio.test.ts`

Expected: PASS.

## Task 5: Route Tree And Full Verification

**Files:**

- Verify all changed files.

- [ ] **Step 1: Run all targeted tests**

Run:

```sh
npm run test -w @relentnet/marketing -- src/routes/-diagnostic.test.ts src/routes/-index.test.ts src/routes/-inquire.test.ts src/routes/-process.test.ts src/routes/-portfolio.test.ts src/routes/-portal.test.ts src/components/Header.test.tsx src/site.config.test.ts
```

Expected: PASS.

- [ ] **Step 2: Run full test suite**

Run: `npm run test`

Expected: PASS.

- [ ] **Step 3: Run project check**

Run: `npm run check`

Expected: command completes successfully. If TanStack Router regenerates `apps/marketing/src/routeTree.gen.ts`, inspect the diff and keep the generated change.

- [ ] **Step 4: Run typecheck**

Run: `npm run typecheck`

Expected: PASS.

- [ ] **Step 5: Run production build**

Run: `npm run build`

Expected: PASS.

- [ ] **Step 6: Review final diff**

Run: `git --no-pager diff -- apps/marketing/src docs/superpowers`

Expected: diff includes the new diagnostic route, route tree update if generated, site-wide copy alignment, tests, and spec/plan docs only.

## Self-Review

- Spec coverage: the plan creates `/diagnostic`, shifts homepage/inquiry/navigation/metadata toward diagnostics, preserves Work and Process, and updates tests.
- Placeholder scan: no `TBD`, `TODO`, or unspecified code steps remain.
- Type consistency: exported names match tests: `diagnosticHero`, `diagnosticReviewAreas`, `diagnosticDeliverables`, `diagnosticFit`, `diagnosticNextSteps`, `primaryNavItems`, `utilityCta`, `portfolioIntro`.
- Scope check: no backend changes, pricing, analytics, CMS, blog, or region landing pages are included.
