# Handoff: RelentNet Proposal System ("Proposal Studio")

## Overview

A proposal delivery system for RelentNet at **ap.relentnet.com**. Instead of emailing a Stripe quote PDF, the admin uploads it to an internal tool, personalizes a branded page, and sends the prospect a unique link. The client-facing page sells the engagement (personal note, scope, process, selected work) and lets the prospect **accept or decline the quote with feedback** — no payment happens on the page. An admin dashboard tracks every proposal's status and captures decline feedback.

Three surfaces:

1. **Proposal Page** (client-facing, public unlisted link, e.g. `ap.relentnet.com/p/amelia-island-beach-condos-shx6jt2b`)
2. **Proposal Generator** (internal: upload PDF → personalize → get link)
3. **Proposal Dashboard** (internal: list of proposals, statuses, decline feedback)

## About the Design Files

The `.dc.html` files in this bundle are **design references created in HTML** — interactive prototypes showing intended look and behavior, not production code. The task is to **recreate them in the RelentNet monorepo's existing environment**: a new workspace (e.g. `apps/proposals`) built with **React 19, Vite 7, TanStack Router, TanStack Form, Tailwind CSS 4, TypeScript**, deployed via the root `compose.yaml` on Coolify with domain `ap.relentnet.com` — mirroring `apps/marketing`.

The design deliberately reuses the marketing site's design system (`apps/marketing/src/styles.css` tokens, `components/ui/Button.tsx`, `Input.tsx`, `Header.tsx`, `Footer.tsx`, `StarParticles.tsx`). Reuse those components/tokens directly — consider promoting shared ones into `packages/`.

## Fidelity

**High-fidelity.** Colors, type, spacing, and copy are final and match the existing brand. Recreate pixel-perfectly using the codebase's Tailwind theme tokens (listed below) rather than raw hex values.

## What the prototype fakes (real implementation needed)

- **PDF parsing**: prototype simulates extraction. Real: parse the Stripe quote PDF server-side (or use Stripe API — quotes are `quote` objects; prefer fetching line items/amounts/customer from Stripe by quote ID over PDF scraping) to prefill client name, email, project, line items, totals, quote number, expiration.
- **Storage**: proposals, statuses, and feedback need a database (any small store works; the repo has no backend yet — a minimal API service in the compose stack is needed).
- **Unique links**: tokenized slug per proposal (`/p/<slug>-<token>`), unlisted, noindex.
- **Status tracking**: `sent → viewed` (first page load) `→ accepted | declined`. Declines require feedback text.
- **Notifications**: email/notify Daniel on view, accept, and decline.
- **Auth**: the generator + dashboard are internal-only; gate behind auth (even basic) — the marketing repo currently has none.

---

## Screens

### 1. Proposal Page (`Proposal Page.dc.html`) — client-facing

Full-page, dark theme only (`#050505` page background). Rising star-particle background across the whole page (reuse `StarParticles.tsx` — tsparticles slim, 120 particles, colors `#ffffff`/`#1a1a1a`/`#E1BE4C`, upward drift, twinkle opacity 0.1–0.8, parallax on hover). All content sections `position: relative; z-index: 10` above it.

**Header** (fixed, full width, `padding: 32px`, `bg rgba(5,5,5,0.2)` + `backdrop-blur`, flex space-between):

- Logo: `RELENTNET` — serif, 20px, `tracking 0.2em`, uppercase; "Relent" bold gold `#e1be4c`, "Net" default ink. Links to `https://relentnet.com`.
- **No site nav links** (deliberately removed — this is a focused page).
- Right: outline button "Respond to Proposal" → anchors to `#scope`. 12px, uppercase, `tracking 0.1em`, `border rgba(255,255,255,0.1)`, `padding 12px 24px`; hover: gold bg, black text.

**Hero** (min-h-screen, centered column, text-center):

- Eyebrow: `PROPOSAL · PREPARED FOR {clientName}` — 11px bold, `tracking 0.3em`, uppercase, gold.
- H1: `{projectName}` + italic gold span `deserves a front door.` — serif 400, `clamp(48px, 8vw, 96px)`, line-height 1.02, max-width 1100px.
- Body: 18px, `#a3a3a3`, weight 300, line-height 1.7, max-width 620px.
- CTAs (flex gap 16px): gold filled "Review the Quote →" (→ `#scope`) + outline "See Our Work" (→ `#work`). Both `padding 16px 28px`, 14px uppercase `tracking 0.1em`. Gold button hover: transparent bg, gold text. Entrance: staggered fadeInUp (30px rise, 1s, cubic-bezier(0.2,0.8,0.2,1), delays 0/200/350/500ms).
- Meta line: `Quote {quoteNumber} · Valid until {validUntil}` — 11px uppercase `#737373`.
- Scroll indicator bottom-center: "SCROLL" 10px gold + 1px×48px gold-to-transparent gradient line, pulsing.

