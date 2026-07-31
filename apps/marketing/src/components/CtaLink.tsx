import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import type { ReactNode } from 'react'

const base =
  'chromatic-hover inline-flex items-center gap-3 px-[30px] py-[17px] whitespace-nowrap text-xs uppercase tracking-[0.15em] transition-all duration-300'

const variants = {
  gold: `${base} bg-gold border border-gold text-gold-ink font-medium hover:bg-transparent hover:text-gold-text`,
  outline: `${base} border border-line text-ink hover:border-gold hover:text-gold-text`,
} as const

type CtaLinkProps = {
  variant?: keyof typeof variants
  arrow?: boolean
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
  children,
}: CtaLinkProps) {
  const content = (
    <>
      {children}
      {arrow && <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />}
    </>
  )

  return href ? (
    <a href={href} className={variants[variant]}>
      {content}
    </a>
  ) : (
    <Link to={to as string} className={variants[variant]}>
      {content}
    </Link>
  )
}
