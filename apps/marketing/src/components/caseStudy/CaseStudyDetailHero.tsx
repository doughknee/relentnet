import { Link } from '@tanstack/react-router'
import { Building2, Globe } from 'lucide-react'

import type { CaseStudy } from '@/data/caseStudies'
import { BrandIcon } from '@/components/BrandIcon'

interface CaseStudyDetailHeroProps {
  study: CaseStudy
}

/**
 * Detail-page hero — Stripe /customers/[name] layout. Left column carries the
 * headline + intro; the right column is a bordered meta card with the customer
 * wordmark, "Products used", region, and tier.
 *
 * H1 source order: detailHeadline → hero.tagline.
 * Intro source order: detailBody → elevatorPitch → summary.problem.
 */
export function CaseStudyDetailHero({ study }: CaseStudyDetailHeroProps) {
  const headline = study.detailHeadline ?? study.hero.tagline
  const intro =
    study.detailBody ?? study.elevatorPitch ?? study.summary.problem
  const products = (study.atAGlance.stack ?? []).flatMap((c) => c.items)
  const sizeLabel =
    study.companySize === 'placeholder'
      ? null
      : study.companySize.charAt(0).toUpperCase() + study.companySize.slice(1)
  const global = study.atAGlance.global

  return (
    <section className="relative z-10 px-6 md:px-12 pt-32 md:pt-40 pb-12 md:pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 flex items-center justify-between gap-4 text-xs uppercase tracking-[0.2em]">
          <nav className="text-ink-muted" aria-label="Breadcrumb">
            <Link to="/clients" className="hover:text-gold transition-colors">
              Clients
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink">{study.name}</span>
          </nav>
          <Link
            to="/clients"
            className="hidden sm:inline text-ink-muted hover:text-gold transition-colors"
          >
            All client stories
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-8">
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.05] max-w-3xl">
              {headline}
            </h1>
            <p className="mt-8 max-w-2xl text-ink-sub text-base md:text-lg leading-relaxed">
              {intro}
            </p>
          </div>

          <aside className="lg:col-span-4 lg:pt-2">
            <div className="border border-line-faint bg-card">
              <div
                data-testid="detail-hero-logo"
                className="flex items-center justify-center border-b border-line-faint px-6 py-8"
              >
                <span className="font-serif text-2xl tracking-[0.15em] uppercase text-ink-em text-center">
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
          </aside>
        </div>
      </div>
    </section>
  )
}
