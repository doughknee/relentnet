export interface ClientSolution {
  label: string
  href: '/diagnostic' | '/process' | '/inquire' | '/clients'
  /** One-line description shown on the solution card. */
  blurb: string
}

/**
 * Solution cards for the /clients "Customers by solution" section. Each pairs
 * a RelentNet capability with a one-line description.
 */
export const clientSolutions: ReadonlyArray<ClientSolution> = [
  {
    label: 'Diagnose workflow friction',
    href: '/diagnostic',
    blurb: 'We map where the work actually snags before prescribing software.',
  },
  {
    label: 'Rebuild brittle systems',
    href: '/process',
    blurb:
      'Replace fragile, inherited code with a foundation that can carry the product.',
  },
  {
    label: 'Ship cross-platform products',
    href: '/process',
    blurb: 'One codebase, native everywhere — desktop, web, and mobile.',
  },
  {
    label: 'Stage credibility for sales',
    href: '/process',
    blurb: 'A front door that makes capability legible in the first few seconds.',
  },
  {
    label: 'Build premium client experiences',
    href: '/process',
    blurb: 'Interfaces that earn trust before a prospect ever reaches out.',
  },
  {
    label: 'Operate real-time infrastructure',
    href: '/process',
    blurb: 'Low-latency cores that keep every surface in sync under pressure.',
  },
  {
    label: 'Automate back-office operations',
    href: '/diagnostic',
    blurb: 'Turn manual, error-prone busywork into pipelines that run themselves.',
  },
  {
    label: 'Steward systems over time',
    href: '/inquire',
    blurb: 'We host, monitor, and keep improving the systems we build.',
  },
]
