import { Link } from '@tanstack/react-router'
import { motion, useScroll } from 'motion/react'

import { BrandMark } from '@/components/BrandMark'
import { ThemeToggle } from '@/components/ThemeToggle'

export const linkClasses = 'hover:text-gold-text transition-colors duration-300'
export const activeLinkClasses = 'text-gold-text'

export const primaryNavItems = [
  { label: 'Diagnostic', to: '/diagnostic' },
  { label: 'Process', to: '/process' },
  { label: 'Client Work', to: '/clients' },
  { label: 'Portal', to: '/portal' },
] as const

export const utilityCta = {
  label: 'Book a Free Diagnostic',
  to: '/inquire',
} as const

/** 2px gold bar at the nav's bottom edge tracking scroll progress. */
function ScrollProgress() {
  const { scrollYProgress } = useScroll()

  return (
    <motion.span
      aria-hidden="true"
      className="absolute left-0 -bottom-px h-0.5 w-full bg-gold origin-left"
      style={{ scaleX: scrollYProgress }}
    />
  )
}

export function Header() {
  return (
    <nav className="sticky top-0 z-50 py-5 px-5 md:px-12 bg-surface backdrop-blur-[12px] border-b border-line-faint text-ink">
      <ScrollProgress />

      {/* Inner row capped so logo/CTA stay connected on ultrawide monitors */}
      <div className="max-w-[1600px] mx-auto flex flex-wrap justify-between items-center gap-y-2.5">
        {/* Mark + wordmark */}
        <Link
          to="/"
          className="flex items-center gap-3 text-[19px] tracking-[0.2em] font-brand uppercase"
        >
          <BrandMark className="w-[26px] text-gold-text" aria-hidden="true" />
          <span>
            <span className="font-bold text-gold-text">Relent</span>Net
          </span>
        </Link>

        {/* Links — wrap to a full-width centered second line under 900px */}
        <div className="flex gap-[26px] font-mono text-[13px] tracking-[0.12em] uppercase text-ink whitespace-nowrap max-[899px]:order-3 max-[899px]:w-full max-[899px]:justify-center">
          {primaryNavItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={linkClasses}
              activeProps={{ className: activeLinkClasses }}
              activeOptions={{ exact: true }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Theme toggle + CTA */}
        <div className="flex items-center gap-5">
          <ThemeToggle />
          <Link
            to={utilityCta.to}
            className="chromatic-hover bg-gold text-gold-ink px-[22px] py-[11px] whitespace-nowrap font-mono text-[11px] tracking-[0.15em] uppercase font-medium transition-all duration-300 hover:bg-ink-em hover:text-page"
          >
            {utilityCta.label}
          </Link>
        </div>
      </div>
    </nav>
  )
}
