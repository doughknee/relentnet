import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  RouterContextProvider,
  createMemoryHistory,
  createRouter,
} from '@tanstack/react-router'

import { Route, studies } from './clients/index'
import { caseStudies } from '@/data/caseStudies'
import { formatProof, proofStats } from '@/data/proof'
import { routeTree } from '@/routeTree.gen'

function renderPage() {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ['/clients'] }),
  })
  const Page = Route.options.component as () => React.JSX.Element
  return render(
    <RouterContextProvider router={router}>
      <Page />
    </RouterContextProvider>,
  )
}

describe('proof band', () => {
  it('states the three homepage figures', () => {
    expect(proofStats.map(formatProof)).toEqual([
      '10,000+',
      '99.99%',
      'Since 2022',
    ])
    renderPage()
    const band = screen.getByTestId('proof-band')
    expect(within(band).getByText('10,000+')).toBeInTheDocument()
    expect(
      within(band).getByText('Hours of admin automated'),
    ).toBeInTheDocument()
    expect(within(band).getByText('99.99%')).toBeInTheDocument()
    expect(within(band).getByText('Since 2022')).toBeInTheDocument()
  })
})

describe('study cards', () => {
  it('shows each heroQuote verbatim with its attribution', () => {
    renderPage()
    const quotes = screen.getAllByTestId('card-quote')
    for (const s of studies) {
      const study = caseStudies.find((c) => c.slug === s.slug)
      const hq = study?.heroQuote
      if (!hq) continue
      const card = quotes.find((q) => q.textContent.includes(hq))
      expect(card, `${s.slug} quote`).toBeDefined()
      const a = study.testimonial?.attribution
      expect(card?.textContent).toContain(a?.name)
      expect(card?.textContent).toContain(a?.role)
    }
  })

  it('renders no placeholder text', () => {
    const { container } = renderPage()
    expect(container.textContent).not.toMatch(/\[placeholder/i)
  })
})

describe('mid-page CTA', () => {
  it('links to /inquire, after study 02 and before study 03', () => {
    renderPage()
    const cta = screen.getByTestId('mid-cta')
    expect(
      within(cta).getByRole('link', { name: /book a call/i }),
    ).toHaveAttribute('href', '/inquire')
    const rows = screen.getAllByTestId('study-row')
    expect(
      rows[1].compareDocumentPosition(cta) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    expect(
      cta.compareDocumentPosition(rows[2]) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })

  it('keeps the NDA line', () => {
    renderPage()
    expect(
      screen.getByText(/Four we can show in full\. The rest run under NDA\./),
    ).toBeInTheDocument()
  })
})
