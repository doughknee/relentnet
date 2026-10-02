import { label } from './label'
import type { StackCategory } from '@/data/caseStudies'
import { Reveal } from '@/components/Reveal'

interface CaseStudyBuiltWithProps {
  stack: ReadonlyArray<StackCategory>
  /** Follows the tool count, e.g. "across the marketing site and the AP portal". */
  scope?: string
}

/** "Built with" band: every stack item, grouped by category, four across. */
export function CaseStudyBuiltWith({ stack, scope }: CaseStudyBuiltWithProps) {
  const count = stack.reduce((sum, group) => sum + group.items.length, 0)

  return (
    <section
      aria-labelledby="built-with-heading"
      className="relative z-10 px-6 md:px-12 pt-12 pb-14 md:pt-16 md:pb-[72px] border-t border-line-faint"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8 flex flex-col gap-6 md:flex-row md:items-baseline">
          <h2
            id="built-with-heading"
            className="font-serif text-ink-em text-[34px] leading-10 md:text-[40px] md:leading-[46px]"
          >
            Built with
          </h2>
          <p className="text-[15px] leading-6 text-ink-muted">
            {count} {count === 1 ? 'tool' : 'tools'}
            {scope ? ` ${scope}` : ''}
          </p>
        </div>
        <Reveal className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-6 md:gap-6">
          {stack.map((group) => (
            <div
              key={group.category}
              className="border-t border-gold pt-4 md:pt-5"
            >
              <h3 className={`mb-2.5 md:mb-3 text-gold-text ${label}`}>
                {group.category}
              </h3>
              <ul className="flex flex-col gap-2.5 md:gap-3">
                {group.items.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center gap-3 text-[15px] leading-6 md:text-lg md:leading-[30px] text-ink"
                  >
                    <span
                      className="hidden md:block size-1.5 shrink-0 bg-gold-deep"
                      aria-hidden="true"
                    />
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
