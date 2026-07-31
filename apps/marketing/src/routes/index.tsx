import { Link, createFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'
import { AnimateNumber } from 'motion-plus/react'

import {
  BrandMark,
  BrandMarkChromatic,
  MARK_PATH,
  PLATE_ECHO,
  PLATE_GHOST,
} from '@/components/BrandMark'
import { CtaLink } from '@/components/CtaLink'
import { Eyebrow } from '@/components/Eyebrow'
import { Frame } from '@/components/Frame'
import { Reveal } from '@/components/Reveal'
import { TiltCard } from '@/components/TiltCard'
import { siteConfig } from '@/site.config'
import { makeCountEase } from '@/lib/countEase'
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
 * number. Tenure is stated as a date rather than as a duration: "4" next to
 * "10,000+" invites a comparison it can only lose, while a year reads as
 * provenance. It still counts, because a row that arrives finished while the
 * other three are climbing looks like it failed to start.
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
    prefix: 'Since ',
    value: 2022,
    // A year, so no thousands separator. Decimals pinned off for the same
    // reason as everywhere else: the climb feeds raw floats.
    format: { useGrouping: false, maximumFractionDigits: 0 },
    description:
      'Building, hosting, and stewarding for owner-led businesses.',
  },
] as const

/** The section reads as one ledger, with the hero simply the first row. */
export const ledger = [heroStat, ...stats] as const

/**
 * The title block at the foot of the sheet. Label over value, the way a
 * drawing carries its own contact details.
 *
 * Fee is a cell rather than a sentence because it answers the question a
 * reader actually has at this point, and a ruled plate is a more credible
 * place to answer it than a line of fine print.
 */
export const signOff: ReadonlyArray<{
  label: string
  value: string
  href?: string
}> = [
  { label: 'Telephone', value: '727-616-1060', href: 'tel:+17276161060' },
  {
    label: 'Email',
    value: 'inquires@relentnet.com',
    href: 'mailto:inquires@relentnet.com',
  },
  { label: 'Fee', value: 'None' },
]

/** The brand ease, matching every other entrance on the site. */
const EASE = [0.2, 0.8, 0.2, 1] as const

/** Whole numbers unless a stat asks otherwise. Module-level so the object
 *  identity is stable across renders. */
const DEFAULT_NUMBER_FORMAT = { maximumFractionDigits: 0 } as const

/**
 * Reel timing, from Brandon's test harness. Deliberately tiny: each digit
 * change has to LAND before the next value arrives. Every earlier attempt here
 * used spins of 0.25s or more against a ~90ms feed, so the reels were
 * permanently mid-flight and never resolved, which is what read as mush.
 *
 * Trimmed from Brandon's 0.07 once the closing increments grew long enough to
 * hold their own. The middle of the climb is the busiest part of the feed, and
 * the crisper each tick lands there the more the slow ending stands out.
 */
const REEL_TRANSITION = {
  layout: { duration: 0.055 },
  opacity: { duration: 0.04, ease: 'linear' },
  y: { type: 'spring', visualDuration: 0.05, bounce: 0.05 },
} as const

/**
 * Reel timing for the closing carry alone, at the headline figure's pace.
 * Scaled per figure by `duration` in StatValue, since a supporting stat on a
 * shorter clock has a proportionally shorter final increment to fill.
 *
 * makeCountEase gives that increment 765ms of the 4.8s, and at the fast reel
 * above the digits just snapped into place and the row sat waiting. The spring
 * here runs slightly LONGER than the increment on purpose, so the four nines
 * are still rolling over as the count expires rather than landing early and
 * leaving a beat of stillness at the end.
 *
 * Only the final carry gets this. `closing` flips when the raw climb passes
 * 9,999, but Intl rounds, so the figure does not re-render as 10,000 until the
 * climb passes 9,999.5: the 9,998 to 9,999 change ahead of it still takes the
 * fast reel and cannot smear into this one.
 *
 * No bounce at all. Every other reel change is one column moving a notch, but
 * this one is four nines rolling to zero with a 1 arriving in front, and the
 * brand's no-overshoot rule is least negotiable on the figure people remember.
 */
