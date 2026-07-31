/**
 * Easing for a counter that has to read as an odometer rather than a tween.
 *
 * This is a FACTORY rather than a curve, because the thing being asked for
 * cannot be expressed as one. "Slow down a lot over the last few numbers" is a
 * statement about UNITS, and an easing function only sees fractions of
 * distance. For 10,000 the last eight units are 0.08% of the journey; for 40
 * they are 20% of it. Any single curve applied to both either crawls through
 * one or skips the other.
 *
 * Earlier attempts here all failed on that. A power-law tail steep enough to
 * spend a second near the target dumps nearly all of it into the final step:
 * at decay 6 the closing units ran 14, 16, 18, 20, 23, 28, 34, 46, 73 and then
 * 688ms, and pushing the decay to 10 made that last figure 1,483ms against
 * 97ms for the one before it. Flattening the curve to spread those steps
 * shrinks the whole closing window to a rounding error: an even ramp needs
 * speed decaying as the square root of the distance left, which puts the last
 * ten units at 2% of the run.
 *
 * So the tail is allocated in units and in time directly, and the rest of the
 * curve is fitted around it. Given N rendered increments, in three phases:
 *
 *   0 to 0.45          raised-cosine ramp from a standstill up to peak
 *   0.45 to 0.60       braking onto the tail's entry speed, not onto zero
 *   0.60 to 1          the last 8 increments, over 40% of the runtime, timed
 *                      so k units remaining sits at (k / 8) ^ 0.55 of it
 *
 * Counting to 10,000 over six seconds, the closing increments run 165, 181,
 * 195, 214, 240, 280, 355 and 765ms: nearly two seconds on the last five. 40
 * gets the same eight figures, so a small stat no longer arrives early and
 * waits.
 *
 * The braking phase decays onto the tail's entry speed rather than onto zero
 * on purpose. Decaying to a standstill would make the increments just BEFORE
 * the tail slower than the ones inside it, and a counter that slows, speeds up
 * and slows again reads as broken.
 */

/** When the climb stops accelerating. */
const PEAK_TIME = 0.45
/** Share of the runtime reserved for the closing increments. */
const TAIL_TIME = 0.4
/** How many increments that closing stretch covers. */
const TAIL_UNITS = 8
/** Tail timing: k units remaining sits at (k / TAIL_UNITS) ^ this of the tail.
 *  Lower crowds more of the time into the final increment. */
const TAIL_SHAPE = 0.55
/** How sharply the brake sheds speed on its way into the tail. */
const BRAKE_DECAY = 3

const BRAKE_SPAN = 1 - TAIL_TIME - PEAK_TIME

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

/**
 * Builds the easing for a figure with `increments` rendered steps: 10,000 for
 * the hours count, 9,999 for uptime at two decimals, 40 for clients served.
 */
export function makeCountEase(increments: number): (t: number) => number {
  const units = Math.min(TAIL_UNITS, Math.max(1, increments))
  const tailDistance = units / Math.max(1, increments)
  /* Speed the tail opens at, which is what the brake has to hand over. */
  const joinSpeed = tailDistance / (TAIL_SHAPE * TAIL_TIME)

  /* Peak speed is solved, not chosen, so the phases sum to exactly 1. */
  const peakSpeed =
    (1 -
      tailDistance -
      joinSpeed * BRAKE_SPAN * (1 - 1 / (BRAKE_DECAY + 1))) /
    (PEAK_TIME / 2 + BRAKE_SPAN / (BRAKE_DECAY + 1))

  const peakDistance = (peakSpeed * PEAK_TIME) / 2

  return (t) => {
    if (t <= PEAK_TIME) {
      return raisedCosineArea(t, PEAK_TIME, 0, peakSpeed)
    }

    if (t <= 1 - TAIL_TIME) {
      const s = (t - PEAK_TIME) / BRAKE_SPAN
      return (
        peakDistance +
        ((peakSpeed - joinSpeed) *
          BRAKE_SPAN *
          (1 - (1 - s) ** (BRAKE_DECAY + 1))) /
          (BRAKE_DECAY + 1) +
        joinSpeed * BRAKE_SPAN * s
      )
    }

    return 1 - tailDistance * ((1 - t) / TAIL_TIME) ** (1 / TAIL_SHAPE)
  }
}
