import { createFileRoute } from '@tanstack/react-router'

import { NotFound } from '@/components/NotFound'
import { seo } from '@/lib/seo'

// Prerendered to dist/client/404.html (see vite.config.ts) and served by
// nginx as the body of every unknown-URL 404. No canonical: it isn't a page.
export const Route = createFileRoute('/404')({
  head: () =>
    seo({
      title: 'Page not found | RelentNet',
      description: 'This page does not exist.',
      noindex: true,
    }),
  component: NotFound,
})
