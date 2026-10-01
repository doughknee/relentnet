import { render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { HomeTestimonial } from '../HomeTestimonial'
import { caseStudies } from '@/data/caseStudies'

vi.mock('@tanstack/react-router', () => ({
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

const letter = caseStudies.find(
  (s) => s.slug === 'cambridge-building-group',
)?.testimonial

describe('HomeTestimonial', () => {
  it('renders paragraphs 3 and 5 verbatim, with signature and link', () => {
    if (!letter) throw new Error('Cambridge testimonial missing')
    render(<HomeTestimonial />)
    const section = screen.getByTestId('home-testimonial')
    const paragraphs = within(section)
      .getAllByText(/./, { selector: 'blockquote p' })
      .map((p) => p.textContent)
    expect(paragraphs).toEqual([letter.paragraphs[2], letter.paragraphs[4]])
    expect(within(section).getByText('Jason Hall')).toBeInTheDocument()
    expect(
      within(section).getByText('Executive Vice President'),
    ).toBeInTheDocument()
    expect(
      within(section).getByText('Cambridge Building Group, LLC'),
    ).toBeInTheDocument()
    expect(
      within(section).getByRole('link', { name: /full letter/i }),
    ).toHaveAttribute('href', '/clients/cambridge-building-group')
  })
})
