import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import { parseQuotePdf, parseQuoteText } from './stripeQuotePdf.ts'

const samplePdf = join(
  import.meta.dirname,
  '../../../design_handoff_proposal_studio/assets/sample-quote.pdf',
)

describe('parseQuotePdf', () => {
  it('extracts every field from the real sample Stripe quote', async () => {
    const parsed = await parseQuotePdf(new Uint8Array(readFileSync(samplePdf)))

    expect(parsed.quoteNumber).toBe('QT-SHX6JT2B')
    expect(parsed.validUntil).toBe('2026-08-27')
    expect(parsed.clientName).toBe('Will Colley')
    expect(parsed.clientEmail).toBe('wcolley72@gmail.com')
    expect(parsed.projectName).toBe('Amelia Island Beach Condos')
    expect(parsed.upfrontCents).toBe(630000)
    expect(parsed.recurringCents).toBe(30000)

    expect(parsed.lineItems).toHaveLength(2)
    const [hosting, build] = parsed.lineItems
    expect(hosting.name).toBe('Managed Hosting & Maintenance')
    expect(hosting.cadence).toBe('monthly')
    expect(hosting.amountCents).toBe(30000)
    expect(hosting.description).toMatch(/^Managed hosting with SSL/)
    expect(build.name).toBe('Website Design & Development')
    expect(build.cadence).toBe('one-time')
    expect(build.amountCents).toBe(600000)
  })

  it('falls back to line-item sums when totals lines are missing', () => {
    const parsed = parseQuoteText(
      [
        'QUOTE',
        'QUOTE NUMBER QT-ABC123',
        'DESCRIPTION QTY UNIT PRICE AMOUNT',
        'Thing',
        'One-off work.',
        '1 $1,000.00 $1,000.00',
        'Care plan',
        '1 $50.00 / month $50.00',
      ].join('\n'),
    )
    expect(parsed.upfrontCents).toBe(105000)
    expect(parsed.recurringCents).toBe(5000)
    expect(parsed.validUntil).toBe('')
  })
})
