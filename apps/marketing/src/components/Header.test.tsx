import { describe, expect, it } from 'vitest'

import {
  activeLinkClasses,
  linkClasses,
  primaryNavItems,
  utilityCta,
} from './Header'

describe('Header navigation (v4)', () => {
  it('exposes the diagnostic as the first public buying path', () => {
    expect(primaryNavItems[0]).toEqual({
      label: 'Diagnostic',
      to: '/diagnostic',
    })
    expect(primaryNavItems.map((item) => item.label)).toEqual([
      'Diagnostic',
      'Process',
      'Client Work',
      'Portal',
    ])
    expect(utilityCta).toEqual({
      label: 'Book a Free Diagnostic',
      to: '/inquire',
    })
  })

  it('uses router active props instead of active class selectors', () => {
    expect(linkClasses).not.toContain('[&.active]')
    expect(activeLinkClasses).toBe('text-gold-text')
  })
})
