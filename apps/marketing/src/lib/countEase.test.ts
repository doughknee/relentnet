import { describe, expect, it } from 'vitest'

import { countEase } from './countEase'

/** Velocity by central difference, which is the only way to check the joins. */
const velocity = (t: number) =>
  (countEase(t + 0.0001) - countEase(t - 0.0001)) / 0.0002

describe('countEase', () => {
  it('starts at 0, lands on 1, and hits its designed phase boundaries', () => {
    expect(countEase(0)).toBeCloseTo(0, 10)
    // The two joins. If either drifts, the phases no longer meet and the
    // count jumps at the seam.
    expect(countEase(0.6)).toBeCloseTo(0.75, 10)
    expect(countEase(0.798412599206398)).toBeCloseTo(0.999, 10)
    expect(countEase(1)).toBeCloseTo(1, 10)
  })

  it('never goes backwards', () => {
    // A counter that reverses reads as a bug, so monotonicity is the one
    // property worth checking exhaustively.
    let previous = 0
    for (let step = 1; step <= 1000; step++) {
      const current = countEase(step / 1000)
      expect(current).toBeGreaterThanOrEqual(previous)
      previous = current
    }
  })

  it('peaks at 0.6 then brakes hard', () => {
    expect(velocity(0.6)).toBeGreaterThan(velocity(0.55))
    expect(velocity(0.6)).toBeGreaterThan(velocity(0.65))
    // Two orders of magnitude slower by 0.8: this is the long settle that
    // makes the figure look like it is coming to rest.
    expect(velocity(0.8)).toBeLessThan(velocity(0.6) / 100)
  })
})
