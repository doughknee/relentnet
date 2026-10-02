import { render, screen, within } from '@testing-library/react'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import { FOUNDED_MONTH, FOUNDED_YEAR, founders } from './about'
import {
  COUNT_DURATION,
  Route,
  SUPPORTING_COUNT_DURATION,
  cambridgeProof,
  cases,
  heroProof,
  heroStat,
  ledger,
  marqueeItems,
  nextTabIndex,
  premise,
  stats,
  steps,
} from './index'
import { closingDoors } from '@/components/ClosingDoors'
import { testimonialExcerpt } from '@/components/HomeTestimonial'
import { makeCountEase } from '@/lib/countEase'
import { siteConfig } from '@/site.config'
import { caseStudies } from '@/data/caseStudies'
import { formatProof, proofStats } from '@/data/proof'

vi.mock('@tanstack/react-router', async () => ({
  ...(await vi.importActual('@tanstack/react-router')),
  Link: ({
    to,
    children,
    className,
  }: {
    to: string
    children: unknown
    className?: string
  }) => (
    <a href={to} className={className}>
      {children as never}
    </a>
  ),
}))

beforeAll(() => {
  // jsdom has neither; Motion's in-view triggers and the theme need both.
  class NoopObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
  }
  vi.stubGlobal('IntersectionObserver', NoopObserver)
  vi.stubGlobal('ResizeObserver', NoopObserver)
  vi.stubGlobal(
    'matchMedia',
    (query: string) =>
      ({
        matches: false,
        media: query,
        addEventListener() {},
        removeEventListener() {},
        addListener() {},
        removeListener() {},
      }) as unknown as MediaQueryList,
  )
})

const Home = Route.options.component as React.ComponentType

afterEach(() => {
  siteConfig.founders['Brandon Harris'] = {}
  siteConfig.founders['Daniel Velez'] = {}
})

/** Seconds a figure spends on its closing eight increments. Bisects the curve,
 *  which is monotonic, then scales the result by the clock it runs on. */
const closingSeconds = (value: number, duration: number) => {
  const ease = makeCountEase(value)
  let lo = 0
  let hi = 1
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2
    if (ease(mid) < (value - 8) / value) lo = mid
    else hi = mid
  }
  return (1 - (lo + hi) / 2) * duration
}

