import { describe, expect, it } from 'vitest'

import { chromaticPlates } from './TiltCard'

const MAX_TILT = 10
// The rotation each axis reaches at the very edge of the card.
const EDGE = MAX_TILT / 2

describe('chromaticPlates', () => {
  it('holds the plates in register until the card is hovered', () => {
    // toBeCloseTo, not toEqual: a zeroed hover can yield -0, which reads
    // identically as `-0px` in CSS but trips strict equality.
    const { dx, dy } = chromaticPlates(EDGE, -EDGE, 0, MAX_TILT)
    expect(dx).toBeCloseTo(0)
    expect(dy).toBeCloseTo(0)
  })

  it('separates down-right on hover before the pointer leans the card', () => {
    const { dx, dy } = chromaticPlates(0, 0, 1, MAX_TILT)
    expect(dx).toBeGreaterThan(0)
    expect(dx).toBe(dy)
  })

  it('drives the plates toward the pointer on both axes', () => {
    // Pointer at the right edge pushes the lead plate further right; at the
    // left edge it crosses the origin and leads left instead.
    expect(chromaticPlates(0, EDGE, 1, MAX_TILT).dx).toBeGreaterThan(
      chromaticPlates(0, 0, 1, MAX_TILT).dx,
    )
    expect(chromaticPlates(0, -EDGE, 1, MAX_TILT).dx).toBeLessThan(0)

    // A pointer at the bottom edge tips the top toward the viewer (negative
    // rotateX) and must push the plate DOWN, not up.
    expect(chromaticPlates(-EDGE, 0, 1, MAX_TILT).dy).toBeGreaterThan(
      chromaticPlates(0, 0, 1, MAX_TILT).dy,
    )
    expect(chromaticPlates(EDGE, 0, 1, MAX_TILT).dy).toBeLessThan(0)
  })

  it('scales with the configured swing rather than raw degrees', () => {
    // Same proportional lean on a different maxTilt lands the same offset.
    expect(chromaticPlates(0, 10, 1, 20)).toEqual(
      chromaticPlates(0, 2.5, 1, 5),
    )
  })
})
