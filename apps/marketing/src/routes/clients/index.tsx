import { createFileRoute } from '@tanstack/react-router'

import { ClientsBuildingTogether } from '@/components/clients/ClientsBuildingTogether'
import { ClientsBySize } from '@/components/clients/ClientsBySize'
import { ClientsBySolution } from '@/components/clients/ClientsBySolution'
import { ClientsByUseCase } from '@/components/clients/ClientsByUseCase'
import { ClientsHero, clientsIntro } from '@/components/clients/ClientsHero'
import { ClientsMeasurableResults } from '@/components/clients/ClientsMeasurableResults'
import { ClosingCtaPair, clientsCta } from '@/components/clients/ClosingCtaPair'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/clients/')({
  head: () =>
    seo({
      title: 'Our Clients | RelentNet Case Studies',
      description:
        'Diagnostic-first proof from RelentNet client engagements, showing how diagnosed workflow friction becomes useful systems and clearer operations.',
      path: '/clients',
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
      <ClientsMeasurableResults />
      <ClientsBySize />
      <ClientsBuildingTogether />
      <ClientsByUseCase />
      <ClientsBySolution />
      <ClosingCtaPair />
    </div>
  )
}
