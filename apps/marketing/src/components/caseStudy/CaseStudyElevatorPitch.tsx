import { useReveal } from '@/hooks/useReveal'

interface CaseStudyElevatorPitchProps {
  text: string
}

/**
 * 2\u20133 sentence framing paragraph that sits between the hero and the
 * At-a-glance strip. Modeled on the elevator pitch Instrument uses on
 * Oura, Ramotion uses on Clearbit, etc. \u2014 a short prose summary that
 * lets a skimmer understand the whole case before deciding to read on.
 */
export function CaseStudyElevatorPitch({ text }: CaseStudyElevatorPitchProps) {
  const { ref, isRevealed } = useReveal(0.2)

  return (
    <section
      ref={ref}
      className="relative z-10 px-6 md:px-12 py-12 md:py-16"
    >
      <div className="max-w-4xl mx-auto">
        <p
          className={`font-serif text-xl md:text-3xl leading-snug text-ink-em ${
            isRevealed ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          {text}
        </p>
      </div>
    </section>
  )
}
