import { useCallback, useEffect, useRef, useState } from 'react'

import type { CaseStudyHeroBeat } from '@/data/caseStudies'

interface CaseStudyHeroCyclerProps {
  beats: ReadonlyArray<CaseStudyHeroBeat>
  /** Auto-advance interval in milliseconds. Default 4500ms. */
  intervalMs?: number
}

const DEFAULT_INTERVAL_MS = 4500

/**
 * Story-beat cycling showcase modeled on myscrollr's HeroSection. The
 * component owns its own auto-advance timer and active-index state.
 * Crossfade is a plain CSS opacity transition on stacked, absolutely-
 * positioned images — no animation library required.
 *
 * Renders nothing when `beats` is empty. The parent hero is responsible
 * for choosing whether to render the cycler or fall back to a single
 * static image.
 *
 * Image chrome is owned by the cycler (bare <img>, not CaseStudyImage)
 * so the hero stays a single framed surface instead of nesting a
 * <figure> per beat inside an outer frame.
 */
export function CaseStudyHeroCycler({
  beats,
  intervalMs = DEFAULT_INTERVAL_MS,
}: CaseStudyHeroCyclerProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [progressKey, setProgressKey] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const restartTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    setProgressKey((k) => k + 1)
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % beats.length)
      setProgressKey((k) => k + 1)
    }, intervalMs)
  }, [beats.length, intervalMs])

  useEffect(() => {
    if (beats.length === 0) return
    restartTimer()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [beats.length, restartTimer])

  const handleSelect = useCallback(
    (index: number) => {
      setActiveIndex(index)
      restartTimer()
    },
    [restartTimer],
  )

  if (beats.length === 0) {
    return null
  }

  const safeIndex = Math.min(activeIndex, beats.length - 1)
  const activeBeat = beats[safeIndex]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
      {/* Image stack — only the active one is opaque */}
      <div className="relative aspect-video w-full overflow-hidden border border-line-faint bg-inset">
        {beats.map((beat, idx) => (
          <div
            key={idx}
            className="absolute inset-0 transition-opacity duration-500 ease-out"
            style={{
              opacity: idx === safeIndex ? 1 : 0,
              pointerEvents: 'none',
            }}
          >
            <img
              src={beat.image.src}
              alt={beat.image.alt}
              width={beat.image.width}
              height={beat.image.height}
              loading={idx === 0 ? 'eager' : 'lazy'}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Blurb + progress controls */}
      <div className="flex flex-col gap-6">
        <p
          key={`blurb-${safeIndex}`}
          className="text-ink-sub text-lg md:text-xl font-light leading-relaxed animate-fade-in-up"
        >
          {activeBeat.blurb}
        </p>

        <div
          role="group"
          aria-label="Story beats"
          className="flex gap-2 max-w-md"
        >
          {beats.map((beat, idx) => {
            const isActive = idx === safeIndex
            return (
              <button
                key={idx}
                type="button"
                aria-pressed={isActive}
                aria-label={`Show ${beat.sectionRef} beat`}
                onClick={() => handleSelect(idx)}
                className="flex-1 cursor-pointer py-3 sm:py-2 group focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
              >
                <div className="h-1 rounded-full overflow-hidden bg-line-faint">
                  {isActive ? (
                    <div
                      key={`fill-${progressKey}`}
                      className="h-full bg-gold origin-left animate-progress-fill"
                      style={{ animationDuration: `${intervalMs}ms` }}
                    />
                  ) : null}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
