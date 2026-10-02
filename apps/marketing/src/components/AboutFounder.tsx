import { Eyebrow } from '@/components/Eyebrow'
import { Reveal } from '@/components/Reveal'
import { extraSpecs, owns } from '@/data/founders'
import { siteConfig } from '@/site.config'

interface Person {
  name: keyof typeof siteConfig.founders
  role: string
  city: string
}

interface SpecRow {
  label: string
  value: string
  /** Renders the value as a link. */
  href?: string
}

const monoLabel =
  'font-mono text-[12px] tracking-[0.22em] uppercase leading-4 font-medium'

/** One fact about a founder (Row/Spec). Callers pass only facts they hold. */
function Spec({ label, value, href }: SpecRow) {
  return (
    <div className="grid grid-cols-[110px_minmax(0,1fr)] min-[560px]:grid-cols-[150px_minmax(0,1fr)] gap-x-6 border-b border-line py-3.5">
      <dt className={`${monoLabel} text-ink-muted pt-[7px]`}>{label}</dt>
      <dd className="text-[18px] leading-[30px] text-ink-em break-words">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener"
            aria-label={`${value} on LinkedIn`}
            className="text-gold-text underline decoration-transparent underline-offset-4 transition-colors hover:decoration-gold"
          >
            {value} &rarr;
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  )
}

/**
 * The spec list: role, city, and tenure, which /about and `siteConfig` already
 * state, plus the credential, LinkedIn and `extraSpecs` rows where set.
 */
export function founderSpec(person: Person, since: string): Array<SpecRow> {
  const { credential, linkedin } = siteConfig.founders[person.name]
  const location = siteConfig.locations.find((l) => l.city === person.city)
  const rows: Array<SpecRow> = [
    { label: 'Role', value: person.role },
    {
      label: 'Based',
      value: location ? `${location.city}, ${location.state}` : person.city,
    },
    { label: 'Building since', value: since },
  ]
  if (credential) rows.push({ label: 'Credential', value: credential })
  if (linkedin)
    rows.push({ label: 'LinkedIn', value: person.name, href: linkedin })
  for (const row of extraSpecs[person.name]) if (row.value) rows.push(row)
  return rows
}

interface AboutFounderProps {
  person: Person
  /** "May 2022", from the page's FOUNDED_MONTH and FOUNDED_YEAR. */
  since: string
  /** A smaller second photo under the spec list (Fig. 02). */
  secondShot?: string
  className?: string
}

/**
 * A founder's block on /about: portrait beside name, what they own, and the
 * spec list. The portrait column renders only when `siteConfig.founders` holds
 * one, so a founder without a photo gets no empty frame.
 */
export function AboutFounder({
  person,
  since,
  secondShot,
  className = '',
}: AboutFounderProps) {
  const { portrait, portrait1x } = siteConfig.founders[person.name]
  const first = person.name.split(' ')[0]

  return (
    <section
      data-testid={`about-founder-${first.toLowerCase()}`}
      className={`border-t border-line ${className}`}
    >
      <div className="max-w-[1440px] mx-auto px-6 min-[768px]:px-12 xl:px-20 py-14 min-[1024px]:py-24 flex flex-col min-[1024px]:flex-row items-start gap-7 min-[1024px]:gap-[72px]">
        {portrait && (
          <Reveal className="w-full min-[1024px]:w-[520px] shrink-0">
            <figure className="flex flex-col gap-3">
              <div className="border border-line aspect-[4/5] w-full max-w-[520px] overflow-hidden">
                <img
                  src={portrait}
                  srcSet={
                    portrait1x
                      ? `${portrait1x} 520w, ${portrait} 1040w`
                      : undefined
                  }
                  sizes="(min-width: 1024px) 520px, 100vw"
                  alt={`${person.name}, ${person.role} of RelentNet`}
                  width={1040}
                  height={1300}
                  className="block w-full h-full object-cover"
                />
              </div>
              <figcaption className={`${monoLabel} text-ink-muted`}>
                Fig. 01 · {person.name}
              </figcaption>
            </figure>
          </Reveal>
        )}
        <Reveal delay={80} className="flex-1 min-w-0 max-w-[820px]">
          <div className="flex flex-col gap-5">
            <Eyebrow>
              {person.role} · {person.city}
            </Eyebrow>
            <h2 className="font-serif text-[44px] min-[1024px]:text-[56px] leading-[46px] min-[1024px]:leading-[60px] text-ink-em">
              {person.name}
            </h2>
            <p className="text-[18px] min-[1024px]:text-[21px] font-light leading-[30px] min-[1024px]:leading-[34px] text-ink-em">
              {first} {owns[person.name].replace(/^Owns/, 'owns')}
            </p>
            <dl className="border-t border-line">
              {founderSpec(person, since).map((row) => (
                <Spec key={row.label} {...row} />
              ))}
            </dl>
            {secondShot && (
              <figure className="flex items-end gap-5">
                <img
                  src={secondShot}
                  alt={`${person.name} in a second portrait`}
                  width={640}
                  height={800}
                  className="block w-[120px] min-[1024px]:w-[150px] aspect-[4/5] object-cover border border-line"
                />
                <figcaption className={`${monoLabel} text-ink-muted`}>
                  Fig. 02 · {person.name}
                </figcaption>
              </figure>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
