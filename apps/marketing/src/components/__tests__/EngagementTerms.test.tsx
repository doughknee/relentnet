import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EngagementTerms } from '../EngagementTerms'
import { siteConfig } from '@/site.config'

describe('EngagementTerms', () => {
  it('renders the four published prices from config', () => {
    render(<EngagementTerms />)
    const { pricing } = siteConfig
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
})
