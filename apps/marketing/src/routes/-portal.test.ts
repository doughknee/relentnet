import { describe, expect, it } from 'vitest'

import { portalContent } from './portal'

describe('portal route content', () => {
  it('distinguishes active client access from diagnostic inquiry', () => {
    expect(portalContent.body).toContain('active RelentNet clients')
    expect(portalContent.prospectCta).toBe('Start with a workflow diagnostic')
    expect(portalContent.prospectBody).toContain('not a client yet')
  })
})
