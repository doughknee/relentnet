import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import { useForm, useStore } from '@tanstack/react-form'
import { useRef, useState } from 'react'

import { slugify } from '../../shared/types'
import type { NoteFrom, ParsedQuote, Phase, Proposal } from '../../shared/types'
import { StudioError, StudioHeader } from '@/components/StudioHeader'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { api } from '@/lib/api'
import { GENERIC_NOTE, voiceOf } from '@/data/content'
import { firstNameOf, fmtDate, fmtUsd } from '@/lib/format'

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): { edit?: string } =>
    typeof search.edit === 'string' ? { edit: search.edit } : {},
  loaderDeps: ({ search }) => ({ edit: search.edit }),
  loader: async ({ deps }) => {
    if (!deps.edit) return null
    return (await api.listProposals()).find((p) => p.id === deps.edit) ?? null
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? 'Edit Proposal · Proposal Studio'
          : 'New Proposal · Proposal Studio',
      },
    ],
  }),
  errorComponent: StudioError,
  component: GeneratorRoute,
})

const PAGE_SECTION_LABELS = {
  scope: 'Scope & investment',
  process: 'Our process',
  work: 'Selected work',
} as const

const NOTE_FROM_LABELS: Record<NoteFrom, string> = {
  both: 'Both of us',
  brandon: 'Brandon',
  daniel: 'Daniel',
  none: 'No note',
}

const fieldLabel = 'text-[10px] tracking-[0.15em] uppercase text-ink-muted'
const ghostBtn =
  'bg-transparent border border-white/15 text-ink text-[11px] tracking-[0.15em] uppercase px-5 py-3 cursor-pointer transition-all duration-300 hover:border-gold hover:text-gold whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed'
const goldBtn =
  'border border-gold bg-gold text-black text-[11px] tracking-[0.15em] uppercase px-5 py-3 cursor-pointer transition-all duration-300 hover:bg-transparent hover:text-gold whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed'
const chip = (isOn: boolean) =>
  `text-[10px] tracking-[0.15em] uppercase px-4 py-2.5 border cursor-pointer transition-all duration-300 ${
    isOn
      ? 'bg-gold/10 border-gold/50 text-gold'
      : 'bg-white/[0.02] border-line text-ink-muted'
  }`

/** The stored record already holds everything the parse step would produce. */
function parsedFromProposal(p: Proposal): ParsedQuote {
  return {
    pdfUrl: p.pdfUrl,
    fileName: `${p.quoteNumber || 'quote'}.pdf`,
    quoteNumber: p.quoteNumber,
    validUntil: p.validUntil,
    clientName: p.clientName,
    clientEmail: p.clientEmail,
    projectName: p.projectName,
    lineItems: p.lineItems,
    upfrontCents: p.upfrontCents,
    recurringCents: p.recurringCents,
  }
}

function StepHeading({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="font-serif text-[22px] text-white/15">{number}</span>
      <h2 className="text-[11px] font-bold tracking-[0.3em] uppercase text-gold">
        {title}
      </h2>
    </div>
  )
}

function GeneratorRoute() {
  const editing = Route.useLoaderData()
  // Key by target so switching between proposals (or back to a blank "new
  // proposal") re-seeds all local state instead of keeping stale prefills.
  return <Generator key={editing?.id ?? 'new'} editing={editing} />
}

