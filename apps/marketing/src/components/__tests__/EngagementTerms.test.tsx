import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ClosingCta } from '../ClosingCta'
import { EngagementTerms, engagementRows } from '../EngagementTerms'
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

afterEach(() => {
  pricing.diagnostic.guarantee = undefined
  pricing.examples = []
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

  it('shows "How long" only for the build, the one published duration', () => {
    expect(pricing.build.duration).toBe('4 to 10 weeks')
    expect(pricing.diagnostic.duration).toBeUndefined()
    expect(pricing.website.duration).toBeUndefined()
    expect(pricing.run.duration).toBeUndefined()
    expect(engagementRows.filter((r) => r.duration)).toHaveLength(1)

    render(<EngagementTerms />)
    expect(screen.getAllByText('How long')).toHaveLength(1)
    expect(screen.getByText('4 to 10 weeks')).toBeTruthy()
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
  it('does not render with the current config', () => {
    expect(pricing.diagnostic.guarantee).toBeUndefined()
    const { container } = render(
      <>
        <GuaranteeBand />
        <GuaranteeChip />
      </>,
    )
    expect(container.innerHTML).toBe('')
  })

  it('renders band and chip once the config supplies terms', () => {
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
  it('does not render with the current (empty) config', () => {
    expect(pricing.examples).toEqual([])
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
    expect(screen.queryByText('Book a 20-minute call')).toBeNull()
    expect(screen.getByText(contact.phone)).toBeTruthy()
  })

  it('adds a booking link to /inquire#book while booking has a handle', () => {
    render(<ClosingCta cta="Go">Heading</ClosingCta>)
    const link = screen.getByText('Book a 20-minute call')
    expect(link.getAttribute('href')).toBe('/inquire#book')
  })
})
