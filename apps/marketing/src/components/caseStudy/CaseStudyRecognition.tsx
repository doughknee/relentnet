import type { CaseStudyRecognition as RecognitionData } from '@/data/caseStudies'

import { useReveal } from '@/hooks/useReveal'

interface CaseStudyRecognitionProps {
  recognition: ReadonlyArray<RecognitionData>
}

/**
 * Press, awards, third-party validation. Renders nothing when empty.
 * Each entry can be a plain text mention or an outbound link if `href`
 * is provided. Convention: a single horizontal strip with a small
 * eyebrow label, similar to the awards row Instrument uses at the
 * end of an Oura-style case study.
 */
export function CaseStudyRecognition({
  recognition,
}: CaseStudyRecognitionProps) {
  const { ref, isRevealed } = useReveal(0.15)

  if (recognition.length === 0) {
    return null
  }

  return (
    <section
      ref={ref}
      className="relative z-10 px-6 md:px-12 py-16 md:py-20 border-t border-line-faint"
    >
      <div className="max-w-6xl mx-auto">
        <h2
          className={`text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-8 ${
            isRevealed ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          Recognition
        </h2>
        <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {recognition.map((item, index) => {
            const body = (
              <div className="border border-line-faint bg-card p-5 h-full transition-colors hover:border-gold/40">
                <p className="font-serif text-lg text-ink-em">{item.label}</p>
                {item.detail ? (
                  <p className="mt-2 text-sm text-ink-muted leading-relaxed">
                    {item.detail}
                  </p>
                ) : null}
              </div>
            )
            return (
              <li
                key={`${item.label}-${index}`}
                className={`${
                  isRevealed ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={
                  isRevealed
                    ? { animationDelay: `${100 + index * 80}ms` }
                    : undefined
                }
              >
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                  >
                    {body}
                  </a>
                ) : (
                  body
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
