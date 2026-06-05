import { render } from '@testing-library/react'
import { siReact } from 'simple-icons'
import { describe, expect, it } from 'vitest'

import { BrandIcon } from './BrandIcon'

describe('BrandIcon', () => {
  it('renders a known simple-icons slug as the matching brand SVG', () => {
    // The simple-icons branch should render a <path> whose `d`
    // attribute matches the slug's path data. This distinguishes it
    // from the lucide fallback, which has no inline <path d="…"> match.
    const { container } = render(<BrandIcon slug="react" label="React" />)
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg?.getAttribute('aria-label')).toBe('React')
    const path = svg?.querySelector('path')
    expect(path?.getAttribute('d')).toBe(siReact.path)
  })

  it('falls back to the lucide Box icon when the slug is unknown', () => {
    // The lucide Box icon is composed of <rect>/<path> primitives with
    // stroke (not a single `d` attribute matching any simple-icons
    // entry). Asserting we did NOT get siReact's path proves the
    // fallback branch ran instead of the simple-icons branch.
    const { container } = render(
      <BrandIcon slug="not-a-real-brand" label="Mystery" />,
    )
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg?.getAttribute('aria-label')).toBe('Mystery')
    const path = svg?.querySelector('path')
    expect(path?.getAttribute('d')).not.toBe(siReact.path)
  })

  it('renders without a slug by falling back to lucide', () => {
    const { container } = render(<BrandIcon label="Plain" />)
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg?.getAttribute('aria-label')).toBe('Plain')
    const path = svg?.querySelector('path')
    expect(path?.getAttribute('d')).not.toBe(siReact.path)
  })
})
