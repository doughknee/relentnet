import { CtaLink } from '@/components/CtaLink'
import { Eyebrow } from '@/components/Eyebrow'
import { Reveal } from '@/components/Reveal'
import { caseStudies } from '@/data/caseStudies'

const SLUG = 'cambridge-building-group'

/** Indices into the letter's paragraphs: how the work went, and the
 *  recommendation. Not the outcome paragraph, whose first sentence is the
 *  homepage proof block's quote. */
export const testimonialExcerpt = [3, 4] as const

/**
 * Two paragraphs of Jason Hall's Cambridge letter on the homepage, read from
 * the case study's `testimonial` so the text lives in one place, with a link
 * to the full letter on the case-study page.
 */
export function HomeTestimonial() {
  const testimonial = caseStudies.find((s) => s.slug === SLUG)?.testimonial
  if (!testimonial) return null

  const { attribution } = testimonial
  const paragraphs = testimonialExcerpt.map((i) => testimonial.paragraphs[i])

  return (
    <section
      aria-labelledby="home-testimonial-heading"
      data-testid="home-testimonial"
    >
      <div className="max-w-[1200px] mx-auto px-5 md:px-12 py-18">
        <Reveal>
          <Eyebrow className="mb-10">07 · In their words</Eyebrow>
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
            <CtaLink to={`/clients/${SLUG}`} variant="outline" arrow>
              Read Jason&rsquo;s full letter
            </CtaLink>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
