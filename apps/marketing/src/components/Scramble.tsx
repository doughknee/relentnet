import { stagger } from 'motion'
import { useReducedMotion } from 'motion/react'
import { ScrambleText } from 'motion-plus/react'

/** Uppercase + digits only — the site's own glyph set, so the churn stays
 *  quiet instead of flashing punctuation noise at small mono sizes. */
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

/* Hoisted deliberately: stagger() returns a NEW function every call, so
   building it inline hands ScrambleText a changed prop on every render of the
   parent and re-runs the decode. That made unrelated state changes (switching
   a case-study tab) visibly re-scramble every label on the page. */
const SCRAMBLE_DELAY = stagger(0.02)

/**
 * Text that decodes through random glyphs, keeping Motion UI's accessibility
 * split: an invisible in-flow copy owns the accessible name and pins the
 * layout box, while the churning overlay is aria-hidden so assistive tech
 * never reads the noise. Prerenders as plain text.
 *
 * Use on a fixed-width (mono) face only — a proportional face reflows its line
 * on every swapped glyph. Inert under reduced motion, where the overlay simply
 * renders the settled text.
 *
 * To re-run the decode when the text changes, give it a `key` of that text:
 * remounting restarts the effect.
 */
export function Scramble({
  text,
  active,
  className = '',
}: {
  text: string
  /** Runs the decode while true. Gate on visibility so it never churns
   *  offscreen. */
  active: boolean
  className?: string
}) {
  const reducedMotion = useReducedMotion()

  return (
    <span className={`relative inline-block ${className}`}>
      <span className="opacity-0">{text}</span>
      <ScrambleText
        as="span"
        aria-hidden="true"
        className="absolute inset-0"
        active={active && !reducedMotion}
        duration={1}
        delay={SCRAMBLE_DELAY}
        chars={SCRAMBLE_CHARS}
      >
        {text}
      </ScrambleText>
    </span>
  )
}
