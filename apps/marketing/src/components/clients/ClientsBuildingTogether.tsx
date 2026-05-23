import { useState } from 'react'

import { caseStudies } from '@/data/caseStudies'

/**
 * "Building together" — vertical sidebar tabs (on lg:) listing each case study,
 * with the active tab revealing a Challenge / Solution / Stack deep-dive + large
 * product image. Mirrors Stripe /customers's "Building together" section.
 *
 * Uses only the 5 real case studies (skips placeholders) so the section reads
 * as authentic depth rather than promised depth.
 */
export function ClientsBuildingTogether() {
  const realStudies = caseStudies.filter(
    (s) => !s.slug.startsWith('placeholder-'),
  )
  const [activeSlug, setActiveSlug] = useState<string>(
    realStudies[0]?.slug ?? '',
  )
  const active =
    realStudies.find((s) => s.slug === activeSlug) ?? realStudies[0]

  // Runtime guard: realStudies can be empty if every case study has a
  // placeholder slug. TS narrows realStudies[0] to CaseStudy (not undefined)
  // because noUncheckedIndexedAccess is off, but the value is genuinely
  // optional at runtime.
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!active) return null

  const stack = (active.atAGlance.stack ?? []).flatMap((c) => c.items)

  return (
    <section className="relative z-10 px-6 md:px-12 py-20 md:py-28 border-t border-line-faint bg-surface backdrop-blur-xs">
      <div className="max-w-7xl mx-auto">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-3">
          Building together
        </p>
        <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl max-w-3xl mb-6">
          We partner with operators to build breakthrough systems.
        </h2>
        <p className="text-ink-sub text-base md:text-lg leading-relaxed max-w-2xl mb-16 md:mb-20">
          Every engagement starts with a diagnostic. Every system we build is
          scoped to the friction we found. The case studies below show how that
          played out across very different operations.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div
            role="group"
            aria-label="Select a case study"
            className="lg:col-span-3"
          >
            {realStudies.map((study) => {
              const isActive = study.slug === activeSlug
              return (
                <button
                  key={study.slug}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveSlug(study.slug)}
                  className={`block w-full text-left px-0 py-4 border-b border-line-faint text-sm uppercase tracking-[0.2em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                    isActive
                      ? 'text-gold border-l-2 border-l-gold pl-4 -ml-4'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  {study.name}
                </button>
              )
            })}
          </div>

          <div className="lg:col-span-9">
            <h3 className="font-serif text-3xl md:text-4xl mb-8">
              How we built with {active.name}
            </h3>

            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-3">
              Challenge
            </p>
            <p className="text-ink-sub text-sm md:text-base leading-relaxed mb-8">
              {active.summary.problem}
            </p>

            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-3">
              Solution
            </p>
            <p className="text-ink-sub text-sm md:text-base leading-relaxed mb-8">
              {active.summary.build}
            </p>

            {stack.length > 0 ? (
              <>
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-3">
                  Stack
                </p>
                <ul className="flex flex-wrap gap-2 mb-12">
                  {stack.map((item) => (
                    <li
                      key={item.label}
                      className="text-xs text-ink-sub border border-line-faint bg-inset px-3 py-1.5"
                    >
                      {item.label}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            {active.hero.image ? (
              <img
                src={active.hero.image.src}
                alt={active.hero.image.alt}
                className="w-full aspect-video object-cover"
                loading="lazy"
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
