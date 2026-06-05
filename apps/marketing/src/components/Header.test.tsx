import { describe, expect, it } from 'vitest'

import {
  activeCtaClasses,
  activeLinkClasses,
  linkClasses,
  primaryNavItems,
  utilityCta,
} from './Header'

describe('Header navigation', () => {
  it('exposes the diagnostic as the first public buying path', () => {
    expect(primaryNavItems[0]).toEqual({
      label: 'Diagnostic',
      to: '/diagnostic',
    })
    expect(primaryNavItems.map((item) => item.label)).toEqual([
      'Diagnostic',
      'Process',
      'Clients',
      'Portal',
    ])
    expect(utilityCta).toEqual({ label: 'Start Diagnostic', to: '/diagnostic' })
  })

  it('uses router active props instead of active class selectors', () => {
    expect(linkClasses).not.toContain('[&.active]')
    expect(activeLinkClasses).toBe('text-gold')
    expect(activeCtaClasses).toBe('bg-gold text-black border-gold')
  })
})
