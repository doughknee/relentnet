import { Link, createFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'
import { AnimateNumber } from 'motion-plus/react'

import { BrandMark, BrandMarkChromatic } from '@/components/BrandMark'
import { CtaLink } from '@/components/CtaLink'
import { Eyebrow } from '@/components/Eyebrow'
import { Frame } from '@/components/Frame'
import { Reveal } from '@/components/Reveal'
import { TiltCard } from '@/components/TiltCard'
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
      'A credibility-first front door, plus an AP pipeline that reads vendor invoices, routes PM approval, and posts them to QuickBooks with the PDF and project attached.',
    statValue: 'Email → QBO',
    statDesc: 'Hands-off invoice pipeline across hundreds of active projects.',
    image: '/case-studies/cambridge-building-group/hero.webp',
    imageAlt: 'Cambridge Building Group site and AP portal',
    // PLACEHOLDER quote — swap for Jason Hall's real words before ship (REL-92).
    quote:
      'Invoices used to eat my Fridays. Now they land in QuickBooks with the PDF attached, and all I do is approve.',
    quoteAttribution: 'Jason Hall · Cambridge Building Group',
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
      'Premium buyer experience with live MLS inventory inside the brand, so buyers never get bounced to a generic portal.',
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
      'A free diagnostic maps how work actually moves through your business, and where it stalls.',
    note: 'Deliverable: workflow map + priority list',
  },
  {
    num: 'ii.',
    title: 'Build',
    description:
      'If software is the answer, we design and build it. If it isn’t, we say so: connect, simplify, or don’t build.',
    note: 'Deliverable: the system, or the no-build case',
  },
  {
    num: 'iii.',
    title: 'Steward',
    description:
      'We host, monitor, secure, and keep improving what we build.',
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
    'The diagnostic is free. It’s how we show you the way we think. If software isn’t the answer, we’ll say so, and you keep the map.',
  answers: [
    {
      num: 'Answer 01',
      title: 'Build',
      body: 'The workflow justifies custom software. We design it, build it, host it, and prove it earns its place.',
    },
    {
      num: 'Answer 02',
      title: 'Connect',
      body: 'The tools you already pay for can cover it. They’ve just never been wired together properly. We do the wiring.',
    },
    {
      num: 'Answer 03 · No invoice',
      title: 'Don’t build yet',
      body: 'The honest answer, more often than you’d think. You keep the workflow map, and you skip the invoice.',
      emphasized: true,
    },
  ],
} as const

/** The figure the section leads on: the one that measures delivered value. */
export const heroStat = {
  label: 'Hours of admin automated',
  value: 10000,
  suffix: '+',
  description:
    'Invoice filing, follow-ups, and handoffs: manual work now handled by systems we run.',
} as const

/**
 * Supporting figures, read as a spec panel rather than as rivals to the hero
 * number. Tenure is deliberately not a numeral: "4" next to "10,000+" invites
 * a comparison it can only lose, while the same fact stated as a date reads as
 * provenance.
 */
export const stats = [
  {
    label: 'Uptime across hosted systems',
    value: 99.99,
    suffix: '%',
    // Two digits, or 99.99 rounds to a "100.0%" that claims perfect uptime.
    format: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
    description:
      'We host, monitor, and answer for everything we build, around the clock.',
  },
  {
    label: 'Clients served',
    value: 40,
    suffix: '+',
    description:
      'Owner-led businesses across construction, real estate, sports tech, and consumer software.',
  },
  {
    label: 'In business',
    value: 'Since 2022',
    description:
      'Building, hosting, and stewarding for owner-led businesses.',
  },
] as const

/** The brand ease, matching every other entrance on the site. */
const EASE = [0.2, 0.8, 0.2, 1] as const

/**
 * Scroll-in counter for a stat: Motion+ AnimateNumber on its defaults, with
 * no transition, trend or format tuning of our own.
 *
 * Wrapped the way Motion's own Number counter example wraps it: a LayoutGroup
 * around a `layout` container. Counting to 10,000 adds four digit columns, and
 * without the layout animation the element's width jumps each time one lands.
 * The wrapper animates that width instead, so the reels and the box they sit
 * in move together.
 *
 * The only other thing around it is the trigger. The prerendered HTML carries
 * the FINAL value, so crawlers and no-JS readers never see a 0; after
 * hydration a stat still below the fold drops to zero offscreen and counts up
 * on first view. Reduced motion never leaves the final value.
 */
