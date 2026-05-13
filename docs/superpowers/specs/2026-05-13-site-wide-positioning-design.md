# Site-Wide Positioning Pass Design

## Goal

Align the full marketing site with RelentNet's updated positioning: a white-glove technology partner that diagnoses workflow friction, builds custom software systems, and stewards those systems long-term for owner-led businesses.

The homepage and Work page already carry this direction. This pass updates the supporting routes and global content so serious prospects encounter one clear offer across the site.

## Scope

Update these areas:

- Global metadata in `site.config.ts` and root structured data.
- Header and footer navigation labels where clarity improves conversion.
- `/process` copy so it reflects workflow discovery, diagnosis, software design, implementation, and stewardship.
- `/inquire` copy and form labels so inquiry data maps to operational pain, current tools, urgency, and preferred next step.
- `/portal` copy so active clients understand the login path and prospects are redirected to inquiry.
- Tests covering exported content and route-level positioning markers.

Do not redesign the homepage or Work page structure in this pass. Do not add new routes, CMS behavior, backend changes, or form delivery changes.

## Content Direction

Use clear premium language rather than vague luxury language. The tone should feel selective and high-trust, but each page should answer a practical buyer question:

- What operational problem does RelentNet solve?
- How does the engagement work?
- What kind of business is a fit?
- What happens after I inquire?
- Where do active clients log in?

Avoid phrases that make the offer sound like generic web design only. Keep terms like custom software systems, workflow discovery, operating friction, stewardship, owner-led businesses, portals, dashboards, automations, reporting, and internal tools.

## Page Design

### Global Navigation

Rename unclear labels to reduce cognitive load while preserving the premium feel:

- `The Discipline` becomes `Process`.
- `The Work` can remain if paired with clearer page copy.
- `Inquire` can remain, but CTAs inside pages should be more specific, such as `Map My Workflow`.

### Process Page

Reframe the page from abstract craft language to a practical engagement model:

- Discover: understand intake, sales, fulfillment, reporting, and communication.
- Diagnose: identify bottlenecks, duplicated effort, fragile handoffs, and missed follow-ups.
- Design: map workflows, data, interfaces, and implementation priorities.
- Build: create the system with clean engineering and focused user experience.
- Steward: host, monitor, maintain, support, and improve the system after launch.

The existing timeline structure can remain. Copy should become more concrete and aligned with homepage language.

### Inquiry Page

Reposition the page around workflow mapping and fit evaluation. The form should collect:

- Contact and company basics.
- Current tools or systems causing friction.
- Operational bottleneck or workflow pain.
- Type of help needed: discovery, custom system, stewardship, or not sure.
- Timeline or urgency.
- Preferred communication path.

Keep error and success states. The success message should set a realistic expectation that RelentNet will review the workflow context and respond with next steps.

### Portal Page

Clarify that the login is for active clients only. Add a short prospect CTA back to inquiry so visitors who land there accidentally are not stranded.

## Testing

Add focused tests for content exports or route data where practical. Tests should verify:

- Global metadata uses the updated custom software/workflow stewardship positioning.
- Process content includes discovery, diagnosis, design/build, and stewardship language.
- Inquiry content asks about workflow pain/current tools and includes a clear success expectation.
- Portal content distinguishes active clients from prospects.

## Non-Goals

- No new backend endpoint or form integration change.
- No visual redesign beyond copy and minor navigation/CTA label adjustments.
- No `/portfolio` to `/work` route rename in this pass.
- No removal of existing components unless they become clearly unused after the pass.

## Acceptance Criteria

- The full public journey no longer mixes the old "digital legacy / bespoke creation" positioning with the new workflow/software stewardship offer.
- A serious owner-led business can understand the offer, process, fit, and next step without decoding brand language.
- Existing tests pass, new positioning tests pass, typecheck passes, and production build succeeds.
