import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/sow')({
  beforeLoad: () => {
    throw redirect({
      to: '/legal/$docId',
      params: { docId: 'sow' },
    })
  },
  component: () => null,
})
