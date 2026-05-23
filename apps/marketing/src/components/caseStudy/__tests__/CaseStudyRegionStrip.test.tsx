import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CaseStudyRegionStrip } from '../CaseStudyRegionStrip'

describe('CaseStudyRegionStrip', () => {
  it('renders region and capitalized companySize as small uppercase labels', () => {
    render(<CaseStudyRegionStrip region="Global" companySize="enterprise" />)
    expect(screen.getByText('Global')).toBeInTheDocument()
    expect(screen.getByText('Enterprise')).toBeInTheDocument()
  })

  it('omits region when not provided', () => {
    render(<CaseStudyRegionStrip companySize="startup" />)
    expect(screen.queryByText(/global/i)).toBeNull()
    expect(screen.getByText('Startup')).toBeInTheDocument()
  })

  it('omits companySize for placeholder', () => {
    render(<CaseStudyRegionStrip region="Global" companySize="placeholder" />)
    expect(screen.getByText('Global')).toBeInTheDocument()
    expect(screen.queryByText(/placeholder/i)).toBeNull()
  })

  it('renders nothing when both are absent/placeholder', () => {
    const { container } = render(
      <CaseStudyRegionStrip companySize="placeholder" />,
    )
    expect(container.firstChild).toBeNull()
  })
})
