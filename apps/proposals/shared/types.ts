// Shared between server/ and src/. Keep this file dependency-free.

export type Phase = 'Proposal' | 'Kickoff' | 'Invoice'

/** Whose voice the personal-note band speaks in ('none' hides the band). */
export type NoteFrom = 'both' | 'brandon' | 'daniel' | 'none'

export type ProposalStatus = 'sent' | 'viewed' | 'accepted' | 'declined'

export type Cadence = 'one-time' | 'monthly'

export interface LineItem {
  name: string
  description: string
  amountCents: number
  cadence: Cadence
}

export interface ProposalSections {
  note: boolean
  scope: boolean
  process: boolean
  work: boolean
}

/** Full proposal record, as stored and as returned by the admin API. */
export interface Proposal {
  id: string
  slug: string
  token: string
  clientName: string
  clientEmail: string
  projectName: string
  phase: Phase
  note: string
  noteFrom: NoteFrom
  sections: ProposalSections
  quoteNumber: string
  /** ISO date (YYYY-MM-DD) */
  validUntil: string
  lineItems: Array<LineItem>
  upfrontCents: number
  recurringCents: number
  /** Path the quote PDF is served from, e.g. /files/ab12….pdf */
  pdfUrl: string
  status: ProposalStatus
  feedback?: string
  respondedAt?: string
  viewedAt?: string
  sentAt: string
}

/** What the client-facing page receives (no email, no decline feedback). */
export type PublicProposal = Omit<
  Proposal,
  'clientEmail' | 'feedback' | 'id' | 'token'
>

/** Result of uploading + parsing a Stripe quote PDF. */
export interface ParsedQuote {
  /** Server path of the stored PDF (becomes the proposal's pdfUrl). */
  pdfUrl: string
  fileName: string
  quoteNumber: string
  validUntil: string
  clientName: string
  clientEmail: string
  projectName: string
  lineItems: Array<LineItem>
  upfrontCents: number
  recurringCents: number
}

export const linkIdOf = (p: { slug: string; token: string }): string =>
  `${p.slug}-${p.token}`

export function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'proposal'
  )
}
