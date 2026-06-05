import type { CaseStudy, StoryBlock } from '@/data/caseStudies'

interface CaseStudyNarrativeProps {
  study: CaseStudy
}

function renderBlocks(blocks: ReadonlyArray<StoryBlock>) {
  return blocks.map((block, idx) => {
    if (block.type === 'p') {
      return (
        <p
          key={idx}
          className="text-ink text-base md:text-lg leading-relaxed mb-6"
        >
          {block.text}
        </p>
      )
    }
    if (block.type === 'image') {
      return (
        <figure key={idx} className="my-8">
          <img
            src={block.image.src}
            alt={block.image.alt}
            width={block.image.width}
            height={block.image.height}
            className="w-full h-auto border border-line-faint"
            loading="lazy"
          />
          {block.image.caption ? (
            <figcaption className="mt-3 text-sm text-ink-muted">
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
 * Detail-page narrative — Challenge / Solution / Results in single-column layout.
 * Mirrors Stripe /customers/figma's mid-page H2 sections.
 *
 * Challenge = story.problem + story.diagnosis (concatenated).
 * Solution = story.build.
 * Results = study.results if set, else single block from story.outcome.
 *
 * Stewardship (story.stewardship) is dropped from the detail page per the spec.
 */
export function CaseStudyNarrative({ study }: CaseStudyNarrativeProps) {
  const challengeBlocks: ReadonlyArray<StoryBlock> = [
    ...study.story.problem,
    ...study.story.diagnosis,
  ]
  const solutionBlocks = study.story.build

  return (
    <div className="max-w-2xl">
      <h2 className="font-serif text-3xl md:text-4xl mb-8">Challenge</h2>
      {renderBlocks(challengeBlocks)}

      <h2 className="font-serif text-3xl md:text-4xl mb-8 mt-16">Solution</h2>
      {renderBlocks(solutionBlocks)}

      <h2 className="font-serif text-3xl md:text-4xl mb-8 mt-16">Results</h2>
      {study.results
        ? study.results.map((result, idx) => (
            <div key={idx}>
              <h3 className="font-serif text-xl md:text-2xl mb-4 mt-12 first:mt-0">
                {result.headline}
              </h3>
              <p className="text-ink text-base md:text-lg leading-relaxed mb-6">
                {result.body}
              </p>
            </div>
          ))
        : renderBlocks(study.story.outcome)}
    </div>
  )
}