function Generator({ editing }: { editing: Proposal | null }) {
  const router = useRouter()
  const [parsed, setParsed] = useState<ParsedQuote | null>(() =>
    editing ? parsedFromProposal(editing) : null,
  )
  const [isParsing, setIsParsing] = useState(false)
  const [parseError, setParseError] = useState<string | null>(null)
  const [noteFrom, setNoteFrom] = useState<NoteFrom>(
    editing?.noteFrom ?? 'both',
  )
  const [sections, setSections] = useState({
    scope: editing?.sections.scope ?? true,
    process: editing?.sections.process ?? true,
    work: editing?.sections.work ?? true,
  })
  const [shouldReopen, setShouldReopen] = useState(false)
  const [created, setCreated] = useState<(Proposal & { url: string }) | null>(
    null,
  )
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const flashTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  )
  const fileInput = useRef<HTMLInputElement>(null)

  const form = useForm({
    defaultValues: {
      clientName: editing?.clientName ?? '',
      clientEmail: editing?.clientEmail ?? '',
      projectName: editing?.projectName ?? '',
      phase: editing?.phase ?? ('Proposal' as Phase),
      note: editing?.note ?? '',
    },
    onSubmit: async ({ value }) => {
      if (!parsed) return
      setSubmitError(null)
      const body = {
        ...value,
        noteFrom,
        sections: { note: noteFrom !== 'none', ...sections },
        quoteNumber: parsed.quoteNumber,
        validUntil: parsed.validUntil,
        lineItems: parsed.lineItems,
        upfrontCents: parsed.upfrontCents,
        recurringCents: parsed.recurringCents,
        pdfUrl: parsed.pdfUrl,
      }
      try {
        if (editing) {
          await api.updateProposal(editing.id, {
            ...body,
            reopen: shouldReopen,
          })
          setShouldReopen(false)
          setIsSaved(true)
          clearTimeout(flashTimer.current)
          flashTimer.current = setTimeout(() => setIsSaved(false), 1600)
          await router.invalidate()
        } else {
          setCreated(await api.createProposal(body))
        }
      } catch (err) {
        setSubmitError(
          err instanceof Error ? err.message : 'Something went wrong.',
        )
      }
    },
  })

  const values = useStore(form.store, (state) => state.values)
  const isSubmitting = useStore(form.store, (state) => state.isSubmitting)

  async function handleFile(file: File | undefined) {
    if (!file || isParsing) return
    setIsParsing(true)
    setParseError(null)
    try {
      const result = await api.parseQuote(file)
      setParsed(result)
      setCreated(null)
      // Prefill step 2; everything stays editable afterwards.
      if (result.clientName) form.setFieldValue('clientName', result.clientName)
      if (result.clientEmail)
        form.setFieldValue('clientEmail', result.clientEmail)
      if (result.projectName)
        form.setFieldValue('projectName', result.projectName)
    } catch (err) {
      setParseError(err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setIsParsing(false)
    }
  }

  const linkId = editing
    ? `${editing.slug}-${editing.token}`
    : created
      ? `${created.slug}-${created.token}`
      : `${slugify(values.projectName || 'client')}-········`
  const hasLink = editing !== null || created !== null

  function copyLink() {
    if (!hasLink) return
    const url = created ? created.url : `${window.location.origin}/p/${linkId}`
    navigator.clipboard.writeText(url).catch(() => {})
    setIsCopied(true)
    clearTimeout(flashTimer.current)
    flashTimer.current = setTimeout(() => setIsCopied(false), 1600)
  }

  const firstName = values.clientName
    ? firstNameOf(values.clientName)
    : 'the client'
  const previewNote = values.note || GENERIC_NOTE
  const truncatedNote =
    previewNote.length > 160 ? `${previewNote.slice(0, 157)}…` : previewNote
  const voice = voiceOf(noteFrom)
  const sectionsOn =
    (noteFrom !== 'none' ? 1 : 0) +
    Object.values(sections).filter(Boolean).length
  const displayUrl = `ap.relentnet.com/p/${linkId}`
  const canSubmit =
    parsed !== null &&
    values.clientName.trim() !== '' &&
    values.clientEmail.trim() !== '' &&
    values.projectName.trim() !== ''

  return (
    <div className="min-h-screen">
      <StudioHeader />

      <main className="max-w-[1400px] mx-auto px-8 pt-12 pb-24 grid lg:grid-cols-[5fr_4fr] gap-12 items-start">
        {/* ── Left: compose ── */}
        <div className="flex flex-col gap-10">
          <div>
            <h1 className="font-serif font-normal text-[34px] mb-2">
              {editing ? 'Edit' : 'New'}{' '}
              <span className="italic text-gold/90">Proposal</span>
            </h1>
            <p className="text-[13px] text-ink-muted leading-[1.7]">
              {editing ? (
                <>
                  Changes publish to the link {firstNameOf(editing.clientName)}{' '}
                  already has. Current status:{' '}
                  <span className="uppercase tracking-[0.1em] text-ink-sub">
                    {editing.status}
                  </span>
                  .
                </>
              ) : (
                'Drop a Stripe quote, add a personal note, and send a page that sells the work, not just the number.'
              )}
            </p>
          </div>

          {/* Step 1: quote */}
          <section className="flex flex-col gap-4">
            <StepHeading number="01" title="Stripe Quote" />
            <input
              ref={fileInput}
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={(e) => {
                void handleFile(e.target.files?.[0])
                e.target.value = ''
              }}
            />
            {!parsed ? (
              <>
                <button
                  type="button"
                  onClick={() => fileInput.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault()
                    void handleFile(e.dataTransfer.files[0])
                  }}
                  className="border border-dashed border-white/20 bg-white/[0.02] px-8 py-14 text-center cursor-pointer transition-all duration-300 hover:border-gold/60 hover:bg-gold/[0.03] w-full"
                >
                  <div className="w-12 h-12 mx-auto mb-4 border border-white/15 flex items-center justify-center text-gold text-xl">
                    ↑
                  </div>
                  <p className="text-sm text-ink mb-1.5">
                    {isParsing
                      ? 'Parsing the quote…'
                      : 'Drop the Stripe quote PDF here'}
                  </p>
                  <p className="text-[11px] tracking-[0.15em] uppercase text-ink-faint">
                    or click to browse · we extract the client &amp; line items
                  </p>
                </button>
                {editing && (
                  <button
                    type="button"
                    onClick={() => setParsed(parsedFromProposal(editing))}
                    className="self-start bg-transparent border-none text-ink-muted text-[11px] tracking-[0.15em] uppercase cursor-pointer transition-colors duration-300 hover:text-gold"
                  >
                    Keep the current PDF
                  </button>
                )}
              </>
            ) : (
              <>
                <div className="border border-gold/30 bg-gold/[0.04] px-6 py-5 flex justify-between items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border border-gold/40 flex items-center justify-center text-gold text-[15px] shrink-0">
                      ✓
                    </div>
                    <div>
                      <p className="text-sm text-ink-em mb-0.5">
                        {parsed.fileName}
                      </p>
                      <p className="text-[11px] tracking-[0.1em] uppercase text-ink-muted">
                        {parsed.quoteNumber || 'No quote number'} · parsed{' '}
                        {parsed.lineItems.length} line item
                        {parsed.lineItems.length === 1 ? '' : 's'}
                        {parsed.validUntil
                          ? ` · valid until ${fmtDate(parsed.validUntil)}`
                          : ''}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setParsed(null)
                      setCreated(null)
                    }}
                    className="bg-transparent border border-line text-ink-muted text-[10px] tracking-[0.15em] uppercase px-3.5 py-2 cursor-pointer transition-all duration-300 hover:border-white/30 hover:text-ink"
                  >
                    Replace
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {parsed.lineItems.map((item) => (
                    <div
                      key={item.name}
                      className="border border-line-faint bg-card px-5 py-4"
                    >
                      <p className="text-[13px] text-ink mb-1">{item.name}</p>
                      <p className="font-serif text-xl text-gold">
                        {fmtUsd(item.amountCents)}
                        <span className="font-sans text-xs text-ink-muted">
                          {' '}
                          {item.cadence === 'monthly' ? '/ month' : 'one-time'}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
            {parseError && <p className="text-xs text-red-500">{parseError}</p>}
          </section>

          {/* Step 2: client */}
          <section className="flex flex-col gap-4">
            <StepHeading number="02" title="Client & Project" />
            <div className="grid sm:grid-cols-2 gap-4">
              <form.Field name="clientName">
                {(field) => (
                  <div className="flex flex-col gap-2">
                    <label htmlFor={field.name} className={fieldLabel}>
                      Client Name
                    </label>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </div>
                )}
              </form.Field>
              <form.Field name="clientEmail">
                {(field) => (
                  <div className="flex flex-col gap-2">
                    <label htmlFor={field.name} className={fieldLabel}>
                      Email
                    </label>
                    <Input
                      id={field.name}
                      type="email"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </div>
                )}
              </form.Field>
              <form.Field name="projectName">
                {(field) => (
                  <div className="flex flex-col gap-2">
                    <label htmlFor={field.name} className={fieldLabel}>
                      Project Name
                    </label>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </div>
                )}
              </form.Field>
              <form.Field name="phase">
                {(field) => (
                  <div className="flex flex-col gap-2">
                    <label htmlFor={field.name} className={fieldLabel}>
                      Phase
                    </label>
                    <select
                      id={field.name}
                      value={field.state.value}
                      onChange={(e) =>
                        field.handleChange(e.target.value as Phase)
                      }
                      className="w-full bg-inset border border-line p-3 text-sm text-ink focus:border-gold focus:outline-hidden transition-colors appearance-none cursor-pointer"
                    >
                      <option value="Proposal">Proposal · new client</option>
                      <option value="Kickoff">
                        Kickoff · signed, starting
                      </option>
                      <option value="Invoice">
                        Invoice · active engagement
                      </option>
                    </select>
                  </div>
                )}
              </form.Field>
            </div>
          </section>

          {/* Step 3: personalize */}
          <section className="flex flex-col gap-4">
            <StepHeading number="03" title="Personalize" />
            <div className="flex flex-col gap-2.5">
              <span className={fieldLabel}>Note from</span>
              <div className="flex gap-2.5 flex-wrap">
                {(Object.keys(NOTE_FROM_LABELS) as Array<NoteFrom>).map(
                  (option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setNoteFrom(option)}
                      className={chip(noteFrom === option)}
                    >
                      {NOTE_FROM_LABELS[option]}
                    </button>
                  ),
                )}
              </div>
            </div>
            {noteFrom !== 'none' && (
              <form.Field name="note">
                {(field) => (
                  <div className="flex flex-col gap-2">
                    <label htmlFor={field.name} className={fieldLabel}>
                      A note in your voice, shown in serif. Leave blank for the
                      standard note.
                    </label>
                    <Textarea
                      id={field.name}
                      rows={4}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder={GENERIC_NOTE}
                      className="resize-y leading-[1.6]"
                    />
                  </div>
                )}
              </form.Field>
            )}
            <div className="flex flex-col gap-2.5">
              <span className={fieldLabel}>Page sections</span>
              <div className="flex gap-2.5 flex-wrap">
                {(
                  Object.keys(PAGE_SECTION_LABELS) as Array<
                    keyof typeof PAGE_SECTION_LABELS
                  >
                ).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() =>
                      setSections((s) => ({ ...s, [key]: !s[key] }))
                    }
                    className={chip(sections[key])}
                  >
                    {PAGE_SECTION_LABELS[key]}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Step 4: send / save */}
          <section className="flex flex-col gap-4">
            <StepHeading number="04" title={editing ? 'Save' : 'Send'} />
            <div className="border border-line-faint bg-card px-6 py-5 flex items-center gap-4 flex-wrap">
              <span
                className={`flex-1 min-w-0 font-mono text-[13px] overflow-hidden text-ellipsis whitespace-nowrap ${hasLink ? 'text-ink-sub' : 'text-ink-faint'}`}
              >
                {displayUrl}
              </span>
              {editing ? (
                <div className="flex gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={copyLink}
                    className={`${ghostBtn} ${isCopied ? 'border-gold text-gold' : ''}`}
                  >
                    {isCopied ? 'Copied ✓' : 'Copy Link'}
                  </button>
                  <a
                    href={`/p/${linkId}`}
                    target="_blank"
                    rel="noreferrer"
                    className={ghostBtn}
                  >
                    Open Page →
                  </a>
                  <button
                    type="button"
                    onClick={() => void form.handleSubmit()}
                    disabled={!canSubmit || isSubmitting}
                    className={`${goldBtn} ${isSaved ? 'bg-transparent text-gold' : ''}`}
                  >
                    {isSubmitting
                      ? 'Saving…'
                      : isSaved
                        ? 'Saved ✓'
                        : 'Save Changes'}
                  </button>
                </div>
              ) : created ? (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={copyLink}
                    className={`${ghostBtn} ${isCopied ? 'border-gold text-gold' : ''}`}
                  >
                    {isCopied ? 'Copied ✓' : 'Copy Link'}
                  </button>
                  <a
                    href={`/p/${linkId}`}
                    target="_blank"
                    rel="noreferrer"
                    className={goldBtn}
                  >
                    Open Page →
                  </a>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => void form.handleSubmit()}
                  disabled={!canSubmit || isSubmitting}
                  className={goldBtn}
                >
                  {isSubmitting ? 'Creating…' : 'Create Proposal Link'}
                </button>
              )}
            </div>
            {editing && editing.status !== 'sent' && (
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => setShouldReopen((r) => !r)}
                  className={chip(shouldReopen)}
                >
                  Reset to sent on save
                </button>
                <span className="text-[11px] text-ink-faint">
                  Clears their {editing.status} response so the page asks again.
                  Good for revised quotes and testing.
                </span>
              </div>
            )}
            {submitError && (
              <p className="text-xs text-red-500">{submitError}</p>
            )}
            <p className="text-[11px] text-ink-faint leading-[1.7]">
              {editing
                ? 'The address never changes when you edit, so the link the client already has always shows the latest version. Responses land in your '
                : created
                  ? 'The link is unique per proposal and unlisted. The page shows the official quote PDF and lets the client accept, or decline with feedback. Responses land in your '
                  : 'Drop a quote and fill in the client to generate the link. Responses will land in your '}
              <Link
                to="/dashboard"
                className="text-ink-muted underline-offset-2 hover:text-gold transition-colors"
              >
                dashboard
              </Link>
              .
            </p>
          </section>
        </div>

        {/* ── Right: live preview ── */}
        <aside className="lg:sticky lg:top-24 flex flex-col gap-3">
          <span className="text-[10px] tracking-[0.2em] uppercase text-ink-faint">
            Live preview · what {firstName} sees
          </span>
          <div className="border border-line bg-[#0a0a0a] overflow-hidden">
            <div className="flex items-center gap-2 px-3.5 py-2.5 bg-chrome border-b border-line">
              <span className="w-[9px] h-[9px] rounded-full bg-white/[0.12]" />
              <span className="w-[9px] h-[9px] rounded-full bg-white/[0.12]" />
              <span className="w-[9px] h-[9px] rounded-full bg-white/[0.12]" />
              <span className="flex-1 text-center font-mono text-[10px] text-ink-faint overflow-hidden text-ellipsis whitespace-nowrap">
                {displayUrl}
              </span>
            </div>
            <div
              className="px-8 pt-12 pb-10 text-center"
              style={{
                background:
                  'radial-gradient(ellipse at 50% 0%, rgba(225,190,76,0.05), transparent 60%)',
              }}
            >
              <p className="mb-4 text-[8px] font-bold tracking-[0.3em] uppercase text-gold">
                Proposal · Prepared for {values.clientName || 'Client name'}
              </p>
              <p className="font-serif text-[26px] leading-[1.1] max-w-[340px] mx-auto text-ink">
                {values.projectName || 'Their project'}{' '}
                <span className="italic text-gold/90">
                  deserves a front door.
                </span>
              </p>
              <div className="mt-6 inline-block bg-gold text-black text-[8px] tracking-[0.15em] uppercase px-4 py-2">
                Review the Quote →
              </div>
            </div>
            {noteFrom !== 'none' && (
              <div className="border-t border-line-faint px-6 py-5 flex flex-col gap-2.5 text-left">
                <p className="text-[9px] tracking-[0.2em] uppercase text-ink-faint">
                  A note from {voice.names}
                </p>
                <p className="font-serif italic text-[12.5px] leading-[1.6] text-ink-sub">
                  &ldquo;{truncatedNote}&rdquo;
                </p>
              </div>
            )}
            <div className="border-t border-line-faint px-6 py-4 flex justify-between items-center">
              <div className="flex gap-6">
                <div>
                  <p className="mb-0.5 text-[8px] tracking-[0.15em] uppercase text-ink-faint">
                    Upfront
                  </p>
                  <p className="font-serif text-[17px] text-gold">
                    {parsed ? fmtUsd(parsed.upfrontCents) : '-'}
                  </p>
                </div>
                <div>
                  <p className="mb-0.5 text-[8px] tracking-[0.15em] uppercase text-ink-faint">
                    Recurring
                  </p>
                  <p className="font-serif text-[17px] text-ink">
                    {parsed ? `${fmtUsd(parsed.recurringCents)}/mo` : '-'}
                  </p>
                </div>
              </div>
              <span className="text-[8px] tracking-[0.15em] uppercase text-ink-faint">
                {sectionsOn} of 4 sections
              </span>
            </div>
          </div>
          <p className="text-[11px] text-ink-faint leading-[1.7] text-center">
            Full page includes your process outline &amp; selected work.
          </p>
        </aside>
      </main>
    </div>
  )
}
