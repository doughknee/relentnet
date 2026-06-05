import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { CaseStudyNarrative } from './CaseStudyNarrative'
import type { CaseStudy, CaseStudyMetric } from '@/data/caseStudies'

interface CaseStudyStoryLayoutProps {
  study: CaseStudy
}

function isDelta(metric: CaseStudyMetric): boolean {
  return (
    typeof metric.from === 'string' &&
    metric.from.length > 0 &&
    typeof metric.to === 'string' &&
    metric.to.length > 0
  )
}

/**
 * Detail-page body — Stripe /customers/[name] two-column layout. A narrow,
 * sticky left rail carries the result stats and the "Ready to get started?"
 * CTA; the wide right column is the long-form Challenge / Solution / Results
 * narrative.
 */
export function CaseStudyStoryLayout({ study }: CaseStudyStoryLayoutProps) {
  const metrics = study.atAGlance.metrics ?? []

  return (
    <section className="relative z-10 px-6 md:px-12 pt-12 md:pt-16 pb-8 md:pb-12 border-t border-line-faint">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28 space-y-10">
            {metrics.length > 0 ? (
              <dl className="space-y-8">
                {metrics.map((metric) => (
                  <div key={metric.label} className="border-l-2 border-gold pl-5">
                    <dd className="font-serif text-2xl md:text-3xl text-ink-em leading-tight">
                      {isDelta(metric) ? (
                        <>
                          <span className="text-ink-muted">{metric.from}</span>
                          <span className="mx-2 text-gold">→</span>
                          <span>{metric.to}</span>
                        </>
                      ) : (
                        metric.value
                      )}
                    </dd>
                    <dt className="mt-2 text-sm text-ink-muted">
                      {metric.label}
                    </dt>
                  </div>
                ))}
              </dl>
            ) : null}

            <div className="border-t border-line-faint pt-8">
              <h2 className="font-serif text-xl md:text-2xl mb-5">
                Ready to diagnose your friction?
              </h2>
              <Link
                to="/diagnostic"
                className="inline-flex items-center justify-center gap-3 border border-gold bg-gold px-6 py-3.5 text-sm uppercase tracking-widest text-black transition-all duration-300 hover:bg-transparent hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                Start a Diagnostic
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <CaseStudyNarrative study={study} />
        </div>
      </div>
    </section>
  )
}
