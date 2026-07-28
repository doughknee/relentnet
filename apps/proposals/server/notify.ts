import { linkIdOf } from '../shared/types.ts'

import type { Proposal } from '../shared/types.ts'

const webhookUrl = process.env.NOTIFY_WEBHOOK_URL
export const publicOrigin =
  process.env.PUBLIC_ORIGIN ?? 'https://ap.relentnet.com'

export type NotifyEvent = 'viewed' | 'accepted' | 'declined'

/**
 * Tells Daniel a proposal changed state. Fire-and-forget POST to an n8n-style
 * webhook (same pattern as the marketing inquiry form); logs when no webhook
 * is configured. Never blocks or fails the client's request.
 */
export function notify(event: NotifyEvent, proposal: Proposal): void {
  const payload = {
    event,
    clientName: proposal.clientName,
    clientEmail: proposal.clientEmail,
    projectName: proposal.projectName,
    quoteNumber: proposal.quoteNumber,
    upfrontCents: proposal.upfrontCents,
    recurringCents: proposal.recurringCents,
    feedback: proposal.feedback,
    url: `${publicOrigin}/p/${linkIdOf(proposal)}`,
    at: new Date().toISOString(),
  }
  console.log(
    `[notify] ${event}: ${proposal.clientName} · ${proposal.projectName}`,
  )
  if (!webhookUrl) return
  fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(5000),
  }).catch((err: unknown) => {
    console.error('[notify] webhook failed:', err)
  })
}
