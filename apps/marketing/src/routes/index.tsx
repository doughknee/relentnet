import { Link, createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  BarChart3,
  ClipboardList,
  FileText,
  GitBranch,
  LayoutDashboard,
  MessagesSquare,
  Search,
  ShieldCheck,
  Workflow,
  Wrench,
} from 'lucide-react'

import type { LucideIcon } from 'lucide-react'

import { siteConfig } from '@/site.config'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: siteConfig.meta.title },
      {
        name: 'description',
        content:
          'White-glove technology partnership for owner-led businesses. Start with a workflow diagnostic, then build and steward the technology worth creating.',
      },
    ],
  }),
  component: HomeComponent,
})

interface MethodStep {
  title: string
  description: string
}

interface ServiceLane {
  title: string
  description: string
  icon: LucideIcon
}

export const homepageHero = {
  headline: 'Your business has outgrown disconnected tools.',
  body: 'RelentNet starts with a workflow diagnostic to map operational friction before prescribing software. When the path is clear, we design, build, and steward the technology worth creating.',
  primaryCta: 'Start With a Workflow Diagnostic',
  secondaryCta: 'See Problems We Solve',
} as const

export const operationalPains = [
  'Spreadsheet chaos',
  'Missed follow-ups',
  'Disconnected software',
  'Slow admin work',
  'Unclear reporting',
  'Client communication gaps',
] as const

export const methodSteps: Array<MethodStep> = [
  {
    title: 'Diagnose',
    description:
      'We map how work actually moves through intake, sales, fulfillment, communication, reporting, and follow-up.',
  },
  {
    title: 'Prioritize',
    description:
      'We separate symptoms from root friction and identify the opportunities most worth fixing first.',
  },
  {
    title: 'Design',
    description:
      'We define the workflow, interface, data model, and implementation plan only after the problem is clear.',
  },
  {
    title: 'Build',
    description:
      'When software is the right answer, we create the system with clean engineering and focused user experience.',
  },
  {
    title: 'Steward',
    description:
      'We stay close after launch with hosting, monitoring, improvements, support, and continued strategic iteration.',
  },
]

export const problemsSolved = [
  'Lead intake',
  'Manual handoffs',
  'Disconnected tools',
  'Follow-up loops',
  'Reporting gaps',
  'Client communication',
  'Admin drag',
  'Internal visibility',
] as const

const serviceLanes: Array<ServiceLane> = [
  {
    title: 'Workflow Diagnostic',
    description:
      'A focused first engagement that turns unclear business friction into a practical technology path.',
    icon: Search,
  },
  {
    title: 'Build Recommendation',
    description:
      'A clear decision on whether the next move is a custom system, focused automation, stewardship, or no build at all.',
    icon: Workflow,
  },
  {
    title: 'Technology Stewardship',
    description:
      'Long-term hosting, maintenance, security, support, monitoring, and iteration with direct access to the people who build.',
    icon: ShieldCheck,
  },
]

const problemIcons: Array<LucideIcon> = [
  ClipboardList,
  FileText,
  GitBranch,
  Wrench,
  BarChart3,
  MessagesSquare,
  LayoutDashboard,
  Workflow,
]

function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null)
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return { ref, isRevealed }
}

