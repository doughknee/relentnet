import { useRef } from 'react'
import { stagger } from 'motion'
import { useInView, useReducedMotion } from 'motion/react'
import { ScrambleText } from 'motion-plus/react'

import type { ReactNode } from 'react'

/** Uppercase + digits only — the eyebrows' own glyph set, so the churn stays
 *  quiet instead of flashing punctuation noise at 11px. */
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

/** Mono section eyebrow preceded by the 28×1px gold rule. */
export function Eyebrow({
  children,
  className = '',
  scramble = false,
}: {
  children: ReactNode
  className?: string
  /** Decode the label through random glyphs the first time it scrolls into
   *  view (Motion UI's "Scramble reveal" mechanic). String children only —
   *  anything else renders plain. Inert under reduced motion. */
  scramble?: boolean
}) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reducedMotion = useReducedMotion()
  // Once-per-view latch; `active` only ever flips client-side, so the
  // scramble/plain branch below never differs between server and client.
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
      {text !== null ? (
        /* A11y split from Motion UI's scramble-reveal: the in-flow span owns
           the accessible name and pins the layout box; the visible overlay is
           aria-hidden so assistive tech never reads churning glyphs. The mono
           face is fixed-width, so a swapped-in glyph can't reflow the line. */
        <span className="relative inline-block">
          <span className="opacity-0">{text}</span>
          <ScrambleText
            as="span"
            aria-hidden="true"
            className="absolute inset-0"
            active={inView && !reducedMotion}
            duration={1}
            delay={stagger(0.02)}
            chars={SCRAMBLE_CHARS}
          >
            {text}
          </ScrambleText>
        </span>
      ) : (
        children
      )}
    </p>
  )
}
