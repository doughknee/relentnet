import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import StarParticles from '@/components/StarParticles'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { NotFound } from '@/components/NotFound'
import { siteConfig } from '@/site.config'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: siteConfig.meta.title,
      },
      {
        name: 'description',
        content: siteConfig.meta.description,
      },
      // Open Graph
      {
        property: 'og:title',
        content: siteConfig.meta.title,
      },
      {
        property: 'og:description',
        content: siteConfig.meta.description,
      },
      {
        property: 'og:image',
        content: `${siteConfig.domain}${siteConfig.meta.ogImage}`,
      },
      {
        property: 'og:url',
        content: siteConfig.domain,
      },
      {
        property: 'og:type',
        content: 'website',
      },
      // Twitter
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: siteConfig.meta.title,
      },
      {
        name: 'twitter:description',
        content: siteConfig.meta.description,
      },
      {
        name: 'twitter:image',
        content: `${siteConfig.domain}${siteConfig.meta.ogImage}`,
      },
    ],
  }),
  notFoundComponent: NotFound,
  component: () => {
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

    return (
      <div className="min-h-screen bg-page text-ink font-sans selection:bg-gold selection:text-black">
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <StarParticles />
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
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
      </div>
    )
  },
})
