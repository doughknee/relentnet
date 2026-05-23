import { Link } from '@tanstack/react-router'

import type { CaseStudy } from '@/data/caseStudies'
import { caseStudies } from '@/data/caseStudies'

interface CaseStudyReadMoreProps {
  currentSlug: string
}

/**
 * "Read more customer stories" — 2-up tile band. Surfaces the case studies
 * immediately before and after the current one (wrapping around the list).
 * Mirrors Stripe /customers/figma's 2-up read-more band.
 */
export function CaseStudyReadMore({ currentSlug }: CaseStudyReadMoreProps) {
  const realStudies = caseStudies.filter(
    (s) => !s.slug.startsWith('placeholder-'),
  )
  const idx = realStudies.findIndex((s) => s.slug === currentSlug)
  if (idx === -1 || realStudies.length < 2) return null

  const prev = realStudies[(idx - 1 + realStudies.length) % realStudies.length]
  const next = realStudies[(idx + 1) % realStudies.length]
  const tiles: ReadonlyArray<CaseStudy> =
    prev.slug === next.slug ? [next] : [prev, next]

  return (
    <section className="relative z-10 px-6 md:px-12 py-20 md:py-24 border-t border-line-faint">
      <div className="max-w-7xl mx-auto">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-8">
          Read more customer stories
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line-faint">
          {tiles.map((tile) => (
            <Link
              key={tile.slug}
              to="/clients/$slug"
              params={{ slug: tile.slug }}
              className="group block bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              {tile.hero.image ? (
                <img
                  src={tile.hero.image.src}
                  alt={tile.hero.image.alt}
                  className="aspect-video w-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                  loading="lazy"
                />
              ) : null}
              <div className="p-6 md:p-8">
                <p className="mb-4 text-sm uppercase tracking-[0.2em] text-ink-muted">
                  {tile.industry}
                </p>
                <h3 className="font-serif text-xl md:text-2xl">{tile.name}</h3>
                <span className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold group-hover:gap-3 transition-all duration-300">
                  Read story →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
