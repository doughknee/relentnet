export interface ClientLogo {
  name: string
  /** Path under public/, e.g. /logos/clients/sample-1.svg. */
  logoSrc: string
  /** True until a real client logo replaces the placeholder. */
  isSample: boolean
  url?: string
}

export const clientLogos: ReadonlyArray<ClientLogo> = [
  { name: 'Client One', logoSrc: '/logos/clients/sample-1.svg', isSample: true },
  { name: 'Client Two', logoSrc: '/logos/clients/sample-2.svg', isSample: true },
  { name: 'Client Three', logoSrc: '/logos/clients/sample-3.svg', isSample: true },
  { name: 'Client Four', logoSrc: '/logos/clients/sample-4.svg', isSample: true },
  { name: 'Client Five', logoSrc: '/logos/clients/sample-5.svg', isSample: true },
  { name: 'Client Six', logoSrc: '/logos/clients/sample-6.svg', isSample: true },
  { name: 'Client Seven', logoSrc: '/logos/clients/sample-7.svg', isSample: true },
  { name: 'Client Eight', logoSrc: '/logos/clients/sample-8.svg', isSample: true },
]
