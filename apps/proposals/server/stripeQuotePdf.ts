import { extractText, getDocumentProxy } from 'unpdf'

import type { Cadence, LineItem } from '../shared/types.ts'

export interface ParsedQuoteFields {
  quoteNumber: string
  /** ISO date (YYYY-MM-DD), '' when not found */
  validUntil: string
  clientName: string
  clientEmail: string
  projectName: string
  lineItems: Array<LineItem>
  upfrontCents: number
  recurringCents: number
}

const MONTHS: Record<string, string> = {
  jan: '01',
  feb: '02',
  mar: '03',
  apr: '04',
  may: '05',
  jun: '06',
  jul: '07',
  aug: '08',
  sep: '09',
  oct: '10',
  nov: '11',
  dec: '12',
}

/** 'Aug 27, 2026' → '2026-08-27' (string-built to avoid timezone drift). */
function toIsoDate(display: string): string {
  const m = /([A-Za-z]{3,9})\.?\s+(\d{1,2}),\s*(\d{4})/.exec(display)
  if (!m) return ''
  const month = MONTHS[m[1].slice(0, 3).toLowerCase()]
  return month ? `${m[3]}-${month}-${m[2].padStart(2, '0')}` : ''
}

function toCents(amount: string): number {
  return Math.round(parseFloat(amount.replace(/[$,]/g, '')) * 100)
}

/** Stripe PDFs render some text twice (bold overlay): 'Ada AdaAda Ada' → 'Ada Ada'. */
function undouble(line: string): string {
  const half = line.length / 2
  return Number.isInteger(half) && line.slice(0, half) === line.slice(half)
    ? line.slice(0, half)
    : line
}

/**
 * Best-effort field extraction from a Stripe quote PDF's text layer. Layout
 * verified against a real RelentNet Stripe quote; every field stays editable
 * in the generator, so a miss costs a manual keystroke, not correctness.
 */
// ponytail: text-layer scraping. If Stripe reshuffles its PDF layout, switch
// to the Stripe API (quotes.list → match `number`, then listLineItems).
export function parseQuoteText(raw: string): ParsedQuoteFields {
  const lines = raw
    .split('\n')
    .map((l) => undouble(l.trim()))
    .filter(Boolean)

  const text = lines.join('\n')

  const quoteNumber = (
    /QUOTE NUMBER\s+([A-Z0-9-]+)/i.exec(text)?.[1] ?? ''
  ).replace(/-DRAFT$/, '')

  const validUntil = toIsoDate(
    /EXPIRATION DATE\s+([A-Za-z]{3,9}\.?\s+\d{1,2},\s*\d{4})/i.exec(
      text,
    )?.[1] ??
      /Valid until\s+([A-Za-z]{3,9}\.?\s+\d{1,2},\s*\d{4})/i.exec(text)?.[1] ??
      '',
  )

  // 'QUOTE FOR' is followed by the client's name, then contact lines.
  let clientName = ''
  let clientEmail = ''
  const quoteForAt = lines.findIndex((l) => /^QUOTE FOR$/i.test(l))
  if (quoteForAt !== -1) {
    clientName = lines[quoteForAt + 1] ?? ''
    clientEmail =
      lines
        .slice(quoteForAt + 1, quoteForAt + 6)
        .find((l) => l.includes('@')) ?? ''
  }

  // The quote header (we set it to the project name) is the line after the
  // 'QUOTE' banner, with a totals-column amount sometimes bleeding into it.
  let projectName = ''
  if (lines[0]?.startsWith('QUOTE')) {
    const candidate = (lines[1] ?? '').replace(/\s*\$[\d,.]+\s*$/, '').trim()
    if (candidate && !/^(Valid until|QUOTE|ISSUE DATE)/i.test(candidate)) {
      projectName = candidate
    }
  }

  // Line items live between the table header and 'Subtotal'. Each block is
  // NAME, description lines, then 'QTY $UNIT[ / period] $AMOUNT'.
  const lineItems: Array<LineItem> = []
  const tableAt = lines.findIndex((l) => /^DESCRIPTION\s+QTY/i.test(l))
  if (tableAt !== -1) {
    let block: Array<string> = []
    for (const line of lines.slice(tableAt + 1)) {
      if (/^(Subtotal|Total|Upfront total)\b/i.test(line)) break
      const priced = /^\d+\s+\$[\d,.]+(\s*\/\s*(\w+))?\s+\$([\d,.]+)$/.exec(
        line,
      )
      if (!priced) {
        block.push(line)
        continue
      }
      if (block.length > 0) {
        const cadence: Cadence = priced[2] ? 'monthly' : 'one-time'
        lineItems.push({
          name: block[0],
          description: block.slice(1).join(' '),
          amountCents: toCents(priced[3]),
          cadence,
        })
      }
      block = []
    }
  }

  const recurringSum = lineItems
    .filter((i) => i.cadence === 'monthly')
    .reduce((sum, i) => sum + i.amountCents, 0)
  const allSum = lineItems.reduce((sum, i) => sum + i.amountCents, 0)

  const upfrontMatch =
    /Upfront total\s+\$([\d,.]+)/i.exec(text) ??
    /^Total\s+\$([\d,.]+)/im.exec(text)
  const recurringMatch = /Recurring total\s+\$([\d,.]+)$/im.exec(text)

  return {
    quoteNumber,
    validUntil,
    clientName,
    clientEmail,
    projectName,
    lineItems,
    upfrontCents: upfrontMatch ? toCents(upfrontMatch[1]) : allSum,
    recurringCents: recurringMatch ? toCents(recurringMatch[1]) : recurringSum,
  }
}

export async function parseQuotePdf(
  buf: Uint8Array,
): Promise<ParsedQuoteFields> {
  const pdf = await getDocumentProxy(buf)
  const { text } = await extractText(pdf, { mergePages: true })
  return parseQuoteText(text)
}
