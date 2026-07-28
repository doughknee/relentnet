import { createFileRoute, notFound } from '@tanstack/react-router'
import { useState } from 'react'

import type { PublicProposal } from '../../shared/types'
import StarParticles from '@/components/StarParticles'
import { Textarea } from '@/components/ui/Textarea'
import { ApiError, api } from '@/lib/api'
import { firstNameOf, fmtDate, fmtUsd } from '@/lib/format'
import {
  GENERIC_NOTE,
  caseStudies,
  marketingOrigin,
  processPhases,
  voiceOf,
} from '@/data/content'

export const Route = createFileRoute('/p/$linkId')({
  loader: async ({ params }) => {
    try {
      return await api.getProposal(params.linkId)
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) throw notFound()
      throw err
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `Proposal · ${loaderData.projectName} · RelentNet`
          : 'Proposal · RelentNet',
      },
    ],
  }),
  component: ProposalPage,
})

const goldCta =
  'inline-flex items-center gap-3 border border-gold bg-gold px-7 py-4 text-sm uppercase tracking-[0.1em] text-black transition-all duration-300 hover:bg-transparent hover:text-gold'
const outlineCta =
  'inline-flex items-center border border-line px-7 py-4 text-sm uppercase tracking-[0.1em] text-ink transition-all duration-500 hover:bg-gold hover:border-gold hover:text-black'
const smallGhostBtn =
  'bg-transparent border border-white/15 text-[11px] tracking-[0.15em] uppercase px-[18px] py-2.5 cursor-pointer transition-all duration-300 hover:border-gold hover:text-gold'

type Decision = 'pending' | 'declining' | 'accepted' | 'declined'

function decisionFromStatus(status: PublicProposal['status']): Decision {
  return status === 'accepted' || status === 'declined' ? status : 'pending'
}

