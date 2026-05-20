# Case Study Intake Questions

Standard chronological intake used for every RelentNet case study. Questions are sequenced by the actual story arc so answers map cleanly onto the schema (`hero`, `atAGlance`, `story.problem`, `story.diagnosis`, `story.build`, `story.outcome`, `story.stewardship`) defined in `apps/marketing/src/data/caseStudies.ts`.

## Format Conventions

- Ask **one question at a time** in the chat window.
- Use **multiple choice** when the answer space is discrete (state of project, engagement type, current relationship, etc.).
- Use **short answer** when the answer needs prose (the build, the diagnosis, the outcome).
- After each answer, log a one-sentence summary so the user can correct it before continuing.
- Never fabricate metrics, quotes, dates, or technical details. Leave fields empty and track them as content debt when the answer is "I don't know" or "skip".

## Question Set

### Before contact

**Q1 — Pre-contact state (multiple choice + short-answer fallback):**
What state was the project in when you first encountered it?
- Idea only — nothing built yet
- Early prototype or proof of concept
- Working product with rough edges
- Mature product needing a rework
- Short answer

**Q2 — Founders & ambition (short answer):**
Who was behind it and what were they trying to accomplish? Include team size, background (not names unless they'll be published), funding context if relevant, and what they ultimately wanted the project to become.

### First contact

**Q3 — How the engagement started (multiple choice + short-answer fallback):**
How did the engagement start?
- They approached us
- Warm intro / referral
- We approached them
- Grew out of an existing relationship
- Short answer

### Diagnostic phase

**Q4 — The diagnostic moment (short answer):**
When you actually looked at the codebase, the product, and how people worked, what was the gap between what the team thought the problem was vs. what you discovered the real problem was? The contrast is the story.

**Q5 — Recommendation & scope shift (short answer):**
What did you recommend the project should become, and how did the scope shift from what the team originally hired for to what you actually built? What did you propose they NOT do?

### Build phase

**Q6 — The build (short answer):**
What did the build itself look like? Stack (frontend, backend, data, hosting, integrations), the 3–5 things that exist now that didn't before, and the hardest call you had to make along the way. If the project is publicly inspectable, share a link and the answer to this can be lightweight.

### Launch and after

**Q7 — Current state & outcomes (short answer):**
What's the state of the project today, and what changed for the client after launch? Honest only — numbers if you have them, qualitative if not. Examples worth citing: real user counts, milestones, paid tier launches, demos given, public reactions, what the client can now say/sell/do that they couldn't before. If it's still in beta, say so.

**Q8 — Current relationship (multiple choice + short-answer fallback):**
Where does the engagement stand today?
- Ongoing — active development partnership
- Ongoing — hosting & maintenance only
- Shipped and handed off
- Short answer

> The answer determines whether the optional `story.stewardship` section is included on the page.

### Identity facts

**Q9 — Timeline + role (short answer):**
Years of engagement and roles RelentNet held on the project. Examples: "Spring 2024–present, full-stack engineering + design + hosting", "Q1 2025, marketing site + messaging", "discovered late 2023, build began early 2024, ongoing stewardship". Populates the At-a-glance strip (`atAGlance.engagementYear`, `atAGlance.role`).

## Schema Mapping

| Question | Populates |
| --- | --- |
| Q1 | `story.problem` (opening paragraphs about the pre-existing state) |
| Q2 | `story.problem` (who the team was, what they were trying to do) |
| Q3 | `story.problem` (how the engagement started — often opens the narrative) |
| Q4 | `story.diagnosis` (the workflow-diagnostic insight) |
| Q5 | `story.diagnosis` (what was reframed, what was talked out of) |
| Q6 | `story.build` + `atAGlance.stack` |
| Q7 | `story.outcome` |
| Q8 | `story.stewardship` (included if ongoing) |
| Q9 | `atAGlance.engagementYear` + `atAGlance.role` |

## Honesty Constraints

- No invented metrics, percentages, or counts.
- No invented quotes. Quotes require real attribution and permission.
- No invented technical claims — if you don't know the stack, leave it empty rather than guess.
- When the answer is uncertain, write the narrative around what is certain and leave specifics blank. The structure must look fine without them.

## Reference Implementation

Scrollr (`slug: 'scrollr'` in `apps/marketing/src/data/caseStudies.ts`) is the first case study fully populated using this question set. Use it as a tone, length, and structure reference for subsequent studies.
