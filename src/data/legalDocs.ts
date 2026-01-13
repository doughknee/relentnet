export interface LegalDoc {
  id: 'msa' | 'sow' | 'sha'
  title: string
  description: string
  lastUpdated: string
}

export const legalDocs: Record<string, LegalDoc> = {
  msa: {
    id: 'msa',
    title: 'Master Services Agreement (MSA)',
    description: 'The governing agreement for all RelentNet services.',
    lastUpdated: 'January 2026',
  },
  sow: {
    id: 'sow',
    title: 'Statement of Work (SOW)',
    description:
      'Defines scope, deliverables, timeline, and acceptance criteria.',
    lastUpdated: 'January 2026',
  },
  sha: {
    id: 'sha',
    title: 'Support & Hosting Agreement (SHA)',
    description: 'Terms for ongoing maintenance, SLAs, and hosting services.',
    lastUpdated: 'January 2026',
  },
}
