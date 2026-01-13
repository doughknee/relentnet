import { Link } from '@tanstack/react-router'

export function Footer() {
  return (
    <footer className="py-12 px-8 bg-[#050505]/20 backdrop-blur-xs border-t border-white/10 flex flex-col md:flex-row justify-between items-end text-[10px] uppercase tracking-widest text-neutral-600 relative z-10">
      <div className="space-y-2 text-left">
        <p>© RelentNet 2026</p>
        <p>TN • LA • GA • FL</p>
      </div>
      <div className="flex gap-6 mt-6 md:mt-0">
        <Link to="/portal" className="hover:text-[#E1BE4C] transition-colors">
          Client Portal
        </Link>
        <Link to="/legal" className="hover:text-[#E1BE4C] transition-colors">
          Legal
        </Link>
      </div>
    </footer>
  )
}
