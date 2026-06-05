import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import type { CaseStudy } from '@/data/caseStudies'

/**
 * Per-client accent for the index profile tiles. Kept subtle — a single
 * brand-tinted glow over a near-black card — so the tiles sit inside the
 * site's gold/ink palette instead of fighting it. `accent` wins over `from`
 * for the glow when set.
 */
export const CLIENT_BRANDS: Record<
  string,
  { from: string; accent?: string }
> = {
  scrollr: { from: '#6366f1' },
  'cambridge-building-group': { from: '#13294b', accent: '#e1be4c' },
  courtcommand: { from: '#22d3ee' },
  'vm-homes': { from: '#2dd4bf' },
}

const FALLBACK_BRAND = { from: '#a3a3a3' }

export function getClientBrand(slug: string) {
  return CLIENT_BRANDS[slug] ?? FALLBACK_BRAND
}

interface ClientBrandTileProps {
  study: CaseStudy
  /** Tailwind sizing classes for the tile root (aspect or fixed height). */
  className?: string
}

/**
 * Branded client profile card — a near-black card with a faint brand-tinted
 * glow, a serif wordmark, an industry label, a ghosted monogram, and a gold
 * "Read story" link. Used across the clients hero collage and the
 * by-engagement-type mosaic.
 */
export function ClientBrandTile({
  study,
  className = 'aspect-[4/5]',
}: ClientBrandTileProps) {
  const brand = getClientBrand(study.slug)
  const glow = brand.accent ?? brand.from

  return (
    <Link
      to="/clients/$slug"
      params={{ slug: study.slug }}
      className={`group relative block overflow-hidden border border-line-faint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${className}`}
      style={{ backgroundImage: 'linear-gradient(155deg, #16171c 0%, #0a0b0e 100%)' }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-12 size-44 rounded-full opacity-25 blur-3xl transition-opacity duration-500 group-hover:opacity-45"
        style={{ backgroundColor: glow }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 -right-3 select-none font-serif text-[10rem] leading-none text-white/[0.05] transition-transform duration-500 group-hover:scale-110"
      >
        {study.name.charAt(0)}
      </span>
      <div className="absolute inset-0 flex flex-col justify-between p-5">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">
          {study.industry}
        </p>
        <div>
          <h3 className="font-serif text-2xl leading-tight text-white">
            {study.name}
          </h3>
          <span className="mt-2 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-gold/80 transition-colors group-hover:text-gold">
            Read story
            <ArrowRight className="size-3" />
          </span>
        </div>
      </div>
    </Link>
  )
}
