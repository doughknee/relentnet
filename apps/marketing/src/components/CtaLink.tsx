import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import type { ReactNode } from 'react'

const base =
  'chromatic-hover inline-flex items-center gap-3 px-[30px] py-[17px] whitespace-nowrap text-xs uppercase tracking-[0.15em] transition-all duration-300'

const variants = {
  gold: `${base} bg-gold border border-gold text-gold-ink font-medium hover:bg-transparent hover:text-gold-text`,
  outline: `${base} border border-line text-ink hover:border-gold hover:text-gold-text`,
} as const

/** The v4 pill-less CTA pair: solid gold (optionally with arrow) or outline. */
export function CtaLink({
  to,
  variant = 'gold',
  arrow = false,
  children,
}: {
  to: string
  variant?: keyof typeof variants
  arrow?: boolean
  children: ReactNode
}) {
  return (
    <Link to={to} className={variants[variant]}>
      {children}
      {arrow && <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />}
    </Link>
  )
}
