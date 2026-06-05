import { Link } from '@tanstack/react-router'

import type { CaseStudy } from '@/data/caseStudies'

interface CaseStudyDetailHeroProps {
  study: CaseStudy
}

/**
 * Detail-page hero — breadcrumb + large headline + intro on the left, with the
 * customer's hero image balancing the right. The meta card (wordmark,
 * products, region, tier) and result stats live in the sticky left rail; see
 * CaseStudyStoryLayout.
 *
 * H1 source order: detailHeadline → hero.tagline.
 * Intro source order: detailBody → elevatorPitch → summary.problem.
 */
export function CaseStudyDetailHero({ study }: CaseStudyDetailHeroProps) {
  const headline = study.detailHeadline ?? study.hero.tagline
  const intro =
    study.detailBody ?? study.elevatorPitch ?? study.summary.problem
  const image = study.hero.image

  return (
    <section className="relative z-10 px-6 md:px-12 pt-32 md:pt-40 pb-8 md:pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 flex items-center justify-between gap-4 text-xs uppercase tracking-[0.2em]">
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className={image ? 'lg:col-span-7' : 'lg:col-span-12'}>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.05]">
              {headline}
            </h1>
            <p className="mt-8 max-w-2xl text-ink-sub text-base md:text-lg leading-relaxed">
              {intro}
            </p>
          </div>

          {image ? (
            <div className="lg:col-span-5">
              <img
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                className="w-full h-auto border border-line-faint"
                loading="eager"
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
