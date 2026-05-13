import { Link } from '@tanstack/react-router'
import { siteConfig } from '@/site.config'

export function Footer() {
  const regionsShort = siteConfig.regions
    .map((r) =>
      r === 'Tennessee'
        ? 'TN'
        : r === 'Louisiana'
          ? 'LA'
          : r === 'Georgia'
            ? 'GA'
            : r === 'Florida'
              ? 'FL'
              : r,
    )
    .join(' • ')

  return (
    <footer className="py-12 px-8 bg-surface backdrop-blur-xs border-t border-line flex flex-col md:flex-row justify-between items-end text-[10px] uppercase tracking-widest text-ink-muted relative z-10">
      <div className="space-y-2 text-left">
        <p>
          © {siteConfig.name} {new Date().getFullYear()}
        </p>
        <p>{regionsShort}</p>
      </div>
      <div className="flex gap-6 mt-6 md:mt-0">
        <Link to="/inquire" className="hover:text-gold transition-colors">
          Map Workflow
        </Link>
        <Link to="/portal" className="hover:text-gold transition-colors">
          Client Portal
        </Link>
        <Link to="/legal" className="hover:text-gold transition-colors">
          Legal
        </Link>
      </div>
    </footer>
  )
}
