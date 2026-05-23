import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { caseStudies } from '@/data/caseStudies'

export function ClientsFeaturedEngagement() {
  const featured = caseStudies.find((s) => s.featured === true)
  if (!featured) return null

  const stackItems = (featured.atAGlance.stack ?? []).flatMap((c) => c.items)

  return (
    <section className="relative z-10 px-6 md:px-12 py-24 md:py-32 border-y border-line bg-surface backdrop-blur-xs">
      <div className="max-w-7xl mx-auto">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-3">
          Building together
        </p>
        <h2 className="font-serif text-3xl md:text-5xl mb-12">
          Featured engagement
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-7">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold">
              {featured.industry}
            </span>
            <h3 className="mt-3 font-serif text-4xl md:text-6xl">
              {featured.name}
            </h3>
            <p className="mt-5 text-base md:text-lg text-ink-sub leading-relaxed">
              {featured.hero.tagline}
            </p>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-3">
                  Challenge
                </p>
                <p className="text-sm text-ink-sub leading-relaxed">
                  {featured.summary.problem}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-3">
                  Solution
                </p>
                <p className="text-sm text-ink-sub leading-relaxed">
                  {featured.summary.build}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-3">
                  Results
                </p>
                <p className="text-sm text-ink-sub leading-relaxed">
                  {featured.summary.outcome}
                </p>
              </div>
            </div>

            <Link
              to="/clients/$slug"
              params={{ slug: featured.slug }}
              className="group mt-10 inline-flex items-center gap-2 border border-gold bg-gold px-7 py-4 text-sm uppercase tracking-widest text-black transition-all duration-300 hover:bg-transparent hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              Read full case study
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="lg:col-span-5">
            {featured.hero.image ? (
              <div className="border border-line-faint bg-inset aspect-video overflow-hidden">
                <img
                  src={featured.hero.image.src}
                  alt={featured.hero.image.alt}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            ) : null}

            {stackItems.length > 0 ? (
              <div className="mt-6 border border-line-faint bg-card p-5">
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-ink-muted mb-3">
                  Stack
                </p>
                <ul className="flex flex-wrap gap-2">
                  {stackItems.slice(0, 8).map((item) => (
                    <li
                      key={item.label}
                      className="border border-line-faint bg-inset px-3 py-1.5 text-xs text-ink-sub"
                    >
                      {item.label}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
