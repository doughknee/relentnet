import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { randomBytes } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { Hono } from 'hono'
import { basicAuth } from 'hono/basic-auth'
import { bodyLimit } from 'hono/body-limit'
import { getCookie, setCookie } from 'hono/cookie'
import { serveStatic } from '@hono/node-server/serve-static'

import { linkIdOf } from '../shared/types.ts'
import {
  createProposal,
  deleteProposal,
  filesDir,
  findByLinkId,
  listProposals,
  markViewed,
  recordResponse,
  updateProposal,
} from './store.ts'
import { parseQuotePdf } from './stripeQuotePdf.ts'
import { notify, publicOrigin } from './notify.ts'

import type { MiddlewareHandler } from 'hono'
import type {
  NoteFrom,
  ParsedQuote,
  Phase,
  Proposal,
  PublicProposal,
} from '../shared/types.ts'
import type { CreateProposalInput } from './store.ts'

const PHASES: Array<Phase> = ['Proposal', 'Kickoff', 'Invoice']
const NOTE_FROMS: Array<NoteFrom> = ['both', 'brandon', 'daniel', 'none']
const SECTION_KEYS = ['note', 'scope', 'process', 'work'] as const
const STORED_PDF = /^\/files\/([a-f0-9]{16}\.pdf)$/

// ── Auth: the studio (generator, dashboard, admin API) is internal-only ──
const adminUser = process.env.ADMIN_USER ?? 'daniel'
let adminPassword = process.env.ADMIN_PASSWORD
if (!adminPassword && process.env.NODE_ENV !== 'production') {
  adminPassword = 'dev'
  console.warn('[auth] ADMIN_PASSWORD not set; dev fallback password is "dev"')
}

const requireAuth: MiddlewareHandler = adminPassword
  ? basicAuth({
      username: adminUser,
      password: adminPassword,
      realm: 'Proposal Studio',
    })
  : (c) =>
      Promise.resolve(
        c.text('Proposal Studio is disabled: set ADMIN_PASSWORD.', 503),
      )

// Browsers that have signed into the studio carry this cookie, and their
// visits to proposal pages never count as the client viewing (no status
// change, no notification). Worst case if a client ever set it themselves:
// we miss one "viewed" ping.
const STUDIO_COOKIE = 'relentnet_studio'

const markStudioBrowser: MiddlewareHandler = (c, next) => {
  setCookie(c, STUDIO_COOKIE, '1', {
    path: '/',
    httpOnly: true,
    sameSite: 'Lax',
    maxAge: 60 * 60 * 24 * 365,
  })
  return next()
}

const isStudioBrowser = (c: Parameters<MiddlewareHandler>[0]) =>
  getCookie(c, STUDIO_COOKIE) === '1'

function toPublic(p: Proposal): PublicProposal {
  const {
    id: _id,
    token: _token,
    clientEmail: _email,
    feedback: _fb,
    ...pub
  } = p
  return pub
}

export const app = new Hono()

app.get('/healthz', (c) => c.text('ok\n'))

// ── Public API (unlisted tokenized links are the access control) ──

app.get('/api/p/:linkId', (c) => {
  const proposal = findByLinkId(c.req.param('linkId'))
  if (!proposal) return c.json({ error: 'Not found' }, 404)
  if (!isStudioBrowser(c) && markViewed(proposal.id)) {
    notify('viewed', proposal)
  }
  return c.json(toPublic(proposal))
})

app.post('/api/p/:linkId/respond', async (c) => {
  const proposal = findByLinkId(c.req.param('linkId'))
  if (!proposal) return c.json({ error: 'Not found' }, 404)

  const body = (await c.req.json().catch(() => null)) as {
    action?: unknown
    feedback?: unknown
  } | null
  const action = body?.action
  if (action !== 'accept' && action !== 'decline') {
    return c.json({ error: 'action must be "accept" or "decline"' }, 400)
  }
  const feedback =
    typeof body?.feedback === 'string' ? body.feedback.trim() : ''
  if (action === 'decline' && !feedback) {
    return c.json({ error: 'Feedback is required to decline' }, 400)
  }

  const updated = recordResponse(proposal.id, action, feedback || undefined)
  if (!updated) {
    // Already answered and immutable. Tell the page the settled state.
    return c.json({ error: 'Already responded', status: proposal.status }, 409)
  }
  notify(updated.status === 'accepted' ? 'accepted' : 'declined', updated)
  return c.json(toPublic(updated))
})

