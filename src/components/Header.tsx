import { Link } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const containerClasses =
    'fixed top-0 w-full flex justify-between items-center p-8 z-50 bg-[#050505]/20 backdrop-blur-xs text-[#e5e5e5]'

  const closeMenu = () => setIsOpen(false)

  return (
    <nav className={containerClasses}>
      <Link
        to="/"
        className="text-xl tracking-[0.2em] font-serif uppercase z-50 relative"
        onClick={closeMenu}
      >
        <span className="font-bold text-gold">Relent</span>Net
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-12 text-xs tracking-[0.15em] uppercase opacity-80">
        <Link
          to="/process"
          className="hover:text-gold transition-colors duration-300 [&.active]:text-gold"
        >
          Our Process
        </Link>
        <Link
          to="/portfolio"
          className="hover:text-gold transition-colors duration-300 [&.active]:text-gold"
        >
          The Work
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-10">
        <Link
          to="/portal"
          className="text-xs tracking-widest uppercase opacity-60 hover:opacity-100 hover:text-gold transition-all duration-300 [&.active]:text-gold [&.active]:opacity-100"
        >
          Portal
        </Link>
        <Link
          to="/inquire"
          className="border border-white/20 px-6 py-3 text-xs tracking-widest uppercase hover:bg-gold hover:border-gold hover:text-black transition-all duration-500 [&.active]:bg-gold [&.active]:text-black [&.active]:border-gold"
        >
          Inquire
        </Link>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden z-70 text-[#e5e5e5] hover:text-gold transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Navigation Overlay */}
      <div
        className={`fixed inset-0 w-screen h-screen bg-[#050505]/95 backdrop-blur-xl z-60 flex flex-col justify-start pt-32 items-center gap-12 transition-all duration-500 ease-in-out ${
          isOpen
            ? 'opacity-100 visible'
            : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-12 text-center text-xl tracking-[0.2em] uppercase font-light items-center">
          <Link
            to="/"
            onClick={closeMenu}
            className="hover:text-gold transition-colors duration-300 [&.active]:text-gold"
          >
            Home
          </Link>
          <Link
            to="/process"
            onClick={closeMenu}
            className="hover:text-gold transition-colors duration-300 [&.active]:text-gold"
          >
            Our Process
          </Link>
          <Link
            to="/portfolio"
            onClick={closeMenu}
            className="hover:text-gold transition-colors duration-300 [&.active]:text-gold"
          >
            The Work
          </Link>
          <Link
            to="/portal"
            onClick={closeMenu}
            className="hover:text-gold transition-colors duration-300 [&.active]:text-gold"
          >
            Client Portal
          </Link>
          <Link
            to="/inquire"
            onClick={closeMenu}
            className="border border-white/20 px-8 py-4 text-sm tracking-widest uppercase hover:bg-gold hover:border-gold hover:text-black transition-all duration-500 [&.active]:bg-gold [&.active]:text-black [&.active]:border-gold"
          >
            Inquire
          </Link>
        </div>
      </div>
    </nav>
  )
}
