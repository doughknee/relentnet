import { Link, createFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react'

import { BrandMark, BrandMarkChromatic } from '@/components/BrandMark'
import { CtaLink } from '@/components/CtaLink'
import { Eyebrow } from '@/components/Eyebrow'
import { Frame } from '@/components/Frame'
import { Reveal } from '@/components/Reveal'
import { siteConfig } from '@/site.config'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/')({
  head: () =>
    seo({
      title: siteConfig.meta.title,
      description:
        'White-glove technology partnership for owner-led businesses. Start with a workflow diagnostic, then build and steward the technology worth creating.',
      path: '/',
    }),
  component: HomeComponent,
})

export const cases = [
  {
    label: 'Cambridge',
    slug: 'cambridge-building-group',
    industry: 'Commercial construction',
    headline: 'Invoices that file themselves.',
    outcome:
      'A credibility-first front door, plus an AP pipeline that reads vendor invoices, routes PM approval, and posts them to QuickBooks — PDF and project attached.',
    statValue: 'Email → QBO',
    statDesc: 'Hands-off invoice pipeline across hundreds of active projects.',
    image: '/case-studies/cambridge-building-group/hero.webp',
    imageAlt: 'Cambridge Building Group site and AP portal',
    // PLACEHOLDER quote — swap for Jason Hall's real words before ship (REL-92).
    quote:
      'Invoices used to eat my Fridays. Now they land in QuickBooks with the PDF attached, and all I do is approve.',
    quoteAttribution: 'Jason Hall — Cambridge Building Group',
  },
  {
    label: 'Scrollr',
    slug: 'scrollr',
    industry: 'Consumer software',
    headline: 'From brittle extension to real product.',
    outcome:
      'A complete rebuild: native desktop app, decoupled architecture, and a plugin model that lets new data sources ship without touching the core.',
    statValue: '1 → 3',
    statDesc:
      'One Chrome extension became native apps on macOS, Windows, and Linux.',
    image: '/case-studies/scrollr/hero-sports-dark.webp',
    imageAlt: 'Scrollr desktop ticker',
  },
  {
    label: 'CourtCommand',
    slug: 'courtcommand',
    industry: 'Sports technology',
    headline: 'Live pickleball, one operating layer.',
    outcome:
      'Tournaments, leagues, live scoring, and broadcast overlays on a Go + Redis core built to stay in sync under game-day pressure.',
    statValue: '170+',
    statDesc: 'API endpoints behind brackets, scoring, and broadcast graphics.',
    image: '/case-studies/courtcommand/hero.webp',
    imageAlt: 'CourtCommand tournament platform',
  },
  {
    label: 'VM Homes',
    slug: 'vm-homes',
    industry: 'Real estate',
    headline: 'A storefront that earns trust quietly.',
    outcome:
      'Premium buyer experience with live MLS inventory inside the brand — no bouncing buyers to a generic portal.',
    statValue: '6 markets',
    statDesc:
      'MLS-synced search across Tampa Bay, from downtown St. Pete to the Gulf beaches.',
    image: '/case-studies/vm-homes/hero.webp',
    imageAlt: 'VM Homes property search',
  },
] as const

export const steps = [
  {
    num: 'i.',
    title: 'Diagnose',
    description:
      'A free diagnostic maps how work actually moves through your business — and where it stalls.',
    note: 'Deliverable: workflow map + priority list',
  },
  {
    num: 'ii.',
    title: 'Build',
    description:
      'If software is the answer, we design and build it. If it isn’t, we say so — connect, simplify, or don’t build.',
    note: 'Deliverable: the system, or the no-build case',
  },
  {
    num: 'iii.',
    title: 'Steward',
    description:
      'We host, monitor, secure, and keep improving what we build. You talk to the people who wrote the code.',
    note: 'Ongoing: hosting, support, iteration',
  },
] as const

const pains = [
  'Spreadsheet chaos',
  'Missed follow-ups',
  'Disconnected software',
  'Slow admin work',
  'Unclear reporting',
  'Communication gaps',
] as const

export const marqueeItems = [
  ...pains,
  'Lead intake',
  'Manual handoffs',
] as const

