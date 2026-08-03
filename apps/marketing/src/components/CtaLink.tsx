import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import type { ReactNode } from 'react'

const base =
  'chromatic-hover items-center gap-3 py-[17px] text-xs uppercase tracking-[0.15em] transition-all duration-300'

/**
 * Inline sizes to its own label and never wraps, which is right when the
 * button sits in open space. Block fills its container and is allowed to wrap,
 * for a button in a card or column whose width it does not control: at that
 * point nowrap does not keep the label on one line, it just pushes it through
 * the padding and out the side.
 */
const layouts = {
  inline: 'inline-flex px-[30px] whitespace-nowrap',
  block: 'flex w-full justify-center text-center px-5',
} as const

const variants = {
  gold: 'bg-gold border border-gold text-gold-ink font-medium hover:bg-transparent hover:text-gold-text',
  outline: 'border border-line text-ink hover:border-gold hover:text-gold-text',
} as const

type CtaLinkProps = {
  variant?: keyof typeof variants
  arrow?: boolean
  /** Fill the container and wrap, rather than sizing to the label. */
  block?: boolean
  children: ReactNode
} & (
  /** An in-app route, through the router. */
  | { to: string; href?: never }
  /** Anything the router cannot own: tel:, mailto:, another origin. */
  | { href: string; to?: never }
)

/**
 * The v4 pill-less CTA pair: solid gold (optionally with arrow) or outline.
 *
 * `uppercase` is a CSS transform, so the DOM text is untouched and an address
 * passed as the label still reaches the clipboard and the accessible name in
 * the case it was written.
 */
export function CtaLink({
  to,
  href,
  variant = 'gold',
  arrow = false,
  block = false,
  children,
}: CtaLinkProps) {
  const className = `${base} ${layouts[block ? 'block' : 'inline']} ${
    variants[variant]
  }`
  const content = (
    <>
      {children}
      {arrow && (
        <ArrowRight
          size={15}
          strokeWidth={2}
          aria-hidden="true"
          className="shrink-0"
        />
      )}
    </>
  )

  return href ? (
    <a href={href} className={className}>
      {content}
    </a>
  ) : (
    <Link to={to as string} className={className}>
      {content}
    </Link>
  )
}
