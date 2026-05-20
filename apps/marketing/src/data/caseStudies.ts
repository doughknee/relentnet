export interface CaseStudyMetric {
  label: string
  value: string
  context?: string
}

export interface CaseStudyImage {
  src: string
  alt: string
  caption?: string
  width: number
  height: number
}

export interface CaseStudyQuote {
  text: string
  attribution: string
}

export type StoryBlock =
  | { type: 'p'; text: string }
  | { type: 'image'; image: CaseStudyImage }
  | { type: 'quote'; text: string; attribution?: string }

export interface CaseStudySummary {
  problem: string
  diagnosis: string
  build: string
  outcome: string
}

export interface CaseStudyHero {
  image?: CaseStudyImage
  tagline: string
}

export interface CaseStudyAtAGlance {
  engagementYear?: string
  duration?: string
  role?: string
  stack?: ReadonlyArray<string>
  metrics?: ReadonlyArray<CaseStudyMetric>
  quote?: CaseStudyQuote
}

export interface CaseStudyStory {
  problem: ReadonlyArray<StoryBlock>
  diagnosis: ReadonlyArray<StoryBlock>
  build: ReadonlyArray<StoryBlock>
  outcome: ReadonlyArray<StoryBlock>
  stewardship?: ReadonlyArray<StoryBlock>
}

export interface CaseStudyMeta {
  title: string
  description: string
}

export interface CaseStudy {
  slug: string
  name: string
  url: string
  industry: string
  systemType: string
  summary: CaseStudySummary
  hero: CaseStudyHero
  atAGlance: CaseStudyAtAGlance
  story: CaseStudyStory
  meta: CaseStudyMeta
}

const p = (text: string): StoryBlock => ({ type: 'p', text })

