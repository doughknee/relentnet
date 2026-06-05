import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  RouterContextProvider,
  createMemoryHistory,
  createRouter,
} from '@tanstack/react-router'

import { ClientsBySolution } from '../ClientsBySolution'
import { clientSolutions } from '@/data/clientSolutions'
import { routeTree } from '@/routeTree.gen'

function renderRouted(ui: React.ReactElement) {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ['/clients'] }),
  })
  return render(
    <RouterContextProvider router={router}>{ui}</RouterContextProvider>,
  )
}

describe('ClientsBySolution', () => {
  it('renders every solution as a link', () => {
    renderRouted(<ClientsBySolution />)
    clientSolutions.forEach((s) => {
      expect(
        screen.getByRole('link', { name: new RegExp(s.label, 'i') }),
      ).toBeInTheDocument()
    })
  })

  it('renders a blurb for every solution', () => {
    renderRouted(<ClientsBySolution />)
    clientSolutions.forEach((s) => {
      expect(screen.getByText(s.blurb)).toBeInTheDocument()
    })
  })

  it('renders eyebrow and headline copy', () => {
    renderRouted(<ClientsBySolution />)
    expect(screen.getByText(/customers by solution/i)).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /obsess over diagnosed friction/i }),
    ).toBeInTheDocument()
  })
})
