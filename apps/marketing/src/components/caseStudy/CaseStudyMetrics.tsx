import type { CaseStudyMetric } from '@/data/caseStudies'

import { useReveal } from '@/hooks/useReveal'

interface CaseStudyMetricsProps {
  metrics: ReadonlyArray<CaseStudyMetric>
}

/**
 * Big-numbers band. Sits directly under the hero when a case study has
 * hard outcomes worth leading with. Modeled on the stat strips Ramotion
 * uses on Firefox/Clearbit and Instrument uses on Oura.
 *
 * Renders nothing when given an empty array; the parent route decides
 * whether to mount the component at all, but defending here too costs
 * nothing and keeps the contract simple.
 */
export function CaseStudyMetrics({ metrics }: CaseStudyMetricsProps) {
  const { ref, isRevealed } = useReveal(0.15)

  if (metrics.length === 0) {
    return null
  }

  return (
    <section
      ref={ref}
      className="relative z-10 px-6 md:px-12 py-20 md:py-24 border-y border-line"
    >
      <div className="max-w-6xl mx-auto">
        <h2
          className={`text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-12 ${
            isRevealed ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          The numbers
        </h2>
        <dl className="grid gap-12 md:gap-8 grid-cols-1 md:grid-cols-3">
          {metrics.map((metric, index) => (
            <div
              key={metric.label}
              className={`${
                isRevealed ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={
                isRevealed
                  ? { animationDelay: `${100 + index * 120}ms` }
                  : undefined
              }
            >
              <dt className="text-[10px] font-bold tracking-[0.3em] uppercase text-ink-muted">
                {metric.label}
              </dt>
              <dd className="mt-4 font-serif text-5xl md:text-7xl leading-none text-ink-em">
                {metric.value}
              </dd>
              {metric.context ? (
                <p className="mt-4 text-sm text-ink-muted leading-relaxed max-w-xs">
                  {metric.context}
                </p>
              ) : null}
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
