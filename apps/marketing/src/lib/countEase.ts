/**
 * Easing for a counter that has to read as an odometer rather than a tween.
 *
 * Brandon tuned this in a standalone harness (C:/Users/doni/Documents/.code/
 * motion-testing); it is ported verbatim. It is defined by its VELOCITY, not
 * by a bezier: each phase integrates a raised-cosine speed ramp, so speed is
 * continuous across the joins and the figure never visibly jerks.
 *
 *   0    to 0.6    accelerate 0 -> 2.5, covering 75% of the count
 *   0.6  to 0.798  brake 2.5 -> ~0.01, covering the next 24.9%
 *   0.798 to 1     crawl the last 0.1% to a dead stop
 *
 * The payoff is the last stretch: a fifth of the runtime is spent easing
 * through the final thousandth, which is what makes the number look like it
 * is settling into place instead of arriving.
 *
 * SLOWDOWN_TIME is solved, not chosen, so phase two lands exactly on 0.999.
 */

const PEAK_TIME = 0.6
const SLOWDOWN_TIME = 0.798412599206398
const PEAK_SPEED = 2.5
const SLOWDOWN_SPEED = 0.002 / (1 - SLOWDOWN_TIME)

/** Distance covered by a raised-cosine ramp from `fromSpeed` to `toSpeed`. */
const raisedCosineArea = (
  elapsed: number,
  duration: number,
  fromSpeed: number,
  toSpeed: number,
) =>
  ((fromSpeed + toSpeed) * elapsed) / 2 +
  ((fromSpeed - toSpeed) * duration * Math.sin((Math.PI * elapsed) / duration)) /
    (2 * Math.PI)

export function countEase(t: number): number {
  if (t <= PEAK_TIME) {
    return raisedCosineArea(t, PEAK_TIME, 0, PEAK_SPEED)
  }

  if (t <= SLOWDOWN_TIME) {
    return (
      0.75 +
      raisedCosineArea(
        t - PEAK_TIME,
        SLOWDOWN_TIME - PEAK_TIME,
        PEAK_SPEED,
        SLOWDOWN_SPEED,
      )
    )
  }

  return (
    0.999 +
    raisedCosineArea(t - SLOWDOWN_TIME, 1 - SLOWDOWN_TIME, SLOWDOWN_SPEED, 0)
  )
}
