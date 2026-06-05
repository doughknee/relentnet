import { Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

import { caseStudies } from '@/data/caseStudies'

const ALL_TABS = [
  { id: 'startup', label: 'Startup' },
  { id: 'growth', label: 'Growth' },
  { id: 'enterprise', label: 'Enterprise' },
] as const

type SizeTabId = (typeof ALL_TABS)[number]['id']

// Only surface tiers we actually have live case studies for, so the section
// never renders an empty tab. As the roster grows, tiers reappear automatically.
const TABS = ALL_TABS.filter((tab) =>
  caseStudies.some((s) => s.companySize === tab.id),
)

const CARDS_PER_TAB = 3

/**
 * "Customers by size" — a tab per populated size tier (Startup / Growth /
 * Enterprise) over a 3-card grid. Each card shows the case study's first stat
 * (or featuredStat), a flat stack tag list with "+N more", and a landscape
 * image at the bottom.
 *
 * Tiers with no live case study are not rendered as tabs.
 */
export function ClientsBySize() {
  const [active, setActive] = useState<SizeTabId>(
    TABS[0]?.id ?? 'startup',
  )

  const visible = useMemo(() => {
    const inTab = caseStudies.filter((s) => s.companySize === active)
    return inTab.slice(0, CARDS_PER_TAB)
  }, [active])

  if (TABS.length === 0) return null

  return (
    <section
      id="all-stories"
      className="relative z-10 px-6 md:px-12 py-20 md:py-28 border-t border-line-faint"
    >
      <div className="max-w-7xl mx-auto">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-ink-muted mb-3">
          Customers by size
        </p>
        <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl max-w-3xl mb-12 md:mb-16">
          Companies of all sizes turn diagnosed friction into useful systems.
        </h2>

        <div
          role="group"
          aria-label="Filter customers by company size"
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

        {visible.length === 0 ? (
          <p className="text-sm text-ink-muted">
            No case studies assigned to this size yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {visible.map((study) => {
              const stack = (study.atAGlance.stack ?? []).flatMap(
                (c) => c.items,
              )
              const visibleStack = stack.slice(0, 3)
              const moreCount = Math.max(0, stack.length - visibleStack.length)
              return (
                <Link
                  key={study.slug}
                  to="/clients/$slug"
                  params={{ slug: study.slug }}
                  className="group block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  {study.featuredStat ? (
                    <>
                      <p className="font-serif text-3xl md:text-4xl text-ink-em leading-none">
                        {study.featuredStat.value}
                      </p>
                      <p className="mt-2 text-sm text-ink-sub">
                        {study.featuredStat.description}
                      </p>
                    </>
                  ) : (
                    <p className="font-serif text-3xl md:text-4xl text-ink-em leading-none">
                      {study.name}
                    </p>
                  )}

                  {visibleStack.length > 0 ? (
                    <>
                      <p className="mt-6 text-[10px] font-bold tracking-[0.3em] uppercase text-ink-muted mb-3">
                        Stack used
                      </p>
                      <ul className="flex flex-wrap gap-x-4 gap-y-2">
                        {visibleStack.map((item) => (
                          <li key={item.label} className="text-xs text-ink-sub">
                            {item.label}
                          </li>
                        ))}
                        {moreCount > 0 ? (
                          <li className="text-xs text-gold">
                            + {moreCount} more
                          </li>
                        ) : null}
                      </ul>
                    </>
                  ) : null}

                  {study.hero.image ? (
                    <img
                      src={study.hero.image.src}
                      alt={study.hero.image.alt}
                      className="mt-6 aspect-video w-full object-cover transition-opacity duration-300 group-hover:opacity-80"
                      loading="lazy"
                    />
                  ) : null}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
