import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'

import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import type { ReactNode } from 'react'

import StarParticles from '@/components/StarParticles'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { NotFound } from '@/components/NotFound'
import { ThemeProvider } from '@/components/ThemeProvider'
import { seo } from '@/lib/seo'
import { siteConfig } from '@/site.config'

import '../styles.css'

// Sets the `dark` class on <html> before paint, from localStorage or the OS
// preference, so there's no theme flash. Mirrors the old index.html bootstrap.
const themeBootstrap = `document.documentElement.classList.toggle('dark', localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches))`

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: siteConfig.name,
  image: `${siteConfig.domain}/logo512.png`,
  url: siteConfig.domain,
  telephone: siteConfig.contact.phoneFormatted,
  priceRange: '$$$$',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Nashville',
    addressRegion: 'TN',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 36.1627,
    longitude: -86.7816,
  },
  areaServed: siteConfig.regions.map((region) => ({
    '@type': 'State',
    name: region,
  })),
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '18:00',
  },
  description: siteConfig.meta.description,
}

export const Route = createRootRoute({
  // Site-wide defaults. Individual routes override these via the `seo()`
  // helper. The canonical link is intentionally omitted here so that only the
  // matched leaf route emits one (avoids duplicate canonicals).
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { name: 'theme-color', content: '#000000' },
      ...seo({}).meta,
    ],
    links: [
      { rel: 'icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', href: '/logo192.png' },
      { rel: 'manifest', href: '/manifest.json' },
    ],
  }),
  notFoundComponent: NotFound,
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <div className="min-h-screen bg-page text-ink font-sans selection:bg-gold selection:text-black">
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
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
