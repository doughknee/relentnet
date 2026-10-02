import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'

import { SOWContent } from '@/components/legal/LegalContents'

describe('SOW legal content', () => {
  it('renders the Workflow Diagnostic and Refund section', () => {
    const { container } = render(<SOWContent />)
    const text = container.textContent
    expect(text).toContain('Workflow Diagnostic and Refund')
    expect(text).toContain('fourteen (14) days')
    expect(text).toContain('once per business')
  })

  it('numbers sections 1 to 8 with no gaps', () => {
    const { container } = render(<SOWContent />)
    const numbers = [...container.querySelectorAll('h2')].map((h) =>
      Number.parseInt(h.textContent, 10),
    )
    expect(numbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
  })
})
