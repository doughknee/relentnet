import { createFileRoute } from '@tanstack/react-router'

import { ClientsByEngagementType } from '@/components/clients/ClientsByEngagementType'
import { ClientsFeaturedEngagement } from '@/components/clients/ClientsFeaturedEngagement'
import { ClientsHero, clientsIntro } from '@/components/clients/ClientsHero'
import { ClientsLogoWall } from '@/components/clients/ClientsLogoWall'
import { ClientsPortraitGrid } from '@/components/clients/ClientsPortraitGrid'
import { ClientsResultsBand } from '@/components/clients/ClientsResultsBand'

export const Route = createFileRoute('/clients/')({
  head: () => ({
    meta: [
      { title: 'Our Clients | RelentNet Case Studies' },
      {
        name: 'description',
        content:
          'Diagnostic-first proof from RelentNet client engagements, showing how diagnosed workflow friction becomes useful systems and clearer operations.',
      },
    ],
  }),
  component: ClientsIndex,
})

// Re-exported for legacy test compatibility — Task 25 removes these in
// favor of clientsIntro / clientsCta and updates -clients.test.ts.
export const portfolioIntro = clientsIntro
export const portfolioCta = {
  headline: 'See the friction in your own operation?',
  body: 'Start with a workflow diagnostic before deciding what should be built.',
  label: 'Start With a Diagnostic',
  to: '/diagnostic',
} as const

const PORTRAIT_GRID_ID = 'client-stories'

function ClientsIndex() {
  return (
    <div className="min-h-screen overflow-hidden">
      <ClientsHero scrollTargetId={PORTRAIT_GRID_ID} />

      {/* Bands 3–9 land here in subsequent tasks. */}
      <div id={PORTRAIT_GRID_ID}>
        <ClientsPortraitGrid />
      </div>

      <ClientsResultsBand />

      <ClientsLogoWall />

      <ClientsByEngagementType />

      <ClientsFeaturedEngagement />
    </div>
  )
}
