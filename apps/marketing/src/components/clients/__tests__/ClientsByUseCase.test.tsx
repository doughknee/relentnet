import { fireEvent, render, screen } from '@testing-library/react'
import {
  RouterContextProvider,
  createMemoryHistory,
  createRouter,
} from '@tanstack/react-router'
import { describe, expect, it } from 'vitest'

import { ClientsByUseCase } from '../ClientsByUseCase'
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

describe('ClientsByUseCase', () => {
  it('renders 3 tabs for engagement types', () => {
    renderRouted(<ClientsByUseCase />)
    expect(
      screen.getByRole('button', { name: /product/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /operations/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /platform/i }),
    ).toBeInTheDocument()
  })

  it('switches the active tab when a different tab is clicked', () => {
    renderRouted(<ClientsByUseCase />)
    const opsTab = screen.getByRole('button', { name: /operations/i })
    fireEvent.click(opsTab)
    expect(opsTab.getAttribute('aria-pressed')).toBe('true')
  })

  it('renders at least one tile link in the default tab', () => {
    renderRouted(<ClientsByUseCase />)
    const links = screen.getAllByRole('link')
    expect(
      links.some((l) => l.getAttribute('href')?.startsWith('/clients/')),
    ).toBe(true)
  })
})
