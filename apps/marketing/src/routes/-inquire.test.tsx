import { render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  Route,
  callAgenda,
  inquiryContent,
  inquiryNextSteps,
  inquiryProofQuote,
} from './inquire'
import { diagnosticFit } from '@/data/fit'
import { siteConfig } from '@/site.config'

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

function renderPage() {
  const Page = Route.options.component as () => React.JSX.Element
  return render(<Page />)
}

// Booking is on by default, so the widget fetches on mount. Hold every
// request open: no test here may reach the live hq API.
const realFetch = globalThis.fetch

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(() => new Promise(() => {})),
  )
})

afterEach(() => {
  // Put back only fetch: unstubAllGlobals would also drop the setup file's
  // IntersectionObserver and matchMedia stubs.
  vi.stubGlobal('fetch', realFetch)
  siteConfig.contact.booking.handle = 'brandon-harris'
})

describe('inquiry route content', () => {
  it('asks where the business feels slow', () => {
    expect(inquiryContent.headline).toBe('Tell us where it feels slow.')
    expect(inquiryContent.body).toContain('a few sentences is enough')
  })

  it('explains the three next steps', () => {
    expect(inquiryNextSteps).toHaveLength(3)
    expect(inquiryNextSteps[0]).toContain('one business day')
    expect(inquiryNextSteps[2]).not.toMatch(/free/i)
  })

  it('splits the 30-minute call 15, 10 and 5', () => {
    expect(callAgenda.map((row) => row.minutes)).toEqual([15, 10, 5])
    expect(callAgenda.reduce((sum, row) => sum + (row.minutes ?? 0), 0)).toBe(
      30,
    )
  })
})

describe('booking off (no handle)', () => {
  beforeEach(() => {
    siteConfig.contact.booking.handle = undefined
  })

  it('renders the fallback block and no iframe', () => {
    const { container } = renderPage()
    expect(screen.getByTestId('booking-fallback')).toBeInTheDocument()
    expect(screen.queryByTestId('booking-calendar')).toBeNull()
    expect(container.querySelector('iframe')).toBeNull()
    expect(globalThis.fetch).not.toHaveBeenCalled()
  })

  it('shows phone, email and hours from siteConfig in the block', () => {
    renderPage()
    const block = within(screen.getByTestId('booking-fallback'))
    expect(
      block.getByRole('link', { name: siteConfig.contact.phone }),
    ).toHaveAttribute('href', 'tel:+18588591851')
    expect(
      block.getByRole('link', { name: siteConfig.contact.email }),
    ).toHaveAttribute('href', `mailto:${siteConfig.contact.email}`)
    expect(block.getByText(/9am - 5pm CST/)).toBeInTheDocument()
  })
})

describe('booking on', () => {
  it('puts the booking UI in the hero card under #book, with no iframe', async () => {
    const { container } = renderPage()
    const card = screen.getByTestId('booking-calendar')
    expect(card).toHaveAttribute('id', 'book')
    expect(container.querySelector('iframe')).toBeNull()
    expect(screen.queryByTestId('booking-fallback')).toBeNull()
    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${siteConfig.contact.booking.api}/brandon-harris`,
        expect.anything(),
      )
    })
  })

  it('shows the phone and email once: the lower band keeps them', () => {
    renderPage()
    const { phone, email } = siteConfig.contact
    expect(screen.getAllByRole('link', { name: phone })).toHaveLength(1)
    expect(screen.getAllByRole('link', { name: email })).toHaveLength(1)
    expect(screen.getAllByRole('link', { name: 'Email us' })).toHaveLength(1)
  })
})

describe('call agenda', () => {
  it('renders the three rows with their minutes', () => {
    const { container } = renderPage()
    for (const row of callAgenda) {
      expect(screen.getByText(row.title)).toBeInTheDocument()
      expect(screen.getByText(`${row.minutes} min`)).toBeInTheDocument()
    }
    expect(container.textContent).not.toMatch(/\[placeholder/i)
    expect(screen.getByText('30 minutes')).toBeInTheDocument()
  })
})

describe('fit lists', () => {
  it('reuse diagnosticFit verbatim', () => {
    renderPage()
    for (const item of [...diagnosticFit.goodFit, ...diagnosticFit.notFit]) {
      expect(screen.getByText(item)).toBeInTheDocument()
    }
  })
})

describe('Or write to us', () => {
  it('links to a prefilled mailto with the three prompts', () => {
    siteConfig.contact.booking.handle = undefined
    renderPage()
    // One in the fallback block, one in the write-to-us band.
    const links = screen.getAllByRole('link', { name: 'Email us' })
    expect(links).toHaveLength(2)
    for (const link of links) {
      const href = link.getAttribute('href') ?? ''
      expect(href.startsWith(`mailto:${siteConfig.contact.email}?`)).toBe(true)
      for (const prompt of [
        'What feels slow or manual:',
        'Tools we use today:',
        'Best way to reach me:',
      ]) {
        expect(href).toContain(encodeURIComponent(prompt))
      }
      expect(href).toContain('subject=Inquiry%20from')
      expect(href).toContain('%0A')
    }
  })

  it('renders no form before a time is picked', () => {
    const { container } = renderPage()
    expect(container.querySelector('form')).toBeNull()
  })
})

describe('proof', () => {
  it("quotes Jason Hall's sentence and links the case study", () => {
    renderPage()
    const proof = within(screen.getByTestId('inquire-proof'))
    expect(proof.getByText(new RegExp(inquiryProofQuote))).toBeInTheDocument()
    expect(proof.getByText(/Jason Hall/)).toBeInTheDocument()
  })
})