describe('homepage content (v4)', () => {
  it('walks diagnose → build → run', () => {
    expect(steps.map((step) => step.title)).toEqual([
      'Diagnose',
      'Build',
      'Run',
    ])
  })

  it('tabs cover the four case studies and link to real detail pages', () => {
    expect(cases).toHaveLength(4)
    const knownSlugs = new Set(caseStudies.map((study) => study.slug))
    for (const c of cases) {
      expect(knownSlugs).toContain(c.slug)
      expect(c.image.startsWith('/case-studies/')).toBe(true)
    }
  })

  it('leads with the three-answer premise, honest option included', () => {
    expect(premise.answers.map((a) => a.title)).toEqual([
      'Build',
      'Connect',
      'Don’t build yet',
    ])
    expect(premise.intro).toContain('$2,000')
    expect(premise.intro).toContain('credited toward the build')
  })

  it('runs the eight designed pain points through the marquee', () => {
    expect(marqueeItems).toHaveLength(8)
    expect(marqueeItems).toContain('Spreadsheet chaos')
    expect(marqueeItems).toContain('Manual handoffs')
  })

  it('walks the case tabs by keyboard, wrapping at both ends', () => {
    const n = cases.length
    expect(nextTabIndex('ArrowRight', 0, n)).toBe(1)
    expect(nextTabIndex('ArrowLeft', 1, n)).toBe(0)
    // Wrapping is the half that silently breaks off-by-one.
    expect(nextTabIndex('ArrowRight', n - 1, n)).toBe(0)
    expect(nextTabIndex('ArrowLeft', 0, n)).toBe(n - 1)
    expect(nextTabIndex('Home', 2, n)).toBe(0)
    expect(nextTabIndex('End', 0, n)).toBe(n - 1)
    // Keys the tablist doesn't own must fall through untouched.
    expect(nextTabIndex('Enter', 1, n)).toBeNull()
    expect(nextTabIndex('Tab', 1, n)).toBeNull()
  })

  it('reads the ledger figures from data/proof.ts, not its own copies', () => {
    // One source for the three numbers: the homepage ledger is data/proof.ts.
    expect(heroStat).toBe(proofStats[0])
    expect(stats).toEqual(proofStats.slice(1))
    expect(ledger).toEqual(proofStats)
    expect(proofStats.map(formatProof)).toEqual([
      '10,000+',
      '99.99%',
      'Since 2022',
    ])
  })

  it('pins the company-level stat claims', () => {
    expect(`${heroStat.value}${heroStat.suffix}`).toBe('10000+')
    // Assembled from all three parts: tenure carries its "Since " as a prefix
    // so the year can run through the counter like the others.
    expect(
      stats.map(
        (s) =>
          `${'prefix' in s ? s.prefix : ''}${s.value}${
            'suffix' in s ? s.suffix : ''
          }`,
      ),
    ).toEqual(['99.99%', 'Since 2022'])
  })

  it('spends over two seconds on the last eight hours of the headline count', () => {
    // Curve and duration are tuned against each other, so neither is safe to
    // move alone: this is the beat Brandon asked the counter to end on.
    const seconds = closingSeconds(heroStat.value, COUNT_DURATION)
    expect(seconds).toBeGreaterThan(2.2)
    expect(seconds).toBeLessThan(2.6)
  })

  it('runs the supporting figures quicker without flattening their ending', () => {
    // They carry less than the headline, so they get a shorter clock. The
    // second half guards the thing that shortening it could quietly ruin: the
    // closing eight increments are a fixed SHARE of the run, so they shrink
    // with it, and there is a point past which they stop reading as a settle.
    expect(SUPPORTING_COUNT_DURATION).toBeLessThan(COUNT_DURATION)
    for (const stat of stats) {
      expect(
        closingSeconds(stat.value, SUPPORTING_COUNT_DURATION),
      ).toBeGreaterThan(1.2)
    }
  })

  it('dials and mails the contact details the site config holds', () => {
    // Two failures worth guarding, neither of which the page would reveal: a
    // link that goes somewhere other than the label printed on it, and a
    // homepage that drifts away from the footer because someone updated the
    // config and not this.
    const tel = closingDoors.find((d) => d.action.href?.startsWith('tel:'))
    const mail = closingDoors.find((d) => d.action.href?.startsWith('mailto:'))

    expect(mail?.action.href).toBe(`mailto:${siteConfig.contact.email}`)
    expect(tel?.action.label).toBe(siteConfig.contact.phone)
    // Digits only: the href carries a country code the label omits.
    expect(tel?.action.href?.replace(/\D/g, '')).toContain(
      siteConfig.contact.phone.replace(/\D/g, ''),
    )
  })

  it('closes on three doors with exactly one emphasized', () => {
    expect(closingDoors).toHaveLength(premise.answers.length)
    // Every card needs somewhere to go, and the gold top rule only means
    // "start here" while it is on one card.
    expect(closingDoors.every((d) => d.action.to || d.action.href)).toBe(true)
    expect(closingDoors.filter((d) => d.emphasized)).toHaveLength(1)
  })

  it('quotes Jason verbatim in the proof block, never twice on the page', () => {
    const cambridge = caseStudies.find((s) => s.slug === cambridgeProof.slug)
    const letter = cambridge?.testimonial?.paragraphs ?? []
    // Real words from the real letter, and a case page that exists.
    expect(letter.join(' ')).toContain(cambridgeProof.quote)
    // The "In their words" section shows other paragraphs of the same letter;
    // the proof block's sentence must not be in them.
    const excerpt = testimonialExcerpt.map((i) => letter[i]).join(' ')
    expect(excerpt).not.toBe('')
    expect(excerpt).not.toContain(cambridgeProof.quote)
    // No other case on the page carries a quote of its own any more.
    expect(cases.some((c) => 'quote' in c)).toBe(false)
  })

  it('renders uptime to two decimals so 99.99 never rounds to 100', () => {
    const uptime = stats.find((s) => s.label.startsWith('Uptime'))
    if (!uptime?.format) throw new Error('uptime stat missing')
    expect(uptime.format.maximumFractionDigits).toBe(2)
    expect(
      new Intl.NumberFormat('en-US', uptime.format).format(uptime.value),
    ).toBe('99.99')
  })
})

