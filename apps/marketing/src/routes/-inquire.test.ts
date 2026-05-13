import { describe, expect, it } from 'vitest'

import { inquiryContent } from './inquire'

describe('inquiry route content', () => {
  it('frames inquiry as a workflow diagnostic request', () => {
    expect(inquiryContent.headline).toContain('Request a Workflow Diagnostic')
    expect(inquiryContent.body).toContain('diagnostic')
    expect(inquiryContent.body).toContain('operational friction')
  })

  it('sets a clear success expectation', () => {
    expect(inquiryContent.successTitle).toBe('Diagnostic Request Received.')
    expect(inquiryContent.successBody).toContain('review')
    expect(inquiryContent.successBody).toContain('next step')
  })
})
