import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { AgendaRow } from '../AgendaRow'
import { BookingBlock } from '../BookingBlock'
import { siteConfig } from '@/site.config'

const founder = {
  name: 'Brandon Harris',
  role: 'Co-founder & CEO',
  city: 'Nashville',
}
const mailto = 'mailto:inquiries@relentnet.com?subject=x'

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

describe('BookingBlock', () => {
  it('is the contact card while booking has no handle', () => {
    siteConfig.contact.booking.handle = undefined
    const { container } = render(
      <BookingBlock founder={founder} mailto={mailto} />,
    )
    expect(container.querySelector('iframe')).toBeNull()
    expect(screen.getByRole('link', { name: 'Email us' })).toHaveAttribute(
      'href',
      mailto,
    )
    expect(globalThis.fetch).not.toHaveBeenCalled()
  })

  it('is the booking card once there is a handle', () => {
    const { container } = render(
      <BookingBlock founder={founder} mailto={mailto} />,
    )
    expect(container.querySelector('aside')).toHaveAttribute('id', 'book')
    expect(container.querySelector('iframe')).toBeNull()
    expect(screen.getByText('Brandon Harris')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Email us' })).toBeNull()
  })
})

describe('AgendaRow', () => {
  it('renders the time column only when minutes is set', () => {
    const { container, rerender } = render(
      <ul>
        <AgendaRow title="T" detail="D" />
      </ul>,
    )
    expect(container.textContent).not.toMatch(/min/)
    rerender(
      <ul>
        <AgendaRow title="T" detail="D" minutes={5} />
      </ul>,
    )
    expect(container.textContent).toContain('5 min')
  })
})
