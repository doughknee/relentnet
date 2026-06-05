import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  className?: string
  /** Animation delay (ms) applied once the element scrolls into view. */
  delay?: number
  /** IntersectionObserver threshold. */
  threshold?: number
}

/**
 * Reveal-on-scroll wrapper. Fades + rises its children in with the site's
 * `animate-fade-in-up` keyframe the first time they cross into view (or
 * immediately, for above-the-fold content). Respects prefers-reduced-motion
 * via the global rule in styles.css.
 */
export function Reveal({
  children,
  className = '',
  delay,
  threshold = 0.12,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return (
    <div
      ref={ref}
      className={`${shown ? 'animate-fade-in-up' : 'opacity-0'} ${className}`}
      style={shown && delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
