import { createFileRoute } from '@tanstack/react-router'

import { ClientsBuildingTogether } from '@/components/clients/ClientsBuildingTogether'
import { ClientsBySize } from '@/components/clients/ClientsBySize'
import { ClientsBySolution } from '@/components/clients/ClientsBySolution'
import { ClientsByUseCase } from '@/components/clients/ClientsByUseCase'
import { ClientsFeaturedTiles } from '@/components/clients/ClientsFeaturedTiles'
import { ClientsHero, clientsIntro } from '@/components/clients/ClientsHero'
import { ClientsLogoStrip } from '@/components/clients/ClientsLogoStrip'
import { ClientsMeasurableResults } from '@/components/clients/ClientsMeasurableResults'
import { ClosingCtaPair, clientsCta } from '@/components/clients/ClosingCtaPair'

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

// Re-exported for the migrated test file.
export { clientsIntro, clientsCta }

const ALL_STORIES_ID = 'all-stories'

function ClientsIndex() {
  return (
    <div className="min-h-screen overflow-hidden">
      <ClientsHero scrollTargetId={ALL_STORIES_ID} />
      <ClientsFeaturedTiles />
      <ClientsMeasurableResults />
      <ClientsLogoStrip />
      <ClientsBySize />
      <ClientsBuildingTogether />
      <ClientsByUseCase />
      <ClientsBySolution />
      <ClosingCtaPair />
    </div>
  )
}
