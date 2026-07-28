import { mkdtempSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// Store and auth read env at import time, so set both before importing the app.
process.env.DATA_DIR = mkdtempSync(join(tmpdir(), 'proposals-test-'))
process.env.ADMIN_PASSWORD = 'test-secret'
const { app } = await import('./app.ts')

const auth = {
  Authorization: `Basic ${Buffer.from('daniel:test-secret').toString('base64')}`,
}

const samplePdf = join(
  import.meta.dirname,
  '../../../design_handoff_proposal_studio/assets/sample-quote.pdf',
)

async function uploadSample() {
  const form = new FormData()
  form.append(
    'file',
    new File(
      [new Uint8Array(readFileSync(samplePdf))],
      'Quote-QT-SHX6JT2B.pdf',
      {
        type: 'application/pdf',
      },
    ),
  )
  const res = await app.request('/api/admin/quotes', {
    method: 'POST',
    headers: auth,
    body: form,
  })
  expect(res.status).toBe(200)
  return res.json()
}

async function createProposal(overrides: Record<string, unknown> = {}) {
  const parsed = await uploadSample()
  const res = await app.request('/api/admin/proposals', {
    method: 'POST',
    headers: { ...auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clientName: parsed.clientName,
      clientEmail: parsed.clientEmail,
      projectName: parsed.projectName,
      phase: 'Proposal',
      note: 'Will, this is the site I want to build for you.',
      noteFrom: 'both',
      sections: { note: true, scope: true, process: true, work: true },
      quoteNumber: parsed.quoteNumber,
      validUntil: parsed.validUntil,
      lineItems: parsed.lineItems,
      upfrontCents: parsed.upfrontCents,
      recurringCents: parsed.recurringCents,
      pdfUrl: parsed.pdfUrl,
      ...overrides,
    }),
  })
  return res
}

async function createProposalOk(overrides: Record<string, unknown> = {}) {
  const res = await createProposal(overrides)
  expect(res.status).toBe(201)
  return res.json()
}

describe('proposals API', () => {
  it('rejects admin calls without credentials', async () => {
    const res = await app.request('/api/admin/proposals')
    expect(res.status).toBe(401)
  })

  it('upload → create → view → decline lifecycle', async () => {
    const created = await createProposalOk()
    expect(created.slug).toBe('amelia-island-beach-condos')
    expect(created.token).toMatch(/^[a-z0-9]{8}$/)
    expect(created.status).toBe('sent')
    expect(created.url).toContain(`/p/${created.slug}-${created.token}`)

    const linkId = `${created.slug}-${created.token}`

    // First public load marks it viewed and never leaks the email or id.
    const view = await app.request(`/api/p/${linkId}`)
    expect(view.status).toBe(200)
    const pub = await view.json()
    expect(pub.status).toBe('viewed')
    expect(pub.clientEmail).toBeUndefined()
    expect(pub.id).toBeUndefined()
    expect(pub.token).toBeUndefined()
    expect(pub.pdfUrl).toMatch(/^\/files\/[a-f0-9]{16}\.pdf$/)

    // The stored PDF is served back.
    const pdf = await app.request(pub.pdfUrl)
    expect(pdf.status).toBe(200)
    expect(pdf.headers.get('content-type')).toBe('application/pdf')

    // Declining requires feedback.
    const bare = await app.request(`/api/p/${linkId}/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'decline' }),
    })
    expect(bare.status).toBe(400)

    const declined = await app.request(`/api/p/${linkId}/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'decline', feedback: 'Budget timing.' }),
    })
    expect(declined.status).toBe(200)
    expect((await declined.json()).status).toBe('declined')

    // Decisions are immutable.
    const again = await app.request(`/api/p/${linkId}/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'accept' }),
    })
    expect(again.status).toBe(409)

    // Dashboard sees the feedback.
    const list = await app.request('/api/admin/proposals', { headers: auth })
    const rows = await list.json()
    const row = rows.find((r: { id: string }) => r.id === created.id)
    expect(row.status).toBe('declined')
    expect(row.feedback).toBe('Budget timing.')
  })

  it('accepts a quote and locks the state', async () => {
    const created = await createProposalOk()
    const linkId = `${created.slug}-${created.token}`

    const accepted = await app.request(`/api/p/${linkId}/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'accept' }),
    })
    expect(accepted.status).toBe(200)
    expect((await accepted.json()).status).toBe('accepted')

    // Revisits see the settled state, not "viewed".
    const revisit = await app.request(`/api/p/${linkId}`)
    expect((await revisit.json()).status).toBe('accepted')
  })

  it('noteFrom governs the note section and rejects junk values', async () => {
    const none = await createProposalOk({ noteFrom: 'none', note: '' })
    expect(none.noteFrom).toBe('none')
    expect(none.sections.note).toBe(false)

    const solo = await createProposalOk({ noteFrom: 'brandon' })
    expect(solo.sections.note).toBe(true)

    const junk = await createProposal({ noteFrom: 'craig' })
    expect(junk.status).toBe(400)
  })

  it('404s unknown links and rejects junk uploads', async () => {
    const missing = await app.request('/api/p/nope-abc12345')
    expect(missing.status).toBe(404)

    const form = new FormData()
    form.append('file', new File(['not a pdf'], 'x.pdf'))
    const junk = await app.request('/api/admin/quotes', {
      method: 'POST',
      headers: auth,
      body: form,
    })
    expect(junk.status).toBe(400)
  })
})
