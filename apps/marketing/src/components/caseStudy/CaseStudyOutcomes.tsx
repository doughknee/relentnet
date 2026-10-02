import { label } from './label'
import type { CaseStudyMetric } from '@/data/caseStudies'
import { Reveal } from '@/components/Reveal'

interface CaseStudyOutcomesProps {
  metrics: ReadonlyArray<CaseStudyMetric>
}

/**
 * "What changed" band: one card per metric. A delta metric reads as
 * "Before: <from>" over a large <to>; a flat metric shows its value.
 */
export function CaseStudyOutcomes({ metrics }: CaseStudyOutcomesProps) {
  return (
    <section
      aria-labelledby="outcomes-heading"
      className="relative z-10 px-6 md:px-12 pt-10 pb-12 md:pt-14 md:pb-20 border-t border-line-faint"
    >
      <div className="max-w-7xl mx-auto">
        <h2
          id="outcomes-heading"
          className={`mb-4 md:mb-7 text-ink-muted ${label}`}
        >
          What changed
        </h2>
        <Reveal className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="h-full flex flex-col gap-2.5 md:gap-3.5 border border-line-faint bg-card px-5 pt-5 pb-6 md:px-8 md:pt-7 md:pb-8"
            >
              <span className="block h-0.5 w-8 bg-gold" aria-hidden="true" />
              <h3 className={`text-ink-muted ${label}`}>{metric.label}</h3>
              {metric.from && metric.to ? (
                <p className="text-[15px] leading-6 text-ink-muted">
                  <span className="text-ink-sub">Before:</span> {metric.from}
                </p>
              ) : null}
              <p className="font-serif text-ink-em text-[30px] leading-9 md:text-[34px] md:leading-10">
                {metric.from && metric.to ? metric.to : metric.value}
              </p>
              {metric.context ? (
                <p className="text-[15px] leading-6 text-ink-sub">
                  {metric.context}
                </p>
              ) : null}
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
