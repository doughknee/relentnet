import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CaseStudyTestimonial } from '../CaseStudyTestimonial'
import { caseStudies } from '@/data/caseStudies'

describe('CaseStudyTestimonial', () => {
  it('renders the full Cambridge letter with its signature block', () => {
    const study = caseStudies.find((s) => s.slug === 'cambridge-building-group')
    if (!study?.testimonial) throw new Error('Cambridge testimonial missing')
    render(<CaseStudyTestimonial testimonial={study.testimonial} />)

    const section = screen.getByTestId('case-study-testimonial')
    const paragraphs = within(section)
      .getAllByText(/./, { selector: 'blockquote p' })
      .map((p) => p.textContent)
    expect(paragraphs).toHaveLength(5)
    expect(paragraphs[0]).toMatch(
      /^Brandon Harris and RelentNet were contracted by our startup construction company/,
    )
    expect(paragraphs[2]).toMatch(
      /^What Brandon ultimately delivered was far beyond anything we had envisioned\./,
    )
    expect(paragraphs[4]).toMatch(
      /consistently finds ways to deliver more than we ever thought possible\.$/,
    )

    expect(within(section).getByText('Jason Hall')).toBeInTheDocument()
    expect(
      within(section).getByText('Executive Vice President'),
    ).toBeInTheDocument()
    expect(
      within(section).getByText('Cambridge Building Group, LLC'),
    ).toBeInTheDocument()
  })
})
