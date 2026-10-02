import { createFileRoute, notFound } from '@tanstack/react-router'

import { CaseStudyBuiltWith } from '@/components/caseStudy/CaseStudyBuiltWith'
import { CaseStudyDetailHero } from '@/components/caseStudy/CaseStudyDetailHero'
import { CaseStudyOutcomes } from '@/components/caseStudy/CaseStudyOutcomes'
import { CaseStudyReadMore } from '@/components/caseStudy/CaseStudyReadMore'
import { CaseStudyStoryLayout } from '@/components/caseStudy/CaseStudyStoryLayout'
import { CaseStudyTestimonial } from '@/components/caseStudy/CaseStudyTestimonial'
import { ClosingCtaPair } from '@/components/clients/ClosingCtaPair'
import { caseStudies } from '@/data/caseStudies'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/clients/$slug')({
  loader: ({ params }) => {
    const study = caseStudies.find((s) => s.slug === params.slug)
    if (!study) throw notFound()
    return { study }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    const { study } = loaderData
    // Prefer the case study's own hero/portrait image as the social card.
    const ogImage =
      study.hero.image ?? study.hero.beats?.[0]?.image ?? study.portraitImage
    return seo({
      title: study.meta.title,
      description: study.meta.description,
      path: `/clients/${study.slug}`,
      image: ogImage?.src,
      imageWidth: ogImage?.width,
      imageHeight: ogImage?.height,
    })
  },
  component: ClientDetail,
})

function ClientDetail() {
  const { study } = Route.useLoaderData()
  const { metrics, stack, stackScope } = study.atAGlance

  return (
    <article className="min-h-screen">
      <CaseStudyDetailHero study={study} />
      {metrics?.length ? <CaseStudyOutcomes metrics={metrics} /> : null}
      <CaseStudyStoryLayout study={study} />
      {stack?.length ? (
        <CaseStudyBuiltWith stack={stack} scope={stackScope} />
      ) : null}
      {study.testimonial ? (
        <CaseStudyTestimonial
          testimonial={study.testimonial}
          builtBy={study.builtBy}
        />
      ) : null}
      <CaseStudyReadMore currentSlug={study.slug} />
      <ClosingCtaPair />
    </article>
  )
}
