import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, ExternalLink } from 'lucide-react'

export const Route = createFileRoute('/portfolio')({
  head: () => ({
    meta: [
      { title: 'The Work | RelentNet Case Studies' },
      {
        name: 'description',
        content:
          'Diagnostic-first proof from RelentNet case studies, showing how diagnosed workflow friction becomes useful systems and clearer operations.',
      },
    ],
  }),
  component: Portfolio,
})

interface CaseStudy {
  name: string
  url: string
  industry: string
  systemType: string
  image?: string
  problem: string
  diagnosis: string
  build: string
  outcome: string
}

export const portfolioIntro = {
  headlinePrefix: 'Diagnosed friction.',
  headlineAccent: 'Useful systems.',
  headlineSuffix: 'Clearer operations.',
  headline: 'Diagnosed friction. Useful systems. Clearer operations.',
  body: 'These case studies show the same pattern behind the workflow diagnostic: understand the operational friction, clarify the system worth creating, then build what helps the business move cleaner.',
} as const

export const portfolioCta = {
  headline: 'See the friction in your own operation?',
  body: 'Start with a workflow diagnostic before deciding what should be built.',
  label: 'Start With a Diagnostic',
  to: '/diagnostic',
} as const

export const caseStudies: Array<CaseStudy> = [
  {
    name: 'Scrollr',
    url: 'https://myscrollr.relentnet.dev',
    industry: 'Trading & Analytics',
    systemType: 'Workflow Platform',
    image: '/scrollr_portfolio.png',
    problem:
      'Market signals, ticker behavior, and user preferences were scattered across disconnected surfaces instead of one operational product experience.',
    diagnosis:
      'The product needed a configurable signal workflow that could serve analysts and traders without forcing every user into the same dashboard.',
    build:
      'A SaaS-style signal ticker with personalized dashboards, real-time data presentation, and extension-ready product architecture.',
    outcome:
      'Scrollr became a sharper product system: easier to explain, easier to demo, and better aligned with how traders actually consume signals.',
  },
  {
    name: 'Cambridge Building Group',
    url: 'https://cambridgebg.com',
    industry: 'Commercial Construction',
    systemType: 'Sales Enablement System',
    image: '/cbg_portfolio.png',
    problem:
      'A high-trust construction firm needed a digital presence that matched the quality of its work and helped serious prospects understand capability quickly.',
    diagnosis:
      'The site needed to reduce sales friction by making credibility, project quality, and company positioning immediately clear.',
    build:
      'A commanding marketing system with streamlined messaging, professional visual hierarchy, and conversion-focused inquiry paths.',
    outcome:
      'The company gained a more credible front door for high-value commercial opportunities and a cleaner way to support sales conversations.',
  },
  {
    name: 'CourtCommand',
    url: 'https://courtcommand.app',
    industry: 'Sports Technology',
    systemType: 'Real-Time Operations Engine',
    problem:
      'Broadcast-style sports environments cannot tolerate lag, unclear state, or fragile manual scorekeeping workflows.',
    diagnosis:
      'The system needed to behave like operational infrastructure: fast, multi-tenant, synchronized, and simple under pressure.',
    build:
      'A low-latency referee engine and sports ticker designed around real-time score synchronization and live event workflows.',
    outcome:
      'CourtCommand became a purpose-built operating layer for sports presentation instead of another generic scoreboard interface.',
  },
  {
    name: 'VM Homes',
    url: 'https://vm-homes.com',
    industry: 'Real Estate',
    systemType: 'Client Experience Platform',
    image: '/vmh_portfolio.png',
    problem:
      'The team needed more than a polished website; they needed a premium buyer experience that could support property search and neighborhood trust.',
    diagnosis:
      'Real estate prospects need clarity, confidence, and fast access to relevant inventory before they are ready to start a conversation.',
    build:
      'A premium digital storefront with MLS-integrated property search, neighborhood guidance, and client-first conversion paths.',
    outcome:
      'The site now works as both a brand asset and a practical client acquisition tool for buyers evaluating the St. Pete Beach market.',
  },
  {
    name: 'Star Kids',
    url: 'https://starkids.relentnet.dev',
    industry: 'Nonprofit',
    systemType: 'Mission Communication System',
    problem:
      'A mission-driven organization needed to explain programs, trust, and impact without overwhelming donors or families.',
    diagnosis:
      'The experience needed to simplify complex service areas into a story people could understand and act on quickly.',
    build:
      'A focused nonprofit presence for education, healthcare, nutrition, and mentorship programs with clear paths to learn and support.',
    outcome:
      'The organization gained a clearer digital home for communicating purpose, programs, and credibility.',
  },
]

