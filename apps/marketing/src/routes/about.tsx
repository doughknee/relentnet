import { createFileRoute } from '@tanstack/react-router'

import { ClosingDoors } from '@/components/ClosingDoors'
import { Eyebrow } from '@/components/Eyebrow'
import { Frame } from '@/components/Frame'
import { Reveal } from '@/components/Reveal'
import { siteConfig } from '@/site.config'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/about')({
  head: () =>
    seo({
      title: 'About | RelentNet',
      description:
        'RelentNet is Brandon Harris and Daniel Velez. Since 2022 we have diagnosed workflows, built the systems worth building, and hosted them afterwards for owner-led businesses.',
      path: '/about',
    }),
  component: About,
})

/** The year on the homepage's tenure stat. Kept here as the single fact the
 *  page opens on, so the two cannot drift apart silently. */
export const FOUNDED_YEAR = 2022

export const founders = [
  { name: 'Brandon Harris', role: 'Co-founder' },
  { name: 'Daniel Velez', role: 'Co-founder' },
] as const

/**
 * Sections of the page, exported so a test can pin that the page still makes
 * the argument it was built to make.
 *
 * Every claim here is already made elsewhere on the site. The three answers
 * and the free diagnostic come from the homepage premise, "no account
 * managers" from section 03, the regions from siteConfig, and the Scrollr
 * account from that case study's own narrative. Nothing about either founder
 * beyond name, role, and what they did on Scrollr, because nothing more is
 * written down anywhere yet.
 */
export const aboutSections = [
  {
    num: '01',
    eyebrow: 'Who you are hiring',
    title: 'No layer in between.',
    body: [
      `Brandon Harris and Daniel Velez founded RelentNet in ${FOUNDED_YEAR}. There is nobody between you and the work.`,
      'The people who scope your system are the people who write it, host it, monitor it, and pick up the phone when something breaks at an inconvenient hour. That is not a service tier. It is just who is here.',
    ],
  },
  {
    num: '02',
    eyebrow: 'How a call gets made',
    title: 'Two people look before anyone quotes.',
    body: [
      'Daniel met the Scrollr team at an incubator pop-up where they were openly looking for a developer partner. He was first to open the codebase, and his read was that it needed a full rebuild rather than a rescue.',
      'Brandon came in for a second look with one job: find what could be salvaged. He reached the same conclusion, and only then did anyone propose a rebuild. Getting that second opinion did not require a change request.',
    ],
  },
  {
    num: '03',
    eyebrow: 'What we will tell you',
    title: 'The answer can be no.',
    body: [
      'A diagnostic ends in one of three answers, and one of them is don’t build yet. It is the honest answer more often than you would think, and it costs you nothing: you keep the workflow map and skip the invoice.',
      'Sometimes the tools you already pay for cover it and have simply never been wired together. We would rather do the wiring than sell you a system somebody has to maintain forever.',
    ],
  },
] as const

