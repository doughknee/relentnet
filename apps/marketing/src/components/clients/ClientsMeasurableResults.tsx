import { Reveal } from '@/components/Reveal'
import { caseStudies } from '@/data/caseStudies'

/**
 * "Measurable results" — 4 huge serif numbers in a horizontal row, each with
 * a one-line description below. Mirrors Stripe /customers's measurable-results band.
 *
 * Picks the first 4 case studies with a non-null featuredStat. If fewer than 4
 * exist, falls back to placeholder entries (which always have featuredStat set).
 */
export function ClientsMeasurableResults() {
  const stats = caseStudies
    .filter((s) => s.featuredStat !== undefined)
    .slice(0, 4)
    .map((s) => s.featuredStat!)

  if (stats.length === 0) return null

  return (
    <section className="relative z-10 px-6 md:px-12 py-20 md:py-28 border-t border-line-faint">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-3">
            Measurable results
          </p>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl max-w-3xl mb-16 md:mb-20">
            Diagnosed friction becomes useful systems.
          </h2>
        </Reveal>
        <dl className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {stats.map((stat, i) => (
            <Reveal key={stat.value + stat.description} delay={i * 100}>
              <dd className="font-serif text-4xl md:text-5xl lg:text-6xl text-ink-em leading-none">
                {stat.value}
              </dd>
              <dt className="mt-4 text-sm text-ink-sub leading-relaxed">
                {stat.description}
              </dt>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  )
}
