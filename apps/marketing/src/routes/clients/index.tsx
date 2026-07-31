import { Link, createFileRoute } from '@tanstack/react-router'

import { CtaLink } from '@/components/CtaLink'
import { Eyebrow } from '@/components/Eyebrow'
import { Frame } from '@/components/Frame'
import { Reveal } from '@/components/Reveal'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/clients/')({
  head: () =>
    seo({
      title: 'Our Clients | RelentNet Case Studies',
      description:
        'Diagnostic-first proof from RelentNet client engagements, showing how diagnosed workflow friction becomes useful systems and clearer operations.',
      path: '/clients',
    }),
  component: ClientsIndex,
})

export const studies = [
  {
    slug: 'cambridge-building-group',
    name: 'Cambridge Building Group',
    industry: 'Commercial construction',
    systemType: 'Marketing site + AP automation',
    headline: 'Invoices that file themselves.',
    outcome:
      'A credibility-first front door, plus an AP pipeline that reads vendor invoices, routes PM approval, and posts them to QuickBooks with the PDF and project attached.',
    statValue: 'Email → QBO',
    statDesc: 'Hands-off invoice pipeline across hundreds of active projects.',
    image: '/case-studies/cambridge-building-group/hero.webp',
    imageAlt: 'Cambridge Building Group site',
  },
  {
    slug: 'scrollr',
    name: 'Scrollr',
    industry: 'Consumer software',
    systemType: 'Cross-platform desktop product',
    headline: 'From brittle extension to real product.',
    outcome:
      'A complete rebuild: native desktop app, decoupled architecture, and a plugin model that lets new data sources ship without touching the core.',
    statValue: '1 → 3',
    statDesc:
      'One Chrome extension became native apps on macOS, Windows, and Linux.',
    image: '/case-studies/scrollr/hero-sports-dark.webp',
    imageAlt: 'Scrollr desktop ticker',
  },
  {
    slug: 'courtcommand',
    name: 'CourtCommand',
    industry: 'Sports technology',
    systemType: 'Real-time tournament platform',
    headline: 'Live pickleball, one operating layer.',
    outcome:
      'Tournaments, leagues, live scoring, and broadcast overlays on a Go + Redis core built to stay in sync under game-day pressure.',
    statValue: '170+',
    statDesc: 'API endpoints behind brackets, scoring, and broadcast graphics.',
    image: '/case-studies/courtcommand/hero.webp',
    imageAlt: 'CourtCommand platform',
  },
  {
    slug: 'vm-homes',
    name: 'VM Homes',
    industry: 'Real estate',
    systemType: 'MLS-integrated search platform',
    headline: 'A storefront that earns trust quietly.',
    outcome:
      'Premium buyer experience with live MLS inventory inside the brand, so buyers never get bounced to a generic portal.',
    statValue: '6 markets',
    statDesc:
      'MLS-synced search across Tampa Bay, from downtown St. Pete to the Gulf beaches.',
    image: '/case-studies/vm-homes/hero.webp',
    imageAlt: 'VM Homes property search',
  },
] as const

export const solutions = [
  {
    label: 'Diagnose workflow friction',
    blurb: 'Map where the work actually snags before prescribing software.',
  },
  {
    label: 'Rebuild brittle systems',
    blurb:
      'Replace fragile, inherited code with a foundation that carries the product.',
  },
  {
    label: 'Automate back-office operations',
    blurb: 'Turn manual busywork into pipelines that run themselves.',
  },
  {
    label: 'Ship cross-platform products',
    blurb: 'One codebase, native everywhere.',
  },
  {
    label: 'Stage credibility for sales',
    blurb: 'A front door that makes capability legible in seconds.',
  },
  {
    label: 'Operate real-time infrastructure',
    blurb: 'Low-latency cores that stay in sync under pressure.',
  },
  {
    label: 'Build premium client experiences',
    blurb: 'Interfaces that earn trust before a prospect reaches out.',
  },
  {
    label: 'Steward systems over time',
    blurb: 'We host, monitor, and keep improving what we build.',
  },
] as const

