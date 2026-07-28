const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})
const usdExact = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

/** 630000 → '$6,300' · 495050 → '$4,950.50' */
export function fmtUsd(cents: number): string {
  return cents % 100 === 0
    ? usd.format(cents / 100)
    : usdExact.format(cents / 100)
}

/** Large-figure stat, dashboard style: 2320000 → '$23.2k' */
export function fmtUsdCompact(cents: number): string {
  const dollars = cents / 100
  return dollars >= 1000 ? `$${(dollars / 1000).toFixed(1)}k` : fmtUsd(cents)
}

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

/** '2026-08-27' → 'Aug 27, 2026' (string-built to avoid timezone drift). */
export function fmtDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-')
  const month = MONTHS[Number(m) - 1]
  return month ? `${month} ${Number(d)}, ${y}` : isoDate
}

/** ISO datetime → 'Jul 28' (dashboard sent column). */
export function fmtDateShort(isoDateTime: string): string {
  const d = new Date(isoDateTime)
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`
}

export function firstNameOf(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] || fullName
}
