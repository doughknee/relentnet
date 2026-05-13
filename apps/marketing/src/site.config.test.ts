import { describe, expect, it } from 'vitest'

import { siteConfig } from './site.config'

describe('siteConfig', () => {
  it('uses custom software and workflow stewardship positioning', () => {
    expect(siteConfig.meta.title).toContain('Custom Software')
    expect(siteConfig.meta.description).toContain('workflow friction')
    expect(siteConfig.meta.description).toContain('custom software systems')
    expect(siteConfig.meta.description).toContain('steward')
  })
})
