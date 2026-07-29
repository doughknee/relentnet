import { createFileRoute } from '@tanstack/react-router'

import { CtaLink } from '@/components/CtaLink'
import { Eyebrow } from '@/components/Eyebrow'
import { Reveal } from '@/components/Reveal'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/diagnostic')({
  head: () =>
    seo({
      title: 'Workflow Diagnostic | RelentNet',
      description:
        'Start with a RelentNet Workflow Diagnostic to map operational friction, identify priority opportunities, and decide what technology is worth building.',
      path: '/diagnostic',
    }),
  component: Diagnostic,
})

const romans = ['i.', 'ii.', 'iii.', 'iv.'] as const

export const diagnosticDeliverables = [
  'Workflow map',
  'Friction summary',
  'Priority list',
  'Build recommendation',
] as const

const reviewCards = [
  {
    title: 'Tools & data flow',
    description:
      'The systems already in use, and where information gets re-keyed, delayed, or lost.',
  },
  {
    title: 'Handoffs & decisions',
    description:
      'The moments work changes hands, approvals stall, or the next action goes unclear.',
  },
  {
    title: 'Operational risk',
    description:
      'Fragile processes, access concerns, and reporting gaps — before they become requirements.',
  },
] as const

export const diagnosticReviewAreas = [
  'Current tools',
  'Manual handoffs',
  'Lead intake',
  'Client communication',
  'Reporting gaps',
  'Team permissions',
] as const

const outcomes = [
  {
    title: 'Build',
    description:
      'The workflow is repeated, valuable, and underserved by generic tools. A custom system is justified.',
  },
  {
    title: 'Connect',
    description:
      'A smaller automation or integration layer removes the friction without replacing what works.',
  },
  {
    title: 'Don’t build yet',
    description:
      'Clarify the process, change a tool, or wait until the workflow is sharper. We’ll say so.',
  },
] as const

export const diagnosticFit = {
  goodFit: [
    'Owner-led businesses',
    'Teams with repeated manual admin',
    'Companies deciding whether custom software is worth building',
  ],
  notFit: [
    'Commodity brochure sites',
    'One-off landing pages',
    'Teams that want software before defining the workflow',
  ],
} as const

