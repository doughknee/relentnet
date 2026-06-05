import { Link } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

import { ThemeToggle } from '@/components/ThemeToggle'

export const linkClasses = 'hover:text-gold transition-colors duration-300'
export const activeLinkClasses = 'text-gold'
export const activeCtaClasses = 'bg-gold text-black border-gold'

const ctaClasses =
  'border border-line px-6 py-3 text-xs tracking-widest uppercase hover:bg-gold hover:border-gold hover:text-black transition-all duration-500'

const mobileCtaClasses =
  'border border-line px-8 py-4 text-sm tracking-widest uppercase hover:bg-gold hover:border-gold hover:text-black transition-all duration-500'

export const primaryNavItems = [
  { label: 'Diagnostic', to: '/diagnostic' },
  { label: 'Process', to: '/process' },
  { label: 'Clients', to: '/clients' },
  { label: 'Portal', to: '/portal' },
] as const

export const utilityCta = {
  label: 'Start Diagnostic',
  to: '/diagnostic',
} as const

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const closeMenu = () => setIsOpen(false)

  return (
    <nav className="fixed top-0 w-full flex justify-between items-center p-8 z-50 bg-surface backdrop-blur-xs text-ink">
      {/* Logo */}
      <Link
        to="/"
        className="text-xl tracking-[0.2em] font-serif uppercase z-50 relative"
        onClick={closeMenu}
      >
        <span className="font-bold text-gold">Relent</span>Net
      </Link>

      {/* Desktop Center — absolutely positioned for true centering */}
      <div className="hidden md:flex gap-12 text-xs tracking-[0.15em] uppercase opacity-80 absolute left-1/2 -translate-x-1/2">
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

      {/* Desktop Right — utility + CTA */}
      <div className="hidden md:flex items-center gap-6">
        <ThemeToggle />
        <Link
          to={utilityCta.to}
          className={ctaClasses}
          activeProps={{ className: activeCtaClasses }}
          activeOptions={{ exact: true }}
        >
          {utilityCta.label}
        </Link>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden z-70 text-ink hover:text-gold transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Navigation Overlay */}
      <div
        className={`fixed inset-0 w-screen h-screen bg-overlay backdrop-blur-xl z-60 flex flex-col justify-start pt-32 items-center gap-12 transition-all duration-500 ease-in-out ${
          isOpen
            ? 'opacity-100 visible'
            : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-12 text-center text-xl tracking-[0.2em] uppercase font-light items-center">
          <Link
            to="/"
            onClick={closeMenu}
            className={linkClasses}
            activeProps={{ className: activeLinkClasses }}
            activeOptions={{ exact: true }}
          >
            Home
          </Link>
          {primaryNavItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={closeMenu}
              className={linkClasses}
              activeProps={{ className: activeLinkClasses }}
              activeOptions={{ exact: true }}
            >
              {item.label === 'Portal' ? 'Client Portal' : item.label}
            </Link>
          ))}
          <ThemeToggle />
          <Link
            to={utilityCta.to}
            onClick={closeMenu}
            className={mobileCtaClasses}
            activeProps={{ className: activeCtaClasses }}
            activeOptions={{ exact: true }}
          >
            {utilityCta.label}
          </Link>
        </div>
      </div>
    </nav>
  )
}