function StatValue({
  value,
  suffix,
  format,
}: {
  value: number
  suffix?: string
  format?: React.ComponentProps<typeof AnimateNumber>['format']
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const reducedMotion = useReducedMotion()
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])

  const shown = !hydrated || reducedMotion || inView

  return (
    <LayoutGroup>
      <motion.span
        ref={ref}
        layout
        className="inline-flex items-baseline whitespace-nowrap"
      >
        <AnimateNumber format={format} className="tabular-nums">
          {shown ? value : 0}
        </AnimateNumber>
        {suffix ? <span className="text-gold-text">{suffix}</span> : null}
      </motion.span>
    </LayoutGroup>
  )
}

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

/**
 * Case-panel swap. The outgoing panel fades as a block, then the incoming
 * lines cascade in, so the copy changes with the same deliberateness as the
 * screenshot crossfading beside it instead of hard-cutting.
 */
const panelVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
  exit: { opacity: 0, transition: { duration: 0.16, ease: 'easeIn' } },
} as const

const panelLine = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
} as const

/**
 * Which tab a key press moves to, per the ARIA tabs pattern: arrows step and
 * wrap at both ends, Home/End jump to the ends, anything else is not ours to
 * handle (returns null so the event keeps its default behaviour).
 */
export function nextTabIndex(
  key: string,
  current: number,
  count: number,
): number | null {
  const last = count - 1
  if (key === 'ArrowRight') return current === last ? 0 : current + 1
  if (key === 'ArrowLeft') return current === 0 ? last : current - 1
  if (key === 'Home') return 0
  if (key === 'End') return last
  return null
}

/**
 * Drafting dimension rule for the portrait: the measurement line you'd find
 * beside a figure on a technical drawing, drawn top to bottom as the section
 * arrives. Decorative, so it carries no label — a plausible-looking
 * measurement would be inventing data. Only shown once the two-column layout
 * has a gutter wide enough to hold it.
 */
function DimensionRule() {
  const tick = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, amount: 0.5 },
    transition: { duration: 0.4, ease: EASE, delay: 0.75 },
  } as const

  return (
    <span
      aria-hidden="true"
      className="hidden min-[1024px]:block absolute inset-y-0 -right-9 w-2"
    >
      <motion.span
        className="absolute left-1/2 inset-y-0 w-px bg-gold-deep origin-top"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
      />
      <motion.span
        className="absolute inset-x-0 top-0 h-px bg-gold-deep"
        {...tick}
      />
      <motion.span
        className="absolute inset-x-0 bottom-0 h-px bg-gold-deep"
        {...tick}
      />
    </span>
  )
}

/**
 * The process axis: a drafting rule spanning the three stations, drawing left
 * to right as the section arrives with a tick dropping at each step, so the
 * flow reads as a sequence rather than three simultaneous fades.
 *
 * The tick row mirrors the steps row's flex geometry exactly (same `flex-1`,
 * same gap), so ticks land on each column's leading edge without hard-coded
 * percentages that would drift if the step count changed. The right end is
 * deliberately left open: stewardship is ongoing, so the axis should not
 * terminate.
 *
 * Decorative. The numerals and headings carry the order for assistive tech.
 */
