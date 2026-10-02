import { Reveal } from '@/components/Reveal'

interface AboutSectionProps {
  num: string
  eyebrow: string
  title: string
  body: ReadonlyArray<string>
  className?: string
}

/** A numbered story section (Block/About Section). Copy comes from
 *  `aboutSections` in routes/about.tsx, verbatim. */
export function AboutSection({
  num,
  eyebrow,
  title,
  body,
  className = '',
}: AboutSectionProps) {
  return (
    <section className={`border-t border-line ${className}`}>
      <div className="max-w-[1440px] mx-auto px-5 md:px-12 xl:px-20 py-14 min-[900px]:py-[72px] grid grid-cols-1 min-[900px]:grid-cols-[minmax(0,300px)_minmax(0,1fr)] min-[1200px]:grid-cols-[minmax(0,360px)_minmax(0,1fr)] gap-6 min-[900px]:gap-16 items-start">
        <Reveal>
          <span
            aria-hidden="true"
            className="font-serif text-[80px] min-[900px]:text-[110px] leading-[0.9] text-watermark block"
          >
            {num}
          </span>
          <p className="mt-4 font-mono text-[12px] tracking-[0.22em] uppercase text-gold-text font-medium">
            {eyebrow}
          </p>
        </Reveal>
        <Reveal delay={120} className="flex flex-col gap-5 max-w-[760px]">
          <h2 className="font-serif text-[clamp(30px,3.4vw,40px)] leading-[1.15] text-ink-em text-balance">
            {title}
          </h2>
          {body.map((paragraph, p) => (
            <p key={p} className="text-[18px] leading-[30px] text-ink-sub">
              {paragraph}
            </p>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
