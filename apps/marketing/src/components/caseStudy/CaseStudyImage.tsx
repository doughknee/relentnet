import type { CaseStudyImage as CaseStudyImageData } from '@/data/caseStudies'

interface CaseStudyImageProps {
  image: CaseStudyImageData
  priority?: boolean
}

export function CaseStudyImage({
  image,
  priority = false,
}: CaseStudyImageProps) {
  return (
    <figure className="border border-line-faint bg-inset overflow-hidden">
      <img
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading={priority ? 'eager' : 'lazy'}
        className="block h-auto w-full"
      />
      {image.caption ? (
        <figcaption className="border-t border-line-faint px-5 py-3 text-xs text-ink-muted">
          {image.caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
