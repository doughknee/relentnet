import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  Header,
  activeLinkClasses,
  linkClasses,
  primaryNavItems,
  utilityCta,
} from './Header'
import { ThemeContext } from '@/hooks/useTheme'

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    to,
    children,
    className,
    onClick,
  }: {
    to: string
    children: unknown
    className?: string
    onClick?: () => void
  }) => (
    <a
      href={to}
      className={className}
      onClick={(e) => {
        e.preventDefault()
        onClick?.()
      }}
    >
      {children as never}
    </a>
  ),
}))

describe('Header navigation (v4)', () => {
  it('exposes the diagnostic as the first public buying path', () => {
    expect(primaryNavItems[0]).toEqual({
      label: 'Diagnostic',
      to: '/diagnostic',
    })
    // About sits after the proof and before Portal: it answers "who are these
    // people" once the work has already made the case, and Portal is a client
    // door rather than part of the buying path.
    expect(primaryNavItems.map((item) => item.label)).toEqual([
      'Diagnostic',
      'Process',
      'Client Work',
      'About',
      'Portal',
    ])
    expect(utilityCta).toEqual({
      label: 'Book a Free Diagnostic',
      to: '/inquire',
    })
  })

  it('uses router active props instead of active class selectors', () => {
    expect(linkClasses).not.toContain('[&.active]')
    expect(activeLinkClasses).toBe('text-gold-text')
  })
})

describe('Header mobile menu', () => {
  beforeEach(() => {
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })
    render(
      <ThemeContext.Provider
        value={{ choice: 'dark', effective: 'dark', setChoice: vi.fn() }}
      >
        <Header />
      </ThemeContext.Provider>,
    )
  })

  it('opens, moves focus in, and locks body scroll', async () => {
    const button = screen.getByRole('button', { name: 'Open menu' })
    expect(button).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(button)

    const toggle = screen.getByRole('button', { name: 'Close menu' })
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    const panel = document.getElementById(
      toggle.getAttribute('aria-controls') ?? '',
    )
    expect(panel).not.toBeNull()
    expect(panel).toContainElement(document.activeElement as HTMLElement)
    expect(document.activeElement).toHaveTextContent('Diagnostic')
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('closes on Escape and returns focus to the button', async () => {
    await userEvent.click(screen.getByRole('button', { name: 'Open menu' }))
    await userEvent.keyboard('{Escape}')

    const button = screen.getByRole('button', { name: 'Open menu' })
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(button).toHaveFocus()
    expect(document.body.style.overflow).toBe('')
  })

  it('closes on a link click and on an outside click', async () => {
    await userEvent.click(screen.getByRole('button', { name: 'Open menu' }))
    const panelLink = screen
      .getAllByRole('link', { name: 'Process' })
      .find((a) => a.className.includes('border-b'))
    if (!panelLink) throw new Error('panel link missing')
    await userEvent.click(panelLink)
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveFocus()

    await userEvent.click(screen.getByRole('button', { name: 'Open menu' }))
    await userEvent.click(document.body)
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })
})
