import { clientLogos } from '@/data/clientLogos'

export function ClientsLogoWall() {
  return (
    <section className="relative z-10 px-6 md:px-12 py-16 md:py-20">
      <div className="max-w-7xl mx-auto">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-ink-muted text-center mb-10">
          Trusted by
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-ink-muted">
          {clientLogos.map((logo) => (
            <li key={logo.name} className="opacity-70 hover:opacity-100 transition-opacity">
              <img
                src={logo.logoSrc}
                alt={logo.name}
                className="h-8 md:h-10 w-auto"
                loading="lazy"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
