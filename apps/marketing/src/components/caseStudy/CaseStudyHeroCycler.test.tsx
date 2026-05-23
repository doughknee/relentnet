import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { CaseStudyHeroCycler } from './CaseStudyHeroCycler'

import type { CaseStudyHeroBeat } from '@/data/caseStudies'

const beats: ReadonlyArray<CaseStudyHeroBeat> = [
  {
    sectionRef: 'challenge',
    blurb: 'Challenge blurb',
    image: {
      src: '/test/challenge.webp',
      alt: 'Challenge image',
      width: 800,
      height: 450,
    },
  },
  {
    sectionRef: 'diagnosis',
    blurb: 'Diagnosis blurb',
    image: {
      src: '/test/diagnosis.webp',
      alt: 'Diagnosis image',
      width: 800,
      height: 450,
    },
  },
]

describe('CaseStudyHeroCycler', () => {
  it('renders the first beat by default', () => {
    render(<CaseStudyHeroCycler beats={beats} />)
    expect(screen.getByText('Challenge blurb')).toBeInTheDocument()
  })

  it('renders one progress button per beat with accessible labels', () => {
    render(<CaseStudyHeroCycler beats={beats} />)
    expect(
      screen.getByRole('button', { name: /show challenge beat/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /show diagnosis beat/i }),
    ).toBeInTheDocument()
  })

  it('switches active beat when a progress button is clicked', async () => {
    const user = userEvent.setup()
    render(<CaseStudyHeroCycler beats={beats} />)
    await user.click(screen.getByRole('button', { name: /show diagnosis beat/i }))
    expect(screen.getByText('Diagnosis blurb')).toBeInTheDocument()
  })

  it('renders no buttons when beats is empty', () => {
    render(<CaseStudyHeroCycler beats={[]} />)
    expect(screen.queryAllByRole('button')).toHaveLength(0)
  })

  it('auto-advances on the configured interval', () => {
    vi.useFakeTimers()
    try {
      render(<CaseStudyHeroCycler beats={beats} intervalMs={4500} />)
      expect(screen.getByText('Challenge blurb')).toBeInTheDocument()
      act(() => {
        vi.advanceTimersByTime(4500)
      })
      expect(screen.getByText('Diagnosis blurb')).toBeInTheDocument()
      act(() => {
        vi.advanceTimersByTime(4500)
      })
      // Wraps back to the first beat
      expect(screen.getByText('Challenge blurb')).toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })
})
