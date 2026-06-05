import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CaseStudyNarrative } from '../CaseStudyNarrative'
import { caseStudies } from '@/data/caseStudies'

describe('CaseStudyNarrative', () => {
  it('renders story.outcome under Results when results is unset, without an Outcome h3', () => {
    const study = caseStudies.find((s) => s.slug === 'scrollr')
    if (!study) throw new Error('Fixture scrollr not found')
    render(<CaseStudyNarrative study={study} />)
    expect(
      screen.queryByRole('heading', { level: 3, name: /^outcome$/i }),
    ).toBeNull()
    expect(
      screen.getByRole('heading', { level: 2, name: /^results$/i }),
    ).toBeInTheDocument()
    const firstOutcome = study.story.outcome.find((b) => b.type === 'p')
    if (firstOutcome) {
      expect(
        screen.getByText(new RegExp(firstOutcome.text.slice(0, 30))),
      ).toBeInTheDocument()
    }
  })

  it('renders study.results entries with h3 subsections when provided', () => {
    const study = {
      ...caseStudies[0],
      results: [
        { headline: 'A', body: 'Body A' },
        { headline: 'B', body: 'Body B' },
      ],
    }
    render(<CaseStudyNarrative study={study} />)
    expect(
      screen.getByRole('heading', { level: 3, name: 'A' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 3, name: 'B' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Body A')).toBeInTheDocument()
    expect(screen.getByText('Body B')).toBeInTheDocument()
  })
})
