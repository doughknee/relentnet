/** One published way of working with us. */
export interface PricingEntry {
  price: string
  terms: string
  /** How long it takes. Set only where a duration is published; the
   *  engagement rows show a "How long" cell only when this exists. */
  duration?: string
}

/** The Diagnostic's guarantee. Unset it and the guarantee band, the hero chip
 *  and the hero tick are all hidden. */
export interface DiagnosticGuarantee {
  /** The whole headline, e.g. "Worth $2,000, or your money back." */
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

const money = (n: number) => `$${n.toLocaleString('en-US')}`

/** A typical build, with year one worked out as build plus 12 months of run. */
function example(
  name: string,
  description: string,
  build: number,
  monthly: number,
): PriceExample {
  return {
    name,
    description,
    build: money(build),
    run: `${money(monthly)} a month`,
    total: money(build + 12 * monthly),
  }
}

/** Published prices. Brandon approved these numbers 2026-10-02; every page
 *  that quotes a price reads from here. No hourly or embedded rate is
 *  published. */
const pricing: {
  diagnostic: PricingEntry & { guarantee?: DiagnosticGuarantee }
  build: PricingEntry
  website: PricingEntry
  run: PricingEntry
  /** Typical builds, not client work, for /diagnostic. The section does not
   *  render while this is empty. */
  examples: Array<PriceExample>
} = {
  diagnostic: {
    price: '$2,000',
    terms: 'Fixed. Credited toward the build if you sign within 60 days.',
    duration: '1 to 2 weeks',
    guarantee: {
      headline: 'Worth $2,000, or your money back.',
      terms:
        "If the diagnostic isn't worth it to you, tell us within 14 days of receiving the map and we refund the full $2,000. No questions.",
      window: '14 days',
    },
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
    duration: '3 to 6 weeks',
  },
  run: {
    price: 'From $350 a month',
    terms:
      'Hosting, monitoring, and fixes. Improvement retainers are scoped per system.',
    duration: "Monthly, 30 days' notice",
  },
  examples: [
    example('One workflow automated', 'Like intake into your CRM', 7000, 350),
    example(
      'A client or vendor portal',
      'With two or three integrations',
      15000,
      750,
    ),
    example(
      'An internal operating system',
      'Replacing the spreadsheets',
      28000,
      1500,
    ),
  ],
}

/** Founder details Brandon has not supplied yet. The homepage renders each
 *  one only once it is set. */
export interface FounderProfile {
  /** A prior credential for the hero founder card, in one line. */
  credential?: string
  /** Full LinkedIn profile URL. */
  linkedin?: string
  /** Solo portrait for /about, at 2x of its 520x650 frame (1040x1300). Unset
   *  means the founder's block renders without a portrait. */
  portrait?: string
  /** The same portrait at 1x (520x650), for `srcset`. */
  portrait1x?: string
}

/** Keyed by the names in `founders` (routes/about.tsx). */
const founders: Record<'Brandon Harris' | 'Daniel Velez', FounderProfile> = {
  'Brandon Harris': {
    credential: 'Building software since age 11. More than 15 years.',
    portrait: '/brandon-harris-about.webp',
    portrait1x: '/brandon-harris-about-520.webp',
  },
  'Daniel Velez': { credential: 'Also runs Function IT Services.' },
}

export interface BookingConfig {
  api: string
  /** Unset means booking is off. */
  handle?: string
  page: string
}

const booking: BookingConfig = {
  api: 'https://hq.relentnet.com/api/book',
  handle: 'brandon-harris',
  /** hq's own booking page, the fallback when the API cannot be reached. */
  page: 'https://hq.relentnet.com/book/brandon-harris',
}

export const siteConfig = {
  name: 'RelentNet',
  domain: 'https://relentnet.com',
  contact: {
    email: 'inquiries@relentnet.com',
    phone: '858-859-1851',
    phoneFormatted: '+1 (858) 859-1851',
    /** The hq booking API (docs/booking-api.md). Unset `handle` to switch
     *  the on-page booking off; /inquire then shows the contact card. */
    booking,
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
