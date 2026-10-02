import { Reveal } from '@/components/Reveal'
import { sectionInner, surfaces } from '@/components/SectionHead'

interface FitListsProps {
  goodFit: ReadonlyArray<string>
  notFit: ReadonlyArray<string>
  surface?: keyof typeof surfaces
}

/** "A good fit if" / "Not the right fit for", two ruled lists side by side. */
export function FitLists({ goodFit, notFit, surface = 'card' }: FitListsProps) {
  const columns = [
    {
      title: 'A good fit if',
      items: goodFit,
      titleClass: 'text-gold-text',
      itemClass: 'text-ink-sub',
    },
    {
      title: 'Not the right fit for',
      items: notFit,
      titleClass: 'text-ink-muted',
      itemClass: 'text-ink-muted',
    },
  ]
  return (
    <section className={surfaces[surface]}>
      <div
        className={`${sectionInner} grid grid-cols-1 min-[768px]:grid-cols-2 gap-12 min-[768px]:gap-20`}
      >
        {columns.map((col) => (
          <div key={col.title}>
            <Reveal>
              <h3
                className={`font-serif text-[clamp(30px,3.2vw,40px)] leading-[1.15] mb-5 ${col.titleClass}`}
              >
                {col.title}
              </h3>
            </Reveal>
            <div>
              {col.items.map((item) => (
                <Reveal key={item} delay={100}>
                  <p
                    className={`border-b border-line py-4 text-lg leading-[30px] ${col.itemClass}`}
                  >
                    {item}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
