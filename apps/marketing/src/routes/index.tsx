import { Link, createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Fingerprint, HeartHandshake, Shield } from 'lucide-react'

import type { LucideIcon } from 'lucide-react'

import { siteConfig } from '@/site.config'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'RelentNet | Bespoke Digital Stewardship & Legacy' },
      {
        name: 'description',
        content:
          'The sovereign antidote to the template factory. White-glove web architecture and digital legacy management for discerning founders. Secure your domain.',
      },
    ],
  }),
  component: HomeComponent,
})

/* ── Scroll-reveal hook ── */

function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null)
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return { ref, isRevealed }
}

/* ── Pillar data ── */

interface Pillar {
  title: string
  quote: string
  description: string
  icon: LucideIcon
}

const pillars: Array<Pillar> = [
  {
    title: 'Bespoke Creation',
    quote:
      'Your business is not a template. Your website should not be either.',
    description:
      'Every project begins with a blank canvas. We architect solutions tailored to your business goals, your audience, and your growth trajectory — never recycling layouts or reusing another client\u2019s work.',
    icon: Fingerprint,
  },
  {
    title: 'White-Glove Stewardship',
    quote: 'The launch is not the finish line. It\u2019s the starting line.',
    description:
      'Updates, security patches, content changes, performance monitoring — handled instantly, without you ever filing a ticket or waiting in a queue. You lead the business; we own the infrastructure.',
    icon: Shield,
  },
  {
    title: 'Personal Access',
    quote: 'We do not hide behind ticket systems.',
    description:
      'Direct lines of communication with the people who actually build and maintain your site. A phone call, an email, a handshake in the Southeast — we adapt to your preferences.',
    icon: HeartHandshake,
  },
]

/* ── Page ── */

