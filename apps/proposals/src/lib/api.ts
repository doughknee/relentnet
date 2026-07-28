import type { ParsedQuote, Proposal, PublicProposal } from '../../shared/types'

export class ApiError extends Error {
  status: number
  body: { error?: string; status?: string }

  constructor(status: number, body: { error?: string; status?: string }) {
    super(body.error ?? `Request failed (${status})`)
    this.status = status
    this.body = body
  }
}

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  // Resolve against the origin, not baseURI: when the studio is opened via a
  // user:pass@ URL, relative fetch URLs would inherit those credentials and
  // fetch() rejects credentialed URLs outright.
  const res = await fetch(new URL(input, window.location.origin), init)
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as {
      error?: string
      status?: string
    }
    throw new ApiError(res.status, body)
  }
  return res.json() as Promise<T>
}

const json = (body: unknown): RequestInit => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
})

export interface CreateProposalBody {
  clientName: string
  clientEmail: string
  projectName: string
  phase: Proposal['phase']
  note: string
  noteFrom: Proposal['noteFrom']
  sections: Proposal['sections']
  quoteNumber: string
  validUntil: string
  lineItems: Proposal['lineItems']
  upfrontCents: number
  recurringCents: number
  pdfUrl: string
}

export const api = {
  getProposal: (linkId: string) =>
    request<PublicProposal>(`/api/p/${encodeURIComponent(linkId)}`),

  respond: (linkId: string, action: 'accept' | 'decline', feedback?: string) =>
    request<PublicProposal>(
      `/api/p/${encodeURIComponent(linkId)}/respond`,
      json({ action, feedback }),
    ),

  parseQuote: (file: File) => {
    const form = new FormData()
    form.append('file', file)
    return request<ParsedQuote>('/api/admin/quotes', {
      method: 'POST',
      body: form,
    })
  },

  createProposal: (body: CreateProposalBody) =>
    request<Proposal & { url: string }>('/api/admin/proposals', json(body)),

  updateProposal: (
    id: string,
    body: CreateProposalBody & { reopen: boolean },
  ) =>
    request<Proposal & { url: string }>(
      `/api/admin/proposals/${encodeURIComponent(id)}`,
      { ...json(body), method: 'PUT' },
    ),

  deleteProposal: (id: string) =>
    request<{ ok: boolean }>(`/api/admin/proposals/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),

  listProposals: () => request<Array<Proposal>>('/api/admin/proposals'),
}
