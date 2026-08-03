import { describe, expect, it } from 'vitest'

import { portalContent } from './portal'

describe('portal route content (v4)', () => {
  it('distinguishes active client access from diagnostic inquiry', () => {
    expect(portalContent.body).toContain('active clients')
    expect(portalContent.prospectCta).toBe('Start with a workflow diagnostic')
    expect(portalContent.prospectBody.toLowerCase()).toContain(
      'not a client yet',
    )
  })
})