function ProposalPage() {
  const proposal = Route.useLoaderData()
  const { linkId } = Route.useParams()
  const firstName = firstNameOf(proposal.clientName)
  const validUntil = fmtDate(proposal.validUntil)
  const voice = voiceOf(proposal.noteFrom)

  const [decision, setDecision] = useState<Decision>(
    decisionFromStatus(proposal.status),
  )
  const [feedback, setFeedback] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPdfOpen, setIsPdfOpen] = useState(false)

  async function respond(action: 'accept' | 'decline') {
    setIsSubmitting(true)
    setError(null)
    try {
      const updated = await api.respond(
        linkId,
        action,
        action === 'decline' ? feedback : undefined,
      )
      setDecision(decisionFromStatus(updated.status))
    } catch (err) {
      // 409 means already answered (e.g. another tab); show the settled state.
      if (err instanceof ApiError && err.status === 409 && err.body.status) {
        setDecision(
          decisionFromStatus(err.body.status as PublicProposal['status']),
        )
      } else {
        setError('Something went wrong. Try again, or just give us a call.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="overflow-hidden relative">
      <StarParticles />

      {/* ── Header (focused chrome, deliberately no site nav) ── */}
      <nav className="fixed top-0 inset-x-0 flex justify-between items-center p-8 z-50 bg-surface backdrop-blur-xs">
        <a
          href={marketingOrigin}
          className="font-serif text-xl tracking-[0.2em] uppercase text-ink"
        >
          <span className="font-bold text-gold">Relent</span>Net
        </a>
        <a
          href="#scope"
          className="border border-line px-6 py-3 text-xs tracking-[0.1em] uppercase text-ink transition-all duration-500 hover:bg-gold hover:border-gold hover:text-black"
        >
          Respond to Proposal
        </a>
      </nav>

      <main className="relative z-10">
        {/* ── Hero ── */}
        <section className="min-h-screen flex flex-col justify-center items-center px-6 pt-[120px] pb-20 relative text-center">
          <p className="mb-8 text-[11px] font-bold tracking-[0.3em] uppercase text-gold animate-fade-in-up">
            Proposal · Prepared for {proposal.clientName}
          </p>
          <h1 className="font-serif font-normal text-[clamp(48px,8vw,96px)] leading-[1.02] max-w-[1100px] animate-fade-in-up">
            {proposal.projectName}{' '}
            <span className="italic text-gold/90">deserves a front door.</span>
          </h1>
          <p
            className="mt-8 max-w-[620px] text-ink-sub font-light text-lg leading-[1.7] animate-fade-in-up"
            style={{ animationDelay: '200ms' }}
          >
            A custom website designed and built from discovery through launch,
            then hosted, monitored, and cared for so it keeps earning bookings
            long after day one.
          </p>
          <div
            className="flex gap-4 mt-10 flex-wrap justify-center animate-fade-in-up"
            style={{ animationDelay: '350ms' }}
          >
            <a href="#scope" className={goldCta}>
              Review the Quote <span className="text-base leading-none">→</span>
            </a>
            {proposal.sections.work && (
              <a href="#work" className={outlineCta}>
                See Our Work
              </a>
            )}
          </div>
          <p
            className="mt-6 text-[11px] tracking-[0.15em] uppercase text-ink-muted animate-fade-in-up"
            style={{ animationDelay: '500ms' }}
          >
            Quote {proposal.quoteNumber} · Valid until {validUntil}
          </p>
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-pulse">
            <span className="text-[10px] uppercase tracking-[0.1em] text-gold">
              Scroll
            </span>
            <div className="w-px h-12 bg-linear-to-b from-gold to-transparent" />
          </div>
        </section>

        {/* ── Personal note ── */}
        {proposal.sections.note && (
          <section className="relative z-10 bg-surface backdrop-blur-xs border-y border-line">
            <div className="max-w-[880px] mx-auto px-6 py-[100px] text-center">
              <h2 className="mb-8 text-xs font-bold tracking-[0.3em] uppercase text-gold">
                A Note From {voice.names}
              </h2>
              <p className="font-serif text-[clamp(22px,3vw,32px)] leading-[1.45] max-w-[760px] mx-auto">
                &ldquo;{proposal.note || GENERIC_NOTE}&rdquo;
              </p>
              <div className="mt-10 flex flex-col items-center gap-1.5">
                <span className="font-serif text-xl text-ink-em">
                  {voice.signature}
                </span>
                <span className="text-[11px] tracking-[0.2em] uppercase text-ink-muted">
                  {voice.metaLine}
                </span>
              </div>
            </div>
          </section>
        )}

        {/* ── Scope & Investment ── */}
        {proposal.sections.scope && (
          <section id="scope" className="relative z-10">
            <div className="max-w-6xl mx-auto px-6 py-32">
              <span className="block font-serif text-[clamp(80px,10vw,160px)] leading-none text-white/[0.03] select-none -mb-12">
                01
              </span>
              <div className="grid grid-cols-1 lg:grid-cols-[minmax(260px,3fr)_9fr] gap-16 items-start">
                <div className="flex flex-col gap-3">
                  <span className="text-gold text-[10px] font-bold tracking-[0.3em] uppercase">
                    The Engagement
                  </span>
                  <h2 className="font-serif font-normal text-[clamp(28px,3vw,36px)]">
                    Scope &amp; Investment
                  </h2>
                  <p className="mt-2 text-[13px] text-ink-muted leading-[1.7]">
                    Everything below is written into the Stripe quote. No
                    surprises, no change-order theater. Accept it and we begin.
                  </p>
                  <div className="mt-4 flex flex-col gap-2 text-[11px] tracking-[0.15em] uppercase text-ink-faint">
                    <span>Quote&ensp;{proposal.quoteNumber}</span>
                    <span>Valid until&ensp;{validUntil}</span>
                    <span>Prepared for&ensp;{proposal.clientName}</span>
                  </div>
                </div>

                <div className="flex flex-col">
                  {proposal.lineItems.map((item, index) => (
                    <div
                      key={item.name}
                      className={`border border-line-faint bg-card px-10 py-9 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-6 ${index > 0 ? 'border-t-0' : ''}`}
                    >
                      <div>
                        <h3 className="font-serif font-normal text-2xl text-ink-em mb-3">
                          {item.name}
                        </h3>
                        <p className="text-sm text-ink-sub leading-[1.7] max-w-[560px]">
                          {item.description}
                        </p>
                      </div>
                      <div className="sm:text-right">
                        <span className="block font-serif text-3xl text-ink-em">
                          {fmtUsd(item.amountCents)}
                        </span>
                        <span className="text-[10px] tracking-[0.2em] uppercase text-ink-muted">
                          {item.cadence === 'monthly'
                            ? 'Per month'
                            : 'One-time'}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* PDF row */}
                  <div className="border border-line-faint border-t-0 bg-inset px-10 py-5 flex justify-between items-center gap-4 flex-wrap">
                    <span className="text-[11px] tracking-[0.15em] uppercase text-ink-muted">
                      Official quote · {proposal.quoteNumber}.pdf
                    </span>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setIsPdfOpen((open) => !open)}
                        className={smallGhostBtn}
                      >
                        {isPdfOpen ? 'Hide Quote PDF' : 'View Quote PDF'}
                      </button>
                      <a
                        href={proposal.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={smallGhostBtn}
                      >
                        Download ↓
                      </a>
                    </div>
                  </div>

                  {isPdfOpen && (
                    <div className="border border-line-faint border-t-0 bg-[#0a0a0a]">
                      <object
                        data={proposal.pdfUrl}
                        type="application/pdf"
                        className="w-full h-[640px] block"
                      >
                        <p className="p-8 m-0 text-[13px] text-ink-muted text-center">
                          PDF preview unavailable in this browser.{' '}
                          <a
                            href={proposal.pdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-gold"
                          >
                            Open the quote
                          </a>{' '}
                          instead.
                        </p>
                      </object>
                    </div>
                  )}

                  {/* ── Decision bar: pending / declining / accepted / declined ── */}
                  {decision === 'pending' && (
                    <div className="border border-gold/30 border-t-0 bg-gold/[0.06] px-10 py-7 flex justify-between items-center gap-6 flex-wrap">
                      <div className="flex gap-12">
                        <div>
                          <span className="block text-[10px] tracking-[0.2em] uppercase text-ink-muted mb-1">
                            Upfront total
                          </span>
                          <span className="font-serif text-[28px] text-gold">
                            {fmtUsd(proposal.upfrontCents)}
                          </span>
                        </div>
                        {proposal.recurringCents > 0 && (
                          <div>
                            <span className="block text-[10px] tracking-[0.2em] uppercase text-ink-muted mb-1">
                              Then
                            </span>
                            <span className="font-serif text-[28px] text-ink">
                              {fmtUsd(proposal.recurringCents)}
                              <span className="text-sm text-ink-muted">
                                /mo
                              </span>
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-3 flex-wrap">
                        <button
                          onClick={() => setDecision('declining')}
                          disabled={isSubmitting}
                          className="bg-transparent border border-white/15 text-ink-sub text-[13px] tracking-[0.1em] uppercase px-6 py-4 cursor-pointer transition-all duration-300 hover:border-white/40 hover:text-ink disabled:opacity-50"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => respond('accept')}
                          disabled={isSubmitting}
                          className="inline-flex items-center gap-3 border border-gold bg-gold px-7 py-4 text-[13px] uppercase tracking-[0.1em] text-black cursor-pointer transition-all duration-300 hover:bg-transparent hover:text-gold disabled:opacity-50"
                        >
                          Accept Quote{' '}
                          <span className="text-[15px] leading-none">→</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {decision === 'declining' && (
                    <div className="border border-line border-t-0 bg-white/[0.02] px-10 py-8 flex flex-col gap-4">
                      <div>
                        <h3 className="font-serif font-normal text-xl text-ink-em mb-1.5">
                          Not quite right?
                        </h3>
                        <p className="text-[13px] text-ink-muted leading-[1.7]">
                          Tell us what&rsquo;s off, whether that&rsquo;s scope,
                          budget, or timing, and we&rsquo;ll revise the quote or
                          step aside gracefully. This goes straight to{' '}
                          {voice.names}.
                        </p>
                      </div>
                      <Textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        rows={4}
                        placeholder="What would need to change for this to work?"
                        className="resize-y p-3.5 leading-[1.6]"
                      />
                      <div className="flex gap-3 justify-end">
                        <button
                          onClick={() => setDecision('pending')}
                          disabled={isSubmitting}
                          className="bg-transparent border-none text-ink-muted text-[11px] tracking-[0.15em] uppercase px-4 py-3 cursor-pointer transition-colors duration-300 hover:text-ink"
                        >
                          Back
                        </button>
                        <button
                          onClick={() => respond('decline')}
                          disabled={isSubmitting || !feedback.trim()}
                          className="bg-transparent border border-white/20 text-ink text-[11px] tracking-[0.15em] uppercase px-6 py-3 cursor-pointer transition-all duration-300 hover:border-gold hover:text-gold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Send Feedback &amp; Decline
                        </button>
                      </div>
                    </div>
                  )}

                  {decision === 'accepted' && (
                    <div className="border border-gold/50 border-t-0 bg-gold/[0.08] px-10 py-9 text-center">
                      <p className="font-serif text-[26px] text-gold mb-2">
                        Quote accepted. Welcome aboard, {firstName}.
                      </p>
                      <p className="text-[13px] text-ink-sub leading-[1.7]">
                        {voice.acceptedLine}
                      </p>
                    </div>
                  )}

                  {decision === 'declined' && (
                    <div className="border border-white/15 border-t-0 bg-white/[0.02] px-10 py-9 text-center">
                      <p className="font-serif text-2xl text-ink mb-2">
                        Feedback sent. Thank you.
                      </p>
                      <p className="text-[13px] text-ink-muted leading-[1.7]">
                        {voice.declinedLine}
                      </p>
                    </div>
                  )}

                  {error && (
                    <p className="mt-3 text-xs text-red-500">{error}</p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── How we work ── */}
        {proposal.sections.process && (
          <section className="relative z-10 bg-surface backdrop-blur-xs border-y border-line">
            <div className="max-w-6xl mx-auto px-6 py-28">
              <div className="text-center mb-20">
                <h2 className="mb-6 text-xs font-bold tracking-[0.3em] uppercase text-gold">
                  How We Work
                </h2>
                <p className="font-serif text-[clamp(26px,3.5vw,40px)] leading-[1.35] max-w-[720px] mx-auto">
                  Every engagement follows the shape of the business.
                  <br />
                  <span className="text-white/30">
                    Diagnose the workflow. Prioritize the friction. Build what
                    earns its place.
                  </span>
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                {processPhases.map((phase) => (
                  <div
                    key={phase.number}
                    className="flex flex-col gap-3 border-t border-line pt-6"
                  >
                    <span className="font-serif text-[56px] leading-none text-white/5 select-none">
                      {phase.number}
                    </span>
                    <span className="text-gold text-[10px] font-bold tracking-[0.3em] uppercase">
                      {phase.label}
                    </span>
                    <h3 className="font-serif font-normal text-[19px] text-ink-em">
                      {phase.title}
                    </h3>
                    <p className="text-[13px] text-ink-muted leading-[1.65]">
                      {phase.blurb}
                    </p>
                  </div>
                ))}
              </div>
              <div className="text-center mt-16">
                <a
                  href={`${marketingOrigin}/process`}
                  className="text-xs tracking-[0.2em] uppercase text-gold border-b border-gold/30 pb-1 transition-colors duration-300 hover:border-gold"
                >
                  See the full process →
                </a>
              </div>
            </div>
          </section>
        )}

        {/* ── Selected work ── */}
        {proposal.sections.work && (
          <section id="work" className="relative z-10">
            <div className="max-w-6xl mx-auto px-6 py-32">
              <div className="mb-16">
                <h2 className="mb-5 text-xs font-bold tracking-[0.3em] uppercase text-gold">
                  Selected Work
                </h2>
                <p className="font-serif text-[clamp(28px,4vw,48px)] leading-[1.15] max-w-[760px]">
                  Built for owners who{' '}
                  <span className="italic text-gold/90">stake their name</span>{' '}
                  on the result.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {caseStudies.map((study) => (
                  <a
                    key={study.name}
                    href={study.href}
                    className="flex flex-col border border-line-faint bg-card text-ink transition-colors duration-300 hover:border-gold/40"
                  >
                    <div className="aspect-[16/10] overflow-hidden border-b border-line-faint">
                      <img
                        src={study.image}
                        alt={study.alt}
                        className="w-full h-full object-cover object-top block"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-7 flex flex-col gap-2.5 flex-1">
                      <span className="text-[10px] tracking-[0.2em] uppercase text-ink-muted">
                        {study.industry}
                      </span>
                      <h3 className="font-serif font-normal text-2xl text-ink-em">
                        {study.name}
                      </h3>
                      <p className="text-[13px] text-ink-sub leading-[1.65] flex-1">
                        {study.blurb}
                      </p>
                      <span className="mt-2 text-[11px] tracking-[0.15em] uppercase text-gold">
                        {study.stat}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Closing CTA ── */}
        <section className="relative z-10 px-6 py-32 flex flex-col justify-center items-center text-center">
          <p className="mb-8 text-xs font-bold tracking-[0.3em] uppercase text-ink-muted">
            The Next Step
          </p>
          <h2 className="font-serif font-normal text-[clamp(36px,6vw,72px)] max-w-[900px] leading-[1.1]">
            Ready when you are,{' '}
            <span className="italic text-gold/90">{firstName}.</span>
          </h2>
          <p className="mt-6 max-w-[620px] text-ink-muted text-[15px] leading-[1.7]">
            Accept the quote and discovery begins this week. Questions first?
            Call or reply. You will always talk to the person building your
            site.
          </p>
          <a href="#scope" className={`mt-10 ${goldCta}`}>
            Respond to the Quote{' '}
            <span className="text-base leading-none">→</span>
          </a>
          <span className="mt-5 text-[11px] tracking-[0.15em] uppercase text-ink-faint">
            Valid until {validUntil} · Accept or decline in one click
          </span>
        </section>
      </main>

      {/* ── Footer (mirrors marketing Footer.tsx, cross-origin links) ── */}
      <footer className="py-12 px-8 bg-surface backdrop-blur-xs border-t border-line flex flex-col md:flex-row justify-between items-end text-[10px] uppercase tracking-widest text-ink-muted relative z-10">
        <div className="space-y-2 text-left">
          <p>© RelentNet {new Date().getFullYear()}</p>
          <p>TN • LA • GA • FL</p>
        </div>
        <div className="flex gap-6 mt-6 md:mt-0">
          <a
            href={`${marketingOrigin}/diagnostic`}
            className="hover:text-gold transition-colors"
          >
            Diagnostic
          </a>
          <a
            href={`${marketingOrigin}/portal`}
            className="hover:text-gold transition-colors"
          >
            Client Portal
          </a>
          <a
            href={`${marketingOrigin}/legal`}
            className="hover:text-gold transition-colors"
          >
            Legal
          </a>
        </div>
      </footer>
    </div>
  )
}