function About() {
  return (
    <div className="relative overflow-x-clip">
      {/* Same radial glow the other interior pages open on. */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-screen pointer-events-none bg-[radial-gradient(ellipse_760px_420px_at_50%_60px,rgba(203,171,69,0.07),transparent_65%)]"
      />

      {/* ── Hero ── */}
      <section className="relative pt-[130px] pb-[90px] px-5 md:px-12 text-center">
        <div className="max-w-[1000px] mx-auto">
          <Eyebrow className="animate-fade-in-up mb-8">About</Eyebrow>
          <h1
            className="animate-fade-in-up font-serif text-[clamp(38px,7.5vw,92px)] leading-none tracking-[-0.01em] text-balance"
            style={{ animationDelay: '80ms' }}
          >
            The people who answer{' '}
            <span className="italic text-gold-text">are the people who build.</span>
          </h1>
          <p
            className="animate-fade-in-up mt-9 mx-auto max-w-[560px] text-ink-sub text-[17px] font-light leading-[1.6]"
            style={{ animationDelay: '180ms' }}
          >
            RelentNet is Brandon Harris and Daniel Velez. Since {FOUNDED_YEAR}{' '}
            we have diagnosed workflows, built the systems worth building, and
            stayed on to host them.
          </p>
        </div>
      </section>

      {/* ── The builders ── */}
      <section>
        <div className="max-w-[1200px] mx-auto px-5 md:px-12 pb-18 grid grid-cols-1 min-[1024px]:grid-cols-[5fr_7fr] gap-12 min-[1024px]:gap-18 items-center">
          <Reveal className="max-w-[480px]">
            <Frame reveal caption="Fig. 01 · The builders">
              <img
                src="/founder-photo.webp"
                alt="Brandon Harris and Daniel Velez setting up a livestream at a wedding"
                width={440}
                height={480}
                className="block w-full aspect-[11/12] object-cover transition-transform duration-800 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.03]"
              />
            </Frame>
          </Reveal>
          <div>
            <Reveal delay={80}>
              {/* Names as a ruled list rather than prose: the page's whole
                  claim is that the company is these two, so they get to be a
                  specification rather than a sentence. */}
              <dl className="border-t border-line">
                {founders.map((person) => (
                  <div
                    key={person.name}
                    className="group flex items-baseline justify-between gap-6 border-b border-line py-5 transition-colors duration-500"
                  >
                    <dt className="font-serif text-[clamp(26px,3vw,38px)] leading-none text-ink-em transition-colors duration-500 group-hover:text-gold-text">
                      {person.name}
                    </dt>
                    <dd className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink-muted whitespace-nowrap">
                      {person.role}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-8 font-mono text-[11px] tracking-[0.2em] uppercase text-gold-text">
                Nashville, Tennessee
              </p>
              <p className="mt-3 text-ink-sub font-light leading-[1.65] max-w-[520px]">
                We work across {siteConfig.regions.slice(0, -1).join(', ')}, and{' '}
                {siteConfig.regions[siteConfig.regions.length - 1]}. We come out
                in person in all four.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── The argument, one numbered section at a time ── */}
      {aboutSections.map((section) => (
        <section key={section.num}>
          <div className="max-w-[1200px] mx-auto px-5 md:px-12 py-16 grid grid-cols-1 min-[900px]:grid-cols-[4fr_8fr] gap-8 min-[900px]:gap-16 items-start border-t border-line">
            <Reveal>
              <span className="font-serif text-[110px] leading-[0.9] text-watermark block">
                {section.num}
              </span>
              <p className="mt-4 font-mono text-[11px] tracking-[0.3em] uppercase text-gold-text font-medium">
                {section.eyebrow}
              </p>
            </Reveal>
            <Reveal delay={120}>
              <h2 className="font-serif text-[clamp(28px,3.6vw,44px)] leading-[1.1] mb-6">
                {section.title}
              </h2>
              {section.body.map((paragraph, p) => (
                <p
                  key={p}
                  className={`text-[16px] font-light leading-[1.7] text-ink-sub max-w-[640px] ${
                    p > 0 ? 'mt-5' : ''
                  }`}
                >
                  {paragraph}
                </p>
              ))}
            </Reveal>
          </div>
        </section>
      ))}

      {/* ── Closing ── */}
      <section className="relative">
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_700px_500px_at_50%_100%,rgba(203,171,69,0.08),transparent_70%)]"
        />
        <div className="max-w-[1200px] mx-auto px-5 md:px-12 py-24 text-center relative">
          <Reveal>
            <h2 className="font-serif text-[clamp(32px,5.6vw,68px)] leading-[1.05] text-balance">
              Start with the workflow.
              <br />
              <span className="italic text-gold-text">
                We will tell you if it needs building.
              </span>
            </h2>
          </Reveal>
          <ClosingDoors />
        </div>
      </section>
    </div>
  )
}
