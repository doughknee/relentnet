import type { ReactNode } from 'react'

/**
 * Mono section eyebrow preceded by the 28×1px gold rule.
 *
 * Deliberately static: these labels never change, so a decode here only ever
 * played once on scroll-in and read as noise next to the Fig. captions, where
 * the scramble marks copy that genuinely swaps. See `Scramble`.
 */
export function Eyebrow({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <p
      className={`font-mono text-[11px] tracking-[0.3em] uppercase text-gold-text font-medium ${className}`}
    >
      <span
        aria-hidden="true"
        className="inline-block w-7 h-px bg-gold align-middle mr-3.5"
      />
      {children}
    </p>
  )
}
