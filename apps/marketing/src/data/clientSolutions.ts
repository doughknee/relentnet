export interface ClientSolutionImage {
  src: string
  alt: string
  width: number
  height: number
}

export interface ClientSolution {
  label: string
  href: '/diagnostic' | '/process' | '/inquire' | '/clients'
  image: ClientSolutionImage
}

/**
 * Solution chips for the /clients "Customers by solution" section.
 * Each chip pairs a RelentNet capability with a decorative screenshot of
 * real client work. Mirrors Stripe /customers's by-solution structure.
 */
export const clientSolutions: ReadonlyArray<ClientSolution> = [
  {
    label: 'Diagnose workflow friction',
    href: '/diagnostic',
    image: {
      src: '/case-studies/vm-homes/listings.webp',
      alt: 'VM Homes live MLS listings, built into the brand after diagnosing the buyer journey',
      width: 1600,
      height: 956,
    },
  },
  {
    label: 'Rebuild brittle systems',
    href: '/process',
    image: {
      src: '/case-studies/scrollr/catalog-dark.webp',
      alt: 'Scrollr source catalog after rebuild, showing decoupled channel architecture',
      width: 1600,
      height: 954,
    },
  },
  {
    label: 'Ship cross-platform products',
    href: '/process',
    image: {
      src: '/case-studies/scrollr/settings-ticker-dark.webp',
      alt: 'Scrollr settings panel running natively on desktop',
      width: 1600,
      height: 954,
    },
  },
  {
    label: 'Stage credibility for sales',
    href: '/process',
    image: {
      src: '/case-studies/cambridge-building-group/values.webp',
      alt: 'Cambridge Building Group core-values section in the firm’s navy-and-gold identity',
      width: 1600,
      height: 956,
    },
  },
  {
    label: 'Build premium client experiences',
    href: '/process',
    image: {
      src: '/vmh_portfolio.png',
      alt: 'VM Homes premium real estate site preview',
      width: 1440,
      height: 810,
    },
  },
  {
    label: 'Operate real-time infrastructure',
    href: '/process',
    image: {
      src: '/case-studies/courtcommand/hero.webp',
      alt: 'CourtCommand, a real-time pickleball tournament and broadcast platform on a Go and Redis core',
      width: 1600,
      height: 1000,
    },
  },
  {
    label: 'Communicate mission clearly',
    href: '/clients',
    image: {
      src: '/case-studies/scrollr/theme-tokyo-night-dark.webp',
      alt: 'Tokyo Night themed Scrollr configuration UI',
      width: 1600,
      height: 954,
    },
  },
  {
    label: 'Steward systems over time',
    href: '/inquire',
    image: {
      src: '/case-studies/scrollr/hero-sports-dark.webp',
      alt: 'Scrollr in production, ongoing stewardship after launch',
      width: 1600,
      height: 954,
    },
  },
]
