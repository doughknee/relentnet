import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

interface CtaPanel {
  headline: string
  body: string
  primaryLabel: string
  primaryTo: '/diagnostic' | '/inquire' | '/process'
  secondaryLabel?: string
  secondaryTo?: '/diagnostic' | '/inquire' | '/process'
}

const PANELS: ReadonlyArray<CtaPanel> = [
  {
    headline: 'Ready to diagnose your friction?',
    body: 'Start with a workflow diagnostic before deciding what should be built. We listen first.',
    primaryLabel: 'Start a Diagnostic',
    primaryTo: '/diagnostic',
    secondaryLabel: 'Contact us',
    secondaryTo: '/inquire',
  },
  {
    headline: "Always know what you'll get.",
    body: 'Fixed-scope diagnostic. Transparent engagement pricing after. No mystery retainers.',
    primaryLabel: 'See our process',
    primaryTo: '/process',
  },
  {
    headline: 'Need to talk it through first?',
    body: "Tell us about your business and we'll point you to the highest-friction surface to start on.",
    primaryLabel: 'Inquire',
    primaryTo: '/inquire',
  },
]

export const clientsCta = {
  headline: PANELS[0].headline,
  body: PANELS[0].body,
  label: PANELS[0].primaryLabel,
  to: PANELS[0].primaryTo,
} as const

/**
 * 3-panel closing CTA block, used on both the /clients index and on
 * /clients/$slug detail pages. Mirrors Stripe /customers's bottom 3-panel pattern.
 */
export function ClosingCtaPanels() {
  return (
    <section className="relative z-10 px-6 md:px-12 py-20 md:py-28 border-t border-line-faint">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 max-w-7xl mx-auto">
        {PANELS.map((panel) => (
          <div key={panel.headline} className="flex flex-col">
            <h3 className="font-serif text-3xl md:text-4xl mb-4">
              {panel.headline}
            </h3>
            <p className="text-ink-sub text-base leading-relaxed mb-6">
              {panel.body}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <Link
                to={panel.primaryTo}
                className="inline-flex items-center justify-center gap-3 border border-gold bg-gold px-7 py-4 text-sm uppercase tracking-widest text-black transition-all duration-300 hover:bg-transparent hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                {panel.primaryLabel}
                <ArrowRight className="size-4" />
              </Link>
              {panel.secondaryLabel && panel.secondaryTo ? (
                <Link
                  to={panel.secondaryTo}
                  className="inline-flex items-center justify-center gap-3 border border-line px-7 py-4 text-sm uppercase tracking-widest text-ink transition-all duration-300 hover:border-gold hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  {panel.secondaryLabel}
                </Link>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
