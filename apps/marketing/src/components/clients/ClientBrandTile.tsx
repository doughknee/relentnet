import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import type { CaseStudy } from '@/data/caseStudies'

/**
 * Per-client brand palette for the index profile tiles, drawn from each
 * client's own product/site identity. `accent` colors the wordmark + monogram.
 */
export const CLIENT_BRANDS: Record<
  string,
  { from: string; to: string; accent?: string }
> = {
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

export function getClientBrand(slug: string) {
  return CLIENT_BRANDS[slug] ?? FALLBACK_BRAND
}

interface ClientBrandTileProps {
  study: CaseStudy
  /** Tailwind sizing classes for the tile root (aspect or fixed height). */
  className?: string
}

/**
 * Branded client profile card — a brand-colored gradient tile with the
 * industry label, serif wordmark, faint monogram, and "Read story". Used
 * across the clients hero collage and the by-engagement-type mosaic so the
 * page reads as branded cards rather than a row of screenshots.
 */
export function ClientBrandTile({
  study,
  className = 'aspect-[4/5]',
}: ClientBrandTileProps) {
  const brand = getClientBrand(study.slug)
  const wordmark = brand.accent ?? '#ffffff'

  return (
    <Link
      to="/clients/$slug"
      params={{ slug: study.slug }}
      className={`group relative block overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${className}`}
      style={{
        backgroundImage: `linear-gradient(150deg, ${brand.from}, ${brand.to})`,
      }}
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
          <h3
            className="font-serif text-2xl leading-tight"
            style={{ color: wordmark }}
          >
            {study.name}
          </h3>
          <span className="mt-2 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-white/80 transition-colors group-hover:text-gold">
            Read story
            <ArrowRight className="size-3" />
          </span>
        </div>
      </div>
    </Link>
  )
}
