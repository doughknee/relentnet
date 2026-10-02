import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Route, inquiryContent, inquiryNextSteps } from './inquire'
import { siteConfig } from '@/site.config'

function renderPage() {
  const Page = Route.options.component as () => React.JSX.Element
  return render(<Page />)
}

afterEach(() => {
  vi.unstubAllGlobals()
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
})

describe('Start a conversation block', () => {
  it('shows phone and email from siteConfig', () => {
    renderPage()
    expect(screen.getByText('Start a conversation')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: siteConfig.contact.phone }),
    ).toHaveAttribute('href', 'tel:+18588591851')
    expect(
      screen.getByRole('link', { name: siteConfig.contact.email }),
    ).toHaveAttribute('href', `mailto:${siteConfig.contact.email}`)
  })

  it('hides the booking button until bookingUrl is set', () => {
    renderPage()
    expect(
      screen.queryByRole('link', { name: /book a 20-minute call/i }),
    ).toBeNull()
  })

  it('shows the booking button when bookingUrl is set', () => {
    siteConfig.contact.bookingUrl = 'https://cal.example/relentnet'
    renderPage()
    expect(
      screen.getByRole('link', { name: /book a 20-minute call/i }),
    ).toHaveAttribute('href', 'https://cal.example/relentnet')
  })
})

describe('Or write to us', () => {
  it('links to a prefilled mailto with the three prompts', () => {
    renderPage()
    const href =
      screen.getByRole('link', { name: 'Email us' }).getAttribute('href') ?? ''
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
  })

  it('renders no form and makes no network request', () => {
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    const { container } = renderPage()
    expect(container.querySelector('form')).toBeNull()
    expect(fetchSpy).not.toHaveBeenCalled()
  })
})
