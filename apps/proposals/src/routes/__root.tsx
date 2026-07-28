import { HeadContent, Outlet, createRootRoute } from '@tanstack/react-router'

import { marketingOrigin } from '@/data/content'

export const Route = createRootRoute({
  head: () => ({
    meta: [{ title: 'Proposal Studio · RelentNet' }],
  }),
  notFoundComponent: NotFound,
  component: RootComponent,
})

function RootComponent() {
  return (
    <div className="min-h-screen bg-page text-ink font-sans selection:bg-gold selection:text-black">
      <HeadContent />
      <Outlet />
    </div>
  )
}

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center px-6 gap-6">
      <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-gold">
        RelentNet
      </p>
      <h1 className="font-serif text-4xl md:text-5xl">Page not found.</h1>
      <p className="text-sm text-ink-muted max-w-md leading-relaxed">
        If you followed a proposal link, it may have been retired. Reply to us
        and we&rsquo;ll send a fresh one.
      </p>
      <a
        href={marketingOrigin}
        className="mt-4 border border-line px-6 py-3 text-xs tracking-widest uppercase hover:bg-gold hover:border-gold hover:text-black transition-all duration-500"
      >
        relentnet.com
      </a>
    </div>
  )
}