function HomeComponent() {
  const philosophyReveal = useReveal(0.15)
  const pillarsReveal = useReveal(0.1)
  const exploreReveal = useReveal(0.1)
  const ctaReveal = useReveal(0.15)

  /* Format region pairs for display */
  const regionPairs: Array<Array<string>> = []
  for (let i = 0; i < siteConfig.regions.length; i += 2) {
    regionPairs.push(siteConfig.regions.slice(i, i + 2))
  }

  return (
    <div className="min-h-screen overflow-hidden">
      {/* ── HERO ── */}
      <section className="min-h-screen flex flex-col justify-center items-center px-6 relative">
        <h1 className="relative z-10 font-serif text-5xl md:text-7xl lg:text-9xl text-center leading-[1.1] animate-fade-in-up">
          Empower Your <br />
          <span className="italic text-gold/90">Digital Presence.</span>
        </h1>

        <div
          className="relative z-10 mt-12 max-w-lg text-center space-y-8 opacity-0 animate-fade-in-up"
          style={{ animationDelay: '200ms' }}
        >
          <p className="text-sm md:text-base text-ink-sub font-light leading-relaxed">
            Relentless dedication to the white-glove website experience. We do
            not just build; we steward your digital legacy.
          </p>

          <div className="flex justify-center gap-8 items-center pt-4">
            {regionPairs.map((pair, i) => (
              <span
                key={pair.join('-')}
                className="text-[10px] tracking-[0.3em] uppercase text-ink-muted"
              >
                {i > 0 && (
                  <span className="inline-block w-1 h-1 bg-gold rounded-full shadow-[0_0_10px_var(--color-gold)] align-middle -ml-4 mr-4" />
                )}
                {pair.join(' \u2022 ')}
              </span>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-pulse delay-1000 z-10">
          <span className="text-[10px] uppercase tracking-widest text-gold">
            Scroll
          </span>
          <div className="w-px h-12 bg-linear-to-b from-gold to-transparent" />
        </div>
      </section>

      {/* ── PHILOSOPHY ── */}
      <section
        ref={philosophyReveal.ref}
        className="relative z-10 bg-surface backdrop-blur-xs border-y border-line"
      >
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-20 md:py-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2
                className={`text-xs font-bold tracking-[0.3em] text-gold uppercase mb-6 ${
                  philosophyReveal.isRevealed
                    ? 'animate-fade-in-up'
                    : 'opacity-0'
                }`}
              >
                The Philosophy
              </h2>
              <h3
                className={`font-serif text-3xl md:text-5xl leading-tight ${
                  philosophyReveal.isRevealed
                    ? 'animate-fade-in-up'
                    : 'opacity-0'
                }`}
                style={
                  philosophyReveal.isRevealed
                    ? { animationDelay: '150ms' }
                    : undefined
                }
              >
                We sell one thing:
                <br />
                <span className="text-black/15 dark:text-white/30">
                  Peace of mind.
                </span>
              </h3>
            </div>

            <div
              className={`space-y-6 text-ink-sub font-light text-lg leading-relaxed ${
                philosophyReveal.isRevealed ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={
                philosophyReveal.isRevealed
                  ? { animationDelay: '300ms' }
                  : undefined
              }
            >
              <p>
                In a world of templates and automated responses, RelentNet
                offers the antidote:
                <strong className="text-gold font-normal">
                  {' '}
                  radical human attention.
                </strong>
              </p>
              <p>
                You provide the vision. We manage the execution, the
                infrastructure, and the growth — whether you prefer a phone
                call, an email, or a handshake in the Southeast.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PILLARS ── */}
      <section ref={pillarsReveal.ref} className="relative z-10">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-24 md:py-32">
          <h2
            className={`text-xs font-bold tracking-[0.3em] text-gold uppercase mb-16 text-center ${
              pillarsReveal.isRevealed ? 'animate-fade-in-up' : 'opacity-0'
            }`}
          >
            The Commitment
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon
              return (
                <div
                  key={pillar.title}
                  className={`group border-l border-line pl-8 hover:border-gold transition-colors duration-500 ${
                    pillarsReveal.isRevealed
                      ? 'animate-fade-in-up'
                      : 'opacity-0'
                  }`}
                  style={
                    pillarsReveal.isRevealed
                      ? { animationDelay: `${(i + 1) * 150}ms` }
                      : undefined
                  }
                >
                  <div className="w-12 h-12 rounded-lg border border-line flex items-center justify-center text-gold mb-6 group-hover:border-gold/50 transition-colors duration-500">
                    <Icon className="size-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-serif mb-3">
                    {pillar.title}
                  </h3>
                  <p className="font-serif italic text-sm text-ink-sub mb-4">
                    &ldquo;{pillar.quote}&rdquo;
                  </p>
                  <p className="text-ink-muted text-sm leading-relaxed group-hover:text-ink-sub transition-colors duration-500">
                    {pillar.description}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Conviction closing */}
          <p
            className={`mt-20 text-center font-serif italic text-lg md:text-xl text-ink-muted ${
              pillarsReveal.isRevealed ? 'animate-fade-in-up' : 'opacity-0'
            }`}
            style={
              pillarsReveal.isRevealed ? { animationDelay: '650ms' } : undefined
            }
          >
            No templates. No offshore. No ticket queues.
            <br />
            <span className="text-gold">Just relentless, human attention.</span>
          </p>
        </div>
      </section>

      {/* ── EXPLORE ── */}
      <section
        ref={exploreReveal.ref}
        className="relative z-10 bg-surface backdrop-blur-xs border-y border-line"
      >
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-24 md:py-32">
          <h2
            className={`text-xs font-bold tracking-[0.3em] text-gold uppercase mb-16 text-center ${
              exploreReveal.isRevealed ? 'animate-fade-in-up' : 'opacity-0'
            }`}
          >
            Go Deeper
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Process card */}
            <Link
              to="/process"
              className={`group relative border border-line rounded-lg p-8 md:p-10 hover:border-gold/50 transition-colors duration-500 ${
                exploreReveal.isRevealed ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={
                exploreReveal.isRevealed
                  ? { animationDelay: '150ms' }
                  : undefined
              }
            >
              <span className="text-[5rem] md:text-[6rem] font-serif text-black/[0.06] dark:text-white/[0.03] leading-none select-none absolute top-4 right-6">
                I
              </span>
              <span className="text-gold text-[10px] font-bold tracking-[0.3em] uppercase block mb-3">
                Explore
              </span>
              <h3 className="font-serif text-2xl md:text-3xl mb-4">
                The Discipline.
              </h3>
              <p className="text-ink-muted text-sm leading-relaxed mb-6 max-w-sm">
                Our rigorous four-phase methodology — from strategic discovery
                through long-term stewardship. No shortcuts, no handoffs, no
                surprises.
              </p>
              <span className="inline-flex items-center gap-2 text-sm text-gold group-hover:gap-3 transition-all duration-300">
                View our process
                <ArrowRight className="size-4" />
              </span>
            </Link>

            {/* Portfolio card */}
            <Link
              to="/portfolio"
              className={`group relative border border-line rounded-lg p-8 md:p-10 hover:border-gold/50 transition-colors duration-500 ${
                exploreReveal.isRevealed ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={
                exploreReveal.isRevealed
                  ? { animationDelay: '300ms' }
                  : undefined
              }
            >
              <span className="text-[5rem] md:text-[6rem] font-serif text-black/[0.06] dark:text-white/[0.03] leading-none select-none absolute top-4 right-6">
                II
              </span>
              <span className="text-gold text-[10px] font-bold tracking-[0.3em] uppercase block mb-3">
                Explore
              </span>
              <h3 className="font-serif text-2xl md:text-3xl mb-4">
                The Work.
              </h3>
              <p className="text-ink-muted text-sm leading-relaxed mb-6 max-w-sm">
                Live examples of bespoke digital experiences — crafted with
                intention, built without compromise. See what we build for
                clients like you.
              </p>
              <span className="inline-flex items-center gap-2 text-sm text-gold group-hover:gap-3 transition-all duration-300">
                View our portfolio
                <ArrowRight className="size-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section ref={ctaReveal.ref} className="relative z-10">
        <div className="py-32 md:py-40 flex flex-col justify-center items-center text-center px-6">
          <p
            className={`text-xs font-bold tracking-[0.3em] text-ink-muted uppercase mb-8 ${
              ctaReveal.isRevealed ? 'animate-fade-in-up' : 'opacity-0'
            }`}
          >
            Are you ready?
          </p>
          <Link
            to="/inquire"
            className={`group font-serif text-5xl md:text-8xl hover:text-gold transition-all duration-300 ${
              ctaReveal.isRevealed ? 'animate-fade-in-up' : 'opacity-0'
            }`}
            style={
              ctaReveal.isRevealed ? { animationDelay: '150ms' } : undefined
            }
          >
            Let&rsquo;s Talk.
            <ArrowRight className="inline-block ml-4 size-8 md:size-12 text-gold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </Link>
          <p
            className={`mt-8 text-ink-muted text-sm ${
              ctaReveal.isRevealed ? 'animate-fade-in-up' : 'opacity-0'
            }`}
            style={
              ctaReveal.isRevealed ? { animationDelay: '300ms' } : undefined
            }
          >
            Accepting new clients for Q1 2026.
          </p>
        </div>
      </section>
    </div>
  )
}
