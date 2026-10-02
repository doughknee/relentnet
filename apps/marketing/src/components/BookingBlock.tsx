import { BookingWidget } from '@/components/BookingWidget'
import { CtaLink } from '@/components/CtaLink'
import { siteConfig } from '@/site.config'

interface BookingBlockProps {
  /** Shown beside the portrait while booking is on. */
  founder: { name: string; role: string; city: string }
  /** Prefilled mailto: for the contact state's "Email us". */
  mailto: string
}

const phoneHref = () =>
  `tel:${siteConfig.contact.phoneFormatted.replace(/[^+\d]/g, '')}`

const linkClass = 'hover:text-gold-text transition-colors'

/** The contact details and the prefilled mailto, for when booking is off or
 *  hq says the page is not available. */
function ContactDetails({ mailto }: { mailto: string }) {
  const { phone, email, hours } = siteConfig.contact
  return (
    <>
      <p className="font-mono text-[11px] tracking-[0.26em] uppercase text-ink-muted mb-4">
        Reach us directly
      </p>
      {/* From siteConfig, like the footer and the homepage, so a number
          cannot be changed everywhere except one place. */}
      <p className="font-serif text-[clamp(34px,4vw,48px)] leading-none text-ink-em">
        <a href={phoneHref()} className={linkClass}>
          {phone}
        </a>
      </p>
      <p className="mt-4 text-lg text-ink-sub">
        <a href={`mailto:${email}`} className={linkClass}>
          {email}
        </a>{' '}
        · {hours}
      </p>
      <p className="mt-3 text-base text-ink-muted">
        In-person available across TN, LA, GA, FL.
      </p>
      <div className="mt-6 border-t border-line pt-6">
        <h2 className="font-serif text-[28px] leading-tight mb-5">
          Or write to us
        </h2>
        <CtaLink href={mailto} variant="outline" block>
          Email us
        </CtaLink>
        <p className="mt-5 text-base font-light leading-6 text-ink-sub">
          A few sentences is enough. We read every note and reply within one
          business day.
        </p>
      </div>
    </>
  )
}

/**
 * The booking card at the top of /inquire (`id="book"`, where every "Book a
 * call" button lands), in one of two states.
 *
 * Booking: `siteConfig.contact.booking.handle` is set, so the card holds the
 * founder and `BookingWidget`, which books through hq's API. Phone and email
 * live in the "Or write to us" band below, so they appear once.
 *
 * Contact: no handle, so the card offers what exists without booking: phone,
 * email, hours and the prefilled mailto.
 */
export function BookingBlock({ founder, mailto }: BookingBlockProps) {
  const { handle } = siteConfig.contact.booking

  return (
    <aside
      id="book"
      data-testid={handle ? 'booking-calendar' : 'booking-fallback'}
      className="scroll-mt-28 border border-line bg-card p-6 md:p-8"
    >
      {handle ? (
        <>
          <div className="flex items-center gap-4">
            <img
              src="/brandon-harris-320.webp"
              width={56}
              height={56}
              alt=""
              className="size-14 rounded-full object-cover border border-line"
            />
            <div>
              <p className="text-lg font-medium text-ink-em">{founder.name}</p>
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted">
                {founder.role} · {founder.city}
              </p>
            </div>
          </div>
          <div className="mt-6 min-h-[200px]">
            <BookingWidget fallback={<ContactDetails mailto={mailto} />} />
          </div>
        </>
      ) : (
        <ContactDetails mailto={mailto} />
      )}
    </aside>
  )
}