function ClientsIndex() {
  return (
    <div className="relative overflow-x-clip">
      {/* Radial gold glow over the top of the page */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-[90vh] pointer-events-none bg-[radial-gradient(ellipse_760px_420px_at_calc(50%-300px)_60px,rgba(203,171,69,0.06),transparent_65%)]"
      />

      {/* ── Hero ── */}
      <section className="relative pt-[120px] pb-20 px-5 md:px-12">
        <div className="max-w-[1200px] mx-auto">
          <Eyebrow className="animate-fade-in-up mb-8">Client work</Eyebrow>
          <h1
            className="animate-fade-in-up font-serif text-[clamp(38px,7.5vw,92px)] leading-none tracking-[-0.01em] max-w-[1000px] text-balance"
            style={{ animationDelay: '80ms' }}
          >
            Four operations. Four systems that{' '}
            <span className="italic text-gold-text">earned their place.</span>
          </h1>
          <p
            className="animate-fade-in-up mt-10 max-w-[520px] text-ink-sub text-[17px] font-light leading-[1.6]"
            style={{ animationDelay: '180ms' }}
          >
            Construction, consumer software, sports tech, real estate. Every
            engagement began with a diagnostic; every build was scoped to the
            friction we found.
          </p>
        </div>
      </section>

      {/* ── Case-study rows (image side alternates) ── */}
      {studies.map((s, i) => (
        <section key={s.slug}>
          <div className="max-w-[1200px] mx-auto px-5 md:px-12 py-[90px]">
            <div
              className={`grid grid-cols-1 gap-12 min-[1024px]:gap-18 items-center ${
                i % 2 === 1
                  ? 'min-[1024px]:grid-cols-[7fr_5fr]'
                  : 'min-[1024px]:grid-cols-[5fr_7fr]'
              }`}
            >
              <div className={i % 2 === 1 ? 'min-[1024px]:order-last' : ''}>
                <Reveal>
                  <p className="font-mono text-[11px] tracking-[0.26em] uppercase text-ink-faint font-medium mb-[18px]">
                    0{i + 1} · {s.industry}
                  </p>
                </Reveal>
                <Reveal delay={80}>
                  <h2 className="font-serif text-[clamp(28px,4vw,50px)] leading-[1.05] mb-5">
                    {s.headline}
                  </h2>
                </Reveal>
                <Reveal delay={160}>
                  <p className="text-ink-sub font-light leading-[1.65] mb-8 max-w-[400px]">
                    {s.outcome}
                  </p>
                </Reveal>
                <Reveal delay={240}>
                  <div className="border-l border-line pl-6 mb-8">
                    <p className="font-serif text-[40px] leading-none text-gold-text">
                      {s.statValue}
                    </p>
                    <p className="mt-2.5 text-[13px] text-ink-muted max-w-[340px]">
                      {s.statDesc}
                    </p>
                  </div>
                </Reveal>
                <Reveal delay={320}>
                  <p className="text-xs tracking-[0.06em] text-ink-faint">
                    {s.name} · {s.systemType}
                  </p>
                </Reveal>
              </div>
              <Reveal delay={150}>
                <Link
                  to="/clients/$slug"
                  params={{ slug: s.slug }}
                  aria-label={`Read the ${s.name} case study`}
                >
                  {/* Middot, matching every other Fig. caption on the site.
                      This one was the odd caption out. */}
                  <Frame caption={`Fig. 0${i + 1} · ${s.name}`}>
                    <div
                      role="img"
                      aria-label={s.imageAlt}
                      className="w-full aspect-[16/10] bg-cover bg-top transition-transform duration-800 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.03]"
                      style={{ backgroundImage: `url('${s.image}')` }}
                    />
                  </Frame>
                </Link>
              </Reveal>
            </div>
          </div>
        </section>
      ))}

      {/* ── What we take on ── */}
      <section>
        <div className="max-w-[1200px] mx-auto px-5 md:px-12 py-25 grid grid-cols-1 min-[1024px]:grid-cols-[4fr_8fr] gap-12 min-[1024px]:gap-18 items-start">
          <div>
            <Reveal>
              <Eyebrow className="mb-5">What we take on</Eyebrow>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="font-serif text-[clamp(28px,4vw,50px)] leading-[1.05]">
                The work behind the stories.
              </h2>
            </Reveal>
          </div>
          <div className="grid grid-cols-1 min-[768px]:grid-cols-2 min-[768px]:gap-x-14">
            {solutions.map((sol, i) => (
              <Reveal
                key={sol.label}
                delay={100 + i * 60}
                className="border-b border-line-faint py-5 transition-colors duration-300 hover:border-gold/45"
              >
                <p className="font-serif text-[22px] text-ink-em">
                  {sol.label}
                </p>
                <p className="mt-1.5 text-[13px] font-light text-ink-muted leading-[1.55]">
                  {sol.blurb}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <section className="relative">
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_700px_500px_at_50%_100%,rgba(203,171,69,0.08),transparent_70%)]"
        />
        <div className="max-w-[1200px] mx-auto px-5 md:px-12 py-30 text-center relative">
          <Reveal>
            <h2 className="font-serif text-[clamp(32px,5.6vw,68px)] leading-[1.05] text-balance">
              Your operation could be{' '}
              <span className="italic text-gold-text">the fifth story.</span>
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <div className="mt-11 flex flex-wrap justify-center gap-3.5">
              <CtaLink to="/inquire" arrow>
                Book a Free Diagnostic
              </CtaLink>
              <CtaLink to="/process" variant="outline">
                How we work
              </CtaLink>
            </div>
          </Reveal>
          <Reveal delay={250}>
            <p className="mt-8 text-[13px] text-ink-muted">
              Free diagnostic. Transparent pricing after. No mystery retainers.
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
