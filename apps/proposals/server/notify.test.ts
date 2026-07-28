import { describe, expect, it } from 'vitest'

import { discordContent } from './notify.ts'

import type { Proposal } from '../shared/types.ts'

const proposal = {
  slug: 'amelia-island-beach-condos',
  token: 'abc12345',
  clientName: 'Will Colley',
  projectName: 'Amelia Island Beach Condos',
  quoteNumber: 'QT-SHX6JT2B',
  upfrontCents: 630000,
  recurringCents: 30000,
} as Proposal

describe('discordContent', () => {
  it('formats a decline with money and feedback', () => {
    const msg = discordContent('declined', {
      ...proposal,
      feedback: 'Budget timing.',
    })
    expect(msg).toContain(
      '**DECLINED** · Will Colley · Amelia Island Beach Condos',
    )
    expect(msg).toContain('QT-SHX6JT2B · $6,300 upfront + $300/mo')
    expect(msg).toContain('Feedback: "Budget timing."')
    expect(msg).toContain('/p/amelia-island-beach-condos-abc12345')
  })

  it('omits feedback and recurring when absent, and stays under the limit', () => {
    const msg = discordContent('viewed', { ...proposal, recurringCents: 0 })
    expect(msg).toContain('$6,300 upfront')
    expect(msg).not.toContain('/mo')
    expect(msg).not.toContain('Feedback')
    expect(msg.length).toBeLessThanOrEqual(2000)
  })
})
