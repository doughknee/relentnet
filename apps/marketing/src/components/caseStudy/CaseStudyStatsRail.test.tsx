import { render, screen } from '@testing-library/react'
import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { describe, expect, it } from 'vitest'

import { CaseStudyStatsRail } from './CaseStudyStatsRail'

import type { CaseStudyAtAGlance } from '@/data/caseStudies'
import type { ReactElement } from 'react'

/**
 * Render a UI inside a minimal in-memory TanStack Router. The rail uses
 * `<Link to="/diagnostic">`, which requires a router context plus a
 * declared `/diagnostic` route for type-safe `to` resolution.
 */
function renderInRouter(ui: ReactElement) {
  const rootRoute = createRootRoute({ component: () => <Outlet /> })
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => ui,
  })
  const diagnosticRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/diagnostic',
    component: () => <div>diagnostic</div>,
  })
  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute, diagnosticRoute]),
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })
  return render(<RouterProvider router={router} />)
}

describe('CaseStudyStatsRail', () => {
  it('renders delta metrics as from→to', async () => {
    const atAGlance: CaseStudyAtAGlance = {
      metrics: [
        { label: 'Lighthouse', from: '38', to: '96', context: 'Mobile, archived legacy.' },
      ],
    }
    renderInRouter(<CaseStudyStatsRail atAGlance={atAGlance} />)
    expect(await screen.findByText('38')).toBeInTheDocument()
    expect(screen.getByText('96')).toBeInTheDocument()
    expect(screen.getByText(/archived legacy/i)).toBeInTheDocument()
  })

  it('renders flat metrics with value only', async () => {
    const atAGlance: CaseStudyAtAGlance = {
      metrics: [{ label: 'Users', value: '13M' }],
    }
    renderInRouter(<CaseStudyStatsRail atAGlance={atAGlance} />)
    expect(await screen.findByText('13M')).toBeInTheDocument()
  })

  it('renders engagement facts when present', async () => {
    const atAGlance: CaseStudyAtAGlance = {
      engagementYear: '2024–present',
      role: 'Strategy, design, engineering',
    }
    renderInRouter(<CaseStudyStatsRail atAGlance={atAGlance} />)
    expect(await screen.findByText('2024–present')).toBeInTheDocument()
    expect(screen.getByText(/strategy/i)).toBeInTheDocument()
  })

  it('always renders the diagnostic CTA', async () => {
    renderInRouter(<CaseStudyStatsRail atAGlance={{}} />)
    expect(
      await screen.findByRole('link', { name: /start a diagnostic/i }),
    ).toHaveAttribute('href', '/diagnostic')
  })
})
