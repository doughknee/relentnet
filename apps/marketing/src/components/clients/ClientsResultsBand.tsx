import { caseStudies } from '@/data/caseStudies'

interface AggregateMetric {
  label: string
  /** Display value; supports either flat or delta wording inline. */
  value: string
  /** Optional sub-line giving provenance (which case study it came from). */
  context?: string
}

/**
 * Aggregated proof across the portfolio. Today, drawn from a small
 * hand-curated list. As more case studies populate hard numbers, this
 * band can switch to programmatic derivation from `caseStudies[].atAGlance.metrics`.
 */
function buildAggregateMetrics(): ReadonlyArray<AggregateMetric> {
  return [
    {
      label: 'Systems shipped',
      value: String(caseStudies.length),
      context: 'Production engagements with diagnosed-then-built outcomes.',
    },
    {
      label: 'Platforms reached',
      value: '1 → 3',
      context: 'Scrollr: Chrome extension to macOS, Windows, and Linux native.',
    },
    {
      label: 'Industries served',
      value: String(new Set(caseStudies.map((s) => s.industry)).size),
      context: 'Construction, consumer software, sports tech, real estate, nonprofit.',
    },
    {
      label: 'Open-source releases',
      value: '1',
      context: 'Scrollr ships under AGPL-3.0 with a public codebase.',
    },
  ]
}

export function ClientsResultsBand() {
  const metrics = buildAggregateMetrics()
  return (
    <section className="relative z-10 px-6 md:px-12 py-20 md:py-24 border-y border-line">
      <div className="max-w-7xl mx-auto">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-12">
          Measurable results
        </p>
        <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <dt className="text-[10px] font-bold tracking-[0.3em] uppercase text-ink-muted">
                {metric.label}
              </dt>
              <dd className="mt-3 font-serif text-4xl md:text-5xl text-ink-em leading-none">
                {metric.value}
              </dd>
              {metric.context ? (
                <p className="mt-4 text-xs text-ink-muted leading-relaxed">
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
