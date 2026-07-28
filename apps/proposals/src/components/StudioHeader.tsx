import { Link } from '@tanstack/react-router'

import { marketingOrigin } from '@/data/content'

const navLink = 'text-ink-muted transition-colors duration-300 hover:text-gold'

export function StudioHeader() {
  return (
    <nav className="sticky top-0 flex justify-between items-center px-8 py-5 z-50 bg-chrome backdrop-blur-md border-b border-line">
      <div className="flex items-baseline gap-4">
        <a
          href={marketingOrigin}
          className="font-serif text-lg tracking-[0.2em] uppercase text-ink"
        >
          <span className="font-bold text-gold">Relent</span>Net
        </a>
        <span className="text-[11px] tracking-[0.2em] uppercase text-ink-muted">
          Proposal Studio
        </span>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex gap-6 text-[11px] tracking-[0.15em] uppercase">
          <Link
            to="/"
            className={navLink}
            activeProps={{ className: 'text-gold' }}
            activeOptions={{ exact: true }}
          >
            New Proposal
          </Link>
          <Link
            to="/dashboard"
            className={navLink}
            activeProps={{ className: 'text-gold' }}
          >
            Dashboard
          </Link>
        </div>
        <span className="hidden sm:block text-[10px] tracking-[0.15em] uppercase text-ink-faint border border-line px-3 py-1.5">
          ap.relentnet.com · internal
        </span>
      </div>
    </nav>
  )
}

/** Route-level error panel for the internal pages (usually a cancelled login). */
export function StudioError({ error }: { error: Error }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center px-6 gap-4">
      <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-gold">
        Proposal Studio
      </p>
      <h1 className="font-serif text-3xl">Couldn&rsquo;t load this page.</h1>
      <p className="text-sm text-ink-muted max-w-md leading-relaxed">
        {error.message.includes('401')
          ? 'Sign in with the studio credentials to continue.'
          : error.message}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 border border-line px-6 py-3 text-xs tracking-widest uppercase cursor-pointer hover:bg-gold hover:border-gold hover:text-black transition-all duration-500"
      >
        Try again
      </button>
    </div>
  )
}
