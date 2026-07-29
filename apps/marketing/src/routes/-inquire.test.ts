import { describe, expect, it } from 'vitest'

import { inquiryContent, inquiryNextSteps } from './inquire'

describe('inquiry route content (v4)', () => {
  it('asks where the business feels slow', () => {
    expect(inquiryContent.headline).toBe('Tell us where it feels slow.')
    expect(inquiryContent.body).toContain('a few sentences is enough')
  })

  it('sets a clear success expectation', () => {
    expect(inquiryContent.successTitle).toBe('Request received.')
    expect(inquiryContent.successBody).toContain('review')
    expect(inquiryContent.successBody).toContain('next step')
  })

  it('explains the three next steps', () => {
    expect(inquiryNextSteps).toHaveLength(3)
    expect(inquiryNextSteps[0]).toContain('one business day')
  })
})
