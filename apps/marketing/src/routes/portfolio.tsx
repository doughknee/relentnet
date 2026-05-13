import { Link, createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { BrowserFrame } from '@/components/BrowserFrame'

export const Route = createFileRoute('/portfolio')({
  head: () => ({
    meta: [
      { title: 'The Work | RelentNet Portfolio' },
      {
        name: 'description',
        content:
          'A curated collection of bespoke digital experiences — crafted with intention, built without compromise.',
      },
    ],
  }),
  component: Portfolio,
})

interface Project {
  name: string
  url: string
  category: string
  description: string
}

const projects: Array<Project> = [
  {
    name: 'Scrollr',
    url: 'https://myscrollr.relentnet.dev',
    category: 'SaaS Platform',
    description:
      'A customizable signal ticker built for traders and analysts. Real-time data feeds, personalized dashboards, and Chrome extension integration.',
  },
  {
    name: 'Cambridge Building Group',
    url: 'https://cambridgebg.com',
    category: 'Commercial Construction',
    description:
      "A commanding digital presence for Nashville's premier commercial construction firm. Professional, streamlined, and built to convert.",
  },
  {
    name: 'CourtCommand',
    url: 'https://courtcommand.app',
    category: 'Sports Technology',
    description:
      'A zero-latency, multi-tenant referee engine and sports ticker designed for broadcast environments. Real-time score synchronization built for performance.',
  },
  {
    name: 'Houz2Home',
    url: 'https://houz2home.com',
    category: 'Home Renovations',
    description:
      'Where the difference is in the details. Showcasing craftsmanship and quality for a home renovations company that takes pride in every project.',
  },
  {
    name: 'Star Kids',
    url: 'https://starkids.relentnet.dev',
    category: 'Nonprofit Organization',
    description:
      'A 501(c)(3) empowering children through education, healthcare, nutrition, and mentorship programs nationwide.',
  },
  {
    name: 'VM Homes',
    url: 'https://vm-homes.com',
    category: 'Real Estate',
    description:
      'A premium digital storefront for a St. Pete Beach real estate team. MLS-integrated property search, neighborhood guides, and a client-first experience built to convert.',
  },
]

function ProjectSection({
  project,
  index,
}: {
  project: Project
  index: number
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true)
          io.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 px-6 md:px-12 relative z-10"
    >
      <div className="max-w-6xl mx-auto">
        {/* Number watermark */}
        <span
          className={`block text-[7rem] md:text-[10rem] font-serif text-black/[0.06] dark:text-white/[0.03] leading-none select-none -mb-10 md:-mb-14 ${
            isRevealed ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Browser frame */}
        <div
          className={isRevealed ? 'animate-fade-in-up' : 'opacity-0'}
          style={isRevealed ? { animationDelay: '150ms' } : undefined}
        >
          <BrowserFrame url={project.url} siteName={project.name} />
        </div>

        {/* Project info */}
        <div
          className={`mt-8 md:mt-10 flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-12 ${
            isRevealed ? 'animate-fade-in-up' : 'opacity-0'
          }`}
          style={isRevealed ? { animationDelay: '300ms' } : undefined}
        >
          <div>
            <span className="text-gold text-[10px] tracking-[0.3em] uppercase font-bold">
              {project.category}
            </span>
            <h3 className="text-2xl md:text-3xl font-serif mt-2">
              {project.name}
            </h3>
          </div>
          <p className="text-ink-muted text-sm leading-relaxed max-w-md font-light">
            {project.description}
          </p>
        </div>
      </div>
    </section>
  )
}

function Portfolio() {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* HERO */}
      <section className="min-h-screen flex flex-col justify-center items-center px-6 relative">
        <h1 className="font-serif text-5xl md:text-7xl lg:text-9xl text-center leading-[1.1] animate-fade-in-up">
          The <span className="italic text-gold/90">Work.</span>
        </h1>
        <p
          className="mt-8 text-ink-muted text-sm md:text-base font-light tracking-wide opacity-0 animate-fade-in-up"
          style={{ animationDelay: '200ms' }}
        >
          Crafted with intention. Built without compromise.
        </p>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-pulse delay-1000 z-10">
          <span className="text-[10px] uppercase tracking-widest text-gold">
            Scroll
          </span>
          <div className="w-px h-12 bg-linear-to-b from-gold to-transparent"></div>
        </div>
      </section>

      {/* PROJECTS */}
      {projects.map((project, index) => (
        <ProjectSection key={project.url} project={project} index={index} />
      ))}

      {/* CTA */}
      <section className="py-32 flex flex-col justify-center items-center text-center px-6 relative z-10">
        <p className="text-xs font-bold tracking-[0.3em] text-ink-muted uppercase mb-8">
          Your vision, next
        </p>
        <Link
          to="/inquire"
          className="font-serif text-4xl md:text-7xl hover:italic hover:text-gold transition-all duration-300"
        >
          Start Building.
        </Link>
      </section>
    </div>
  )
}
