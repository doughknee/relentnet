import type { CaseStudy, StoryBlock } from '@/data/caseStudies'

interface CaseStudyNarrativeProps {
  study: CaseStudy
}

const h2 =
  'font-serif text-ink-em text-[34px] leading-10 md:text-[40px] md:leading-[46px] mb-5 md:mb-6'
const gap = 'mt-12'

function renderBlocks(blocks: ReadonlyArray<StoryBlock>) {
  return blocks.map((block, idx) => {
    if (block.type === 'p') {
      return (
        <p key={idx} className="text-ink text-lg leading-[30px] mb-5 md:mb-6">
          {block.text}
        </p>
      )
    }
    if (block.type === 'image') {
      return (
        <figure key={idx} className="my-6 md:my-8">
          <img
            src={block.image.src}
            alt={block.image.alt}
            width={block.image.width}
            height={block.image.height}
            className="w-full h-auto border border-line-faint"
            loading="lazy"
          />
          {block.image.caption ? (
            <figcaption className="mt-2.5 md:mt-3 text-[15px] leading-6 text-ink-muted">
              {block.image.caption}
            </figcaption>
          ) : null}
        </figure>
      )
    }
    return (
      <blockquote key={idx} className="my-8 border-l-2 border-gold pl-6">
        <p className="font-serif italic text-xl md:text-2xl text-ink leading-snug">
          {block.text}
        </p>
        {block.attribution ? (
          <cite className="mt-3 block text-sm text-ink-muted not-italic">
            {block.attribution}
          </cite>
        ) : null}
      </blockquote>
    )
  })
}

/**
 * Detail-page narrative — Challenge / Solution / Results / Stewardship in single-column layout.
 *
 * Challenge = story.problem + story.diagnosis (concatenated).
 * Solution = story.build.
 * Results = study.results if set, else single block from story.outcome.
 * Stewardship = story.stewardship when present.
 */
export function CaseStudyNarrative({ study }: CaseStudyNarrativeProps) {
  const challengeBlocks: ReadonlyArray<StoryBlock> = [
    ...study.story.problem,
    ...study.story.diagnosis,
  ]
  const solutionBlocks = study.story.build

  return (
    <div className="max-w-[680px]">
      <h2 className={h2}>Challenge</h2>
      {renderBlocks(challengeBlocks)}

      <h2 className={`${h2} ${gap}`}>Solution</h2>
      {renderBlocks(solutionBlocks)}

      <h2 className={`${h2} ${gap}`}>Results</h2>
      {study.results
        ? study.results.map((result, idx) => (
            <div key={idx}>
              <h3 className="font-serif text-ink-em text-[26px] leading-8 mb-5 md:mb-6">
                {result.headline}
              </h3>
              <p className="text-ink text-lg leading-[30px] mb-5 md:mb-6">
                {result.body}
              </p>
            </div>
          ))
        : renderBlocks(study.story.outcome)}

      {study.story.stewardship ? (
        <>
          <h2 className={`${h2} ${gap}`}>Stewardship</h2>
          {renderBlocks(study.story.stewardship)}
        </>
      ) : null}
    </div>
  )
}
