# Site-Wide Positioning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the supporting marketing routes, navigation, and metadata with RelentNet's custom software and workflow stewardship positioning.

**Architecture:** Keep the existing React/TanStack Router route structure and Tailwind visual system. Add small exported content objects where needed so tests can verify positioning without rendering entire pages, then update route copy and labels to consume those objects.

**Tech Stack:** React 19, Vite 7, TanStack Router, TanStack Form, TypeScript strict mode, Vitest.

---

## File Structure

- Modify `apps/marketing/src/site.config.ts`: update global title/description to match the new offer.
- Modify `apps/marketing/src/routes/__root.tsx`: keep existing structured data shape, relying on updated `siteConfig` copy.
- Modify `apps/marketing/src/components/Header.tsx`: rename `The Discipline` navigation label to `Process` on desktop and mobile.
- Modify `apps/marketing/src/components/Footer.tsx`: optionally add a clearer inquiry link while preserving the existing minimal footer.
- Modify `apps/marketing/src/routes/process.tsx`: export `processHero` and `phases`; rewrite process content around discover, diagnose, design, build, steward.
- Modify `apps/marketing/src/routes/inquire.tsx`: export `inquiryContent`; rewrite page intro, form labels/options, success text, and related placeholders around workflow mapping.
- Modify `apps/marketing/src/routes/portal.tsx`: export `portalContent`; clarify active-client access and add prospect CTA back to `/inquire`.
- Create `apps/marketing/src/site.config.test.ts`: verify global metadata positioning.
- Create `apps/marketing/src/routes/-process.test.ts`: verify process positioning content.
- Create `apps/marketing/src/routes/-inquire.test.ts`: verify inquiry positioning content.
- Create `apps/marketing/src/routes/-portal.test.ts`: verify portal active-client/prospect split.

## Task 1: Global Metadata And Navigation

**Files:**

- Modify: `apps/marketing/src/site.config.ts`
- Modify: `apps/marketing/src/components/Header.tsx`
- Modify: `apps/marketing/src/components/Footer.tsx`
- Create: `apps/marketing/src/site.config.test.ts`

- [ ] **Step 1: Write the failing metadata test**

Create `apps/marketing/src/site.config.test.ts`:

```ts
import { describe, expect, it } from 'vitest'

import { siteConfig } from './site.config'

describe('siteConfig', () => {
  it('uses custom software and workflow stewardship positioning', () => {
    expect(siteConfig.meta.title).toContain('Custom Software')
    expect(siteConfig.meta.description).toContain('workflow friction')
    expect(siteConfig.meta.description).toContain('custom software systems')
    expect(siteConfig.meta.description).toContain('steward')
  })
})
```

- [ ] **Step 2: Run the failing metadata test**

Run: `npm run test -w @relentnet/marketing -- src/site.config.test.ts`

Expected: FAIL because the current metadata still says `Bespoke Digital Stewardship` and `Bespoke digital creation`.

- [ ] **Step 3: Update global metadata**

In `apps/marketing/src/site.config.ts`, replace the `meta` object with:

```ts
  meta: {
    title: 'RelentNet | Custom Software Stewardship',
    description:
      'White-glove technology partnership for owner-led businesses. We diagnose workflow friction, build custom software systems, and steward the technology long-term.',
    ogImage: '/logo512.png',
  },
```

- [ ] **Step 4: Update navigation labels**

In `apps/marketing/src/components/Header.tsx`, change both occurrences of `The Discipline` to `Process`.

In `apps/marketing/src/components/Footer.tsx`, update the footer links block to include a prospect path:

```tsx
<div className="flex gap-6 mt-6 md:mt-0">
  <Link to="/inquire" className="hover:text-gold transition-colors">
    Map Workflow
  </Link>
  <Link to="/portal" className="hover:text-gold transition-colors">
    Client Portal
  </Link>
  <Link to="/legal" className="hover:text-gold transition-colors">
    Legal
  </Link>
</div>
```

- [ ] **Step 5: Run the metadata test to verify it passes**

Run: `npm run test -w @relentnet/marketing -- src/site.config.test.ts`

Expected: PASS.

## Task 2: Process Page Positioning

**Files:**

- Modify: `apps/marketing/src/routes/process.tsx`
- Create: `apps/marketing/src/routes/-process.test.ts`

- [ ] **Step 1: Write the failing process test**

Create `apps/marketing/src/routes/-process.test.ts`:

