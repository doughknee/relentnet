import { Link } from '@tanstack/react-router'

import { label } from './label'
import type { CaseStudy } from '@/data/caseStudies'
import { CtaLink } from '@/components/CtaLink'
import { Reveal } from '@/components/Reveal'

interface CaseStudyDetailHeroProps {
  study: CaseStudy
}

/**
 * Detail-page hero: breadcrumb, eyebrow, headline, intro and the customer's
 * hero image, then the client endorsement (`heroQuote`) with a link down to
 * the full letter, so the proof sits in the first screen.
 *
 * H1 source order: detailHeadline → hero.tagline.
 * Intro source order: detailBody → elevatorPitch → summary.problem.
 */
export function CaseStudyDetailHero({ study }: CaseStudyDetailHeroProps) {
  const headline = study.detailHeadline ?? study.hero.tagline
  const intro = study.detailBody ?? study.elevatorPitch ?? study.summary.problem
  const image = study.hero.image
  const eyebrowExtras = [study.region, study.atAGlance.engagementYear].filter(
    Boolean,
  )
  const attribution = study.testimonial?.attribution
  const quote = attribution ? study.heroQuote : undefined

  return (
    <section className="relative z-10 px-6 md:px-12 pt-10 md:pt-[88px] pb-12 md:pb-[72px]">
      <div className="max-w-7xl mx-auto">
        <Reveal
          className={`mb-6 md:mb-14 flex items-center justify-between gap-4 ${label}`}
        >
          <nav
            className="hidden md:block text-ink-muted"
            aria-label="Breadcrumb"
          >
            <Link
              to="/clients"
              className="hover:text-gold-text transition-colors"
            >
              Clients
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink">{study.name}</span>
          </nav>
          <Link
            to="/clients"
            className="text-ink-sub md:text-ink-muted hover:text-gold-text transition-colors"
          >
            <span className="md:hidden" aria-hidden="true">
              ←{' '}
            </span>
            All client stories
          </Link>
        </Reveal>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-[72px] lg:items-center">
          <div className="flex-1 min-w-0 flex flex-col gap-6 md:gap-7">
            <Reveal delay={40}>
              <p className={`text-gold-text ${label}`}>
                {study.industry}
                {eyebrowExtras.map((extra) => (
                  <span key={extra} className="hidden md:inline">
                    <span className="mx-3" aria-hidden="true">
                      ·
                    </span>
                    {extra}
                  </span>
                ))}
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="font-serif text-ink-em text-[44px] leading-[46px] lg:text-[72px] lg:leading-[76px]">
                {headline}
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="max-w-[600px] text-ink-sub text-lg leading-[30px] md:text-[21px] md:leading-[34px] md:font-light">
                {intro}
              </p>
            </Reveal>
          </div>

          {image ? (
            <Reveal delay={240} className="lg:w-[560px] lg:shrink-0">
              <img
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                className="w-full h-auto border border-line-faint"
                loading="eager"
              />
            </Reveal>
          ) : null}
        </div>

        {quote && attribution ? (
          <Reveal
            delay={320}
            className="mt-6 md:mt-14 md:border-t md:border-line-faint md:pt-10 flex flex-col md:flex-row md:items-end gap-6 md:gap-16"
          >
            <figure className="flex-1 min-w-0 border-l-2 border-gold pl-5 py-1 md:pl-8 md:py-0 flex flex-col gap-4 md:gap-5">
              <blockquote className="font-serif italic text-ink-em text-2xl leading-[31px] md:text-4xl md:leading-[44px]">
                “{quote}”
              </blockquote>
              <figcaption className="text-[15px] leading-6 text-ink-muted">
                <span className="block md:inline font-medium text-ink">
                  {attribution.name}
                </span>
                <span className="hidden md:inline" aria-hidden="true">
                  {'  ·  '}
                </span>
                <span>
                  {attribution.role}, {study.name}
                </span>
              </figcaption>
            </figure>
            <div className="md:shrink-0">
              <CtaLink href="#letter" variant="outline" arrow block>
                Read the full letter
              </CtaLink>
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  )
}