export const premise = {
  intro:
    'The diagnostic is free. It’s how we show you the way we think — and if software isn’t the answer, we’ll say so and you keep the map.',
  answers: [
    {
      num: 'Answer 01',
      title: 'Build',
      body: 'The workflow justifies custom software. We design it, build it, host it — and prove it earns its place.',
    },
    {
      num: 'Answer 02',
      title: 'Connect',
      body: 'The tools you already pay for can cover it. They’ve just never been wired together properly. We do the wiring.',
    },
    {
      num: 'Answer 03',
      title: 'Don’t build yet',
      body: 'The honest answer, more often than you’d think. You keep the workflow map. You skip the invoice for a build.',
      emphasized: true,
    },
  ],
} as const

const stats = [
  {
    label: 'Scrollr',
    value: '1 → 3',
    description:
      'Scrollr rebuilt from one brittle Chrome extension into native apps on three platforms.',
  },
  {
    label: 'Cambridge',
    value: 'Email → QBO',
    description:
      'Cambridge’s vendor invoices flow to QuickBooks with zero manual entry.',
  },
  {
    label: 'CourtCommand',
    value: '170+',
    description: 'API endpoints on CourtCommand’s real-time tournament core.',
  },
  {
    label: 'VM Homes',
    value: '6 markets',
    description: 'Live MLS search across Tampa Bay for VM Homes.',
  },
] as const

/**
 * Chromatic mark behind the hero's right side, dark theme + ≥640px only.
 * Anchored to the 1200px content column (not the viewport) so it hugs the
 * headline on ultrawide monitors instead of drifting to the screen edge.
 */
function HeroGhostMark() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 1000], [0, 140], { clamp: false })

  return (
    <motion.div
      style={{ y }}
      aria-hidden="true"
      className="hidden min-[640px]:dark:block absolute top-10 -right-40 w-[clamp(300px,30vw,500px)] opacity-40 pointer-events-none [mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_50%,rgba(0,0,0,0)_86%)]"
    >
      {/* Nested masks multiply: fade left (into the headline) + fade bottom
          (dissolve before the ticker instead of getting sliced by it).
          The slow bloom keeps the mark from popping in at full strength
          while the headline is still fading up. */}
      <div
        className="animate-fade-in [mask-image:linear-gradient(to_left,rgba(0,0,0,1)_45%,rgba(0,0,0,0)_90%)]"
        style={{ animationDuration: '1.6s', animationDelay: '250ms' }}
      >
        <BrandMarkChromatic className="w-full h-auto" />
      </div>
    </motion.div>
  )
}

