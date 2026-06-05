import { Link, createFileRoute } from '@tanstack/react-router'
import {
  ArrowRight,
  ClipboardList,
  GitBranch,
  Search,
  ShieldCheck,
  Wrench,
} from 'lucide-react'

import type { LucideIcon } from 'lucide-react'

export const Route = createFileRoute('/diagnostic')({
  head: () => ({
    meta: [
      { title: 'Workflow Diagnostic | RelentNet' },
      {
        name: 'description',
        content:
          'Start with a RelentNet Workflow Diagnostic to map operational friction, identify priority opportunities, and decide what technology is worth building.',
      },
    ],
  }),
  component: Diagnostic,
})

interface ReviewCard {
  title: string
  description: string
  icon: LucideIcon
}

interface OutcomeCard {
  title: string
  description: string
  icon: LucideIcon
}

export const diagnosticHero = {
  headline: 'Map the workflow before building the system.',
  body: 'A Workflow Diagnostic is the first buying step for owner-led teams that feel operational friction but need the workflow understood before prescribing software.',
  primaryCta: 'Request a Workflow Diagnostic',
  secondaryCta: 'See the process',
} as const

export const diagnosticReviewAreas = [
  'Current tools',
  'Manual handoffs',
  'Lead intake',
  'Client communication',
  'Reporting gaps',
  'Team permissions',
] as const

export const diagnosticDeliverables = [
  'Workflow map',
  'Friction summary',
  'Opportunity priority list',
  'Build recommendation',
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
    'Teams looking for software before defining the workflow',
  ],
} as const

export const diagnosticNextSteps = [
  'Custom operating system',
  'Automation or integration layer',
  'Technology stewardship plan',
  'No-build recommendation',
] as const

const reviewCards: Array<ReviewCard> = [
  {
    title: 'Tools and data flow',
    description:
      'We inventory the systems already in use and where information gets re-keyed, delayed, or lost.',
    icon: Search,
  },
  {
    title: 'Handoffs and decisions',
    description:
      'We trace the moments work changes hands, approvals stall, or the next action becomes unclear.',
    icon: GitBranch,
  },
  {
    title: 'Operational risk',
    description:
      'We identify fragile processes, access concerns, and reporting gaps before they become system requirements.',
    icon: ShieldCheck,
  },
]

const outcomeCards: Array<OutcomeCard> = [
  {
    title: 'Build',
    description:
      'A focused custom system is justified because the workflow is repeated, valuable, and underserved by generic tools.',
    icon: Wrench,
  },
  {
    title: 'Connect',
    description:
      'A smaller automation or integration layer can remove friction without replacing tools that already work.',
    icon: GitBranch,
  },
  {
    title: 'Do not build yet',
    description:
      'The right move may be clarifying process, changing a tool, or deferring software until the workflow is sharper.',
    icon: ClipboardList,
  },
]