export const caseStudies: ReadonlyArray<CaseStudy> = [
  {
    slug: 'scrollr',
    name: 'Scrollr',
    url: 'https://myscrollr.com',
    industry: 'Consumer Software',
    systemType: 'Cross-Platform Desktop Product',
    summary: {
      problem:
        'A founder-funded fantasy ticker had cycled through multiple developers without source control, accumulating a rigid Firebase codebase that could not carry the product the team actually wanted to ship.',
      diagnosis:
        'The build was unsalvageable, but the underlying idea was bigger than a Chrome extension for sports. The product needed to be reframed as a configurable, cross-platform live-data ticker with room to grow beyond a single domain.',
      build:
        'A complete redesign and rebuild: native desktop app, decoupled channel architecture, multi-source real-time pipeline, and a community-extensible plugin model that lets new data sources ship without disturbing the rest of the product.',
      outcome:
        'Scrollr has reached beta with the original founders. The product now reads as a coherent platform rather than a fragile sports extension — installable on macOS, Windows, and Linux, open-source, and architected to keep growing.',
    },
    hero: {
      tagline:
        'A quiet, always-visible desktop ticker for live scores, prices, headlines, and fantasy — rebuilt from a brittle Chrome extension into a cross-platform native product.',
      image: {
        src: '/scrollr_portfolio.png',
        alt: 'Scrollr desktop ticker preview',
        width: 1440,
        height: 810,
      },
    },
    atAGlance: {
      engagementYear: '2024–present',
      role: 'Product strategy, design, full-stack engineering, devops, hosting, ongoing stewardship',
      stack: [
        'Tauri v2',
        'React 19',
        'Vite 7',
        'TanStack Router',
        'Tailwind 4',
        'Go (Fiber)',
        'Rust (tokio)',
        'PostgreSQL',
        'Redis',
        'Sequin CDC',
        'Logto',
      ],
    },
    story: {
      problem: [
        p(
          'Daniel, a RelentNet co-founder, first met the Scrollr team at an incubator pop-up where they were openly looking for a developer partner. Phil and three partners had raised funding around a clear vision — a fantasy sports ticker bar that sat at the edge of the screen while you watched a game in a browser — and had paid several developers across two earlier builds to get there.',
        ),
        p(
          'What they had to show for it was a Chrome-extension-only product, useful only inside the browser, useful only during sports seasons, and structurally fragile. Each round of paid work had left behind a different developer\u2019s code, none of it stitched together cleanly, none of it in source control or organized in a way the team could keep growing on.',
        ),
        p(
          'The team was not short on vision or commitment. They were short on a foundation that could carry it.',
        ),
      ],
      diagnosis: [
        p(
          'Daniel was the first one to look at the codebase and call the shot: this would have to be a full rebuild. Brandon, the other RelentNet co-founder, came in for a second look specifically to see what could be salvaged — and arrived at the same conclusion. The Firebase-bound architecture was too rigid and too tangled to extend; every additional fix would be paying interest on the wrong foundation.',
        ),
        p(
          'The deeper diagnosis was about scope, not just code. A ticker that lived inside a browser and only ran during sports seasons was a much smaller product than what the team was actually capable of shipping. The real opportunity was to decouple the ticker from the browser, broaden it past sports, and design the system so new data sources could be added without rebuilding the product each time.',
        ),
      ],
      build: [
        p(
          'Over the months that followed, we sat down with the original idea and reshaped it. RSS feeds for live headlines, market data for finance, fantasy league integration, and a desktop-native shell that could run alongside any application — not just a browser tab. The product\u2019s identity moved from "Chrome extension for sports" to "always-visible desktop ticker for whatever data matters to you."',
        ),
        p(
          'The architecture we landed on is intentionally decoupled. A Go core API handles routing, authentication via self-hosted Logto, and real-time delivery over per-user Redis pub/sub channels streamed to clients via Server-Sent Events. Rust services ingest from each source on their own schedules — TwelveData WebSockets for market data, ESPN for sports, RSS feeds for news, Yahoo for fantasy — normalize the data, and write to PostgreSQL. Sequin watches the database for changes and fires CDC webhooks back into the core, which fans them out to the right users.',
        ),
        p(
          'The client is a Tauri v2 native app wrapping a React 19 + Vite 7 + TanStack Router frontend, with a daisyUI-based theme system and Motion-driven animations. It installs on macOS, Windows, and Linux. The ticker can be docked to any edge of the screen, with adjustable density, scroll speed, row count, and nine theme palettes.',
        ),
        p(
          'The hardest decision was committing to a channel architecture where each data source — sports, finance, news, fantasy — is a fully self-contained unit with its own Go API, Rust service, dashboard tab, and feed component. No shared code between channels. That decision cost more upfront, but it is the reason new channels can ship today without touching the rest of the product, and the reason community contributors can add their own.',
        ),
      ],
      outcome: [
        p(
          'Scrollr is in beta and preparing for launch. The original founders, Phil included, have stayed close throughout and have been openly happy with both the product and the partnership. The version of Scrollr that exists today is the version they were trying to fund into existence on the first two attempts — a real product, not a brittle extension.',
        ),
        p(
          'The product is open source on GitHub, runs natively on three platforms, ships with a free tier and a paid "Uplink" plan, and has a Discord community organized around it. The architecture earned its place: each new channel ships independently, and the team can talk about the product as a platform rather than as a single sports widget.',
        ),
      ],
      stewardship: [
        p(
          'Two years in, the engagement is ongoing. RelentNet continues to design and build new channels and features, hosts the production stack on self-hosted Coolify infrastructure, monitors and maintains the services, and stays close to the Scrollr team as the product moves from beta toward launch.',
        ),
      ],
    },
    meta: {
      title: 'Scrollr Case Study | RelentNet',
      description:
        'How RelentNet rebuilt Scrollr from a fragile Chrome-extension fantasy ticker into a cross-platform native desktop product with a decoupled, CDC-driven real-time architecture.',
    },
  },
  {
    slug: 'cambridge-building-group',
    name: 'Cambridge Building Group',
    url: 'https://cambridgebg.com',
    industry: 'Commercial Construction',
    systemType: 'Sales Enablement System',
    summary: {
      problem:
        'A high-trust construction firm needed a digital presence that matched the quality of its work and helped serious prospects understand capability quickly.',
      diagnosis:
        'The site needed to reduce sales friction by making credibility, project quality, and company positioning immediately clear.',
      build:
        'A commanding marketing system with streamlined messaging, professional visual hierarchy, and conversion-focused inquiry paths.',
      outcome:
        'The company gained a more credible front door for high-value commercial opportunities and a cleaner way to support sales conversations.',
    },
    hero: {
      tagline:
        'A commanding front door for high-value commercial construction opportunities.',
      image: {
        src: '/cbg_portfolio.png',
        alt: 'Cambridge Building Group homepage preview',
        width: 1440,
        height: 810,
      },
    },
    atAGlance: {
      role: 'Marketing site, messaging, hosting',
    },
    story: {
      problem: [
        p(
          'Cambridge Building Group does high-trust commercial work, but the previous web presence did not communicate that. Prospects landed on a site that under-represented the company and gave sales conversations nothing to lean on.',
        ),
        p(
          'In commercial construction, the website is not a brochure — it is a stage in the buying process. A weak stage costs the firm conversations it should be having.',
        ),
      ],
      diagnosis: [
        p(
          'The diagnostic showed the real problem was sales friction, not visual design. Serious prospects needed to understand capability, credibility, and positioning within a few seconds of arriving on the site.',
        ),
        p(
          'Everything else — typography, project imagery, contact paths — needed to serve that one job.',
        ),
      ],
      build: [
        p(
          'We built a marketing system with deliberate visual hierarchy, streamlined messaging, and conversion-focused inquiry paths. The structure was designed so that a prospect at the top of the funnel and a prospect ready to talk both find the right next step.',
        ),
        p(
          'The result reads as a commercial firm that takes itself seriously, which is the version of the firm we wanted serious prospects to meet first.',
        ),
      ],
      outcome: [
        p(
          'Cambridge gained a cleaner front door for high-value commercial opportunities. Sales conversations have more to lean on, and the brand is no longer underselling the work behind it.',
        ),
      ],
    },
    meta: {
      title: 'Cambridge Building Group Case Study | RelentNet',
      description:
        'How RelentNet built a sales-enablement marketing system for a high-trust commercial construction firm.',
    },
  },
  {
    slug: 'courtcommand',
    name: 'CourtCommand',
    url: 'https://courtcommand.app',
    industry: 'Sports Technology',
    systemType: 'Real-Time Operations Engine',
    summary: {
      problem:
        'Broadcast-style sports environments cannot tolerate lag, unclear state, or fragile manual scorekeeping workflows.',
      diagnosis:
        'The system needed to behave like operational infrastructure: fast, multi-tenant, synchronized, and simple under pressure.',
      build:
        'A low-latency referee engine and sports ticker designed around real-time score synchronization and live event workflows.',
      outcome:
        'CourtCommand became a purpose-built operating layer for sports presentation instead of another generic scoreboard interface.',
    },
    hero: {
      tagline:
        'A low-latency operating layer for live sports, designed for the people running the room.',
    },
    atAGlance: {
      role: 'Product design, build, hosting',
    },
    story: {
      problem: [
        p(
          'Live sports environments do not forgive sluggish software. A referee, a scorekeeper, and a broadcast operator are all making decisions in seconds, and the tools they reach for need to behave like infrastructure, not like apps.',
        ),
        p(
          'Generic scoreboard interfaces and manual scorekeeping workflows leave too much room for desynchronization, ambiguous state, and the small frictions that compound on game day.',
        ),
      ],
      diagnosis: [
        p(
          'The diagnostic framed CourtCommand as an operations problem first and a product problem second. The system needed to be fast, multi-tenant, synchronized across every surface, and simple to operate under pressure.',
        ),
        p(
          'Everything else — UI, theming, configuration — had to defer to those operational requirements.',
        ),
      ],
      build: [
        p(
          'We built a low-latency referee engine and sports ticker around real-time score synchronization. Game state lives in one place, every connected surface stays consistent, and the operator interface is simple enough to run during a live event.',
        ),
      ],
      outcome: [
        p(
          'CourtCommand reads as a purpose-built operating layer for live sports, not another scoreboard skin. The product is shaped by the demands of a real game-day room.',
        ),
      ],
    },
    meta: {
      title: 'CourtCommand Case Study | RelentNet',
      description:
        'How RelentNet built CourtCommand as a low-latency operating layer for live sports presentation.',
    },
  },
  {
    slug: 'vm-homes',
    name: 'VM Homes',
    url: 'https://vm-homes.com',
    industry: 'Real Estate',
    systemType: 'Client Experience Platform',
    summary: {
      problem:
        'The team needed more than a polished website; they needed a premium buyer experience that could support property search and neighborhood trust.',
      diagnosis:
        'Real estate prospects need clarity, confidence, and fast access to relevant inventory before they are ready to start a conversation.',
      build:
        'A premium digital storefront with MLS-integrated property search, neighborhood guidance, and client-first conversion paths.',
      outcome:
        'The site now works as both a brand asset and a practical client acquisition tool for buyers evaluating the St. Pete Beach market.',
    },
    hero: {
      tagline:
        'A premium client experience for buyers evaluating the St. Pete Beach market.',
      image: {
        src: '/vmh_portfolio.png',
        alt: 'VM Homes site preview',
        width: 1440,
        height: 810,
      },
    },
    atAGlance: {
      role: 'Product design, build, hosting',
    },
    story: {
      problem: [
        p(
          'VM Homes did not need a brochure site. The team needed an experience their buyers could trust before reaching out — one that respected the price point of the homes and supported the trust the team had already built in the neighborhood.',
        ),
        p(
          'A polished website on its own would not have moved the needle. The buyer experience needed to do work.',
        ),
      ],
      diagnosis: [
        p(
          'Buyers in this segment evaluate quietly. They want clarity, confidence, and fast access to relevant inventory before they ever introduce themselves. Anything friction-heavy in the early journey costs the team conversations that should have happened.',
        ),
        p(
          'The diagnostic pointed at a client experience platform, not a marketing site.',
        ),
      ],
      build: [
        p(
          'We built a premium digital storefront with MLS-integrated property search, neighborhood guidance, and client-first conversion paths. Buyers can move from browsing to a real conversation without ever feeling chased.',
        ),
      ],
      outcome: [
        p(
          'The site works as both a brand asset and a practical client acquisition tool. Buyers get clarity early; the team gets better conversations when those buyers raise their hand.',
        ),
      ],
    },
    meta: {
      title: 'VM Homes Case Study | RelentNet',
      description:
        'How RelentNet built a premium client experience platform for VM Homes, supporting trust-led real estate in the St. Pete Beach market.',
    },
  },
  {
    slug: 'star-kids',
    name: 'Star Kids',
    url: 'https://starkids.relentnet.dev',
    industry: 'Nonprofit',
    systemType: 'Mission Communication System',
    summary: {
      problem:
        'A mission-driven organization needed to explain programs, trust, and impact without overwhelming donors or families.',
      diagnosis:
        'The experience needed to simplify complex service areas into a story people could understand and act on quickly.',
      build:
        'A focused nonprofit presence for education, healthcare, nutrition, and mentorship programs with clear paths to learn and support.',
      outcome:
        'The organization gained a clearer digital home for communicating purpose, programs, and credibility.',
    },
    hero: {
      tagline:
        'A clearer digital home for a mission with too many things to say at once.',
    },
    atAGlance: {
      role: 'Marketing site, hosting',
    },
    story: {
      problem: [
        p(
          'Star Kids does meaningful work across several program areas — education, healthcare, nutrition, mentorship — and the previous web presence let all of that flatten into noise. Donors, families, and partners all had to dig to find the part that mattered to them.',
        ),
        p(
          'Mission-driven organizations live or die on clarity. Anything that asks the visitor to work too hard becomes a quiet barrier to support.',
        ),
      ],
      diagnosis: [
        p(
          'The diagnostic showed that the answer was not more content. It was a clearer story: which programs exist, who they serve, how to support them, and how to learn more without being asked to commit before understanding.',
        ),
      ],
      build: [
        p(
          'We built a focused presence that introduces each program area cleanly, surfaces the credibility behind the mission, and offers a direct path for donors and families to take the next step.',
        ),
      ],
      outcome: [
        p(
          'Star Kids has a clearer digital home for communicating purpose, programs, and credibility. The work the team does is no longer competing with its own website.',
        ),
      ],
    },
    meta: {
      title: 'Star Kids Case Study | RelentNet',
      description:
        'How RelentNet built a focused mission communication system for the Star Kids nonprofit.',
    },
  },
]

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug)
}

export function getAdjacentCaseStudies(slug: string): {
  prev: CaseStudy | null
  next: CaseStudy | null
} {
  const index = caseStudies.findIndex((study) => study.slug === slug)
  if (index === -1) {
    return { prev: null, next: null }
  }
  return {
    prev: index > 0 ? caseStudies[index - 1] : null,
    next: index < caseStudies.length - 1 ? caseStudies[index + 1] : null,
  }
}
