import { linkIdOf } from '../shared/types.ts'

import type { Proposal } from '../shared/types.ts'

const webhookUrl = process.env.NOTIFY_WEBHOOK_URL
export const publicOrigin =
  process.env.PUBLIC_ORIGIN ?? 'https://ap.relentnet.com'

export type NotifyEvent = 'viewed' | 'accepted' | 'declined'

const isDiscord = (url: string) =>
  /^https:\/\/(discord\.com|discordapp\.com)\/api\/webhooks\//.test(url)

const usd = (cents: number) => `$${(cents / 100).toLocaleString('en-US')}`

/** Discord webhooks want { content } markdown, not our raw payload. */
export function discordContent(event: NotifyEvent, proposal: Proposal): string {
  const money = `${usd(proposal.upfrontCents)} upfront${
    proposal.recurringCents > 0 ? ` + ${usd(proposal.recurringCents)}/mo` : ''
  }`
  return [
    `**${event.toUpperCase()}** · ${proposal.clientName} · ${proposal.projectName}`,
    `${proposal.quoteNumber} · ${money}`,
    proposal.feedback ? `Feedback: "${proposal.feedback}"` : '',
    `${publicOrigin}/p/${linkIdOf(proposal)}`,
  ]
    .filter(Boolean)
    .join('\n')
    .slice(0, 1900)
}

/**
 * Tells Brandon and Daniel a proposal changed state. Fire-and-forget POST to
 * a webhook; a Discord webhook URL gets a formatted message, anything else
 * (n8n, Zapier, custom) gets the raw JSON payload. Logs when no webhook is
 * configured. Never blocks or fails the client's request.
 */
export function notify(event: NotifyEvent, proposal: Proposal): void {
  console.log(
    `[notify] ${event}: ${proposal.clientName} · ${proposal.projectName}`,
  )
  if (!webhookUrl) return

  const body = isDiscord(webhookUrl)
    ? { content: discordContent(event, proposal) }
    : {
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

  fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(5000),
  }).catch((err: unknown) => {
    console.error('[notify] webhook failed:', err)
  })
}
