import { createFileRoute, Link } from '@tanstack/react-router'
import { ExternalLink } from 'lucide-react'

export const Route = createFileRoute('/portfolio')({
  head: () => ({
    meta: [
      { title: 'The Work | RelentNet Portfolio' },
      {
        name: 'description',
        content:
          'A curated selection of digital experiences crafted with precision. Featuring VM Homes, Cambridge Building Group, and Scrollr.',
      },
    ],
  }),
  component: Portfolio,
})

function Portfolio() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e5e5] font-sans selection:bg-[#E1BE4C] selection:text-black overflow-hidden">
      {/* HERO SECTION */}
      <section className="pt-48 pb-24 px-4 flex flex-col justify-center items-center relative">
        <h1 className="relative z-10 font-serif text-5xl md:text-7xl text-center leading-[1.1] animate-fade-in-up">
          Curated <br />
          <span className="italic text-[#E1BE4C]/90">Excellence.</span>
        </h1>
        <p className="mt-8 max-w-2xl text-center text-neutral-400 font-light text-lg leading-relaxed animate-fade-in-up delay-200">
          A selection of digital experiences crafted with precision, purpose,
          and an unyielding commitment to quality.
        </p>
      </section>

      {/* WORK GALLERY */}
      <section className="py-32 px-6 md:px-20 relative z-10 bg-[#050505]/50 backdrop-blur-sm border-y border-white/10">
        <div className="max-w-6xl mx-auto space-y-32">
          {/* Project 1 */}
          <div
            className="group relative animate-fade-in-up opacity-0"
            style={{ animationDelay: '200ms' }}
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
              <div className="md:col-span-8 relative overflow-hidden aspect-video bg-neutral-900 border border-white/5 group-hover:border-[#E1BE4C]/30 transition-colors duration-500">
                {/* Placeholder for Project Image */}
                <div className="absolute inset-0 z-10">
                  <img
                    src="/vmh_portfolio.png"
                    className="object-cover h-full"
                  />
                  <a
                    className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 text-white text-center p-4 z-20"
                    href="https://vm-homes.com"
                  >
                    <ExternalLink className="mr-2" size={32} />
                  </a>
                </div>
              </div>
              <div className="md:col-span-4 space-y-6">
                <span className="text-[#E1BE4C] text-[10px] tracking-[0.3em] uppercase mb-2 block">
                  Real Estate
                </span>
                <h3 className="text-3xl md:text-4xl font-serif text-white">
                  VM Homes
                </h3>
                <p className="text-neutral-500 leading-relaxed text-sm">
                  A comprehensive and robust real estate platform serving the
                  St. Pete area. Engineered with complex MLS integration and
                  high-performance search functionality, this site prioritizes
                  utility and speed without sacrificing aesthetic.
                </p>
                <ul className="text-xs text-neutral-600 uppercase tracking-widest space-y-2 border-l border-white/10 pl-4">
                  <li>MLS Integration</li>
                  <li>Comprehensive Search</li>
                  <li>High Functionality</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Project 2 */}
          <div
            className="group relative animate-fade-in-up opacity-0"
            style={{ animationDelay: '400ms' }}
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
              <div className="md:col-span-4 order-2 md:order-1 space-y-6 md:text-right">
                <span className="text-[#E1BE4C] text-[10px] tracking-[0.3em] uppercase mb-2 block">
                  Construction
                </span>
                <h3 className="text-3xl md:text-4xl font-serif text-white">
                  Cambridge <br /> Building Group
                </h3>
                <p className="text-neutral-500 leading-relaxed text-sm">
                  A streamlined, professional digital presence for a
                  Nashville-based construction firm. The design reflects the
                  city's character while maintaining a focused, no-nonsense user
                  experience that drives business objectives.
                </p>
                <ul className="text-xs text-neutral-600 uppercase tracking-widest space-y-2 border-r border-white/10 pr-4 md:border-l-0 md:border-r">
                  <li>Nashville Centric</li>
                  <li>Professional Build</li>
                  <li>Streamlined UX</li>
                </ul>
              </div>
              <div className="md:col-span-8 order-1 md:order-2 relative overflow-hidden aspect-video bg-neutral-900 border border-white/5 group-hover:border-[#E1BE4C]/30 transition-colors duration-500">
                {/* Placeholder for Project Image */}
                <div className="absolute inset-0 z-10">
                  <img
                    src="/cbg_portfolio.png"
                    className="object-cover h-full"
                  />
                  <a
                    className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 text-white text-center p-4 z-20"
                    href="https://cambridgebg.com"
                  >
                    <ExternalLink className="mr-2" size={32} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Project 3 */}
          <div
            className="group relative animate-fade-in-up opacity-0"
            style={{ animationDelay: '600ms' }}
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
              <div className="md:col-span-8 relative overflow-hidden aspect-video bg-neutral-900 border border-white/5 group-hover:border-[#E1BE4C]/30 transition-colors duration-500">
                {/* Placeholder for Project Image */}
                <div className="absolute inset-0 z-10">
                  <img
                    src="/scrollr_portfolio.png"
                    className="object-cover h-full"
                  />
                  <a
                    className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 text-white text-center p-4 z-20"
                    href="https://myscrollr.com"
                  >
                    <ExternalLink className="mr-2" size={32} />
                  </a>
                </div>
              </div>
              <div className="md:col-span-4 space-y-6">
                <span className="text-[#E1BE4C] text-[10px] tracking-[0.3em] uppercase mb-2 block">
                  Technology
                </span>
                <h3 className="text-3xl md:text-4xl font-serif text-white">
                  Scrollr
                </h3>
                <p className="text-neutral-500 leading-relaxed text-sm">
                  A complete digital overhaul for an innovative productivity
                  tool. This project encompassed a full app redesign, a
                  high-converting marketing site, and the engineering of a
                  custom Chrome extension, demonstrating full-stack versatility.
                </p>
                <ul className="text-xs text-neutral-600 uppercase tracking-widest space-y-2 border-l border-white/10 pl-4">
                  <li>Chrome Extension</li>
                  <li>App Redesign</li>
                  <li>Full-Stack Engineering</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-32 flex flex-col justify-center items-center text-center px-4 relative z-10 animate-fade-in-up opacity-0"
        style={{ animationDelay: '800ms' }}
      >
        <p className="text-xs font-bold tracking-[0.3em] text-neutral-500 uppercase mb-8">
          Your Turn
        </p>
        <Link
          to="/inquire"
          className="font-serif text-4xl md:text-7xl hover:italic hover:text-[#E1BE4C] transition-all duration-300"
        >
          Build Your Legacy.
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-8 bg-[#050505]/50 backdrop-blur-sm border-y border-white/10 flex flex-col md:flex-row justify-between items-end text-[10px] uppercase tracking-widest text-neutral-600 relative z-10">
        <div className="space-y-2">
          <p>© RelentNet 2026</p>
          <p>Nashville • Baton Rouge</p>
        </div>
        <div className="flex gap-6 mt-6 md:mt-0">
          <a href="#" className="hover:text-[#E1BE4C] transition-colors">
            Instagram
          </a>
          <a href="#" className="hover:text-[#E1BE4C] transition-colors">
            LinkedIn
          </a>
          <a href="#" className="hover:text-[#E1BE4C] transition-colors">
            Email
          </a>
        </div>
      </footer>
    </div>
  )
}
