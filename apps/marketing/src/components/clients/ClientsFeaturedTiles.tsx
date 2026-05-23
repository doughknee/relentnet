import { Link } from '@tanstack/react-router'

import { caseStudies } from '@/data/caseStudies'

/**
 * Featured tile row — 6 portrait tiles with image + logo overlay + read-story link.
 * Mirrors Stripe /customers's top featured row exactly.
 *
 * Renders the first 6 case studies. Each tile uses portraitImage if set, falling
 * back to hero.image. Stripe uses 3:4 portrait crops with bottom-aligned overlay.
 */
export function ClientsFeaturedTiles() {
  const tiles = caseStudies.slice(0, 6)
  if (tiles.length === 0) return null

  return (
    <section className="relative z-10 px-6 md:px-12 py-16 md:py-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-px bg-line-faint">
          {tiles.map((study, index) => {
            const image = study.portraitImage ?? study.hero.image
            return (
              <Link
                key={study.slug}
                to="/clients/$slug"
                params={{ slug: study.slug }}
                className="group relative block aspect-[3/4] overflow-hidden bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                {image ? (
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-serif text-2xl text-white">
                    {study.name}
                  </h3>
                  <span className="mt-3 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white group-hover:text-gold transition-colors">
                    Read story →
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