// Uploaded quote PDFs: filenames are 64-bit random, which is the same
// unlisted-link protection the proposal pages themselves rely on.
app.get('/files/:name', (c) => {
  const name = c.req.param('name')
  if (!/^[a-f0-9]{16}\.pdf$/.test(name)) return c.notFound()
  const path = join(filesDir, name)
  if (!existsSync(path)) return c.notFound()
  return c.body(new Uint8Array(readFileSync(path)), 200, {
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'inline; filename="quote.pdf"',
    'X-Robots-Tag': 'noindex',
  })
})

// ── Admin API ──

app.use('/api/admin/*', requireAuth, markStudioBrowser)

app.post(
  '/api/admin/quotes',
  bodyLimit({ maxSize: 12 * 1024 * 1024 }),
  async (c) => {
    const form = await c.req.formData().catch(() => null)
    const file = form?.get('file')
    if (!(file instanceof File)) {
      return c.json({ error: 'Upload a PDF as the "file" field' }, 400)
    }
    const buf = new Uint8Array(await file.arrayBuffer())
    const isPdf =
      buf.length > 4 && String.fromCharCode(...buf.slice(0, 5)) === '%PDF-'
    if (!isPdf) return c.json({ error: 'Not a PDF' }, 400)

    const name = `${randomBytes(8).toString('hex')}.pdf`
    writeFileSync(join(filesDir, name), buf)

    // Parse failures still return the stored PDF: the admin fills fields by
    // hand and the page can always embed the document itself.
    const fields = await parseQuotePdf(buf).catch((err: unknown) => {
      console.error('[parse] quote PDF parse failed:', err)
      return {
        quoteNumber: '',
        validUntil: '',
        clientName: '',
        clientEmail: '',
        projectName: '',
        lineItems: [],
        upfrontCents: 0,
        recurringCents: 0,
      }
    })

    const parsed: ParsedQuote = {
      pdfUrl: `/files/${name}`,
      fileName: file.name,
      ...fields,
    }
    return c.json(parsed)
  },
)

function validateCreate(body: unknown): CreateProposalInput | string {
  if (typeof body !== 'object' || body === null) return 'Invalid body'
  const b = body as Record<string, unknown>

  const str = (k: string) => (typeof b[k] === 'string' ? b[k].trim() : '')
  const clientName = str('clientName')
  const clientEmail = str('clientEmail')
  const projectName = str('projectName')
  const quoteNumber = str('quoteNumber')
  const validUntil = str('validUntil')
  const note = typeof b.note === 'string' ? b.note.trim() : ''

  if (!clientName) return 'Client name is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail))
    return 'Valid client email is required'
  if (!projectName) return 'Project name is required'
  if (!quoteNumber) return 'Quote number is required'
  if (!/^\d{4}-\d{2}-\d{2}$/.test(validUntil))
    return 'validUntil must be YYYY-MM-DD'

  const phase = b.phase as Phase
  if (!PHASES.includes(phase)) return 'Invalid phase'

  const noteFrom = b.noteFrom as NoteFrom
  if (!NOTE_FROMS.includes(noteFrom)) return 'Invalid noteFrom'

  const sectionsRaw = b.sections as Record<string, unknown> | undefined
  if (
    !sectionsRaw ||
    SECTION_KEYS.some((k) => typeof sectionsRaw[k] !== 'boolean')
  ) {
    return 'sections must contain note/scope/process/work booleans'
  }

  const items = b.lineItems
  if (!Array.isArray(items) || items.length === 0)
    return 'At least one line item is required'
  for (const raw of items as Array<unknown>) {
    if (typeof raw !== 'object' || raw === null) return 'Invalid line item'
    const item = raw as Record<string, unknown>
    if (
      typeof item.name !== 'string' ||
      !item.name.trim() ||
      typeof item.description !== 'string' ||
      !Number.isInteger(item.amountCents) ||
      (item.amountCents as number) < 0 ||
      (item.cadence !== 'one-time' && item.cadence !== 'monthly')
    ) {
      return 'Invalid line item'
    }
  }

  if (!Number.isInteger(b.upfrontCents) || (b.upfrontCents as number) < 0)
    return 'Invalid upfront total'
  if (!Number.isInteger(b.recurringCents) || (b.recurringCents as number) < 0)
    return 'Invalid recurring total'

  const pdfUrl = str('pdfUrl')
  const pdfName = STORED_PDF.exec(pdfUrl)?.[1]
  if (!pdfName || !existsSync(join(filesDir, pdfName))) {
    return 'pdfUrl must reference an uploaded quote PDF'
  }

  return {
    clientName,
    clientEmail,
    projectName,
    phase,
    note,
    noteFrom,
    sections: {
      // The note band is governed by noteFrom; keep the two consistent.
      note: noteFrom !== 'none',
      scope: sectionsRaw.scope as boolean,
      process: sectionsRaw.process as boolean,
      work: sectionsRaw.work as boolean,
    },
    quoteNumber,
    validUntil,
    lineItems: (items as CreateProposalInput['lineItems']).map((i) => ({
      name: i.name.trim(),
      description: i.description.trim(),
      amountCents: i.amountCents,
      cadence: i.cadence,
    })),
    upfrontCents: b.upfrontCents as number,
    recurringCents: b.recurringCents as number,
    pdfUrl,
  }
}