function CaseStudySection({
  study,
  index,
}: {
  study: CaseStudy
  index: number
}) {
  const isEven = index % 2 === 0

  return (
    <section className="py-20 md:py-28 px-6 md:px-12 relative z-10">
      <div className="max-w-7xl mx-auto">
        <span
          className={`block text-[6rem] md:text-[9rem] font-serif text-black/[0.06] dark:text-white/[0.03] leading-none select-none -mb-8 md:-mb-12 ${
            isEven ? '' : 'md:text-right'
          }`}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          <div className={`lg:col-span-5 ${isEven ? '' : 'lg:order-last'}`}>
            <div className="h-full border border-line bg-card p-7 md:p-9 flex flex-col justify-between">
              <div>
                <span className="text-gold text-[10px] tracking-[0.3em] uppercase font-bold">
                  {study.industry}
                </span>
                <h2 className="font-serif text-3xl md:text-5xl mt-4">
                  {study.name}
                </h2>
                <p className="mt-4 text-sm uppercase tracking-[0.2em] text-ink-muted">
                  {study.systemType}
                </p>
              </div>

              {study.image ? (
                <div className="mt-10 overflow-hidden border border-line-faint bg-neutral-950 aspect-video">
                  <img
                    src={study.image}
                    alt={`${study.name} interface preview`}
                    className="h-full w-full object-cover opacity-90 grayscale-25 transition duration-500 hover:scale-[1.02] hover:grayscale-0"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="mt-10 border border-line-faint bg-inset aspect-video flex items-center justify-center px-8 text-center">
                  <p className="font-serif text-2xl text-ink-muted">
                    Real-time system preview
                  </p>
                </div>
              )}

              <a
                href={study.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 text-sm text-gold uppercase tracking-widest hover:gap-3 transition-all duration-300"
              >
                View live site
                <ExternalLink className="size-4" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ['The Problem', study.problem],
              ['The Diagnosis', study.diagnosis],
              ['The Build', study.build],
              ['The Outcome', study.outcome],
            ].map(([label, value]) => (
              <div
                key={label}
                className="border border-line-faint bg-inset p-6"
              >
                <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-5">
                  {label}
                </h3>
                <p className="text-sm leading-relaxed text-ink-sub">{value}</p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  )
}

function Portfolio() {
  return (
    <div className="min-h-screen overflow-hidden">
      <section className="min-h-screen flex flex-col justify-center items-center px-6 relative text-center">
        <p className="text-gold text-[10px] tracking-[0.35em] uppercase font-bold mb-8 animate-fade-in-up">
          Workflow problems solved
        </p>
        <h1 className="font-serif text-5xl md:text-7xl lg:text-9xl leading-[1.05] animate-fade-in-up">
          {portfolioIntro.headlinePrefix}{' '}
          <span className="italic text-gold/90">
            {portfolioIntro.headlineAccent}
          </span>{' '}
          {portfolioIntro.headlineSuffix}
        </h1>
        <p
          className="mt-8 max-w-2xl text-ink-muted text-sm md:text-lg font-light leading-relaxed opacity-0 animate-fade-in-up"
          style={{ animationDelay: '200ms' }}
        >
          {portfolioIntro.body}
        </p>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-pulse delay-1000 z-10">
          <span className="text-[10px] uppercase tracking-widest text-gold">
            Scroll
          </span>
          <div className="w-px h-12 bg-linear-to-b from-gold to-transparent" />
        </div>
      </section>

      {caseStudies.map((study, index) => (
        <CaseStudySection key={study.name} study={study} index={index} />
      ))}

      <section className="py-32 flex flex-col justify-center items-center text-center px-6 relative z-10">
        <p className="text-xs font-bold tracking-[0.3em] text-ink-muted uppercase mb-8">
          Your bottleneck, next
        </p>
        <h2 className="font-serif text-4xl md:text-7xl max-w-4xl">
          {portfolioCta.headline}
        </h2>
        <p className="mt-6 max-w-2xl text-ink-muted text-sm md:text-base leading-relaxed">
          {portfolioCta.body}
        </p>
        <Link
          to={portfolioCta.to}
          className="group mt-10 inline-flex items-center justify-center gap-3 border border-gold bg-gold px-7 py-4 text-sm uppercase tracking-widest text-black transition-all duration-300 hover:bg-transparent hover:text-gold"
        >
          {portfolioCta.label}
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </section>
    </div>
  )
}
