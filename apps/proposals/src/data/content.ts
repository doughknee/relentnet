// Static page content for the proposal page: sender identities, the five
// process phases (mirrors apps/marketing/src/routes/process.tsx), and the
// selected-work cards (mirrors the marketing case studies).

import type { NoteFrom } from '../../shared/types'

interface Sender {
  name: string
  firstName: string
  location: string
  phone: string
}

export const senders: Record<'brandon' | 'daniel', Sender> = {
  brandon: {
    name: 'Brandon Harris',
    firstName: 'Brandon',
    location: 'Nashville, TN',
    phone: '+1 918-550-9049',
  },
  daniel: {
    name: 'Daniel Velez',
    firstName: 'Daniel',
    location: 'New Orleans, LA',
    phone: '+1 858-859-1851',
  },
}

/** Shown in the note band when the admin doesn't write a personal note. */
export const GENERIC_NOTE =
  'Every site we ship carries our name as much as yours. The scope below is the whole engagement: design, build, launch, and ongoing care, with no surprises between the quote and the invoice. Look it over. If it fits, we’re ready when you are.'

export interface NoteVoice {
  /** 'Brandon & Daniel', used in the eyebrow and decline explainer */
  names: string
  /** 'Brandon Harris & Daniel Velez', the signature line */
  signature: string
  metaLine: string
  acceptedLine: string
  declinedLine: string
}

/** Copy that changes with who the proposal speaks for ('none' → company voice). */
export function voiceOf(noteFrom: NoteFrom): NoteVoice {
  const voices =
    noteFrom === 'brandon'
      ? [senders.brandon]
      : noteFrom === 'daniel'
        ? [senders.daniel]
        : [senders.brandon, senders.daniel]
  const isPlural = voices.length > 1
  const first = voices[0]
  return {
    names: voices.map((s) => s.firstName).join(' & '),
    signature: voices.map((s) => s.name).join(' & '),
    metaLine: `RelentNet · ${voices.map((s) => s.location).join(' & ')} · ${first.phone}`,
    acceptedLine: `${isPlural ? 'We’ll' : `${first.firstName} will`} reach out within one business day with the invoice and discovery scheduling. Nothing is charged today.`,
    declinedLine: `${isPlural ? 'We have' : `${first.firstName} has`} your notes and will follow up. If a revised scope makes sense, an updated quote will land at this same link.`,
  }
}

export const marketingOrigin = 'https://relentnet.com'

export interface ProcessPhase {
  number: string
  label: string
  title: string
  blurb: string
}

export const processPhases: Array<ProcessPhase> = [
  {
    number: '01',
    label: 'Diagnose',
    title: 'Diagnose the Workflow',
    blurb: 'We begin with how the business actually moves.',
  },
  {
    number: '02',
    label: 'Prioritize',
    title: 'Prioritize the Friction',
    blurb: 'The right system starts with the right problem.',
  },
  {
    number: '03',
    label: 'Design',
    title: 'Design the System',
    blurb: 'A clear workflow becomes a clear interface.',
  },
  {
    number: '04',
    label: 'Build',
    title: 'Build the Operating Layer',
    blurb: 'The software should fit the business, not the other way around.',
  },
  {
    number: '05',
    label: 'Steward',
    title: 'Steward the Technology',
    blurb: 'The launch is the start of the operating relationship.',
  },
]

export interface CaseStudyCard {
  href: string
  image: string
  alt: string
  industry: string
  name: string
  blurb: string
  stat: string
}

// Order matters: lead with the closest comp to the prospect.
// ponytail: fixed order for every proposal; make it per-proposal if two
// prospects ever need different leads.
export const caseStudies: Array<CaseStudyCard> = [
  {
    href: `${marketingOrigin}/clients/vm-homes`,
    image: '/case-studies/vm-homes-hero.webp',
    alt: 'VM Homes homepage with Gulf-front aerial and property search',
    industry: 'Real Estate · St. Pete Beach, FL',
    name: 'VM Homes',
    blurb:
      'A premium, MLS-integrated home search for the Tampa Bay coast, with live listings inside the brand.',
    stat: '6 markets, live inventory',
  },
  {
    href: `${marketingOrigin}/clients/cambridge-building-group`,
    image: '/case-studies/cambridge-hero.webp',
    alt: 'Cambridge Building Group homepage hero',
    industry: 'Commercial Construction · Nashville, TN',
    name: 'Cambridge Building Group',
    blurb:
      'A credibility-first front door, backed by an AP pipeline that posts vendor invoices to QuickBooks itself.',
    stat: 'Email → QBO, automated',
  },
  {
    href: `${marketingOrigin}/clients/scrollr`,
    image: '/case-studies/scrollr-hero.webp',
    alt: 'Scrollr desktop app showing live MLB scores',
    industry: 'Consumer Software',
    name: 'Scrollr',
    blurb:
      'A brittle Chrome extension rebuilt into a cross-platform native desktop product, now in beta.',
    stat: '1 → 3 platforms',
  },
]