function HomeComponent() {
  const [activeTab, setActiveTab] = useState(0)
  const activeCase = cases[activeTab]

  // Warm the other case-study heroes so tab swaps never flash empty
  useEffect(() => {
    for (const c of cases) {
      const img = new Image()
      img.src = c.image
    }
  }, [])

  return (
    <div className="relative overflow-x-clip">
      {/* Radial gold glow over the top of the page. Fixed-size ellipse offset
          from center so the halo hugs the content column on any monitor. */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-[120vh] pointer-events-none bg-[radial-gradient(ellipse_760px_460px_at_calc(50%+300px)_120px,rgba(203,171,69,0.07),transparent_65%)]"
      />

      {/* ── Hero — the ticker sits flush at the section's bottom edge ── */}
      <section className="relative pt-[130px] overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-5 md:px-12 relative">
          <HeroGhostMark />
          <div className="relative">
            <Eyebrow className="animate-fade-in-up mb-9">
              Technology partner for owner-led businesses
            </Eyebrow>
            <h1
              className="animate-fade-in-up font-serif text-[clamp(42px,9vw,118px)] leading-[0.98] tracking-[-0.01em] max-w-[1150px] text-balance"
              style={{ animationDelay: '80ms' }}
            >
              Your business has outgrown its tools.{' '}
              <span className="italic text-gold-text">We fix that.</span>
            </h1>
            <div
              className="animate-fade-in-up mt-13 flex flex-col min-[768px]:flex-row min-[768px]:items-end justify-between gap-7 min-[768px]:gap-12"
              style={{ animationDelay: '200ms' }}
            >
              <p className="max-w-[460px] text-ink-sub text-lg font-light leading-[1.6]">
                One free diagnostic maps where your operation loses time. Then
                we build only what earns its place — and run it for you.
              </p>
              <div className="flex flex-wrap gap-3.5 shrink-0">
                <CtaLink to="/inquire" arrow>
                  Book a Free Diagnostic
                </CtaLink>
                <CtaLink to="/clients" variant="outline">
                  See Client Work
                </CtaLink>
              </div>
            </div>
          </div>
        </div>

        {/* Ticker marquee — full-bleed strip. Eight copies (even count keeps
            the -50% loop set-aligned) so the strip outruns viewports up to
            ~6000px wide with no gap at the seam. Border-y lives on this one
            element so both rules render and animate as part of the ticker —
            the 16px items keep the strip an integer height, so the bottom
            border can't land on a fractional row and rasterize away. */}
        {/* No entrance fade — the strip renders bounded immediately; its
            scroll is its own motion. A late stagger here reads as the bottom
            border "arriving" after the rest of the page. */}
        <div className="relative mt-20 bg-page border-y border-line">
          <div className="flex">
            {/* Ticker label — the strip's clipped viewport starts at its right
                edge, so the loop begins on a phrase boundary at first paint */}
            <span className="hidden min-[768px]:flex items-center shrink-0 bg-page px-5 md:px-12 font-mono text-[11px] tracking-[0.26em] uppercase text-gold-text font-medium border-r border-line-faint">
              What we fix
            </span>
            <div className="relative flex-1 overflow-hidden">
              <div
                className="flex w-max animate-marquee"
                style={{ animationDuration: '200s' }}
              >
                {[0, 1, 2, 3, 4, 5, 6, 7].flatMap((copy) =>
                  marqueeItems.map((item, i) => (
                    <span
                      key={`${copy}-${i}`}
                      className="inline-flex items-center gap-8 py-4 pr-4"
                      aria-hidden={copy > 0}
                    >
                      <span className="font-mono text-base tracking-[0.26em] uppercase text-ink-sub whitespace-nowrap">
                        {item}
                      </span>
                      <span
                        aria-hidden="true"
                        className="w-1.5 h-1.5 bg-gold rotate-45 shrink-0"
                      />
                    </span>
                  )),
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── The premise — the ticker's bottom hairline is the divider ── */}
      <section>
        <div className="max-w-[1200px] mx-auto px-5 md:px-12 py-18">
          <Reveal>
            <Eyebrow className="mb-5">01 · The premise</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="font-serif text-[clamp(30px,4.2vw,52px)] leading-[1.05] max-w-[640px]">
              Every diagnostic ends in one of three answers.
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 text-[15px] font-light leading-[1.65] text-ink-sub max-w-[520px]">
              {premise.intro}
            </p>
          </Reveal>
          <div className="mt-14 grid grid-cols-1 min-[768px]:grid-cols-3 gap-px p-0.5 bg-line">
            {premise.answers.map((a, i) => (
              <Reveal
                key={a.title}
                delay={i * 150}
                className={`${
                  'emphasized' in a && a.emphasized
                    ? 'bg-inset border-t-2 border-gold'
                    : 'bg-page border-t-2 border-transparent'
                } pt-10 px-7 min-[768px]:px-10 pb-11`}
              >
                <p className="font-mono text-[10px] tracking-[0.26em] uppercase text-gold-text font-medium">
                  {a.num}
                </p>
                <h3 className="font-serif text-[32px] mt-4 mb-3">{a.title}</h3>
                <p className="text-[15px] font-light leading-[1.65] text-ink-sub">
                  {a.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Client work (tabbed) ── */}
      <section>
        <div className="max-w-[1200px] mx-auto px-5 md:px-12 py-18">
          <div className="flex items-end justify-between gap-8 mb-14 flex-wrap">
            <div>
              <Reveal>
                <Eyebrow className="mb-5">02 · Client work</Eyebrow>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="font-serif text-[clamp(30px,4.2vw,52px)] leading-[1.05]">
                  Systems that earned their place.
                </h2>
              </Reveal>
            </div>
            <Reveal delay={160}>
              <div role="group" className="flex gap-2 flex-wrap">
                {cases.map((c, i) => (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => setActiveTab(i)}
                    className={`font-mono text-[11px] tracking-[0.14em] uppercase px-[18px] py-[11px] cursor-pointer transition-all duration-200 border whitespace-nowrap ${
                      i === activeTab
                        ? 'border-gold bg-gold-tint text-gold-text'
                        : 'border-line bg-transparent text-ink-muted'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 min-[1024px]:grid-cols-[5fr_7fr] gap-12 min-[1024px]:gap-18 items-center">
            <div>
              <p className="font-mono text-[11px] tracking-[0.26em] uppercase text-ink-faint font-medium mb-[18px]">
                {activeCase.industry}
              </p>
              <h3 className="font-serif text-[clamp(32px,3.6vw,46px)] leading-[1.05] mb-[22px]">
                {activeCase.headline}
              </h3>
              <p className="text-ink-sub font-light leading-[1.65] mb-8 max-w-[400px]">
                {activeCase.outcome}
              </p>
              <div className="border-l border-line pl-6 mb-8">
                <p className="font-serif text-[40px] leading-none text-gold-text">
                  {activeCase.statValue}
                </p>
                <p className="mt-2.5 text-[13px] text-ink-sub max-w-[340px]">
                  {activeCase.statDesc}
                </p>
              </div>
              <Link
                to="/clients/$slug"
                params={{ slug: activeCase.slug }}
                className="inline-flex items-center gap-2.5 font-mono text-[11px] tracking-[0.15em] uppercase text-gold-text transition-all hover:gap-4"
              >
                Read the case study →
              </Link>
            </div>
            <Frame caption={`Fig. 0${activeTab + 1} — ${activeCase.label}`}>
              {/* True crossfade: outgoing image fades while the incoming one
                  fades in over it. The wrapper owns the aspect ratio so the
                  layout never jumps mid-swap. */}
              <div className="relative aspect-[16/10]">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={activeCase.slug}
                    role="img"
                    aria-label={activeCase.imageAlt}
                    className="absolute inset-0 bg-cover bg-top transition-transform duration-800 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.03]"
                    style={{ backgroundImage: `url('${activeCase.image}')` }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />
                </AnimatePresence>
              </div>
            </Frame>
          </div>

          {'quote' in activeCase && (
            <Reveal delay={100} className="mt-12 max-w-[680px]">
              <blockquote className="font-serif italic text-[24px] leading-[1.45] text-ink">
                &ldquo;{activeCase.quote}&rdquo;
              </blockquote>
              <p className="mt-4 font-mono text-[11px] tracking-[0.25em] uppercase text-ink/65">
                {activeCase.quoteAttribution}
              </p>
            </Reveal>
          )}
        </div>
      </section>

      {/* ── Who you'll work with ── */}
      <section>
        <div className="max-w-[1200px] mx-auto px-5 md:px-12 py-18 grid grid-cols-1 min-[1024px]:grid-cols-[340px_1fr] gap-12 min-[1024px]:gap-18 items-center">
          <Reveal>
            <Frame className="w-fit" caption="Fig. 05 — The builders">
              <img
                src="/founder-photo.webp"
                alt="The RelentNet founder"
                width={320}
                height={380}
                className="block w-[320px] h-[380px] max-w-full object-cover transition-transform duration-800 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.03]"
              />
            </Frame>
          </Reveal>
          <div>
            <Reveal delay={80}>
              <Eyebrow className="mb-5">03 · Who you'll work with</Eyebrow>
            </Reveal>
            <Reveal delay={160}>
              <h2 className="font-serif text-[clamp(30px,4.2vw,52px)] leading-[1.05] mb-6">
                No account managers.{' '}
                <span className="italic text-gold-text">
                  Just the builders.
                </span>
              </h2>
            </Reveal>
            <Reveal delay={240}>
              <p className="text-ink-sub font-light leading-[1.65] mb-7 max-w-[560px]">
                When you call RelentNet, you talk to the people who design,
                build, host, and monitor your system — before the diagnostic and
                long after launch.
              </p>
            </Reveal>
            <Reveal delay={320}>
              <p className="font-mono text-xs tracking-[0.1em] text-ink-muted">
                <a href="tel:+17276161060" className="text-gold-text">
                  727-616-1060
                </a>{' '}
                ·{' '}
                <a
                  href="mailto:inquires@relentnet.com"
                  className="text-gold-text"
                >
                  inquires@relentnet.com
                </a>{' '}
                · Nashville, TN
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── How it works — numbered flow, deliberately lighter than the
          premise grid ── */}
      <section>
        <div className="max-w-[1200px] mx-auto px-5 md:px-12 py-18">
          <Reveal>
            <Eyebrow className="mb-14">04 · How it works</Eyebrow>
          </Reveal>
          <div className="flex flex-col min-[768px]:flex-row min-[768px]:items-start gap-10">
            {steps.map((step, i) => (
              <Fragment key={step.title}>
                {i > 0 && (
                  <div
                    aria-hidden="true"
                    className="hidden min-[768px]:block shrink-0 w-12 h-px bg-line mt-3.5"
                  />
                )}
                <Reveal delay={i * 150} className="flex-1">
                  <span className="font-serif italic text-xl text-gold-text">
                    {step.num}
                  </span>
                  <h3 className="font-serif text-[38px] mt-3 mb-3.5">
                    {step.title}
                  </h3>
                  <p className="text-[15px] font-light leading-[1.65] text-ink-sub">
                    {step.description}
                  </p>
                  <p className="mt-5 text-xs tracking-[0.08em] uppercase text-ink-sub">
                    {step.note}
                  </p>
                </Reveal>
              </Fragment>
            ))}
          </div>
          <Reveal delay={450}>
            <p className="mt-7 text-right">
              <Link
                to="/process"
                className="text-xs uppercase tracking-[0.15em] text-ink-muted transition-colors duration-300 hover:text-gold-text"
              >
                The full five-phase process →
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Stats ── */}
      <section>
        <div className="max-w-[1200px] mx-auto px-5 md:px-12 py-18">
          <Reveal>
            <Eyebrow className="mb-14">05 · The numbers</Eyebrow>
          </Reveal>
          <dl className="grid grid-cols-1 min-[768px]:grid-cols-2 gap-px p-0.5 bg-line">
            {stats.map((stat, i) => (
              <Reveal
                key={stat.value}
                delay={i * 100}
                className="bg-page p-8 min-[768px]:p-10"
              >
                <p className="font-mono text-[10px] tracking-[0.26em] uppercase text-gold-text font-medium">
                  {stat.label}
                </p>
                <dd className="mt-4 font-serif text-[clamp(44px,4.5vw,64px)] text-ink-em leading-none whitespace-nowrap">
                  {stat.value}
                </dd>
                <dt className="mt-2 text-[15px] font-light text-ink-sub leading-[1.6] max-w-[400px]">
                  {stat.description}
                </dt>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <section className="relative">
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_700px_500px_at_50%_100%,rgba(203,171,69,0.08),transparent_70%)]"
        />
        <div className="max-w-[1200px] mx-auto px-5 md:px-12 py-32 text-center relative">
          <Reveal>
            <div className="mx-auto mb-9 w-[76px]">
              <BrandMarkChromatic
                className="hidden dark:block w-full h-auto"
                aria-hidden="true"
              />
              <BrandMark
                className="dark:hidden w-full h-auto text-gold-text"
                aria-hidden="true"
              />
            </div>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="font-serif text-[clamp(34px,6.2vw,76px)] leading-[1.05] text-balance">
              Start with the workflow.
              <br />
              <span className="italic text-gold-text">
                Build only what earns its place.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <div className="mt-12 flex flex-wrap justify-center gap-3.5">
              <CtaLink to="/inquire" arrow>
                Book a Free Diagnostic
              </CtaLink>
            </div>
          </Reveal>
          <Reveal delay={250}>
            <p className="mt-9 text-[13px] text-ink-sub">
              No fee. No obligation. A clear build / connect / don't-build
              answer.
              <br />
              Prefer to talk?{' '}
              <a href="tel:+17276161060" className="text-gold-text">
                727-616-1060
              </a>{' '}
              ·{' '}
              <a
                href="mailto:inquires@relentnet.com"
                className="text-gold-text"
              >
                inquires@relentnet.com
              </a>
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
