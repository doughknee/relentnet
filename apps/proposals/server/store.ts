import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from 'node:fs'
import { join, resolve } from 'node:path'
import { randomBytes, randomUUID } from 'node:crypto'

import { slugify } from '../shared/types.ts'

import type {
  NoteFrom,
  Phase,
  Proposal,
  ProposalSections,
} from '../shared/types.ts'

// ponytail: JSON-file store (single process, sync writes, tens of records).
// Swap for SQLite if proposal volume or write concurrency ever grows.
export const dataDir = resolve(process.env.DATA_DIR ?? '.data')
export const filesDir = join(dataDir, 'files')
const dbFile = join(dataDir, 'proposals.json')

mkdirSync(filesDir, { recursive: true })

let proposals: Array<Proposal> = existsSync(dbFile)
  ? (
      JSON.parse(readFileSync(dbFile, 'utf8')) as Array<
        // Records created before the noteFrom field default to both senders.
        Omit<Proposal, 'noteFrom'> & { noteFrom?: NoteFrom }
      >
    ).map((p) => ({ noteFrom: 'both', ...p }))
  : []

function persist() {
  // Atomic swap so a crash mid-write can't corrupt the store.
  const tmp = `${dbFile}.tmp`
  writeFileSync(tmp, JSON.stringify(proposals, null, 2))
  renameSync(tmp, dbFile)
}

function newToken(): string {
  // Unguessable unlisted-link token, [a-z0-9]{8} (~41 bits).
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from(randomBytes(8), (b) => chars[b % 36]).join('')
}

export function listProposals(): Array<Proposal> {
  return [...proposals].sort((a, b) => b.sentAt.localeCompare(a.sentAt))
}

export function findByLinkId(linkId: string): Proposal | undefined {
  return proposals.find((p) => `${p.slug}-${p.token}` === linkId)
}

export interface CreateProposalInput {
  clientName: string
  clientEmail: string
  projectName: string
  phase: Phase
  note: string
  noteFrom: NoteFrom
  sections: ProposalSections
  quoteNumber: string
  validUntil: string
  lineItems: Proposal['lineItems']
  upfrontCents: number
  recurringCents: number
  pdfUrl: string
}

export function createProposal(input: CreateProposalInput): Proposal {
  const proposal: Proposal = {
    ...input,
    id: randomUUID(),
    slug: slugify(input.projectName),
    token: newToken(),
    status: 'sent',
    sentAt: new Date().toISOString(),
  }
  proposals.push(proposal)
  persist()
  return proposal
}

/** First page load flips sent → viewed; later loads are no-ops. */
export function markViewed(id: string): boolean {
  const p = proposals.find((x) => x.id === id)
  if (!p || p.status !== 'sent') return false
  p.status = 'viewed'
  p.viewedAt = new Date().toISOString()
  persist()
  return true
}

/** Records the client's decision. Immutable once accepted or declined. */
export function recordResponse(
  id: string,
  action: 'accept' | 'decline',
  feedback?: string,
): Proposal | undefined {
  const p = proposals.find((x) => x.id === id)
  if (!p || p.status === 'accepted' || p.status === 'declined') return undefined
  p.status = action === 'accept' ? 'accepted' : 'declined'
  if (feedback) p.feedback = feedback
  p.respondedAt = new Date().toISOString()
  persist()
  return p
}

/** Test-only: reset in-memory state (paired with a throwaway DATA_DIR). */
export function resetForTests() {
  proposals = []
  persist()
}
