import { CtaLink } from '@/components/CtaLink'
import { siteConfig } from '@/site.config'

interface BookingBlockProps {
  /** Shown beside the portrait in the calendar state. */
  founder: { name: string; role: string; city: string }
  /** Prefilled mailto: for the fallback state's "Email us". */
  mailto: string
}

const phoneHref = () =>
  `tel:${siteConfig.contact.phoneFormatted.replace(/[^+\d]/g, '')}`

const linkClass = 'hover:text-gold-text transition-colors'

/**
 * The booking card at the top of /inquire, in one of two states.
 *
 * Calendar: `siteConfig.contact.bookingUrl` is set, so the scheduling page
 * (Cal.com or Calendly) is embedded in a plain iframe, with a link to open it
 * for anyone whose browser blocks the frame.
 *
 * Fallback: no URL yet, so the card offers what exists today: phone, email,
 * hours and the prefilled mailto.
 */
export function BookingBlock({ founder, mailto }: BookingBlockProps) {
  const { bookingUrl, phone, email, hours } = siteConfig.contact

  if (bookingUrl) {
    return (
      <aside
        data-testid="booking-calendar"
        className="border border-line bg-card p-6 md:p-8"
      >
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
        <h2 className="mt-6 font-serif text-[28px] leading-tight">
          Book a 20-minute call
        </h2>
        <iframe
          src={bookingUrl}
          title="Book a 20-minute call with RelentNet"
          loading="lazy"
          className="mt-5 block w-full min-h-[700px] h-[700px] border border-line bg-inset"
        />
        <p className="mt-4 text-base">
          <a
            href={bookingUrl}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-gold-text hover:underline underline-offset-4"
          >
            Open the booking page &rarr;
          </a>
        </p>
        <p className="mt-3 text-base text-ink-muted">
          Prefer to talk now?{' '}
          <a href={phoneHref()} className={linkClass}>
            {phone}
          </a>{' '}
          ·{' '}
          <a href={`mailto:${email}`} className={linkClass}>
            {email}
          </a>
        </p>
      </aside>
    )
  }

  return (
    <aside
      data-testid="booking-fallback"
      className="border border-line bg-card p-6 md:p-8"
    >
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
    </aside>
  )
}
