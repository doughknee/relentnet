/**
 * The three proof figures, stated once. Same values, labels, and notes as the
 * homepage ledger in routes/index.tsx (`heroStat` + `stats`); /clients reads
 * them from here, and the homepage moves over in a follow-up so there is one
 * source. Never type these figures anywhere else.
 */
export interface ProofStat {
  label: string
  value: number
  prefix?: string
  suffix?: string
  format?: Intl.NumberFormatOptions
  description: string
}

export const proofStats: ReadonlyArray<ProofStat> = [
  {
    label: 'Hours of admin automated',
    value: 10000,
    suffix: '+',
    description:
      'Invoice filing, follow-ups, and handoffs: manual work now handled by systems we run.',
  },
  {
    label: 'Uptime across hosted systems',
    value: 99.99,
    suffix: '%',
    // Two digits, or 99.99 rounds to a "100.0%" that claims perfect uptime.
    format: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
    description:
      'We host, monitor, and answer for everything we build, around the clock.',
  },
  {
    label: 'In business',
    prefix: 'Since ',
    value: 2022,
    // A year, so no thousands separator.
    format: { useGrouping: false, maximumFractionDigits: 0 },
    description: 'Building, hosting, and stewarding for owner-led businesses.',
  },
]

/** The figure as printed: "10,000+", "99.99%", "Since 2022". */
export function formatProof(stat: ProofStat): string {
  const n = new Intl.NumberFormat('en-US', stat.format).format(stat.value)
  return `${stat.prefix ?? ''}${n}${stat.suffix ?? ''}`
}
