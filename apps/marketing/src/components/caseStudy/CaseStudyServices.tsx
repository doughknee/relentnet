import type { CaseStudyServiceCategory } from '@/data/caseStudies'

import { useReveal } from '@/hooks/useReveal'

interface CaseStudyServicesProps {
  services: ReadonlyArray<CaseStudyServiceCategory>
}

/**
 * Roles / services breakdown near the bottom of the case study. Each
 * category becomes a column with a small uppercase label and bulleted
 * sub-items. Modeled on Instrument's "Our Roles" trio (Strategy /
 * Design / Content). Renders nothing when empty.
 */
export function CaseStudyServices({ services }: CaseStudyServicesProps) {
  const { ref, isRevealed } = useReveal(0.15)

  if (services.length === 0) {
    return null
  }

  return (
    <section
      ref={ref}
      className="relative z-10 px-6 md:px-12 py-20 md:py-28 border-t border-line"
    >
      <div className="max-w-6xl mx-auto">
        <h2
          className={`text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-12 ${
            isRevealed ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          Our roles
        </h2>
        <div className="grid gap-12 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {services.map((category, index) => (
            <div
              key={category.label}
              className={`${
                isRevealed ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={
                isRevealed
                  ? { animationDelay: `${100 + index * 120}ms` }
                  : undefined
              }
            >
              <h3 className="font-serif text-2xl text-ink-em mb-6">
                {category.label}
              </h3>
              <ul className="space-y-3">
                {category.items.map((item) => (
                  <li
                    key={item}
                    className="text-sm text-ink-sub leading-relaxed border-l border-line-faint pl-4"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
