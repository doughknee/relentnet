import { Link } from '@tanstack/react-router'

import type {
  EngagementKey,
  EngagementRowData,
} from '@/components/EngagementTerms'
import { engagementRows } from '@/components/EngagementTerms'
import { Eyebrow } from '@/components/Eyebrow'
import { Reveal } from '@/components/Reveal'
import { sectionInner, surfaces } from '@/components/SectionHead'

/** Where each tier sits on the path, in `engagementRows` order. */
export const tierLabels: Record<EngagementKey, string> = {
  diagnostic: '01 · First step',
  build: '02 · If it earns it',
  website: '03 · Standalone',
  run: '04 · Ongoing',
}

/** The tier the path starts on, marked by the gold accent. */
const ENTRY: EngagementKey = 'diagnostic'

const monoLabel =
  'font-mono text-[11px] tracking-[0.26em] uppercase leading-4 font-medium'

interface PriceTierProps {
  row: EngagementRowData
  label: string
  /** Gold top rule: the entry tier. */
  accent?: boolean
}

/** One published price as a card (Figma Card/Price Tier 13:13). */
export function PriceTier({ row, label, accent = false }: PriceTierProps) {
  return (
    <div
      data-testid="price-tier"
      className="flex h-full flex-col border border-line bg-page"
    >
      {accent && <span aria-hidden="true" className="h-0.5 bg-gold" />}
      <div className="flex flex-col gap-3 px-7 pt-7 pb-8">
        <p className={`${monoLabel} text-gold-text`}>{label}</p>
        <h3 className="font-serif text-[26px] leading-[30px] text-ink-em">
          {row.label}
        </h3>
        <p className="text-base leading-6 text-ink-sub">{row.sentence}</p>
        <div className="flex flex-col gap-2.5 border-t border-line pt-5">
          <p className="font-serif text-[44px] leading-[46px] text-gold-text">
            {row.price}
          </p>
          <p className="text-base leading-6 text-ink-muted">{row.terms}</p>
        </div>
      </div>
    </div>
  )
}

function DiagnosticLink() {
  return (
    <Link
      to="/diagnostic"
      className={`${monoLabel} inline-flex items-center gap-2.5 text-gold-text transition-all hover:gap-4`}
    >
      How the diagnostic works &rarr;
    </Link>
  )
}

/**
 * Homepage section 03: every published price, read from `engagementRows`
 * (and through it `siteConfig.pricing`). Four cards from 768px, a compact
 * price ladder on phones.
 */
export function WhatItCosts() {
  return (
    <section aria-labelledby="pricing-heading" className={surfaces.card}>
      <div className={sectionInner}>
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-5">
          <div>
            <Reveal>
              <Eyebrow className="mb-5">03 · What it costs</Eyebrow>
            </Reveal>
            <Reveal delay={100}>
              <h2
                id="pricing-heading"
                className="font-serif text-[34px] leading-10 min-[768px]:text-[40px] min-[768px]:leading-[46px] text-ink-em"
              >
                Every price, published.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={150} className="hidden min-[768px]:block">
            <DiagnosticLink />
          </Reveal>
        </div>

        <div className="mt-12 hidden min-[768px]:grid grid-cols-2 min-[1200px]:grid-cols-4 gap-5">
          {engagementRows.map((row, i) => (
            <Reveal key={row.key} delay={i * 80} className="h-full">
              <PriceTier
                row={row}
                label={tierLabels[row.key]}
                accent={row.key === ENTRY}
              />
            </Reveal>
          ))}
        </div>

        <div className="mt-5 min-[768px]:hidden">
          {engagementRows.map((row) => (
            <div
              key={row.key}
              data-testid="price-rung"
              className={`flex flex-col gap-1.5 py-4 ${
                row.key === ENTRY
                  ? 'border-l-2 border-gold bg-page px-3.5'
                  : 'border-t border-line'
              }`}
            >
              <p className="flex flex-wrap items-baseline justify-between gap-x-4 font-serif text-[26px] leading-[30px]">
                <span className="text-ink-em">{row.label}</span>
                <span className="text-gold-text">{row.price}</span>
              </p>
              <p className="text-base leading-6 text-ink-muted">{row.terms}</p>
            </div>
          ))}
          <div className="mt-5">
            <DiagnosticLink />
          </div>
        </div>
      </div>
    </section>
  )
}
