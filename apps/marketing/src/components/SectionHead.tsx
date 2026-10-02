import type { ReactNode } from 'react'
import { Eyebrow } from '@/components/Eyebrow'
import { Reveal } from '@/components/Reveal'

/** The page grid in the redesign frames: 1280 of content at 1440 wide, with
 *  the 20px mobile gutter. Every band on /diagnostic and /process uses it. */
export const sectionInner =
  'max-w-[1440px] mx-auto px-5 md:px-12 xl:px-20 py-[72px] md:py-[104px]'

/** Band surfaces, alternating down the page. The page surface is
 *  transparent so the starfield and the light-theme grid show through. */
export const surfaces = {
  page: 'border-t border-line',
  card: 'border-t border-line bg-card',
  tint: 'border-t border-line bg-gold-tint',
} as const

export const leadClass =
  'text-[17px] md:text-[21px] font-light leading-[1.6] md:leading-[34px] text-ink-sub'

interface SectionHeadProps {
  eyebrow: string
  /** The heading. Wrap the italic gold tail in a span. */
  children: ReactNode
  /** Lead paragraph, set beside the heading on wide screens. */
  lead?: ReactNode
  className?: string
}

/** Eyebrow, display heading, and an optional lead paragraph beside it. */
export function SectionHead({
  eyebrow,
  children,
  lead,
  className = '',
}: SectionHeadProps) {
  return (
    <div
      className={`grid grid-cols-1 min-[1024px]:grid-cols-[minmax(0,560px)_minmax(0,1fr)] gap-x-[72px] gap-y-5 items-end ${className}`}
    >
      <div>
        <Reveal>
          <Eyebrow className="mb-5">{eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={100}>
          <h2 className="font-serif text-[clamp(34px,4.4vw,56px)] leading-[1.07] text-balance">
            {children}
          </h2>
        </Reveal>
      </div>
      {lead && (
        <Reveal delay={200}>
          <p className={leadClass}>{lead}</p>
        </Reveal>
      )}
    </div>
  )
}
