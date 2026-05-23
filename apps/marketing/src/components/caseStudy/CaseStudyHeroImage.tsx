import type { CaseStudy } from '@/data/caseStudies'

interface CaseStudyHeroImageProps {
  study: CaseStudy
}

/**
 * Detail-page full-width landscape hero image. Mirrors Stripe /customers/figma's
 * hero shot below the inline CTA.
 *
 * Renders nothing if the study has no hero image.
 */
export function CaseStudyHeroImage({ study }: CaseStudyHeroImageProps) {
  if (!study.hero.image) return null

  return (
    <section className="relative z-10 px-6 md:px-12 py-12 md:py-16">
      <div className="max-w-7xl mx-auto">
        <img
          src={study.hero.image.src}
          alt={study.hero.image.alt}
          width={study.hero.image.width}
          height={study.hero.image.height}
          className="w-full aspect-video object-cover"
          loading="eager"
        />
      </div>
    </section>
  )
}
