import type { CaseStudyAtAGlance as AtAGlanceData } from '@/data/caseStudies'

import { useReveal } from '@/hooks/useReveal'

interface CaseStudyAtAGlanceProps {
  atAGlance: AtAGlanceData
  industry: string
  systemType: string
}

interface FactRow {
  label: string
  value: string
}

/**
 * Quiet fact strip that sits below the hero (or below the metrics
 * band when metrics exist). Renders facts and stack tags; the heavier
 * metrics row and pull quote moved out into their own dedicated
 * components so each can earn its own visual weight.
 */
export function CaseStudyAtAGlance({
  atAGlance,
  industry,
  systemType,
}: CaseStudyAtAGlanceProps) {
  const { ref, isRevealed } = useReveal(0.1)

  const facts: Array<FactRow> = [
    { label: 'Industry', value: industry },
    { label: 'System', value: systemType },
  ]
  if (atAGlance.engagementYear) {
    facts.push({ label: 'Year', value: atAGlance.engagementYear })
  }
  if (atAGlance.duration) {
    facts.push({ label: 'Duration', value: atAGlance.duration })
  }
  if (atAGlance.role) {
    facts.push({ label: 'Role', value: atAGlance.role })
  }

  const stack = atAGlance.stack ?? []

  return (
    <section
      ref={ref}
      className="relative z-10 px-6 md:px-12 py-16 md:py-20 border-y border-line bg-surface backdrop-blur-xs"
    >
      <div className="max-w-6xl mx-auto">
        <h2
          className={`text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-8 ${
            isRevealed ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          At a glance
        </h2>

        <dl
          className={`grid gap-4 grid-cols-[repeat(auto-fit,minmax(180px,1fr))] ${
            isRevealed ? 'animate-fade-in-up' : 'opacity-0'
          }`}
          style={isRevealed ? { animationDelay: '100ms' } : undefined}
        >
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="border border-line-faint bg-card p-5"
            >
              <dt className="text-[10px] font-bold tracking-[0.3em] uppercase text-ink-muted">
                {fact.label}
              </dt>
              <dd className="mt-2 font-serif text-lg text-ink-em">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>

        {stack.length > 0 ? (
          <div
            className={`mt-10 ${
              isRevealed ? 'animate-fade-in-up' : 'opacity-0'
            }`}
            style={isRevealed ? { animationDelay: '200ms' } : undefined}
          >
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-ink-muted mb-4">
              Stack
            </p>
            <ul className="flex flex-wrap gap-2">
              {stack.map((item) => (
                <li
                  key={item}
                  className="border border-line-faint bg-inset px-3 py-1.5 text-xs text-ink-sub"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  )
}
