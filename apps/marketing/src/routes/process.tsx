import { createFileRoute } from '@tanstack/react-router'

import { founders } from './about'
import { ClientProofBand } from '@/components/ClientProofBand'
import { ClosingCta } from '@/components/ClosingCta'
import { CtaLink } from '@/components/CtaLink'
import { EngagementTerms } from '@/components/EngagementTerms'
import { Eyebrow } from '@/components/Eyebrow'
import { ProcessPhaseBlock } from '@/components/ProcessPhaseBlock'
import { Reveal } from '@/components/Reveal'
import {
  SectionHead,
  leadClass,
  sectionInner,
  surfaces,
} from '@/components/SectionHead'
import { owns } from '@/data/founders'
import { seo } from '@/lib/seo'
import { siteConfig } from '@/site.config'

export const Route = createFileRoute('/process')({
  head: () =>
    seo({
      title: 'Process | RelentNet Workflow Stewardship',
      description:
        'How RelentNet uses a diagnostic-led process to clarify workflow friction, prioritize the right operational problem, and build only what earns its place.',
      path: '/process',
    }),
  component: Process,
})

const { pricing } = siteConfig

type PhaseEngagement = 'diagnostic' | 'build' | 'run'

interface Phase {
  number: string
  label: string
  title: string
  quote: string
  description: string
  deliverables: ReadonlyArray<string>
  /** Which engagement the phase belongs to; durations and prices come from
   *  `siteConfig.pricing` through it. */
  engagement: PhaseEngagement
  /** Who the client talks to in this phase. The block renders it only when
   *  set. */
  who?: string
}

export const phases: ReadonlyArray<Phase> = [
  {
    number: '01',
    label: 'Diagnose',
    title: 'Diagnose the workflow',
    quote: 'We begin with how the business actually moves.',
    description:
      'We map intake, sales, fulfillment, communication, reporting, and the tools your team already relies on, all before recommending anything.',
    deliverables: [
      'Workflow interviews',
      'Current-tool inventory',
      'Operational pain map',
      'Opportunity summary',
    ],
    engagement: 'diagnostic',
    who: 'Brandon and Daniel',
  },
  {
    number: '02',
    label: 'Prioritize',
    title: 'Prioritize the friction',
    quote: 'The right system starts with the right problem.',
    description:
      'Duplicated effort, missed follow-ups, fragile handoffs, unclear reporting. We separate symptoms from root causes and rank what’s worth fixing.',
    deliverables: [
      'Bottleneck analysis',
      'Data and handoff review',
      'Risk and priority notes',
      'Recommended system scope',
    ],
    engagement: 'diagnostic',
    who: 'Brandon',
  },
  {
    number: '03',
    label: 'Design',
    title: 'Design the system',
    quote: 'A clear workflow becomes a clear interface.',
    description:
      'Screens, data model, permissions, automations, and sequence, all defined before production development begins.',
    deliverables: [
      'Workflow blueprint',
      'Interface direction',
      'Data model outline',
      'Implementation roadmap',
    ],
    engagement: 'build',
    who: 'Brandon',
  },
  {
    number: '04',
    label: 'Build',
    title: 'Build the operating layer',
    quote: 'The software should fit the business, not the other way around.',
    description:
      'Portals, dashboards, internal tools, automations, and reporting, built with clean engineering and a focused user experience.',
    deliverables: [
      'Production implementation',
      'Responsive interface build',
      'Integration and workflow testing',
      'Launch preparation',
    ],
    engagement: 'build',
    who: 'Brandon',
  },
  {
    number: '05',
    label: 'Run',
    title: 'Run and support the system',
    quote: 'The launch is the start of the operating relationship.',
    description:
      'Hosting and monitoring on production infrastructure you control. Fixes and improvements on a monthly retainer. Direct access to the engineering team that built it. The system keeps working; RelentNet stays accountable for it.',
    deliverables: [
      'Production hosting and monitoring',
      'Security and dependency maintenance',
      'Fixes, improvements, and iteration',
      'Direct access to the engineering team',
    ],
    engagement: 'run',
    who: 'Daniel day to day, Brandon for changes',
  },
]

const engagementNames: Record<PhaseEngagement, string> = {
  diagnostic: 'the Diagnostic',
  build: 'the Build',
  run: 'Run',
}

/** The first meta box of a phase. "How long" only where a duration is
 *  published; otherwise it says which engagement the phase belongs to. */
export function phaseMeta(phase: Phase) {
  const { price, duration } = pricing[phase.engagement]
  const part = `Part of ${engagementNames[phase.engagement]}`
  return duration
    ? {
        label: 'How long',
        value: `${part}. ${
          phase.engagement === 'run' ? duration : `Most run ${duration}`
        }.`,
      }
    : { label: 'Engagement', value: `${part}, ${price.toLowerCase()}.` }
}

/** The hero timeline: phases grouped under their engagement. */
const timeline = [
  {
    title: 'The Diagnostic',
    engagement: 'diagnostic',
    summary: `${pricing.diagnostic.price}, fixed`,
  },
  {
    title: 'The Build',
    engagement: 'build',
    summary: pricing.build.duration
      ? `${pricing.build.price} · Most run ${pricing.build.duration}`
      : pricing.build.price,
  },
  { title: 'Run', engagement: 'run', summary: pricing.run.price },
] as const

/** A sentence from Jason Hall's Cambridge letter, verbatim. */
export const processProofQuote =
  'The design process was practically painless for our team.'