```ts
import { describe, expect, it } from 'vitest'

import { phases, processHero } from './process'

describe('process route content', () => {
  it('positions the process around workflow diagnosis and stewardship', () => {
    expect(processHero.headline).toContain('How We Turn Workflow Friction')
    expect(processHero.body).toContain('diagnose')
    expect(processHero.body).toContain('custom software systems')
    expect(processHero.body).toContain('steward')
  })

  it('covers discover, diagnose, design, build, and steward phases', () => {
    expect(phases.map((phase) => phase.title)).toEqual([
      'Discover the Workflow',
      'Diagnose the Friction',
      'Design the System',
      'Build the Operating Layer',
      'Steward the Technology',
    ])
  })
})
```

- [ ] **Step 2: Run the failing process test**

Run: `npm run test -w @relentnet/marketing -- src/routes/-process.test.ts`

Expected: FAIL because `processHero` is not exported and the existing `phases` array is not exported or aligned to the new five-phase model.

- [ ] **Step 3: Export process hero content**

In `apps/marketing/src/routes/process.tsx`, add this after the `Phase` interface:

```ts
export const processHero = {
  headline: 'How We Turn Workflow Friction Into Operating Systems.',
  body: 'We diagnose how the business actually runs, design the workflow, build custom software systems around it, and steward the technology after launch.',
  cta: 'Map My Workflow',
} as const
```

- [ ] **Step 4: Replace and export the phases array**

In `apps/marketing/src/routes/process.tsx`, replace `const phases: Array<Phase> = [` with `export const phases: Array<Phase> = [` and use this array:

```ts
export const phases: Array<Phase> = [
  {
    number: '01',
    label: 'Discover',
    title: 'Discover the Workflow',
    quote: 'We begin with how the business actually moves.',
    description:
      'We map intake, sales, fulfillment, communication, reporting, and the tools your team already relies on before recommending a build.',
    deliverables: [
      'Workflow interviews',
      'Current-tool inventory',
      'Operational pain map',
      'Opportunity summary',
    ],
    icon: Compass,
  },
  {
    number: '02',
    label: 'Diagnose',
    title: 'Diagnose the Friction',
    quote: 'The right system starts with the right problem.',
    description:
      'We identify duplicated effort, missed follow-ups, fragile handoffs, unclear reporting, and the points where disconnected software slows the business down.',
    deliverables: [
      'Bottleneck analysis',
      'Data and handoff review',
      'Risk and priority notes',
      'Recommended system scope',
    ],
    icon: Layers,
  },
  {
    number: '03',
    label: 'Design',
    title: 'Design the System',
    quote: 'A clear workflow becomes a clear interface.',
    description:
      'We define the screens, data model, permissions, automations, and implementation sequence before production development begins.',
    deliverables: [
      'Workflow blueprint',
      'Interface direction',
      'Data model outline',
      'Implementation roadmap',
    ],
    icon: Layers,
  },
  {
    number: '04',
    label: 'Build',
    title: 'Build the Operating Layer',
    quote: 'The software should fit the business, not the other way around.',
    description:
      'We build portals, dashboards, internal tools, automations, and reporting systems with clean engineering and focused user experience.',
    deliverables: [
      'Production implementation',
      'Responsive interface build',
      'Integration and workflow testing',
      'Launch preparation',
    ],
    icon: Terminal,
  },
  {
    number: '05',
    label: 'Steward',
    title: 'Steward the Technology',
    quote: 'The launch is the start of the operating relationship.',
    description:
      'We stay close after launch with hosting, monitoring, maintenance, security support, and ongoing improvements as the business changes.',
    deliverables: [
      'Hosting and monitoring',
      'Security and dependency care',
      'Support and iteration',
      'Ongoing roadmap guidance',
    ],
    icon: ShieldCheck,
  },
]
```

- [ ] **Step 5: Update process page hero JSX**

In the hero section of `Process`, replace the hardcoded heading and body with:

```tsx
        <h1 className="relative z-10 font-serif text-5xl md:text-7xl lg:text-8xl text-center leading-[1.1] animate-fade-in-up">
          How We Turn Workflow Friction Into{' '}
          <span className="italic text-gold/90">Operating Systems.</span>
        </h1>
        <p
          className="mt-8 max-w-2xl text-center text-ink-sub font-light text-base md:text-lg leading-relaxed opacity-0 animate-fade-in-up"
          style={{ animationDelay: '200ms' }}
        >
          {processHero.body}
        </p>
```

