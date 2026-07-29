import { Link } from '@tanstack/react-router'

import { BrandMark, BrandMarkChromatic } from '@/components/BrandMark'
import { siteConfig } from '@/site.config'

const exploreLinks = [
  { label: 'Workflow Diagnostic', to: '/diagnostic' },
  { label: 'Process', to: '/process' },
  { label: 'Client Work', to: '/clients' },
  { label: 'Client Portal', to: '/portal' },
] as const

export function Footer() {
  return (
    <footer className="border-t border-line-faint relative z-10">
      <div className="max-w-[1200px] mx-auto px-5 md:px-12 pt-16 pb-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[5fr_3fr_4fr] gap-14 items-start">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <BrandMarkChromatic
              className="hidden dark:block w-12"
              aria-hidden="true"
            />
            <BrandMark
              className="dark:hidden w-8 text-gold-text"
              aria-hidden="true"
            />
            <p className="text-[19px] tracking-[0.2em] font-brand uppercase text-ink">
              <span className="font-bold text-gold-text">Relent</span>Net
            </p>
          </div>
          <p className="text-sm font-light leading-[1.65] text-ink-sub max-w-[300px]">
            Diagnostic-led technology stewardship for owner-led businesses.
          </p>
          <p className="mt-5 font-mono text-[10px] tracking-[0.25em] uppercase text-ink-faint">
            {siteConfig.regions.join(' · ')}
          </p>
        </div>

        <div>
          <p className="mb-[18px] text-[10px] tracking-[0.3em] uppercase text-ink-faint">
            Explore
          </p>
          <div className="flex flex-col gap-3 text-[13px] text-ink-sub">
            {exploreLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="hover:text-gold-text transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-[18px] text-[10px] tracking-[0.3em] uppercase text-ink-faint">
            Contact
          </p>
          <p className="font-brand text-2xl text-ink-em">
            <a
              href={`tel:${siteConfig.contact.phoneFormatted.replace(/[^+\d]/g, '')}`}
              className="hover:text-gold-text transition-colors"
            >
              {siteConfig.contact.phone}
            </a>
          </p>
          <p className="mt-2 text-[13px] text-ink-sub">
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="hover:text-gold-text transition-colors"
            >
              {siteConfig.contact.email}
            </a>
          </p>
          <p className="mt-1.5 text-xs text-ink-muted">9am–5pm CST · Mon–Fri</p>
        </div>
      </div>

      <div className="border-t border-line-faint py-5 px-5 md:px-12 text-[10px] uppercase tracking-[0.2em] text-ink-faint">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center">
          <p>
            © {siteConfig.name} {new Date().getFullYear()} · Nashville, TN
          </p>
          <Link to="/legal" className="hover:text-gold-text transition-colors">
            Legal
          </Link>
        </div>
      </div>
    </footer>
  )
}
