import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

interface ClientsHeroProps {
  /** Anchor target for the secondary CTA — element ID of the portrait grid section. */
  scrollTargetId: string
}

const headlinePrefix = 'Diagnosed friction.'
const headlineAccent = 'Useful systems.'
const headlineSuffix = 'Clearer operations.'

export const clientsIntro = {
  headlinePrefix,
  headlineAccent,
  headlineSuffix,
  headline: `${headlinePrefix} ${headlineAccent} ${headlineSuffix}`,
  body: 'These client engagements show the same pattern behind the workflow diagnostic: understand the operational friction, clarify the system worth creating, then build what helps the business move cleaner.',
} as const

export function ClientsHero({ scrollTargetId }: ClientsHeroProps) {
  return (
    <section className="min-h-[80vh] flex flex-col justify-center items-center px-6 relative text-center py-32">
      <p className="text-gold text-[10px] tracking-[0.35em] uppercase font-bold mb-8 opacity-0 animate-fade-in-up">
        Workflow problems solved
      </p>
      <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.05] opacity-0 animate-fade-in-up max-w-5xl">
        {clientsIntro.headlinePrefix}{' '}
        <span className="italic text-gold/90">
          {clientsIntro.headlineAccent}
        </span>{' '}
        {clientsIntro.headlineSuffix}
      </h1>
      <p
        className="mt-8 max-w-2xl text-ink-sub text-sm md:text-lg font-light leading-relaxed opacity-0 animate-fade-in-up"
        style={{ animationDelay: '200ms' }}
      >
        {clientsIntro.body}
      </p>
      <div
        className="mt-10 flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-in-up"
        style={{ animationDelay: '300ms' }}
      >
        <Link
          to="/diagnostic"
          className="inline-flex items-center justify-center gap-3 border border-gold bg-gold px-7 py-4 text-sm uppercase tracking-widest text-black transition-all duration-300 hover:bg-transparent hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          Start a Diagnostic
          <ArrowRight className="size-4" />
        </Link>
        <a
          href={`#${scrollTargetId}`}
          className="inline-flex items-center justify-center gap-3 border border-line px-7 py-4 text-sm uppercase tracking-widest text-ink transition-all duration-300 hover:border-gold hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          Read client stories
        </a>
      </div>
    </section>
  )
}