**Personal note band** (`bg rgba(5,5,5,0.2)` + blur, `border-y rgba(255,255,255,0.1)`, centered, max-width 880px, `padding 100px 24px`):

- Eyebrow "A NOTE FROM DANIEL" (gold, 12px bold, `tracking 0.3em`).
- Note in serif quotes, `clamp(22px, 3vw, 32px)`, line-height 1.45.
- Signature: "Daniel Velez" serif 20px white; below: `RELENTNET · WINTER GARDEN, FL · +1 858-859-1851` 11px uppercase `#737373`.

**Scope & Investment** (`#scope`, max-width 1152px, `padding 128px 24px`):

- Watermark "01" serif `clamp(80px,10vw,160px)` at `rgba(255,255,255,0.03)`, margin-bottom −48px (overlaps heading intentionally).
- Grid `3fr / 9fr`, gap 64px. Left column: gold eyebrow "THE ENGAGEMENT", serif h2 "Scope & Investment", 13px muted body, then quote meta (11px uppercase `#525252`): quote number, valid until, prepared for.
- Right column, stacked bordered cards (`border rgba(255,255,255,0.05)`, `bg rgba(255,255,255,0.03)`, `padding 36px 40px`, borders collapse between rows):
  - Line item rows: serif 24px white title + 14px `#a3a3a3` description (left), right-aligned serif 30px price + 10px uppercase cadence ("ONE-TIME" / "PER MONTH"). Content from the Stripe quote verbatim.
  - **PDF row** (`bg rgba(0,0,0,0.2)`, `padding 20px 40px`): left label `OFFICIAL QUOTE · {quoteNumber}.PDF`; right buttons "View Quote PDF" (toggles inline `<object type="application/pdf">` embed, 640px tall, `bg #0a0a0a`, with fallback link) and "Download ↓" (opens PDF in new tab).
  - **Decision bar** — four mutually exclusive states:
    1. **Pending** (default): gold-tinted bar (`border rgba(225,190,76,0.3)`, `bg rgba(225,190,76,0.06)`, `padding 28px 40px`). Left: "UPFRONT TOTAL" serif 28px gold `$6,300` + "THEN" serif 28px `$300/mo`. Right: outline "Decline" button + gold filled "Accept Quote →".
    2. **Declining**: replaces bar with feedback form — serif 20px "Not quite right?", 13px explainer ("goes straight to Daniel"), textarea (placeholder "What would need to change for this to work?", `bg rgba(0,0,0,0.2)`, gold focus border), right-aligned "Back" (text) + "Send Feedback & Decline" (outline, gold hover).
    3. **Accepted**: gold-bordered confirmation (`border rgba(225,190,76,0.5)`, `bg rgba(225,190,76,0.08)`, centered): serif 26px gold "Quote accepted — welcome aboard, {firstName}." + 13px "Daniel will reach out within one business day with the invoice and discovery scheduling. Nothing is charged today."
    4. **Declined**: neutral confirmation: serif 24px "Feedback sent — thank you." + follow-up copy ("an updated quote will land at this same link").

**How We Work band** (same surface treatment as note band, max-width 1152px, `padding 112px 24px`):

