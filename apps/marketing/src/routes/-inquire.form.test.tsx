import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { Route } from './inquire'
import { siteConfig } from '@/site.config'

// Never hits the live n8n webhook: fetch is always mocked.
const fetchMock = vi.fn()

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  fetchMock.mockReset()
  vi.unstubAllGlobals()
})

function renderPage() {
  const Page = Route.options.component as () => React.JSX.Element
  return render(<Page />)
}

async function fillAndSubmit(honeypot?: string) {
  const user = userEvent.setup()
  const { container } = renderPage()

  await user.type(screen.getByLabelText(/full name/i), 'Ada Lovelace')
  await user.type(screen.getByLabelText(/company/i), 'Analytical Engines')
  await user.type(screen.getByLabelText(/business email/i), 'ada@example.com')
  await user.type(
    screen.getByLabelText(/where does the business feel slow/i),
    'Quotes live in three disconnected spreadsheets.',
  )
  await user.click(screen.getByRole('button', { name: 'Email' }))

  const trap = container.querySelector<HTMLInputElement>(
    'input[name="website"]',
  )
  if (!trap) throw new Error('honeypot missing')
  if (honeypot) await user.type(trap, honeypot)

  await user.click(screen.getByRole('button', { name: /request diagnostic/i }))
}

describe('inquiry form hardening', () => {
  it('hides the honeypot from users and assistive tech', () => {
    const { container } = renderPage()
    const trap = container.querySelector('input[name="website"]')
    expect(trap).toHaveAttribute('tabindex', '-1')
    expect(trap).toHaveAttribute('autocomplete', 'off')
    expect(trap?.closest('[aria-hidden="true"]')).not.toBeNull()
  })

  it('drops a filled honeypot: success state, no fetch', async () => {
    await fillAndSubmit('http://spam.example')
    await screen.findByText('Request received.')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('shows the error with a mailto fallback on a 500', async () => {
    fetchMock.mockResolvedValue(
      new Response('No Respond to Webhook node found', {
        status: 500,
        statusText: 'Internal Server Error',
      }),
    )
    await fillAndSubmit()

    const alert = await screen.findByRole('alert')
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('Request received.')).toBeNull()
    expect(alert).toHaveTextContent(siteConfig.contact.phone)
    expect(alert.querySelector('a')).toHaveAttribute(
      'href',
      `mailto:${siteConfig.contact.email}`,
    )
  })
})

describe('start-a-conversation block', () => {
  const original = siteConfig.contact.bookingUrl
  afterEach(() => {
    siteConfig.contact.bookingUrl = original
  })

  it('hides the booking button while bookingUrl is empty', () => {
    siteConfig.contact.bookingUrl = ''
    renderPage()
    expect(
      screen.queryByRole('link', { name: /book a 20-minute call/i }),
    ).toBeNull()
    expect(
      screen.getByRole('link', { name: siteConfig.contact.email }),
    ).toHaveAttribute('href', `mailto:${siteConfig.contact.email}`)
    expect(
      screen.getByRole('link', { name: siteConfig.contact.phone }),
    ).toHaveAttribute('href', expect.stringMatching(/^tel:\+\d+$/))
  })

  it('shows the booking button in a new tab once bookingUrl is set', () => {
    siteConfig.contact.bookingUrl = 'https://cal.example/brandon/20min'
    renderPage()
    const link = screen.getByRole('link', { name: /book a 20-minute call/i })
    expect(link).toHaveAttribute('href', 'https://cal.example/brandon/20min')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener')
  })
})
