# Clients page Stripe-pivot — design

**Date:** 2026-05-22
**Branch:** `feat/case-studies` (extends PR #9)
**Status:** Spec — design only, no code yet

## Summary

Pivot the case studies surface from its current alternating-card layout to a
Stripe-customers-shaped layout. The pivot covers both the index page and the
detail pages, renames the route from `/portfolio` to `/clients`, and replaces
the mid-page At-a-Glance / Metrics blocks with a three-column body (sticky
stats rail · narrative · sticky stack card) modeled on Stripe's
`/customers/figma` layout.

This spec supersedes the layout decisions from
`2026-05-14-case-study-detail-pages-design.md`. The narrative content, story
arc structure, and data shape from that spec are preserved with small
extensions; only the visual composition changes.

## Why this pivot

The current layout is information-dense but visually flat. Every section
competes for attention at the same weight. Prospects scrolling the page get
the full case in a single uniform texture, which makes scanning hard and
makes specific proof points easy to miss.

Stripe's `/customers/figma` solves this with a tri-column shape that gives
each kind of content the visual treatment it earns:

- **Hard outcome numbers** sit in a sticky left rail so they follow the
  reader. The number `13M monthly active users` is on screen during every
  scroll position.
- **Engagement context** (what products were used, what scale, what
  industry) sits in a sticky right card so the reader never loses track of
  what kind of work this was.
- **Narrative** sits in the center column where it can be read at full
  reading width without competing with proof data.

The same shape serves RelentNet's case studies, with two adjustments:

1. The diagnostic-first narrative structure (four numbered sections) is
   preserved with renamed labels — the diagnostic identity is the
   differentiator, not the column layout.
2. The hero replaces Stripe's video with a Scrollr-style cycling
   image-plus-blurb showcase. The four cycling beats map 1:1 to the four
   narrative sections, so the hero functions as a visual index of the
   article that follows.

## Surfaces affected

| Surface           | New URL            | Replaces           |
| ----------------- | ------------------ | ------------------ |
| Index             | `/clients`         | `/portfolio`       |
| Detail            | `/clients/$slug`   | `/portfolio/$slug` |
| Redirects (nginx) | 301 from old paths | New                |

The rename to `/clients` is deliberate. RelentNet sells diagnostic-led
engagements, not a product; the people on these pages are clients of an
agency, not customers of a SaaS. The vocabulary matches the relationship
shape, the same intentional-wording instinct that produced the section
rename below (Outcome → Results).

## Section rename map (detail page narrative)

| Existing label   | New label            |
| ---------------- | -------------------- |
| 01 The Problem   | **01 The Challenge** |
| 02 The Diagnosis | 02 The Diagnosis     |
| 03 The Build     | **03 The Solution**  |
| 04 The Outcome   | **04 The Results**   |
| 05 Stewardship   | 05 Stewardship       |

Stewardship remains optional and demoted in tone. The visual treatment of
all five sections becomes quieter: small numbered eyebrow, simple
typography, no large colored cards. The current `CaseStudySection` component
stays structurally — only its visual styling and the labels passed to it at
the call site change.

## Detail page — composition

The detail page is composed top-to-bottom of:

1. **Hero** — cycling story-beat showcase (or single-image fallback)
2. **Three-column body** — sticky stats rail · narrative · sticky stack card
3. **Pullquote** — optional, full-width, unchanged from current behavior
4. **Services** — unchanged from current behavior
5. **Recognition** — optional, unchanged
6. **Prev/Next nav** — unchanged
7. **Closing CTA** — unchanged

### Hero — cycling story-beat showcase

The hero is a two-column block. The left side cycles through 3–4 images,
each tagged with a `sectionRef` that names one of the four narrative
sections (challenge, diagnosis, solution, results). The right side shows
the case study metadata (industry · system eyebrow, name, tagline) plus a
short blurb that cycles in sync with the image. A row of progress bars
beneath the metadata indicates which beat is active and double as
click-to-jump controls. Auto-advance interval is 4500ms, matching the
slower-than-Scrollr cadence appropriate to longer-form reading content.

The cycler is a clear architectural lift from
`/tmp/opencode/myscrollr/myscrollr.com/src/components/landing/HeroSection.tsx`
and its `HeroProductShowcase` companion, with two differences:

- No external animation library. Crossfade is plain CSS opacity transition
  on stacked absolutely-positioned images. `setInterval` drives advance.
  This keeps the dep surface clean — `motion/react` is not added.
- Click-to-jump on a progress bar can additionally scroll the page to the
  matching narrative section (anchor link by `sectionRef`). Marked as a
  follow-up below; not required for first ship.

The hero falls back to a single-image render (current behavior) when a
case study lacks the `hero.beats` array. Scrollr ships with four beats at
launch; the other four case studies use the fallback until images are
sourced.

### Three-column body

On `lg:` and up, the body is a three-column CSS grid. On `md:` and below,
the columns stack: rail content collapses into a horizontal strip below
the hero, narrative follows, and the stack card content collapses into a
single section at the end.

#### Left column — sticky stats rail

Vertically composed, top to bottom:

1. **Proof metrics** (0–4 entries). Each metric renders as one of two
   shapes depending on its data:
   - **Delta** — when both `from` and `to` are present:
     `Lighthouse Performance · 38 → 96`, with optional `context` sub-line
     (e.g. `Wayback-archived legacy vs current build`).
   - **Flat** — when only `value` is present (current behavior preserved):
     `13 million monthly active users`.
2. **Engagement facts** (1–3 entries). Drawn from existing `atAGlance`
   fields — `engagementYear`, `duration`, `role`. Quieter typography to
   visually distinguish from proof above.
3. **CTA** — pinned at the bottom of the rail.
   `Ready to diagnose your friction? → Start a diagnostic` linking to
   `/diagnostic`. The CTA is always present even when proof and engagement
   sections are empty (defensive — the rail never renders fully empty).

The rail is sticky on `lg:` via `position: sticky; top: <header-offset>`.
The narrative column scrolls past it.

#### Center column — narrative body

The four numbered sections render in order (Challenge, Diagnosis,
Solution, Results), each as a `CaseStudySection` with quieted styling.
Stewardship renders if present.

The center column has its own max-width tuned for reading
(`max-w-prose`-equivalent, ~65ch). The three-column grid uses 12 tracks
with the left rail spanning 3, the center column spanning 6, and the
right stack card spanning 3. Gaps are `gap-8` on `lg:` and `gap-12` on
`xl:`.

#### Right column — sticky stack card

Visually modeled on Stripe's `/customers/figma` "Products used" card. Top
to bottom:

1. **Company name header** — `study.name` in the card's heaviest type.
2. **Stack** — `study.atAGlance.stack` rendered as a categorized list.
   The card shows 4 items by default. Items 5+ are hidden behind a
   `+ N more` row that expands inline on click (no modal, no route
   change). Items render with `BrandIcon` — monochrome `simple-icons` SVG
   when the slug resolves, otherwise a neutral lucide icon. Order =
   priority within each category, with categories rendered in the data's
   declared order.
3. **Global** — optional row. When present, shows a colored brand logo
   plus a short label, e.g. `[Cloudflare logo] Cloudflare Global CDN`.
   The logo is a hand-tracked SVG under `apps/marketing/public/logos/`
   so brand color can be preserved. The Cloudflare orange is load-bearing
   here — the row's job is to read at a glance as "infrastructure of this
   class." When `atAGlance.global` is absent, the row is omitted.
4. **Industry** — repurposed from Stripe's "Enterprise" tag slot. Renders
   `study.industry` as plain text under a small `Industry` label. No
   logo. Always present.

The card is sticky on `lg:` alongside the stats rail.

### Pullquote, Services, Recognition, Prev/Next, CTA

Unchanged behavior. These sections render full-width below the three-column
body in the same order as the current detail page.

## Index page — composition

The index page replicates Stripe's `/customers` nine-band structure,
scaled down to N=5 case studies today. The full structure is built now
because the case study pipeline is expected to grow quickly; the bands
that look sparse at N=5 are expected to fill in as case studies are added.

| #   | Band                 | Behavior at N=5                                                                                                                                                                                                                                                                |
| --- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Hero                 | Reuse existing `portfolioIntro` copy. Primary CTA → `/diagnostic` ("Start a Diagnostic"). Secondary CTA → in-page anchor to band 2 ("Read client stories").                                                                                                                    |
| 2   | Portrait grid        | 4-column on `lg:`, first tile (Scrollr) spans 2 columns. 2-column on `md:` (no spanning, tiles flow in order). 1-column on `sm:` and below. Photographic treatment (existing hero images). Gold industry pill, name, tagline, hover lift. Each tile links to `/clients/$slug`. |
| 3   | Measurable results   | 4 aggregate metrics derived from `caseStudies`. Each entry annotated with the case study it came from. Supports the same delta shape as the rail.                                                                                                                              |
| 4   | Logo wall            | "Trusted by" strip. Populated from `clientLogos.ts`. Today: 8 sample entries flagged `isSample: true`. To be replaced post-merge with real logos.                                                                                                                              |
| 5   | By engagement type   | Tabs: Product / Operations / Platform. Stripe-style tiles per case study within each tab. Tab membership derived from a new `engagementType` field.                                                                                                                            |
| 6   | Featured engagement  | Full-width panel running Challenge / Solution / Stack inline + a "Read full case study →" link. Driven by `featured: true` on the case study data. Scrollr today.                                                                                                              |
| 7   | By industry vertical | Tabs auto-derived from distinct `study.industry` values. Horizontal-scrolling tile row per tab.                                                                                                                                                                                |
| 8   | What we build        | Three link cards, one per service area: "Diagnose", "Design & Build", "Steward". Each links to the corresponding section of `/process` (or to `/diagnostic` for the first). No filter behavior, no derived data — content cards.                                               |
| 9   | Closing CTA          | Reuse existing `portfolioCta` exactly. Secondary anchor: "Read all stories" → band 2.                                                                                                                                                                                          |

Bands 5 and 7 use distinct tab axes: Band 5 by _what kind of work_, Band 7
by _what kind of business_. This is deliberate — they describe different
slices of the same portfolio.

## Data model changes

All changes live in `src/data/caseStudies.ts` unless otherwise noted. New
fields are additive and optional except where noted.

### 1. `CaseStudyMetric` — add delta shape

```ts
export interface CaseStudyMetric {
  label: string
  value?: string // present for flat metrics
  from?: string // present when delta shape
  to?: string // present when delta shape
  context?: string
}
```

A metric is valid when exactly one of these shapes holds:

- **Flat:** `value` is set, `from` and `to` are both unset
- **Delta:** `from` and `to` are both set, `value` is unset

Any other combination (e.g. all three set, or none set) is rejected by
the validation test in `caseStudies.test.ts`.

The rail component renders the delta shape when `from && to`; otherwise it
renders the flat shape. Existing case study data populates only `value`,
so the migration is non-breaking.

Note: `value` is moved from required to optional in this change. Existing
data — which only ever set `value` — remains valid because the validator
accepts the flat shape.

### 2. `atAGlance.stack` — categorized structure

```ts
export interface StackCategory {
  category: string // "Client", "Server", "Data", …
  items: ReadonlyArray<{
    label: string // "Tauri v2"
    iconSlug?: string // "tauri" — simple-icons slug
  }>
}

export interface CaseStudyAtAGlance {
  // … existing fields unchanged
  stack?: ReadonlyArray<StackCategory> // shape change from string[]
  // …
}
```

All five existing case studies migrate at once. The flat-string shape
is removed — no parallel field, no back-compat shim, because the layout
that consumed the flat shape is removed in the same change.

The `iconSlug` is optional. When absent, `BrandIcon` falls back to a
neutral lucide icon. When present, it resolves to the matching
`simple-icons` SVG.

### 3. `atAGlance.global` — new optional field

```ts
export interface CaseStudyGlobal {
  label: string // "Cloudflare Global CDN"
  logoSrc: string // "/logos/cloudflare.svg"
}

export interface CaseStudyAtAGlance {
  // …
  global?: CaseStudyGlobal
}
```

When absent, the corresponding row of the Stack card is omitted. Scrollr
ships with Cloudflare populated; the other four case studies leave it
empty until verified.

### 4. `hero.beats` — new optional field

```ts
export type CaseStudySectionRef =
  | 'challenge'
  | 'diagnosis'
  | 'solution'
  | 'results'

export interface CaseStudyHeroBeat {
  image: CaseStudyImage
  sectionRef: CaseStudySectionRef
  blurb: string // 1–2 sentence beat copy
}

export interface CaseStudyHero {
  tagline: string
  image?: CaseStudyImage // single-image fallback (kept)
  beats?: ReadonlyArray<CaseStudyHeroBeat>
}
```

When `beats` has 1+ entries, the hero renders the cycler. When empty or
absent, the hero falls back to the existing single-image render.

A validation test ensures every `sectionRef` is one of the four canonical
values, and that no case study declares more than one beat with the same
`sectionRef`.

### 5. `featured: boolean` — promotes to Band 6

```ts
export interface CaseStudy {
  // …
  featured?: boolean
}
```

A validation test in `caseStudies.test.ts` enforces exactly one case study
has `featured: true`. Scrollr is featured at launch.

### 6. `engagementType` — drives Band 5 tabs

```ts
export type EngagementType = 'product' | 'operations' | 'platform'

export interface CaseStudy {
  // …
  engagementType: EngagementType // required
}
```

This field is required — Band 5 can't render correctly with unclassified
case studies. Default classifications during migration:

| Case study               | engagementType |
| ------------------------ | -------------- |
| Scrollr                  | product        |
| Cambridge Building Group | operations     |
| CourtCommand             | platform       |
| VM Homes                 | platform       |
| Star Kids                | operations     |

These are the author's best classifications; they can be revised per case
study during implementation review.

### 7. `industry` already exists

Drives Band 7 tabs directly. No change.

## New file — `src/data/clientLogos.ts`

```ts
export interface ClientLogo {
  name: string
  logoSrc: string // path under public/logos/clients/
  isSample: boolean // true today, false when real
  url?: string // optional outbound link
}

export const clientLogos: ReadonlyArray<ClientLogo> = [
  // 8 sample entries
]
```

Sample logos use generic placeholder SVGs committed to
`apps/marketing/public/logos/clients/sample-{1..8}.svg`. They're clearly
marked in the data (`isSample: true`) so the swap to real logos is a
one-line edit per entry.

## Component map

### Removed

- `CaseStudyAtAGlance.tsx` — its content splits between `CaseStudyStatsRail`
  (engagement facts) and `CaseStudyStackCard` (stack, industry).
- `CaseStudyMetrics.tsx` — content moves into `CaseStudyStatsRail`.

### Refactored

- `CaseStudyHero.tsx` — rewritten to render either the cycling beats hero
  (when `hero.beats` is populated) or the existing single-image hero
  (fallback). The single-image render path is preserved verbatim.
- `CaseStudySection.tsx` — kept structurally. Visual style is quieted:
  smaller eyebrow, no big colored card backgrounds, simple serif headings.
  Title strings are updated at the call site in `routes/clients/$slug.tsx`.
- `routes/portfolio/$slug.tsx` → moves to `routes/clients/$slug.tsx`. The
  inner component tree is restructured to the three-column body. Loader
  behavior (`getCaseStudyBySlug` → `notFound()`) is preserved.
- `routes/portfolio/index.tsx` → moves to `routes/clients/index.tsx` and
  is rewritten to compose the nine bands.

### New — detail page

- `CaseStudyHeroCycler.tsx` — the cycling image-and-blurb showcase
  extracted from the hero. Receives `beats` and an `activeIndex`-driving
  controller. Pure presentational; the parent hero owns timer state.
- `CaseStudyStatsRail.tsx` — sticky left rail. Composed of three internal
  blocks: `ProofMetrics`, `EngagementFacts`, `RailCta`. Each block
  renders nothing when its data is empty (except `RailCta`, always
  rendered).
- `CaseStudyStackCard.tsx` — sticky right card. Composed of
  `StackList` (with `+ N more` expansion state), `GlobalRow`, and
  `IndustryRow`.
- `BrandIcon.tsx` — renders a `simple-icons` SVG by slug, falls back to a
  lucide icon when the slug is unknown. Accepts `className` for size and
  color. Used both in `StackCard` and `LogoWall`. Implementation note:
  imports the slugs it needs explicitly (`import { siReact, siTauri, … } from 'simple-icons'`)
  rather than dynamically by string key, so the bundler can tree-shake.
  A small static map inside the component associates known
  `iconSlug` strings with their imported objects; unknown slugs fall
  through to the lucide default.

### New — index page (under `src/components/clients/`)

- `ClientsHero.tsx`
- `ClientsPortraitGrid.tsx`
- `ClientsResultsBand.tsx`
- `ClientsLogoWall.tsx`
- `ClientsByEngagementType.tsx` — owns its own tab state.
- `ClientsFeaturedEngagement.tsx`
- `ClientsByIndustry.tsx` — owns its own tab state.
- `ClientsWhatWeBuild.tsx`
- `ClientsClosingCta.tsx`

### Existing components — moves

- `src/components/caseStudy/` directory stays as the home for
  detail-page-specific components. The newly removed and newly added
  components above all live here.
- `src/components/clients/` is created for the index page bands.

## Route changes

- `routes/portfolio/index.tsx` → `routes/clients/index.tsx`
- `routes/portfolio/$slug.tsx` → `routes/clients/$slug.tsx`
- `routes/-portfolio.test.ts` → `routes/-clients.test.ts` (test contents
  updated to match new URLs and band structure)
- `routeTree.gen.ts` regenerates automatically via
  `@tanstack/router-plugin/vite`.

### Internal link updates

Every `<Link to="/portfolio…">` in the codebase is updated to
`/clients…`. Locations to verify (grep during implementation):

- `src/components/Header.tsx`
- `src/components/Footer.tsx`
- `src/routes/index.tsx`
- `src/routes/process.tsx`
- `src/routes/sow.tsx`
- `src/routes/diagnostic.tsx`
- Any `prev`/`next` references in `CaseStudyNav.tsx`
- Sitemap entries, if any

### Nav label

`Header.tsx` and `Footer.tsx` update their portfolio-related labels to
"Clients" (or equivalent — final copy decided at implementation time,
spec-allowed range is "Clients", "Our Clients").

## nginx redirects

`apps/marketing/nginx.conf` gains two permanent redirects:

```
rewrite ^/portfolio$ /clients permanent;
rewrite ^/portfolio/(.+)$ /clients/$1 permanent;
```

These produce HTTP 301s so any external link to a `/portfolio` URL
forwards cleanly to the new path. SPA fallback behavior for unknown paths
is unchanged.

## Dependencies

- **`simple-icons`** — new npm dependency. CC0 licensed, ~3000 brand
  monochrome SVGs. Tree-shakable: only the icons actually imported end up
  in the bundle. Used by `BrandIcon.tsx` for stack-list logos and for any
  client-logo fallbacks in the logo wall.
- **No animation library** — the cycling hero uses plain `setInterval`
  plus CSS opacity transitions. Specifically not adding `motion/react` or
  `framer-motion` for a single feature.
- **`apps/marketing/public/logos/cloudflare.svg`** — one hand-tracked
  colored SVG. No npm dep.
- **`apps/marketing/public/logos/clients/sample-{1..8}.svg`** — eight
  placeholder client logos. No npm dep.

## Out of scope (explicit)

- Sourcing real hero-beat images for Cambridge Building Group,
  CourtCommand, VM Homes, and Star Kids. They render the single-image
  hero (existing behavior) until images are sourced.
- Capturing real performance-delta numbers for the four non-Scrollr case
  studies. They render engagement facts only in their stats rail until
  numbers are captured.
- Replacing the 8 sample client logos with real ones. The data is
  structured for trivial swap.
- Anchor-scroll from a hero progress bar to its matching narrative
  section. Optional UX nicety; flagged as follow-up.
- Optional `engagementType` revisions per case study. Defaults are
  best-guess; revisions are content work, not layout work.
- JSON-LD `Article` schema for SEO (already deferred from the prior
  spec).

## Verification

After implementation, the following must pass:

- `npm run typecheck` — clean.
- `npm run test` — extend `caseStudies.test.ts` with:
  - exactly one case study has `featured: true`
  - every hero-beat `sectionRef` is one of the four canonical enum values
  - no case study has two hero beats with the same `sectionRef`
  - every metric is either flat (`value` only) or delta (`from && to`),
    never both, never neither
  - every case study has `engagementType` set
  - `clientLogos` exports at least 8 entries
- `npm run build` — clean.
- Manual dev-server verification at:
  - `/clients` (full nine-band render)
  - `/clients/scrollr` (cycling hero, three-column body, stack card with
    expansion, Cloudflare row populated)
  - `/clients/cambridge-building-group` (single-image hero fallback,
    three-column body, no Global row)
  - `/clients/nonexistent-slug` (404 path)
  - `/portfolio` (301 → `/clients`)
  - `/portfolio/scrollr` (301 → `/clients/scrollr`)

## Open follow-ups for future branches

- Anchor scroll from hero beat → narrative section
- Real hero-beat images for the four non-Scrollr case studies
- Real performance metrics for non-Scrollr case studies
- Real client logos (8) replacing samples
- JSON-LD `Article` schema on detail pages

## References

- Stripe customer index: <https://stripe.com/customers>
- Stripe Figma case study: <https://stripe.com/customers/figma>
- Scrollr hero cycler reference (myscrollr.com): GitHub
  `brandon-relentnet/myscrollr` →
  `myscrollr.com/src/components/landing/HeroSection.tsx` and
  `HeroProductShowcase.tsx`
- Predecessor spec:
  `docs/superpowers/specs/2026-05-14-case-study-detail-pages-design.md`
