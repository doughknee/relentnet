import { Reveal } from '@/components/Reveal'
import { sectionInner, surfaces } from '@/components/SectionHead'

const monoGold =
  'font-mono text-[11px] tracking-[0.26em] uppercase text-gold-text'

export interface ProcessPhaseBlockProps {
  number: string
  label: string
  title: string
  quote: string
  description: string
  deliverables: ReadonlyArray<string>
  /** Label and value for the first box ("How long", or "Engagement" where no
   *  duration is published). */
  meta: { label: string; value: string }
  /** Who the client talks to in this phase. Optional: rendered only when a
   *  name and role are stated on /about. */
  who?: string
  surface: keyof typeof surfaces
}

function MetaBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-1 flex-col gap-1.5 border border-line bg-gold-tint px-4 py-3.5">
      <p className={monoGold}>{label}</p>
      <p className="text-base leading-6 text-ink-em">{value}</p>
    </div>
  )
}

/** One process phase: number, label, title, quote, description, a meta box
 *  or two, and four deliverables. */
export function ProcessPhaseBlock({
  number,
  label,
  title,
  quote,
  description,
  deliverables,
  meta,
  who,
  surface,
}: ProcessPhaseBlockProps) {
  return (
    <section className={surfaces[surface]}>
      <div
        className={`${sectionInner} grid grid-cols-1 min-[1024px]:grid-cols-[330px_minmax(0,1fr)_320px] gap-10 min-[1024px]:gap-16 items-start`}
      >
        <Reveal>
          <span
            aria-hidden="true"
            className="font-serif text-[clamp(72px,8vw,112px)] leading-[0.95] text-ghost block"
          >
            {number}
          </span>
          <p className={`mt-2.5 ${monoGold}`}>{label}</p>
          <h2 className="font-serif text-[clamp(32px,3.4vw,40px)] leading-[1.15] mt-2.5">
            <span className="sr-only">Phase {number}: </span>
            {title}
          </h2>
        </Reveal>
        <Reveal delay={120} className="flex flex-col gap-[18px]">
          <p className="font-serif italic text-[clamp(22px,2.2vw,26px)] leading-[1.25] text-ink-em">
            &ldquo;{quote}&rdquo;
          </p>
          <p className="text-lg leading-[30px] text-ink-sub">{description}</p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <MetaBox label={meta.label} value={meta.value} />
            {who && <MetaBox label="Who you talk to" value={who} />}
          </div>
        </Reveal>
        <Reveal
          delay={240}
          className="min-[1024px]:border-l min-[1024px]:border-line min-[1024px]:pl-7"
        >
          <p className="font-mono text-[11px] tracking-[0.26em] uppercase text-ink-muted mb-1">
            Deliverables
          </p>
          <div>
            {deliverables.map((item) => (
              <p
                key={item}
                className="border-b border-line py-3 text-base leading-6 text-ink-sub"
              >
                {item}
              </p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