function HomeComponent() {
  const painReveal = useReveal(0.1)
  const methodReveal = useReveal(0.1)
  const problemsReveal = useReveal(0.1)
  const workReveal = useReveal(0.1)
  const ctaReveal = useReveal(0.15)

  return (
    <div className="min-h-screen overflow-hidden">
      <section className="min-h-screen flex flex-col justify-start md:justify-center pt-32 md:pt-0 px-6 md:px-12 relative">
        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8">
            <p className="text-gold text-[10px] tracking-[0.35em] uppercase font-bold mb-8 animate-fade-in-up">
              White-glove technology partner
            </p>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.02] animate-fade-in-up">
              Your business has outgrown{' '}
              <span className="italic text-gold/90">disconnected tools.</span>
            </h1>
            <p
              className="mt-8 max-w-2xl text-ink-sub text-base md:text-lg font-light leading-relaxed opacity-0 animate-fade-in-up"
              style={{ animationDelay: '150ms' }}
            >
              {homepageHero.body}
            </p>
            <div
              className="mt-10 flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-in-up"
              style={{ animationDelay: '300ms' }}
            >
              <Link
                to="/diagnostic"
                className="inline-flex items-center justify-center gap-3 border border-gold bg-gold px-7 py-4 text-sm uppercase tracking-widest text-black transition-all duration-300 hover:bg-transparent hover:text-gold"
              >
                {homepageHero.primaryCta}
                <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/clients"
                className="inline-flex items-center justify-center gap-3 border border-line px-7 py-4 text-sm uppercase tracking-widest text-ink transition-all duration-300 hover:border-gold hover:text-gold"
              >
                {homepageHero.secondaryCta}
              </Link>
            </div>
          </div>

          <aside
            className="lg:col-span-4 border border-line bg-card/70 p-6 md:p-8 backdrop-blur-sm opacity-0 animate-fade-in-up"
            style={{ animationDelay: '450ms' }}
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-ink-muted mb-6">
              Built for owners in
            </p>
            <div className="grid grid-cols-2 gap-3">
              {siteConfig.regions.map((region) => (
                <span
                  key={region}
                  className="border border-line-faint bg-inset px-4 py-3 text-sm text-ink-sub"
                >
                  {region}
                </span>
              ))}
            </div>
            <p className="mt-8 text-sm leading-relaxed text-ink-muted">
              Construction, home services, real estate-adjacent firms,
              professional services, and regional companies with operational
              complexity.
            </p>
          </aside>
        </div>
      </section>

      <section
        ref={painReveal.ref}
        className="relative z-10 bg-surface backdrop-blur-xs border-y border-line"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5">
              <h2
                className={`text-xs font-bold tracking-[0.3em] text-gold uppercase mb-6 ${
                  painReveal.isRevealed ? 'animate-fade-in-up' : 'opacity-0'
                }`}
              >
                The Friction
              </h2>
              <h3
                className={`font-serif text-3xl md:text-5xl leading-tight ${
                  painReveal.isRevealed ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={
                  painReveal.isRevealed
                    ? { animationDelay: '150ms' }
                    : undefined
                }
              >
                The business is moving.
                <br />
                <span className="text-black/15 dark:text-white/30">
                  The tools are not.
                </span>
              </h3>
            </div>
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {operationalPains.map((pain, index) => (
                <div
                  key={pain}
                  className={`border border-line-faint bg-card p-5 text-ink-sub ${
                    painReveal.isRevealed ? 'animate-fade-in-up' : 'opacity-0'
                  }`}
                  style={
                    painReveal.isRevealed
                      ? { animationDelay: `${200 + index * 80}ms` }
                      : undefined
                  }
                >
                  <span className="text-gold text-xs font-bold tracking-widest">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="mt-3 text-lg font-serif">{pain}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section ref={methodReveal.ref} className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32">
          <h2
            className={`text-xs font-bold tracking-[0.3em] text-gold uppercase mb-16 text-center ${
              methodReveal.isRevealed ? 'animate-fade-in-up' : 'opacity-0'
            }`}
          >
            The Method
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
            {methodSteps.map((step, index) => (
              <article
                key={step.title}
                className={`border-l border-line pl-6 ${
                  methodReveal.isRevealed ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={
                  methodReveal.isRevealed
                    ? { animationDelay: `${index * 120}ms` }
                    : undefined
                }
              >
                <span className="text-[4rem] font-serif leading-none text-black/[0.06] dark:text-white/[0.04]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="font-serif text-2xl mt-2">{step.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        ref={problemsReveal.ref}
        className="relative z-10 bg-surface backdrop-blur-xs border-y border-line"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">
            <div>
              <h2
                className={`text-xs font-bold tracking-[0.3em] text-gold uppercase mb-5 ${
                  problemsReveal.isRevealed ? 'animate-fade-in-up' : 'opacity-0'
                }`}
              >
                Problems We Solve
              </h2>
              <p
                className={`font-serif text-3xl md:text-5xl max-w-3xl leading-tight ${
                  problemsReveal.isRevealed ? 'animate-fade-in-up' : 'opacity-0'
                }`}
              >
                Software for the places where work gets stuck.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {problemsSolved.map((problem, index) => {
              const Icon = problemIcons[index]
              return (
                <div
                  key={problem}
                  className={`group border border-line-faint bg-inset p-6 transition-colors duration-300 hover:border-gold/50 ${
                    problemsReveal.isRevealed
                      ? 'animate-fade-in-up'
                      : 'opacity-0'
                  }`}
                  style={
                    problemsReveal.isRevealed
                      ? { animationDelay: `${index * 80}ms` }
                      : undefined
                  }
                >
                  <Icon className="size-5 text-gold mb-8" strokeWidth={1.5} />
                  <h3 className="font-serif text-xl">{problem}</h3>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section ref={workReveal.ref} className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32">
          <h2
            className={`text-xs font-bold tracking-[0.3em] text-gold uppercase mb-16 text-center ${
              workReveal.isRevealed ? 'animate-fade-in-up' : 'opacity-0'
            }`}
          >
            How We Engage
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {serviceLanes.map((lane, index) => {
              const Icon = lane.icon
              return (
                <article
                  key={lane.title}
                  className={`border border-line rounded-lg p-8 bg-card/60 ${
                    workReveal.isRevealed ? 'animate-fade-in-up' : 'opacity-0'
                  }`}
                  style={
                    workReveal.isRevealed
                      ? { animationDelay: `${index * 150}ms` }
                      : undefined
                  }
                >
                  <Icon className="size-7 text-gold mb-8" strokeWidth={1.5} />
                  <h3 className="font-serif text-2xl mb-4">{lane.title}</h3>
                  <p className="text-sm leading-relaxed text-ink-muted">
                    {lane.description}
                  </p>
                </article>
              )
            })}
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/clients"
              className="inline-flex items-center gap-3 text-gold text-sm uppercase tracking-widest hover:gap-4 transition-all duration-300"
            >
              See problems we have solved
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section ref={ctaReveal.ref} className="relative z-10">
        <div className="py-32 md:py-40 flex flex-col justify-center items-center text-center px-6">
          <p
            className={`text-xs font-bold tracking-[0.3em] text-ink-muted uppercase mb-8 ${
              ctaReveal.isRevealed ? 'animate-fade-in-up' : 'opacity-0'
            }`}
          >
            Start with the workflow
          </p>
          <Link
            to="/diagnostic"
            className={`group font-serif text-4xl md:text-7xl hover:text-gold transition-all duration-300 ${
              ctaReveal.isRevealed ? 'animate-fade-in-up' : 'opacity-0'
            }`}
            style={
              ctaReveal.isRevealed ? { animationDelay: '150ms' } : undefined
            }
          >
            Start with the workflow. Build only what earns its place.
            <ArrowRight className="inline-block ml-4 size-8 md:size-12 text-gold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </Link>
          <p
            className={`mt-8 max-w-lg text-ink-muted text-sm leading-relaxed ${
              ctaReveal.isRevealed ? 'animate-fade-in-up' : 'opacity-0'
            }`}
            style={
              ctaReveal.isRevealed ? { animationDelay: '300ms' } : undefined
            }
          >
            Share the operational friction, disconnected tools, and manual work
            slowing the business down. We use that context to determine whether
            a workflow diagnostic is the right first step.
          </p>
        </div>
      </section>
    </div>
  )
}
