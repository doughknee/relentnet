# Case Study Detail Pages — Design Spec

- **Date:** 2026-05-14
- **Branch:** `feat/case-studies`
- **Status:** Approved during brainstorming, pending written-spec review

## Goal

Each entry on `/portfolio` currently presents a brief Problem → Diagnosis → Build → Outcome summary. Prospects who want to evaluate RelentNet seriously have nowhere to go from there — the case studies feel thin and the page ends with a CTA before depth is established.

This spec adds **per-project detail pages** that expand the existing summary arc into a full case study: enough specifics, narrative, and visual proof to let a serious prospect believe RelentNet can solve a problem like theirs.

## Primary job of a case study page

**Sales proof for prospects.** Convince a serious owner-operator that RelentNet diagnoses real friction and ships systems that change how the business operates. Tone is confident, specific, business-focused — not a craft showcase, not magazine storytelling.

## Non-goals (explicit)

- Live iframe embeds via the existing `BrowserFrame` component. Rejected as fragile (X-Frame-Options, third-party site changes, perf cost).
- Filtering or tagging the `/portfolio` index by industry or system type.
- A wholesale redesign of `/portfolio`. The only index change is adding a "Read the case study" link per project.
- JSON-LD schema for case studies (defer to a future SEO pass).
- Video walkthroughs.
- Markdown / MDX authoring. Story content is plain prose paragraphs in TypeScript data.
- Changes to the homepage portfolio teaser cards.

## Page structure

Every detail page follows the same arc — an expansion of the index's existing P/D/B/O skeleton. Sections render top to bottom:

1. **Hero** — industry tag, name, one-sentence tagline, hero image, "Visit live site" link.
2. **At a glance** — fact strip (industry, system, year, role, stack tags). Optional metrics row (3-up grid). Optional pullquote.
3. **The Problem** (01) — operational friction described in business terms.
4. **The Diagnosis** (02) — the insight from the workflow diagnostic; what the real problem turned out to be.
5. **The Build** (03) — what was designed and built and the decisions that mattered. Most inline screenshots live here.
6. **The Outcome** (04) — what changed for the business operationally.
7. **Stewardship** (05, optional) — what ongoing care looks like for this engagement.
8. **Prev / Next** — adjacent case studies as bordered tiles.
9. **CTA** — "See the friction in your own operation?" → `/diagnostic`. Mirrors the existing `/portfolio` CTA so the brand experience is consistent.

The numbered watermarks (01–05) represent the **case-study arc**, not the site's process phases. Same visual treatment because it is the established brand vocabulary; distinct semantics, intentionally.

## Architecture

```
apps/marketing/src/
├── data/
│   └── caseStudies.ts          ← NEW: shared data + types + lookup helpers
├── routes/
│   ├── portfolio.tsx           ← MODIFIED: import data; add "Read case study" link per card
│   └── portfolio/
│       └── $slug.tsx           ← NEW: detail page route
└── components/
    └── caseStudy/              ← NEW: detail-page sub-components
        ├── CaseStudyHero.tsx
        ├── CaseStudyAtAGlance.tsx
        ├── CaseStudySection.tsx
        ├── CaseStudyImage.tsx
        ├── CaseStudyNav.tsx
        └── CaseStudyCta.tsx
```

`src/data/caseStudies.ts` is the single source of truth. Both `routes/portfolio.tsx` (index) and `routes/portfolio/$slug.tsx` (detail) import from it. Same pattern as `src/data/legalDocs.ts` consumed by `routes/legal/index.tsx` and `routes/legal/$docId.tsx`.

## Data model