- Centered gold eyebrow "HOW WE WORK" + serif `clamp(26px,3.5vw,40px)` statement, second line at `rgba(255,255,255,0.3)`.
- 5-column grid (gap 32px), one per phase (Diagnose / Prioritize / Design / Build / Steward — from `apps/marketing/src/routes/process.tsx`). Each: `border-top rgba(255,255,255,0.1)` + `padding-top 24px`, watermark number serif 56px `rgba(255,255,255,0.05)`, gold 10px label, serif 19px title, 13px `#737373` blurb (blurbs rewritten to the prospect's domain — see prototype).
- Centered link "See the full process →" (12px uppercase gold, hairline gold underline) → relentnet.com/process.

**Selected Work** (`#work`, max-width 1152px, `padding 128px 24px`):

- Eyebrow "SELECTED WORK" + serif `clamp(28px,4vw,48px)` headline "Built for owners who _stake their name_ on the result." (italic span gold).
- 3-card grid (gap 32px). Card: `border rgba(255,255,255,0.05)` (hover `rgba(225,190,76,0.4)`), image 16:10 object-cover top, body `padding 28px`: 10px uppercase industry, serif 24px name, 13px blurb, gold 11px uppercase stat. Cards link to relentnet.com case studies. Order matters: **VM Homes first** (closest comp to the prospect), then Cambridge Building Group, Scrollr. Choose per-prospect in the real build.
- Images: `assets/vm-homes-hero.webp`, `assets/cambridge-hero.webp`, `assets/scrollr-hero.webp` (from `apps/marketing/public/case-studies/`).

**Closing CTA** (`padding 128px 24px`, centered): muted eyebrow "THE NEXT STEP", serif `clamp(36px,6vw,72px)` "Ready when you are, _{firstName}._", 15px body, gold "Respond to the Quote →" (→ `#scope`), meta "VALID UNTIL {date} · ACCEPT OR DECLINE IN ONE CLICK".

**Footer** (same as marketing `Footer.tsx`): `padding 48px 32px`, surface bg + blur, top border, space-between, 10px uppercase `#737373`. Left: © RelentNet {year} / TN • LA • GA • FL. Right links: Diagnostic, Client Portal, Legal → relentnet.com.

### 2. Proposal Generator (`Proposal Generator.dc.html`) — internal

**Header** (sticky, `padding 20px 32px`, `bg rgba(23,23,23,0.8)` blur, bottom border): logo + "PROPOSAL STUDIO" wordmark; right: nav "New Proposal" (active gold) / "Dashboard", plus badge `AP.RELENTNET.COM · INTERNAL` (10px uppercase, bordered).

**Main**: max-width 1400px, grid `5fr / 4fr`, gap 48px.

Left column — numbered steps (each: watermark serif 22px number + gold 11px uppercase step title):

1. **Stripe Quote**: dashed dropzone (`border dashed rgba(255,255,255,0.2)`, `padding 56px 32px`, centered; hover gold-tinted). Contains ↑ icon in 48px bordered square, "Drop the Stripe quote PDF here", sub "or click to browse · we extract the client & line items". After parse → replaced by gold-tinted confirmation card (✓ icon, filename, `{quoteNo} · parsed N line items · valid until {date}`, "Replace" button) + 2-col grid of extracted line-item mini-cards (13px name, serif 20px gold price + cadence).
2. **Client & Project**: 2×2 grid of labeled fields (labels 10px uppercase `#737373`; inputs `bg rgba(0,0,0,0.2)`, `border rgba(255,255,255,0.1)`, `padding 12px`, 14px, gold focus border — matches marketing `Input.tsx`): Client Name, Email, Project Name, Phase select (Proposal — new client / Kickoff — signed, starting / Invoice — active engagement).
3. **Personalize**: textarea for the personal note (label: "A note from you — shown in your voice, in serif") + section toggle chips (Personal note / Scope & investment / Our process / Selected work). Chip: 10px uppercase `padding 10px 16px`; ON = gold-tinted (`bg rgba(225,190,76,0.1)`, gold border/text), OFF = neutral.
4. **Send**: URL bar card (monospace 13px generated link `ap.relentnet.com/p/{slug}-{token}` + "Copy Link" outline button with "Copied ✓" state, 1.6s revert + gold "Open Page →"). Footnote: link is unique & unlisted; client accepts or declines with feedback; responses land in the dashboard.

Right column — **sticky live preview** (top 96px): label "LIVE PREVIEW — WHAT {FIRSTNAME} SEES"; browser-chrome card (3 dots + monospace URL) containing a miniature hero (eyebrow, serif headline with italic gold span, gold "Review the Quote →" chip, subtle gold radial glow), note preview block (truncated at 160 chars, serif italic), and totals strip (UPFRONT / RECURRING serif values — em-dash until parsed — + "N of 4 sections"). All fields update live as the form changes.

### 3. Proposal Dashboard (`Proposal Dashboard.dc.html`) — internal

Same header as generator ("Dashboard" active).

- **Title row**: serif 34px "Proposal _Dashboard_" + sub "Every quote you've sent — who's viewed, who's accepted, and what the no's said." Right: dashed "↑ DROP A QUOTE PDF · NEW PROPOSAL" shortcut → generator.
- **Stats**: 5 equal cards (`border rgba(255,255,255,0.05)`, `bg rgba(255,255,255,0.03)`, `padding 20px 24px`): label 10px uppercase + serif 30px value. Proposals sent (white) / Awaiting response / Accepted (gold) / Declined (`#737373`) / Accepted value (gold).
- **Table**: bordered container; header row 10px uppercase `#525252`, grid `2.4fr 1.6fr 1fr 1fr 1.1fr 0.9fr` (Client/Project, Quote, Upfront, Sent, Status, Actions). Rows `padding 20px 28px`, hairline dividers, subtle hover. Client 14px white + project 12px muted; quote number monospace 12px; amount serif 17px; status pill (10px uppercase, `padding 6px 12px`, bordered): **Accepted** gold-tinted, **Declined** neutral gray, **Viewed** faint, **Sent** ghost. Actions: "Feedback" toggle (only on declined; gold-tinted when open) + "Page →" link to the proposal page.
- **Feedback drawer** (expands under a declined row, `bg rgba(0,0,0,0.25)`): label "THEIR FEEDBACK" + serif italic 16px quote + 11px uppercase meta (declined date, revised-quote note).
- Footnote explaining the status lifecycle.

## Interactions & Behavior

- All transitions ~300ms ease; gold buttons invert on hover (gold bg → transparent bg + gold text); outline buttons go gold-border/gold-text.
- Proposal page decision state machine: `pending → declining → declined` (Back returns to pending) / `pending → accepted`. Persist the response server-side; on revisit show the confirmation state, not the buttons.
- PDF viewer toggles inline; keep a Download fallback (mobile browsers often can't inline PDFs).
- fadeInUp entrance animation on hero elements only; respect `prefers-reduced-motion` (marketing styles.css already has a global reduce rule — reuse).
- Generator: dropzone accepts drop + click-to-browse; parsing prefills step 2 fields (editable after); preview updates live; Copy Link uses clipboard API with "Copied ✓" confirmation.
- Dashboard: one feedback drawer open at a time.

## State Management

- **Proposal record**: `{ id, slug, token, clientName, clientEmail, projectName, phase, note, sections: {note, scope, process, work}, quoteNumber, validUntil, lineItems[], upfrontTotal, recurringTotal, pdfUrl, status: 'sent'|'viewed'|'accepted'|'declined', feedback?, respondedAt?, sentAt }`.
- Page view → mark `viewed` once. Accept/decline → immutable response + notification.

## Design Tokens (dark theme — from `apps/marketing/src/styles.css`)

- Page `#050505`; surface `rgba(5,5,5,0.2)`; card `rgba(255,255,255,0.03)`; chrome `rgba(23,23,23,0.8)`; inset `rgba(0,0,0,0.2)`.
- Ink `#e5e5e5`; sub `#a3a3a3`; muted `#737373`; faint `#525252`; em `#ffffff`.
- Lines `rgba(255,255,255,0.1)` / faint `rgba(255,255,255,0.05)`.
- Accent gold `#e1be4c` (use existing `--color-gold`).
- Type: `font-serif` (Tailwind default ui-serif/Georgia stack) for headlines/display numbers; `font-sans` (system stack) for everything else; `ui-monospace` for URLs/quote numbers. Label style: 10–12px, bold, uppercase, `tracking 0.15em–0.3em`.
- No border radius anywhere (brand is square-cornered). No shadows — hairline borders only.

## Assets (in `assets/`)

- `vm-homes-hero.webp`, `cambridge-hero.webp`, `scrollr-hero.webp` — copied from `apps/marketing/public/case-studies/`; reference the originals in the real build.
- `sample-quote.pdf` — the sample Stripe quote (Will Colley / Amelia Island Beach Condos, QT-SHX6JT2B: $6,000 build + $300/mo hosting, valid until Aug 27 2026) used as embedded-PDF sample data.
- `relentnet-logo.png` — from `apps/marketing/public/`.

## Files

- `Proposal Page.dc.html` — client-facing proposal page (all states interactive).
- `Proposal Generator.dc.html` — internal composer.
- `Proposal Dashboard.dc.html` — internal tracking dashboard.

Open each in a browser to click through the real interactions (accept/decline flow, PDF toggle, dropzone simulation, feedback drawers).
