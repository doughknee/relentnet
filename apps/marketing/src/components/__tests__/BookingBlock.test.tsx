import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { AgendaRow } from '../AgendaRow'
import { BookingBlock } from '../BookingBlock'
import { siteConfig } from '@/site.config'

const founder = {
  name: 'Brandon Harris',
  role: 'Co-founder & CEO',
  city: 'Nashville',
}
const mailto = 'mailto:inquiries@relentnet.com?subject=x'

afterEach(() => {
  siteConfig.contact.bookingUrl = ''
})

describe('BookingBlock', () => {
  it('is the fallback while bookingUrl is empty', () => {
    const { container } = render(
      <BookingBlock founder={founder} mailto={mailto} />,
    )
    expect(container.querySelector('iframe')).toBeNull()
    expect(screen.getByRole('link', { name: 'Email us' })).toHaveAttribute(
      'href',
      mailto,
    )
  })

  it('is the calendar once bookingUrl is set', () => {
    siteConfig.contact.bookingUrl = 'https://cal.com/example'
    const { container } = render(
      <BookingBlock founder={founder} mailto={mailto} />,
    )
    expect(container.querySelector('iframe')).toHaveAttribute(
      'src',
      'https://cal.com/example',
    )
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
