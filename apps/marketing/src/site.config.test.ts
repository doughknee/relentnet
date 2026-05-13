import { describe, expect, it } from 'vitest'

import { siteConfig } from './site.config'

describe('siteConfig', () => {
  it('uses workflow diagnostic and operational clarity positioning', () => {
    expect(siteConfig.meta.title).toContain('Workflow Diagnostic')
    expect(siteConfig.meta.description).toContain('operational friction')
    expect(siteConfig.meta.description).toContain('workflow diagnostic')
    expect(siteConfig.meta.description).toContain(
      'what technology is worth building',
    )
  })
})
