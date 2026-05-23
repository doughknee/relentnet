import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import type { CaseStudyAtAGlance, CaseStudyMetric } from '@/data/caseStudies'

interface CaseStudyStatsRailProps {
  atAGlance: CaseStudyAtAGlance
}

interface EngagementFact {
  label: string
  value: string
}

/**
 * Sticky left rail on /clients/$slug. Composed of three vertical blocks:
 * proof metrics (top), engagement facts (middle), diagnostic CTA (bottom).
 * The CTA is always rendered so the rail never appears fully empty.
 */
export function CaseStudyStatsRail({ atAGlance }: CaseStudyStatsRailProps) {
  const metrics = atAGlance.metrics ?? []
  const facts: Array<EngagementFact> = []
  if (atAGlance.engagementYear) {
    facts.push({ label: 'Year', value: atAGlance.engagementYear })
  }
  if (atAGlance.duration) {
    facts.push({ label: 'Duration', value: atAGlance.duration })
  }
  if (atAGlance.role) {
    facts.push({ label: 'Role', value: atAGlance.role })
  }

  return (
    <aside className="lg:sticky lg:top-32 self-start">
      {metrics.length > 0 ? (
        <section className="border-l border-line-faint pl-5 space-y-8">
          <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold">
            Proof
          </h2>
          {metrics.map((metric) => (
            <MetricEntry key={metric.label} metric={metric} />
          ))}
        </section>
      ) : null}

      {facts.length > 0 ? (
        <section className="mt-12 border-l border-line-faint pl-5 space-y-5">
          <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-ink-muted">
            Engagement
          </h2>
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="text-[10px] font-bold tracking-[0.3em] uppercase text-ink-muted">
                {fact.label}
              </dt>
              <dd className="mt-1 font-serif text-base text-ink-em">
                {fact.value}
              </dd>
            </div>
          ))}
        </section>
      ) : null}

      <div className="mt-12">
        <p className="text-sm text-ink-sub">Ready to diagnose your friction?</p>
        <Link
          to="/diagnostic"
          className="group mt-3 inline-flex items-center gap-2 border border-gold bg-gold px-5 py-3 text-xs uppercase tracking-widest text-black transition-all duration-300 hover:bg-transparent hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          Start a Diagnostic
          <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </aside>
  )
}

function MetricEntry({ metric }: { metric: CaseStudyMetric }) {
  const isDelta =
    typeof metric.from === 'string' &&
    metric.from.length > 0 &&
    typeof metric.to === 'string' &&
    metric.to.length > 0

  return (
    <div>
      {isDelta ? (
        <>
          <dt className="text-[10px] font-bold tracking-[0.3em] uppercase text-ink-muted">
            {metric.label}
          </dt>
          <dd className="mt-2 font-serif text-2xl md:text-3xl text-ink-em leading-tight">
            <span className="text-ink-muted">{metric.from}</span>
            <span className="mx-2 text-gold">→</span>
            <span>{metric.to}</span>
          </dd>
        </>
      ) : (
        <>
          <dt className="text-[10px] font-bold tracking-[0.3em] uppercase text-ink-muted">
            {metric.label}
          </dt>
          <dd className="mt-2 font-serif text-3xl md:text-4xl text-ink-em leading-none">
            {metric.value}
          </dd>
        </>
      )}
      {metric.context ? (
        <p className="mt-3 text-xs text-ink-muted leading-relaxed">
          {metric.context}
        </p>
      ) : null}
    </div>
  )
}
