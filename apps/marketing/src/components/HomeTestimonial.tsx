import { CtaLink } from '@/components/CtaLink'
import { Eyebrow } from '@/components/Eyebrow'
import { Reveal } from '@/components/Reveal'
import { sectionInner, surfaces } from '@/components/SectionHead'
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
      className={surfaces.page}
    >
      <div className={sectionInner}>
        <Reveal>
          <Eyebrow className="mb-[22px] min-[768px]:mb-10">
            08 · In their words
          </Eyebrow>
          <h2 id="home-testimonial-heading" className="sr-only">
            In their words: Jason Hall, Cambridge Building Group
          </h2>
        </Reveal>
        <Reveal delay={80}>
          {/* One gold rule runs down the letter and, on phones, the
              signature under it. Phones get the recommendation paragraph
              alone, which ends on a full sentence. */}
          <figure className="grid grid-cols-1 min-[1024px]:grid-cols-[minmax(0,800px)_minmax(0,1fr)] min-[1024px]:grid-rows-[auto_1fr] min-[1024px]:gap-x-20">
            <blockquote className="min-[1024px]:row-span-2 space-y-6 border-l-2 border-gold pl-5 min-[768px]:pl-10 font-serif text-xl leading-[30px] min-[768px]:text-[22px] min-[768px]:leading-[34px] text-ink">
              {paragraphs.map((paragraph, i) => (
                <p
                  key={paragraph}
                  className={i === 0 ? 'hidden min-[768px]:block' : undefined}
                >
                  {paragraph}
                </p>
              ))}
            </blockquote>
            <figcaption className="flex flex-col items-start gap-1 border-l-2 border-gold pl-5 pt-4 min-[768px]:pl-10 min-[1024px]:border-0 min-[1024px]:pl-0 min-[1024px]:pt-1">
              <span className="font-serif text-[26px] leading-[30px] text-ink-em">
                {attribution.name}
              </span>
              <span className="text-base leading-6 text-ink-sub">
                {attribution.role}
              </span>
              <span className="text-base leading-6 text-ink-sub">
                {attribution.company}
              </span>
            </figcaption>
            <div className="mt-[22px] min-[1024px]:col-start-2 min-[1024px]:mt-6">
              <CtaLink to={`/clients/${SLUG}`} variant="outline" arrow>
                Read Jason&rsquo;s full letter
              </CtaLink>
            </div>
          </figure>
        </Reveal>
      </div>
    </section>
  )
}
