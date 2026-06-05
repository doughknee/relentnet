import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

export const clientsIntro = {
  eyebrow: 'Customer stories',
  headline: 'The diagnostic-first studio behind systems that move cleaner.',
  body: "We're building a practice for ambitious operators who would rather understand the friction in their workflow than buy more software to mask it. Our engagements turn diagnosed friction into useful systems that help real businesses move cleaner — across construction, consumer software, sports tech, and real estate.",
} as const

interface ClientsHeroProps {
  /** Anchor target for the "See all stories" CTA. */
  scrollTargetId: string
}

export function ClientsHero({ scrollTargetId }: ClientsHeroProps) {
  return (
    <section className="relative z-10 px-6 md:px-12 pt-32 md:pt-40 pb-16 md:pb-20">
      <div className="max-w-7xl mx-auto">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-6">
          {clientsIntro.eyebrow}
        </p>
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.05] max-w-4xl">
          {clientsIntro.headline}
        </h1>
        <p className="mt-8 max-w-2xl text-ink-sub text-base md:text-lg leading-relaxed">
          {clientsIntro.body}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <a
            href={`#${scrollTargetId}`}
            className="inline-flex items-center justify-center gap-3 border border-gold bg-gold px-7 py-4 text-sm uppercase tracking-widest text-black transition-all duration-300 hover:bg-transparent hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            See all stories
            <ArrowRight className="size-4" />
          </a>
          <Link
            to="/diagnostic"
            className="inline-flex items-center justify-center gap-3 border border-line px-7 py-4 text-sm uppercase tracking-widest text-ink transition-all duration-300 hover:border-gold hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            Start a Diagnostic
          </Link>
        </div>
      </div>
    </section>
  )
}
