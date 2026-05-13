import { Link, createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  Compass,
  Layers,
  ShieldCheck,
  Terminal,
} from 'lucide-react'

import type { LucideIcon } from 'lucide-react'

export const Route = createFileRoute('/process')({
  head: () => ({
    meta: [
      { title: 'Process | RelentNet Workflow Stewardship' },
      {
        name: 'description',
        content:
          'How RelentNet diagnoses workflow friction, designs custom software systems, and stewards technology for owner-led businesses.',
      },
    ],
  }),
  component: Process,
})

interface Phase {
  number: string
  label: string
  title: string
  quote: string
  description: string
  deliverables: Array<string>
  icon: LucideIcon
}

export const processHero = {
  headline: 'How We Turn Workflow Friction Into Operating Systems.',
  body: 'We diagnose how the business actually runs, design the workflow, build custom software systems around it, and steward the technology after launch.',
  cta: 'Map My Workflow',
} as const

export const phases: Array<Phase> = [
  {
    number: '01',
    label: 'Discover',
    title: 'Discover the Workflow',
    quote: 'We begin with how the business actually moves.',
    description:
      'We map intake, sales, fulfillment, communication, reporting, and the tools your team already relies on before recommending a build.',
    deliverables: [
      'Workflow interviews',
      'Current-tool inventory',
      'Operational pain map',
      'Opportunity summary',
    ],
    icon: Compass,
  },
  {
    number: '02',
    label: 'Diagnose',
    title: 'Diagnose the Friction',
    quote: 'The right system starts with the right problem.',
    description:
      'We identify duplicated effort, missed follow-ups, fragile handoffs, unclear reporting, and the points where disconnected software slows the business down.',
    deliverables: [
      'Bottleneck analysis',
      'Data and handoff review',
      'Risk and priority notes',
      'Recommended system scope',
    ],
    icon: Layers,
  },
  {
    number: '03',
    label: 'Design',
    title: 'Design the System',
    quote: 'A clear workflow becomes a clear interface.',
    description:
      'We define the screens, data model, permissions, automations, and implementation sequence before production development begins.',
    deliverables: [
      'Workflow blueprint',
      'Interface direction',
      'Data model outline',
      'Implementation roadmap',
    ],
    icon: Layers,
  },
  {
    number: '04',
    label: 'Build',
    title: 'Build the Operating Layer',
    quote: 'The software should fit the business, not the other way around.',
    description:
      'We build portals, dashboards, internal tools, automations, and reporting systems with clean engineering and focused user experience.',
    deliverables: [
      'Production implementation',
      'Responsive interface build',
      'Integration and workflow testing',
      'Launch preparation',
    ],
    icon: Terminal,
  },
  {
    number: '05',
    label: 'Steward',
    title: 'Steward the Technology',
    quote: 'The launch is the start of the operating relationship.',
    description:
      'We stay close after launch with hosting, monitoring, maintenance, security support, and ongoing improvements as the business changes.',
    deliverables: [
      'Hosting and monitoring',
      'Security and dependency care',
      'Support and iteration',
      'Ongoing roadmap guidance',
    ],
    icon: ShieldCheck,
  },
]

