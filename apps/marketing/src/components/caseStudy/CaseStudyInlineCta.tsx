import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

/**
 * Detail-page inline CTA between stats and the narrative. Single H3 + button.
 * Mirrors Stripe /customers/figma's mid-page "Ready to get started?" block.
 */
export function CaseStudyInlineCta() {
  return (
    <section className="relative z-10 px-6 md:px-12 py-12 border-t border-line-faint">
      <div className="max-w-3xl">
        <h3 className="font-serif text-2xl md:text-3xl mb-6">
          Ready to diagnose your friction?
        </h3>
        <Link
          to="/diagnostic"
          className="inline-flex items-center justify-center gap-3 border border-gold bg-gold px-7 py-4 text-sm uppercase tracking-widest text-black transition-all duration-300 hover:bg-transparent hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          Start a Diagnostic
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  )
}
