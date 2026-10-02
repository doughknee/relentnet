import { Link } from '@tanstack/react-router'

import { caseStudies } from '@/data/caseStudies'

interface CaseStudyCardProps {
  slug: string
  index: number
  industry: string
  headline: string
  outcome: string
  statValue: string
  statDesc: string
  name: string
  systemType: string
}

/** The study's heroQuote and its attribution, as the case-study page shows
 *  them ("Name · Role, Study"). Undefined when the study has no quote, so
 *  the card renders without the block. */
export function studyQuote(slug: string) {
  const study = caseStudies.find((s) => s.slug === slug)
  const attribution = study?.testimonial?.attribution
  if (!study?.heroQuote || !attribution) return undefined
  return {
    quote: study.heroQuote,
    attribution: `${attribution.name} · ${attribution.role}, ${study.name}`,
  }
}

/** Text column of a /clients study row: eyebrow, headline, outcome, stat,
 *  client quote, meta line, and the link to the case study. */
export function CaseStudyCard(props: CaseStudyCardProps) {
  const q = studyQuote(props.slug)
  return (
    <div className="flex flex-col items-start gap-6 min-w-0">
      <p className="font-mono text-xs tracking-[0.22em] uppercase font-medium leading-4 text-ink-muted">
        0{props.index + 1} · {props.industry}
      </p>
      <h2 className="font-serif text-[34px] leading-10 md:text-[40px] md:leading-[46px] text-ink-em text-balance">
        {props.headline}
      </h2>
      <p className="text-lg leading-[30px] text-ink-sub">{props.outcome}</p>
      <div className="w-full border-l border-line pl-5 flex flex-col gap-2">
        <p className="font-serif text-[40px] leading-[46px] text-gold-text">
          {props.statValue}
        </p>
        <p className="text-[15px] leading-6 text-ink-muted">{props.statDesc}</p>
      </div>
      {q && (
        <figure
          data-testid="card-quote"
          className="w-full border-l-2 border-gold pl-5 py-1 flex flex-col gap-3.5"
        >
          <blockquote className="font-serif italic text-[20px] leading-[29px] md:text-[22px] md:leading-8 text-ink-em">
            {q.quote}
          </blockquote>
          <figcaption className="font-mono text-xs tracking-[0.22em] uppercase font-medium leading-4 text-gold-text">
            {q.attribution}
          </figcaption>
        </figure>
      )}
      <p className="text-[15px] leading-6 text-ink-muted">
        {props.name} · {props.systemType}
      </p>
      <Link
        to="/clients/$slug"
        params={{ slug: props.slug }}
        className="text-sm font-medium uppercase tracking-[0.1em] text-gold-text hover:underline underline-offset-4"
      >
        Read the case study <span aria-hidden="true">&rarr;</span>
        <span className="sr-only">: {props.name}</span>
      </Link>
    </div>
  )
}