function Diagnostic() {
  return (
    <div className="min-h-screen overflow-hidden">
      <section className="relative min-h-screen px-6 md:px-12 flex items-start md:items-center pt-32 md:pt-0">
        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-8">
            <p className="text-gold text-[10px] tracking-[0.35em] uppercase font-bold mb-8 animate-fade-in-up">
              Workflow Diagnostic
            </p>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.02] animate-fade-in-up">
              Map the workflow before building{' '}
              <span className="italic text-gold/90">the system.</span>
            </h1>
            <p
              className="mt-8 max-w-2xl text-ink-sub text-base md:text-lg font-light leading-relaxed opacity-0 animate-fade-in-up"
              style={{ animationDelay: '150ms' }}
            >
              {diagnosticHero.body}
            </p>
            <div
              className="mt-10 flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-in-up"
              style={{ animationDelay: '300ms' }}
            >
              <Link
                to="/inquire"
                className="inline-flex items-center justify-center gap-3 border border-gold bg-gold px-7 py-4 text-sm uppercase tracking-widest text-black transition-all duration-300 hover:bg-transparent hover:text-gold"
              >
                {diagnosticHero.primaryCta}
                <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/process"
                className="inline-flex items-center justify-center gap-3 border border-line px-7 py-4 text-sm uppercase tracking-widest text-ink transition-all duration-300 hover:border-gold hover:text-gold"
              >
                {diagnosticHero.secondaryCta}
              </Link>
            </div>
          </div>

          <aside
            className="lg:col-span-4 border border-line bg-card/70 p-6 md:p-8 backdrop-blur-sm opacity-0 animate-fade-in-up"
            style={{ animationDelay: '450ms' }}
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-ink-muted mb-6">
              Diagnostic focus
            </p>
            <div className="space-y-4">
              {diagnosticReviewAreas.slice(0, 4).map((area) => (
                <div
                  key={area}
                  className="flex items-center justify-between gap-4 border-b border-line-faint pb-4 last:border-0 last:pb-0"
                >
                  <span className="text-sm text-ink-sub">{area}</span>
                  <ArrowRight className="size-3.5 text-gold shrink-0" />
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="relative z-10 px-6 md:px-12 py-24 md:py-32 border-y border-line-faint bg-inset/40">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4">
            <p className="text-gold text-[10px] tracking-[0.3em] uppercase font-bold mb-4">
              Why start here
            </p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight">
              The diagnostic protects the build from the wrong assumptions.
            </h2>
          </div>
          <div className="lg:col-span-8 space-y-6 text-ink-sub text-base md:text-lg leading-relaxed">
            <p>
              Most software conversations start with a requested feature list.
              We start with the business motion: what triggers work, who owns
              each step, where information moves, and where the team loses
              visibility.
            </p>
            <p>
              The result is a practical recommendation: build the operating
              layer, connect existing tools, improve the process first, or avoid
              unnecessary software entirely.
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 md:px-12 py-24 md:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-14">
            <p className="text-gold text-[10px] tracking-[0.3em] uppercase font-bold mb-4">
              What we review
            </p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight">
              We study the workflow the way your team actually lives it.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {reviewCards.map((card) => {
              const Icon = card.icon
              return (
                <article
                  key={card.title}
                  className="border border-line bg-card/70 p-7 md:p-8 min-h-72 transition-all duration-300 hover:border-gold/50 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-lg border border-line flex items-center justify-center text-gold mb-8">
                    <Icon className="size-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif text-2xl mb-4">{card.title}</h3>
                  <p className="text-sm leading-relaxed text-ink-sub">
                    {card.description}
                  </p>
                </article>
              )
            })}
          </div>
          <ul className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {diagnosticReviewAreas.map((area) => (
              <li
                key={area}
                className="border border-line-faint bg-inset px-4 py-3 text-sm text-ink-sub"
              >
                {area}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative z-10 px-6 md:px-12 py-24 md:py-32 bg-card/40 border-y border-line-faint">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <p className="text-gold text-[10px] tracking-[0.3em] uppercase font-bold mb-4">
              What you receive
            </p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight">
              A decision-ready picture of what technology should do next.
            </h2>
          </div>
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {diagnosticDeliverables.map((deliverable, index) => (
              <article
                key={deliverable}
                className="border border-line bg-inset p-6 min-h-36"
              >
                <span className="text-gold text-xs font-bold tracking-[0.25em] uppercase">
                  0{index + 1}
                </span>
                <h3 className="mt-5 font-serif text-2xl">{deliverable}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 md:px-12 py-24 md:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-14">
            <p className="text-gold text-[10px] tracking-[0.3em] uppercase font-bold mb-4">
              Possible next steps
            </p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight">
              The recommendation may be to build, connect, steward, or pause.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {outcomeCards.map((card) => {
              const Icon = card.icon
              return (
                <article
                  key={card.title}
                  className="border border-line bg-card/70 p-7 md:p-8"
                >
                  <Icon className="size-6 text-gold mb-8" strokeWidth={1.5} />
                  <h3 className="font-serif text-2xl mb-4">{card.title}</h3>
                  <p className="text-sm leading-relaxed text-ink-sub">
                    {card.description}
                  </p>
                </article>
              )
            })}
          </div>
          <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {diagnosticNextSteps.map((step) => (
              <li
                key={step}
                className="flex items-center gap-3 border border-line-faint bg-inset px-4 py-4 text-sm text-ink-sub"
              >
                <ArrowRight className="size-3.5 text-gold shrink-0" />
                {step}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative z-10 px-6 md:px-12 py-24 md:py-32 bg-inset/40 border-y border-line-faint">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <FitPanel title="Good fit" items={diagnosticFit.goodFit} />
          <FitPanel
            title="Not the right fit"
            items={diagnosticFit.notFit}
            muted
          />
        </div>
      </section>

      <section className="relative z-10 px-6 md:px-12 py-24 md:py-32 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-gold text-[10px] tracking-[0.3em] uppercase font-bold mb-6">
            Start with clarity
          </p>
          <h2 className="font-serif text-4xl md:text-6xl leading-tight mb-8">
            If the workflow is unclear, the system will be too.
          </h2>
          <p className="text-ink-sub text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            Request a Workflow Diagnostic and leave with a sober map of what is
            worth building, what should be connected, and what should be left
            alone.
          </p>
          <Link
            to="/inquire"
            className="inline-flex items-center justify-center gap-3 border border-gold bg-gold px-8 py-4 text-sm uppercase tracking-widest text-black transition-all duration-300 hover:bg-transparent hover:text-gold"
          >
            {diagnosticHero.primaryCta}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}

function FitPanel({
  title,
  items,
  muted = false,
}: {
  title: string
  items: ReadonlyArray<string>
  muted?: boolean
}) {
  return (
    <article className="border border-line bg-card/70 p-7 md:p-8">
      <h3
        className={`font-serif text-3xl mb-8 ${muted ? 'text-ink-sub' : 'text-gold'}`}
      >
        {title}
      </h3>
      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 text-sm text-ink-sub"
          >
            <ArrowRight className="size-3.5 text-gold mt-1 shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}