function Diagnostic() {
  return (
    <div className="relative overflow-x-clip">
      {/* Radial gold glow over the top of the page */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-screen pointer-events-none bg-[radial-gradient(ellipse_760px_420px_at_calc(50%+300px)_80px,rgba(203,171,69,0.07),transparent_65%)]"
      />

      {/* ── Hero + "You leave with" aside ── */}
      <section className="relative pt-[120px] pb-[90px] px-5 md:px-12">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 min-[1024px]:grid-cols-[7fr_5fr] gap-12 min-[1024px]:gap-20 items-center">
          <div>
            <Eyebrow className="animate-fade-in-up mb-8">
              The Workflow Diagnostic
            </Eyebrow>
            <h1
              className="animate-fade-in-up font-serif text-[clamp(38px,7.2vw,88px)] leading-none tracking-[-0.01em] text-balance"
              style={{ animationDelay: '80ms' }}
            >
              Map the workflow.{' '}
              <span className="italic text-gold-text">Then decide.</span>
            </h1>
            <p
              className="animate-fade-in-up mt-9 max-w-[480px] text-ink-sub text-[17px] font-light leading-[1.6]"
              style={{ animationDelay: '180ms' }}
            >
              A free first engagement for owner-led teams. We map how work
              actually moves, find the root friction, and hand you a clear
              answer: build, connect, or don't.
            </p>
            <div
              className="animate-fade-in-up mt-11 flex flex-wrap gap-3.5"
              style={{ animationDelay: '280ms' }}
            >
              <CtaLink to="/inquire" arrow>
                Request a Diagnostic
              </CtaLink>
              <CtaLink to="/process" variant="outline">
                See the process
              </CtaLink>
            </div>
          </div>

          <aside
            className="animate-fade-in-up border border-line bg-card p-7 min-[768px]:p-10"
            style={{ animationDelay: '380ms' }}
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-ink-faint mb-7">
              You leave with
            </p>
            <div className="flex flex-col">
              {diagnosticDeliverables.map((label, i) => (
                <div
                  key={label}
                  className="flex items-baseline gap-[18px] border-b border-line-faint py-4"
                >
                  <span className="font-serif italic text-[15px] text-gold-text">
                    {romans[i]}
                  </span>
                  <span className="font-serif text-[22px] text-ink-em">
                    {label}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs text-ink-muted leading-[1.6]">
              Free, fixed scope — and you keep everything we map.
            </p>
          </aside>
        </div>
      </section>

      {/* ── Why start here ── */}
      <section>
        <div className="max-w-[1200px] mx-auto px-5 md:px-12 py-25 grid grid-cols-1 min-[1024px]:grid-cols-[4fr_8fr] gap-12 min-[1024px]:gap-18 items-start">
          <div>
            <Reveal>
              <Eyebrow className="mb-5">Why start here</Eyebrow>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="font-serif text-[clamp(28px,4vw,50px)] leading-[1.05]">
                Features lie.{' '}
                <span className="text-ghost">Workflows don't.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={200}>
            <p className="text-ink-sub text-lg font-light leading-[1.7]">
              Most software conversations start with a feature list. We start
              with the business motion: what triggers work, who owns each step,
              where information moves, and where the team loses visibility.
              That's how the build gets protected from the wrong assumptions.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── What we review ── */}
      <section>
        <div className="max-w-[1200px] mx-auto px-5 md:px-12 py-25">
          <Reveal>
            <Eyebrow className="mb-16">What we review</Eyebrow>
          </Reveal>
          <div className="grid grid-cols-1 min-[768px]:grid-cols-3 gap-px p-0.5 bg-line">
            {reviewCards.map((card, i) => (
              <Reveal
                key={card.title}
                delay={i * 150}
                className="bg-page pt-11 px-7 min-[768px]:px-10 pb-12"
              >
                <span className="font-serif italic text-xl text-gold-text">
                  {romans[i]}
                </span>
                <h3 className="font-serif text-[34px] mt-[18px] mb-3.5">
                  {card.title}
                </h3>
                <p className="text-[15px] font-light leading-[1.65] text-ink-sub">
                  {card.description}
                </p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={400}>
            <div className="mt-7 flex flex-wrap gap-2.5">
              {diagnosticReviewAreas.map((area) => (
                <span
                  key={area}
                  className="border border-line-faint px-4 py-[9px] text-xs tracking-[0.06em] text-ink-muted"
                >
                  {area}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Three outcomes ── */}
      <section>
        <div className="max-w-[1200px] mx-auto px-5 md:px-12 py-25">
          <div className="max-w-[700px] mb-16">
            <Reveal>
              <Eyebrow className="mb-5">The answer</Eyebrow>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="font-serif text-[clamp(28px,4vw,50px)] leading-[1.05] text-balance">
                Three honest outcomes.{' '}
                <span className="italic text-gold-text">
                  One of them is "don't build."
                </span>
              </h2>
            </Reveal>
          </div>
          <div className="grid grid-cols-1 min-[768px]:grid-cols-3 gap-10 min-[768px]:gap-14">
            {outcomes.map((o, i) => (
              <Reveal
                key={o.title}
                delay={100 + i * 150}
                className="border-t-2 border-gold pt-6"
              >
                <h3 className="font-serif text-[32px] mb-3">{o.title}</h3>
                <p className="text-sm font-light leading-[1.65] text-ink-sub">
                  {o.description}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Fit panels ── */}
      <section>
        <div className="max-w-[1200px] mx-auto px-5 md:px-12 py-[90px] grid grid-cols-1 min-[768px]:grid-cols-2 gap-12 min-[768px]:gap-20">
          <div>
            <Reveal>
              <h3 className="font-serif text-[34px] text-gold-text mb-7">
                A good fit if
              </h3>
            </Reveal>
            <div className="flex flex-col">
              {diagnosticFit.goodFit.map((item) => (
                <Reveal key={item} delay={100}>
                  <p className="border-b border-line-faint py-4 text-[15px] font-light text-ink-sub">
                    {item}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
          <div>
            <Reveal>
              <h3 className="font-serif text-[34px] text-ink-faint mb-7">
                Not the right fit for
              </h3>
            </Reveal>
            <div className="flex flex-col">
              {diagnosticFit.notFit.map((item) => (
                <Reveal key={item} delay={100}>
                  <p className="border-b border-line-faint py-4 text-[15px] font-light text-ink-muted">
                    {item}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <section className="relative">
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_700px_500px_at_50%_100%,rgba(203,171,69,0.08),transparent_70%)]"
        />
        <div className="max-w-[1200px] mx-auto px-5 md:px-12 py-30 text-center relative">
          <Reveal>
            <h2 className="font-serif text-[clamp(32px,5.6vw,68px)] leading-[1.05] text-balance">
              If the workflow is unclear,{' '}
              <span className="italic text-gold-text">
                the system will be too.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <div className="mt-11 flex justify-center">
              <CtaLink to="/inquire" arrow>
                Request a Workflow Diagnostic
              </CtaLink>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