- [ ] **Step 6: Update process divider copy**

In the philosophy divider, replace the paragraph with:

```tsx
<p className="font-serif text-2xl md:text-4xl leading-snug max-w-3xl mx-auto animate-fade-in-up opacity-0 delay-200">
  Every engagement follows the shape of the business.
  <br />
  <span className="text-black/15 dark:text-white/30">
    Discover the workflow. Diagnose the friction. Build what should exist.
  </span>
</p>
```

- [ ] **Step 7: Run the process test to verify it passes**

Run: `npm run test -w @relentnet/marketing -- src/routes/-process.test.ts`

Expected: PASS.

## Task 3: Inquiry Page Positioning

**Files:**

- Modify: `apps/marketing/src/routes/inquire.tsx`
- Create: `apps/marketing/src/routes/-inquire.test.ts`

- [ ] **Step 1: Write the failing inquiry test**

Create `apps/marketing/src/routes/-inquire.test.ts`:

```ts
import { describe, expect, it } from 'vitest'

import { inquiryContent } from './inquire'

describe('inquiry route content', () => {
  it('frames inquiry around workflow mapping and operational pain', () => {
    expect(inquiryContent.headline).toContain('Map Your Workflow')
    expect(inquiryContent.body).toContain('workflow')
    expect(inquiryContent.body).toContain('operational friction')
  })

  it('sets a clear success expectation', () => {
    expect(inquiryContent.successTitle).toBe('Workflow Context Received.')
    expect(inquiryContent.successBody).toContain('review')
    expect(inquiryContent.successBody).toContain('next step')
  })
})
```

- [ ] **Step 2: Run the failing inquiry test**

Run: `npm run test -w @relentnet/marketing -- src/routes/-inquire.test.ts`

Expected: FAIL because `inquiryContent` is not exported.

- [ ] **Step 3: Add exported inquiry content**

In `apps/marketing/src/routes/inquire.tsx`, add this after the `Route` export:

```ts
export const inquiryContent = {
  headline: 'Map Your Workflow.',
  body: 'Tell us where the business feels slow, manual, disconnected, or hard to see. We will review the workflow context and determine the best next step.',
  successTitle: 'Workflow Context Received.',
  successBody:
    'We will review the workflow context, look for the clearest operational opportunity, and follow up with the best next step.',
} as const
```

- [ ] **Step 4: Update inquiry route metadata**

In the `Route` head meta, replace the title and description with:

```ts
      { title: 'Map Your Workflow | RelentNet Inquiry' },
      {
        name: 'description',
        content:
          'Start a workflow mapping conversation with RelentNet. Share the operational friction, disconnected tools, and custom software opportunity inside your business.',
      },
```

- [ ] **Step 5: Update default form values for service type**

In the `defaultValues` object, change `projectNature` to:

```ts
      projectNature: 'workflow_discovery' as
        | 'workflow_discovery'
        | 'custom_system'
        | 'stewardship'
        | 'not_sure',
```

- [ ] **Step 6: Update the inquiry page intro JSX**

Replace the current heading and body inside the left-column intro with:

```tsx
              <h1 className="font-serif text-5xl md:text-6xl leading-[1.1] mb-6">
                Map Your <br />
                <span className="italic text-gold">Workflow.</span>
              </h1>
              <p className="text-ink-sub font-light text-lg leading-relaxed">
                {inquiryContent.body}
              </p>
```

- [ ] **Step 7: Update success state text**

Replace the success heading and paragraph with:

```tsx
                <h3 className="text-2xl font-serif">
                  {inquiryContent.successTitle}
                </h3>
                <p className="text-ink-sub max-w-md">
                  {inquiryContent.successBody}
                </p>
```

- [ ] **Step 8: Update form section headings and labels**

Make these copy replacements in `apps/marketing/src/routes/inquire.tsx`:

```txt
01. The Basics -> 01. Business Context
02. The Vision -> 02. Workflow Friction
Project Type -> Best Starting Point
Current URL -> Current Website or Tool URL
Project Vision -> What workflow, tool, or operational problem should we understand?
Timeline -> Urgency
```

Replace project nature option labels with:

```tsx
{ label: 'Workflow discovery', value: 'workflow_discovery' }
{ label: 'Custom software system', value: 'custom_system' }
{ label: 'Technology stewardship', value: 'stewardship' }
{ label: 'Not sure yet', value: 'not_sure' }
```

