import type { ProofStat as ProofStatData } from '@/data/proof'
import { formatProof } from '@/data/proof'

/** Proof-band figure: gold rule, big value, mono label, short note. */
export function ProofStat({ stat }: { stat: ProofStatData }) {
  return (
    <div className="border-l-2 border-gold pl-6 flex flex-col gap-2.5">
      <p className="font-serif text-[48px] md:text-[56px] leading-[60px] text-gold-text">
        {formatProof(stat)}
      </p>
      <p className="font-mono text-xs tracking-[0.22em] uppercase font-medium leading-4 text-ink-em">
        {stat.label}
      </p>
      <p className="text-[15px] leading-6 text-ink-muted">{stat.description}</p>
    </div>
  )
}
