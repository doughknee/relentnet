/**
 * What each founder owns, from /about's "How the work splits". Stated once;
 * the homepage founder rows, /process and /about all read it from here.
 */
export const owns = {
  'Brandon Harris': 'Owns what gets built: the vision, the code, the design.',
  'Daniel Velez': 'Owns bringing the work in and keeping it running.',
} as const satisfies Record<string, string>
