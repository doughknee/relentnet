import { Link, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import { linkIdOf } from '../../shared/types'
import type { Proposal, ProposalStatus } from '../../shared/types'
import { StudioError, StudioHeader } from '@/components/StudioHeader'
import { api } from '@/lib/api'
import { fmtDateShort, fmtUsd, fmtUsdCompact } from '@/lib/format'

export const Route = createFileRoute('/dashboard')({
  loader: () => api.listProposals(),
  head: () => ({ meta: [{ title: 'Dashboard · Proposal Studio' }] }),
  errorComponent: StudioError,
  component: Dashboard,
})

const rowGrid = 'grid grid-cols-[2.4fr_1.6fr_1fr_1fr_1.1fr_0.9fr] gap-4 px-7'

const pillStyles: Record<ProposalStatus, string> = {
  accepted: 'bg-gold/[0.12] border-gold/50 text-gold',
  declined: 'bg-white/[0.04] border-white/20 text-ink-sub',
  viewed: 'bg-white/[0.02] border-white/[0.12] text-ink-muted',
  sent: 'bg-transparent border-line text-ink-faint',
}

function Dashboard() {
  const proposals = Route.useLoaderData()
  const [openFeedbackId, setOpenFeedbackId] = useState<string | null>(null)

  const accepted = proposals.filter((p) => p.status === 'accepted')
  const awaiting = proposals.filter(
    (p) => p.status === 'sent' || p.status === 'viewed',
  )
  const declined = proposals.filter((p) => p.status === 'declined')
  const acceptedValue = accepted.reduce((sum, p) => sum + p.upfrontCents, 0)

  const stats: Array<{ label: string; value: string; tone: string }> = [
    {
      label: 'Proposals sent',
      value: String(proposals.length),
      tone: 'text-ink-em',
    },
    {
      label: 'Awaiting response',
      value: String(awaiting.length),
      tone: 'text-ink',
    },
    { label: 'Accepted', value: String(accepted.length), tone: 'text-gold' },
    {
      label: 'Declined',
      value: String(declined.length),
      tone: 'text-ink-muted',
    },
    {
      label: 'Accepted value',
      value: fmtUsdCompact(acceptedValue),
      tone: 'text-gold',
    },
  ]

  return (
    <div className="min-h-screen">
      <StudioHeader />

      <main className="max-w-[1200px] mx-auto px-8 pt-12 pb-24 flex flex-col gap-10">
        <div className="flex justify-between items-end gap-6 flex-wrap">
          <div>
            <h1 className="font-serif font-normal text-[34px] mb-2">
              Proposal <span className="italic text-gold/90">Dashboard</span>
            </h1>
            <p className="text-[13px] text-ink-muted leading-[1.7]">
              Every quote you&rsquo;ve sent: who&rsquo;s viewed, who&rsquo;s
              accepted, and what the no&rsquo;s said.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 border border-dashed border-white/20 px-6 py-3.5 text-[11px] tracking-[0.15em] uppercase text-ink-sub transition-all duration-300 hover:border-gold/60 hover:text-gold whitespace-nowrap"
          >
            <span className="text-gold text-sm">↑</span> Drop a quote PDF · New
            proposal
          </Link>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="border border-line-faint bg-card px-6 py-5"
            >
              <p className="mb-1.5 text-[10px] tracking-[0.2em] uppercase text-ink-muted">
                {stat.label}
              </p>
              <p className={`font-serif text-3xl ${stat.tone}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* ── Proposals table ── */}
        <div className="border border-line-faint bg-white/[0.02] overflow-x-auto">
          <div className="min-w-[860px]">
            <div
              className={`${rowGrid} py-3.5 border-b border-line text-[10px] tracking-[0.2em] uppercase text-ink-faint`}
            >
              <span>Client / Project</span>
              <span>Quote</span>
              <span>Upfront</span>
              <span>Sent</span>
              <span>Status</span>
              <span className="text-right">Actions</span>
            </div>

            {proposals.length === 0 && (
              <p className="px-7 py-10 text-[13px] text-ink-muted">
                No proposals yet. Drop a Stripe quote in the generator to send
                your first.
              </p>
            )}

            {proposals.map((proposal: Proposal) => {
              const isOpen = openFeedbackId === proposal.id
              return (
                <div key={proposal.id}>
                  <div
                    className={`${rowGrid} py-5 border-b border-line-faint items-center transition-colors duration-300 hover:bg-white/[0.02]`}
                  >
                    <div>
                      <p className="text-sm text-ink-em mb-0.5">
                        {proposal.clientName}
                      </p>
                      <p className="text-xs text-ink-muted">
                        {proposal.projectName}
                      </p>
                    </div>
                    <span className="font-mono text-xs text-ink-muted">
                      {proposal.quoteNumber}
                    </span>
                    <span className="font-serif text-[17px] text-ink">
                      {fmtUsd(proposal.upfrontCents)}
                    </span>
                    <span className="text-xs text-ink-muted">
                      {fmtDateShort(proposal.sentAt)}
                    </span>
                    <span>
                      <span
                        className={`inline-block border text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 ${pillStyles[proposal.status]}`}
                      >
                        {proposal.status}
                      </span>
                    </span>
                    <div className="flex justify-end gap-2">
                      {proposal.feedback && (
                        <button
                          onClick={() =>
                            setOpenFeedbackId(isOpen ? null : proposal.id)
                          }
                          className={`border text-[10px] tracking-[0.1em] uppercase px-3 py-2 cursor-pointer transition-all duration-300 whitespace-nowrap ${
                            isOpen
                              ? 'bg-gold/10 border-gold/50 text-gold'
                              : 'bg-transparent border-white/15 text-ink-sub'
                          }`}
                        >
                          {isOpen ? 'Hide' : 'Feedback'}
                        </button>
                      )}
                      <a
                        href={`/p/${linkIdOf(proposal)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="border border-line text-ink-muted text-[10px] tracking-[0.1em] uppercase px-3 py-2 transition-all duration-300 hover:border-gold/60 hover:text-gold whitespace-nowrap"
                      >
                        Page →
                      </a>
                    </div>
                  </div>

                  {isOpen && proposal.feedback && (
                    <div className="px-7 py-6 pb-7 border-b border-line-faint bg-black/25 grid grid-cols-[auto_1fr] gap-5 items-start">
                      <span className="text-[10px] tracking-[0.2em] uppercase text-ink-faint pt-1">
                        Their feedback
                      </span>
                      <div>
                        <p className="mb-2.5 font-serif italic text-base leading-[1.6] text-ink-sub">
                          &ldquo;{proposal.feedback}&rdquo;
                        </p>
                        <p className="text-[11px] tracking-[0.1em] uppercase text-ink-faint">
                          Declined{' '}
                          {proposal.respondedAt
                            ? fmtDateShort(proposal.respondedAt)
                            : '-'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <p className="text-[11px] text-ink-faint leading-[1.7]">
          Statuses update live: <span className="text-ink-muted">Sent</span> →{' '}
          <span className="text-ink-muted">Viewed</span> when the link is first
          opened, then <span className="text-gold">Accepted</span> or{' '}
          <span className="text-ink-sub">Declined</span> when the client
          responds. Declines always carry feedback.
        </p>
      </main>
    </div>
  )
}
