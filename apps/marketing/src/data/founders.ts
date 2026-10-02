import { caseStudies } from '@/data/caseStudies'

/**
 * What each founder owns, from /about's "How the work splits". Stated once;
 * the homepage founder rows, /process and /about all read it from here.
 */
export const owns = {
  'Brandon Harris': 'Owns what gets built: the vision, the code, the design.',
  'Daniel Velez': 'Owns bringing the work in and keeping it running.',
} as const satisfies Record<string, string>

/** Extra /about spec rows per founder. A founder with no entry gets none;
 *  an empty value omits its row. */
export const extraSpecs: Record<
  'Brandon Harris' | 'Daniel Velez',
  ReadonlyArray<{ label: string; value: string }>
> = {
  'Brandon Harris': [
    { label: 'Built', value: caseStudies.map((s) => s.name).join(', ') },
  ],
  'Daniel Velez': [{ label: 'Also runs', value: 'Function IT Services' }],
}
