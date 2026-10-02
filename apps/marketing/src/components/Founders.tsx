import { siteConfig } from '@/site.config'
import { FOUNDED_MONTH, FOUNDED_YEAR, founders } from '@/routes/about'

type FounderName = (typeof founders)[number]['name']

/** Each founder's half of the work, from /about's "How the work splits". */
export const owns: Record<FounderName, string> = {
  'Brandon Harris': 'Owns what gets built: the vision, the code, the design.',
  'Daniel Velez': 'Owns bringing the work in and keeping it running.',
}

const monoLabel =
  'font-mono text-[11px] tracking-[0.26em] uppercase leading-4 font-medium'

function LinkedInLink({ name, href }: { name: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      aria-label={`${name} on LinkedIn`}
      className={`${monoLabel} text-gold-text underline decoration-transparent underline-offset-4 transition-colors hover:decoration-gold`}
    >
      LinkedIn &rarr;
    </a>
  )
}

/**
 * Brandon's card in the hero: portrait, role, bio, and the founding date. The
 * credential line and LinkedIn link exist only once `siteConfig.founders`
 * carries them. The facts block is desktop-only, which keeps the phone's first
 * screen ending on the proof ticks.
 */
export function HeroFounder() {
  const [brandon] = founders
  const { credential, linkedin } = siteConfig.founders[brandon.name]

  return (
    <div
      data-testid="hero-founder"
      className="flex items-center gap-4 min-[1200px]:items-end min-[1200px]:gap-7"
    >
      <div className="shrink-0 w-[104px] h-[130px] min-[1200px]:w-[232px] min-[1200px]:h-[290px] overflow-hidden border border-line">
        <img
          src="/brandon-harris.webp"
          srcSet="/brandon-harris-320.webp 320w, /brandon-harris.webp 640w"
          sizes="(min-width: 1200px) 232px, 104px"
          alt={`${brandon.name}, ${brandon.role} of RelentNet`}
          width={640}
          height={800}
          className="block w-full h-full object-cover saturate-[0.85] brightness-[0.92]"
        />
      </div>
      <div className="min-w-0 flex-1 min-[1200px]:flex-none min-[1200px]:w-[310px] flex flex-col gap-1.5 min-[1200px]:gap-2.5">
        <p className={`${monoLabel} text-gold-text`}>
          {brandon.role}
          <span className="hidden min-[1200px]:inline"> · {brandon.city}</span>
        </p>
        <p className="font-serif text-[26px] leading-[30px] min-[1200px]:leading-8 text-ink-em">
          {brandon.name}
        </p>
        <p className="text-base leading-6 text-ink-sub">
          Software engineer turned founder. He builds and runs automation for
          owner-led businesses.
        </p>
        <div className="hidden min-[1200px]:flex flex-col items-start gap-1.5 border-t border-line pt-3 text-base leading-6 text-ink-muted">
          <p>
            Building for owner-led businesses since {FOUNDED_MONTH}{' '}
            {FOUNDED_YEAR}
          </p>
          {credential && <p>{credential}</p>}
          {linkedin && <LinkedInLink name={brandon.name} href={linkedin} />}
        </div>
      </div>
    </div>
  )
}

/** Both founders as ruled rows: name, role and city, what each owns, and a
 *  LinkedIn link once one is supplied. */
export function FounderRows() {
  return (
    <div data-testid="founder-rows" className="w-full">
      {founders.map((person) => {
        const { linkedin } = siteConfig.founders[person.name]
        return (
          <div
            key={person.name}
            className="grid grid-cols-1 min-[768px]:grid-cols-[minmax(0,290px)_minmax(0,1fr)] gap-x-6 gap-y-1.5 border-t border-line py-4 min-[768px]:py-[18px]"
          >
            <div className="flex flex-col gap-1.5">
              <p className="font-serif text-[26px] leading-[30px] text-ink-em">
                {person.name}
              </p>
              <p className={`${monoLabel} text-gold-text`}>
                {person.role} · {person.city}
              </p>
            </div>
            <div className="flex flex-col items-start gap-1.5">
              <p className="text-base leading-6 text-ink-sub">
                {owns[person.name]}
              </p>
              {linkedin && <LinkedInLink name={person.name} href={linkedin} />}
            </div>
          </div>
        )
      })}
    </div>
  )
}
