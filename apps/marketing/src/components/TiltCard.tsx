import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useSpring, useTransform } from 'motion/react'

import type { PointerEvent, ReactNode } from 'react'

/**
 * Critically damped (ζ≈1.01), so the card settles into the pointer with no
 * overshoot — the brand's no-bounce rule, expressed as physics rather than a
 * bezier because the tilt is interruptible mid-flight.
 */
const TILT_SPRING = { stiffness: 300, damping: 35 } as const

/** Plate separation present the moment you hover, before the pointer moves. */
const PLATE_BASE = 4
/** Extra separation the plates gain as the card leans, in px. */
const PLATE_TRACK = 7
/** How far the card rises toward the viewer on hover, in px of Z. */
const LIFT = 16

/* The two inks of the brand's chromatic misregistration: a faint ghost that
   trails up-left and the saturated plate that leads down-right. Sharp-edged
   (zero blur) — this is a printing plate out of register, not a glow. */
const INK_GHOST = 'rgba(203, 171, 69, 0.35)'
const INK_PLATE = 'rgba(223, 172, 10, 0.85)'

/**
 * Where the two plates sit for a given lean, in px.
 *
 * Each rotation axis reaches ±maxTilt/2 (the pointer maps to -0.5..0.5), so
 * normalising against that half-swing gives a -1..1 lean direction. `hover`
 * gates both terms, so the plates are in perfect register at rest and separate
 * only while the pointer is over the card. `dy` inverts rotateX because a
 * positive X rotation tips the card's top away from the viewer.
 */
export function chromaticPlates(
  rotateX: number,
  rotateY: number,
  hover: number,
  maxTilt: number,
) {
  const half = maxTilt / 2
  return {
    dx: hover * (PLATE_BASE + (rotateY / half) * PLATE_TRACK),
    dy: hover * (PLATE_BASE + (-rotateX / half) * PLATE_TRACK),
  }
}

/**
 * A surface that leans toward the pointer in 3D (Motion's tilt-card pattern),
 * with the brand's chromatic misregistration driven by the same lean: the gold
 * plates sit perfectly in register at rest and slide apart in whichever
 * direction you tip the card.
 *
 * This element owns `transform` exclusively — never give it an entrance
 * animation. Wrap it in `Reveal` instead: the entrance rides the outer
 * element's transform, the tilt rides this one, and the two never collide.
 *
 * Inert unless the visitor has a real hovering pointer and hasn't asked for
 * reduced motion, so touch taps never leave a card stranded mid-lean and the
 * prerendered HTML ships flat and unshadowed.
 */
export function TiltCard({
  children,
  className = '',
  maxTilt = 10,
}: {
  children: ReactNode
  className?: string
  /** Full lean swing, in degrees. The card reaches half this per axis. */
  maxTilt?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const [finePointer, setFinePointer] = useState(false)

  useEffect(() => {
    setFinePointer(
      window.matchMedia('(hover: hover) and (pointer: fine)').matches,
    )
  }, [])

  const rotateX = useSpring(0, TILT_SPRING)
  const rotateY = useSpring(0, TILT_SPRING)
  // 0 at rest, 1 while hovered — gates the plate separation and the lift so
  // both are keyed to hover rather than to lingering pointer coordinates.
  const hover = useSpring(0, TILT_SPRING)

  const z = useTransform(hover, (h) => h * LIFT)

  const boxShadow = useTransform(
    [rotateX, rotateY, hover],
    ([rx, ry, h]: Array<number>) => {
      const { dx, dy } = chromaticPlates(rx, ry, h, maxTilt)
      return `${-dx}px ${-dy}px 0 ${INK_GHOST}, ${dx}px ${dy}px 0 ${INK_PLATE}`
    },
  )

  const interactive = finePointer && !reducedMotion

  function handleMove(event: PointerEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const xPercent = (event.clientX - rect.left) / rect.width
    const yPercent = (event.clientY - rect.top) / rect.height
    rotateX.set(maxTilt * (0.5 - yPercent))
    rotateY.set(maxTilt * (xPercent - 0.5))
  }

  function reset() {
    rotateX.set(0)
    rotateY.set(0)
    hover.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={
        interactive
          ? { rotateX, rotateY, z, boxShadow, transformPerspective: 900 }
          : undefined
      }
      onPointerEnter={interactive ? () => hover.set(1) : undefined}
      onPointerMove={interactive ? handleMove : undefined}
      onPointerLeave={interactive ? reset : undefined}
    >
      {children}
    </motion.div>
  )
}
