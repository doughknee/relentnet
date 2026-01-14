import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/process')({
  head: () => ({
    meta: [
      { title: 'The Discipline | Our Bespoke Creation Process' },
      {
        name: 'description',
        content:
          'A rigorous architectural methodology for custom application development. From strategic discovery to long-term stewardship. No friction, just execution.',
      },
    ],
  }),
  component: Process,
})

function Process() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e5e5] font-sans selection:bg-gold selection:text-black overflow-hidden">
      {/* HERO SECTION */}
      <section className="pt-48 pb-24 px-4 flex flex-col justify-center items-center relative">
        <h1 className="relative z-10 font-serif text-5xl md:text-7xl text-center leading-[1.1] animate-fade-in-up">
          Precision in <br />
          <span className="italic text-gold/90">Every Pixel.</span>
        </h1>
        <p className="mt-8 max-w-2xl text-center text-neutral-400 font-light text-lg leading-relaxed animate-fade-in-up delay-200">
          Our process is not a checklist. It is a rigorous discipline designed
          to translate your abstract vision into a concrete digital legacy.
        </p>
      </section>

      {/* STEPS SECTION */}
      <section className="py-24  px-6 md:px-20 relative z-10 bg-[#050505]/20 backdrop-blur-xs border-y border-white/10">
        <div className="max-w-5xl mx-auto space-y-24">
          {/* Step 1 */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center group animate-fade-in-up opacity-0"
            style={{ animationDelay: '300ms' }}
          >
            <div className="order-2 md:order-1 space-y-4">
              <span className="text-gold text-xs font-bold tracking-[0.3em] uppercase">
                Phase 01
              </span>
              <h3 className="text-3xl font-serif">Discovery & Strategy</h3>
              <p className="text-neutral-500 leading-relaxed">
                We begin by listening. We map the terrain of your industry,
                identify your unique value proposition, and define the
                architectural requirements necessary to support your long-term
                goals.
              </p>
            </div>
            <div className="order-1 md:order-2 flex justify-center md:justify-end">
              <div className="text-9xl font-serif text-white/30 group-hover:text-gold/70 transition-colors duration-500">
                01
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center group animate-fade-in-up opacity-0"
            style={{ animationDelay: '500ms' }}
          >
            <div className="order-2 md:order-2 space-y-4 md:text-right">
              <span className="text-gold text-xs font-bold tracking-[0.3em] uppercase">
                Phase 02
              </span>
              <h3 className="text-3xl font-serif">Design & Architecture</h3>
              <p className="text-neutral-500 leading-relaxed">
                Function precedes form, yet form defines feeling. We prototype
                high-fidelity interfaces that align with your brand identity
                while engineering a scalable backend infrastructure.
              </p>
            </div>
            <div className="order-1 md:order-1 flex justify-center md:justify-start">
              <div className="text-9xl font-serif text-white/30 group-hover:text-gold/70 transition-colors duration-500">
                02
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center group animate-fade-in-up opacity-0"
            style={{ animationDelay: '700ms' }}
          >
            <div className="order-2 md:order-1 space-y-4">
              <span className="text-gold text-xs font-bold tracking-[0.3em] uppercase">
                Phase 03
              </span>
              <h3 className="text-3xl font-serif">Development & Refinement</h3>
              <p className="text-neutral-500 leading-relaxed">
                Clean code is our craft. We build with modern frameworks,
                ensuring speed, security, and accessibility. Rigorous testing
                eliminates friction before it ever reaches your audience.
              </p>
            </div>
            <div className="order-1 md:order-2 flex justify-center md:justify-end">
              <div className="text-9xl font-serif text-white/30 group-hover:text-gold/70 transition-colors duration-500">
                03
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center group animate-fade-in-up opacity-0"
            style={{ animationDelay: '900ms' }}
          >
            <div className="order-2 md:order-2 space-y-4 md:text-right">
              <span className="text-gold text-xs font-bold tracking-[0.3em] uppercase">
                Phase 04
              </span>
              <h3 className="text-3xl font-serif">Launch & Stewardship</h3>
              <p className="text-neutral-500 leading-relaxed">
                Deployment is not the end. We provide white-glove support,
                handling updates, security monitoring, and content changes so
                you can focus on leading your business.
              </p>
            </div>
            <div className="order-1 md:order-1 flex justify-center md:justify-start">
              <div className="text-9xl font-serif text-white/30 group-hover:text-gold/70 transition-colors duration-500">
                04
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-32 flex flex-col justify-center items-center text-center px-4 relative z-10 animate-fade-in-up opacity-0"
        style={{ animationDelay: '1100ms' }}
      >
        <p className="text-xs font-bold tracking-[0.3em] text-neutral-500 uppercase mb-8">
          The Next Step
        </p>
        <Link
          to="/inquire"
          className="font-serif text-4xl md:text-7xl hover:italic hover:text-gold transition-all duration-300"
        >
          Begin the Process.
        </Link>
      </section>
    </div>
  )
}
