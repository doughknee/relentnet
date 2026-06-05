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
  metrics?: ReadonlyArray<CaseStudyMetric>
  /**
   * Compact inline quote rendered inside the At-a-glance strip. For a
   * full-width pull quote with photo/role styling, populate the
   * top-level `pullquote` field on CaseStudy instead.
   */
  quote?: CaseStudyQuote
  /** Stripe-style "Global" row in the right-side Stack card. */
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
 * Page-scale pull quote with attribution metadata. Distinct from the
 * inline `quote` StoryBlock variant which lives mid-narrative; this one
 * is its own section.
 */
export interface CaseStudyPullquote {
  text: string
  attribution: {
    name: string
    role: string
    company?: string
  }
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
  pullquote?: CaseStudyPullquote
  services?: ReadonlyArray<CaseStudyServiceCategory>
  recognition?: ReadonlyArray<CaseStudyRecognition>
  meta: CaseStudyMeta
  /** Used by the index featured-tile band; falls back to hero.image cropped. */
  portraitImage?: CaseStudyImage

  /** One huge stat surfaced in the index "Measurable results" band. */
  featuredStat?: { value: string; description: string }

  /** Pill in the detail-page "Products used" row. Falls back to omitted. */
  region?: string

  /** Drives the index "Customers by size" tab grouping. */
  companySize: 'startup' | 'growth' | 'enterprise' | 'placeholder'

  /** Detail-page hero headline. Falls back to hero.tagline. */
  detailHeadline?: string

  /** Detail-page body paragraph. Falls back to combining hero.tagline + summary.problem. */
  detailBody?: string

  /** Detail-page Results section entries. Falls back to a single entry derived from summary.outcome. */
  results?: ReadonlyArray<{ headline: string; body: string }>
}

