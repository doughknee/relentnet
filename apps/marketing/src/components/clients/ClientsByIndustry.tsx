import { Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

import { caseStudies } from '@/data/caseStudies'

export function ClientsByIndustry() {
  const industries = useMemo(() => {
    const seen = new Set<string>()
    const out: Array<string> = []
    for (const study of caseStudies) {
      if (!seen.has(study.industry)) {
        seen.add(study.industry)
        out.push(study.industry)
      }
    }
    return out
  }, [])

  const [active, setActive] = useState<string>(industries[0] ?? '')

  const visible = useMemo(
    () => caseStudies.filter((s) => s.industry === active),
    [active],
  )

  if (industries.length === 0) return null

  return (
    <section className="relative z-10 px-6 md:px-12 py-20 md:py-24">
      <div className="max-w-7xl mx-auto">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-3">
          By industry vertical
        </p>
        <h2 className="font-serif text-3xl md:text-5xl mb-8">
          Where we have worked
        </h2>

        <div
          role="group"
          aria-label="Filter by industry"
          className="flex flex-wrap gap-2 border-b border-line mb-10"
        >
          {industries.map((industry) => {
            const isActive = industry === active
            return (
              <button
                key={industry}
                aria-pressed={isActive}
                type="button"
                onClick={() => setActive(industry)}
                className={`px-4 py-3 text-xs uppercase tracking-[0.2em] border-b-2 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                  isActive
                    ? 'border-gold text-gold'
                    : 'border-transparent text-ink-muted hover:text-ink'
                }`}
              >
                {industry}
              </button>
            )
          })}
        </div>

        <ul className="flex gap-6 overflow-x-auto pb-2">
          {visible.map((study) => (
            <li key={study.slug} className="flex-shrink-0 w-72">
              <Link
                to="/clients/$slug"
                params={{ slug: study.slug }}
                className="group block border border-line bg-card p-5 hover:border-gold transition-colors h-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold">
                  {study.systemType}
                </span>
                <h3 className="mt-3 font-serif text-xl">{study.name}</h3>
                <p className="mt-3 text-sm text-ink-sub leading-relaxed line-clamp-3">
                  {study.hero.tagline}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