function PhaseTimeline() {
  return (
    <div className="grid grid-cols-1 min-[900px]:grid-cols-[2fr_2fr_1fr] gap-x-2 gap-y-6 w-full text-left">
      {timeline.map((group) => {
        const groupPhases = phases.filter(
          (p) => p.engagement === group.engagement,
        )
        return (
          <div key={group.title} className="flex flex-col gap-2">
            <ol
              className={`grid gap-2 ${
                groupPhases.length > 1 ? 'grid-cols-2' : 'grid-cols-1'
              }`}
            >
              {groupPhases.map((p) => (
                <li
                  key={p.number}
                  className="border border-line bg-card p-5 flex flex-col gap-1.5"
                >
                  <span className="font-serif italic text-[26px] leading-8 text-gold-text">
                    {p.number}
                  </span>
                  <span className="font-mono text-[11px] tracking-[0.26em] uppercase text-ink-em">
                    {p.label}
                  </span>
                </li>
              ))}
            </ol>
            <div className="border-t-2 border-gold pt-3 flex flex-col gap-1">
              <p className="font-mono text-[11px] tracking-[0.26em] uppercase text-gold-text">
                {group.title}
              </p>
              <p className="text-base leading-6 text-ink-sub">
                {group.summary}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function Process() {
  return (
    <div className="relative overflow-x-clip">
      {/* Radial gold glow over the top of the page */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-screen pointer-events-none bg-[radial-gradient(ellipse_760px_420px_at_50%_60px,rgba(203,171,69,0.07),transparent_65%)]"
      />

      {/* ── Hero + phase timeline ── */}
      <section className="relative pt-[112px] pb-[72px] md:pb-24 px-5 md:px-12 xl:px-20">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-14 items-center text-center">
          <div className="max-w-[900px] flex flex-col items-center">
            <Eyebrow className="animate-fade-in-up mb-7">How we work</Eyebrow>
            <h1
              className="animate-fade-in-up font-serif text-[clamp(40px,7vw,88px)] leading-[1.03] tracking-[-0.01em] text-balance"
              style={{ animationDelay: '80ms' }}
            >
              Diagnose first.{' '}
              <span className="italic text-gold-text">
                Build from evidence.
              </span>
            </h1>
            <p
              className={`animate-fade-in-up mt-7 ${leadClass}`}
              style={{ animationDelay: '180ms' }}
            >
              Five phases. Every engagement follows the shape of the business,
              and nothing gets built until the friction is understood.
            </p>
            <div
              className="animate-fade-in-up mt-9 flex flex-wrap justify-center gap-3"
              style={{ animationDelay: '280ms' }}
            >
              <CtaLink to="/inquire" arrow>
                Start With a Diagnostic
              </CtaLink>
              <CtaLink href="#engagements" variant="outline">
                What it costs
              </CtaLink>
            </div>
          </div>
          <div
            className="animate-fade-in-up w-full"
            style={{ animationDelay: '380ms' }}
          >
            <PhaseTimeline />
          </div>
        </div>
      </section>

      {/* ── Five phases, with the client proof after phase 03 ── */}
      {phases.map((phase, i) => (
        <div key={phase.number}>
          <ProcessPhaseBlock
            {...phase}
            meta={phaseMeta(phase)}
            surface={i % 2 === 0 ? 'card' : 'page'}
          />
          {i === 2 && (
            <ClientProofBand
              surface="tint"
              eyebrow="What the process felt like"
              quote={processProofQuote}
              support="Cambridge went from a website to an invoice pipeline that pushes data and documents into QuickBooks Online."
            />
          )}
        </div>
      ))}

      {/* ── Who you talk to ── */}
      <section className={surfaces.page}>
        <div
          className={`${sectionInner} grid grid-cols-1 min-[1024px]:grid-cols-[minmax(0,1fr)_520px] gap-10 min-[1024px]:gap-[72px] items-center`}
        >
          <div className="flex flex-col gap-6 items-start">
            <SectionHead eyebrow="Who you talk to">
              The people in the meeting are the people{' '}
              <span className="italic text-gold-text">doing the work.</span>
            </SectionHead>
            <Reveal delay={200}>
              <p className={leadClass}>
                We both sit in client meetings, so neither of us is ever
                repeating something secondhand.
              </p>
            </Reveal>
            <Reveal
              delay={250}
              className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {founders.map((person) => (
                <div
                  key={person.name}
                  className="flex flex-col gap-2 border border-line bg-card px-6 py-5"
                >
                  <p className="font-serif text-[26px] leading-8 text-ink-em">
                    {person.name}
                  </p>
                  <p className="font-mono text-[11px] tracking-[0.2em] uppercase leading-[1.5] text-gold-text">
                    {person.role} · {person.city}
                  </p>
                  <p className="text-base leading-6 text-ink-sub">
                    {owns[person.name]}
                  </p>
                </div>
              ))}
            </Reveal>
          </div>
          <Reveal delay={150}>
            <img
              src="/founder-photo.webp"
              width={560}
              height={536}
              alt="Brandon Harris and Daniel Velez, RelentNet's co-founders"
              loading="lazy"
              className="w-full aspect-[560/536] object-cover border border-line"
            />
          </Reveal>
        </div>
      </section>

      <EngagementTerms
        id="engagements"
        surface="card"
        badges={{
          diagnostic: 'Phases 01–02',
          build: 'Phases 03–04',
          run: 'Phase 05',
        }}
        intro="Each engagement covers a set of phases. The Diagnostic is phases 01 and 02, the Build is 03 and 04, and Run is 05. A website is priced on its own."
      />

      <ClosingCta cta="Start With a Diagnostic">
        Phase one is {pricing.diagnostic.price}, fixed.
        <br />
        <span className="italic text-gold-text">
          The wrong build costs a year.
        </span>
      </ClosingCta>
    </div>
  )
}
