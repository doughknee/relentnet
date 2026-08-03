import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'

import type { ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  className?: string
  /** Animation delay (ms) applied once the element scrolls into view. */
  delay?: number
  /** In-view threshold (portion of the element that must be visible). */
  threshold?: number
}

/** The brand ease used by every entrance on the site. */
const EASE = [0.2, 0.8, 0.2, 1] as const

/**
 * Reveal-on-scroll wrapper, driven by Motion. Fades + rises its children the
 * first time they cross into view. Fails open after 2.5s so prerenders,
 * hidden tabs, and screenshot runs never strand content at opacity 0 — but
 * fail-open snaps (duration 0) instead of tweening, so dozens of below-fold
 * sections don't all animate offscreen on the main thread at once.
 * Honors reduced motion via the root MotionConfig.
 */
export function Reveal({
  children,
  className = '',
  delay = 0,
  threshold = 0.12,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: threshold })
  const [failOpen, setFailOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setFailOpen(true), 2500)
    return () => clearTimeout(timer)
  }, [])

  const shown = inView || failOpen

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={shown ? { opacity: 1, y: 0 } : undefined}
      transition={
        inView
          ? { duration: 0.9, ease: EASE, delay: delay / 1000 }
          : { duration: 0 }
      }
    >
      {children}
    </motion.div>
  )
}
