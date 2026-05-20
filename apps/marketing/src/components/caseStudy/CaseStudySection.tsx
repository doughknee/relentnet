import type { StoryBlock } from '@/data/caseStudies'

import { useReveal } from '@/hooks/useReveal'

import { CaseStudyImage } from './CaseStudyImage'

interface CaseStudySectionProps {
  number: string
  label: string
  title: string
  blocks: ReadonlyArray<StoryBlock>
  /** Mirror the layout to the right side. Default false. */
  alignRight?: boolean
  /** Show the large dropshadow phase number. Default true; pass false on
   *  detail pages where the numbers feel imposed but we want to keep them
   *  in the data so they can come back. */
  showNumber?: boolean
  /**
   * 'standard' renders the full section treatment (large serif title).
   * 'subordinate' demotes the section to an addendum: smaller eyebrow,
   * no large title, tighter padding, thin top divider.
   */
  tone?: 'standard' | 'subordinate'
}

export function CaseStudySection({
  number,
  label,
  title,
  blocks,
  alignRight = false,
  showNumber = true,
  tone = 'standard',
}: CaseStudySectionProps) {
  const { ref, isRevealed } = useReveal(0.15)

  if (blocks.length === 0) {
    return null
  }

  if (tone === 'subordinate') {
    return (
      <section
        ref={ref}
        className="relative z-10 px-6 md:px-12 py-16 md:py-20 border-t border-line-faint"
      >
        <div className="max-w-6xl mx-auto">
          <div
            className={`flex items-baseline gap-4 mb-6 ${
              isRevealed ? 'animate-fade-in-up' : 'opacity-0'
            }`}
          >
            <span className="text-gold text-[10px] font-bold tracking-[0.3em] uppercase">
              {label}
            </span>
            <span className="text-ink-muted text-[10px] tracking-[0.3em] uppercase">
              {title}
            </span>
          </div>
          <div
            className={`${
              isRevealed ? 'animate-fade-in-up' : 'opacity-0'
            }`}
            style={isRevealed ? { animationDelay: '120ms' } : undefined}
          >
            <StoryBlocks blocks={blocks} />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={ref}
      className="relative z-10 px-6 md:px-12 py-24 md:py-32"
    >
      <div className="max-w-6xl mx-auto">
        {showNumber ? (
          <span
            className={`block text-[7rem] md:text-[10rem] font-serif text-black/[0.06] dark:text-white/[0.03] leading-none select-none -mb-10 md:-mb-14 ${
              alignRight ? 'md:text-right' : ''
            } ${isRevealed ? 'animate-fade-in-up' : 'opacity-0'}`}
          >
            {number}
          </span>
        ) : null}

        <div
          className={`grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 ${
            isRevealed ? 'animate-fade-in-up' : 'opacity-0'
          }`}
          style={isRevealed ? { animationDelay: '150ms' } : undefined}
        >
          <div
            className={`md:col-span-3 ${alignRight ? 'md:order-last md:text-right' : ''}`}
          >
            <span className="text-gold text-[10px] font-bold tracking-[0.3em] uppercase block">
              {label}
            </span>
            <h2 className="font-serif text-2xl md:text-3xl mt-2">{title}</h2>
          </div>

          <div className={`md:col-span-9 ${alignRight ? 'md:order-first' : ''}`}>
            <StoryBlocks blocks={blocks} />
          </div>
        </div>
      </div>
    </section>
  )
}

interface StoryBlocksProps {
  blocks: ReadonlyArray<StoryBlock>
}

function StoryBlocks({ blocks }: StoryBlocksProps) {
  // Paragraphs and pull quotes stay constrained for readability
  // (`max-w-2xl`); images escape the column so they can breathe at the
  // section's full width. Each block carries its own width treatment
  // instead of inheriting from a single wrapper.
  return (
    <div className="space-y-6">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'p':
            return (
              <p
                key={index}
                className="max-w-2xl text-ink-sub leading-relaxed text-base md:text-lg"
              >
                {block.text}
              </p>
            )
          case 'image':
            return (
              <div key={index} className="my-12 md:my-16">
                <CaseStudyImage image={block.image} />
              </div>
            )
          case 'quote':
            return (
              <figure
                key={index}
                className="max-w-2xl border-l-2 border-gold/40 pl-6 my-8"
              >
                <blockquote className="font-serif italic text-xl md:text-2xl text-ink-sub leading-relaxed">
                  {block.text}
                </blockquote>
                {block.attribution ? (
                  <figcaption className="mt-3 text-[10px] font-bold tracking-[0.3em] uppercase text-ink-muted">
                    {block.attribution}
                  </figcaption>
                ) : null}
              </figure>
            )
          default: {
            // Exhaustiveness check: if a new StoryBlock variant is added,
            // TypeScript will flag this branch.
            const _exhaustive: never = block
            return _exhaustive
          }
        }
      })}
    </div>
  )
}
