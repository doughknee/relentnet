import { CtaLink } from '@/components/CtaLink'
import { Reveal } from '@/components/Reveal'
import { TiltCard } from '@/components/TiltCard'
import { siteConfig } from '@/site.config'

/**
 * The three ways in, closing a page on the same card the homepage's premise
 * section opens it with. Section 01 offers three answers, this offers three
 * doors, and the rhyme is the point: the reader ends where they started,
 * holding options rather than a single funnel.
 *
 * Every claim here is already made elsewhere on the site. The fee and the
 * three answers come from the homepage premise; "not an account manager" is
 * section 03's whole argument.
 */
export const closingDoors: ReadonlyArray<{
  num: string
  title: string
  body: string
  action: { label: string; to?: string; href?: string }
  emphasized?: boolean
}> = [
  {
    num: '01',
    title: 'Book a diagnostic',
    body: 'Free, and it commits you to nothing. It ends with one of three answers: build, connect, or don’t build yet.',
    action: { label: 'Book a Free Diagnostic', to: '/inquire' },
    emphasized: true,
  },
  {
    num: '02',
    title: 'Call',
    body: 'You reach the people who would design and build the thing, not an account manager.',
    // The number stays on the button: it is worth reading, and someone may
    // well dial it by hand off a laptop screen.
    action: {
      label: siteConfig.contact.phone,
      href: `tel:${siteConfig.contact.phoneFormatted.replace(/[^+\d]/g, '')}`,
    },
  },
  {
    num: '03',
    title: 'Email',
    body: 'Tell us which workflow is costing you the most time right now.',
    // The address does NOT go on the button. It has no spaces, so it cannot
    // wrap, and at 12px with the button's tracking it is wider than the card
    // at every breakpoint. It is already visible elsewhere on the site, and
    // the mail client supplies it anyway.
    action: {
      label: 'Email us',
      href: `mailto:${siteConfig.contact.email}`,
    },
  },
]

/**
 * Three across only from 900px, not 768. These cards carry buttons the premise
 * section's do not, and at 768 a third of the column is 138px of content,
 * narrower than every label here.
 *
 * Each card carries its own action instead of the card itself being a link.
 * One of the three is a button and two are addresses, so a whole-card link
 * would have meant one card behaving differently from its neighbours for no
 * reason the reader can see.
 */
export function ClosingDoors({ startDelay = 150 }: { startDelay?: number }) {
  return (
    <div className="mt-16 grid grid-cols-1 min-[900px]:grid-cols-3 gap-5 text-left">
      {closingDoors.map((door, i) => (
        <Reveal key={door.title} delay={startDelay + i * 120} className="h-full">
          <TiltCard
            className={`chromatic-hover h-full flex flex-col pt-10 px-7 min-[768px]:px-9 pb-10 bg-page border border-line ${
              door.emphasized ? 'border-t-2 border-t-gold' : ''
            }`}
          >
            <p className="font-mono text-[10px] tracking-[0.26em] uppercase text-gold-text font-medium">
              {door.num}
            </p>
            <h3 className="font-serif text-[32px] mt-4 mb-3">{door.title}</h3>
            <p className="text-[15px] font-light leading-[1.65] text-ink-sub">
              {door.body}
            </p>
            {/* mt-auto pins the actions to a common baseline: the bodies run
                two to three lines and the row stretches to the tallest, which
                otherwise left them at three heights. */}
            <div className="mt-auto pt-7">
              {door.action.to ? (
                <CtaLink to={door.action.to} block arrow>
                  {door.action.label}
                </CtaLink>
              ) : (
                <CtaLink
                  href={door.action.href as string}
                  variant="outline"
                  block
                  arrow
                >
                  {door.action.label}
                </CtaLink>
              )}
            </div>
          </TiltCard>
        </Reveal>
      ))}
    </div>
  )
}
