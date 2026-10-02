/** One published way of working with us. */
export interface PricingEntry {
  price: string
  terms: string
  /** How long it takes. Set only where a duration is published; the
   *  engagement rows show a "How long" cell only when this exists. */
  duration?: string
}

/** The Diagnostic's guarantee. Brandon decides the terms; while this is
 *  undefined the guarantee band, the hero chip and the hero tick are all
 *  hidden. */
export interface DiagnosticGuarantee {
  /** Finishes the sentence "Worth $2,000, or ...". */
  headline: string
  /** The terms, in a sentence or two. */
  terms: string
  /** The window and conditions, shown beside "If you build". */
  window: string
}

/** One worked, all-in example build. */
export interface PriceExample {
  name: string
  description: string
  /** One-time build price. */
  build: string
  /** Monthly run price. */
  run: string
  /** Build plus 12 months of run. */
  total: string
}

/** Published prices. Brandon approved these numbers 2026-10-02; every page
 *  that quotes a price reads from here. No hourly or embedded rate is
 *  published. */
const pricing: {
  diagnostic: PricingEntry & { guarantee?: DiagnosticGuarantee }
  build: PricingEntry
  website: PricingEntry
  run: PricingEntry
  /** Worked all-in examples for /diagnostic. Empty until Brandon approves
   *  real ones; the section does not render while this is empty. */
  examples: Array<PriceExample>
} = {
  diagnostic: {
    price: '$2,000',
    terms: 'Fixed. Credited toward the build if you sign within 60 days.',
  },
  build: {
    price: 'From $6,000',
    terms:
      'Most automation engagements run $10,000 to $25,000 over 4 to 10 weeks.',
    duration: '4 to 10 weeks',
  },
  website: {
    price: 'From $5,000',
    terms: 'A marketing site, priced on its own.',
  },
  run: {
    price: 'From $350 a month',
    terms:
      'Hosting, monitoring, and fixes. Improvement retainers are scoped per system.',
  },
  examples: [],
}

/** Founder details Brandon has not supplied yet. The homepage renders each
 *  one only once it is set. */
export interface FounderProfile {
  /** A prior credential for the hero founder card, in one line. */
  credential?: string
  /** Full LinkedIn profile URL. */
  linkedin?: string
}

/** Keyed by the names in `founders` (routes/about.tsx). */
const founders: Record<'Brandon Harris' | 'Daniel Velez', FounderProfile> = {
  'Brandon Harris': {},
  'Daniel Velez': {},
}

export const siteConfig = {
  name: 'RelentNet',
  domain: 'https://relentnet.com',
  contact: {
    email: 'inquiries@relentnet.com',
    phone: '858-859-1851',
    phoneFormatted: '+1 (858) 859-1851',
    /** Cal.com or Calendly link for the 20-minute call. Brandon fills this in;
     *  while it is empty the /inquire booking button is not rendered. */
    bookingUrl: '',
    hours: '9am - 5pm CST (Mon-Fri)',
  },
  regions: ['Tennessee', 'Louisiana', 'Georgia', 'Florida'],
  /** Both founders' cities. Brandon reaches Georgia and Tennessee from
   *  Nashville, Dan covers Louisiana and Florida from New Orleans, which is
   *  why `regions` is those four and not some other four. */
  locations: [
    { city: 'Nashville', state: 'TN' },
    { city: 'New Orleans', state: 'LA' },
  ],
  meta: {
    title: 'RelentNet | Workflow Diagnostic & Technology Stewardship',
    description:
      'White-glove technology partnership for owner-led businesses. We diagnose operational friction with a workflow diagnostic, then clarify what technology is worth building.',
    ogImage: '/og-default.png',
  },
  pricing,
  founders,
  social: {
    // Add social links here if available
  },
}
