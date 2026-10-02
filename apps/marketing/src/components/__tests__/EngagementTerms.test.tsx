import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ClosingCta } from '../ClosingCta'
import {
  EngagementRow,
  EngagementTerms,
  engagementRows,
} from '../EngagementTerms'
import { GuaranteeBand, GuaranteeChip } from '../GuaranteeBand'
import { PriceExamples } from '../PriceExamples'
import type { DiagnosticGuarantee, PriceExample } from '@/site.config'
import { siteConfig } from '@/site.config'

vi.mock('@tanstack/react-router', async () => ({
  ...(await vi.importActual('@tanstack/react-router')),
  Link: ({
    to,
    hash,
    children,
    className,
  }: {
    to: string
    hash?: string
    children: unknown
    className?: string
  }) => (
    <a href={hash ? `${to}#${hash}` : to} className={className}>
      {children as never}
    </a>
  ),
}))

const { pricing, contact } = siteConfig

const original = {
  guarantee: pricing.diagnostic.guarantee,
  examples: pricing.examples,
}

afterEach(() => {
  pricing.diagnostic.guarantee = original.guarantee
  pricing.examples = original.examples
  contact.booking.handle = 'brandon-harris'
})

describe('EngagementTerms', () => {
  it('renders the four published prices from config', () => {
    render(<EngagementTerms />)
    for (const { price } of [
      pricing.diagnostic,
      pricing.build,
      pricing.website,
      pricing.run,
    ]) {
      expect(screen.getByText(price)).toBeTruthy()
    }
    expect(pricing.diagnostic.price).toBe('$2,000')
    expect(pricing.build.price).toBe('From $6,000')
    expect(pricing.website.price).toBe('From $5,000')
    expect(pricing.run.price).toBe('From $350 a month')
  })

  it('says the diagnostic is credited and never calls it free', () => {
    const { container } = render(<EngagementTerms />)
    expect(container.textContent).toContain('Credited toward the build')
    expect(container.textContent).not.toMatch(/free/i)
  })

  it('shows "How long" for each of the four published durations', () => {
    expect(pricing.diagnostic.duration).toBe('1 to 2 weeks')
    expect(pricing.build.duration).toBe('4 to 10 weeks')
    expect(pricing.website.duration).toBe('3 to 6 weeks')
    expect(pricing.run.duration).toBe("Monthly, 30 days' notice")
    expect(engagementRows.filter((r) => r.duration)).toHaveLength(4)

    render(<EngagementTerms />)
    expect(screen.getAllByText('How long')).toHaveLength(4)
    for (const text of [
      '1 to 2 weeks',
      '4 to 10 weeks',
      '3 to 6 weeks',
      "Monthly, 30 days' notice",
    ]) {
      expect(screen.getByText(text)).toBeTruthy()
    }
  })

  it('omits the How long cell for an engagement with no duration', () => {
    const { duration } = pricing.website
    pricing.website.duration = undefined
    try {
      const row = { ...engagementRows[2], duration: undefined }
      expect(row.duration).toBeUndefined()
      render(<EngagementRow row={row} />)
      expect(screen.queryByText('How long')).toBeNull()
    } finally {
      pricing.website.duration = duration
    }
  })

  it('renders the badge it is given, and none otherwise', () => {
    const { rerender } = render(<EngagementTerms />)
    expect(screen.queryByText('You are here')).toBeNull()
    rerender(<EngagementTerms badges={{ diagnostic: 'You are here' }} />)
    expect(screen.getByText('You are here')).toBeTruthy()
  })

  it('puts the website row last, after the Diagnostic, Build, Run path', () => {
    const { container } = render(<EngagementTerms />)
    const steps = [...container.querySelectorAll('p')]
      .map((p) => p.textContent)
      .filter((t) => /Diagnostic$|Build$|Run$|Website$/.test(t))
    expect(steps).toEqual([
      '01 · Diagnostic',
      '02 · Build',
      '03 · Run',
      'Any time · Website',
    ])
  })
})

const guarantee: DiagnosticGuarantee = {
  headline: 'GUARANTEE-HEADLINE',
  terms: 'GUARANTEE-TERMS',
  window: 'GUARANTEE-WINDOW',
}

const example: PriceExample = {
  name: 'EXAMPLE-NAME',
  description: 'EXAMPLE-DESCRIPTION',
  build: '$EXAMPLE-BUILD',
  run: '$EXAMPLE-RUN/mo',
  total: '$EXAMPLE-TOTAL',
}

describe('guarantee band', () => {
  it('renders with the approved config', () => {
    const { container } = render(
      <>
        <GuaranteeBand />
        <GuaranteeChip />
      </>,
    )
    expect(screen.getByTestId('guarantee-band')).toBeTruthy()
    expect(screen.getByTestId('guarantee-chip')).toBeTruthy()
    expect(container.textContent).toContain('Worth $2,000, or your money back.')
    expect(container.textContent).toContain('within 14 days of receiving')
    expect(container.textContent).toContain('14 days')
  })

  it('hides band and chip when the guarantee is removed', () => {
    pricing.diagnostic.guarantee = undefined
    const { container } = render(
      <>
        <GuaranteeBand />
        <GuaranteeChip />
      </>,
    )
    expect(container.innerHTML).toBe('')
  })

  it('renders band and chip from whatever the config supplies', () => {
    pricing.diagnostic.guarantee = guarantee
    render(
      <>
        <GuaranteeBand />
        <GuaranteeChip />
      </>,
    )
    expect(screen.getByTestId('guarantee-band')).toBeTruthy()
    expect(screen.getByTestId('guarantee-chip')).toBeTruthy()
    expect(screen.getByText('GUARANTEE-TERMS')).toBeTruthy()
    expect(screen.getByText('GUARANTEE-WINDOW')).toBeTruthy()
  })
})

describe('price examples', () => {
  it('renders the three approved examples', () => {
    render(<PriceExamples />)
    expect(screen.getByText('One workflow automated')).toBeTruthy()
    expect(screen.getByText('$7,000')).toBeTruthy()
    expect(screen.getByText('$350 a month')).toBeTruthy()
    expect(screen.getByText('$11,200')).toBeTruthy()
  })

  it('works year one out as build plus 12 months of run', () => {
    expect(pricing.examples.map((e) => e.total)).toEqual([
      '$11,200',
      '$24,000',
      '$46,000',
    ])
  })

  it('hides when the examples are removed', () => {
    pricing.examples = []
    const { container } = render(<PriceExamples />)
    expect(container.innerHTML).toBe('')
  })

  it('renders each example once the config supplies them', () => {
    pricing.examples = [example]
    render(<PriceExamples />)
    expect(screen.getByTestId('price-examples')).toBeTruthy()
    expect(screen.getByText('EXAMPLE-NAME')).toBeTruthy()
    expect(screen.getByText('$EXAMPLE-TOTAL')).toBeTruthy()
  })
})

describe('closing CTA booking line', () => {
  it('shows only the phone line while booking has no handle', () => {
    contact.booking.handle = undefined
    render(<ClosingCta cta="Go">Heading</ClosingCta>)
    expect(screen.queryByText('Book a call')).toBeNull()
    expect(screen.getByText(contact.phone)).toBeTruthy()
  })

  it('adds a booking link to /inquire#book while booking has a handle', () => {
    render(<ClosingCta cta="Go">Heading</ClosingCta>)
    const link = screen.getByText('Book a call')
    expect(link.getAttribute('href')).toBe('/inquire#book')
  })
})
