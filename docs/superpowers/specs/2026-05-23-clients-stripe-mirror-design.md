# Clients Stripe-Mirror Design Spec

**Date:** 2026-05-23
**Status:** Draft
**Supersedes:** `docs/superpowers/specs/2026-05-22-clients-stripe-pivot-design.md`

---

## Why this spec

The first Stripe-pivot pass (PR #9) shipped a nine-band landing page that diverged from Stripe's actual layout: center-aligned hero, italic gold accent, partial-ARIA tab patterns, three-column rail+narrative+stack-card detail layout, etc.

The user reviewed the live preview and asked for a near-mirror replica of Stripe's customer-story pages, holding our background, colors, content, and button styles constant. This spec captures the exact layout patterns to mirror and how each maps to our content.

## Source references

- **Index:** https://stripe.com/customers
- **Detail:** https://stripe.com/customers/figma

Both were fetched and analyzed on 2026-05-23. The structural distillation is captured below in the per-section specifications.

## What stays from the current site

These elements are constant across this rewrite — none of them get restyled:

- **StarParticles background.** Mounted at `__root.tsx`, sits behind every page. Page sections layer on top via `position: relative; z-index: 10`.
- **Color palette.** `text-gold` accents, dark `bg-page` surface, theme tokens `bg-card` / `bg-inset` / `bg-surface` / `border-line` / `border-line-faint` / `text-ink` / `text-ink-sub` / `text-ink-muted` / `text-ink-em`.
- **Button styles.** Primary CTA: `border border-gold bg-gold px-7 py-4 text-sm uppercase tracking-widest text-black ... hover:bg-transparent hover:text-gold`. Secondary CTA: `border border-line px-7 py-4 text-sm uppercase tracking-widest text-ink ... hover:border-gold hover:text-gold`. Both styles already exist in the codebase and must not be modified.
- **Content (copy + case-study data).** All headlines, body paragraphs, metric labels, and outcome copy from the existing `caseStudies` data carry over verbatim. Where new content is needed for a section we don't have data for, we ship placeholder entries (see "Placeholder strategy" below).
- **Square edges.** Zero `rounded-*` utilities anywhere. Stripe's customer pages have nearly-imperceptible 4px rounding; we're going harder than Stripe and using pure 0px corners on every container, button, image frame, and tile.

## What gets restyled

Everything else — layouts, type scale, alignment, section rhythm, card chrome, stat treatments, tab styling — is rewritten to match Stripe.

## Placeholder strategy

Per user direction: "Use placeholder when in doubt or don't have info for that area." The user will fill placeholder content later.

**Conventions:**

- Placeholder case studies are added to `caseStudies.ts` with slug pattern `placeholder-1`, `placeholder-2`, etc.
- All placeholder copy is bracketed: `[Company name]`, `[Industry]`, `[Outcome with hard number]`.
- Placeholder images use a generated SVG at `apps/marketing/public/case-studies/placeholder/portrait.svg` (gray-on-gray with centered label "Case study coming soon").
- Tab grids that don't have enough real entries get padded with placeholders so the layout fills cleanly.
- The `companySize: 'startup' | 'growth' | 'enterprise'` field is left unset on real studies and set to `'placeholder'` on placeholder studies — the user assigns sizes later.

**Count of placeholders needed:**

- Band 2 (featured tile row, 6 tiles): 5 real + 1 placeholder = **1 placeholder**
- Band 4 (size-tabs grid, 3 tabs × 3 cards = 9 cards): 0 real assigned + 9 placeholders = **9 placeholders** (assignment of real studies to tabs happens when user fills the `companySize` field, which displaces a placeholder)
- Band 6 (deep-dive tabs, 5 customers): all 5 real, no placeholders
- Total new placeholder case-study entries: **as many as needed**, generated programmatically in a single data-seeding task

## Index page (`/clients`) — section-by-section spec

The index is a single-column, left-aligned page with section breaks. Each section is full-width with content constrained to `max-w-7xl mx-auto` inner container. All sections use `position: relative; z-10` so they layer above the StarParticles background.

The structure mirrors Stripe's `/customers` page in order:

### Section 1 — Hero

**Mirrors:** Stripe `/customers` hero (top of page).

**Layout:** Left-aligned. Eyebrow + h1 + descriptive paragraph + two-button CTA row.

**Wireframe:**

```
[ Eyebrow: "Customer stories" — small uppercase gold ]
[ H1: very large serif, left-aligned, max-w-4xl ]
[ Paragraph: medium body copy, left-aligned, max-w-2xl ]
[ See all stories ] [ Contact sales ]
```

**Copy:**

- Eyebrow: `Customer stories`
- H1: `The diagnostic-first studio behind systems that move cleaner.`
- Paragraph: `We're building a practice for ambitious operators who would rather understand the friction in their workflow than buy more software to mask it. Our engagements turn diagnosed friction into useful systems that help real businesses move cleaner — across construction, consumer software, sports tech, real estate, and nonprofits.`
- Primary CTA: `See all stories` → `#all-stories` anchor (in-page scroll to band 4)
- Secondary CTA: `Start a Diagnostic` → `/diagnostic` (replaces Stripe's "Contact sales")

**Classes:**

- Section: `relative z-10 px-6 md:px-12 pt-32 md:pt-40 pb-16 md:pb-20`
- Inner: `max-w-7xl mx-auto`
- Eyebrow: `text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-6`
- H1: `font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.05] max-w-4xl`
- Body: `mt-8 max-w-2xl text-ink-sub text-base md:text-lg leading-relaxed`
- Button row: `mt-10 flex flex-col sm:flex-row gap-4`

### Section 2 — Featured tile row (6 portrait tiles)

**Mirrors:** Stripe `/customers` second section — six tall portrait tiles in a horizontal row (Brightwheel, Rivian, Figma, Cursor, Squarespace, Lovable). Each tile is a full-color photographic portrait with a logo overlay and a "Read story" or "Watch video" link.

**Layout:** Single-row flex / grid of 6 tiles. Mobile: 1-column stacked. Tablet: 2-column. Desktop (`lg:`): 6-column row at equal width.

**Tile composition (each):**

```
[ Full-color portrait image (3:4 aspect) ]
  [ Bottom-left overlay: ]
  [ — Logo or company name (white serif, large) ]
  [ — "Read story →" link in white, uppercase, tracked-wide ]
```

**Data:** 5 real case studies in order [Scrollr, Cambridge Building Group, CourtCommand, VM Homes, Star Kids] + 1 placeholder = 6 tiles.

**Image source:** Each `CaseStudy` already has `hero.image`. For tiles, we use a new optional `portraitImage?: { src, alt, width, height }` field with portrait aspect; falls back to `hero.image` cropped if absent. Placeholder uses `/case-studies/placeholder/portrait.svg`.

**Classes:**

- Section: `relative z-10 px-6 md:px-12 py-16 md:py-20`
- Inner: `max-w-7xl mx-auto`
- Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-px bg-line-faint`
- Tile (`<Link>`): `group relative block aspect-[3/4] overflow-hidden bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold`
- Image: `absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]`
- Overlay gradient: `absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent`
- Overlay content: `absolute bottom-0 left-0 right-0 p-6`
- Company name: `font-serif text-2xl text-white`
- Read story link: `mt-3 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white group-hover:text-gold transition-colors`

The `gap-px bg-line-faint` trick uses a 1px gap with a colored parent background to produce a hairline divider grid (Stripe's exact look).

### Section 3 — Measurable results (4 huge stats)

**Mirrors:** Stripe `/customers` "We help customers achieve measurable results" — 4 huge serif numbers in a horizontal row, each with a one-line description below.

**Layout:** Section header (small eyebrow + large h2) then a 4-column row of stat blocks. Mobile: 2×2 grid; tablet+: 4-column.

**Wireframe:**

```
[ Eyebrow: "Measurable results" ]
[ H2: large serif headline, left-aligned ]

[ stat 1 ]  [ stat 2 ]  [ stat 3 ]  [ stat 4 ]
[ label ]   [ label ]   [ label ]   [ label ]
```

**Copy:**

- Eyebrow: `Measurable results`
- H2: `Diagnosed friction becomes useful systems.`
- Stats (real per-customer numbers from existing data):
  - `1 → 3 platforms` — `Scrollr's Chrome extension shipped as native apps on macOS, Windows, and Linux.`
  - `[Placeholder stat]` — `[Placeholder one-line attribution.]` (3 placeholder slots — user fills with real CBG / CourtCommand / VM Homes / Star Kids numbers later)

The data file gains a new field `featuredStat?: { value: string; description: string }` on each `CaseStudy`. The component picks the 4 entries with non-null `featuredStat` to render this section, falling back to placeholders.

**Classes:**

- Section: `relative z-10 px-6 md:px-12 py-20 md:py-28 border-t border-line-faint`
- Inner: `max-w-7xl mx-auto`
- Eyebrow: `text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-3`
- H2: `font-serif text-3xl md:text-5xl lg:text-6xl max-w-3xl mb-16 md:mb-20`
- Stats grid: `grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12`
- Stat value: `font-serif text-4xl md:text-5xl lg:text-6xl text-ink-em leading-none`
- Stat label: `mt-4 text-sm text-ink-sub leading-relaxed`

### Section 4 — Logo strip

**Mirrors:** Stripe `/customers` flat horizontal logo strip (Shopify, Wayfair, Google, Peloton, Instacart, Amazon, Notion, Figma). No "Trusted by" eyebrow, no heading. Just a centered row of logos.

**Layout:** Centered flex row of logo images, single line on desktop, wrapping on mobile.

**Data:** Reuse the existing `clientLogos.ts` data (8 sample SVGs flagged `isSample: true`). User replaces with real logos later.

**Classes:**

- Section: `relative z-10 px-6 md:px-12 py-12 md:py-16 border-t border-b border-line-faint`
- Inner: `max-w-7xl mx-auto`
- List: `flex flex-wrap items-center justify-center md:justify-between gap-x-12 gap-y-6 text-ink-muted`
- Logo wrapper: `opacity-60 hover:opacity-100 transition-opacity`
- Logo `<img>`: `h-6 md:h-8 w-auto`

(Reduced logo height from `h-8 md:h-10` to `h-6 md:h-8` — Stripe's logos are smaller and the section is denser.)

### Section 5 — Customers by size (tabbed 9-card grid)

**Mirrors:** Stripe `/customers` "Companies of all sizes around the world use Stripe" — section heading + 3 tabs (`Startup` / `Growth` / `Enterprise`) + a grid of 3 mini case-study cards per tab.

**Layout:**

```
[ Eyebrow: "Customers by size" ]
[ H2: large serif ]

[ Startup ]  [ Growth ]  [ Enterprise ]    <- tabs (active underlined gold)

[ card ]  [ card ]  [ card ]
```

Each mini card has:

- One or two big stats (serif, large)
- A "Stack used" tag list (3 visible + "+N more" link)
- A landscape image at the bottom

**Wireframe (single card):**

```
[ Stat 1 (huge serif) ]
[ — label ]
[ Stat 2 (huge serif) ]
[ — label ]

Stack used
[ Tag ] [ Tag ] [ + 3 more → ]

[ Landscape image, 16:9 ]
```

**Data:**

- Add `companySize?: 'startup' | 'growth' | 'enterprise' | 'placeholder'` to `CaseStudy`.
- Set all 5 real studies to `'placeholder'` initially (user assigns later).
- Generate 9 placeholder studies with `companySize` distributed evenly: 3 startup / 3 growth / 3 enterprise.

When a user reassigns a real study's `companySize` from `'placeholder'` to (say) `'growth'`, the real study slots into the Growth tab and displaces one placeholder (the component renders real studies first, then fills remaining card slots up to 3 with placeholders).

**Tab classes (NOT a WAI-ARIA tab pattern):** Per the previous review's recommendation, use `role="group"` + `aria-pressed` buttons, not `role="tab"`.

**Classes:**

- Section: `relative z-10 px-6 md:px-12 py-20 md:py-28 border-t border-line-faint`
- Eyebrow: `text-[10px] font-bold tracking-[0.3em] uppercase text-ink-muted mb-3`
- H2: `font-serif text-3xl md:text-5xl lg:text-6xl max-w-3xl mb-12 md:mb-16`
- Tab wrapper: `flex flex-wrap gap-8 border-b border-line-faint mb-12`
- Tab button: `pb-4 -mb-px text-sm uppercase tracking-[0.2em] text-ink-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold` + (active) `text-gold border-b-2 border-gold`
- Card grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12`
- Card `<Link>`: `group block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold`
- Card body: no border, no card background — Stripe uses raw inline layout with the landscape image as the visual anchor
- Stat value: `font-serif text-3xl md:text-4xl text-ink-em leading-none`
- Stat label: `mt-2 text-sm text-ink-sub`
- Stack heading: `mt-6 text-[10px] font-bold tracking-[0.3em] uppercase text-ink-muted mb-3`
- Stack tag list: `flex flex-wrap gap-2`
- Stack tag: `text-xs text-ink-sub`
- "+N more" link: `text-xs text-gold`
- Landscape image: `mt-6 aspect-video w-full object-cover transition-opacity duration-300 group-hover:opacity-80`

### Section 6 — Building together (deep-dive tabbed engagement)

**Mirrors:** Stripe `/customers` "Building together / We partner with customers to build breakthrough products" — section heading + 4 customer tabs (Lyft / Instacart / Shopify / Flexport), each revealing a Challenge/Solution two-column block + product tags + a large product mockup image.

**Layout:**

```
[ Eyebrow: "Building together" ]
[ H2: large serif ]
[ Paragraph: descriptive sub-copy ]

[ Tab 1 ] [ Tab 2 ] [ Tab 3 ] [ Tab 4 ] [ Tab 5 ]    <- vertical sidebar on lg:, horizontal on mobile

[ Active tab pane: ]
  H3: "How we built [thing] with [Customer]"

  [ Challenge ]
  paragraph
  [ Solution ]
  paragraph
  [ Stack ]
  tag list

  [ Large product mockup image ]
```

Stripe uses a vertical tab list on the left side of the pane on desktop. We mirror that.

**Data:** All 5 real case studies (Scrollr, CBG, CourtCommand, VM Homes, Star Kids). Each renders its `summary.problem` / `summary.build` and stack from `atAGlance.stack`. The huge mockup image is `hero.image` (or `hero.beats[0].image` if present).

**Copy:**

- Eyebrow: `Building together`
- H2: `We partner with operators to build breakthrough systems.`
- Paragraph: `Every engagement starts with a diagnostic. Every system we build is scoped to the friction we found. The case studies below show how that played out across five very different operations.`

**Classes:**

- Section: `relative z-10 px-6 md:px-12 py-20 md:py-28 border-t border-line-faint bg-surface backdrop-blur-xs`
- H2: `font-serif text-3xl md:text-5xl lg:text-6xl max-w-3xl mb-6`
- Paragraph: `text-ink-sub text-base md:text-lg leading-relaxed max-w-2xl mb-16 md:mb-20`
- Layout: `grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12`
- Tab sidebar: `lg:col-span-3`
- Tab button: full-width left-aligned `block w-full text-left px-0 py-4 border-b border-line-faint text-sm uppercase tracking-[0.2em] text-ink-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold` + (active) `text-gold border-l-2 border-l-gold pl-4 -ml-4 border-b-line-faint`
- Active pane: `lg:col-span-9`
- Pane H3: `font-serif text-3xl md:text-4xl mb-8`
- Section heading inside pane: `text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-3`
- Section body: `text-ink-sub text-sm md:text-base leading-relaxed mb-8`
- Stack tag list: `flex flex-wrap gap-2 mb-12`
- Stack tag: `text-xs text-ink-sub border border-line-faint bg-inset px-3 py-1.5`
- Image: `w-full aspect-video object-cover`

### Section 7 — Closing CTA panels (3 side-by-side)

**Mirrors:** Stripe's closing 3-panel CTA at the bottom of `/customers` and `/customers/figma`: "Ready to get started?" / "Always know what you'll pay" / "Start your integration".

**Layout:** 3-column grid on `lg:`, single column on mobile. Each panel is a left-aligned text block + CTA link.

**Copy:**

- **Panel 1 — Ready to get started?**
  - H3: `Ready to diagnose your friction?`
  - Body: `Start with a workflow diagnostic before deciding what should be built. We listen first.`
  - CTAs: `Start a Diagnostic` (primary) → `/diagnostic`, `Contact us` (secondary) → `/inquire`
- **Panel 2 — Always know what you pay**
  - H3: `Always know what you'll get.`
  - Body: `Fixed-scope diagnostic. Transparent engagement pricing after. No mystery retainers.`
  - CTA: `See our process` → `/process`
- **Panel 3 — Start your integration**
  - H3: `Need to talk it through first?`
  - Body: `Tell us about your business and we'll point you to the highest-friction surface to start on.`
  - CTA: `Inquire` → `/inquire`

**Classes:**

- Section: `relative z-10 px-6 md:px-12 py-20 md:py-28 border-t border-line-faint`
- Grid: `grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 max-w-7xl mx-auto`
- Panel: `flex flex-col`
- Panel H3: `font-serif text-3xl md:text-4xl mb-4`
- Panel body: `text-ink-sub text-base leading-relaxed mb-6`
- CTA row: `flex flex-col sm:flex-row gap-4 mt-auto`

## Detail page (`/clients/$slug`) — section-by-section spec

The detail page is single-column, left-aligned, full-width text content with images. The current three-column layout (rail + narrative + stack-card) is removed entirely.

The structure mirrors Stripe's `/customers/figma`:

### Section A — Detail hero

**Mirrors:** Top of `/customers/figma`. Headline + descriptive paragraph + company logo positioned to the right (or as accent).

**Layout:**

```
[ Breadcrumb: Customers / Figma ]

[ H1: Headline (very large serif, left-aligned, max-w-4xl) ]
[ Paragraph: "Figma democratizes design ... worked with Stripe to update billing." ]
[ Logo: small inline logo with company name, or a small mark in the top-right corner ]
```

For us:

- Breadcrumb: `Clients / [Company name]`
- H1: A short headline derived from the engagement (e.g., for Scrollr: `Scrollr shipped to three native platforms in twelve weeks.`). We add a new field `detailHeadline?: string` on `CaseStudy`; falls back to current `hero.tagline` if unset.
- Body paragraph: Currently `hero.tagline` — for the Stripe match this becomes 2-3 sentences. We add `detailBody?: string` on `CaseStudy`; falls back to combining `hero.tagline` + `summary.problem`.

**Classes:**

- Section: `relative z-10 px-6 md:px-12 pt-32 md:pt-40 pb-12 md:pb-16`
- Inner: `max-w-7xl mx-auto`
- Breadcrumb wrapper: `mb-12 text-xs uppercase tracking-[0.2em] text-ink-muted`
- Breadcrumb `<Link>`: `hover:text-gold transition-colors`
- H1: `font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.05] max-w-4xl`
- Body: `mt-8 max-w-2xl text-ink-sub text-base md:text-lg leading-relaxed`

### Section B — "Products used" pill row

**Mirrors:** `/customers/figma` row below hero — flat horizontal list of "products used" pills with a `+ N more` collapse, plus `Global` and `Enterprise` size pills.

**Layout:** Inline flex of pills.

For us:

- Pills are stack items from `atAGlance.stack[].items`, flattened. Show first 6, "+ N more" for the rest. Same disclosure pattern as the old `CaseStudyStackCard`, but inline.
- Add a `region` pill (e.g., `US` or `Global`) — comes from a new `CaseStudy.region?: string` field. If unset, omit the pill.
- Add a `companySize` pill (`Startup` / `Growth` / `Enterprise`). If `companySize === 'placeholder'` or unset, omit.

**Classes:**

- Section: `relative z-10 px-6 md:px-12 py-8 border-t border-b border-line-faint`
- Inner: `max-w-7xl mx-auto`
- Eyebrow: `text-[10px] font-bold tracking-[0.3em] uppercase text-ink-muted mb-4`
- Pill list: `flex flex-wrap gap-x-6 gap-y-3 items-center`
- Pill: `flex items-center gap-2 text-sm text-ink-sub`
- Pill icon: `<BrandIcon slug={...} className="size-4 text-ink-muted" />`
- "+ N more" button: `text-sm text-gold hover:text-ink transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold`
- Region / Size pill: `text-sm text-ink-sub border-l border-line-faint pl-6 ml-2`

### Section C — Big stats vertical list

**Mirrors:** `/customers/figma` huge serif numbers stacked vertically left-aligned: `13 million / monthly active users`, `Approximately 85% / of its monthly users are located outside the U.S.`, etc.

**Layout:** Vertical stack of 3-5 stat entries. Each entry: huge serif number + one-line label below. No horizontal grid here; just stacked.

**Wireframe:**

```
[ Stat value, huge serif ]
[ — label, sub-copy ]

[ Stat value, huge serif ]
[ — label, sub-copy ]

[ Stat value, huge serif ]
[ — label, sub-copy ]
```

**Data:** Comes from existing `atAGlance.metrics` (the field already supports flat and delta shapes). If a case study has 0 hard metrics, this section renders nothing (don't show a placeholder section — the entire band is conditional).

**Classes:**

- Section: `relative z-10 px-6 md:px-12 py-16 md:py-24`
- Inner: `max-w-3xl` (narrower than the page max-w to keep the stats reading vertically without sprawl)
- Stat block: `mb-12 last:mb-0`
- Stat value (flat): `font-serif text-5xl md:text-7xl lg:text-8xl text-ink-em leading-none`
- Stat value (delta): same but with from→to formatting (existing pattern from the deleted `CaseStudyStatsRail`)
- Stat label: `mt-4 text-base md:text-lg text-ink-sub leading-relaxed`

### Section D — Inline CTA before the body

**Mirrors:** `/customers/figma` mini "Ready to get started?" CTA before the main narrative.

**Layout:** Single short block — h3 + CTA link only. No body copy.

**Classes:**

- Section: `relative z-10 px-6 md:px-12 py-12 border-t border-line-faint`
- Inner: `max-w-3xl`
- H3: `font-serif text-2xl md:text-3xl mb-6`
- CTA: standard primary button style

**Copy:**

- H3: `Ready to diagnose your friction?`
- CTA: `Start a Diagnostic` → `/diagnostic`

### Section E — Hero image (landscape, full-width)

**Mirrors:** `/customers/figma` full-width landscape hero image between the inline CTA and the narrative.

**Layout:** Full-bleed inside `max-w-7xl`, 16:9 image.

**Data:** Comes from `hero.image`. If empty, render nothing.

**Classes:**

- Section: `relative z-10 px-6 md:px-12 py-12 md:py-16`
- Inner: `max-w-7xl mx-auto`
- Image: `w-full aspect-video object-cover`

### Section F — Challenge / Solution / Results narrative

**Mirrors:** `/customers/figma` three sequential H2 sections, each left-aligned with body copy. Results has its own H3 sub-sections per result.

**Layout:** Single-column. Each section header is a large left-aligned `<h2>`. Body is `<p>` paragraphs.

**Structure (each):**

```
## Challenge
paragraph (from summary.problem)

## Solution
paragraph (from summary.build)

## Results
### [Result headline 1]
paragraph

### [Result headline 2]
paragraph
```

**Data:**

- "Challenge" body: existing `summary.problem`
- "Solution" body: existing `summary.build`
- "Results": a new `results?: Array<{ headline: string; body: string }>` field on `CaseStudy`. If unset, fall back to a single result derived from `summary.outcome`. The Stripe Figma page has 3 results — we mirror that count when content exists, fewer otherwise.

The existing 5-phase narrative on the current detail page (`narrative.sections[]` with Challenge/Diagnosis/Solution/Results/Stewardship) is collapsed:

- Diagnosis content folds into Challenge (or merged into Solution intro — implementation can choose; spec leaves room)
- Stewardship is dropped from the detail page entirely — it's not in Stripe's pattern. (User can reintroduce later if needed.)

**Classes:**

- Section wrapper: `relative z-10 px-6 md:px-12 py-12 md:py-16`
- Inner: `max-w-3xl`
- H2: `font-serif text-3xl md:text-5xl mb-8`
- H3 (result headline): `font-serif text-xl md:text-2xl mb-4 mt-12 first:mt-0`
- Body paragraph: `text-ink text-base md:text-lg leading-relaxed mb-6`

### Section G — Pullquote

**Mirrors:** `/customers/figma` italicized large block quote with attribution.

**Layout:** Single centered block with italicized quote + author + role.

**Data:** Existing `pullquote?: { text, author, role }` field. If unset, render nothing.

**Classes:**

- Section: `relative z-10 px-6 md:px-12 py-16 md:py-24 border-t border-line-faint`
- Inner: `max-w-3xl`
- Quote: `font-serif italic text-2xl md:text-3xl lg:text-4xl leading-snug text-ink mb-8`
- Author: `text-sm uppercase tracking-[0.2em] text-ink-muted`
- Role: `text-sm text-ink-muted`

### Section H — "Read more customer stories" tiles

**Mirrors:** `/customers/figma` 2-up tile band labeled "Read more customer stories" showing two other customers.

**Layout:** 2-column grid (mobile: 1-column). Each tile: landscape image + small logo + h3 headline + "Read story" link.

**Data:** Surface the 2 case studies adjacent to the current one (using the existing prev/next nav data already on the detail page).

**Classes:**

- Section: `relative z-10 px-6 md:px-12 py-20 md:py-24 border-t border-line-faint`
- Inner: `max-w-7xl mx-auto`
- Eyebrow: `text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-8`
- Grid: `grid grid-cols-1 md:grid-cols-2 gap-px bg-line-faint`
- Tile `<Link>`: `group block bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold`
- Image: `aspect-video w-full object-cover transition-opacity duration-300 group-hover:opacity-90`
- Content: `p-6 md:p-8`
- Logo wrapper: `mb-4 text-sm uppercase tracking-[0.2em] text-ink-muted`
- H3: `font-serif text-xl md:text-2xl`
- Link: `mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold group-hover:gap-3 transition-all duration-300`

### Section I — Closing CTAs (3-panel, same as index)

**Mirrors:** Stripe's identical 3-panel closing CTA block (same as index).

**Reuse:** The same `ClosingCtaPanels` component used on the index. No detail-page-specific variant.

## Data model additions

Add the following fields to `CaseStudy` (all optional except `companySize`):

```ts
interface CaseStudy {
  // ... existing fields ...

  /** Used by the index featured-tile band; falls back to hero.image cropped. */
  portraitImage?: { src: string; alt: string; width: number; height: number }

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
}
```

All 5 existing real case studies are updated to set `companySize: 'placeholder'` (user assigns later) and leave the other new fields unset where we don't have content.

Placeholder case studies use:

- `companySize`: distributed evenly across startup/growth/enterprise (3 of each)
- `portraitImage.src`: `/case-studies/placeholder/portrait.svg`
- `hero.image.src`: `/case-studies/placeholder/landscape.svg`
- All text fields: `[Bracketed placeholder copy]`

## Components — full inventory

**Deletions (no longer used after this rewrite):**

- `apps/marketing/src/components/clients/ClientsPortraitGrid.tsx`
- `apps/marketing/src/components/clients/ClientsResultsBand.tsx`
- `apps/marketing/src/components/clients/ClientsByEngagementType.tsx`
- `apps/marketing/src/components/clients/ClientsFeaturedEngagement.tsx`
- `apps/marketing/src/components/clients/ClientsByIndustry.tsx`
- `apps/marketing/src/components/clients/ClientsWhatWeBuild.tsx`
- `apps/marketing/src/components/clients/ClientsClosingCta.tsx`
- `apps/marketing/src/components/caseStudy/CaseStudyStatsRail.tsx` + .test.tsx
- `apps/marketing/src/components/caseStudy/CaseStudyStackCard.tsx` + .test.tsx
- `apps/marketing/src/components/caseStudy/CaseStudyHeroCycler.tsx` + .test.tsx (cycler not used in new layout)

**Retained from current code:**

- `apps/marketing/src/components/clients/ClientsHero.tsx` (rewritten — same name, new internals)
- `apps/marketing/src/components/clients/ClientsLogoWall.tsx` (renamed to `ClientsLogoStrip.tsx`, restyled)
- `apps/marketing/src/components/BrandIcon.tsx` (no changes)
- `apps/marketing/src/components/caseStudy/CaseStudyHero.tsx` (rewritten — now renders the new detail-page hero shape)
- `apps/marketing/src/components/caseStudy/CaseStudySection.tsx` (rewritten — now the standard heading + body block used in Challenge/Solution/Results)
- `apps/marketing/src/data/caseStudies.ts` (extended with new fields + placeholder entries)
- `apps/marketing/src/data/clientLogos.ts` (no changes)

**New components (clients/ index page):**

- `ClientsHero.tsx` — Section 1
- `ClientsFeaturedTiles.tsx` — Section 2
- `ClientsMeasurableResults.tsx` — Section 3
- `ClientsLogoStrip.tsx` — Section 4 (renamed from `ClientsLogoWall`)
- `ClientsBySize.tsx` — Section 5
- `ClientsBuildingTogether.tsx` — Section 6
- `ClosingCtaPanels.tsx` — Section 7 (used on both index and detail page)

**New components (caseStudy/ detail page):**

- `CaseStudyDetailHero.tsx` — Section A (replaces existing `CaseStudyHero`)
- `CaseStudyProductsRow.tsx` — Section B
- `CaseStudyBigStats.tsx` — Section C
- `CaseStudyInlineCta.tsx` — Section D
- `CaseStudyHeroImage.tsx` — Section E
- `CaseStudyNarrative.tsx` — Section F (wraps the existing `CaseStudySection` for Challenge/Solution/Results)
- `CaseStudyPullquote.tsx` — Section G (already exists, restyled in-place)
- `CaseStudyReadMore.tsx` — Section H (replaces existing `CaseStudyNav`)

**New placeholder asset:**

- `apps/marketing/public/case-studies/placeholder/portrait.svg` (3:4)
- `apps/marketing/public/case-studies/placeholder/landscape.svg` (16:9)

## Routes

Both routes are restructured but the file paths stay the same:

- `apps/marketing/src/routes/clients/index.tsx` — rewritten to assemble Sections 1–7 in order
- `apps/marketing/src/routes/clients/$slug.tsx` — rewritten to assemble Sections A–I in order

The legacy `portfolioIntro` / `portfolioCta` test exports are removed; the `-clients.test.ts` test is updated to consume `clientsIntro` / `clientsCta` directly.

## Accessibility

- All interactive elements get `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold`.
- Tab buttons (Section 5, Section 6) use `role="group"` + `aria-pressed`, NOT `role="tab"`. The previous partial-ARIA pattern was rejected in the prior code review.
- Heading hierarchy: page H1 in hero (Section 1 / A), H2 for each major section, H3 for sub-content within a section. No skipped levels.
- Images use real alt text from `hero.image.alt` and `portraitImage.alt`. Placeholder images use `alt="Case study coming soon"`.

## Performance

- All non-hero images use `loading="lazy"`.
- Hero image (Section A on detail, Section 2's first tile on index) is `loading="eager"` to optimize LCP.
- No `will-change`, no animation libraries. Hover transitions use `transform` / `opacity` only (compositor-only).
- No more `setInterval`-based cycler.

## Verification matrix

After implementation, verify the following on the preview deployment:

| URL                                 | Expected                                                                                                         |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `/clients`                          | Seven sections render top-to-bottom in spec order. Left-aligned, square edges, no italic accents in the H1.      |
| `/clients/scrollr`                  | Nine sections (A-I) render top-to-bottom. Single-column body, no rail/stack-card.                                |
| `/clients/cambridge-building-group` | Nine sections; conditional sections (B Products row, C Big stats, G Pullquote) render only when data is present. |
| `/clients/courtcommand`             | Same conditional behavior.                                                                                       |
| `/clients/vm-homes`                 | Same conditional behavior.                                                                                       |
| `/clients/star-kids`                | Same conditional behavior.                                                                                       |
| `/clients/placeholder-1`            | Renders cleanly with bracketed placeholder copy and gray placeholder images.                                     |
| `/clients/nonexistent-slug`         | 404 via `notFound()`.                                                                                            |
| `/portfolio` (legacy)               | 301 → `/clients` (already in place from prior plan).                                                             |

## Out of scope

- Per-band component unit tests. Per the prior review, the 9 `clients/*` band components had no tests — the user accepted that as a follow-up PR. This spec inherits that decision; no new band-component tests will be added.
- The data validation tests in `apps/marketing/src/data/caseStudies.test.ts` are extended only to cover the new required `companySize` field.
- JSON-LD `Article` schema for detail pages — flagged in prior PR's follow-ups, still out of scope here.
- Real per-client logos — placeholder SVGs persist until user supplies real assets.
- Real metric copy, real result headlines, real `featuredStat` numbers for the 4 non-Scrollr studies — user fills these in after this rewrite ships.

## Open questions resolved during brainstorming

1. **Hero headline copy.** Option A from brainstorm: "The diagnostic-first studio behind systems that move cleaner."
2. **Featured tile count.** All 6 tiles shown; 1 placeholder fills the 6th slot.
3. **"Measurable results" stats.** Per-customer attributed numbers via new `featuredStat` field. Placeholder values where real numbers don't yet exist.
4. **Customers-by-size grouping.** Tabs are `Startup / Growth / Enterprise` driven by new `companySize` field. All 5 real studies start as `'placeholder'`; user assigns later.
5. **"Building together" deep-dive.** All 5 real case studies in a vertical-tab sidebar (Stripe's exact pattern).
6. **Placeholder honesty.** Quiet placeholders (plausible-shaped data, not loud `[BRACKETS]` everywhere — but content fields use `[bracketed]` text so they're easy to grep for during fill-in).
7. **Placeholder image.** Gray-on-gray SVGs, generated as part of the data-seeding task.

## Self-review against requirements

- ✓ Layout mirrors Stripe `/customers` and `/customers/figma` exactly (sections, alignment, type scale, tab patterns, image placement)
- ✓ StarParticles background preserved via root-level mounting + per-section `z-10`
- ✓ Theme tokens (`text-gold`, `bg-card`, etc.) used throughout — no new colors introduced
- ✓ Button styles unchanged from existing primary/secondary patterns
- ✓ Zero `rounded-*` classes — square corners enforced
- ✓ Content carries over: case study copy, metrics, stack, hero images all reused
- ✓ Placeholder strategy is explicit and reversible (real data displaces placeholders when fields are set)
- ✓ Accessibility lessons from prior PR honored (no partial-ARIA tab pattern, focus-visible everywhere, semantic heading hierarchy)
- ✓ Verification matrix mirrors the prior PR's structure for continuity