- [ ] **Step 9: Update relevant placeholders**

Replace placeholders with:

```txt
John Doe -> Full name
Relentless Industries -> Company or organization
https://example.com -> Existing site, portal, CRM, spreadsheet, or tool link
Describe the project... -> Describe the workflow pain, disconnected tools, reporting gaps, or manual process slowing the business down.
```

- [ ] **Step 10: Run the inquiry test to verify it passes**

Run: `npm run test -w @relentnet/marketing -- src/routes/-inquire.test.ts`

Expected: PASS.

## Task 4: Portal Page Positioning

**Files:**

- Modify: `apps/marketing/src/routes/portal.tsx`
- Create: `apps/marketing/src/routes/-portal.test.ts`

- [ ] **Step 1: Write the failing portal test**

Create `apps/marketing/src/routes/-portal.test.ts`:

```ts
import { describe, expect, it } from 'vitest'

import { portalContent } from './portal'

describe('portal route content', () => {
  it('distinguishes active client access from prospect inquiry', () => {
    expect(portalContent.body).toContain('active RelentNet clients')
    expect(portalContent.prospectCta).toBe('Start with a workflow map')
    expect(portalContent.prospectBody).toContain('not a client yet')
  })
})
```

- [ ] **Step 2: Run the failing portal test**

Run: `npm run test -w @relentnet/marketing -- src/routes/-portal.test.ts`

Expected: FAIL because `portalContent` is not exported.

- [ ] **Step 3: Import Link and export portal content**

In `apps/marketing/src/routes/portal.tsx`, change the first import to:

```ts
import { Link, createFileRoute } from '@tanstack/react-router'
```

Add this after the `Route` export:

```ts
export const portalContent = {
  headline: 'Client Access',
  body: 'Secure access for active RelentNet clients with systems, support, and stewardship already in motion.',
  prospectBody:
    'If you are not a client yet, start by sharing the workflow or operational friction you want mapped.',
  prospectCta: 'Start with a workflow map',
} as const
```

- [ ] **Step 4: Update portal route metadata**

Replace the route description with:

```ts
          'Secure access for active RelentNet clients. Prospects can start with a workflow mapping inquiry.',
```

- [ ] **Step 5: Update portal page text and add prospect CTA**

Replace the paragraph under the portal heading with:

```tsx
{
  portalContent.body
}
```

After the forgot password link block, add:

```tsx
<div className="mt-8 border-t border-line-faint pt-6 text-center">
  <p className="text-xs leading-relaxed text-ink-muted">
    {portalContent.prospectBody}
  </p>
  <Link
    to="/inquire"
    className="mt-4 inline-flex text-xs uppercase tracking-widest text-gold hover:underline"
  >
    {portalContent.prospectCta}
  </Link>
</div>
```

- [ ] **Step 6: Run the portal test to verify it passes**

Run: `npm run test -w @relentnet/marketing -- src/routes/-portal.test.ts`

Expected: PASS.

## Task 5: Full Verification

**Files:**

- Verify all changed files.

- [ ] **Step 1: Run all targeted positioning tests**

Run:

```sh
npm run test -w @relentnet/marketing -- src/site.config.test.ts src/routes/-process.test.ts src/routes/-inquire.test.ts src/routes/-portal.test.ts src/routes/-index.test.ts src/routes/-portfolio.test.ts
```

Expected: PASS.

- [ ] **Step 2: Run project check**

Run: `npm run check`

Expected: command completes successfully. If Prettier or ESLint modifies files, inspect the diff and continue with the modified files.

- [ ] **Step 3: Run typecheck**

Run: `npm run typecheck`

Expected: PASS.

- [ ] **Step 4: Run production build**

Run: `npm run build`

Expected: PASS.

- [ ] **Step 5: Review final diff**

Run: `git --no-pager diff -- apps/marketing/src docs/superpowers`

Expected: diff only includes the positioning pass, tests, and the spec/plan documents.

## Self-Review

- Spec coverage: global metadata, navigation labels, process copy, inquiry copy, portal copy, and tests are covered by Tasks 1-5.
- Placeholder scan: no `TBD`, `TODO`, or unspecified implementation steps remain.
- Type consistency: exported objects are named `processHero`, `phases`, `inquiryContent`, and `portalContent`, matching the tests.
- Scope check: this is one focused pass over existing marketing routes and does not add new subsystems.