```ts
export interface CaseStudyMetric {
  label: string // e.g. 'Quote turnaround'
  value: string // e.g. '4 days'
  context?: string // optional, e.g. 'down from 14 days'
}

export interface CaseStudyImage {
  src: string // /case-studies/scrollr-dashboard.png
  alt: string // required
  caption?: string // shown on detail figure only
  width: number // explicit, prevents CLS
  height: number
}

export interface CaseStudyQuote {
  text: string
  attribution: string // 'Name, Role, Company' — only when real and approved
}

export type StoryBlock =
  | { type: 'p'; text: string }
  | { type: 'image'; image: CaseStudyImage }
  | { type: 'quote'; text: string; attribution?: string }

export interface CaseStudy {
  // identity
  slug: string // 'scrollr', 'cambridge-building-group', ...
  name: string
  url: string // live external URL
  industry: string
  systemType: string

  // index card (kept verbatim — index reads identically to today)
  summary: {
    problem: string
    diagnosis: string
    build: string
    outcome: string
  }

  // detail page
  hero: {
    image?: CaseStudyImage // optional; falls back to text-only treatment
    tagline: string // one-sentence what-we-did
  }
  atAGlance: {
    engagementYear?: string
    duration?: string
    role?: string
    stack?: ReadonlyArray<string>
    metrics?: ReadonlyArray<CaseStudyMetric>
    quote?: CaseStudyQuote
  }
  story: {
    problem: ReadonlyArray<StoryBlock>
    diagnosis: ReadonlyArray<StoryBlock>
    build: ReadonlyArray<StoryBlock>
    outcome: ReadonlyArray<StoryBlock>
    stewardship?: ReadonlyArray<StoryBlock>
  }

  // SEO
  meta: {
    title: string
    description: string
  }
}

export const caseStudies: ReadonlyArray<CaseStudy> = [
  /* 5 entries */
]

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined
export function getAdjacentCaseStudies(slug: string): {
  prev: CaseStudy | null
  next: CaseStudy | null
}
```

### Data-model rationale

- `summary` preserves today's prose so the index page is unaffected.
- `story.*` is `Array<StoryBlock>` (paragraphs, images, quotes interleaved) — gives editorial flexibility without pulling in a markdown pipeline.
- Every optional field renders nothing when absent. Components never crash on missing data.
- `ReadonlyArray` enforces that exported data is treated as immutable.
- Inline `quote` block lets one well-placed pullquote anchor a section emotionally; not used as a substitute for the optional `atAGlance.quote`.

### Slugs

Full readable slugs: `scrollr`, `cambridge-building-group`, `courtcommand`, `vm-homes`, `star-kids`. Better for SEO and for humans skimming a URL bar.

## Routing

`apps/marketing/src/routes/portfolio/$slug.tsx`:

```ts
import { createFileRoute, notFound } from '@tanstack/react-router'
import { getCaseStudyBySlug } from '@/data/caseStudies'

export const Route = createFileRoute('/portfolio/$slug')({
  loader: ({ params }) => {
    const study = getCaseStudyBySlug(params.slug)
    if (!study) throw notFound()
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
```

Same loader-throws-`notFound` pattern as `routes/legal/$docId.tsx`. The auto-generated `routeTree.gen.ts` will be updated by the router plugin — never hand-edited.

## Components

| Component                                        | Responsibility                                                                                            | Key props                                                       |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `CaseStudyHero`                                  | Industry eyebrow, h1 name, tagline, hero image (or text fallback), "Visit live site" external link        | `caseStudy: CaseStudy`                                          |
| `CaseStudyAtAGlance`                             | Tag strip; conditionally renders metrics 3-up grid; conditionally renders pullquote                       | `atAGlance`, `industry`, `systemType`                           |
| `CaseStudySection`                               | Phase shell: large numbered watermark, eyebrow + title, then a `<StoryBlocks>` body                       | `number`, `label`, `title`, `blocks: ReadonlyArray<StoryBlock>` |
| `StoryBlocks` _(internal to `CaseStudySection`)_ | Switch on block type → `<p>`, `<CaseStudyImage>`, or pullquote                                            | `blocks`                                                        |
| `CaseStudyImage`                                 | `<figure>` with bordered frame matching `BrowserFrame` aesthetic, optional caption, explicit width/height | `image: CaseStudyImage`                                         |
| `CaseStudyNav`                                   | Prev/next bordered tiles using `getAdjacentCaseStudies(slug)`. Hides when null.                           | `slug: string`                                                  |
| `CaseStudyCta`                                   | Closing CTA. Mirrors the existing `portfolioCta` strings.                                                 | none                                                            |

Components live in `apps/marketing/src/components/caseStudy/`. Named-function exports (per repo convention). Props use `interface`.

## Index page change (`routes/portfolio.tsx`)

Two minimal edits:

1. Replace the inline `caseStudies` literal with `import { caseStudies } from '@/data/caseStudies'`. Update field reads (`study.problem` → `study.summary.problem`, etc.).
2. Inside each existing card (the 5-col side panel of `CaseStudySection`), add **below** the existing "View live site" external link:

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

