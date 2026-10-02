import { Link } from '@tanstack/react-router'

import { Eyebrow } from '@/components/Eyebrow'
import { Reveal } from '@/components/Reveal'
import { sectionInner, surfaces } from '@/components/SectionHead'
import { caseStudies } from '@/data/caseStudies'

const SLUG = 'cambridge-building-group'

interface ClientProofBandProps {
  eyebrow: string
  /** One sentence of Jason Hall's letter, verbatim. The band renders only if
   *  the letter still contains it, so the quote cannot drift. */
  quote: string
  /** One line under the attribution that ties the quote to the page. */
  support: string
  surface: keyof typeof surfaces
}

/** Cambridge site image beside a verbatim line from Jason Hall's letter and
 *  a link to the case study. */
export function ClientProofBand({
  eyebrow,
  quote,
  support,
  surface,
}: ClientProofBandProps) {
  const testimonial = caseStudies.find((s) => s.slug === SLUG)?.testimonial
  if (!testimonial?.paragraphs.some((p) => p.includes(quote))) return null
  const { name, role, company } = testimonial.attribution

  return (
    <section data-testid="client-proof" className={surfaces[surface]}>
      <div
        className={`${sectionInner} grid grid-cols-1 min-[1024px]:grid-cols-[minmax(0,600px)_minmax(0,1fr)] gap-10 min-[1024px]:gap-[72px] items-center`}
      >
        <Reveal>
          <img
            src="/case-studies/cambridge-building-group/hero.webp"
            width={1600}
            height={1000}
            alt="The Cambridge Building Group website RelentNet built"
            loading="lazy"
            className="w-full aspect-[16/10] object-cover border border-line"
          />
        </Reveal>
        <div className="flex flex-col gap-5 items-start">
          <Reveal>
            <Eyebrow>{eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={100}>
            <figure>
              <blockquote className="font-serif italic text-[clamp(26px,3vw,36px)] leading-[1.22] text-ink-em">
                &ldquo;{quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 font-mono text-[11px] tracking-[0.26em] uppercase leading-[1.5] text-ink-muted">
                {name} · {role}, {company}
              </figcaption>
            </figure>
          </Reveal>
          <Reveal delay={150}>
            <p className="text-lg leading-[30px] text-ink-sub">{support}</p>
          </Reveal>
          <Reveal delay={200}>
            <Link
              to="/clients/$slug"
              params={{ slug: SLUG }}
              className="text-lg font-medium text-gold-text hover:underline underline-offset-4"
            >
              Read the Cambridge case study &rarr;
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
