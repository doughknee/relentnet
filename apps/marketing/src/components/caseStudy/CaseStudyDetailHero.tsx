import { Link } from '@tanstack/react-router'

import type { CaseStudy } from '@/data/caseStudies'

interface CaseStudyDetailHeroProps {
  study: CaseStudy
}

/**
 * Detail-page hero. Left-aligned, large serif H1, body paragraph, breadcrumb above.
 * Mirrors Stripe /customers/figma top section.
 *
 * H1 source order: detailHeadline → hero.tagline.
 * Body source order: detailBody → combining hero.tagline + summary.problem.
 */
export function CaseStudyDetailHero({ study }: CaseStudyDetailHeroProps) {
  const headline = study.detailHeadline ?? study.hero.tagline
  const body =
    study.detailBody ?? `${study.hero.tagline} ${study.summary.problem}`

  return (
    <section className="relative z-10 px-6 md:px-12 pt-32 md:pt-40 pb-12 md:pb-16">
      <div className="max-w-7xl mx-auto">
        <nav
          className="mb-12 text-xs uppercase tracking-[0.2em] text-ink-muted"
          aria-label="Breadcrumb"
        >
          <Link to="/clients" className="hover:text-gold transition-colors">
            Clients
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{study.name}</span>
        </nav>
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.05] max-w-4xl">
          {headline}
        </h1>
        <p className="mt-8 max-w-2xl text-ink-sub text-base md:text-lg leading-relaxed">
          {body}
        </p>
      </div>
    </section>
  )
}
