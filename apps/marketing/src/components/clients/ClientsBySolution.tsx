import { Link } from '@tanstack/react-router'
import {
  ArrowRight,
  Award,
  Gauge,
  Layers,
  Search,
  ShieldCheck,
  Sparkles,
  Workflow,
  Wrench,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { Reveal } from '@/components/Reveal'
import { clientSolutions } from '@/data/clientSolutions'

const SOLUTION_ICONS: Record<string, LucideIcon> = {
  'Diagnose workflow friction': Search,
  'Rebuild brittle systems': Wrench,
  'Ship cross-platform products': Layers,
  'Stage credibility for sales': Award,
  'Build premium client experiences': Sparkles,
  'Operate real-time infrastructure': Gauge,
  'Automate back-office operations': Workflow,
  'Steward systems over time': ShieldCheck,
}

/**
 * "Customers by solution" — a clean grid of RelentNet capability cards, each
 * with a gold icon, label, and one-line blurb. Replaces the old faux-browser
 * screenshot mockups so the section sits in the site's gold/ink palette.
 */
export function ClientsBySolution() {
  return (
    <section className="relative z-10 px-6 md:px-12 py-20 md:py-28 border-t border-line-faint">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-ink-muted mb-3">
            Customers by solution
          </p>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl max-w-3xl mb-6">
            We obsess over diagnosed friction so our clients don't have to.
          </h2>
          <p className="text-ink-sub text-base md:text-lg leading-relaxed max-w-2xl mb-12 md:mb-16">
            Every engagement starts with diagnosing the real source of
            operational friction. We build the right system on top of that
            diagnosis — so you stop stitching together band-aids and start
            moving cleaner.
          </p>
        </Reveal>

        <Reveal
          delay={100}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line-faint border border-line-faint"
        >
          {clientSolutions.map((s) => {
            const Icon = SOLUTION_ICONS[s.label] ?? Search
            return (
              <Link
                key={s.label}
                to={s.href}
                className="group flex flex-col bg-page p-6 md:p-7 transition-colors hover:bg-card focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gold"
              >
                <Icon
                  className="size-6 text-gold mb-6"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <span className="font-serif text-lg text-ink-em group-hover:text-gold transition-colors">
                  {s.label}
                </span>
                <span className="mt-2 flex-1 text-sm text-ink-muted leading-relaxed">
                  {s.blurb}
                </span>
                <ArrowRight className="mt-6 size-4 text-ink-faint group-hover:text-gold group-hover:translate-x-1 transition-all" />
              </Link>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}
