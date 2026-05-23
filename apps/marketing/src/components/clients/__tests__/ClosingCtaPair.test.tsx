import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  RouterContextProvider,
  createMemoryHistory,
  createRouter,
} from '@tanstack/react-router'

import { ClosingCtaPair, clientsCta } from '../ClosingCtaPair'
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

describe('ClosingCtaPair', () => {
  it('renders exactly two CTA tiles', () => {
    renderRouted(<ClosingCtaPair />)
    expect(
      screen.getByRole('heading', { name: /always know what you'll pay/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /start a conversation/i }),
    ).toBeInTheDocument()
  })

  it('first tile links to /diagnostic', () => {
    renderRouted(<ClosingCtaPair />)
    const diagnostic = screen.getByRole('link', { name: /start a diagnostic/i })
    expect(diagnostic.getAttribute('href')).toBe('/diagnostic')
  })

  it('second tile links to /inquire', () => {
    renderRouted(<ClosingCtaPair />)
    const inquire = screen.getByRole('link', { name: /^inquire$/i })
    expect(inquire.getAttribute('href')).toBe('/inquire')
  })

  it('exports a legacy clientsCta constant with primary tile copy', () => {
    expect(clientsCta.headline).toMatch(/pay/i)
    expect(clientsCta.label).toMatch(/diagnostic/i)
    expect(clientsCta.to).toBe('/diagnostic')
  })
})
