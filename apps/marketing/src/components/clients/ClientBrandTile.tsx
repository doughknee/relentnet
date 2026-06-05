import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import type { CaseStudy } from '@/data/caseStudies'

/**
 * Per-client accent for the index profile tiles. Kept subtle — a soft
 * brand-tinted surface — so the tiles sit inside the site's gold/ink palette
 * instead of fighting it. `accent` wins over `from` for the tint when set.
 */
export const CLIENT_BRANDS: Record<
  string,
  { from: string; accent?: string }
> = {
  scrollr: { from: '#6366f1' },
  'cambridge-building-group': { from: '#1e3a5f', accent: '#c79a2e' },
  courtcommand: { from: '#0891b2' },
  'vm-homes': { from: '#0d9488' },
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
 * Branded client profile card. Soft brand-tinted light surface in light mode,
 * near-black in dark, with a faint brand glow, a serif wordmark, an industry
 * label, a ghosted monogram, and a gold "Read story". Used across the clients
 * hero collage and the by-engagement-type mosaic.
 */
export function ClientBrandTile({
  study,
  className = 'aspect-[4/5]',
}: ClientBrandTileProps) {
  const brand = getClientBrand(study.slug)
  const tint = brand.accent ?? brand.from

  return (
    <Link
      to="/clients/$slug"
      params={{ slug: study.slug }}
      className={`group relative block overflow-hidden border border-line-faint shadow-sm dark:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${className}`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 dark:hidden"
        style={{
          backgroundImage: `linear-gradient(150deg, ${tint}26 0%, #f3f3f1 55%, #eae9e6 100%)`,
        }}
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 hidden dark:block"
        style={{
          backgroundImage:
            'linear-gradient(155deg, #16171c 0%, #0a0b0e 100%)',
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-12 size-44 rounded-full opacity-30 blur-3xl transition-opacity duration-500 group-hover:opacity-50"
        style={{ backgroundColor: tint }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 -right-3 select-none font-serif text-[10rem] leading-none text-ink/[0.06] transition-transform duration-500 group-hover:scale-110"
      >
        {study.name.charAt(0)}
      </span>
      <div className="absolute inset-0 flex flex-col justify-between p-5">
        <p className="text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          {study.industry}
        </p>
        <div>
          <h3 className="font-serif text-2xl leading-tight text-ink-em">
            {study.name}
          </h3>
          <span className="mt-2 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-gold/90 transition-colors group-hover:text-gold">
            Read story
            <ArrowRight className="size-3" />
          </span>
        </div>
      </div>
    </Link>
  )
}
