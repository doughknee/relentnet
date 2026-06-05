import { Link } from '@tanstack/react-router'
import { ArrowRight, Building2, Globe } from 'lucide-react'

import { CaseStudyNarrative } from './CaseStudyNarrative'
import type { CaseStudy, CaseStudyMetric } from '@/data/caseStudies'
import { BrandIcon } from '@/components/BrandIcon'

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
 * Detail-page body — two-column layout with a sticky LEFT rail and the
 * long-form article on the right. The rail carries the customer meta card
 * (wordmark, products used, global partner, region, tier), the result stats,
 * and the "Ready to get started?" CTA.
 */
export function CaseStudyStoryLayout({ study }: CaseStudyStoryLayoutProps) {
  const metrics = study.atAGlance.metrics ?? []
  const products = (study.atAGlance.stack ?? []).flatMap((c) => c.items)
  const global = study.atAGlance.global
  const sizeLabel =
    study.companySize === 'placeholder'
      ? null
      : study.companySize.charAt(0).toUpperCase() + study.companySize.slice(1)

  return (
    <section className="relative z-10 px-6 md:px-12 pt-8 md:pt-10 pb-8 md:pb-12 border-t border-line-faint">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-28 space-y-8">
            <div className="border border-line-faint bg-card">
              <div
                data-testid="detail-hero-logo"
                className="flex items-center justify-center border-b border-line-faint px-6 py-7"
              >
                <span className="font-serif text-xl tracking-[0.15em] uppercase text-ink-em text-center">
                  {study.name}
                </span>
              </div>

              {products.length > 0 ? (
                <div className="border-b border-line-faint px-6 py-5">
                  <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-ink-muted mb-4">
                    Products used
                  </p>
                  <ul className="flex flex-col gap-3">
                    {products.slice(0, 8).map((item) => (
                      <li
                        key={item.label}
                        className="flex items-center gap-3 text-sm text-ink"
                      >
                        <BrandIcon
                          slug={item.iconSlug}
                          label={item.label}
                          className="size-4 text-ink-muted shrink-0"
                        />
                        <span>{item.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {global ? (
                <div className="flex items-center gap-3 border-b border-line-faint px-6 py-4 text-sm text-ink-sub">
                  <img
                    src={global.logoSrc}
                    alt={global.label}
                    className="size-4 shrink-0 opacity-80"
                  />
                  <span>{global.label}</span>
                </div>
              ) : null}

              {study.region ? (
                <div className="flex items-center gap-3 border-b border-line-faint px-6 py-4 text-sm text-ink-sub">
                  <Globe className="size-4 shrink-0 text-ink-muted" />
                  <span>{study.region}</span>
                </div>
              ) : null}

              {sizeLabel ? (
                <div className="flex items-center gap-3 px-6 py-4 text-sm text-ink-sub">
                  <Building2 className="size-4 shrink-0 text-ink-muted" />
                  <span>{sizeLabel}</span>
                </div>
              ) : null}
            </div>

            {metrics.length > 0 ? (
              <dl className="space-y-6 pt-2">
                {metrics.map((metric) => (
                  <div key={metric.label} className="border-l-2 border-gold pl-5">
                    <dd className="font-serif text-2xl text-ink-em leading-tight">
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

            <div className="border-t border-line-faint pt-7">
              <h2 className="font-serif text-xl mb-4">
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
        </aside>

        <div className="lg:col-span-8">
          <CaseStudyNarrative study={study} />
        </div>
      </div>
    </section>
  )
}
