import { useEffect, useRef, useState } from 'react'

/**
 * Reveal-on-scroll hook backed by IntersectionObserver.
 *
 * Attach `ref` to the section element. When the section first crosses
 * the threshold of the viewport, `isRevealed` flips to true and stays true
 * for the lifetime of the component. The observer disconnects after the
 * first reveal so this is cheap to use on many sections.
 *
 * Matches the pattern already used in `routes/index.tsx` and
 * `routes/process.tsx`. Extracted so detail-page components can share it
 * without duplicating IntersectionObserver wiring across files.
 */
export function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null)
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return { ref, isRevealed }
}
