import type { CaseStudyPullquote as PullquoteData } from '@/data/caseStudies'

import { useReveal } from '@/hooks/useReveal'

interface CaseStudyPullquoteProps {
  pullquote: PullquoteData
}

/**
 * Page-scale client pull quote. Big serif italic with attribution
 * underneath. Distinct from the inline quote StoryBlock (which lives
 * mid-narrative) \u2014 this one is its own section, sized to anchor the
 * page emotionally the way Instrument's Oura testimonial does.
 */
export function CaseStudyPullquote({ pullquote }: CaseStudyPullquoteProps) {
  const { ref, isRevealed } = useReveal(0.2)
  const { text, attribution } = pullquote

  return (
    <section ref={ref} className="relative z-10 px-6 md:px-12 py-16 md:py-24 border-t border-line-faint">
      <figure className="max-w-3xl">
        <blockquote
          className={`font-serif italic text-2xl md:text-3xl lg:text-4xl leading-snug text-ink ${
            isRevealed ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          {text}
        </blockquote>
        <figcaption
          className={`mt-8 flex flex-col gap-1 ${
            isRevealed ? 'animate-fade-in-up' : 'opacity-0'
          }`}
          style={isRevealed ? { animationDelay: '120ms' } : undefined}
        >
          <span className="text-sm uppercase tracking-[0.2em] text-ink-muted">
            {attribution.name}
          </span>
          <span className="text-sm text-ink-muted">
            {attribution.role}
            {attribution.company ? ` \u00b7 ${attribution.company}` : ''}
          </span>
        </figcaption>
      </figure>
    </section>
  )
}
