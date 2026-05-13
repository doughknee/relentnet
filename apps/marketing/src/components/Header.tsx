import { Link } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

import { ThemeToggle } from '@/components/ThemeToggle'

const linkClasses =
  'hover:text-gold transition-colors duration-300 [&.active]:text-gold'

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
        <Link to="/process" className={linkClasses}>
          Process
        </Link>
        <Link to="/portfolio" className={linkClasses}>
          The Work
        </Link>
        <Link to="/portal" className={linkClasses}>
          Portal
        </Link>
      </div>

      {/* Desktop Right — utility + CTA */}
      <div className="hidden md:flex items-center gap-6">
        <ThemeToggle />
        <Link
          to="/inquire"
          className="border border-line px-6 py-3 text-xs tracking-widest uppercase hover:bg-gold hover:border-gold hover:text-black transition-all duration-500 [&.active]:bg-gold [&.active]:text-black [&.active]:border-gold"
        >
          Inquire
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
          <Link to="/" onClick={closeMenu} className={linkClasses}>
            Home
          </Link>
          <Link to="/process" onClick={closeMenu} className={linkClasses}>
            Process
          </Link>
          <Link to="/portfolio" onClick={closeMenu} className={linkClasses}>
            The Work
          </Link>
          <Link to="/portal" onClick={closeMenu} className={linkClasses}>
            Client Portal
          </Link>
          <ThemeToggle />
          <Link
            to="/inquire"
            onClick={closeMenu}
            className="border border-line px-8 py-4 text-sm tracking-widest uppercase hover:bg-gold hover:border-gold hover:text-black transition-all duration-500 [&.active]:bg-gold [&.active]:text-black [&.active]:border-gold"
          >
            Inquire
          </Link>
        </div>
      </div>
    </nav>
  )
}
