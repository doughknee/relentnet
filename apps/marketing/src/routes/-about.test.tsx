import { render, screen, within } from '@testing-library/react'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import {
  FOUNDED_MONTH,
  FOUNDED_YEAR,
  Route,
  aboutSections,
  founders,
} from './about'
import { stats } from './index'
import { founderSpec } from '@/components/AboutFounder'
import { primaryNavItems } from '@/components/Header'
import { siteConfig } from '@/site.config'

vi.mock('@tanstack/react-router', async () => ({
  ...(await vi.importActual('@tanstack/react-router')),
  Link: ({
    to,
    children,
    className,
  }: {
    to: string
    children: unknown
    className?: string
  }) => (
    <a href={to} className={className}>
      {children as never}
    </a>
  ),
}))

beforeAll(() => {
  // jsdom has neither; Motion's in-view triggers and the theme need both.
  class NoopObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
  }
  vi.stubGlobal('IntersectionObserver', NoopObserver)
  vi.stubGlobal('ResizeObserver', NoopObserver)
  vi.stubGlobal(
    'matchMedia',
    (query: string) =>
      ({
        matches: false,
        media: query,
        addEventListener() {},
        removeEventListener() {},
        addListener() {},
        removeListener() {},
      }) as unknown as MediaQueryList,
  )
})

const About = Route.options.component as React.ComponentType

const original = {
  'Brandon Harris': { ...siteConfig.founders['Brandon Harris'] },
  'Daniel Velez': { ...siteConfig.founders['Daniel Velez'] },
}

afterEach(() => {
  siteConfig.founders['Brandon Harris'] = { ...original['Brandon Harris'] }
  siteConfig.founders['Daniel Velez'] = { ...original['Daniel Velez'] }
})

describe('about page content', () => {
  it('names both founders', () => {
    // The page's entire argument is that the company is these two people, so
    // it fails if either name goes missing.
    expect(founders.map((f) => f.name)).toEqual([
      'Brandon Harris',
      'Daniel Velez',
    ])
  })

  it('agrees with the homepage about when the company started', () => {
    // The homepage states tenure as a date in its stat ledger. Two pages
    // claiming different founding years is the kind of thing nobody notices
    // until a client does.
    const tenure = stats.find((s) => s.label === 'In business')
    if (!tenure) throw new Error('tenure stat missing from the homepage')
    expect(tenure.value).toBe(FOUNDED_YEAR)
  })

  it('puts the founders in the same cities the footer does', () => {
    // The site claimed Nashville alone in four places while Dan works from New
    // Orleans. Both now read from siteConfig, and this is what stops them
    // drifting apart again.
    expect(founders.map((f) => f.city)).toEqual(
      siteConfig.locations.map((l) => l.city),
    )
  })

  it('keeps the honest answer on the page', () => {
    // "Don't build yet" is the site's least commercial and most load-bearing
    // claim. If About stops saying it, the page is just a bio.
    const prose = aboutSections.flatMap((s) => s.body).join(' ')
    expect(prose).toContain('don’t build yet')
  })

  it('is reachable from the primary nav', () => {
    // A page nothing links to is a page nobody reads.
    expect(primaryNavItems.map((item) => item.to)).toContain('/about')
  })
})

describe('about redesign (REL-525)', () => {
  const since = `${FOUNDED_MONTH} ${FOUNDED_YEAR}`

  it('shows Brandon as a large portrait, with a 1x for srcset and a second shot', () => {
    render(<About />)
    const block = screen.getByTestId('about-founder-brandon')
    const portrait = within(block).getByAltText(/^Brandon Harris, Co-founder/)
    expect(portrait.getAttribute('src')).toBe('/brandon-harris-about.webp')
    expect(portrait.getAttribute('srcset')).toContain(
      '/brandon-harris-about-520.webp 520w',
    )
    expect(portrait.getAttribute('width')).toBe('1040')
    expect(
      within(block)
        .getByAltText(/second portrait/)
        .getAttribute('src'),
    ).toBe('/brandon-harris.webp')
    // The group photo keeps its own band.
    expect(screen.getByAltText(/setting up a livestream/)).toBeTruthy()
  })

  it('lists only facts the site already states in the spec rows', () => {
    expect(founderSpec(founders[0], since)).toEqual([
      { label: 'Role', value: 'Co-founder & CEO' },
      { label: 'Based', value: 'Nashville, TN' },
      { label: 'Building since', value: 'May 2022' },
    ])
    expect(founderSpec(founders[1], since)).toEqual([
      { label: 'Role', value: 'Co-founder & COO' },
      { label: 'Based', value: 'New Orleans, LA' },
      { label: 'Building since', value: 'May 2022' },
    ])
  })

  it('renders no credential or LinkedIn with the current config', () => {
    const { container } = render(<About />)
    expect(screen.queryByText('Credential')).toBeNull()
    expect(screen.queryByText('LinkedIn')).toBeNull()
    expect(container.innerHTML).not.toContain('linkedin.com')
    expect(container.innerHTML).not.toContain('[placeholder')
  })

  it('renders credential and LinkedIn rows once they are supplied', () => {
    siteConfig.founders['Brandon Harris'].credential = 'A real credential'
    siteConfig.founders['Brandon Harris'].linkedin =
      'https://example.com/in/brandon'
    render(<About />)
    const block = screen.getByTestId('about-founder-brandon')
    expect(within(block).getByText('A real credential')).toBeTruthy()
    const link = within(block).getByRole('link', { name: /LinkedIn/ })
    expect(link.getAttribute('href')).toBe('https://example.com/in/brandon')
    // Daniel has supplied nothing, so his block still has neither row.
    const daniel = screen.getByTestId('about-founder-daniel')
    expect(within(daniel).queryByText('Credential')).toBeNull()
    expect(within(daniel).queryByText('LinkedIn')).toBeNull()
  })

  it('renders Daniel without a portrait until one is set', () => {
    render(<About />)
    const daniel = screen.getByTestId('about-founder-daniel')
    expect(daniel.querySelector('img')).toBeNull()
    expect(daniel.querySelector('figure')).toBeNull()
    expect(within(daniel).getByText('Daniel Velez')).toBeTruthy()
  })

  it("renders Daniel's portrait once the field is set", () => {
    siteConfig.founders['Daniel Velez'].portrait = '/daniel-test.webp'
    render(<About />)
    const daniel = screen.getByTestId('about-founder-daniel')
    expect(daniel.querySelector('img')?.getAttribute('src')).toBe(
      '/daniel-test.webp',
    )
  })

  it('keeps all five story sections', () => {
    render(<About />)
    for (const section of aboutSections) {
      expect(screen.getByText(section.title)).toBeTruthy()
    }
  })
})
