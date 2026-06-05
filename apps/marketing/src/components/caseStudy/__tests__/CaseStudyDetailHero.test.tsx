import { render, screen } from '@testing-library/react'
import {
  RouterContextProvider,
  createMemoryHistory,
  createRouter,
} from '@tanstack/react-router'
import { describe, expect, it } from 'vitest'

import { CaseStudyDetailHero } from '../CaseStudyDetailHero'
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

describe('CaseStudyDetailHero', () => {
  it('renders the customer logo slot with the study name when no logoSrc is provided', () => {
    const study = caseStudies.find(
      (s) => s.slug === 'cambridge-building-group',
    )!
    renderWithRouter(<CaseStudyDetailHero study={study} />)
    const logoSlot = screen.getByTestId('detail-hero-logo')
    expect(logoSlot).toHaveTextContent(study.name)
  })

  it('renders the global partner logo as a meta-card row when provided', () => {
    const study = caseStudies.find((s) => s.slug === 'scrollr')!
    renderWithRouter(<CaseStudyDetailHero study={study} />)
    expect(
      screen.getByRole('img', { name: study.atAGlance.global!.label }),
    ).toBeInTheDocument()
  })
})
