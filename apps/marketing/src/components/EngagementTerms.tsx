import { Eyebrow } from '@/components/Eyebrow'
import { Reveal } from '@/components/Reveal'
import { siteConfig } from '@/site.config'

const { pricing } = siteConfig

/** Four rows, one per way of working with us. Prices live in `siteConfig`. */
export const engagementRows = [
  {
    label: 'Diagnostic',
    price: pricing.diagnostic.price,
    terms: pricing.diagnostic.terms,
    sentence:
      'We map how the work moves and tell you whether to build, connect, or leave it alone.',
  },
  {
    label: 'Build',
    price: pricing.build.price,
    terms: pricing.build.terms,
    sentence: 'We design the system, build it, and launch it.',
  },
  {
    label: 'Website',
    price: pricing.website.price,
    terms: pricing.website.terms,
    sentence: 'A site that shows your track record in seconds.',
  },
  {
    label: 'Run',
    price: pricing.run.price,
    terms: pricing.run.terms,
    sentence: 'We keep the system working and stay accountable for it.',
  },
] as const

export function EngagementTerms() {
  return (
    <section>
      <div className="max-w-[1200px] mx-auto px-5 md:px-12 py-25">
        <div className="max-w-[700px] mb-12">
          <Reveal>
            <Eyebrow className="mb-5">How engagements work</Eyebrow>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="font-serif text-[clamp(28px,4vw,50px)] leading-[1.05] text-balance">
              What it costs,{' '}
              <span className="italic text-gold-text">and how long.</span>
            </h2>
          </Reveal>
        </div>
        <div className="border-t-2 border-gold">
          {engagementRows.map((row, i) => (
            <Reveal key={row.label} delay={i * 100}>
              <div className="grid grid-cols-1 min-[900px]:grid-cols-[2fr_3fr_5fr] gap-x-10 gap-y-2 border-b border-line-faint py-7">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.26em] uppercase text-ink-faint mb-2">
                    {row.label}
                  </p>
                  <p className="font-serif text-[28px] leading-[1.1] text-gold-text">
                    {row.price}
                  </p>
                </div>
                <p className="text-[15px] font-light leading-[1.65] text-ink-sub min-[900px]:pt-5">
                  {row.terms}
                </p>
                <p className="text-[15px] font-light leading-[1.65] text-ink-muted min-[900px]:pt-5">
                  {row.sentence}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
