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
        'RelentNet is Brandon Harris and Daniel Velez. We met playing video games, worked at the same IT company, and started this in May 2022 to do the same kind of work with a fraction of the overhead.',
      path: '/about',
    }),
  component: About,
})

/** The month and year on the homepage's tenure stat. Kept here as the one fact
 *  the page opens on, so the two cannot drift apart silently. */
export const FOUNDED_YEAR = 2022
export const FOUNDED_MONTH = 'May'

export const founders = [
  { name: 'Brandon Harris', role: 'Co-founder & CEO', city: 'Nashville' },
  { name: 'Daniel Velez', role: 'Co-founder & COO', city: 'New Orleans' },
] as const

/**
 * The page's argument, exported so a test can pin that it still makes it.
 *
 * Written from what Brandon and Daniel each said in interview. Everything here
 * is theirs: the Discord pitch, Daniel covering Brandon's living costs, the
 * truck plazas at $300, the 2025 framework vulnerability, the eight-person
 * ceiling, and the shared credentials. Nothing is invented, and the two places
 * their answers differed are written the way they settled them.
 */
export const aboutSections = [
  {
    num: '01',
    eyebrow: 'How it started',
    title: 'Brandon pitched it over Discord.',
    body: [
      'We met years earlier playing video games, through a mutual friend, on the same platform. Brandon wanted to be more creative and, in his words, not stuck in someone else’s cog. The pitch was a business doing the work we already knew how to do, with a fraction of the overhead of the company we were doing it at.',
      'Daniel agreed, and for the first two years he covered Brandon’s living costs so Brandon could commit to it properly. The company earned from the start. That was Daniel investing in Brandon, not Daniel funding a company.',
      'The first job was five websites for a group of truck plazas, at three hundred dollars each. Brandon’s assessment now: a gross undervalue. We have been correcting for it ever since, and what to charge is still the thing we argue about most.',
    ],
  },
  {
    num: '02',
    eyebrow: 'How the work splits',
    title: 'One of us builds it. One of us runs it.',
    body: [
      'Brandon owns what gets built: the vision, the code, the design. Daniel owns bringing the work in and keeping it running. We both sit in client meetings, so neither of us is ever repeating something secondhand.',
      `Brandon is in Nashville and Daniel is in New Orleans, which is why the map looks the way it does: ${siteConfig.regions.slice(0, -1).join(', ')} and ${siteConfig.regions[siteConfig.regions.length - 1]}, reachable without booking a flight. Most clients never need us in the room. We offer it anyway.`,
    ],
  },
  {
    num: '03',
    eyebrow: 'What we will tell you',
    title: 'Sometimes the answer is don’t build yet.',
    body: [
      'Clients know what they want. They usually do not know how they want it, and that gap is where the money goes. So a diagnostic can end with don’t build yet, and it does. We have turned work down because a business was not ready for it and said so rather than take the money. It cost us the job.',
      'The harder conversation is the other one: that the site has to come down and be rebuilt, and that it will cost more than expected. Nobody enjoys hearing it. Everybody is glad about it afterwards.',
    ],
  },
  {
    num: '04',
    eyebrow: 'Why we keep the keys',
    title: 'Late 2025, and nobody noticed.',
    body: [
      'A remote code execution flaw surfaced in React and Next.js server components at the end of 2025. Brandon updated almost every client site and service to get ahead of it while Daniel swept the servers. Not one client was affected, and most of them never learned there had been anything to be affected by.',
      'That is the whole argument for staying on after launch. Software does not hold still, and somebody has to be watching it who is not you.',
    ],
  },
  {
    num: '05',
    eyebrow: 'Where this goes',
    title: 'About eight people, eventually.',
    body: [
      'Big enough to run without either of us at the helm. Small enough that we still know every customer by name. We are not trying to be large, and we bring in specialists per project rather than hiring for work we do not have yet.',
      'In the meantime we share every credential and everything we know, deliberately. Either of us could run this alone if it came to that. Neither of us wants to.',
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
            <span className="italic text-gold-text">
              are the people who build.
            </span>
          </h1>
          <p
            className="animate-fade-in-up mt-9 mx-auto max-w-[580px] text-ink-sub text-[17px] font-light leading-[1.6]"
            style={{ animationDelay: '180ms' }}
          >
            RelentNet is Brandon Harris and Daniel Velez. We met playing video
            games, worked at the same IT company, and started this in{' '}
            {FOUNDED_MONTH} {FOUNDED_YEAR} to do that kind of work with a
            fraction of the overhead.
          </p>
        </div>
      </section>

      {/* ── The two of them ── */}
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
              {/* A ruled list rather than prose: the page's whole claim is that
                  the company is these two, so they get to be a specification. */}
              <dl className="border-t border-line">
                {founders.map((person) => (
                  <div
                    key={person.name}
                    className="group grid grid-cols-[1fr_auto] items-baseline gap-x-6 border-b border-line py-5"
                  >
                    <dt className="font-serif text-[clamp(24px,2.8vw,34px)] leading-none text-ink-em transition-colors duration-500 group-hover:text-gold-text">
                      {person.name}
                    </dt>
                    <dd className="font-mono text-[10px] tracking-[0.2em] uppercase text-gold-text whitespace-nowrap">
                      {person.city}
                    </dd>
                    <dd className="col-span-2 mt-1.5 font-mono text-[11px] tracking-[0.18em] uppercase text-ink-muted">
                      {person.role}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-8 text-ink-sub font-light leading-[1.7] max-w-[540px]">
                Daniel was Brandon’s boss. He owns Function IT Services, a
                hardware IT company he still runs, and Brandon was a designer
                there. In {FOUNDED_MONTH} {FOUNDED_YEAR} Brandon pitched him
                something different and the hierarchy quietly inverted.
              </p>
              <p className="mt-4 text-ink-sub font-light leading-[1.7] max-w-[540px]">
                There is nobody between you and the work. We scope it, write it,
                host it, and answer the phone. When a project needs a specialist
                we bring one in, and you will know that we have.
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
              <h2 className="font-serif text-[clamp(28px,3.6vw,44px)] leading-[1.1] mb-6 text-balance">
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