function ProcessAxis({ count }: { count: number }) {
  return (
    <div
      aria-hidden="true"
      className="hidden min-[768px]:block relative h-2 mb-10"
    >
      <motion.div
        className="absolute inset-x-0 top-0 h-px bg-line origin-left"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1, ease: EASE }}
      />
      <div className="absolute inset-0 flex gap-10">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="flex-1 relative">
            <motion.span
              className="absolute left-0 top-0 w-px h-2 bg-gold-deep origin-top"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              // Each tick lands as the drawing line reaches its station.
              transition={{ duration: 0.3, ease: EASE, delay: i * 0.33 }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

function HomeComponent() {
  const [activeTab, setActiveTab] = useState(0)
  const activeCase = cases[activeTab]
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  // Portrait parallax. Scroll-linked styles bypass the root MotionConfig, so
  // reduced motion is gated by hand; the hydration gate keeps the prerendered
  // HTML from baking in an offset transform. Deliberately unsprung — smoothing
  // a scroll-driven transform makes the page feel like it is catching up.
  const buildersRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  const { scrollYProgress: buildersProgress } = useScroll({
    target: buildersRef,
    offset: ['start end', 'end start'],
  })
  // Drifts DOWN as the page scrolls up, so it lags the text beside it.
  const photoY = useTransform(buildersProgress, [0, 1], [-24, 24])
  const parallax = hydrated && !reducedMotion

  /** Roving tabindex: selection follows focus, so moving also moves focus. */
  function onTabKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const next = nextTabIndex(event.key, activeTab, cases.length)
    if (next === null) return
    event.preventDefault()
    setActiveTab(next)
    tabRefs.current[next]?.focus()
  }

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
                we build only what earns its place, and we run it for you.
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
          {/* Separated cards, not the butted hairline grid used elsewhere —
              a tilting surface needs air around it to lean into. */}
          <div className="mt-14 grid grid-cols-1 min-[768px]:grid-cols-3 gap-5">
            {premise.answers.map((a, i) => (
              // The emphasized card is marked by the gold top rule alone.
              // bg-inset recedes in dark theme (it's a deeper black), which
              // fought the emphasis once the cards stopped being butted
              // together — and the "No invoice" tag now says the quiet part out
              // loud, so the surface doesn't need to shout.
              <Reveal key={a.title} delay={i * 120} className="h-full">
                <TiltCard
                  // chromatic-hover is the reduced-motion/touch fallback: the
                  // static gold offset only lands when TiltCard leaves `style`
                  // undefined, since an inline box-shadow outranks it. No CSS
                  // transition here — it would smear Motion's per-frame writes.
                  className={`chromatic-hover h-full pt-10 px-7 min-[768px]:px-10 pb-11 bg-page border border-line ${
                    'emphasized' in a && a.emphasized
                      ? 'border-t-2 border-t-gold'
                      : ''
                  }`}
                >
                  <p className="font-mono text-[10px] tracking-[0.26em] uppercase text-gold-text font-medium">
                    {a.num}
                  </p>
                  <h3 className="font-serif text-[32px] mt-4 mb-3">{a.title}</h3>
                  <p className="text-[15px] font-light leading-[1.65] text-ink-sub">
                    {a.body}
                  </p>
                </TiltCard>
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
              <div
                role="tablist"
                aria-label="Client case studies"
                onKeyDown={onTabKeyDown}
                className="flex gap-2 flex-wrap"
              >
                {cases.map((c, i) => {
                  const selected = i === activeTab
                  return (
                    <button
                      key={c.slug}
                      ref={(el) => {
                        tabRefs.current[i] = el
                      }}
                      type="button"
                      role="tab"
                      id={`case-tab-${c.slug}`}
                      aria-selected={selected}
                      aria-controls="case-panel"
                      tabIndex={selected ? 0 : -1}
                      onClick={() => setActiveTab(i)}
                      className={`relative font-mono text-[11px] tracking-[0.14em] uppercase px-[18px] py-[11px] cursor-pointer border whitespace-nowrap transition-colors duration-200 ${
                        selected
                          ? 'border-transparent text-gold-text'
                          : 'border-line text-ink-muted hover:text-ink-sub'
                      }`}
                    >
                      {/* Shared-layout indicator: the gold state physically
                          slides between tabs rather than blinking across. */}
                      {selected && (
                        <motion.span
                          layoutId="case-tab-indicator"
                          aria-hidden="true"
                          className="absolute inset-0 border border-gold bg-gold-tint"
                          transition={{ duration: 0.4, ease: EASE }}
                        />
                      )}
                      <span className="relative">{c.label}</span>
                    </button>
                  )
                })}
              </div>
            </Reveal>
          </div>

          <div
            role="tabpanel"
            id="case-panel"
            aria-labelledby={`case-tab-${activeCase.slug}`}
            className="grid grid-cols-1 min-[1024px]:grid-cols-[5fr_7fr] gap-12 min-[1024px]:gap-18 items-center"
          >
            {/* initial={false} is load-bearing, not a nicety: without it the
                first mount starts at the hidden variant, so the prerendered
                HTML ships this copy at opacity 0 and anyone without JS (or
                any crawler) sees an empty panel. */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeCase.slug}
                variants={panelVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.p
                  variants={panelLine}
                  className="font-mono text-[11px] tracking-[0.26em] uppercase text-ink-faint font-medium mb-[18px]"
                >
                  {activeCase.industry}
                </motion.p>
                <motion.h3
                  variants={panelLine}
                  className="font-serif text-[clamp(32px,3.6vw,46px)] leading-[1.05] mb-[22px]"
                >
                  {activeCase.headline}
                </motion.h3>
                <motion.p
                  variants={panelLine}
                  className="text-ink-sub font-light leading-[1.65] mb-8 max-w-[400px]"
                >
                  {activeCase.outcome}
                </motion.p>
                <motion.div
                  variants={panelLine}
                  className="border-l border-line pl-6 mb-8"
                >
                  <p className="font-serif text-[40px] leading-none text-gold-text">
                    {activeCase.statValue}
                  </p>
                  <p className="mt-2.5 text-[13px] text-ink-sub max-w-[340px]">
                    {activeCase.statDesc}
                  </p>
                </motion.div>
                <motion.div variants={panelLine}>
                  <Link
                    to="/clients/$slug"
                    params={{ slug: activeCase.slug }}
                    className="inline-flex items-center gap-2.5 font-mono text-[11px] tracking-[0.15em] uppercase text-gold-text transition-all hover:gap-4"
                  >
                    Read the case study →
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
            <Frame
              reveal
              scrambleCaption
              caption={`Fig. 0${activeTab + 1} · ${activeCase.label}`}
            >
              {/* True crossfade: outgoing image fades while the incoming one
                  fades in over it, settling from a slight zoom so the swap
                  reads as a plate being placed. The wrapper owns the aspect
                  ratio so the layout never jumps mid-swap. */}
              <div className="relative aspect-[16/10]">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={activeCase.slug}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: EASE }}
                  >
                    {/* The CSS hover zoom keeps its own element so it never
                        fights the entrance scale for `transform`. */}
                    <div
                      role="img"
                      aria-label={activeCase.imageAlt}
                      className="w-full h-full bg-cover bg-top transition-transform duration-800 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.03]"
                      style={{ backgroundImage: `url('${activeCase.image}')` }}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </Frame>
          </div>

          {/* Only some cases carry a quote, so the section's height changes by
              ~150px between tabs. Easing that change folds it into the swap
              choreography instead of letting everything below it jump. The
              top margin lives inside the collapsing element, or it would
              persist as a gap once the height reaches 0. initial={false}
              keeps the prerendered quote at full height for crawlers. */}
          <Reveal delay={100} className="max-w-[680px]">
            <AnimatePresence initial={false} mode="wait">
              {'quote' in activeCase && (
                <motion.div
                  key={activeCase.slug}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="mt-12">
                    <blockquote className="font-serif italic text-[24px] leading-[1.45] text-ink">
                      &ldquo;{activeCase.quote}&rdquo;
                    </blockquote>
                    <p className="mt-4 font-mono text-[11px] tracking-[0.25em] uppercase text-ink/65">
                      {activeCase.quoteAttribution}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Reveal>
        </div>
      </section>

      {/* ── Who you'll work with ── */}
      <section ref={buildersRef}>
        {/* 5fr/7fr matches the client-work split, and gives the portrait real
            presence instead of the 340px thumbnail it was. The source is
            560×536, so a wider, less severe crop actually uses more of the
            photograph than the old portrait box did. */}
        <div className="max-w-[1200px] mx-auto px-5 md:px-12 py-18 grid grid-cols-1 min-[1024px]:grid-cols-[5fr_7fr] gap-12 min-[1024px]:gap-18 items-center">
          {/* The cap only bites in the single-column layout, where a full-width
              portrait would otherwise run to most of a tablet screen. */}
          <motion.div
            className="relative max-w-[480px]"
            style={parallax ? { y: photoY } : undefined}
          >
            <Reveal>
              <Frame reveal caption="Fig. 05 · The builders">
                <img
                  src="/founder-photo.webp"
                  alt="Brandon Harris and Daniel Velez setting up a livestream at a wedding"
                  width={440}
                  height={480}
                  className="block w-full aspect-[11/12] object-cover transition-transform duration-800 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.03]"
                />
              </Frame>
            </Reveal>
            <DimensionRule />
          </motion.div>
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
                build, host, and monitor your system, before the diagnostic and
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
            <Eyebrow className="mb-10">04 · How it works</Eyebrow>
          </Reveal>
          <ProcessAxis count={steps.length} />
          <div className="flex flex-col min-[768px]:flex-row min-[768px]:items-start gap-6 min-[768px]:gap-10">
            {steps.map((step, i) => (
              <Fragment key={step.title}>
                {/* The stacked layout has no axis above it, so a vertical rule
                    carries the sequence to phones, where it previously read as
                    three unconnected blocks. */}
                {i > 0 && (
                  <motion.div
                    aria-hidden="true"
                    className="min-[768px]:hidden shrink-0 w-px h-8 bg-line origin-top"
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, ease: EASE }}
                  />
                )}
                {/* Timed so each step lands just after the axis tick above it. */}
                <Reveal delay={80 + i * 330} className="flex-1">
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
          {/* A drafting title block, not a dashboard. Four equal tiles asked
              the reader to compare quantities that measure entirely different
              things, which is what made the smaller ones look weak; giving one
              figure the weight lets the rest read as specification. One motion
              beat for the whole plate while the numbers roll. */}
          <Reveal delay={100}>
            <div className="border border-line bg-page grid grid-cols-1 min-[900px]:grid-cols-[7fr_5fr]">
              {/* Centred rather than top-aligned: the spec column is the taller
                  of the two, so a top-aligned hero left a slab of dead space
                  under its description. */}
              <div className="flex flex-col justify-center p-8 min-[768px]:p-10 border-b min-[900px]:border-b-0 min-[900px]:border-r border-line">
                <p className="font-mono text-[12px] tracking-[0.22em] uppercase text-gold-text font-medium">
                  {heroStat.label}
                </p>
                <p className="mt-7 font-serif text-[clamp(58px,8vw,116px)] leading-[0.85] text-ink-em whitespace-nowrap">
                  <StatValue
                    value={heroStat.value}
                    suffix={heroStat.suffix}
                  />
                </p>
                <p className="mt-7 text-[15px] font-light text-ink-sub leading-[1.6] max-w-[400px]">
                  {heroStat.description}
                </p>
              </div>
              {/* flex-1 per row: the descriptions run one to three lines, so
                  natural heights spaced the rules unevenly. */}
              <dl className="flex flex-col">
                {stats.map((stat, i) => (
                  <div
                    key={stat.label}
                    className={`flex-1 grid grid-cols-[1fr_auto] content-center items-baseline gap-x-5 px-8 min-[768px]:px-10 py-7 ${
                      i > 0 ? 'border-t border-line' : ''
                    }`}
                  >
                    <dt className="font-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted">
                      {stat.label}
                    </dt>
                    <dd className="font-serif text-[clamp(26px,2.6vw,36px)] leading-none text-gold-text whitespace-nowrap text-right">
                      {typeof stat.value === 'number' ? (
                        <StatValue
                          value={stat.value}
                          suffix={'suffix' in stat ? stat.suffix : undefined}
                          format={'format' in stat ? stat.format : undefined}
                        />
                      ) : (
                        stat.value
                      )}
                    </dd>
                    <dd className="col-span-2 mt-2 text-[13px] font-light text-ink-sub leading-[1.55]">
                      {stat.description}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
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
