import { Link, createFileRoute } from '@tanstack/react-router'

import { CtaLink } from '@/components/CtaLink'
import { Eyebrow } from '@/components/Eyebrow'
import { ProofStat } from '@/components/ProofStat'
import { Reveal } from '@/components/Reveal'
import { leadClass, sectionInner, surfaces } from '@/components/SectionHead'
import { CaseStudyCard } from '@/components/clients/CaseStudyCard'
import { proofStats } from '@/data/proof'
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
    imageHeight: 1000,
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
    imageHeight: 954,
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
    imageHeight: 1000,
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
    imageHeight: 1000,
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

const diagnosticLine =
  '$2,000 diagnostic, credited toward the build. Transparent pricing after. No mystery retainers.'

/** One study: card and figure, image side alternating. Odd rows sit on the
 *  card surface, even rows on the page, as in the frames. */
function StudyRow({
  study,
  i,
}: {
  study: (typeof studies)[number]
  i: number
}) {
  const imageFirst = i % 2 === 1
  return (
    <section
      data-testid="study-row"
      className={i % 2 === 1 ? surfaces.card : surfaces.page}
    >
      <div
        className={`${sectionInner} grid grid-cols-1 gap-10 min-[1024px]:gap-[72px] items-center ${
          imageFirst
            ? 'min-[1024px]:grid-cols-[minmax(0,1fr)_520px]'
            : 'min-[1024px]:grid-cols-[520px_minmax(0,1fr)]'
        }`}
      >
        {/* On mobile the figure leads, as in the frames. */}
        <Reveal
          delay={150}
          className={`order-first ${imageFirst ? '' : 'min-[1024px]:order-last'}`}
        >
          <Link
            to="/clients/$slug"
            params={{ slug: study.slug }}
            aria-label={`Read the ${study.name} case study`}
            className="block"
          >
            <figure className="group flex flex-col gap-3">
              <div className="overflow-hidden border border-line">
                <img
                  src={study.image}
                  width={1600}
                  height={study.imageHeight}
                  alt={study.imageAlt}
                  loading="lazy"
                  className="w-full h-auto block transition-transform duration-800 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.03]"
                />
              </div>
              <figcaption className="font-mono text-xs tracking-[0.22em] uppercase font-medium leading-4 text-ink-muted">
                Fig. 0{i + 1} · {study.name}
              </figcaption>
            </figure>
          </Link>
        </Reveal>
        <Reveal>
          <CaseStudyCard
            slug={study.slug}
            index={i}
            industry={study.industry}
            headline={study.headline}
            outcome={study.outcome}
            statValue={study.statValue}
            statDesc={study.statDesc}
            name={study.name}
            systemType={study.systemType}
          />
        </Reveal>
      </div>
    </section>
  )
}

function ClientsIndex() {
  return (
    <div className="relative overflow-x-clip">
      {/* Radial gold glow over the top of the page */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-[90vh] pointer-events-none bg-[radial-gradient(ellipse_760px_420px_at_calc(50%-300px)_60px,rgba(203,171,69,0.06),transparent_65%)]"
      />

      {/* ── Hero ── */}
      <section className="relative pt-[120px] pb-[72px] md:pb-[88px] px-5 md:px-12 xl:px-20">
        <div className="max-w-[1280px] mx-auto">
          <Eyebrow className="animate-fade-in-up mb-8">Client work</Eyebrow>
          <h1
            className="animate-fade-in-up font-serif text-[clamp(38px,7.5vw,92px)] leading-none tracking-[-0.01em] max-w-[1000px] text-balance"
            style={{ animationDelay: '80ms' }}
          >
            Four operations. Four systems that{' '}
            <span className="italic text-gold-text">earned their place.</span>
          </h1>
          <p
            className={`animate-fade-in-up mt-8 max-w-[680px] ${leadClass}`}
            style={{ animationDelay: '180ms' }}
          >
            Construction, consumer software, sports tech, real estate. Every
            engagement began with a diagnostic; every build was scoped to the
            friction we found. Four we can show in full. The rest run under NDA.
          </p>
        </div>
      </section>

      {/* ── Proof band ── */}
      <section data-testid="proof-band" className={surfaces.card}>
        <div className="max-w-[1440px] mx-auto px-5 md:px-12 xl:px-20 py-12 md:py-16 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {proofStats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 90}>
              <ProofStat stat={stat} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Studies 01 and 02 ── */}
      {studies.slice(0, 2).map((s, i) => (
        <StudyRow key={s.slug} study={s} i={i} />
      ))}

      {/* ── Mid-page CTA ── */}
      <section data-testid="mid-cta" className={surfaces.tint}>
        <div
          className={`${sectionInner} !py-[56px] md:!py-[72px] flex flex-col min-[1024px]:flex-row min-[1024px]:items-center gap-8 min-[1024px]:gap-12`}
        >
          <Reveal className="flex-1 min-w-0 flex flex-col gap-3.5">
            <h2 className="font-serif text-[34px] leading-10 md:text-[40px] md:leading-[46px] text-ink-em text-balance">
              Every engagement began with a diagnostic.
            </h2>
            <p className="text-lg leading-[30px] text-ink-sub">
              {diagnosticLine}
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="flex flex-wrap gap-3.5">
              <CtaLink to="/inquire" hash="book" arrow>
                Book a call
              </CtaLink>
              <CtaLink to="/process" variant="outline">
                How we work
              </CtaLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Studies 03 and 04 ── */}
      {studies.slice(2).map((s, i) => (
        <StudyRow key={s.slug} study={s} i={i + 2} />
      ))}

      {/* ── What we take on ── */}
      <section className={surfaces.page}>
        <div
          className={`${sectionInner} grid grid-cols-1 min-[1024px]:grid-cols-[400px_minmax(0,1fr)] gap-12 min-[1024px]:gap-[72px] items-start`}
        >
          <div>
            <Reveal>
              <Eyebrow className="mb-5">What we take on</Eyebrow>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="font-serif text-[34px] leading-10 md:text-[40px] md:leading-[46px] text-ink-em">
                The work behind the stories.
              </h2>
            </Reveal>
          </div>
          <div className="grid grid-cols-1 min-[768px]:grid-cols-2 min-[768px]:gap-x-14">
            {solutions.map((sol, i) => (
              <Reveal
                key={sol.label}
                delay={100 + i * 60}
                className="border-b border-line py-5 transition-colors duration-300 hover:border-gold/45"
              >
                <p className="font-serif text-[26px] leading-8 text-ink-em">
                  {sol.label}
                </p>
                <p className="mt-1.5 text-[15px] leading-6 text-ink-muted">
                  {sol.blurb}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <section className={`relative ${surfaces.tint}`}>
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_700px_500px_at_50%_100%,rgba(203,171,69,0.08),transparent_70%)]"
        />
        <div
          className={`${sectionInner} relative flex flex-col items-center gap-10 text-center`}
        >
          <Reveal>
            <h2 className="font-serif text-[clamp(34px,5.6vw,56px)] leading-[1.07] text-balance">
              Your operation could be{' '}
              <span className="italic text-gold-text">the fifth story.</span>
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <div className="flex flex-wrap justify-center gap-3.5">
              <CtaLink to="/inquire" arrow>
                Book a Diagnostic
              </CtaLink>
              <CtaLink to="/process" variant="outline">
                How we work
              </CtaLink>
            </div>
          </Reveal>
          <Reveal delay={250}>
            <p className="text-[15px] text-ink-muted">{diagnosticLine}</p>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