describe('homepage layout (REL-520)', () => {
  it('runs the sections in the redesign order', () => {
    const { container } = render(<Home />)
    // Section eyebrows are the ones led by the Eyebrow component's gold rule.
    const eyebrows = Array.from(container.querySelectorAll('span.w-7'))
      .map((rule) => rule.parentElement?.textContent.trim())
      .filter((t) => t && /^0\d · /.test(t))
    expect(eyebrows).toEqual([
      '01 · Cambridge Building Group',
      '02 · The numbers',
      '03 · What it costs',
      '04 · Client work',
      '05 · The premise',
      '06 · How it works',
      "07 · Who you'll work with",
      '08 · In their words',
    ])
  })

  it('lists the hero proof ticks from the ledger figures', () => {
    expect(heroProof).toEqual([
      'Cambridge Building Group',
      '10,000+ hours of admin automated',
      '99.99% uptime across hosted systems',
    ])
  })

  it('renders four price tiers from config, the Diagnostic accented', () => {
    render(<Home />)
    const tiers = screen.getAllByTestId('price-tier')
    expect(tiers).toHaveLength(4)
    const { pricing } = siteConfig
    expect(tiers.map((t) => t.querySelector('h3')?.textContent)).toEqual([
      'Diagnostic',
      'Build',
      'Website',
      'Run',
    ])
    for (const [i, entry] of [
      pricing.diagnostic,
      pricing.build,
      pricing.website,
      pricing.run,
    ].entries()) {
      expect(within(tiers[i]).getByText(entry.price)).toBeInTheDocument()
      expect(within(tiers[i]).getByText(entry.terms)).toBeInTheDocument()
    }
    // The phone ladder carries the same four.
    expect(screen.getAllByTestId('price-rung')).toHaveLength(4)
  })

  it('names both founders exactly as /about does', () => {
    render(<Home />)
    const rows = screen.getByTestId('founder-rows')
    for (const person of founders) {
      expect(within(rows).getByText(person.name)).toBeInTheDocument()
      expect(
        within(rows).getByText(`${person.role} · ${person.city}`),
      ).toBeInTheDocument()
    }
    expect(screen.getByTestId('hero-founder')).toHaveTextContent(
      `since ${FOUNDED_MONTH} ${FOUNDED_YEAR}`,
    )
  })

  it('renders no credential line or LinkedIn link until they are supplied', () => {
    const { container } = render(<Home />)
    expect(container.querySelector('a[href*="linkedin.com"]')).toBeNull()
    expect(container.textContent).not.toMatch(/linkedin|placeholder/i)
  })

  it('renders the credential and both LinkedIn links once supplied', () => {
    siteConfig.founders['Brandon Harris'] = {
      credential: 'Test credential line',
      linkedin: 'https://www.linkedin.com/in/brandon-test',
    }
    siteConfig.founders['Daniel Velez'] = {
      linkedin: 'https://www.linkedin.com/in/daniel-test',
    }
    render(<Home />)
    expect(
      within(screen.getByTestId('hero-founder')).getByText(
        'Test credential line',
      ),
    ).toBeInTheDocument()
    const brandon = screen.getAllByRole('link', {
      name: 'Brandon Harris on LinkedIn',
    })
    // Hero card and team row.
    expect(brandon).toHaveLength(2)
    for (const link of brandon) {
      expect(link).toHaveAttribute(
        'href',
        'https://www.linkedin.com/in/brandon-test',
      )
    }
    expect(
      screen.getByRole('link', { name: 'Daniel Velez on LinkedIn' }),
    ).toHaveAttribute('href', 'https://www.linkedin.com/in/daniel-test')
  })
})
