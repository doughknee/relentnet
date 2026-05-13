# Workflow Diagnostic Design

## Goal

Shift RelentNet's public buying path from "hire us for custom software" to "start with a workflow diagnostic." Custom software remains the endgame when it is the right answer, but the site should lead with diagnosis, operational clarity, and trust before prescribing a build.

## Strategic Position

RelentNet should be framed as a technology partner that helps owner-led businesses understand and fix operational friction. The diagnostic is the first concrete offer: a structured engagement that maps how the business works, identifies bottlenecks, and clarifies whether custom software, automation, stewardship, or a simpler operational change is the right next move.

This makes RelentNet easier to buy from because prospects do not need to know what software they need before starting. They only need to know where the business feels slow, manual, disconnected, or hard to see.

## Scope

Create a new `/diagnostic` route and update site-wide copy so the diagnostic becomes the primary first step.

Update these areas:

- Homepage CTAs and selected copy to point toward workflow diagnosis before custom software.
- Header and footer navigation to expose the diagnostic path without overcrowding navigation.
- Process page copy to make the diagnostic the first engagement stage, not a competing methodology.
- Work page copy to describe case studies as examples of diagnosed friction becoming useful systems.
- Inquiry page copy and CTA language to request a diagnostic rather than a generic consultation.
- Portal page prospect CTA to point to the diagnostic path.
- Global metadata and route metadata to emphasize workflow diagnosis and operational clarity.
- Tests for the new page and updated content exports.

Do not remove the existing Work or Process pages. Do not turn the diagnostic into a generic quiz, pricing table, blog post, or CMS-backed feature in this pass.

## Page Roles

### Homepage

The homepage should introduce the larger RelentNet promise, then make the diagnostic the main next step. The copy should still mention custom systems, but as an outcome of understanding the workflow first.

Primary CTA: `Start With a Workflow Diagnostic`.

Secondary CTA: `See Problems We Solve`.

### Diagnostic Page

The diagnostic page is the first-offer page. It should answer:

- What is a Workflow Diagnostic?
- What kinds of operational friction does it uncover?
- What does RelentNet review?
- What does the client receive?
- Who is it for and not for?
- What can happen after the diagnostic?

Suggested structure:

1. Hero: `Map the workflow before building the system.`
2. Problem: many businesses feel operational drag but do not know what software should solve.
3. What We Review: intake, handoffs, current tools, reporting, follow-up, admin work, client communication.
4. What You Receive: workflow map, friction summary, priority opportunities, recommendation for build/stewardship/no-build.
5. Good Fit / Not Fit: serious owner-led businesses with real operational pain; not commodity brochure sites or vague ideas without business context.
6. Possible Next Steps: custom operating system, focused automation, stewardship, or no-build recommendation.
7. CTA: `Request a Workflow Diagnostic`.

### Process Page

The Process page should remain the broader methodology. It should show that the diagnostic feeds the full engagement model:

- Diagnose first.
- Design only after the operational problem is clear.
- Build only when there is a useful system to create.
- Steward after launch.

The Process page should not duplicate every detail from `/diagnostic`; it should link to the diagnostic as the practical first step.

### Work Page

The Work page should frame case studies as proof of the diagnostic mindset. Replace any remaining implication of "look what we built" with "look what was clarified, built, and improved."

Case studies should keep their problem, diagnosis, build, and outcome structure. Add or adjust intro copy to make diagnosis the connective tissue.

### Inquiry Page

The Inquiry page should become the form endpoint for diagnostic requests. It can still support custom-build and stewardship options, but the page should make clear that RelentNet starts by understanding the workflow.

Primary language should be `Request a Workflow Diagnostic`, not `Request Consultation`.

## Navigation

Recommended desktop navigation:

- `Diagnostic`
- `Process`
- `Work`
- `Portal`

The right-side CTA should link to `/diagnostic` and read `Start Diagnostic`. The diagnostic page then sends qualified prospects to `/inquire`.

Mobile navigation should include the same path names.

## Content Rules

Use this language more often:

- workflow diagnostic
- operational friction
- workflow map
- disconnected tools
- manual handoffs
- reporting gaps
- priority opportunities
- build recommendation
- stewardship

Use this language more carefully:

- custom software systems
- custom operating systems
- automation
- portals and dashboards

Avoid making custom software sound like the thing RelentNet sells first. The site should imply: RelentNet sells clarity, then builds the right technology when clarity reveals the need.

## Data And Components

Add exported content objects for the diagnostic page so route tests can verify core positioning without rendering the full page.

Suggested exports:

- `diagnosticHero`
- `diagnosticReviewAreas`
- `diagnosticDeliverables`
- `diagnosticFit`
- `diagnosticNextSteps`

Reuse existing visual patterns from the homepage, process page, and work page. Do not introduce a new design system.

## Testing

Add tests for:

- New diagnostic content exports include diagnostic-first positioning.
- Homepage primary CTA points to the diagnostic path.
- Inquiry content frames submission as a diagnostic request.
- Header exposes the diagnostic path.
- Work/process content continues to include diagnosis and stewardship language.

Run targeted tests, `npm run check`, `npm run typecheck`, and `npm run build` before completion.

## Non-Goals

- No pricing table.
- No payment flow for paid diagnostics.
- No backend changes to the n8n webhook.
- No analytics instrumentation unless added in a separate pass.
- No region landing pages.
- No blog or CMS.

## Acceptance Criteria

- A new `/diagnostic` page clearly explains the first engagement.
- The site-wide buying path leads with workflow diagnosis, not immediate custom software quoting.
- Existing Work and Process pages still make sense and do not compete with the diagnostic page.
- Inquiry remains the conversion endpoint, but the request is framed around diagnostic fit.
- Tests, typecheck, and build pass.
