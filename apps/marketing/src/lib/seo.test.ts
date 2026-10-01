import { describe, expect, it } from 'vitest'

import { seo } from './seo'
import { siteConfig } from '@/site.config'

const prop = (meta: ReturnType<typeof seo>['meta'], name: string) =>
  meta.find((m) => 'property' in m && m.property === name)

describe('seo', () => {
  it('defaults og:image to the absolute 1200x630 share card', () => {
    const { meta } = seo({})
    expect(prop(meta, 'og:image')).toMatchObject({
      content: `${siteConfig.domain}/og-default.png`,
    })
    expect(prop(meta, 'og:image:width')).toMatchObject({ content: '1200' })
    expect(prop(meta, 'og:image:height')).toMatchObject({ content: '630' })
  })

  it('omits dimensions and keeps the hero for a custom image', () => {
    const { meta } = seo({ image: '/case-studies/x/hero.webp' })
    expect(prop(meta, 'og:image')).toMatchObject({
      content: `${siteConfig.domain}/case-studies/x/hero.webp`,
    })
    expect(prop(meta, 'og:image:width')).toBeUndefined()
  })
})