const p = (text: string): StoryBlock => ({ type: 'p', text })

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
        src: '/case-studies/scrollr/hero-sports-dark.webp',
        alt: 'Scrollr desktop app showing live MLB scores with team logos, status pills, and tabs for Schedule and Standings',
        width: 1600,
        height: 954,
      },
      beats: [
        {
          sectionRef: 'challenge',
          blurb:
            'A founder-funded fantasy ticker locked inside a fragile Chrome extension — multiple developers, no source control, no foundation to build on.',
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
            'Now in beta on macOS, Windows, and Linux. Open-source, multi-channel, configurable — the version of Scrollr the founders had been trying to ship all along.',
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
      'Scrollr arrived as a fragile, fantasy-football Chrome extension built by a rotating cast of contractors. Two years later it ships as an open-source, cross-platform desktop product with a multi-channel real-time pipeline — the version of the product the founders had been trying to build all along.',
    atAGlance: {
      engagementYear: '2024–present',
      role: 'Product strategy, design, full-stack engineering, devops, hosting, ongoing stewardship',
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
          label: 'Platform reach',
          from: 'Chrome extension only',
          to: 'macOS · Windows · Linux',
          context:
            'Tauri v2 native binaries. No browser dependency, no session loss when the tab closes.',
        },
        {
          label: 'Architecture',
          from: 'Firebase monolith',
          to: 'Decoupled channels',
          context:
            'Per-source Rust services, Go core, PostgreSQL + Sequin CDC, SSE delivery.',
        },
        {
          label: 'Source availability',
          from: 'Closed, contractor-owned',
          to: 'Open source · AGPL-3.0',
          context:
            'Full codebase public on GitHub for inspection and contribution.',
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
          'Daniel, a RelentNet co-founder, first met the Scrollr team at an incubator pop-up where they were openly looking for a developer partner. Phil and three partners had raised funding around a clear vision — a fantasy sports ticker bar that sat at the edge of the screen while you watched a game in a browser — and had paid several developers across two earlier builds to get there.',
        ),
        {
          type: 'image',
          image: {
            src: '/case-studies/scrollr/legacy-homepage.png',
            alt: 'The pre-rebuild myscrollr.com marketing page, built on Wix, framed entirely around fantasy football',
            caption:
              'The pre-rebuild marketing site \u2014 a Wix page positioned entirely around fantasy football, matching the narrow scope of the product underneath.',
            width: 1362,
            height: 959,
          },
        },
        p(
          'What they had to show for it was a Chrome-extension-only product, useful only inside the browser, useful only during sports seasons, and structurally fragile. Each round of paid work had left behind a different developer\u2019s code, none of it stitched together cleanly, none of it in source control or organized in a way the team could keep growing on.',
        ),
        {
          type: 'image',
          image: {
            src: '/case-studies/scrollr/legacy-ticker-bar.webp',
            alt: 'Screenshot of the original Scrollr ticker bar from the Chrome-extension era, showing live sports scores in a long horizontal strip',
            caption:
              'The original Scrollr ticker, captured from the pre-rebuild site. The right shape \u2014 a thin live-data strip at the edge of the screen \u2014 trapped inside a brittle browser-only extension.',
            width: 1920,
            height: 112,
          },
        },
        p(
          'The team was not short on vision or commitment. They were short on a foundation that could carry it.',
        ),
      ],
      diagnosis: [
        p(
          'Daniel was the first one to look at the codebase and call the shot: this would have to be a full rebuild. Brandon, the other RelentNet co-founder, came in for a second look specifically to see what could be salvaged — and arrived at the same conclusion. The Firebase-bound architecture was too rigid and too tangled to extend; every additional fix would be paying interest on the wrong foundation.',
        ),
        {
          type: 'image',
          image: {
            src: '/case-studies/scrollr/ticker-all-detailed-dark.webp',
            alt: 'Scrollr ticker strip showing sports, finance, news, and fantasy together in detailed density',
            caption:
              'The reframe: the same ticker shape, but serving sports, markets, news, and fantasy in one product instead of one season at a time.',
            width: 1465,
            height: 62,
          },
        },
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
        {
          type: 'image',
          image: {
            src: '/case-studies/scrollr/catalog-dark.webp',
            alt: 'Scrollr source catalog showing Finance, Sports, Fantasy, News, Clock, and Weather as added channels alongside available widgets for System Monitor, Uptime, and GitHub',
            caption:
              'Each channel is a self-contained unit. Adding a new one — community-built or otherwise — does not touch the existing product.',
            width: 1600,
            height: 954,
          },
        },
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
        {
          type: 'image',
          image: {
            src: '/case-studies/scrollr/settings-ticker-dark.webp',
            alt: 'Scrollr ticker settings panel with controls for edge position, scroll speed, row count, and per-row channel assignment',
            caption:
              'Configuration is opinionated where it matters and quiet everywhere else — edge, speed, row count, per-row channel assignment.',
            width: 1600,
            height: 954,
          },
        },
        p(
          'The product is open source on GitHub, runs natively on three platforms, ships with a free tier and a paid "Uplink" plan, and has a Discord community organized around it. The architecture earned its place: each new channel ships independently, and the team can talk about the product as a platform rather than as a single sports widget.',
        ),
      ],
      stewardship: [
        p(
          'Two years in, the engagement is ongoing. RelentNet continues to design and build new channels and features, hosts the production stack on self-hosted Coolify infrastructure, monitors and maintains the services, and stays close to the Scrollr team as the product moves from beta toward launch.',
        ),
        {
          type: 'image',
          image: {
            src: '/case-studies/scrollr/theme-tokyo-night-dark.webp',
            alt: 'Scrollr settings panel rendered in the Tokyo Night dark theme',
            caption:
              'The polish layer keeps growing too. Nine theme palettes ship with full light and dark variants across every channel, widget, and config panel.',
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
          'Nine-palette theme system with light and dark variants',
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
        'Vendor invoices route from inbox to QuickBooks Bills automatically — Claude-vision extraction, PM approval, PDF and project attached.',
    },
    detailHeadline:
      'A credibility-first front door, and an AP pipeline that runs itself.',
    summary: {
      problem:
        'A decade-old Nashville commercial builder had a web presence that undersold the firm, plus an accounts-payable process that ran on manual invoice entry across hundreds of active projects.',
      diagnosis:
        'Two jobs, not one: the site had to make credibility legible in seconds for serious prospects, and the back office needed vendor invoices to stop being keyed in by hand.',
      build:
        'A credibility-first marketing site plus an internal software hub — including an AP portal that reads vendor invoices with Claude vision, routes them through PM review, and posts them to QuickBooks Online as Bills.',
      outcome:
        'Cambridge now opens with its real track record and runs an invoice pipeline that moves from inbox to QuickBooks with the PDF attached and the project tagged.',
    },
    hero: {
      tagline:
        'A commanding front door for high-value commercial construction opportunities — backed by a back office that no longer keys in invoices by hand.',
      image: {
        src: '/case-studies/cambridge-building-group/hero.webp',
        alt: 'Cambridge Building Group homepage — "Building Nashville’s Future" over a navy-and-gold hero noting Est. 2015, 120+ years combined experience, and 350+ projects completed',
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
            'The site opens on the firm’s real record — established 2015, 350+ projects completed, and an unlimited Tennessee contractor license.',
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
        {
          type: 'image',
          image: {
            src: '/case-studies/cambridge-building-group/track-record.webp',
            alt: 'Cambridge Building Group track-record timeline — founded 2015, the Nashville Shores project, tornado-recovery rebuilds, and an unlimited Tennessee license',
            caption:
              'The credibility was always there — founded 2015, an unlimited Tennessee license, 350+ projects. The work was surfacing it.',
            width: 1600,
            height: 956,
          },
        },
      ],
      build: [
        p(
          'The engagement grew into two pieces of software. The first is the public marketing site — built on React 19, TanStack Router, Tailwind 4, and Motion — with deliberate visual hierarchy and conversion-focused inquiry paths, so a prospect at the top of the funnel and one ready to talk both find the right next step.',
        ),
        {
          type: 'image',
          image: {
            src: '/case-studies/cambridge-building-group/values.webp',
            alt: 'The Cambridge Building Group core-values section — Communication, Urgency, Integrity, Technology, Innovation, and Safety in a tabbed navy-and-gold layout',
            caption:
              'The rebuilt site leads with how the firm works — its core values laid out plainly, in the firm’s own navy-and-gold identity.',
            width: 1600,
            height: 956,
          },
        },
        {
          type: 'image',
          image: {
            src: '/case-studies/cambridge-building-group/services.webp',
            alt: 'Cambridge Building Group services section — commercial, hospitality, industrial, multifamily, select residential, and pre-engineered metal buildings',
            caption:
              'Six service areas laid out so a prospect can self-qualify before they ever pick up the phone.',
            width: 1600,
            height: 956,
          },
        },
        p(
          'The second is an internal AP portal. Vendor invoices arrive through a Postmark inbound email address or a manual upload, and Claude vision extracts the fields. A project manager reviews each one, and approved invoices post straight to QuickBooks Online as Bills — PDF attached, project tagged. It runs on FastAPI and PostgreSQL behind self-hosted Logto auth, with Cloudflare R2 for document storage, deployed on Coolify.',
        ),
      ],
      outcome: [
        p(
          'Cambridge now opens with its real track record and runs accounts payable as a pipeline rather than a data-entry chore. Invoices move from inbox to QuickBooks with a human in the loop only where judgment is needed, and the brand finally matches the quality of the work behind it.',
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
        body: 'The marketing site leads with the firm’s record — a decade in business, 350+ projects, and an unlimited Tennessee contractor license.',
      },
    ],
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
      description:
        'API endpoints behind a Go and Redis real-time core powering brackets, live scoring, and broadcast overlays.',
    },
    detailHeadline:
      'A low-latency operating layer for live pickleball.',
    summary: {
      problem:
        'Running a pickleball tournament or league means juggling brackets, schedules, live scores, and broadcast graphics — usually across spreadsheets and fragile, generic tools that desync under game-day pressure.',
      diagnosis:
        'This was an infrastructure problem before a UI one: the platform had to be fast, multi-tenant, and synchronized across every surface — scorer, schedule, and broadcast overlay alike.',
      build:
        'A pickleball tournament and league platform on a Go + Redis real-time core, paired with a standalone, themeable broadcast-overlay suite — two products sharing one backend.',
      outcome:
        'CourtCommand reads as purpose-built operating infrastructure for live pickleball: tournaments, leagues, live scoring, and broadcast graphics, not another generic scoreboard skin.',
    },
    hero: {
      tagline:
        'Tournaments, leagues, live scoring, and broadcast overlays for pickleball — on one low-latency platform built for the people running the room.',
      image: {
        src: '/case-studies/courtcommand/hero.webp',
        alt: 'CourtCommand homepage — "Pickleball Tournament & League Management" with tournaments, leagues, and venues',
        width: 1600,
        height: 1000,
      },
    },
    portraitImage: {
      src: '/case-studies/courtcommand/portrait.webp',
      alt: 'CourtCommand homepage, portrait crop',
      width: 900,
      height: 1200,
    },
    atAGlance: {
      role: 'Product architecture, backend engineering, real-time infrastructure, hosting',
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
          label: 'Match engine',
          value: 'Go + Redis',
          context:
            '170+ API endpoints and six WebSocket channels keep brackets, scores, and broadcast overlays synchronized in real time.',
        },
        {
          label: 'Backend hardening',
          value: '62 automated tests',
          context:
            'Built across eight implementation phases and 29 database migrations before any UI shipped.',
        },
        {
          label: 'Product surface',
          from: 'Manual scorekeeping',
          to: 'Tournaments + broadcast',
          context:
            'Tournament and league management plus a standalone, themeable broadcast-overlay suite, sold bundled or on its own.',
        },
      ],
    },
    story: {
      problem: [
        p(
          'Running a pickleball tournament or league does not forgive sluggish software. Organizers juggle brackets, seeding, schedules, live scores, and broadcast graphics in real time, and the tools they reach for — usually spreadsheets and generic scoreboard apps — leave too much room for desynchronization and ambiguous state.',
        ),
        p(
          'A scorer, a schedule, and a broadcast overlay all reading from different sources is how game day falls apart. The job was to make one source of truth that every surface trusts.',
        ),
      ],
      diagnosis: [
        p(
          'We framed CourtCommand as an operations problem first and a product problem second. It had to be fast, multi-tenant, and synchronized across every surface, with a backend that could be trusted before a single screen was designed.',
        ),
        p(
          'That meant building the engine first: tournaments, leagues, seasons, brackets, live scoring, and scheduling as a hardened API, with the broadcast overlay treated as a first-class consumer of the same real-time data rather than a bolt-on.',
        ),
      ],
      build: [
        p(
          'The backend is a Go 1.24 service (Chi v5 router) over PostgreSQL 17, with type-safe queries generated by sqlc and migrations embedded via Goose. Redis 7 handles pub/sub, sessions, and rate limiting, and six WebSocket channels push live state to every connected client. It landed as 170+ endpoints across eight implementation phases, 29 migrations, and 62 automated tests before the UI work began.',
        ),
        p(
          'CourtCommand is two products in one codebase: the management platform (tournaments, leagues, brackets, live scoring, scheduling, and player/team/organization management) and a standalone broadcast-overlay suite with themeable graphics that read live from the same engine and sell bundled or on their own.',
        ),
        {
          type: 'image',
          image: {
            src: '/case-studies/courtcommand/hero.webp',
            alt: 'CourtCommand homepage — "Pickleball Tournament & League Management" with tournaments, leagues, and venues',
            caption:
              'The public platform: tournaments, leagues, and live scores over the same real-time core that drives the broadcast overlays.',
            width: 1600,
            height: 1000,
          },
        },
      ],
      outcome: [
        p(
          'CourtCommand reads as purpose-built operating infrastructure for live pickleball, not a scoreboard skin. With the real-time core complete and the public platform live, the product is shaped by the demands of an actual game-day room.',
        ),
      ],
    },
    meta: {
      title: 'CourtCommand Case Study | RelentNet',
      description:
        'How RelentNet built CourtCommand — a real-time pickleball tournament, league, and broadcast-overlay platform on a Go and Redis core with 170+ API endpoints.',
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
    summary: {
      problem:
        'A St. Pete Beach real-estate team needed more than a polished website; they needed a premium buyer experience with live local inventory that earned trust before a buyer ever reached out.',
      diagnosis:
        'Buyers in this segment evaluate quietly. They want clarity, confidence, and fast access to relevant listings — and bouncing them to a generic portal to see inventory was costing the team conversations.',
      build:
        'A premium digital storefront with MLS-integrated (IDX) property search synced to the MFRMLS feed, neighborhood guides for six Tampa Bay submarkets, and client-first conversion paths.',
      outcome:
        'The site works as both a brand asset and a practical client-acquisition tool — live listings inside the VM Homes brand, organized around the markets the team actually works.',
    },
    hero: {
      tagline:
        'A premium client experience for buyers evaluating the St. Pete Beach market — with live Tampa Bay inventory built right in.',
      image: {
        src: '/case-studies/vm-homes/hero.webp',
        alt: 'VM Homes homepage — "Real Estate Experts" over a Gulf-front aerial with a property search bar',
        width: 1600,
        height: 1000,
      },
    },
    portraitImage: {
      src: '/case-studies/vm-homes/portrait.webp',
      alt: 'VM Homes homepage, portrait crop',
      width: 900,
      height: 1200,
    },
    atAGlance: {
      role: 'Product design, build, MLS integration, hosting',
      metrics: [
        {
          label: 'Property search',
          from: 'No owned search experience',
          to: 'MLS-integrated IDX',
          context:
            'Listings sync from the MFRMLS feed, so buyers browse live inventory without leaving the VM Homes brand.',
        },
        {
          label: 'Markets covered',
          value: 'Six Tampa Bay submarkets',
          context:
            'From North and South Tampa Bay to downtown St. Petersburg, the Gulf beaches, and St. Pete Beach.',
        },
      ],
    },
    story: {
      problem: [
        p(
          'VM Homes did not need a brochure site. The team needed an experience their buyers could trust before reaching out — one that respected the price point of the homes and the trust the team had already built around St. Pete Beach.',
        ),
        p(
          'A polished website on its own would not have moved the needle. The buyer experience needed to do work — and that meant putting live, relevant inventory in front of people, not sending them off to a generic portal.',
        ),
      ],
      diagnosis: [
        p(
          'Buyers in this segment evaluate quietly. They want clarity, confidence, and fast access to relevant inventory before they ever introduce themselves. Anything friction-heavy in the early journey costs the team conversations that should have happened.',
        ),
        p(
          'The diagnostic pointed at an MLS-integrated search experience owned by the brand, not a marketing site that hands buyers off the moment they want to look at homes.',
        ),
      ],
      build: [
        p(
          'We built a premium digital storefront with IDX property search synced to the MFRMLS feed, so current listings appear inside the VM Homes brand with live prices, beds, baths, and square footage. Search is organized by the six Tampa Bay submarkets the team works — North and South Tampa Bay, the Gulf beaches, North and downtown St. Petersburg, and St. Pete Beach — alongside neighborhood guidance and client-first conversion paths.',
        ),
        {
          type: 'image',
          image: {
            src: '/case-studies/vm-homes/listings.webp',
            alt: 'VM Homes "VM Exclusives" listings — Tampa Bay properties with photos, prices, and bed/bath/square-footage details',
            caption:
              'Live MFRMLS listings render inside the VM Homes brand — prices, beds, baths, and square footage, with no hand-off to a generic portal.',
            width: 1600,
            height: 956,
          },
        },
        p(
          'Buyers can move from browsing live inventory to a real conversation without ever feeling chased, and the team can point a prospect at the exact slice of the market that fits them.',
        ),
        {
          type: 'image',
          image: {
            src: '/case-studies/vm-homes/areas.webp',
            alt: 'VM Homes "Search By Area" — North and South Tampa Bay, the Gulf beaches, North and downtown St. Petersburg, and St. Pete Beach',
            caption:
              'Search is organized by the six submarkets the team actually works — from downtown St. Pete to the Gulf beaches.',
            width: 1600,
            height: 956,
          },
        },
      ],
      outcome: [
        p(
          'The site works as both a brand asset and a practical client-acquisition tool. Buyers get clarity and live inventory early; the team gets better conversations when those buyers raise their hand.',
        ),
        {
          type: 'image',
          image: {
            src: '/case-studies/vm-homes/expertise.webp',
            alt: 'VM Homes "Expertise You Can Trust" section, with a chat-with-an-expert call to action',
            caption:
              'The brand stays front and center — a premium experience that earns trust before a buyer ever reaches out.',
            width: 1600,
            height: 956,
          },
        },
      ],
    },
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
