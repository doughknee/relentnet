import { clientLogos } from '@/data/clientLogos'

/**
 * Logo strip — flat horizontal row of client logos with no heading.
 * Mirrors Stripe /customers's logo strip exactly.
 */
export function ClientsLogoStrip() {
  return (
    <section className="relative z-10 px-6 md:px-12 py-12 md:py-16 border-t border-b border-line-faint">
      <div className="max-w-7xl mx-auto">
        <ul className="flex flex-wrap items-center justify-center md:justify-between gap-x-12 gap-y-6 text-ink-muted">
          {clientLogos.map((logo) => (
            <li
              key={logo.name}
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              <img
                src={logo.logoSrc}
                alt={logo.name}
                className="h-6 md:h-8 w-auto"
                loading="lazy"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
