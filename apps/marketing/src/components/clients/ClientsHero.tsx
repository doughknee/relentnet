import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import type { CaseStudy } from '@/data/caseStudies'
import { caseStudies } from '@/data/caseStudies'

export const clientsIntro = {
  eyebrow: 'Customer stories',
  headline: 'The diagnostic-first studio behind systems that move cleaner.',
  body: "We're building a practice for ambitious operators who would rather understand the friction in their workflow than buy more software to mask it. Our engagements turn diagnosed friction into useful systems that help real businesses move cleaner — across construction, consumer software, sports tech, and real estate.",
} as const

interface ClientsHeroProps {
  /** Anchor target for the "See all stories" CTA. */
  scrollTargetId: string
}

/**
 * Per-client brand palette for the hero profile tiles. Drawn from each
 * client's own product/site identity so the collage reads as branded cards
 * rather than a row of screenshots. `accent` colors the wordmark + monogram.
 */
const BRANDS: Record<string, { from: string; to: string; accent?: string }> = {
  scrollr: { from: '#4f46e5', to: '#0b1020' },
  'cambridge-building-group': {
    from: '#13294b',
    to: '#081019',
    accent: '#e1be4c',
  },
  courtcommand: { from: '#0891b2', to: '#06212e' },
  'vm-homes': { from: '#0d9488', to: '#062420' },
}
const FALLBACK_BRAND = { from: '#3f3f46', to: '#18181b' }

function HeroTile({ study }: { study: CaseStudy }) {
  const brand = BRANDS[study.slug] ?? FALLBACK_BRAND
  const wordmark = brand.accent ?? '#ffffff'
  return (
    <Link
      to="/clients/$slug"
      params={{ slug: study.slug }}
      className="group relative block aspect-[4/5] overflow-hidden border border-line-faint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      style={{ backgroundImage: `linear-gradient(150deg, ${brand.from}, ${brand.to})` }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 -right-3 font-serif leading-none text-[10rem] select-none transition-transform duration-500 group-hover:scale-110"
        style={{ color: `${wordmark}1f` }}
      >
        {study.name.charAt(0)}
      </span>
      <div className="absolute inset-0 flex flex-col justify-between p-5">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/55">
          {study.industry}
        </p>
        <div>
          <h2
            className="font-serif text-2xl leading-tight"
            style={{ color: wordmark }}
          >
            {study.name}
          </h2>
          <span className="mt-2 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-white/80 transition-colors group-hover:text-gold">
            Read story
            <ArrowRight className="size-3" />
          </span>
        </div>
      </div>
    </Link>
  )
}

export function ClientsHero({ scrollTargetId }: ClientsHeroProps) {
  const tiles = caseStudies.slice(0, 4)
  const colA = tiles.filter((_, i) => i % 2 === 0)
  const colB = tiles.filter((_, i) => i % 2 === 1)

  return (
    <section className="relative z-10 px-6 md:px-12 pt-32 md:pt-40 pb-16 md:pb-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-center">
        <div className="lg:col-span-6">
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-6">
            {clientsIntro.eyebrow}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
            {clientsIntro.headline}
          </h1>
          <p className="mt-8 max-w-xl text-ink-sub text-base md:text-lg leading-relaxed">
            {clientsIntro.body}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <a
              href={`#${scrollTargetId}`}
              className="inline-flex items-center justify-center gap-3 border border-gold bg-gold px-7 py-4 text-sm uppercase tracking-widest text-black transition-all duration-300 hover:bg-transparent hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              See all stories
              <ArrowRight className="size-4" />
            </a>
            <Link
              to="/diagnostic"
              className="inline-flex items-center justify-center gap-3 border border-line px-7 py-4 text-sm uppercase tracking-widest text-ink transition-all duration-300 hover:border-gold hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              Start a Diagnostic
            </Link>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="grid grid-cols-2 gap-4 md:gap-5">
            <div className="flex flex-col gap-4 md:gap-5">
              {colA.map((study) => (
                <HeroTile key={study.slug} study={study} />
              ))}
            </div>
            <div className="flex flex-col gap-4 md:gap-5 lg:mt-12">
              {colB.map((study) => (
                <HeroTile key={study.slug} study={study} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
