import { describe, expect, it } from 'vitest'

import { phases, processCta, processHero } from './process'

describe('process route content', () => {
  it('positions process as diagnostic-led stewardship', () => {
    expect(processHero.headline).toContain('Diagnostic-Led')
    expect(processHero.body).toContain('workflow diagnostic')
    expect(processHero.body).toContain('before we build')
    expect(processHero.cta).toBe('Start With a Diagnostic')
  })

  it('keeps diagnose, prioritize, design, build, and steward phases', () => {
    expect(phases.map((phase) => phase.title)).toEqual([
      'Diagnose the Workflow',
      'Prioritize the Friction',
      'Design the System',
      'Build the Operating Layer',
      'Steward the Technology',
    ])
  })

  it('routes the final CTA to the workflow diagnostic', () => {
    expect(processCta.to).toBe('/diagnostic')
    expect(processCta.label).toBe('Start With a Diagnostic')
  })
})