function PhaseSection({
  phase,
  index,
  isLast,
}: {
  phase: Phase
  index: number
  isLast: boolean
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true)
          io.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const isEven = index % 2 === 1
  const Icon = phase.icon

  return (
    <section ref={sectionRef} className="relative z-10">
      {/* Connecting timeline line */}
      {!isLast && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-full w-px h-24 bg-gradient-to-b from-gold/30 to-transparent hidden md:block" />
      )}

      <div className="max-w-6xl mx-auto px-6 md:px-12 py-24 md:py-32">
        {/* Phase number watermark */}
        <span
          className={`block text-[7rem] md:text-[10rem] font-serif text-black/[0.06] dark:text-white/[0.03] leading-none select-none -mb-10 md:-mb-14 ${isEven ? 'md:text-right' : ''} ${
            isRevealed ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          {phase.number}
        </span>

        {/* Content grid */}
        <div
          className={`grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-start ${
            isRevealed ? 'animate-fade-in-up' : 'opacity-0'
          }`}
          style={isRevealed ? { animationDelay: '150ms' } : undefined}
        >
          {/* Icon + label column */}
          <div
            className={`md:col-span-3 flex flex-col items-start gap-6 ${isEven ? 'md:order-last md:items-end' : ''}`}
          >
            <div className="w-14 h-14 rounded-lg border border-line flex items-center justify-center text-gold group-hover:border-gold transition-colors">
              <Icon className="size-6" strokeWidth={1.5} />
            </div>
            <div className={isEven ? 'md:text-right' : ''}>
              <span className="text-gold text-[10px] font-bold tracking-[0.3em] uppercase block">
                {phase.label}
              </span>
              <h3 className="text-2xl md:text-3xl font-serif mt-2">
                {phase.title}
              </h3>
            </div>
          </div>

          {/* Main content column */}
          <div className={`md:col-span-9 ${isEven ? 'md:order-first' : ''}`}>
            {/* Quote */}
            <p
              className={`font-serif italic text-lg md:text-xl text-ink-sub mb-6 ${
                isRevealed ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={isRevealed ? { animationDelay: '300ms' } : undefined}
            >
              &ldquo;{phase.quote}&rdquo;
            </p>

            {/* Description */}
            <p
              className={`text-ink-muted leading-relaxed mb-8 max-w-2xl ${
                isRevealed ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={isRevealed ? { animationDelay: '400ms' } : undefined}
            >
              {phase.description}
            </p>

            {/* Deliverables */}
            <div
              className={`border-t border-line pt-6 ${
                isRevealed ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={isRevealed ? { animationDelay: '500ms' } : undefined}
            >
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-ink-faint block mb-4">
                Deliverables
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {phase.deliverables.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-ink-sub group/item"
                  >
                    <ArrowRight className="size-3.5 text-gold mt-1 shrink-0 group-hover/item:translate-x-0.5 transition-transform" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Process() {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* HERO */}
      <section className="min-h-screen flex flex-col justify-center items-center px-6 relative">
        <h1 className="relative z-10 font-serif text-5xl md:text-7xl lg:text-8xl text-center leading-[1.1] animate-fade-in-up">
          How We Turn Workflow Friction Into{' '}
          <span className="italic text-gold/90">Operating Systems.</span>
        </h1>
        <p
          className="mt-8 max-w-2xl text-center text-ink-sub font-light text-base md:text-lg leading-relaxed opacity-0 animate-fade-in-up"
          style={{ animationDelay: '200ms' }}
        >
          {processHero.body}
        </p>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-pulse delay-1000 z-10">
          <span className="text-[10px] uppercase tracking-widest text-gold">
            Scroll
          </span>
          <div className="w-px h-12 bg-linear-to-b from-gold to-transparent"></div>
        </div>
      </section>

      {/* PHILOSOPHY DIVIDER */}
      <section className="relative z-10 bg-surface backdrop-blur-xs border-y border-line">
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-20 md:py-28 text-center">
          <h2 className="text-xs font-bold tracking-[0.3em] text-gold uppercase mb-8 animate-fade-in-up opacity-0">
            The Approach
          </h2>
          <p className="font-serif text-2xl md:text-4xl leading-snug max-w-3xl mx-auto animate-fade-in-up opacity-0 delay-200">
            Every engagement follows the shape of the business.
            <br />
            <span className="text-black/15 dark:text-white/30">
              Discover the workflow. Diagnose the friction. Build what should
              exist.
            </span>
          </p>
        </div>
      </section>

      {/* PHASES */}
      {phases.map((phase, index) => (
        <PhaseSection
          key={phase.number}
          phase={phase}
          index={index}
          isLast={index === phases.length - 1}
        />
      ))}

      {/* CTA */}
      <section className="py-32 flex flex-col justify-center items-center text-center px-6 relative z-10">
        <p className="text-xs font-bold tracking-[0.3em] text-ink-muted uppercase mb-8">
          The Next Step
        </p>
        <Link
          to="/inquire"
          className="font-serif text-4xl md:text-7xl hover:italic hover:text-gold transition-all duration-300"
        >
          Begin the Process.
        </Link>
      </section>
    </div>
  )
}