const FINAL_REEL = {
  layout: 0.6,
  opacity: 0.4,
  y: 0.85,
} as const

/** How often the climbing value is handed to the reels, in ms. */
const DIGIT_UPDATE_MS = 90

/** Total count time in seconds for the headline figure, split evenly by
 *  makeCountEase: 2.4s to climb as far as 9,992, then 2.4s on the last eight
 *  increments. */
export const COUNT_DURATION = 4.8

/** The supporting figures run the identical curve on a shorter clock. They are
 *  read after the headline and carry less, so holding them at its pace made
 *  the section feel slow rather than deliberate. Same shape, same eight-step
 *  ending, five eighths of the time. */
export const SUPPORTING_COUNT_DURATION = 3

/**
 * Scroll-in counter for a stat.
 *
 * A motion value climbs to the target, and its changes are handed to the reels
 * on a throttle. The reels then run FAST (see REEL_TRANSITION), so each digit
 * resolves before the next value lands. That pairing is the whole trick: the
 * climb supplies distance for every column to travel, and the quick reels keep
 * the motion legible instead of smearing.
 *
 * The closing carry is the exception and swaps to a slow reel: by then the feed
 * has slowed to a crawl, so there is nothing left to outrun and the last change
 * gets to roll rather than snap. That reel is scaled by `duration`, because the
 * increment it has to fill scales with it too; a fixed 0.85s roll on a three
 * second count would still be turning well after the figure had landed.
 *
 * Each figure owns its own trigger and starts as its row reaches the fold, so
 * the four are deliberately NOT synchronised. Sharing one trigger for the
 * ledger did land them on the same frame, but it also meant the lower rows ran
 * out of sight; counting as the reader arrives is worth more than the set
 * finishing together. They still all run the same animation, which was the
 * half of that worth keeping.
 *
 * The prerendered HTML carries the FINAL value, so crawlers and no-JS readers
 * never see a 0. Reduced motion collapses the climb to a hair over zero rather
 * than branching, so the figure simply arrives.
 */
