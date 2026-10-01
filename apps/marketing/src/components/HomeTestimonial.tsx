import { Link } from '@tanstack/react-router'

import { CtaLink } from '@/components/CtaLink'
import { Eyebrow } from '@/components/Eyebrow'
import { Reveal } from '@/components/Reveal'
import { caseStudies } from '@/data/caseStudies'

export type HomeTestimonialVariant = 'excerpt' | 'full'

interface HomeTestimonialProps {
  variant: HomeTestimonialVariant
}

const SLUG = 'cambridge-building-group'

/** Indices into the letter's paragraphs: the outcome and the recommendation. */
const EXCERPT = [2, 4] as const

/**
 * Jason Hall's Cambridge letter on the homepage, read from the case study's
 * `testimonial` so the text lives in one place. `excerpt` carries two
 * paragraphs and a button-weight link; `full` carries all five and a quieter
 * text link. Both are candidates for review: one gets hardwired and this prop
 * goes away.
 */
export function HomeTestimonial({ variant }: HomeTestimonialProps) {
  const testimonial = caseStudies.find((s) => s.slug === SLUG)?.testimonial
  if (!testimonial) return null

  const { attribution } = testimonial
  const paragraphs =
    variant === 'full'
      ? testimonial.paragraphs
      : EXCERPT.map((i) => testimonial.paragraphs[i])

  return (
    <section
      aria-labelledby="home-testimonial-heading"
      data-testid="home-testimonial"
    >
      <div className="max-w-[1200px] mx-auto px-5 md:px-12 py-18">
        <Reveal>
          <Eyebrow className="mb-10">06 · In their words</Eyebrow>
          <h2 id="home-testimonial-heading" className="sr-only">
            In their words: Jason Hall, Cambridge Building Group
          </h2>
        </Reveal>
        <Reveal delay={80} className="max-w-2xl">
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
          <div className="mt-10 pl-6 md:pl-10">
            {variant === 'excerpt' ? (
              <CtaLink to={`/clients/${SLUG}`} variant="outline" arrow>
                Read Jason&rsquo;s full letter
              </CtaLink>
            ) : (
              <Link
                to="/clients/$slug"
                params={{ slug: SLUG }}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-ink-muted transition-all duration-300 hover:gap-3.5 hover:text-gold-text"
              >
                Read Jason&rsquo;s full letter
                <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
