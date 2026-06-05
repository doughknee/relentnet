import { createFileRoute, notFound } from '@tanstack/react-router'

import { CaseStudyDetailHero } from '@/components/caseStudy/CaseStudyDetailHero'
import { CaseStudyPullquote } from '@/components/caseStudy/CaseStudyPullquote'
import { CaseStudyReadMore } from '@/components/caseStudy/CaseStudyReadMore'
import { CaseStudyStoryLayout } from '@/components/caseStudy/CaseStudyStoryLayout'
import { ClosingCtaPair } from '@/components/clients/ClosingCtaPair'
import { caseStudies } from '@/data/caseStudies'

export const Route = createFileRoute('/clients/$slug')({
  loader: ({ params }) => {
    const study = caseStudies.find((s) => s.slug === params.slug)
    if (!study) throw notFound()
    return { study }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    return {
      meta: [
        { title: loaderData.study.meta.title },
        { name: 'description', content: loaderData.study.meta.description },
      ],
    }
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
