import { describe, expect, it } from 'vitest'

import { FOUNDED_YEAR, aboutSections, founders } from './about'
import { primaryNavItems } from '@/components/Header'
import { stats } from './index'

describe('about page content', () => {
  it('names both founders', () => {
    // The page's entire argument is that the company is these two people, so
    // it fails if either name goes missing.
    expect(founders.map((f) => f.name)).toEqual([
      'Brandon Harris',
      'Daniel Velez',
    ])
  })

  it('agrees with the homepage about when the company started', () => {
    // The homepage states tenure as a date in its stat ledger. Two pages
    // claiming different founding years is the kind of thing nobody notices
    // until a client does.
    const tenure = stats.find((s) => s.label === 'In business')
    if (!tenure) throw new Error('tenure stat missing from the homepage')
    expect(tenure.value).toBe(FOUNDED_YEAR)
  })

  it('keeps the honest answer on the page', () => {
    // "Don't build yet" is the site's least commercial and most load-bearing
    // claim. If About stops saying it, the page is just a bio.
    const prose = aboutSections.flatMap((s) => s.body).join(' ')
    expect(prose).toContain('don’t build yet')
  })

  it('is reachable from the primary nav', () => {
    // A page nothing links to is a page nobody reads.
    expect(primaryNavItems.map((item) => item.to)).toContain('/about')
  })
})
