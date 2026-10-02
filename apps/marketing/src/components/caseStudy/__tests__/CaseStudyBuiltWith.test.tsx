import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CaseStudyBuiltWith } from '../CaseStudyBuiltWith'
import { caseStudies } from '@/data/caseStudies'

describe('CaseStudyBuiltWith', () => {
  it('lists every Cambridge stack item and counts them from the data', () => {
    const { stack, stackScope } = caseStudies.find(
      (s) => s.slug === 'cambridge-building-group',
    )!.atAGlance
    render(<CaseStudyBuiltWith stack={stack!} scope={stackScope} />)

    expect(
      screen.getByText('15 tools across the marketing site and the AP portal'),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(4)
    expect(screen.getAllByRole('listitem')).toHaveLength(15)
    expect(screen.getByText('Claude (vision)')).toBeInTheDocument()
    expect(screen.getByText('Coolify')).toBeInTheDocument()
  })

  it('computes the count rather than hardcoding it', () => {
    render(
      <CaseStudyBuiltWith
        stack={[
          { category: 'A', items: [{ label: 'One' }, { label: 'Two' }] },
          { category: 'B', items: [{ label: 'Three' }] },
        ]}
      />,
    )
    expect(screen.getByText('3 tools')).toBeInTheDocument()
  })
})
