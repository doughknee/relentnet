import { Link } from '@tanstack/react-router'

export function Header() {
  const containerClasses =
    'fixed top-0 w-full flex justify-between items-center p-8 z-50 bg-[#050505]/50 backdrop-blur-sm text-[#e5e5e5]'

  return (
    <nav className={containerClasses}>
      <Link to="/" className="text-xl tracking-[0.2em] font-serif uppercase">
        <span className="font-bold text-[#E1BE4C]">Relent</span>Net
      </Link>
      <div className="hidden md:flex gap-12 text-xs tracking-[0.15em] uppercase opacity-80">
        <Link
          to="/process"
          className="hover:text-[#E1BE4C] transition-colors duration-300 [&.active]:text-[#E1BE4C]"
        >
          Our Process
        </Link>
        <Link
          to="/portfolio"
          className="hover:text-[#E1BE4C] transition-colors duration-300 [&.active]:text-[#E1BE4C]"
        >
          The Work
        </Link>
        <Link
          to="/client-portal"
          className="hover:text-[#E1BE4C] transition-colors duration-300 [&.active]:text-[#E1BE4C]"
        >
          Client Login
        </Link>
      </div>
      <Link
        to="/inquire"
        className="border border-white/20 px-6 py-3 text-xs tracking-widest uppercase hover:bg-[#E1BE4C] hover:border-[#E1BE4C] hover:text-black transition-all duration-500 [&.active]:bg-[#E1BE4C] [&.active]:text-black [&.active]:border-[#E1BE4C]"
      >
        Inquire
      </Link>
    </nav>
  )
}
