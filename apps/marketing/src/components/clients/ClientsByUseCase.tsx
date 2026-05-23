import { Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

import type { EngagementType } from '@/data/caseStudies'
import { caseStudies } from '@/data/caseStudies'

const TABS: ReadonlyArray<{ id: EngagementType; label: string }> = [
  { id: 'product', label: 'Product' },
  { id: 'operations', label: 'Operations' },
  { id: 'platform', label: 'Platform' },
]

const TILES_PER_TAB = 6

/**
 * "Customers by engagement type" — 3 tabs (Product / Operations / Platform)
 * swap a 2-column mixed-aspect image mosaic. Mirrors Stripe /customers's
 * "Customers by use case" section structurally.
 */
export function ClientsByUseCase() {
  const [active, setActive] = useState<EngagementType>('product')

  const tiles = useMemo(() => {
    return caseStudies
      .filter((s) => s.engagementType === active)
      .slice(0, TILES_PER_TAB)
  }, [active])

  return (
    <section className="relative z-10 px-6 md:px-12 py-20 md:py-28 border-t border-line-faint">
      <div className="max-w-7xl mx-auto">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-ink-muted mb-3">
          Customers by engagement type
        </p>
        <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl max-w-3xl mb-12 md:mb-16">
          We accelerate growth for all types of operations.
        </h2>

        <div
          role="group"
          aria-label="Filter customers by engagement type"
          className="flex flex-wrap gap-8 border-b border-line-faint mb-12"
        >
          {TABS.map((tab) => {
            const isActive = tab.id === active
            return (
              <button
                key={tab.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActive(tab.id)}
                className={`pb-4 -mb-px text-sm uppercase tracking-[0.2em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                  isActive
                    ? 'text-gold border-b-2 border-gold'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {tiles.length === 0 ? (
          <p className="text-sm text-ink-muted">
            No case studies in this category yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line-faint">
            {tiles.map((study, index) => {
              const image = study.hero.image ?? study.portraitImage
              const aspectClass =
                index % 2 === 0 ? 'aspect-[16/10]' : 'aspect-[4/3]'
              return (
                <Link
                  key={study.slug}
                  to="/clients/$slug"
                  params={{ slug: study.slug }}
                  className="group relative block overflow-hidden bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  {image ? (
                    <img
                      src={image.src}
                      alt={image.alt}
                      className={`${aspectClass} w-full object-cover transition duration-500 group-hover:scale-[1.03]`}
                      loading="lazy"
                    />
                  ) : (
                    <div className={`${aspectClass} w-full bg-inset`} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/80">
                      {study.industry}
                    </p>
                    <h3 className="mt-2 font-serif text-2xl text-white">
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
        )}
      </div>
    </section>
  )
}
