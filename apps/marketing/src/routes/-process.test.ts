import { describe, expect, it } from 'vitest'

import { phases, processHero } from './process'

describe('process route content', () => {
  it('positions the process around workflow diagnosis and stewardship', () => {
    expect(processHero.headline).toContain('How We Turn Workflow Friction')
    expect(processHero.body).toContain('diagnose')
    expect(processHero.body).toContain('custom software systems')
    expect(processHero.body).toContain('steward')
  })

  it('covers discover, diagnose, design, build, and steward phases', () => {
    expect(phases.map((phase) => phase.title)).toEqual([
      'Discover the Workflow',
      'Diagnose the Friction',
      'Design the System',
      'Build the Operating Layer',
      'Steward the Technology',
    ])
  })
})
