import type { CaseStudyTestimonial as TestimonialData } from '@/data/caseStudies'

import { useReveal } from '@/hooks/useReveal'

interface CaseStudyTestimonialProps {
  testimonial: TestimonialData
}

/**
 * A client's full letter, verbatim. Set as correspondence rather than a
 * quote: serif body at a reading measure, paragraph rhythm, and a signature
 * block. Pairs with CaseStudyPullquote, which carries the excerpt.
 */
export function CaseStudyTestimonial({
  testimonial,
}: CaseStudyTestimonialProps) {
  const { ref, isRevealed } = useReveal(0.1)
  const { paragraphs, attribution } = testimonial

  return (
    <section
      ref={ref}
      aria-labelledby="testimonial-heading"
      data-testid="case-study-testimonial"
      className="relative z-10 px-6 md:px-12 py-16 md:py-24 border-t border-line-faint"
    >
      <div
        className={`max-w-2xl ${isRevealed ? 'animate-fade-in-up' : 'opacity-0'}`}
      >
        <h2
          id="testimonial-heading"
          className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold-text mb-10"
        >
          In their words
        </h2>
        <figure className="border-l-2 border-gold pl-6 md:pl-10">
          <blockquote className="space-y-6 font-serif text-lg md:text-xl leading-relaxed text-ink">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </blockquote>
          <figcaption className="mt-10 flex flex-col gap-1">
            <span className="font-serif text-xl text-ink-em">
              {attribution.name}
            </span>
            <span className="text-sm text-ink-muted">{attribution.role}</span>
            <span className="text-sm text-ink-muted">
              {attribution.company}
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
