/** Who the Workflow Diagnostic is and is not for. Shared by /diagnostic and
 *  /inquire so the two lists cannot drift apart. */
export const diagnosticFit = {
  goodFit: [
    'Owner-led businesses',
    'Teams with repeated manual admin',
    'Companies deciding whether custom software is worth building',
  ],
  notFit: [
    'Commodity brochure sites',
    'One-off landing pages',
    'Teams that want software before defining the workflow',
  ],
} as const
