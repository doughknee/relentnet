import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

interface CtaTile {
  headline: string
  body: string
  label: string
  to: '/diagnostic' | '/inquire' | '/process'
}

const TILES: ReadonlyArray<CtaTile> = [
  {
    headline: "Always know what you'll pay",
    body: 'Fixed-fee diagnostic. Transparent engagement pricing after. No mystery retainers.',
    label: 'Start a Diagnostic',
    to: '/diagnostic',
  },
  {
    headline: 'Start a conversation',
    body: "Tell us about your business and we'll point you to the highest-friction surface to start on.",
    label: 'Inquire',
    to: '/inquire',
  },
]

export const clientsCta = {
  headline: TILES[0].headline,
  body: TILES[0].body,
  label: TILES[0].label,
  to: TILES[0].to,
} as const

/**
 * 2-tile bottom CTA pair, used on both /clients index and /clients/$slug.
 * Mirrors Stripe /customers's bottom 2-tile CTA pair. Replaces the older
 * 3-panel ClosingCtaPanels block.
 */
export function ClosingCtaPair() {
  return (
    <section className="relative z-10 px-6 md:px-12 py-20 md:py-28 border-t border-line-faint">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 max-w-7xl mx-auto">
        {TILES.map((tile) => (
          <div key={tile.headline} className="flex flex-col">
            <h3 className="font-serif text-3xl md:text-4xl mb-4">
              {tile.headline}
            </h3>
            <p className="text-ink-sub text-base leading-relaxed mb-6 max-w-md">
              {tile.body}
            </p>
            <Link
              to={tile.to}
              className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-gold hover:gap-3 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              {tile.label}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
