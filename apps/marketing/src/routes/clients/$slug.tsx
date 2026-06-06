import { createFileRoute, notFound } from '@tanstack/react-router'

import { CaseStudyDetailHero } from '@/components/caseStudy/CaseStudyDetailHero'
import { CaseStudyPullquote } from '@/components/caseStudy/CaseStudyPullquote'
import { CaseStudyReadMore } from '@/components/caseStudy/CaseStudyReadMore'
import { CaseStudyStoryLayout } from '@/components/caseStudy/CaseStudyStoryLayout'
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
      study.hero.image?.src ??
      study.hero.beats?.[0]?.image.src ??
      study.portraitImage?.src
    return seo({
      title: study.meta.title,
      description: study.meta.description,
      path: `/clients/${study.slug}`,
      image: ogImage,
    })
  },
  component: ClientDetail,
})

function ClientDetail() {
  const { study } = Route.useLoaderData()

  return (
    <article className="min-h-screen">
      <CaseStudyDetailHero study={study} />
      <CaseStudyStoryLayout study={study} />
      {study.pullquote ? (
        <CaseStudyPullquote pullquote={study.pullquote} />
      ) : null}
      <CaseStudyReadMore currentSlug={study.slug} />
      <ClosingCtaPair />
    </article>
  )
}
