import type { ReactNode } from 'react'
import { CtaLink } from '@/components/CtaLink'
import { Reveal } from '@/components/Reveal'
import { SectionHead, sectionInner, surfaces } from '@/components/SectionHead'
import { siteConfig } from '@/site.config'

const { pricing } = siteConfig

export type EngagementKey = 'diagnostic' | 'build' | 'website' | 'run'

export interface EngagementRowData {
  key: EngagementKey
  label: string
  /** Mono step line above the price, e.g. "01 · Diagnostic". */
  step: string
  price: string
  terms: string
  sentence: string
  /** Published duration; the "How long" cell renders only when set. */
  duration?: string
}

/** Four rows, one per way of working with us. Prices, terms and durations
 *  live in `siteConfig`. */
export const engagementRows: ReadonlyArray<EngagementRowData> = [
  {
    key: 'diagnostic',
    label: 'Diagnostic',
    step: '01 · Diagnostic',
    price: pricing.diagnostic.price,
    terms: pricing.diagnostic.terms,
    duration: pricing.diagnostic.duration,
    sentence:
      'We map how the work moves and tell you whether to build, connect, or leave it alone.',
  },
  {
    key: 'build',
    label: 'Build',
    step: '02 · Build',
    price: pricing.build.price,
    terms: pricing.build.terms,
    duration: pricing.build.duration,
    sentence: 'We design the system, build it, and launch it.',
  },
  {
    key: 'website',
    label: 'Website',
    step: 'Any time · Website',
    price: pricing.website.price,
    terms: pricing.website.terms,
    duration: pricing.website.duration,
    sentence: 'A site that shows your track record in seconds.',
  },
  {
    key: 'run',
    label: 'Run',
    step: '03 · Run',
    price: pricing.run.price,
    terms: pricing.run.terms,
    duration: pricing.run.duration,
    sentence: 'We keep the system working and stay accountable for it.',
  },
]

/** The path first (Diagnostic, Build, Run), the standalone website last. */
const displayOrder: ReadonlyArray<EngagementKey> = [
  'diagnostic',
  'build',
  'run',
  'website',
]

const monoLabel =
  'font-mono text-[11px] tracking-[0.26em] uppercase text-ink-muted'

interface EngagementRowProps {
  row: EngagementRowData
  /** Gold chip under the price: "You are here", "Phases 01–02". */
  badge?: string
}

/** One engagement tier: step and price, terms, a plain sentence, duration. */
export function EngagementRow({ row, badge }: EngagementRowProps) {
  return (
    <div className="grid grid-cols-1 min-[1024px]:grid-cols-[minmax(0,2fr)_minmax(0,3fr)_minmax(0,3fr)_minmax(0,1.5fr)] gap-x-10 gap-y-3 border-b border-line py-7">
      <div className="flex flex-col items-start gap-2">
        <p className={monoLabel}>{row.step}</p>
        <p className="font-serif text-[26px] leading-8 text-gold-text">
          {row.price}
        </p>
        {badge && (
          <span className="border border-gold bg-gold-tint px-2 py-1 font-mono text-[11px] tracking-[0.2em] uppercase text-gold-text">
            {badge}
          </span>
        )}
      </div>
      <p className="text-base leading-6 text-ink-sub min-[1024px]:pt-[26px]">
        {row.terms}
      </p>
      <p className="text-base leading-6 text-ink-muted min-[1024px]:pt-[26px]">
        {row.sentence}
      </p>
      {row.duration && (
        <div className="flex items-baseline gap-3 min-[1024px]:flex-col min-[1024px]:gap-1.5 min-[1024px]:pt-[26px]">
          <p className={monoLabel}>How long</p>
          <p className="text-lg font-medium leading-[30px] text-ink-em">
            {row.duration}
          </p>
        </div>
      )}
    </div>
  )
}

interface EngagementTermsProps {
  /** Chips by engagement: "You are here" on /diagnostic, phase ranges on
   *  /process. */
  badges?: Partial<Record<EngagementKey, string>>
  /** Lead paragraph beside the heading. */
  intro?: ReactNode
  /** Band surface. Pages pick whichever keeps the bands alternating. */
  surface?: keyof typeof surfaces
  /** Request-a-Diagnostic button and phone line under the rows. */
  showCta?: boolean
  id?: string
}

export function EngagementTerms({
  badges = {},
  intro,
  surface = 'page',
  showCta = false,
  id,
}: EngagementTermsProps) {
  return (
    <section id={id} className={`${surfaces[surface]} scroll-mt-20`}>
      <div className={sectionInner}>
        <SectionHead eyebrow="How engagements work" lead={intro}>
          What it costs,{' '}
          <span className="italic text-gold-text">and how long.</span>
        </SectionHead>
        <div className="mt-10 border-t-2 border-gold">
          {displayOrder.map((key, i) => {
            const row = engagementRows.find((r) => r.key === key)
            if (!row) return null
            return (
              <Reveal key={key} delay={i * 80}>
                <EngagementRow row={row} badge={badges[key]} />
              </Reveal>
            )
          })}
        </div>
        {showCta && (
          <Reveal>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <CtaLink to="/inquire" arrow>
                Request a Diagnostic
              </CtaLink>
              <p className="text-base text-ink-muted">
                Questions on pricing? Call{' '}
                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  className="text-ink-sub underline underline-offset-4 hover:text-gold-text"
                >
                  {siteConfig.contact.phone}
                </a>
                .
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}
