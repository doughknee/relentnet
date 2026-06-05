import { useMemo, useState } from 'react'

import { ClientBrandTile } from './ClientBrandTile'
import type { EngagementType } from '@/data/caseStudies'
import { Reveal } from '@/components/Reveal'
import { caseStudies } from '@/data/caseStudies'

const TABS: ReadonlyArray<{ id: EngagementType; label: string }> = [
  { id: 'product', label: 'Product' },
  { id: 'operations', label: 'Operations' },
  { id: 'platform', label: 'Platform' },
]

const TILES_PER_TAB = 6

/**
 * "Customers by engagement type" — 3 tabs (Product / Operations / Platform)
 * swap a grid of branded client profile tiles. Mirrors Stripe /customers's
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
        <Reveal>
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-ink-muted mb-3">
            Customers by engagement type
          </p>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl max-w-3xl mb-12 md:mb-16">
            We accelerate growth for all types of operations.
          </h2>
        </Reveal>

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
          <div
            key={active}
            className={`grid grid-cols-1 gap-px bg-line-faint animate-fade-in-up ${
              tiles.length === 1 ? 'md:grid-cols-1' : 'md:grid-cols-2'
            }`}
          >
            {tiles.map((study) => (
              <ClientBrandTile
                key={study.slug}
                study={study}
                className="h-64 md:h-72"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
