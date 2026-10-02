import { useId, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronDown } from 'lucide-react'

import { CaseStudyNarrative } from './CaseStudyNarrative'
import { label } from './label'
import type { ReactNode } from 'react'
import type { CaseStudy } from '@/data/caseStudies'
import { CtaLink } from '@/components/CtaLink'
import { Reveal } from '@/components/Reveal'

interface CaseStudyStoryLayoutProps {
  study: CaseStudy
}

interface GlanceRow {
  label: string
  value: ReactNode
  testId?: string
}

/**
 * Detail-page body: a sticky "At a glance" rail beside the long-form article.
 * The rail holds only the facts card and the Diagnostic CTA, so it fits a
 * 900px viewport while sticky. Below `lg` it collapses into a sticky bar
 * with a toggle and a compact CTA.
 */
export function CaseStudyStoryLayout({ study }: CaseStudyStoryLayoutProps) {
  const [isOpen, setIsOpen] = useState(false)
  const panelId = useId()
  const { engagementYear, role, global } = study.atAGlance
  const sizeLabel =
    study.companySize.charAt(0).toUpperCase() + study.companySize.slice(1)

  const rows: ReadonlyArray<GlanceRow | false | undefined | ''> = [
    { label: 'Client', value: study.name, testId: 'detail-hero-logo' },
    { label: 'Industry', value: study.industry },
    study.region && { label: 'Region', value: study.region },
    { label: 'Company size', value: sizeLabel },
    engagementYear && { label: 'Engagement', value: engagementYear },
    role && { label: 'Scope', value: role },
    global && {
      label: 'Global',
      value: (
        <span className="flex items-center gap-2">
          <img
            src={global.logoSrc}
            alt={global.label}
            className="size-4 shrink-0 opacity-80"
          />
          {global.label}
        </span>
      ),
    },
  ]

  return (
    <section className="relative z-10 px-6 md:px-12 pb-14 lg:pt-20 lg:pb-24 border-t border-line-faint">
      <div className="max-w-7xl mx-auto grid grid-cols-1 gap-8 lg:grid-cols-[320px_minmax(0,680px)] lg:gap-24">
        <aside className="sticky top-[60px] min-[900px]:top-20 lg:top-28 z-30 lg:z-auto self-start -mx-6 md:-mx-12 lg:mx-0 bg-page lg:bg-transparent">
          <div className="border-b border-line-faint lg:border lg:bg-card">
            <div className="flex items-center justify-between gap-3 bg-card px-6 md:px-12 py-2.5 lg:px-6 lg:py-5 border-b border-line-faint">
              <button
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className={`lg:hidden flex min-h-11 items-center gap-2 text-gold-text ${label}`}
              >
                At a glance
                <ChevronDown
                  className={`size-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>
              <h2 className={`hidden lg:block text-gold-text ${label}`}>
                At a glance
              </h2>
              <Link
                to="/diagnostic"
                className="lg:hidden chromatic-hover bg-gold text-gold-ink px-3.5 py-3 text-center text-xs leading-5 tracking-[0.1em] uppercase font-medium transition-all duration-300 hover:bg-ink-em hover:text-page"
              >
                Start a Diagnostic
              </Link>
            </div>
            <dl
              id={panelId}
              className={`${isOpen ? 'block' : 'hidden'} lg:block max-h-[60vh] overflow-y-auto lg:max-h-none lg:overflow-visible bg-card`}
            >
              {rows.map((row) =>
                row ? (
                  <div
                    key={row.label}
                    className="flex flex-col gap-1 px-6 md:px-12 lg:px-6 py-3.5 border-b border-line-faint last:border-b-0"
                  >
                    <dt className={`text-ink-muted ${label}`}>{row.label}</dt>
                    <dd
                      data-testid={row.testId}
                      className="text-[15px] leading-6 text-ink"
                    >
                      {row.value}
                    </dd>
                  </div>
                ) : null,
              )}
            </dl>
          </div>

          <div className="hidden lg:flex flex-col items-start gap-4 mt-10">
            <p className="font-serif text-[26px] leading-8 text-ink-em">
              Ready to diagnose your friction?
            </p>
            <CtaLink to="/diagnostic" arrow>
              Start a Diagnostic
            </CtaLink>
          </div>
        </aside>

        <Reveal>
          <CaseStudyNarrative study={study} />
        </Reveal>
      </div>
    </section>
  )
}