Both CTAs coexist: external "View live site" for proof-now, internal "Read the case study" for proof-deeper. The existing `portfolioIntro` and `portfolioCta` named exports stay (they're already exported strings).

## Visual / motion details

Match the established `process.tsx` and `index.tsx` patterns so detail pages feel native:

- **Reveal-on-scroll** — Use the `useReveal(threshold)` IntersectionObserver hook pattern from `index.tsx`. Each major section gets its own reveal; child elements stagger via inline `animationDelay`.
- **Phase number watermark** — `text-[7rem] md:text-[10rem] font-serif text-black/[0.06] dark:text-white/[0.03] leading-none select-none`. Same treatment as `process.tsx`.
- **Layout** — `max-w-6xl mx-auto px-6 md:px-12`, `py-24 md:py-32` between sections. Body copy `max-w-2xl` for readability; images may break wider.
- **Typography** — body `text-ink-sub leading-relaxed`; eyebrows `text-[10px] font-bold tracking-[0.3em] uppercase text-gold`; captions `text-xs text-ink-muted`.
- **Pullquote** — `font-serif italic text-2xl md:text-3xl text-ink-sub`, centered, gold opening quote glyph.
- **At-a-glance metrics** — bordered cells `border border-line bg-card`; value `font-serif text-3xl text-ink-em`; label `text-[10px] uppercase tracking-[0.3em] text-ink-muted`; context `text-xs text-ink-muted`.
- **Reduced motion** — already handled globally in `styles.css`.

## Edge cases & error handling

- **Unknown slug** → `notFound()` triggers the existing luxury 404 component.
- **Missing hero image** → text-only hero (large name + tagline) inside a bordered card, matching today's index treatment for studies without screenshots.
- **Missing metrics / quote** → those rows do not render.
- **Empty story section** → TypeScript requires non-optional `problem/diagnosis/build/outcome`. Component renders nothing if an array is somehow empty at runtime; never throws.
- **Single case study (theoretical)** → `CaseStudyNav` hides arrows when adjacent is null.
- **Broken image** → `alt` is required by type; browser shows alt on load failure. No JS fallback for v1.

## SEO

- Per-page `title` and `description` via the route `head()`.
- Sitemap: add 5 entries to `apps/marketing/public/sitemap.xml`. (Confirm path at implementation time — `feat/portfolio-rework` had it at `public/sitemap.xml`; on `main` it lives at `apps/marketing/public/sitemap.xml`.)
- JSON-LD `Article` / `CreativeWork` schema deferred to a future pass.

## Testing

Vitest + Testing Library. Test files use the `-` prefix to opt out of routing (existing convention).

- `src/data/caseStudies.test.ts` — sanity:
  - Slug uniqueness.
  - Slug format (lowercase, hyphens, no spaces).
  - `getCaseStudyBySlug` returns expected; returns `undefined` for unknown.
  - `getAdjacentCaseStudies` correctly handles first/last/middle entries.
  - Every `story.{problem,diagnosis,build,outcome}` has ≥1 block.
- `src/routes/-portfolio.test.ts` _(extend existing)_ — assert "Read the case study" link is present per study and the link target matches each slug.
- `src/routes/portfolio/-$slug.test.ts` — lightweight render test for a known slug; assert known section headings render.

Component-level snapshot tests are not worth the maintenance cost for this surface — visual review in the dev server is faster and more useful.

## Implementation order

The detailed plan is produced separately by the `writing-plans` skill. High-level order:

1. Create `src/data/caseStudies.ts` with the new schema; populate 5 studies. `summary` carries existing prose; `story.*` is conservatively expanded; `metrics` and `quote` left explicitly empty (no fabrication).
2. Update `routes/portfolio.tsx` to import from data file and add the "Read the case study" link.
3. Build `src/components/caseStudy/` primitives.
4. Build `routes/portfolio/$slug.tsx` and let the router plugin regenerate `routeTree.gen.ts`.
5. Add tests.
6. Run `npm run check`, `npm run typecheck`, `npm run test`, `npm run build`, `npm run preview`.
7. Visual QA at `/portfolio` and each `/portfolio/<slug>` in the running dev server.
8. Track content debt outside this branch:
   - Capture screenshots for **CourtCommand** and **Star Kids** (currently no images).
   - Gather metrics for all 5 studies.
   - Gather any approved client quotes.

## Honesty constraint

Drafted prose may expand existing summary copy. It must not invent:

- Metrics or numerical claims.
- Client quotes or attributions.
- Features, integrations, or capabilities not visible on the live site or confirmed in repo history.

When in doubt, leave the field empty. The structure must look fine without it.
