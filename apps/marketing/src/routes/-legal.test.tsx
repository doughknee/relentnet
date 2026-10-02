import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'

import { legalHtml, legalMarkdown } from '@/data/legalHtml'

function renderDoc(id: string) {
  return render(
    <div
      className="legal-prose"
      dangerouslySetInnerHTML={{ __html: legalHtml[id] }}
    />,
  )
}

describe('legal pages render from docs/*.md', () => {
  it.each(['msa', 'sow', 'sha'])('%s renders every Markdown H2', (id) => {
    const expected = legalMarkdown[id].match(/^## /gm)?.length
    const { container } = renderDoc(id)
    expect(expected).toBeGreaterThan(0)
    expect(container.querySelectorAll('h2')).toHaveLength(expected ?? -1)
    expect(container.querySelector('h1')).toBeNull()
  })
})

describe('SOW legal content', () => {
  it('renders the Workflow Diagnostic and Refund section', () => {
    const { container } = renderDoc('sow')
    const text = container.textContent
    expect(text).toContain('Workflow Diagnostic and Refund')
    expect(text).toContain('fourteen (14) days')
    expect(text).toContain('once per business')
  })

  it('numbers sections 1 to 8 with no gaps', () => {
    const { container } = renderDoc('sow')
    const numbers = [...container.querySelectorAll('h2')].map((h) =>
      Number.parseInt(h.textContent, 10),
    )
    expect(numbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
  })
})
