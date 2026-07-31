import { describe, expect, it } from 'vitest'

import { makeCountEase } from './countEase'

/** Velocity by central difference. */
const velocity = (ease: (t: number) => number, t: number) =>
  (ease(t + 0.0001) - ease(t - 0.0001)) / 0.0002

/** When the curve has covered `fraction` of the distance. Monotonic, so a
 *  bisection inverts it. */
const timeAt = (ease: (t: number) => number, fraction: number) => {
  let lo = 0
  let hi = 1
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2
    if (ease(mid) < fraction) lo = mid
    else hi = mid
  }
  return (lo + hi) / 2
}

/** Time each of the last `count` increments occupies, oldest first. */
const closingSteps = (increments: number, count: number) => {
  const ease = makeCountEase(increments)
  const marks = Array.from({ length: count + 1 }, (_, i) =>
    timeAt(ease, (increments - count + i) / increments),
  )
  return marks.slice(1).map((t, i) => t - marks[i])
}

describe('makeCountEase', () => {
  it('starts at a standstill and lands exactly on the target', () => {
    for (const n of [10000, 9999, 40]) {
      const ease = makeCountEase(n)
      expect(ease(0)).toBeCloseTo(0, 10)
      expect(ease(1)).toBeCloseTo(1, 10)
      // Leaving at zero speed is what stops it reading as a tween.
      expect(velocity(ease, 0.0001)).toBeCloseTo(0, 3)
    }
  })

  it('never goes backwards', () => {
    // A counter that reverses reads as a bug, so monotonicity is the one
    // property worth checking exhaustively — and this curve is piecewise, so
    // it has two joins that could break it.
    for (const n of [10000, 9999, 40]) {
      const ease = makeCountEase(n)
      let previous = 0
      for (let step = 1; step <= 2000; step++) {
        const current = ease(step / 2000)
        expect(current).toBeGreaterThanOrEqual(previous - 1e-12)
        previous = current
      }
    }
  })

  it('slows over every one of the closing increments', () => {
    // The whole point. Checked across the join too: an earlier shape braked
    // onto a standstill, which made the increments just before the tail slower
    // than the ones inside it.
    for (const n of [10000, 40]) {
      const steps = closingSteps(n, 10)
      for (let i = 1; i < steps.length; i++) {
        expect(steps[i]).toBeGreaterThan(steps[i - 1])
      }
    }
  })

  it('spends the closing stretch in units, not in a fraction of distance', () => {
    // A figure of 40 and a figure of 10,000 must close identically, which is
    // the thing no single easing curve could do: for 10,000 the last eight
    // units are 0.08% of the distance, for 40 they are 20% of it.
    const big = closingSteps(10000, 8)
    const small = closingSteps(40, 8)
    big.forEach((step, i) => expect(small[i]).toBeCloseTo(step, 6))

    // And that stretch has to be worth watching: over a 6s count the last
    // five increments alone run past a second and a half.
    const lastFive = big.slice(-5).reduce((a, b) => a + b, 0)
    expect(lastFive * 6).toBeGreaterThan(1.5)
    expect(big[big.length - 1] * 6).toBeGreaterThan(0.6)
  })
})
