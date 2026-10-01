import { useEffect, useId, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import { motion, useScroll } from 'motion/react'

import { BrandMark } from '@/components/BrandMark'
import { ThemeToggle } from '@/components/ThemeToggle'

export const linkClasses = 'hover:text-gold-text transition-colors duration-300'
export const activeLinkClasses = 'text-gold-text'

export const primaryNavItems = [
  { label: 'Diagnostic', to: '/diagnostic' },
  { label: 'Process', to: '/process' },
  { label: 'Client Work', to: '/clients' },
  { label: 'About', to: '/about' },
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
  const [isOpen, setIsOpen] = useState(false)
  const panelId = useId()
  const navRef = useRef<HTMLElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  function close() {
    setIsOpen(false)
    buttonRef.current?.focus()
  }

  useEffect(() => {
    if (!isOpen) return

    panelRef.current?.querySelector('a')?.focus()
    document.body.style.overflow = 'hidden'

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
    }
    function onPointerDown(e: PointerEvent) {
      if (!navRef.current?.contains(e.target as Node)) setIsOpen(false)
    }
    // The panel is phone-only: crossing into desktop width closes it.
    const desktop = window.matchMedia('(min-width: 900px)')
    function onBreakpoint(e: MediaQueryListEvent) {
      if (e.matches) setIsOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    desktop.addEventListener('change', onBreakpoint)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
      desktop.removeEventListener('change', onBreakpoint)
    }
  }, [isOpen])

  return (
    <nav
      ref={navRef}
      className="sticky top-0 z-50 py-3 min-[900px]:py-5 px-5 md:px-12 bg-surface backdrop-blur-[12px] border-b border-line-faint text-ink"
    >
      <ScrollProgress />

      {/* Inner row capped so logo/CTA stay connected on ultrawide monitors */}
      <div className="max-w-[1600px] mx-auto flex justify-between items-center gap-x-2">
        {/* Mark + wordmark */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 min-[900px]:gap-3 text-[14px] min-[900px]:text-[19px] tracking-[0.1em] min-[900px]:tracking-[0.2em] font-brand uppercase"
        >
          <BrandMark
            className="w-[22px] min-[900px]:w-[26px] text-gold-text"
            aria-hidden="true"
          />
          <span>
            <span className="font-bold text-gold-text">Relent</span>Net
          </span>
        </Link>

        {/* Links — desktop only; phones get them in the menu panel */}
        <div className="hidden min-[900px]:flex flex-wrap gap-x-[26px] gap-y-2 font-mono text-[13px] tracking-[0.12em] uppercase text-ink whitespace-nowrap">
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

        {/* Theme toggle (desktop) + CTA + menu button (phones) */}
        <div className="flex items-center gap-2 min-[900px]:gap-5">
          <div className="hidden min-[900px]:block">
            <ThemeToggle />
          </div>
          <Link
            to={utilityCta.to}
            className="chromatic-hover bg-gold text-gold-ink px-2.5 py-2 min-[900px]:px-[22px] min-[900px]:py-[11px] text-center leading-[1.2] min-[900px]:leading-normal min-[900px]:whitespace-nowrap font-mono text-[10px] min-[900px]:text-[11px] tracking-[0.08em] min-[900px]:tracking-[0.15em] uppercase font-medium transition-all duration-300 hover:bg-ink-em hover:text-page"
          >
            {utilityCta.label}
          </Link>
          <button
            ref={buttonRef}
            type="button"
            onClick={() => (isOpen ? close() : setIsOpen(true))}
            aria-expanded={isOpen}
            aria-controls={panelId}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            className="min-[900px]:hidden cursor-pointer p-2 -mr-2 text-ink transition-colors hover:text-gold-text"
          >
            {isOpen ? (
              <X className="size-5" strokeWidth={1.5} />
            ) : (
              <Menu className="size-5" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <motion.div
          ref={panelRef}
          id={panelId}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="min-[900px]:hidden absolute left-0 right-0 top-full bg-page border-b border-line-faint px-5 pb-5 pt-1"
        >
          <div className="flex flex-col font-mono text-[13px] tracking-[0.12em] uppercase">
            {primaryNavItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={close}
                className={`${linkClasses} py-4 border-b border-line-faint`}
                activeProps={{ className: activeLinkClasses }}
                activeOptions={{ exact: true }}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between font-mono text-[11px] tracking-[0.12em] uppercase text-ink-muted">
            Theme
            <ThemeToggle />
          </div>
        </motion.div>
      )}
    </nav>
  )
}
