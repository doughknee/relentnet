import { createFileRoute, notFound } from '@tanstack/react-router'

import { CaseStudyCta } from '@/components/caseStudy/CaseStudyCta'
import { CaseStudyElevatorPitch } from '@/components/caseStudy/CaseStudyElevatorPitch'
import { CaseStudyHero } from '@/components/caseStudy/CaseStudyHero'
import { CaseStudyNav } from '@/components/caseStudy/CaseStudyNav'
import { CaseStudyPullquote } from '@/components/caseStudy/CaseStudyPullquote'
import { CaseStudyRecognition } from '@/components/caseStudy/CaseStudyRecognition'
import { CaseStudySection } from '@/components/caseStudy/CaseStudySection'
import { CaseStudyServices } from '@/components/caseStudy/CaseStudyServices'
import { CaseStudyStackCard } from '@/components/caseStudy/CaseStudyStackCard'
import { CaseStudyStatsRail } from '@/components/caseStudy/CaseStudyStatsRail'
import { getCaseStudyBySlug } from '@/data/caseStudies'

export const Route = createFileRoute('/portfolio/$slug')({
  loader: ({ params }) => {
    const study = getCaseStudyBySlug(params.slug)
    if (!study) {
      throw notFound()
    }
    return study
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: loaderData.meta.title },
          { name: 'description', content: loaderData.meta.description },
        ]
      : [],
  }),
  component: CaseStudyDetailPage,
})

function CaseStudyDetailPage() {
  const study = Route.useLoaderData()
  const services = study.services ?? []
  const recognition = study.recognition ?? []

  return (
    <div className="min-h-screen overflow-hidden">
      <CaseStudyHero caseStudy={study} />
      {study.elevatorPitch ? (
        <CaseStudyElevatorPitch text={study.elevatorPitch} />
      ) : null}

      <section className="relative z-10 px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
          <div className="lg:col-span-3">
            <CaseStudyStatsRail atAGlance={study.atAGlance} />
          </div>

          <div className="lg:col-span-6 space-y-4">
            <CaseStudySection
              number="01"
              label="The Challenge"
              title="What was getting in the way"
              blocks={study.story.problem}
            />
            <CaseStudySection
              number="02"
              label="The Diagnosis"
              title="What the friction actually was"
              blocks={study.story.diagnosis}
            />
            <CaseStudySection
              number="03"
              label="The Solution"
              title="What we designed and built"
              blocks={study.story.build}
            />
            <CaseStudySection
              number="04"
              label="The Results"
              title="What changed for the business"
              blocks={study.story.outcome}
            />
            {study.story.stewardship ? (
              <CaseStudySection
                number="05"
                label="Stewardship"
                title="How we continue to care for it"
                blocks={study.story.stewardship}
                tone="subordinate"
              />
            ) : null}
          </div>

          <div className="lg:col-span-3">
            <CaseStudyStackCard
              name={study.name}
              atAGlance={study.atAGlance}
              industry={study.industry}
            />
          </div>
        </div>
      </section>

      {study.pullquote ? (
        <CaseStudyPullquote pullquote={study.pullquote} />
      ) : null}

      {services.length > 0 ? <CaseStudyServices services={services} /> : null}
      {recognition.length > 0 ? (
        <CaseStudyRecognition recognition={recognition} />
      ) : null}

      <CaseStudyNav slug={study.slug} />
      <CaseStudyCta />
    </div>
  )
}
