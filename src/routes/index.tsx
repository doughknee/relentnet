import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e5e5] font-sans selection:bg-[#E1BE4C] selection:text-black overflow-hidden">
      {/* 1. NAVIGATION (Unchanged) */}
      <nav className="absolute top-0 w-full flex justify-between items-center p-8 z-50 mix-blend-difference">
        <div className="text-xl tracking-[0.2em] font-serif uppercase">
          <span className="font-bold text-[#E1BE4C]">Relent</span>Net
        </div>
        <div className="hidden md:flex gap-12 text-xs tracking-[0.15em] uppercase opacity-80">
          <Link
            to="/process"
            className="hover:text-[#E1BE4C] transition-colors duration-300"
          >
            Our Process
          </Link>
          <Link
            to="/portfolio"
            className="hover:text-[#E1BE4C] transition-colors duration-300"
          >
            The Work
          </Link>
          <Link
            to="/client-portal"
            className="hover:text-[#E1BE4C] transition-colors duration-300"
          >
            Client Login
          </Link>
        </div>
        <Link
          to="/contact"
          className="border border-white/20 px-6 py-3 text-xs tracking-widest uppercase hover:bg-[#E1BE4C] hover:border-[#E1BE4C] hover:text-black transition-all duration-500"
        >
          Inquire
        </Link>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="h-screen flex flex-col justify-center items-center px-4 relative">
        {/* --- HERO CONTENT --- */}
        <h1 className="relative z-10 font-serif text-5xl md:text-7xl lg:text-9xl text-center leading-[1.1] opacity-0 animate-fade-in-up">
          Empower Your <br />
          <span className="italic text-[#E1BE4C]/90">Digital Presence.</span>
        </h1>

        <div
          className="relative z-10 mt-12 max-w-md text-center space-y-8 opacity-0 animate-fade-in-up"
          style={{ animationDelay: '200ms' }}
        >
          <p className="text-sm md:text-base text-neutral-400 font-light leading-relaxed">
            Relentless dedication to the white-glove website experience. We do
            not just build; we steward your digital legacy.
          </p>

          <div className="flex justify-center gap-8 items-center pt-4">
            <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-500">
              Nashville
            </span>
            <div className="w-1 h-1 bg-[#E1BE4C] rounded-full shadow-[0_0_10px_#E1BE4C]"></div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-500">
              Louisiana
            </span>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-pulse z-10">
          <span className="text-[10px] uppercase tracking-widest text-[#E1BE4C]">
            Scroll
          </span>
          <div className="w-px h-12 bg-linear-to-b from-[#E1BE4C] to-transparent"></div>
        </div>
      </section>

      {/* 3. THE MANIFESTO */}
      <section className="py-32 px-6 md:px-20 relative z-10 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-xs font-bold tracking-[0.3em] text-[#E1BE4C] uppercase mb-6">
              The Philosophy
            </h2>
            <h3 className="font-serif text-4xl md:text-5xl leading-tight mb-8">
              We sell one thing:
              <br />
              <span className="text-white/30">Peace of mind.</span>
            </h3>
          </div>
          <div className="space-y-6 text-neutral-400 font-light text-lg leading-relaxed">
            <p>
              In a world of templates and automated responses, RelentNet offers
              the antidote:
              <strong className="text-[#E1BE4C] font-normal">
                {' '}
                radical human attention.
              </strong>
            </p>
            <p>
              We are a high-end creation company where you provide the vision,
              and we manage the execution, the infrastructure, and the growth.
              Whether you prefer a phone call, an email, or a handshake in
              Nashville, we adapt our methods to your preferences.
            </p>
          </div>
        </div>
      </section>

      {/* 4. THE CONCIERGE SERVICE */}
      <section className="py-32 backdrop-blur-xs relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="group border-l border-white/10 pl-8 hover:border-[#E1BE4C] transition-colors duration-500">
              <span className="block text-4xl font-serif text-white/20 mb-4 group-hover:text-[#E1BE4C] transition-colors">
                01
              </span>
              <h4 className="text-xl mb-3 tracking-wide">Bespoke Creation</h4>
              <p className="text-neutral-500 text-sm leading-6 group-hover:text-neutral-300 transition-colors">
                No templates. We architect solutions tailored specifically to
                your business goals.
              </p>
            </div>
            <div className="group border-l border-white/10 pl-8 hover:border-[#E1BE4C] transition-colors duration-500">
              <span className="block text-4xl font-serif text-white/20 mb-4 group-hover:text-[#E1BE4C] transition-colors">
                02
              </span>
              <h4 className="text-xl mb-3 tracking-wide">
                White Glove Management
              </h4>
              <p className="text-neutral-500 text-sm leading-6 group-hover:text-neutral-300 transition-colors">
                Updates, security, and changes are handled instantly. You own
                the business; we own the tech.
              </p>
            </div>
            <div className="group border-l border-white/10 pl-8 hover:border-[#E1BE4C] transition-colors duration-500">
              <span className="block text-4xl font-serif text-white/20 mb-4 group-hover:text-[#E1BE4C] transition-colors">
                03
              </span>
              <h4 className="text-xl mb-3 tracking-wide">Personal Access</h4>
              <p className="text-neutral-500 text-sm leading-6 group-hover:text-neutral-300 transition-colors">
                Direct lines of communication. We are there for you when needed,
                in the format you prefer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA */}
      <section className="h-[70vh] flex flex-col justify-center items-center text-center px-4 relative z-10">
        <p className="text-xs font-bold tracking-[0.3em] text-neutral-500 uppercase mb-8">
          Are you ready?
        </p>
        <Link
          to="/contact"
          className="font-serif text-5xl md:text-8xl hover:italic hover:text-[#E1BE4C] transition-all duration-300"
        >
          Let's Talk.
        </Link>
        <p
          className="mt-8 text-neutral-500 text-sm opacity-0 animate-fade-in-up"
          style={{ animationDelay: '500ms' }}
        >
          Accepting new clients for Q1 2026.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-end text-[10px] uppercase tracking-widest text-neutral-600 relative z-10">
        <div className="space-y-2">
          <p>© RelentNet 2026</p>
          <p>Nashville • Louisiana</p>
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
