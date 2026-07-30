import { useRef } from 'react'
import { useInView } from 'motion/react'

import { Scramble } from '@/components/Scramble'

import type { ReactNode } from 'react'

/** Mono section eyebrow preceded by the 28×1px gold rule. */
export function Eyebrow({
  children,
  className = '',
  scramble = false,
}: {
  children: ReactNode
  className?: string
  /** Decode the label through random glyphs the first time it scrolls into
   *  view. String children only — anything else renders plain. */
  scramble?: boolean
}) {
  const ref = useRef<HTMLParagraphElement>(null)
  // Once-per-view latch; only ever flips client-side, so the scramble/plain
  // branch never differs between server and client.
  const inView = useInView(ref, { once: true, amount: 0.5 })

  const text =
    scramble && typeof children === 'string' ? (children as string) : null

  return (
    <p
      ref={ref}
      className={`font-mono text-[11px] tracking-[0.3em] uppercase text-gold-text font-medium ${className}`}
    >
      <span
        aria-hidden="true"
        className="inline-block w-7 h-px bg-gold align-middle mr-3.5"
      />
      {text !== null ? <Scramble text={text} active={inView} /> : children}
    </p>
  )
}
