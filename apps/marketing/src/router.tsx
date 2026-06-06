import { createRouter } from '@tanstack/react-router'

import { routeTree } from './routeTree.gen'
import { NotFound } from '@/components/NotFound'

export function getRouter() {
  const router = createRouter({
    routeTree,
    context: {},
    defaultPreload: 'intent',
    scrollRestoration: true,
    defaultStructuralSharing: true,
    defaultPreloadStaleTime: 0,
    // Render the branded 404 for notFound() thrown from route loaders
    // (e.g. an unknown /clients/$slug or /legal/$docId), not just for
    // unmatched paths.
    defaultNotFoundComponent: NotFound,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