function StatValue({
  value,
  prefix,
  suffix,
  format,
  duration = COUNT_DURATION,
}: {
  value: number
  prefix?: string
  suffix?: string
  format?: React.ComponentProps<typeof AnimateNumber>['format']
  /** Seconds for the whole climb. Scales the closing reel with it. */
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const reducedMotion = useReducedMotion()
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [hydrated, setHydrated] = useState(false)
  const [display, setDisplay] = useState(value)
  const count = useMotionValue(0)
  const lastDigitUpdate = useRef(0)
  useEffect(() => setHydrated(true), [])

  const numberFormat = format ?? DEFAULT_NUMBER_FORMAT

  /* One unit in the last place the format renders, so this reads the same for
     10,000 as for 99.99. Intl ROUNDS rather than truncates, so the figure still
     shows `value - step` for a while after the raw climb passes it: flipping
     here is invisible on screen and leaves the slow spring already in place
     when the closing carry finally lands. */
  const step = 10 ** -(numberFormat.maximumFractionDigits ?? 0)
  const closing = display >= value - step

  /* The curve is built per figure, because how long the closing increments
     take is a fact about how many of them there are: 10,000 hours, 9,999
     hundredths of a percent, 40 clients. Memoised so the identity is stable,
     since it is a dependency of the effect that starts the climb. */
  const ease = useMemo(
    () => makeCountEase(Math.round(value / step)),
    [value, step],
  )

  /* Sized to the closing increment, which is a fixed share of the run, so the
     roll stays in proportion at any duration instead of outlasting the count. */
  const finalReel = useMemo(() => {
    const scale = duration / COUNT_DURATION
    return {
      layout: { duration: FINAL_REEL.layout * scale },
      opacity: { duration: FINAL_REEL.opacity * scale, ease: 'linear' as const },
      y: {
        type: 'spring' as const,
        visualDuration: FINAL_REEL.y * scale,
        bounce: 0,
      },
    }
  }, [duration])

  useMotionValueEvent(count, 'change', (latest) => {
    const now = performance.now()
    if (now - lastDigitUpdate.current < DIGIT_UPDATE_MS) return
    lastDigitUpdate.current = now
    setDisplay(latest)
  })

  // The throttle can swallow the last change, so land the exact figure.
  useMotionValueEvent(count, 'animationComplete', () => setDisplay(value))

  useEffect(() => {
    if (!hydrated) return
    if (!inView) {
      setDisplay(0)
      return
    }
    count.jump(0)
    lastDigitUpdate.current = 0
    setDisplay(0)
    const controls = animate(count, value, {
      duration: reducedMotion ? 0.01 : duration,
      ease,
    })
    return () => controls.stop()
  }, [hydrated, inView, reducedMotion, value, count, ease, duration])

  return (
    <span
      ref={ref}
      className="inline-flex items-baseline whitespace-nowrap"
    >
      {/* whitespace-pre keeps the prefix's trailing space. The parent is an
          inline-flex, so the prefix is a flex item and its trailing whitespace
          is trimmed like any other, which ran "Since" into "2022". */}
      {prefix ? <span className="whitespace-pre">{prefix}</span> : null}
      <AnimateNumber
        locales="en-US"
        format={numberFormat}
        transition={closing ? finalReel : REEL_TRANSITION}
        className="tabular-nums"
      >
        {display}
      </AnimateNumber>
      {suffix ? <span className="text-gold-text">{suffix}</span> : null}
    </span>
  )
}

/**
 * The mark coming into register, for the sign-off at the foot of the page.
 *
 * The plates start wide and pull in, which reads as the press finding its
 * registration. They settle onto the brand kit's own offsets rather than onto
 * zero: the lockup is misregistered BY DESIGN, and closing it flat would be a
 * different logo. The echo lands after the ghost, so the two arrive as two
 * events instead of one symmetrical squeeze.
 *
 * Answers the hero's mark bloom at the other end of the page. Decorative, so
 * the whole thing is aria-hidden and the prerendered spread costs nothing.
 */
function SignOffMark({ className = '' }: { className?: string }) {
  const plate = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, amount: 0.6 },
  } as const

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-15.9 -27.9 1047.8 1070.8"
      aria-hidden="true"
      className={className}
    >
      <motion.g
        {...plate}
        initial={{ x: PLATE_GHOST * 2.6, y: PLATE_GHOST * 2.6, opacity: 0 }}
        whileInView={{ x: PLATE_GHOST, y: PLATE_GHOST, opacity: 0.43 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <path d={MARK_PATH} fill="#cbab45" fillRule="evenodd" />
      </motion.g>
      <motion.g
        {...plate}
        initial={{ x: PLATE_ECHO * 2.6, y: PLATE_ECHO * 2.6, opacity: 0 }}
        whileInView={{ x: PLATE_ECHO, y: PLATE_ECHO, opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.12 }}
      >
        <path d={MARK_PATH} fill="#cbab45" fillRule="evenodd" />
      </motion.g>
      <path d={MARK_PATH} fill="#e5e5e5" fillRule="evenodd" />
    </svg>
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
          {/* A ledger, not a dashboard. Tiling four figures side by side asked
              the reader to compare quantities that measure entirely different
              things, and it cost three of them their scale. Given a row each,
              every figure gets to run large and the eye reads down a spec
              sheet instead of across a grid. Rules do the work of boxes. */}
          <dl className="border-b border-line">
            {ledger.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 90}>
                {/* Hovering runs the leader: a gold line draws from the label
                    out to the figure, a wash comes up under it, and the row
                    leans into the gesture. Bleeding the padding past the text
                    lets the wash wrap the row rather than stop at the glyphs. */}
                <div className="group relative -mx-4 min-[768px]:-mx-7 px-4 min-[768px]:px-7 border-t border-line grid grid-cols-[1fr_auto] grid-rows-[auto_1fr] gap-x-6 min-[768px]:gap-x-12 py-8 min-[768px]:py-10">
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[linear-gradient(90deg,rgba(203,171,69,0.09),rgba(203,171,69,0.02)_45%,transparent_75%)]"
                  />

                  {/* Label and description stack into one left-hand block with
                      the figure centred against it. Baseline-aligning the two
                      columns instead hung the tiny label off the figure's
                      baseline and left the top of every row empty. */}
                  <dt className="col-start-1 row-start-1 flex items-baseline gap-4 min-[768px]:gap-6 transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:translate-x-1.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">
                    <span className="font-mono text-[11px] text-gold-deep tabular-nums group-hover:text-gold-text transition-colors duration-500">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`font-mono tracking-[0.2em] uppercase transition-colors duration-500 group-hover:text-gold-text ${
                        i === 0
                          ? 'text-[12px] text-gold-text font-medium'
                          : 'text-[11px] text-ink-muted'
                      }`}
                    >
                      {stat.label}
                    </span>
                    {/* The leader: a drafting sheet runs one from the label out
                        to its value, which is exactly the gutter this layout
                        would otherwise leave empty. Faint at rest, gold on
                        hover, drawn from the label toward the figure. */}
                    <span
                      aria-hidden="true"
                      className="relative hidden min-[560px]:block flex-1 self-center h-px bg-line-faint"
                    >
                      <span className="absolute inset-0 bg-gold origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none" />
                    </span>
                  </dt>

                  {/* The hero keeps its extra weight, since one figure carrying
                      the section is what stopped the others reading as weak. */}
                  <dd
                    className={`col-start-2 row-start-1 row-span-2 self-center font-serif leading-[0.85] whitespace-nowrap text-right ${
                      i === 0
                        ? 'text-[clamp(46px,7vw,96px)] text-ink-em'
                        : 'text-[clamp(34px,4.6vw,62px)] text-gold-text'
                    }`}
                  >
                    <StatValue
                      value={stat.value}
                      prefix={'prefix' in stat ? stat.prefix : undefined}
                      suffix={'suffix' in stat ? stat.suffix : undefined}
                      format={'format' in stat ? stat.format : undefined}
                      duration={
                        i === 0 ? COUNT_DURATION : SUPPORTING_COUNT_DURATION
                      }
                    />
                  </dd>

                  {/* self-start against a 1fr track: the figure spans both rows,
                      so letting the track stretch pushed the description a
                      different distance from its label in every row. */}
                  <dd className="col-start-1 row-start-2 self-start mt-3 max-w-[560px] text-[14px] font-light text-ink-sub leading-[1.6] transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:translate-x-1.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">
                    {stat.description}
                  </dd>
                </div>
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
          <div className="mx-auto mb-9 w-[76px]">
            {/* Not wrapped in Reveal: the plates own their own entrance, and a
                Reveal transform on the parent would ride on top of it. */}
            <SignOffMark className="hidden dark:block w-full h-auto" />
            <BrandMark
              className="dark:hidden w-full h-auto text-gold-text"
              aria-hidden="true"
            />
          </div>
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
            <p className="mt-9 text-[14px] font-light text-ink-sub leading-[1.6] max-w-[520px] mx-auto">
              Booking commits you to nothing. The diagnostic ends with one of
              three answers: build, connect, or don’t build yet.
            </p>
          </Reveal>

          {/* The title block. A drawing carries its contact details in a ruled
              plate at the foot of the sheet, which is the one place on this page
              where that convention is literally true. It also gets the phone
              number and the address out of 13px fine print, where the two most
              direct ways to reach the company were the least designed things on
              the site. */}
          <Reveal delay={340}>
            <dl className="mt-14 mx-auto max-w-[720px] border border-line grid grid-cols-1 min-[560px]:grid-cols-3 text-left">
              {signOff.map((cell, i) => (
                <div
                  key={cell.label}
                  className={`chromatic-hover px-6 py-5 transition-all duration-300 ${
                    i > 0
                      ? 'border-t border-line min-[560px]:border-t-0 min-[560px]:border-l'
                      : ''
                  }`}
                >
                  <dt className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-muted">
                    {cell.label}
                  </dt>
                  <dd className="mt-2 text-[15px] text-ink-em">
                    {cell.href ? (
                      <a
                        href={cell.href}
                        className="text-gold-text transition-colors duration-300 hover:text-gold-bright"
                      >
                        {cell.value}
                      </a>
                    ) : (
                      cell.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
