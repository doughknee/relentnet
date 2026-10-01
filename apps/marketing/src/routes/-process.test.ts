import { describe, expect, it } from 'vitest'

import { phases } from './process'

describe('process route content (v4)', () => {
  it('keeps diagnose, prioritize, design, build, and run phases', () => {
    expect(phases.map((phase) => phase.title)).toEqual([
      'Diagnose the workflow',
      'Prioritize the friction',
      'Design the system',
      'Build the operating layer',
      'Run and support the system',
    ])
  })

  it('gives every phase a quote and four deliverables', () => {
    for (const phase of phases) {
      expect(phase.quote.length).toBeGreaterThan(0)
      expect(phase.deliverables).toHaveLength(4)
    }
  })
})
