import { HeadContent, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import StarParticles from '@/components/StarParticles'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { NotFound } from '@/components/NotFound'
import { seo } from '@/lib/seo'

export const Route = createRootRoute({
  // Site-wide defaults. Individual routes override these via the `seo()`
  // helper. charset/viewport live in index.html so they reach crawlers
  // without JS. The canonical link is intentionally omitted here so that
  // only the matched leaf route emits one (avoids duplicate canonicals).
  head: () => ({
    meta: seo({}).meta,
  }),
  notFoundComponent: NotFound,
  component: () => {
    return (
      <div className="min-h-screen bg-page text-ink font-sans selection:bg-gold selection:text-black">
        <HeadContent />
        <StarParticles />
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
        {import.meta.env.DEV && (
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        )}
      </div>
    )
  },
})
