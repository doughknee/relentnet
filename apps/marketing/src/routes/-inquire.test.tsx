import { render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

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

afterEach(() => {
  siteConfig.contact.bookingUrl = ''
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

  it('leaves every agenda time unset', () => {
    expect(callAgenda).toHaveLength(3)
    for (const row of callAgenda) expect(row.minutes).toBeUndefined()
  })
})

describe('today (no booking URL)', () => {
  it('renders the fallback block and no iframe', () => {
    const { container } = renderPage()
    expect(screen.getByTestId('booking-fallback')).toBeInTheDocument()
    expect(screen.queryByTestId('booking-calendar')).toBeNull()
    expect(container.querySelector('iframe')).toBeNull()
    expect(
      screen.queryByRole('link', { name: /book a 20-minute call/i }),
    ).toBeNull()
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

describe('with a booking URL', () => {
  it('embeds the scheduling page and keeps an open-in-new-tab link', () => {
    siteConfig.contact.bookingUrl = 'https://cal.example/relentnet'
    const { container } = renderPage()
    const frame = container.querySelector('iframe')
    expect(frame).not.toBeNull()
    expect(frame).toHaveAttribute('src', 'https://cal.example/relentnet')
    expect(frame).toHaveAttribute('loading', 'lazy')
    expect(frame?.getAttribute('title')).toBeTruthy()
    expect(
      screen.getByRole('link', { name: /open the booking page/i }),
    ).toHaveAttribute('href', 'https://cal.example/relentnet')
    expect(screen.queryByTestId('booking-fallback')).toBeNull()
  })
})

describe('call agenda', () => {
  it('renders the three rows and no times', () => {
    const { container } = renderPage()
    for (const row of callAgenda) {
      expect(screen.getByText(row.title)).toBeInTheDocument()
    }
    expect(container.textContent).not.toMatch(/\bmin\b/i)
    expect(container.textContent).not.toMatch(/\[placeholder/i)
    expect(screen.getByText('20 minutes')).toBeInTheDocument()
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

  it('renders no form and makes no network request', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    const { container } = renderPage()
    expect(container.querySelector('form')).toBeNull()
    expect(fetchSpy).not.toHaveBeenCalled()
    fetchSpy.mockRestore()
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
