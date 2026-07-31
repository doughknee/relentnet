/**
 * Easing for a counter that has to read as an odometer rather than a tween.
 *
 * Defined by its VELOCITY, not by a bezier, in two phases that meet at
 * `PEAK_TIME` with matching speed:
 *
 *   0 to PEAK_TIME   a raised-cosine ramp from a standstill up to PEAK_SPEED
 *   PEAK_TIME to 1   that speed decaying as (1 - s)^DECAY, reaching exactly
 *                    zero at the end
 *
 * Leaving the line at zero velocity is what stops it looking like a tween;
 * arriving at zero velocity is what makes it look like it is coming to rest.
 *
 * The tail is the whole point. Because speed decays as a sixth power, each
 * step toward the target takes longer than the one before it, and the last is
 * the slowest of all. Counting to 10,000 over five seconds reaches 9,900 at
 * 3.65s and 9,990 at 4.03s, then spends the closing second on ten units:
 *
 *   9,990 to 9,999   14, 16, 18, 20, 23, 28, 34, 46, 73 ms
 *   9,999 to 10,000  688 ms
 *
 * That last figure is deliberate but it is not free. The reel spring is 70ms,
 * so a 688ms hold does not render as a slow roll: the digits settle and then
 * the row waits before the final carry. Lowering DECAY spreads the closing
 * second more evenly at the cost of shortening it, and the two cannot both be
 * had: ten units is 0.1% of the distance to 10,000, so buying that slice a
 * fifth of the runtime requires a tail steep enough to pool in the last step.
 *
 * Brandon's original tuning (ported from ../motion-testing) braked hard at 0.6
 * and then crawled the last 0.1% of the distance at a near-constant speed. For
 * 10,000 that flat crawl only covered the last ten units, so the approach read
 * as a slow constant rate rather than as a deceleration. Same launch, same
 * peak time, near-identical peak speed; only the braking changed.
 *
 * Caveat: the tail is a fraction of the DISTANCE, so its duration in whole
 * units scales with the size of the figure. 10,000 and 99.99 both close their
 * last rendered step in ~688ms; 40 has only forty values to cross, so its last
 * step is a quarter of the whole distance and it sits on 39 for ~1.5s.
 */

/** When the climb stops accelerating and starts braking. */
const PEAK_TIME = 0.6
/** How sharply speed decays over the tail. Higher means a longer, more
 *  back-loaded settle; see the note above on what that trades away. */
const DECAY = 6

/* Solved rather than chosen, so the curve lands on exactly 1 without a fudge
   factor: the two phases cover PEAK_SPEED * PEAK_TIME / 2 and
   PEAK_SPEED * (1 - PEAK_TIME) / (DECAY + 1), and those must sum to 1. */
const PEAK_SPEED =
  1 / (PEAK_TIME / 2 + (1 - PEAK_TIME) / (DECAY + 1))

/** Distance already covered when the brake comes on. */
const PEAK_DISTANCE = (PEAK_SPEED * PEAK_TIME) / 2
/** Distance the decaying tail has left to cover. */
const TAIL_DISTANCE = (PEAK_SPEED * (1 - PEAK_TIME)) / (DECAY + 1)

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

  const s = (t - PEAK_TIME) / (1 - PEAK_TIME)
  return PEAK_DISTANCE + TAIL_DISTANCE * (1 - (1 - s) ** (DECAY + 1))
}
