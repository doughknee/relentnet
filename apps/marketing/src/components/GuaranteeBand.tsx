import { Eyebrow } from '@/components/Eyebrow'
import { Reveal } from '@/components/Reveal'
import { leadClass, sectionInner, surfaces } from '@/components/SectionHead'
import { founders } from '@/routes/about'
import { siteConfig } from '@/site.config'

const monoGold =
  'font-mono text-[11px] tracking-[0.26em] uppercase text-gold-text'

/** Small gold card for the hero's "You leave with" aside. Renders only when
 *  `pricing.diagnostic.guarantee` is set. */
export function GuaranteeChip() {
  const guarantee = siteConfig.pricing.diagnostic.guarantee
  if (!guarantee) return null
  return (
    <div
      data-testid="guarantee-chip"
      className="mt-6 flex flex-col gap-1 border border-gold bg-gold-tint px-4 py-3.5"
    >
      <p className={monoGold}>Guarantee</p>
      <p className="text-base leading-6 text-ink">{guarantee.headline}</p>
    </div>
  )
}

/** The Diagnostic guarantee band. Renders only when
 *  `pricing.diagnostic.guarantee` is set, so no terms ship until Brandon
 *  supplies them. */
export function GuaranteeBand() {
  const { terms, guarantee } = siteConfig.pricing.diagnostic
  if (!guarantee) return null
  const person = founders[0]
  // "Worth $2,000, or your money back." keeps its gold italic tail.
  const at = guarantee.headline.indexOf(', or ')
  const cut = at < 0 ? guarantee.headline.length : at + 5

  return (
    <section data-testid="guarantee-band" className={surfaces.tint}>
      <div
        className={`${sectionInner} grid grid-cols-1 min-[1024px]:grid-cols-[340px_minmax(0,1fr)] gap-10 min-[1024px]:gap-[72px] items-center`}
      >
        <Reveal>
          <img
            src="/brandon-harris.webp"
            srcSet="/brandon-harris-320.webp 320w, /brandon-harris.webp 640w"
            sizes="(min-width: 1024px) 340px, 100vw"
            width={640}
            height={800}
            alt={person.name}
            loading="lazy"
            className="w-full max-w-[340px] aspect-[4/5] object-cover border border-line"
          />
        </Reveal>
        <div className="flex flex-col gap-6 items-start">
          <Reveal>
            <Eyebrow>The guarantee</Eyebrow>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="font-serif text-[clamp(34px,4.4vw,56px)] leading-[1.07] text-balance">
              {guarantee.headline.slice(0, cut)}
              <span className="italic text-gold-text">
                {guarantee.headline.slice(cut)}
              </span>
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p className={leadClass}>{guarantee.terms}</p>
          </Reveal>
          <Reveal
            delay={200}
            className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2"
          >
            <div className="border border-line bg-page/40 px-6 py-5">
              <p className={`${monoGold} mb-2`}>If you build</p>
              <p className="text-lg leading-[30px] text-ink-em">{terms}</p>
            </div>
            <div className="border border-line bg-page/40 px-6 py-5">
              <p className={`${monoGold} mb-2`}>Refund window</p>
              <p className="text-lg leading-[30px] text-ink-em">
                {guarantee.window}
              </p>
            </div>
          </Reveal>
          <Reveal delay={250}>
            <p className="font-serif text-[26px] leading-[30px] text-ink-em">
              {person.name}
            </p>
            <p className="mt-0.5 font-mono text-[11px] tracking-[0.26em] uppercase text-ink-muted">
              {person.role}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
