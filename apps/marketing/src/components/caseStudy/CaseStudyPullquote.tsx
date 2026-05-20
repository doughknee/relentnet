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
    <section
      ref={ref}
      className="relative z-10 px-6 md:px-12 py-24 md:py-32"
    >
      <figure className="max-w-4xl mx-auto text-center">
        <span
          className={`block font-serif text-gold text-6xl md:text-8xl leading-none mb-6 ${
            isRevealed ? 'animate-fade-in-up' : 'opacity-0'
          }`}
          aria-hidden="true"
        >
          &ldquo;
        </span>
        <blockquote
          className={`font-serif italic text-2xl md:text-4xl leading-snug text-ink-em ${
            isRevealed ? 'animate-fade-in-up' : 'opacity-0'
          }`}
          style={isRevealed ? { animationDelay: '120ms' } : undefined}
        >
          {text}
        </blockquote>
        <figcaption
          className={`mt-10 flex flex-col items-center gap-1 ${
            isRevealed ? 'animate-fade-in-up' : 'opacity-0'
          }`}
          style={isRevealed ? { animationDelay: '260ms' } : undefined}
        >
          <span className="font-serif text-lg text-ink-em">
            {attribution.name}
          </span>
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-ink-muted">
            {attribution.role}
            {attribution.company ? ` \u00b7 ${attribution.company}` : ''}
          </span>
        </figcaption>
      </figure>
    </section>
  )
}
