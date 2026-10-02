export interface CaseStudyMetric {
  label: string
  /** Flat metric — present when from/to are not set. */
  value?: string
  /** Delta metric — `from` value before the engagement. */
  from?: string
  /** Delta metric — `to` value after the engagement. */
  to?: string
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

export type CaseStudySectionRef =
  | 'challenge'
  | 'diagnosis'
  | 'solution'
  | 'results'

export interface CaseStudyHeroBeat {
  image: CaseStudyImage
  sectionRef: CaseStudySectionRef
  blurb: string
}

export interface CaseStudyHero {
  tagline: string
  image?: CaseStudyImage
  /**
   * Story-beat cycler content. When 1+ entries are present, the hero
   * renders the cycling showcase. Otherwise it falls back to the
   * single-image render using `image`.
   */
  beats?: ReadonlyArray<CaseStudyHeroBeat>
}

export interface StackItem {
  label: string
  /** simple-icons slug — e.g. 'react', 'tauri'. Optional; falls back to lucide. */
  iconSlug?: string
}

export interface StackCategory {
  category: string
  items: ReadonlyArray<StackItem>
}

export interface CaseStudyGlobal {
  label: string
  /** Absolute path from /public, e.g. '/logos/cloudflare.svg'. */
  logoSrc: string
}

export interface CaseStudyAtAGlance {
  engagementYear?: string
  duration?: string
  role?: string
  stack?: ReadonlyArray<StackCategory>
  /** Follows the computed tool count under "Built with", e.g. "across the site and the portal". */
  stackScope?: string
  metrics?: ReadonlyArray<CaseStudyMetric>
  /**
   * Compact inline quote for the At-a-glance strip. The detail-page hero
   * quote is the top-level `heroQuote` instead.
   */
  quote?: CaseStudyQuote
  /** Stripe-style "Global" row in the At-a-glance card. */
  global?: CaseStudyGlobal
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

/**
 * One named category of work delivered on the engagement. Renders
 * inside CaseStudyServices as a column with bulleted sub-items, the
 * same convention used by Instrument, Ramotion, and most peer agencies.
 */
export interface CaseStudyServiceCategory {
  label: string
  items: ReadonlyArray<string>
}

/**
 * Press, awards, or third-party validation. `href` is optional so we
 * can list a recognition even without a link target.
 */
export interface CaseStudyRecognition {
  label: string
  detail?: string
  href?: string
}

/**
 * A client's full written testimonial, rendered verbatim as a letter on the
 * detail page. One string per paragraph; never trim or paraphrase.
 */
export interface CaseStudyTestimonial {
  paragraphs: ReadonlyArray<string>
  attribution: {
    name: string
    role: string
    company: string
  }
  /** Where and when the letter came from, shown under the signature. */
  provenance?: string
}

/** The RelentNet person behind the engagement, shown beside the letter. */
export interface CaseStudyBuilder {
  name: string
  /** e.g. "Co-founder & CEO, RelentNet". */
  role: string
  location?: string
  bio: string
  image: CaseStudyImage
}

export type EngagementType = 'product' | 'operations' | 'platform'

export interface CaseStudy {
  slug: string
  name: string
  url: string
  industry: string
  systemType: string
  /** Classifies the engagement for the index "By engagement type" tabs. */
  engagementType: EngagementType
  /** Promote to the index "Featured engagement" band. Exactly one true. */
  featured?: boolean
  summary: CaseStudySummary
  hero: CaseStudyHero
  /**
   * 2\u20133 sentence elevator pitch shown directly under the hero, before
   * any structured section. Frames the entire case for skimmers.
   */
  elevatorPitch?: string
  atAGlance: CaseStudyAtAGlance
  story: CaseStudyStory
  /**
   * One sentence from `testimonial.paragraphs`, verbatim, shown in the hero
   * with the letter's attribution. Renders only alongside a testimonial.
   */
  heroQuote?: string
  testimonial?: CaseStudyTestimonial
  builtBy?: CaseStudyBuilder
  services?: ReadonlyArray<CaseStudyServiceCategory>
  recognition?: ReadonlyArray<CaseStudyRecognition>
  meta: CaseStudyMeta
  /** Used by the index featured-tile band; falls back to hero.image cropped. */
  portraitImage?: CaseStudyImage

  /** One huge stat surfaced in the index "Measurable results" band. */
  featuredStat?: {
    value: string
    description: string
    /** The description continues the value ("170+" + "API endpoints…"), so excerpts join them. */
    joinsValue?: boolean
  }

  /** Pill in the detail-page "Products used" row. Falls back to omitted. */
  region?: string

  /** Drives the index "Customers by size" tab grouping. */
  companySize: 'startup' | 'growth' | 'enterprise'

  /** Detail-page hero headline. Falls back to hero.tagline. */
  detailHeadline?: string

  /** Detail-page body paragraph. Falls back to combining hero.tagline + summary.problem. */
  detailBody?: string

  /** Detail-page Results section entries. Falls back to a single entry derived from summary.outcome. */
  results?: ReadonlyArray<{ headline: string; body: string }>
}

const p = (text: string): StoryBlock => ({ type: 'p', text })

const builtByBrandon = (bio: string): CaseStudyBuilder => ({
  name: 'Brandon Harris',
  role: 'Co-founder & CEO, RelentNet',
  location: 'Nashville',
  bio,
  image: {
    src: '/brandon-harris.webp',
    alt: 'Brandon Harris',
    width: 640,
    height: 800,
  },
})

export const caseStudies: ReadonlyArray<CaseStudy> = [
  {
    slug: 'scrollr',
    name: 'Scrollr',
    url: 'https://myscrollr.com',
    industry: 'Consumer Software',
    systemType: 'Cross-Platform Desktop Product',
    engagementType: 'product',
    companySize: 'startup',
    featured: true,
    featuredStat: {
      value: '1 → 3',
      description:
        'Scrollr shipped from a single Chrome extension to native apps on macOS, Windows, and Linux.',
    },
    detailHeadline:
      'A fantasy ticker stuck in Chrome, rebuilt as a desktop app on three platforms.',
    summary: {
      problem:
        'A founder-funded fantasy ticker had cycled through multiple developers without source control, accumulating a rigid Firebase codebase that could not carry the product the team actually wanted to ship.',
      diagnosis:
        'The build was unsalvageable, but the underlying idea was bigger than a Chrome extension for sports. The product needed to be reframed as a configurable, cross-platform live-data ticker with room to grow beyond a single domain.',
      build:
        'A complete redesign and rebuild: native desktop app, decoupled channel architecture, multi-source real-time pipeline, and a community-extensible plugin model that lets new data sources ship without disturbing the rest of the product.',
      outcome:
        'Scrollr has reached beta with the original founders. The product now reads as a coherent platform rather than a fragile sports extension: installable on macOS, Windows, and Linux, open-source, and architected to keep growing.',
    },
    hero: {
      tagline:
        'A quiet, always-visible desktop ticker for live scores, prices, headlines, and fantasy, rebuilt from a brittle Chrome extension into a cross-platform native product.',
      image: {
        src: '/case-studies/scrollr/hero-sports-dark.webp',
        alt: 'Scrollr desktop app showing live MLB scores with team logos, status pills, and tabs for Schedule and Standings',
        width: 1600,
        height: 954,
      },
      beats: [
        {
          sectionRef: 'challenge',
          blurb:
            'A founder-funded fantasy ticker locked inside a fragile Chrome extension: multiple developers, no source control, no foundation to build on.',
          image: {
            src: '/case-studies/scrollr/legacy-ticker-bar.webp',
            alt: 'Original Scrollr Chrome-extension ticker bar showing live sports scores in a long horizontal strip',
            width: 1920,
            height: 112,
          },
        },
        {
          sectionRef: 'diagnosis',
          blurb:
            'The codebase was unsalvageable, but the underlying idea was bigger than sports. Decouple the ticker from the browser, broaden past one season, and ship a real product.',
          image: {
            src: '/case-studies/scrollr/ticker-all-detailed-dark.webp',
            alt: 'Scrollr ticker strip serving sports, finance, news, and fantasy together in detailed density',
            width: 1465,
            height: 62,
          },
        },
        {
          sectionRef: 'solution',
          blurb:
            'A cross-platform Tauri desktop app over a decoupled channel architecture: Go core, Rust ingestion services, PostgreSQL + Sequin CDC, SSE delivery.',
          image: {
            src: '/case-studies/scrollr/catalog-dark.webp',
            alt: 'Scrollr source catalog showing Finance, Sports, Fantasy, News, Clock, and Weather as added channels',
            width: 1600,
            height: 954,
          },
        },
        {
          sectionRef: 'results',
          blurb:
            'Now in beta on macOS, Windows, and Linux: open-source, multi-channel, and configurable at last.',
          image: {
            src: '/case-studies/scrollr/settings-ticker-dark.webp',
            alt: 'Scrollr ticker settings panel with controls for edge position, scroll speed, row count, and per-row channel assignment',
            width: 1600,
            height: 954,
          },
        },
      ],
    },
    elevatorPitch:
      'Scrollr came to RelentNet as a fantasy-football Chrome extension built by a rotating cast of contractors, with none of it in source control. It now ships as a free, open-source desktop app for macOS, Windows, and Linux, with sports, markets, news, and more on one live ticker.',
    portraitImage: {
      src: '/case-studies/scrollr/portrait.webp',
      alt: 'Scrollr desktop app, portrait crop: the source list beside live MLB scores',
      width: 760,
      height: 950,
    },
    atAGlance: {
      engagementYear: '2024–present',
      role: 'Product strategy, design, full-stack engineering, devops, hosting, ongoing stewardship',
      stackScope: 'across the desktop app and the live-data pipeline',
      stack: [
        {
          category: 'Client',
          items: [
            { label: 'Tauri v2', iconSlug: 'tauri' },
            { label: 'React 19', iconSlug: 'react' },
            { label: 'Vite 7', iconSlug: 'vite' },
            { label: 'TanStack Router' },
            { label: 'Tailwind 4', iconSlug: 'tailwindcss' },
          ],
        },
        {
          category: 'Server',
          items: [
            { label: 'Go (Fiber)', iconSlug: 'go' },
            { label: 'Rust (tokio)', iconSlug: 'rust' },
          ],
        },
        {
          category: 'Data',
          items: [
            { label: 'PostgreSQL', iconSlug: 'postgresql' },
            { label: 'Redis', iconSlug: 'redis' },
            { label: 'Sequin CDC' },
          ],
        },
        {
          category: 'Auth & Ops',
          items: [{ label: 'Logto' }],
        },
      ],
      metrics: [
        {
          label: 'Where it runs',
          from: 'A Chrome extension',
          to: 'macOS, Windows, Linux',
          context:
            'Scrollr is now a native Tauri app with an installer for each platform. It sits above any window instead of living inside a browser tab.',
        },
        {
          label: 'What it carries',
          from: 'Fantasy football, in season',
          to: '56 widgets',
          context:
            'Sports, markets, news, RSS, weather, and utilities, from one catalog the server defines. A new widget ships without a new app release.',
        },
        {
          label: 'Who owns the code',
          from: 'No source control',
          to: 'Open source, AGPL-3.0',
          context:
            'Every line is public on GitHub. The founders can read all of it, and so can anyone deciding whether to trust the app.',
        },
      ],
      global: {
        label: 'Cloudflare Global CDN',
        logoSrc: '/logos/cloudflare.svg',
      },
    },
    story: {
      problem: [
        p(
          'Phil and three partners had raised money around a clear idea: a fantasy sports ticker that sat at the edge of the screen while you watched a game. Daniel, a RelentNet co-founder, met them at an incubator pop-up where they were looking for a developer partner.',
        ),
        {
          type: 'image',
          image: {
            src: '/case-studies/scrollr/legacy-homepage.png',
            alt: 'The pre-rebuild myscrollr.com marketing page, built on Wix, framed entirely around fantasy football',
            caption:
              'The old myscrollr.com: a Wix page about fantasy football, as narrow as the product under it.',
            width: 1362,
            height: 959,
          },
        },
        p(
          'They had already paid for two builds. What they had to show for it was a Chrome extension that worked only in the browser and only during the season. Each round had left a different developer’s code behind, and none of it was in source control.',
        ),
        {
          type: 'image',
          image: {
            src: '/case-studies/scrollr/legacy-ticker-bar.webp',
            alt: 'Screenshot of the original Scrollr ticker bar from the Chrome-extension era, showing live sports scores in a long horizontal strip',
            caption:
              'The original ticker. The shape was right, a thin strip of live data at the edge of the screen, but it lived inside a browser extension.',
            width: 1920,
            height: 112,
          },
        },
        p(
          'The team had the idea and the money. They did not have a foundation that could hold either.',
        ),
      ],
      diagnosis: [
        p(
          'Daniel read the code first and called it: this had to be a rebuild. Brandon took a second look for anything worth saving and reached the same answer. The Firebase setup was too tangled to extend, and every fix on top of it would be paying interest on the wrong foundation.',
        ),
        {
          type: 'image',
          image: {
            src: '/case-studies/scrollr/ticker-all-detailed-dark.webp',
            alt: 'Scrollr ticker strip showing sports, finance, news, and fantasy together in detailed density',
            caption:
              'The reframe: the same ticker shape, carrying sports, markets, news, and fantasy at once instead of one season at a time.',
            width: 1465,
            height: 62,
          },
        },
        p(
          'The bigger problem was scope. A ticker that lived in a browser and ran only during the season was a much smaller product than the one the founders wanted. The fix was to take it out of the browser, broaden it past sports, and build it so a new data source could be added without rebuilding the rest.',
        ),
      ],
      build: [
        p(
          'Scrollr became a native desktop app. The client is Tauri v2 around React 19, Vite 7, and TanStack Router, and it installs on macOS, Windows, and Linux. The ticker pins to the top or bottom of any monitor, with speed, density, and row count all adjustable.',
        ),
        p(
          'Behind it, each source has its own Rust service that pulls on its own schedule: TwelveData WebSockets for markets, ESPN for scores, RSS for news, Yahoo for fantasy. They all write to PostgreSQL. Sequin watches the database for changes and hands them to a Go core API, which pushes each one to the right users over Redis pub/sub and Server-Sent Events. Self-hosted Logto handles sign-in.',
        ),
        {
          type: 'image',
          image: {
            src: '/case-studies/scrollr/catalog-dark.webp',
            alt: 'Scrollr source catalog showing Finance, Sports, Fantasy, News, Clock, and Weather as added channels alongside available widgets for System Monitor, Uptime, and GitHub',
            caption:
              'The source catalog. Each channel stands alone, so adding one does not touch the others.',
            width: 1600,
            height: 954,
          },
        },
        p(
          'The expensive decision was keeping every channel separate: its own service, its own API, its own tab and feed, and no code shared between them. It cost more up front. It is also why new channels ship today without touching the rest of the app, and why outside contributors can add their own.',
        ),
      ],
      outcome: [
        p(
          'Scrollr is a public download today. The app is free on all three platforms with three widget slots, and a paid Uplink plan adds more. The live catalog lists 56 widgets across sports, news, finance, and utilities.',
        ),
        {
          type: 'image',
          image: {
            src: '/case-studies/scrollr/settings-ticker-dark.webp',
            alt: 'Scrollr ticker settings panel with controls for edge position, scroll speed, row count, and per-row channel assignment',
            caption:
              'Ticker settings: which edge, how fast, how many rows, and which channel runs on each row.',
            width: 1600,
            height: 954,
          },
        },
        p(
          'The code is public on GitHub under AGPL-3.0, and the community gathers on Discord. The founders, Phil included, have stayed close the whole way. This is the product they paid for twice before: a real app, not a brittle extension.',
        ),
        p(
          '[Adoption, pending: installs, weekly active users, or paid Uplink subscribers, as of month year.]',
        ),
      ],
      stewardship: [
        p(
          'Two years in, the work is ongoing. RelentNet designs and builds new channels and features, hosts the production stack [on Coolify, or on DigitalOcean Kubernetes as myscrollr.com/architecture says: confirm which], and monitors and maintains the services.',
        ),
        p(
          'Every release builds, deploys, and runs a smoke test through GitHub Actions. The download page is on version 1.6.10 as of October 2026.',
        ),
        {
          type: 'image',
          image: {
            src: '/case-studies/scrollr/theme-tokyo-night-dark.webp',
            alt: 'Scrollr settings panel rendered in the Tokyo Night dark theme',
            caption:
              'Tokyo Night, one of twenty palettes in ten families, each with a light and a dark version.',
            width: 1600,
            height: 954,
          },
        },
      ],
    },
    services: [
      {
        label: 'Strategy',
        items: [
          'Codebase audit and rebuild recommendation',
          'Product scope reframing',
          'Channel architecture design',
          'Roadmap planning',
        ],
      },
      {
        label: 'Design & Engineering',
        items: [
          'Cross-platform desktop UI (Tauri v2 + React 19)',
          'Go core API and SSE delivery layer',
          'Rust ingestion services per data source',
          'PostgreSQL schema and CDC pipeline',
          'Twenty-palette theme system with light and dark variants',
        ],
      },
      {
        label: 'Operations',
        items: [
          'Self-hosted Coolify infrastructure',
          'Logto-based authentication and authorization',
          'Production monitoring and maintenance',
          'Ongoing iteration as the product moves toward launch',
        ],
      },
    ],
    recognition: [
      {
        label: 'Open source on GitHub',
        detail:
          'Scrollr ships under AGPL-3.0 with the full codebase public for inspection, fork, and contribution.',
        href: 'https://github.com/brandon-relentnet/myscrollr',
      },
    ],
    heroQuote: '[Quote from Phil or a founding partner, Scrollr, pending]',
    testimonial: {
      paragraphs: [
        '[Paragraph 1, pending: where Scrollr stood before RelentNet, in the founders’ words. The two earlier builds, what they cost, and what it was like to own code nobody could extend.]',
        '[Paragraph 2, pending: the rebuild call, the move from a Chrome extension to a desktop app, and what working with RelentNet is like week to week.] [Quote from Phil or a founding partner, Scrollr, pending]',
        '[Paragraph 3, pending: where Scrollr is now, and whether they would recommend RelentNet to another founder.]',
      ],
      attribution: {
        name: '[Name]',
        role: '[Role]',
        company: 'Scrollr',
      },
      provenance: '[How and when the letter arrived, pending.]',
    },
    builtBy: builtByBrandon(
      'Brandon took the second look at what could be saved, made the same rebuild call Daniel had, and owns what gets built. RelentNet still hosts and maintains Scrollr.',
    ),
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
    systemType: 'Marketing Site + AP Automation',
    engagementType: 'operations',
    companySize: 'enterprise',
    region: 'Nashville, TN',
    featuredStat: {
      value: 'Email → QBO',
      description:
        'Vendor invoices route from inbox to QuickBooks Bills automatically: Claude-vision extraction, PM approval, PDF and project attached.',
    },
    detailHeadline:
      'A credibility-first front door, and an AP pipeline that runs itself.',
    summary: {
      problem:
        'A decade-old Nashville commercial builder had a web presence that undersold the firm, plus an accounts-payable process that ran on manual invoice entry across hundreds of active projects.',
      diagnosis:
        'Two jobs, not one: the site had to make credibility legible in seconds for serious prospects, and the back office needed vendor invoices to stop being keyed in by hand.',
      build:
        'A credibility-first marketing site plus an internal software hub, including an AP portal that reads vendor invoices with Claude vision, routes them through PM review, and posts them to QuickBooks Online as Bills.',
      outcome:
        'Cambridge now opens with its real track record and runs an invoice pipeline that moves from inbox to QuickBooks with the PDF attached and the project tagged.',
    },
    hero: {
      tagline:
        'A commanding front door for high-value commercial construction opportunities, backed by a back office that no longer keys in invoices by hand.',
      image: {
        src: '/case-studies/cambridge-building-group/hero.webp',
        alt: 'Cambridge Building Group homepage: "Building Nashville’s Future" over a navy-and-gold hero noting Est. 2015, 120+ years combined experience, and 350+ projects completed',
        width: 1600,
        height: 1000,
      },
    },
    portraitImage: {
      src: '/case-studies/cambridge-building-group/portrait.webp',
      alt: 'Cambridge Building Group hero, portrait crop',
      width: 900,
      height: 1200,
    },
    atAGlance: {
      engagementYear: '2025–present',
      role: 'Marketing site, internal software hub, AP automation, hosting',
      stackScope: 'across the marketing site and the AP portal',
      stack: [
        {
          category: 'Marketing Site',
          items: [
            { label: 'React 19', iconSlug: 'react' },
            { label: 'TanStack Router' },
            { label: 'Tailwind 4', iconSlug: 'tailwindcss' },
            { label: 'Motion' },
            { label: 'Vite 7', iconSlug: 'vite' },
          ],
        },
        {
          category: 'Invoice Portal',
          items: [
            { label: 'FastAPI', iconSlug: 'fastapi' },
            { label: 'PostgreSQL 16', iconSlug: 'postgresql' },
            { label: 'SQLAlchemy 2' },
            { label: 'Alembic' },
          ],
        },
        {
          category: 'AI & Integrations',
          items: [
            { label: 'Claude (vision)', iconSlug: 'anthropic' },
            { label: 'QuickBooks Online', iconSlug: 'quickbooks' },
            { label: 'Postmark' },
          ],
        },
        {
          category: 'Ops & Storage',
          items: [
            { label: 'Logto' },
            { label: 'Cloudflare R2', iconSlug: 'cloudflare' },
            { label: 'Coolify' },
          ],
        },
      ],
      metrics: [
        {
          label: 'Accounts payable',
          from: 'Manual invoice entry',
          to: 'Inbox → QuickBooks',
          context:
            'Vendor invoices arrive by email or upload, get parsed by Claude vision, pass a PM review, and post to QuickBooks Online as Bills with the PDF and project attached.',
        },
        {
          label: 'Sales presence',
          from: 'Underbuilt web presence',
          to: 'Credibility-first site',
          context:
            'The site opens on the firm’s real record: established 2015, 350+ projects completed, and an unlimited Tennessee contractor license.',
        },
        {
          label: 'Build stack',
          value: 'React 19 + FastAPI',
          context:
            'The same modern stack RelentNet runs in-house, self-hosted on Coolify with Cloudflare R2 storage.',
        },
      ],
    },
    story: {
      problem: [
        p(
          'Cambridge Building Group does high-trust commercial work, but the previous web presence did not communicate that. Prospects landed on a site that under-represented the company and gave sales conversations nothing to lean on.',
        ),
        p(
          'In commercial construction, the website is not a brochure. It is a stage in the buying process. A weak stage costs the firm conversations it should be having.',
        ),
      ],
      diagnosis: [
        p(
          'The diagnostic showed the real problem was sales friction, not visual design. Serious prospects needed to understand capability, credibility, and positioning within a few seconds of arriving on the site.',
        ),
        p(
          'Typography, project imagery, and contact paths all needed to serve that one job.',
        ),
        {
          type: 'image',
          image: {
            src: '/case-studies/cambridge-building-group/track-record.webp',
            alt: 'Cambridge Building Group track-record timeline: founded 2015, the Nashville Shores project, tornado-recovery rebuilds, and an unlimited Tennessee license',
            caption:
              'The credibility was always there: founded 2015, an unlimited Tennessee license, 350+ projects. The work was surfacing it.',
            width: 1600,
            height: 956,
          },
        },
      ],
      build: [
        p(
          'The engagement grew into two pieces of software. The first is the public marketing site, built on React 19, TanStack Router, Tailwind 4, and Motion, with deliberate visual hierarchy and conversion-focused inquiry paths, so a prospect at the top of the funnel and one ready to talk both find the right next step.',
        ),
        {
          type: 'image',
          image: {
            src: '/case-studies/cambridge-building-group/values.webp',
            alt: 'The Cambridge Building Group core-values section: Communication, Urgency, Integrity, Technology, Innovation, and Safety in a tabbed navy-and-gold layout',
            caption:
              'The rebuilt site leads with how the firm works, its core values laid out plainly in the firm’s own navy-and-gold identity.',
            width: 1600,
            height: 956,
          },
        },
        {
          type: 'image',
          image: {
            src: '/case-studies/cambridge-building-group/services.webp',
            alt: 'Cambridge Building Group services section: commercial, hospitality, industrial, multifamily, select residential, and pre-engineered metal buildings',
            caption:
              'Six service areas laid out so a prospect can self-qualify before they ever pick up the phone.',
            width: 1600,
            height: 956,
          },
        },
        p(
          'The second is an internal AP portal. Vendor invoices arrive through a Postmark inbound email address or a manual upload, and Claude vision extracts the fields. A project manager reviews each one, and approved invoices post straight to QuickBooks Online as Bills, PDF attached and project tagged. It runs on FastAPI and PostgreSQL behind self-hosted Logto auth, with Cloudflare R2 for document storage, deployed on Coolify.',
        ),
      ],
      outcome: [
        p(
          'Cambridge now opens with its real track record and runs accounts payable as a pipeline rather than a data-entry chore. Invoices move from inbox to QuickBooks with a human in the loop only where judgment is needed, and the brand finally matches the quality of the work behind it.',
        ),
      ],
      stewardship: [
        p(
          'The engagement continues post-launch. RelentNet hosts the marketing site and AP portal on production infrastructure, monitors their availability and performance, maintains security patches and dependency updates, and supports the Cambridge team as both systems power their daily operations.',
        ),
      ],
    },
    services: [
      {
        label: 'Strategy',
        items: [
          'Sales-credibility positioning',
          'AP workflow diagnosis',
          'Information architecture',
        ],
      },
      {
        label: 'Design & Engineering',
        items: [
          'Marketing site (React 19 + TanStack)',
          'Internal AP portal with Claude-vision extraction',
          'QuickBooks Online integration',
          'Logto authentication',
        ],
      },
      {
        label: 'Operations',
        items: [
          'Self-hosted Coolify infrastructure',
          'Cloudflare R2 document storage',
          'Ongoing iteration and hosting',
        ],
      },
    ],
    results: [
      {
        headline: 'Invoices that post themselves',
        body: 'Vendor invoices arrive by email, get read by Claude vision, pass a PM’s review, and land in QuickBooks Online as Bills with the PDF attached and the project tagged.',
      },
      {
        headline: 'A front door that matches the work',
        body: 'The marketing site leads with the firm’s record: a decade in business, 350+ projects, and an unlimited Tennessee contractor license.',
      },
    ],
    heroQuote:
      'He has proven to be an exceptional partner who not only delivers what he promises, but he also consistently finds ways to deliver more than we ever thought possible.',
    // Verbatim from Jason Hall's email of 2026-09-05 (REL-431). Do not edit.
    testimonial: {
      paragraphs: [
        'Brandon Harris and RelentNet were contracted by our startup construction company to develop a website. The design and data-collection process was detailed and required significant feedback from my team, as should be expected with a project of this nature. The final website was right on par with what we were promised, and the craftsmanship and attention to the small details—animations, transitions, and other design elements—went well beyond what we had expected.',
        'Less than a year after completing the website, we engaged Brandon to develop a web-based solution that would allow our team to digitally process the miscellaneous invoices we receive each month. Our initial request was, at best, vague regarding our ultimate expectations for functionality. We were really only able to explain how our existing "paperless" process worked for receiving, coding, approving, and filing PDF invoices.',
        'What Brandon ultimately delivered was far beyond anything we had envisioned. We are very excited for the possibilities this type of technology could provide as our company continues to grow. Brandon created a fully functional, scalable solution that automates most of the invoice process from receipt to pushing data and documents into QBO, notifies team members when an invoice requires attention, and sends a daily reminder at a designated time if their review has not been completed. He even figured out how to integrate a digital "stamp" reflecting the job-cost coding, approver, and approval date.',
        'The design process was practically painless for our team. Brandon listened carefully to what we needed, understood what we were trying to accomplish, and then worked his digital magic to turn our ideas into a highly functional solution. He was able to take a relatively basic description of our existing process and transform it into something significantly more sophisticated and efficient.',
        'We would highly recommend Brandon Harris and RelentNet for any bespoke coding or technology project. We could not be happier with our investment, the products he has delivered, or the continued support Brandon has provided throughout beta testing and our ongoing daily use of the system. He has proven to be an exceptional partner who not only delivers what he promises, but he also consistently finds ways to deliver more than we ever thought possible.',
      ],
      attribution: {
        name: 'Jason Hall',
        role: 'Executive Vice President',
        company: 'Cambridge Building Group, LLC',
      },
      provenance: 'Sent by email, September 2026. Reproduced verbatim.',
    },
    builtBy: builtByBrandon(
      'Brandon owns what gets built: the vision, the code, the design. RelentNet still hosts and maintains both Cambridge systems.',
    ),
    meta: {
      title: 'Cambridge Building Group Case Study | RelentNet',
      description:
        'How RelentNet built Cambridge Building Group a credibility-first marketing site and an internal AP portal that reads vendor invoices with Claude vision and posts them to QuickBooks Online.',
    },
  },
  {
    slug: 'courtcommand',
    name: 'CourtCommand',
    url: 'https://courtcommand.app',
    industry: 'Sports Technology',
    systemType: 'Real-Time Tournament Platform',
    engagementType: 'platform',
    companySize: 'startup',
    featuredStat: {
      value: '170+',
      joinsValue: true,
      description:
        'API endpoints behind a Go and Redis real-time core powering brackets, live scoring, and broadcast overlays.',
    },
    detailHeadline:
      'One live score that the bracket, the scorer, and the broadcast all read from.',
    summary: {
      problem:
        'Running a pickleball tournament or league means juggling brackets, schedules, live scores, and broadcast graphics, usually across spreadsheets and fragile, generic tools that desync under game-day pressure.',
      diagnosis:
        'This was an infrastructure problem before a UI one: the platform had to be fast, multi-tenant, and synchronized across every surface, scorer and schedule and broadcast overlay alike.',
      build:
        'A pickleball tournament and league platform on a Go + Redis real-time core, paired with a standalone, themeable broadcast-overlay suite: two products sharing one backend.',
      outcome:
        'CourtCommand reads as purpose-built operating infrastructure for live pickleball: tournaments, leagues, live scoring, and broadcast graphics, not another generic scoreboard skin.',
    },
    hero: {
      tagline:
        'Tournaments, leagues, live scoring, and broadcast overlays for pickleball, on one low-latency platform built for the people running the room.',
      image: {
        src: '/case-studies/courtcommand/hero.webp',
        alt: 'CourtCommand homepage: "Pickleball Tournament & League Management" with tournaments, leagues, and venues',
        width: 1600,
        height: 1000,
      },
    },
    elevatorPitch:
      'Pickleball organizers run brackets, schedules, live scores, and stream graphics at the same time, usually across spreadsheets and generic scoreboard apps that drift apart. CourtCommand puts all of it on one real-time engine, so a score entered once shows up everywhere it should.',
    portraitImage: {
      src: '/case-studies/courtcommand/portrait.webp',
      alt: 'CourtCommand homepage, portrait crop',
      width: 900,
      height: 1200,
    },
    atAGlance: {
      engagementYear: '[Year]–present',
      role: 'Product architecture, backend engineering, real-time infrastructure, hosting',
      stackScope: 'across the platform and the broadcast overlays',
      stack: [
        {
          category: 'Core',
          items: [
            { label: 'Go 1.24 (Chi v5)', iconSlug: 'go' },
            { label: 'sqlc' },
            { label: 'Goose migrations' },
          ],
        },
        {
          category: 'Data & Realtime',
          items: [
            { label: 'PostgreSQL 17', iconSlug: 'postgresql' },
            { label: 'Redis 7', iconSlug: 'redis' },
            { label: 'WebSockets' },
          ],
        },
        {
          category: 'Client',
          items: [
            { label: 'React 19', iconSlug: 'react' },
            { label: 'Vite', iconSlug: 'vite' },
            { label: 'TanStack Router' },
            { label: 'Tailwind 4', iconSlug: 'tailwindcss' },
          ],
        },
        {
          category: 'Ops',
          items: [
            { label: 'Docker Compose', iconSlug: 'docker' },
            { label: 'Coolify' },
          ],
        },
      ],
      metrics: [
        {
          label: 'Game-day data',
          from: 'Spreadsheets and scoreboard apps',
          to: 'One real-time engine',
          context:
            'Brackets, schedules, scores, and overlays all read from the same Go and Redis core over six WebSocket channels. A score entered once shows up on every screen.',
        },
        {
          label: 'Broadcast graphics',
          from: '[How stream graphics were made before]',
          to: 'Overlays from live data',
          context:
            'A themeable overlay suite reads from the same engine as the scorers, so the stream shows the score the court just entered. It sells bundled with the platform or on its own.',
        },
        {
          label: 'Event-day workload',
          from: '[Staff hours per event, before]',
          to: '[Hours saved per event]',
          context:
            'Time organizers spend per event on brackets, score entry, and stream graphics. [Measured at: event name, month year.]',
        },
      ],
    },
    story: {
      problem: [
        p(
          'A pickleball tournament does not wait for slow software. Organizers juggle brackets, seeding, schedules, live scores, and broadcast graphics at once, and most of them do it with spreadsheets and generic scoreboard apps.',
        ),
        p(
          'When the scorer, the schedule, and the stream each read from a different place, they drift apart. A wrong score on the stream or a match sent to the wrong court is how game day falls apart in front of players and viewers.',
        ),
        p(
          '[What the client ran events on before CourtCommand, and what it cost them: late brackets, missed matches, staff hours.]',
        ),
      ],
      diagnosis: [
        p(
          'We treated CourtCommand as an operations problem first and a product problem second. It had to be fast, serve many organizations at once, and keep every screen in sync, so the backend had to be trustworthy before a single screen was designed.',
        ),
        p(
          'That meant building the engine first: tournaments, leagues, seasons, brackets, live scoring, and scheduling as one tested API. The broadcast overlays were planned as another reader of the same live data, not something bolted on later.',
        ),
      ],
      build: [
        p(
          'The backend is Go 1.24 on the Chi router over PostgreSQL 17, with type-safe queries generated by sqlc and migrations run by Goose. Redis 7 handles pub/sub, sessions, and rate limiting, and six WebSocket channels push live state to every connected screen.',
        ),
        p(
          'It landed as more than 170 API endpoints across eight build phases, 29 database migrations, and 62 automated tests, all before the UI work began.',
        ),
        p(
          'Two products sit on that backend. The management platform covers tournaments, leagues, brackets, live scoring, scheduling, venues, and player, team, and organization records. The overlay suite draws themeable broadcast graphics from the same live data and sells bundled or on its own.',
        ),
      ],
      outcome: [
        p(
          'CourtCommand is live at courtcommand.app. Anyone can browse public tournaments, leagues, venues, and live matches, and it installs to a phone’s home screen like an app.',
        ),
        p(
          'It reads as operating software for live pickleball, not a scoreboard skin. [First events run on it, pending: names, dates, matches scored, and viewers on the overlays.]',
        ),
      ],
      stewardship: [
        p(
          'RelentNet still runs CourtCommand. It is hosted on Coolify with Docker Compose, the same way RelentNet runs its own systems.',
        ),
        p(
          'RelentNet [monitors uptime, patches dependencies, and ships new features]; [since month year]. [What is next on the roadmap, if it can be shared.]',
        ),
      ],
    },
    heroQuote: '[Quote from the CourtCommand owner, CourtCommand, pending]',
    testimonial: {
      paragraphs: [
        '[Paragraph 1, pending: how they ran events before CourtCommand, what went wrong on game day, and why they wanted one system.]',
        '[Paragraph 2, pending: the first event run on CourtCommand. What scorers, players, and stream viewers noticed, and what it saved the staff.] [Quote from the CourtCommand owner, CourtCommand, pending]',
        '[Paragraph 3, pending: working with RelentNet since launch, and whether they would recommend RelentNet to another organizer or league.]',
      ],
      attribution: {
        name: '[Name]',
        role: '[Role]',
        company: 'CourtCommand',
      },
      provenance: '[How and when the letter arrived, pending.]',
    },
    builtBy: builtByBrandon(
      'Brandon owns what gets built. On CourtCommand that meant the engine first and the screens second. RelentNet still hosts it.',
    ),
    meta: {
      title: 'CourtCommand Case Study | RelentNet',
      description:
        'How RelentNet built CourtCommand, a real-time pickleball tournament, league, and broadcast-overlay platform on a Go and Redis core with 170+ API endpoints.',
    },
  },
  {
    slug: 'vm-homes',
    name: 'VM Homes',
    url: 'https://vm-homes.com',
    industry: 'Real Estate',
    systemType: 'MLS-Integrated Search Platform',
    engagementType: 'platform',
    companySize: 'startup',
    region: 'St. Pete Beach, FL',
    featuredStat: {
      value: '6 markets',
      description:
        'MLS-synced property search across six Tampa Bay submarkets, from downtown St. Pete to the Gulf beaches.',
    },
    detailHeadline:
      'Live Tampa Bay listings inside the VM Homes brand, not on someone else’s portal.',
    summary: {
      problem:
        'A St. Pete Beach real-estate team needed more than a polished website; they needed a premium buyer experience with live local inventory that earned trust before a buyer ever reached out.',
      diagnosis:
        'Buyers in this segment evaluate quietly. They want clarity, confidence, and fast access to relevant listings, and bouncing them to a generic portal to see inventory was costing the team conversations.',
      build:
        'A premium digital storefront with MLS-integrated (IDX) property search synced to the MFRMLS feed, neighborhood guides for six Tampa Bay submarkets, and client-first conversion paths.',
      outcome:
        'The site works as both a brand asset and a practical client-acquisition tool: live listings inside the VM Homes brand, organized around the markets the team actually works.',
    },
    hero: {
      tagline:
        'A premium client experience for buyers evaluating the St. Pete Beach market, with live Tampa Bay inventory built right in.',
      image: {
        src: '/case-studies/vm-homes/hero.webp',
        alt: 'VM Homes homepage: "Real Estate Experts" over a Gulf-front aerial with a property search bar',
        width: 1600,
        height: 1000,
      },
    },
    elevatorPitch:
      'VM Homes is Valerie McClary’s real estate company on Florida’s Gulf Coast, brokered by eXp Realty. Buyers used to leave the site to look at homes. Now they search live MLS listings across six Tampa Bay areas on vm-homes.com, one click from booking a tour.',
    portraitImage: {
      src: '/case-studies/vm-homes/portrait.webp',
      alt: 'VM Homes homepage, portrait crop',
      width: 900,
      height: 1200,
    },
    atAGlance: {
      engagementYear: '[Year]–present',
      role: 'Product design, build, MLS integration, hosting',
      stackScope: 'across the site and the listing search',
      stack: [
        {
          category: 'Site',
          items: [
            { label: 'WordPress', iconSlug: 'wordpress' },
            { label: 'Divi 5' },
          ],
        },
        {
          category: 'Search',
          items: [{ label: 'Lofty IDX' }],
        },
        {
          category: 'Listings',
          items: [{ label: 'MFRMLS (IDX feed)' }],
        },
        {
          category: 'Server',
          items: [
            { label: 'Apache', iconSlug: 'apache' },
            { label: 'PHP 8.2', iconSlug: 'php' },
          ],
        },
      ],
      metrics: [
        {
          label: 'Property search',
          from: 'Buyers sent to a portal',
          to: 'Live MLS listings on-site',
          context:
            'Listings come from the MFRMLS feed through IDX and show inside the VM Homes site. Buyers see current prices, beds, baths, and square footage without leaving.',
        },
        {
          label: 'Markets covered',
          from: '[How buyers browsed by area before]',
          to: 'Six Tampa Bay areas',
          context:
            'Search by Area covers North and South Tampa Bay, the Gulf beaches, North and downtown St. Petersburg, and St. Pete Beach. Each area has its own page a buyer can be sent straight to.',
        },
        {
          label: 'Buyer inquiries',
          from: '[Inquiries per month, before]',
          to: '[Inquiries per month, after]',
          context:
            'Tour requests and seller consultations booked through the site. [Source and date range, pending.]',
        },
      ],
    },
    story: {
      problem: [
        p(
          'VM Homes LLC has served buyers and sellers on Florida’s Gulf Coast since 2016, led by Valerie McClary, a Realtor for 23 years. The team works St. Pete Beach and Tampa Bay as Sun & Shore Group, brokered by eXp Realty.',
        ),
        p(
          'The site had no search of its own. A buyer who wanted to look at homes was sent off to a generic portal, and once they were there, the team’s name was gone from the screen.',
        ),
        p(
          '[What the old site looked like, and roughly how many inquiries it brought in: pending.]',
        ),
      ],
      diagnosis: [
        p(
          'Buyers at this price point look quietly. They want current listings and a clear read on each area before they introduce themselves, and anything that slows that down costs the team a conversation.',
        ),
        p(
          'So the search had to live on vm-homes.com, under the team’s own name. A nicer brochure would not have changed who called.',
        ),
      ],
      build: [
        p(
          'We built the site on WordPress with the Divi theme and added IDX search through the Lofty plugin, which pulls listings from the MFRMLS feed. Current listings show inside the VM Homes brand with prices, beds, baths, and square footage.',
        ),
        {
          type: 'image',
          image: {
            src: '/case-studies/vm-homes/listings.webp',
            alt: 'VM Homes "VM Exclusives" listings: Tampa Bay properties with photos, prices, and bed/bath/square-footage details',
            caption:
              'VM Exclusives: listings from the MFRMLS feed, shown on the VM Homes site with price, beds, baths, square footage, and address.',
            width: 1600,
            height: 956,
          },
        },
        p(
          'Search is organized by the areas the team works: North and South Tampa Bay, the Gulf beaches, North and downtown St. Petersburg, and St. Pete Beach. Each has its own neighborhood page, so Valerie can send a buyer straight to the part of the market that fits them.',
        ),
        {
          type: 'image',
          image: {
            src: '/case-studies/vm-homes/areas.webp',
            alt: 'VM Homes "Search By Area": North and South Tampa Bay, the Gulf beaches, North and downtown St. Petersburg, and St. Pete Beach',
            caption:
              'Search by Area: six parts of the market, each with its own page.',
            width: 1600,
            height: 956,
          },
        },
        p(
          'Every page ends in a next step a buyer can take without feeling chased: schedule a tour, ask for a seller consultation, or talk to the team.',
        ),
      ],
      outcome: [
        p(
          'The site now does two jobs: it carries the brand, and it brings in clients. Buyers see live inventory early, and the team gets better conversations when those buyers raise their hand.',
        ),
        {
          type: 'image',
          image: {
            src: '/case-studies/vm-homes/expertise.webp',
            alt: 'VM Homes "Expertise You Can Trust" section, with a chat-with-an-expert call to action',
            caption:
              'The “Why choose us” band: a button to talk to the team, and a link straight to listings.',
            width: 1600,
            height: 956,
          },
        },
        p(
          '[Result, pending: tour requests or inquiries per month from the site, before and after, with the date range.]',
        ),
      ],
      stewardship: [
        p(
          'RelentNet still hosts vm-homes.com [and keeps WordPress, Divi, and the IDX plugin updated]; [since month year].',
        ),
        p(
          '[What else RelentNet still does for the team, pending: new neighborhood pages such as Downtown Tampa, the Sun & Shore Group update, listing changes.]',
        ),
      ],
    },
    heroQuote: '[Quote from Valerie McClary, VM Homes LLC, pending]',
    testimonial: {
      paragraphs: [
        '[Paragraph 1, pending: what the old site cost the team. Buyers sent off to portals, few inquiries from the site, and how that sat with homes at this price point.]',
        '[Paragraph 2, pending: what changed once live MLS search moved onto vm-homes.com, and what buyers say when they reach out now.] [Quote from Valerie McClary, VM Homes LLC, pending]',
        '[Paragraph 3, pending: working with RelentNet since launch, and whether she would recommend RelentNet to another agent or team.]',
      ],
      attribution: {
        name: '[Name]',
        role: '[Role]',
        company: 'VM Homes LLC',
      },
      provenance: '[How and when the letter arrived, pending.]',
    },
    builtBy: builtByBrandon(
      'Brandon owns what gets built. On VM Homes that meant putting live MLS search on the team’s own site instead of sending buyers to a portal. RelentNet still hosts it.',
    ),
    meta: {
      title: 'VM Homes Case Study | RelentNet',
      description:
        'How RelentNet built VM Homes an MLS-integrated (IDX) property-search platform for the St. Pete Beach and Tampa Bay market.',
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
