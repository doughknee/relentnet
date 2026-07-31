import { describe, expect, it } from 'vitest'

import { countEase } from './countEase'

/** Velocity by central difference, which is the only way to check the joins. */
const velocity = (t: number) =>
  (countEase(t + 0.0001) - countEase(t - 0.0001)) / 0.0002

/** When the curve has covered `fraction` of the distance. Monotonic, so a
 *  bisection inverts it. */
const timeAt = (fraction: number) => {
  let lo = 0
  let hi = 1
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2
    if (countEase(mid) < fraction) lo = mid
    else hi = mid
  }
  return (lo + hi) / 2
}

describe('countEase', () => {
  it('starts and finishes at a standstill', () => {
    expect(countEase(0)).toBeCloseTo(0, 10)
    expect(countEase(1)).toBeCloseTo(1, 10)
    // Both ends matter: leaving at zero speed is what stops it reading as a
    // tween, arriving at zero speed is what makes it settle.
    expect(velocity(0.0001)).toBeCloseTo(0, 3)
    expect(velocity(0.9999)).toBeCloseTo(0, 3)
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

  it('peaks at 0.6 and brakes from there', () => {
    expect(velocity(0.6)).toBeGreaterThan(velocity(0.55))
    expect(velocity(0.6)).toBeGreaterThan(velocity(0.65))
    // Speed is continuous across the join; a mismatch would show as a visible
    // lurch the moment the brake comes on. One-sided limits, because a central
    // difference straddling 0.6 just averages the two phases.
    const h = 1e-6
    const approaching = (countEase(0.6) - countEase(0.6 - h)) / h
    const leaving = (countEase(0.6 + h) - countEase(0.6)) / h
    expect(approaching).toBeCloseTo(leaving, 4)
  })

  it('takes longer over every step as it closes on the target', () => {
    // The property the tail exists for: counting to 10,000, each of the last
    // few units must take longer than the one before, with 9,999 to 10,000 the
    // slowest of all.
    const t = [9997, 9998, 9999, 10000].map((v) => timeAt(v / 10000))
    const steps = [t[1] - t[0], t[2] - t[1], t[3] - t[2]]
    expect(steps[1]).toBeGreaterThan(steps[0])
    expect(steps[2]).toBeGreaterThan(steps[1])

    // And the last one has to be long enough to actually see. Over a 4s count
    // that is a third of a second spent closing a single unit.
    expect(steps[2] * 4).toBeGreaterThan(0.25)
  })
})
