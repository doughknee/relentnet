import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import { ThemeProvider } from '@/components/ThemeProvider'
import { NotFound } from '@/components/NotFound'

import './styles.css'

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
  // Render the branded 404 for notFound() thrown from route loaders
  // (e.g. an unknown /clients/$slug or /legal/$docId), not just for
  // unmatched paths. Without this they fall back to the bare default.
  defaultNotFoundComponent: NotFound,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>,
  )
}
