import { Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

import type { EngagementType } from '@/data/caseStudies'
import { caseStudies } from '@/data/caseStudies'

const TABS: ReadonlyArray<{ id: EngagementType; label: string }> = [
  { id: 'product', label: 'Product' },
  { id: 'operations', label: 'Operations' },
  { id: 'platform', label: 'Platform' },
]

export function ClientsByEngagementType() {
  const [activeTab, setActiveTab] = useState<EngagementType>('product')

  const visible = useMemo(
    () => caseStudies.filter((s) => s.engagementType === activeTab),
    [activeTab],
  )

  return (
    <section className="relative z-10 px-6 md:px-12 py-20 md:py-24">
      <div className="max-w-7xl mx-auto">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-3">
          By engagement type
        </p>
        <h2 className="font-serif text-3xl md:text-5xl mb-8">
          What we typically take on
        </h2>

        <div
          role="group"
          aria-label="Filter by engagement type"
          className="flex flex-wrap gap-2 border-b border-line mb-10"
        >
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab
            return (
              <button
                key={tab.id}
                aria-pressed={isActive}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-xs uppercase tracking-[0.2em] border-b-2 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                  isActive
                    ? 'border-gold text-gold'
                    : 'border-transparent text-ink-muted hover:text-ink'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {visible.length === 0 ? (
          <p className="text-sm text-ink-muted">
            No case studies tagged for this engagement type yet.
          </p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((study) => (
              <li key={study.slug}>
                <Link
                  to="/clients/$slug"
                  params={{ slug: study.slug }}
                  className="group block border border-line bg-card p-6 hover:border-gold transition-colors h-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold">
                    {study.industry}
                  </span>
                  <h3 className="mt-3 font-serif text-2xl">{study.name}</h3>
                  <p className="mt-3 text-sm text-ink-sub leading-relaxed">
                    {study.summary.outcome}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
