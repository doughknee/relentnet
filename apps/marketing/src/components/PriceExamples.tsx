import type { PriceExample } from '@/site.config'
import { Reveal } from '@/components/Reveal'
import { SectionHead, sectionInner, surfaces } from '@/components/SectionHead'
import { siteConfig } from '@/site.config'

const monoLabel =
  'font-mono text-[11px] tracking-[0.26em] uppercase text-ink-muted'

const columns =
  'min-[1024px]:grid-cols-[minmax(0,1fr)_190px_190px_190px] gap-x-10'

/** One worked example: the shape, then build, monthly run, year-one total. */
export function PriceExampleRow({ example }: { example: PriceExample }) {
  const figures = [
    { label: 'Build, one time', value: example.build, gold: true },
    { label: 'Run, monthly', value: example.run, gold: true },
    { label: 'Year one, all in', value: example.total, gold: false },
  ]
  return (
    <div
      className={`grid grid-cols-1 gap-y-3 border-b border-line py-7 ${columns}`}
    >
      <div className="flex flex-col gap-1.5">
        <p className="font-serif text-[26px] leading-8 text-ink-em">
          {example.name}
        </p>
        <p className="text-base leading-6 text-ink-sub">
          {example.description}
        </p>
      </div>
      {figures.map((f) => (
        <div
          key={f.label}
          className="flex items-baseline justify-between gap-4 min-[1024px]:block"
        >
          <span className={`${monoLabel} min-[1024px]:hidden`}>{f.label}</span>
          <span
            className={`font-serif text-[26px] leading-8 ${
              f.gold ? 'text-gold-text' : 'text-ink-em'
            }`}
          >
            {f.value}
          </span>
        </div>
      ))}
    </div>
  )
}

/** Worked all-in price examples. Renders only when `pricing.examples` has
 *  entries, so no invented figures ever ship. */
export function PriceExamples({
  surface = 'page',
}: {
  surface?: keyof typeof surfaces
}) {
  const { examples, build, run } = siteConfig.pricing
  if (examples.length === 0) return null

  return (
    <section data-testid="price-examples" className={surfaces[surface]}>
      <div className={sectionInner}>
        <SectionHead
          eyebrow="What a build costs"
          lead={`${build.price}. ${build.terms} Run: ${run.price}. ${run.terms}`}
        >
          Example builds, <span className="italic text-gold-text">all in.</span>
        </SectionHead>
        <div className="mt-10 border-t-2 border-gold">
          <div
            className={`hidden min-[1024px]:grid border-b border-line py-[18px] ${columns}`}
          >
            <p className={monoLabel}>Shape</p>
            <p className={monoLabel}>Build, one time</p>
            <p className={monoLabel}>Run, monthly</p>
            <p className={monoLabel}>Year one, all in</p>
          </div>
          {examples.map((example, i) => (
            <Reveal key={example.name} delay={i * 80}>
              <PriceExampleRow example={example} />
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-base text-ink-muted">
          Illustrative, not a quote. Every build is fixed-price, scoped in the
          diagnostic. Year one is the build plus 12 months of run.
        </p>
      </div>
    </section>
  )
}
