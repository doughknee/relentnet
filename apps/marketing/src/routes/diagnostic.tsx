import { createFileRoute } from '@tanstack/react-router'

import { ClientProofBand } from '@/components/ClientProofBand'
import { ClosingCta } from '@/components/ClosingCta'
import { CtaLink } from '@/components/CtaLink'
import { EngagementTerms } from '@/components/EngagementTerms'
import { Eyebrow } from '@/components/Eyebrow'
import { FitLists } from '@/components/FitLists'
import { GuaranteeBand, GuaranteeChip } from '@/components/GuaranteeBand'
import { PriceExamples } from '@/components/PriceExamples'
import { Reveal } from '@/components/Reveal'
import {
  SectionHead,
  leadClass,
  sectionInner,
  surfaces,
} from '@/components/SectionHead'
import { seo } from '@/lib/seo'
import { siteConfig } from '@/site.config'

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
      'Fragile processes, access concerns, and reporting gaps, caught before they become requirements.',
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

/** A sentence from Jason Hall's Cambridge letter, verbatim. The proof band
 *  checks the letter still contains it. */
export const diagnosticProofQuote =
  'Our initial request was, at best, vague regarding our ultimate expectations for functionality.'

function Diagnostic() {
  const { price, guarantee } = siteConfig.pricing.diagnostic
  const hasExamples = siteConfig.pricing.examples.length > 0
  const proofTicks = [
    `${price}, fixed scope`,
    'Credited to the build within 60 days',
    ...(guarantee ? [guarantee.window] : []),
  ]

  return (
    <div className="relative overflow-x-clip">
      {/* Radial gold glow over the top of the page */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-screen pointer-events-none bg-[radial-gradient(ellipse_760px_420px_at_calc(50%+300px)_80px,rgba(203,171,69,0.07),transparent_65%)]"
      />

      {/* ── Hero + "You leave with" aside ── */}
      <section className="relative pt-[112px] pb-[72px] md:pb-[104px] px-5 md:px-12 xl:px-20">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 min-[1024px]:grid-cols-[minmax(0,1fr)_460px] gap-12 min-[1024px]:gap-20 items-center">
          <div>
            <Eyebrow className="animate-fade-in-up mb-8">
              The Workflow Diagnostic
            </Eyebrow>
            <h1
              className="animate-fade-in-up font-serif text-[clamp(40px,7vw,84px)] leading-[1.03] tracking-[-0.01em] text-balance"
              style={{ animationDelay: '80ms' }}
            >
              Map the workflow.{' '}
              <span className="italic text-gold-text">Then decide.</span>
            </h1>
            <p
              className={`animate-fade-in-up mt-8 ${leadClass}`}
              style={{ animationDelay: '180ms' }}
            >
              A {price} first engagement for owner-led teams, credited toward
              the build if you sign within 60 days. We map how work actually
              moves, find the root friction, and hand you a clear answer: build,
              connect, or don't.
            </p>
            <div
              className="animate-fade-in-up mt-10 flex flex-wrap gap-3.5"
              style={{ animationDelay: '280ms' }}
            >
              <CtaLink to="/inquire" arrow>
                Request a Diagnostic
              </CtaLink>
              <CtaLink to="/process" variant="outline">
                See the process
              </CtaLink>
            </div>
            <ul
              className="animate-fade-in-up mt-8 flex flex-wrap gap-x-7 gap-y-2"
              style={{ animationDelay: '340ms' }}
            >
              {proofTicks.map((tick) => (
                <li
                  key={tick}
                  className="flex items-center gap-2.5 text-base text-ink-sub"
                >
                  <span
                    aria-hidden="true"
                    className="size-1.5 shrink-0 bg-gold"
                  />
                  {tick}
                </li>
              ))}
            </ul>
          </div>

          <aside
            className="animate-fade-in-up border border-line bg-card p-7 min-[768px]:p-10"
            style={{ animationDelay: '380ms' }}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-ink-muted mb-5">
              You leave with
            </p>
            <div className="flex flex-col">
              {diagnosticDeliverables.map((label, i) => (
                <div
                  key={label}
                  className="flex items-baseline gap-[18px] border-b border-line py-4"
                >
                  <span className="w-7 font-serif italic text-[17px] text-gold-text">
                    {romans[i]}
                  </span>
                  <span className="font-serif text-[26px] leading-[30px] text-ink-em">
                    {label}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-base leading-6 text-ink-muted">
              Fixed price, fixed scope, and you keep everything we map.
            </p>
            <GuaranteeChip />
          </aside>
        </div>
      </section>

      <GuaranteeBand />

      <ClientProofBand
        surface="card"
        eyebrow="In a client's words"
        quote={diagnosticProofQuote}
        support="Vague is a normal place to start. The Diagnostic turns it into a map before anyone writes code."
      />

      {/* ── Why start here + what we review ── */}
      <section className={surfaces.page}>
        <div className={`${sectionInner} flex flex-col gap-14`}>
          <SectionHead
            eyebrow="Why start here"
            lead="Most software conversations start with a feature list. We start with the business motion: what triggers work, who owns each step, where information moves, and where the team loses visibility. That's how the build gets protected from the wrong assumptions."
          >
            Features lie.{' '}
            <span className="italic text-ink-muted">Workflows don't.</span>
          </SectionHead>
          <div>
            <Reveal>
              <Eyebrow className="mb-8">What we review</Eyebrow>
            </Reveal>
            <div className="grid grid-cols-1 min-[768px]:grid-cols-3 gap-4">
              {reviewCards.map((card, i) => (
                <Reveal
                  key={card.title}
                  delay={i * 120}
                  className="border border-line bg-card pt-10 px-7 min-[1024px]:px-9 pb-11 flex flex-col gap-3.5"
                >
                  <span className="font-serif italic text-[26px] leading-[30px] text-gold-text">
                    {romans[i]}
                  </span>
                  <h3 className="font-serif text-[26px] leading-8 text-ink-em">
                    {card.title}
                  </h3>
                  <p className="text-base leading-6 text-ink-sub">
                    {card.description}
                  </p>
                </Reveal>
              ))}
            </div>
            <Reveal delay={300}>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {diagnosticReviewAreas.map((area) => (
                  <span
                    key={area}
                    className="border border-line px-4 py-[9px] text-base text-ink-muted"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Three outcomes ── */}
      <section className={surfaces.card}>
        <div className={`${sectionInner} flex flex-col gap-14`}>
          <SectionHead eyebrow="The answer">
            Three honest outcomes.{' '}
            <span className="italic text-gold-text">
              One of them is “don’t build.”
            </span>
          </SectionHead>
          <div className="grid grid-cols-1 min-[768px]:grid-cols-3 gap-10 min-[768px]:gap-12">
            {outcomes.map((o, i) => (
              <Reveal
                key={o.title}
                delay={100 + i * 120}
                className="border-t-2 border-gold pt-6"
              >
                <h3 className="font-serif text-[26px] leading-8 text-ink-em mb-3">
                  {o.title}
                </h3>
                <p className="text-base leading-6 text-ink-sub">
                  {o.description}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <PriceExamples />

      <FitLists
        goodFit={diagnosticFit.goodFit}
        notFit={diagnosticFit.notFit}
        surface={hasExamples ? 'card' : 'page'}
      />

      <EngagementTerms
        surface={hasExamples ? 'page' : 'card'}
        showCta
        badges={{ diagnostic: 'You are here' }}
        intro="The path is Diagnostic, then Build, then Run. A website is priced on its own and can start any time."
      />

      <ClosingCta cta="Request a Workflow Diagnostic">
        If the workflow is unclear,{' '}
        <span className="italic text-gold-text">the system will be too.</span>
      </ClosingCta>
    </div>
  )
}
