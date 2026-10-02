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
  it('renders the detailHeadline as the h1 when provided', () => {
    const study = caseStudies.find(
      (s) => s.slug === 'cambridge-building-group',
    )!
    renderWithRouter(<CaseStudyDetailHero study={study} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      study.detailHeadline!,
    )
  })

  it('falls back to hero.tagline when no detailHeadline is set', () => {
    const base = caseStudies.find((s) => s.slug === 'scrollr')!
    const study = { ...base, detailHeadline: undefined }
    renderWithRouter(<CaseStudyDetailHero study={study} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      study.hero.tagline,
    )
  })

  it('shows the hero quote with its attribution and a link to the letter', () => {
    const study = caseStudies.find(
      (s) => s.slug === 'cambridge-building-group',
    )!
    renderWithRouter(<CaseStudyDetailHero study={study} />)
    expect(
      screen.getByText(/exceptional partner who not only delivers/),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Executive Vice President, Cambridge Building Group'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /read the full letter/i }),
    ).toHaveAttribute('href', '#letter')
  })

  it('omits the endorsement when the study has no hero quote', () => {
    const study = caseStudies.find((s) => s.slug === 'scrollr')!
    renderWithRouter(<CaseStudyDetailHero study={study} />)
    expect(
      screen.queryByRole('link', { name: /read the full letter/i }),
    ).toBeNull()
  })
})
