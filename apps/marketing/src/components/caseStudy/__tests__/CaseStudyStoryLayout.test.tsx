import { render, screen } from '@testing-library/react'
import {
  RouterContextProvider,
  createMemoryHistory,
  createRouter,
} from '@tanstack/react-router'
import { describe, expect, it } from 'vitest'

import { CaseStudyStoryLayout } from '../CaseStudyStoryLayout'
import { caseStudies } from '@/data/caseStudies'
import { routeTree } from '@/routeTree.gen'

function renderWithRouter(ui: React.ReactElement) {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })
  return render(
    <RouterContextProvider router={router}>{ui}</RouterContextProvider>,
  )
}

describe('CaseStudyStoryLayout', () => {
  it('renders the customer wordmark in the meta card', () => {
    const study = caseStudies.find(
      (s) => s.slug === 'cambridge-building-group',
    )!
    renderWithRouter(<CaseStudyStoryLayout study={study} />)
    expect(screen.getByTestId('detail-hero-logo')).toHaveTextContent(study.name)
  })

  it('renders the global partner logo row when provided', () => {
    const study = caseStudies.find((s) => s.slug === 'scrollr')!
    renderWithRouter(<CaseStudyStoryLayout study={study} />)
    expect(
      screen.getByRole('img', { name: study.atAGlance.global!.label }),
    ).toBeInTheDocument()
  })

  it('renders the region and tier rows', () => {
    const study = caseStudies.find(
      (s) => s.slug === 'cambridge-building-group',
    )!
    renderWithRouter(<CaseStudyStoryLayout study={study} />)
    expect(screen.getByText(study.region!)).toBeInTheDocument()
    expect(screen.getByText('Enterprise')).toBeInTheDocument()
  })
})
