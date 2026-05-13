import { describe, expect, it } from 'vitest'

import { inquiryContent } from './inquire'

describe('inquiry route content', () => {
  it('frames inquiry around workflow mapping and operational pain', () => {
    expect(inquiryContent.headline).toContain('Map Your Workflow')
    expect(inquiryContent.body).toContain('workflow')
    expect(inquiryContent.body).toContain('operational friction')
  })

  it('sets a clear success expectation', () => {
    expect(inquiryContent.successTitle).toBe('Workflow Context Received.')
    expect(inquiryContent.successBody).toContain('review')
    expect(inquiryContent.successBody).toContain('next step')
  })
})
