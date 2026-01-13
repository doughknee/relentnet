import { createFileRoute, Link } from '@tanstack/react-router'
import { Header } from '@/components/Header'

export const Route = createFileRoute('/portfolio')({
  component: Portfolio,
})

function Portfolio() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e5e5] font-sans selection:bg-[#E1BE4C] selection:text-black overflow-hidden">
      {/* NAVIGATION */}
      <Header />

      {/* HERO SECTION */}
      <section className="pt-48 pb-24 px-4 flex flex-col justify-center items-center relative">
        <h1 className="relative z-10 font-serif text-5xl md:text-7xl text-center leading-[1.1] animate-fade-in-up">
          Curated <br />
          <span className="italic text-[#E1BE4C]/90">Excellence.</span>
        </h1>
        <p className="mt-8 max-w-2xl text-center text-neutral-400 font-light text-lg leading-relaxed animate-fade-in-up delay-200">
          A selection of digital experiences crafted with precision, purpose, and
          an unyielding commitment to quality.
        </p>
      </section>

      {/* WORK GALLERY */}
      <section className="py-12 px-6 md:px-20 relative z-10">
        <div className="max-w-6xl mx-auto space-y-32">
          {/* Project 1 */}
          <div className="group relative">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
              <div className="md:col-span-8 relative overflow-hidden aspect-video bg-neutral-900 border border-white/5 group-hover:border-[#E1BE4C]/30 transition-colors duration-500">
                {/* Placeholder for Project Image */}
                <div className="absolute inset-0 bg-linear-to-tr from-black/80 to-transparent z-10"></div>
                <div className="absolute bottom-8 left-8 z-20">
                  <span className="text-[#E1BE4C] text-[10px] tracking-[0.3em] uppercase mb-2 block">
                    Private Equity
                  </span>
                  <h3 className="text-3xl md:text-4xl font-serif text-white">
                    Centurion Capital
                  </h3>
                </div>
              </div>
              <div className="md:col-span-4 space-y-6">
                <p className="text-neutral-500 leading-relaxed text-sm">
                  A comprehensive digital rebranding and secure investor portal
                  for a leading private equity firm. Focused on trust, speed,
                  and data visualization.
                </p>
                <ul className="text-xs text-neutral-600 uppercase tracking-widest space-y-2 border-l border-white/10 pl-4">
                  <li>Brand Identity</li>
                  <li>Secure Portal</li>
                  <li>Real-time Analytics</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Project 2 */}
          <div className="group relative">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
              <div className="md:col-span-4 order-2 md:order-1 space-y-6 md:text-right">
                <p className="text-neutral-500 leading-relaxed text-sm">
                  An immersive booking experience and digital concierge for a
                  5-star boutique hotel in Kyoto. Merging traditional aesthetics
                  with modern utility.
                </p>
                <ul className="text-xs text-neutral-600 uppercase tracking-widest space-y-2 border-r border-white/10 pr-4 md:border-l-0 md:border-r">
                  <li>UX/UI Design</li>
                  <li>Booking Engine</li>
                  <li>Localization</li>
                </ul>
              </div>
              <div className="md:col-span-8 order-1 md:order-2 relative overflow-hidden aspect-video bg-neutral-900 border border-white/5 group-hover:border-[#E1BE4C]/30 transition-colors duration-500">
                {/* Placeholder for Project Image */}
                <div className="absolute inset-0 bg-linear-to-tl from-black/80 to-transparent z-10"></div>
                <div className="absolute bottom-8 right-8 z-20 text-right">
                  <span className="text-[#E1BE4C] text-[10px] tracking-[0.3em] uppercase mb-2 block">
                    Hospitality
                  </span>
                  <h3 className="text-3xl md:text-4xl font-serif text-white">
                    The Obsidian
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Project 3 */}
          <div className="group relative">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
              <div className="md:col-span-8 relative overflow-hidden aspect-video bg-neutral-900 border border-white/5 group-hover:border-[#E1BE4C]/30 transition-colors duration-500">
                {/* Placeholder for Project Image */}
                <div className="absolute inset-0 bg-linear-to-tr from-black/80 to-transparent z-10"></div>
                <div className="absolute bottom-8 left-8 z-20">
                  <span className="text-[#E1BE4C] text-[10px] tracking-[0.3em] uppercase mb-2 block">
                    Art & Culture
                  </span>
                  <h3 className="text-3xl md:text-4xl font-serif text-white">
                    Museo Moderno
                  </h3>
                </div>
              </div>
              <div className="md:col-span-4 space-y-6">
                <p className="text-neutral-500 leading-relaxed text-sm">
                  A virtual tour platform and digital archive for a contemporary
                  art museum. Enabling global access to local masterpieces through
                  high-fidelity rendering.
                </p>
                <ul className="text-xs text-neutral-600 uppercase tracking-widest space-y-2 border-l border-white/10 pl-4">
                  <li>3D Rendering</li>
                  <li>Virtual Tour</li>
                  <li>Archive Database</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 flex flex-col justify-center items-center text-center px-4 relative z-10 border-t border-white/5 mt-20">
        <p className="text-xs font-bold tracking-[0.3em] text-neutral-500 uppercase mb-8">
          Your Turn
        </p>
        <Link
          to="/contact"
          className="font-serif text-4xl md:text-7xl hover:italic hover:text-[#E1BE4C] transition-all duration-300"
        >
          Build Your Legacy.
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-end text-[10px] uppercase tracking-widest text-neutral-600 relative z-10">
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