app.post('/api/admin/proposals', async (c) => {
  const body: unknown = await c.req.json().catch(() => null)
  const input = validateCreate(body)
  if (typeof input === 'string') return c.json({ error: input }, 400)
  const proposal = createProposal(input)
  return c.json(
    { ...proposal, url: `${publicOrigin}/p/${linkIdOf(proposal)}` },
    201,
  )
})

app.get('/api/admin/proposals', (c) => c.json(listProposals()))

app.put('/api/admin/proposals/:id', async (c) => {
  const body: unknown = await c.req.json().catch(() => null)
  const input = validateCreate(body)
  if (typeof input === 'string') return c.json({ error: input }, 400)
  const reopen = (body as { reopen?: unknown }).reopen === true
  const updated = updateProposal(c.req.param('id'), input, reopen)
  if (!updated) return c.json({ error: 'Not found' }, 404)
  return c.json({ ...updated, url: `${publicOrigin}/p/${linkIdOf(updated)}` })
})

app.delete('/api/admin/proposals/:id', (c) => {
  if (!deleteProposal(c.req.param('id'))) {
    return c.json({ error: 'Not found' }, 404)
  }
  return c.json({ ok: true })
})

// ── Static SPA (production build) ──
// Internal documents sit behind the same Basic auth as the admin API; the
// unlisted /p/* pages, hashed assets, and PDFs stay public.
const distDir = fileURLToPath(new URL('../dist', import.meta.url))
if (existsSync(join(distDir, 'index.html'))) {
  const indexHtml = readFileSync(join(distDir, 'index.html'), 'utf8')

  app.use('*', (c, next) => {
    const { pathname } = new URL(c.req.url)
    const isInternalDoc =
      pathname === '/' ||
      pathname === '/index.html' ||
      pathname === '/dashboard' ||
      pathname.startsWith('/dashboard/')
    return isInternalDoc
      ? requireAuth(c, async () => {
          await markStudioBrowser(c, next)
        })
      : next()
  })
  app.use(
    '*',
    serveStatic({
      root: relative(process.cwd(), distDir),
      onFound: (path, c) => {
        // Hashed bundles are immutable; everything else (index.html, images)
        // must revalidate so a deploy isn't stuck behind heuristic caching.
        c.header(
          'Cache-Control',
          path.replaceAll('\\', '/').includes('/assets/')
            ? 'public, max-age=31536000, immutable'
            : 'no-cache',
        )
      },
    }),
  )
  app.get('*', (c) => {
    c.header('Cache-Control', 'no-cache')
    return c.html(indexHtml)
  })
}
