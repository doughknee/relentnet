import { createFileRoute } from '@tanstack/react-router'

import { CtaLink } from '@/components/CtaLink'
import { Eyebrow } from '@/components/Eyebrow'
import { Reveal } from '@/components/Reveal'
import { seo } from '@/lib/seo'

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

export const phases = [
  {
    number: '01',
    label: 'Diagnose',
    title: 'Diagnose the workflow',
    quote: 'We begin with how the business actually moves.',
    description:
      'We map intake, sales, fulfillment, communication, reporting, and the tools your team already relies on — before recommending anything.',
    deliverables: [
      'Workflow interviews',
      'Current-tool inventory',
      'Operational pain map',
      'Opportunity summary',
    ],
  },
  {
    number: '02',
    label: 'Prioritize',
    title: 'Prioritize the friction',
    quote: 'The right system starts with the right problem.',
    description:
      'Duplicated effort, missed follow-ups, fragile handoffs, unclear reporting — we separate symptoms from root causes and rank what’s worth fixing.',
    deliverables: [
      'Bottleneck analysis',
      'Data and handoff review',
      'Risk and priority notes',
      'Recommended system scope',
    ],
  },
  {
    number: '03',
    label: 'Design',
    title: 'Design the system',
    quote: 'A clear workflow becomes a clear interface.',
    description:
      'Screens, data model, permissions, automations, and sequence — defined before production development begins.',
    deliverables: [
      'Workflow blueprint',
      'Interface direction',
      'Data model outline',
      'Implementation roadmap',
    ],
  },
  {
    number: '04',
    label: 'Build',
    title: 'Build the operating layer',
    quote: 'The software should fit the business, not the other way around.',
    description:
      'Portals, dashboards, internal tools, automations, and reporting — clean engineering, focused user experience.',
    deliverables: [
      'Production implementation',
      'Responsive interface build',
      'Integration and workflow testing',
      'Launch preparation',
    ],
  },
  {
    number: '05',
    label: 'Steward',
    title: 'Steward the technology',
    quote: 'The launch is the start of the operating relationship.',
    description:
      'Hosting, monitoring, maintenance, security, and ongoing improvement as the business changes — with direct access to the people who built it.',
    deliverables: [
      'Hosting and monitoring',
      'Security and dependency care',
      'Support and iteration',
      'Ongoing roadmap guidance',
    ],
  },
] as const

function Process() {
  return (
    <div className="relative overflow-x-clip">
      {/* Radial gold glow over the top of the page */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-screen pointer-events-none bg-[radial-gradient(ellipse_760px_420px_at_50%_60px,rgba(203,171,69,0.07),transparent_65%)]"
      />

      {/* ── Hero ── */}
      <section className="relative pt-[130px] pb-[90px] px-5 md:px-12 text-center">
        <div className="max-w-[1000px] mx-auto">
          <Eyebrow className="animate-fade-in-up mb-8">How we work</Eyebrow>
          <h1
            className="animate-fade-in-up font-serif text-[clamp(38px,7.5vw,92px)] leading-none tracking-[-0.01em] text-balance"
            style={{ animationDelay: '80ms' }}
          >
            Diagnose first.{' '}
            <span className="italic text-gold-text">Build from evidence.</span>
          </h1>
          <p
            className="animate-fade-in-up mt-9 mx-auto max-w-[540px] text-ink-sub text-[17px] font-light leading-[1.6]"
            style={{ animationDelay: '180ms' }}
          >
            Five phases. Every engagement follows the shape of the business —
            and nothing gets built until the friction is understood.
          </p>
        </div>
      </section>

      {/* ── Five phases ── */}
      {phases.map((phase) => (
        <section key={phase.number}>
          <div className="max-w-[1200px] mx-auto px-5 md:px-12 py-20 grid grid-cols-1 min-[1024px]:grid-cols-[3fr_5fr_4fr] gap-10 min-[1024px]:gap-16 items-start">
            <Reveal>
              <span className="font-serif text-[110px] leading-[0.9] text-watermark block">
                {phase.number}
              </span>
              <p className="mt-4 font-mono text-[11px] tracking-[0.3em] uppercase text-gold-text font-medium">
                {phase.label}
              </p>
              <h2 className="font-serif text-[40px] leading-[1.05] mt-2.5">
                {phase.title}
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="font-serif italic text-2xl leading-[1.35] text-ink-em mb-5">
                &ldquo;{phase.quote}&rdquo;
              </p>
              <p className="text-[15px] font-light leading-[1.7] text-ink-sub">
                {phase.description}
              </p>
            </Reveal>
            <Reveal delay={240} className="border-l border-line pl-7">
              <p className="font-mono text-[10px] tracking-[0.26em] uppercase text-ink-faint mb-4">
                Deliverables
              </p>
              <div className="flex flex-col">
                {phase.deliverables.map((item) => (
                  <span
                    key={item}
                    className="border-b border-line-faint py-[11px] text-sm font-light text-ink-sub"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      ))}

      {/* ── Closing CTA ── */}
      <section className="relative">
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_700px_500px_at_50%_100%,rgba(203,171,69,0.08),transparent_70%)]"
        />
        <div className="max-w-[1200px] mx-auto px-5 md:px-12 py-30 text-center relative">
          <Reveal>
            <h2 className="font-serif text-[clamp(32px,5.6vw,68px)] leading-[1.05] text-balance">
              Phase one costs you nothing.
              <br />
              <span className="italic text-gold-text">
                The wrong build costs a year.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <div className="mt-11 flex justify-center">
              <CtaLink to="/inquire" arrow>
                Start With a Diagnostic
              </CtaLink>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
