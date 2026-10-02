import { Link } from '@tanstack/react-router'

import { label } from './label'
import type { CaseStudy } from '@/data/caseStudies'
import { Reveal } from '@/components/Reveal'
import { caseStudies } from '@/data/caseStudies'

interface CaseStudyReadMoreProps {
  currentSlug: string
}

/**
 * "Read more client stories": 2-up tile band. Surfaces the case studies
 * immediately before and after the current one (wrapping around the list).
 */
export function CaseStudyReadMore({ currentSlug }: CaseStudyReadMoreProps) {
  const idx = caseStudies.findIndex((s) => s.slug === currentSlug)
  if (idx === -1 || caseStudies.length < 2) return null

  const prev = caseStudies[(idx - 1 + caseStudies.length) % caseStudies.length]
  const next = caseStudies[(idx + 1) % caseStudies.length]
  const tiles: ReadonlyArray<CaseStudy> =
    prev.slug === next.slug ? [next] : [prev, next]

  return (
    <section className="relative z-10 px-6 md:px-12 pt-12 pb-14 md:pt-20 md:pb-24 border-t border-line-faint">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <h2 className={`mb-5 md:mb-8 text-gold-text ${label}`}>
            Read more client stories
          </h2>
        </Reveal>
        <Reveal
          delay={100}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6"
        >
          {tiles.map((tile) => (
            <Link
              key={tile.slug}
              to="/clients/$slug"
              params={{ slug: tile.slug }}
              className="group flex h-full flex-col border border-line-faint bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              {tile.hero.image ? (
                <img
                  src={tile.hero.image.src}
                  alt={tile.hero.image.alt}
                  className="aspect-video w-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                  loading="lazy"
                />
              ) : null}
              <div className="flex flex-col gap-3 px-5 pt-5 pb-6 md:px-8 md:pt-7 md:pb-8">
                <p className={`text-ink-muted ${label}`}>{tile.industry}</p>
                <h3 className="font-serif text-[26px] leading-[30px] text-ink-em">
                  {tile.name}
                </h3>
                {tile.featuredStat ? (
                  <p className="text-[15px] leading-6 text-ink-sub">
                    {tile.featuredStat.joinsValue
                      ? `${tile.featuredStat.value} ${tile.featuredStat.description}`
                      : tile.featuredStat.description}
                  </p>
                ) : null}
                <span className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.1em] text-gold-text group-hover:gap-3 transition-all duration-300">
                  Read story →
                </span>
              </div>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
