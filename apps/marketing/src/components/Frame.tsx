import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'

import { Scramble } from '@/components/Scramble'

import type { ReactNode } from 'react'

/**
 * Screenshot frame: 1px line border, 10px padding, page background, with the
 * scanline overlay and drafting-style crop marks at the corners. Put the
 * image inside with `group-hover:scale-[1.03]` classes for the designed hover
 * zoom (the figure is the `group`). Optional `caption` renders a mono
 * "Fig. 01 — ..." line under the image.
 *
 * `reveal` adds a scroll-linked curtain (Motion's Scroll Image Reveal
 * pattern): the plate opens from center via clip-path while the content
 * settles from a slight zoom, both mapped to scroll progress. The curtain
 * applies only after hydration — the prerendered HTML ships unclipped, so
 * crawlers and no-JS visitors never see a closed curtain — and is skipped
 * entirely under reduced motion (scroll-bound styles bypass MotionConfig,
 * so the gate must be manual).
 */
export function Frame({
  children,
  caption,
  className = '',
  reveal = false,
  scrambleCaption = false,
}: {
  children: ReactNode
  caption?: string
  className?: string
  reveal?: boolean
  /** Decode the caption through random glyphs, and re-decode whenever it
   *  changes. For frames whose caption swaps under the reader (a tabbed
   *  gallery); a static caption gains nothing from it. */
  scrambleCaption?: boolean
}) {
  const ref = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])

  // Not `once` — the caption re-decodes on every change, so it needs live
  // visibility to avoid churning offscreen.
  const inView = useInView(ref, { amount: 0.4 })

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  // Curtain fully open at 40% of the figure's journey — roughly when it
  // reaches the middle of the viewport on the way up.
  const clipPath = useTransform(
    scrollYProgress,
    [0, 0.4],
    ['inset(0% 50% 0% 50%)', 'inset(0% 0% 0% 0%)'],
  )
  const scale = useTransform(scrollYProgress, [0, 0.4], [1.15, 1])

  const curtain = reveal && hydrated && !reducedMotion

  return (
    <figure
      ref={ref}
      className={`group relative border border-line p-2.5 bg-page ${className}`}
    >
      {/* Drafting crop marks */}
      <span
        aria-hidden="true"
        className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t border-l border-gold-deep"
      />
      <span
        aria-hidden="true"
        className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t border-r border-gold-deep"
      />
      <span
        aria-hidden="true"
        className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b border-l border-gold-deep"
      />
      <span
        aria-hidden="true"
        className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b border-r border-gold-deep"
      />
      <motion.div
        className="overflow-hidden relative"
        style={curtain ? { clipPath } : undefined}
      >
        {/* Scale rides its own wrapper so the CSS hover zoom on the image
            keeps its transform; scanlines stay outside the zoom (they're a
            screen texture, not part of the plate). */}
        <motion.div style={curtain ? { scale } : undefined}>
          {children}
        </motion.div>
        <span
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none scanlines"
        />
      </motion.div>
      {caption && (
        <figcaption className="mt-2.5 font-mono text-[10px] tracking-[0.22em] uppercase text-ink-faint">
          {scrambleCaption ? (
            // Deliberately NOT keyed on the caption: ScrambleText transitions
            // between words on its own when children change. Remounting it
            // instead paints the settled new caption for a frame before the
            // decode starts, so the swap read as new text, churn, same text.
            <Scramble text={caption} active={inView} />
          ) : (
            caption
          )}
        </figcaption>
      )}
    </figure>
  )
}
