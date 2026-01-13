import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import StarParticles from '@/components/StarParticles'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { NotFound } from '@/components/NotFound'

export const Route = createRootRoute({
  notFoundComponent: NotFound,
  component: () => {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: 'RelentNet',
      image: 'https://relentnet.com/logo512.png',
      url: 'https://relentnet.com',
      telephone: '+1-727-616-1060',
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
      areaServed: [
        { '@type': 'State', name: 'Tennessee' },
        { '@type': 'State', name: 'Louisiana' },
        { '@type': 'State', name: 'Georgia' },
        { '@type': 'State', name: 'Florida' },
      ],
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
      description:
        'Bespoke digital creation and white-glove website management. We build digital legacies with radical human attention.',
    }

    return (
      <>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <StarParticles />
        <Header />
        <Outlet />
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
      </>
    )
  },
})
