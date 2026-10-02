import { label } from './label'
import type {
  CaseStudyBuilder,
  CaseStudyTestimonial as TestimonialData,
} from '@/data/caseStudies'
import { CtaLink } from '@/components/CtaLink'
import { utilityCta } from '@/components/Header'
import { useReveal } from '@/hooks/useReveal'

interface CaseStudyTestimonialProps {
  testimonial: TestimonialData
  builtBy?: CaseStudyBuilder
}

/**
 * A client's full letter, verbatim. Set as correspondence: a signature
 * column beside the letter at a ~70-character measure, then an optional
 * "Who built it" card for the RelentNet person the letter is about.
 * `id="letter"` is the target of the hero's "Read the full letter" link.
 */
export function CaseStudyTestimonial({
  testimonial,
  builtBy,
}: CaseStudyTestimonialProps) {
  const { ref, isRevealed } = useReveal(0.1)
  const { paragraphs, attribution, provenance } = testimonial

  return (
    <section
      ref={ref}
      id="letter"
      aria-labelledby="testimonial-heading"
      data-testid="case-study-testimonial"
      className="relative z-10 scroll-mt-20 min-[900px]:scroll-mt-24 px-6 md:px-12 py-14 lg:py-24 border-t border-line-faint"
    >
      <div
        className={`max-w-7xl mx-auto grid grid-cols-1 gap-5 lg:grid-cols-[320px_minmax(0,680px)] lg:gap-24 ${
          isRevealed ? 'animate-fade-in-up' : 'opacity-0'
        }`}
      >
        <div className="flex flex-col gap-5 lg:gap-6 lg:sticky lg:top-28 lg:self-start">
          <p className={`text-gold-text ${label}`}>In their words</p>
          <h2
            id="testimonial-heading"
            className="font-serif text-ink-em text-[34px] leading-10 md:text-[40px] md:leading-[46px]"
          >
            A letter from the client
          </h2>
          <div className="flex flex-col gap-0.5 lg:gap-1 lg:border-t lg:border-line-faint lg:pt-5 text-[15px] leading-6 text-ink-sub">
            <span className="font-medium text-lg leading-[30px] lg:font-normal lg:font-serif lg:text-[26px] lg:leading-8 text-ink-em">
              {attribution.name}
            </span>
            <span>{attribution.role}</span>
            <span>{attribution.company}</span>
            {provenance ? (
              <span className="text-ink-muted">{provenance}</span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-5 lg:gap-16">
          <figure className="max-w-[640px] lg:max-w-none border-l-2 border-gold pl-5 lg:pl-10">
            <blockquote className="flex flex-col gap-5 lg:gap-6 text-lg leading-[30px] text-ink">
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </blockquote>
            <figcaption className="hidden lg:block mt-6 font-serif italic text-[26px] leading-8 text-ink-em">
              {attribution.name}, {attribution.role}
            </figcaption>
          </figure>

          {builtBy ? <BuilderCard builder={builtBy} /> : null}
        </div>
      </div>
    </section>
  )
}

function BuilderCard({ builder }: { builder: CaseStudyBuilder }) {
  return (
    <div className="grid grid-cols-[96px_minmax(0,1fr)] md:grid-cols-[160px_minmax(0,1fr)] gap-x-4 md:gap-x-8 gap-y-3 md:gap-y-2.5 items-center border border-line-faint bg-card p-5 md:pl-6 md:pr-8 md:py-6">
      <img
        src={builder.image.src}
        alt={builder.image.alt}
        width={builder.image.width}
        height={builder.image.height}
        loading="lazy"
        className="w-24 h-[120px] md:w-40 md:h-[200px] object-cover md:row-span-3"
      />
      <div className="flex flex-col gap-1.5 md:gap-2.5 md:self-end">
        <h3 className={`text-gold-text ${label}`}>Who built it</h3>
        <p className="font-serif text-[26px] leading-8 text-ink-em">
          {builder.name}
        </p>
        <p className="text-[15px] leading-6 text-ink-muted">
          {builder.role}
          {builder.location ? (
            <span className="hidden md:inline">
              <span className="mx-2" aria-hidden="true">
                ·
              </span>
              {builder.location}
            </span>
          ) : null}
        </p>
      </div>
      <p className="col-span-2 md:col-span-1 text-lg leading-[30px] text-ink-sub">
        {builder.bio}
      </p>
      <div className="col-span-2 md:col-span-1 md:justify-self-start">
        <CtaLink to={utilityCta.to} variant="outline" arrow block>
          {utilityCta.label}
        </CtaLink>
      </div>
    </div>
  )
}
