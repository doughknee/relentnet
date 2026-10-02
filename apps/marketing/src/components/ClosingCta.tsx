import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { CtaLink } from '@/components/CtaLink'
import { Reveal } from '@/components/Reveal'
import { sectionInner, surfaces } from '@/components/SectionHead'
import { siteConfig } from '@/site.config'

interface ClosingCtaProps {
  /** Heading. Wrap the italic gold tail in a span. */
  children: ReactNode
  cta: string
}

/** Tinted closing band: heading, the one button, the phone line, and a
 *  booking line that exists only while `contact.booking.handle` is set. */
export function ClosingCta({ children, cta }: ClosingCtaProps) {
  const { phone, booking } = siteConfig.contact
  return (
    <section className={`relative ${surfaces.tint}`}>
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_700px_500px_at_50%_100%,rgba(203,171,69,0.08),transparent_70%)]"
      />
      <div
        className={`${sectionInner} relative flex flex-col items-center gap-10 text-center`}
      >
        <Reveal>
          <h2 className="font-serif text-[clamp(34px,5.6vw,72px)] leading-[1.06] text-balance">
            {children}
          </h2>
        </Reveal>
        <Reveal delay={150}>
          <div className="flex flex-col items-center gap-4">
            <CtaLink to="/inquire" arrow>
              {cta}
            </CtaLink>
            <p className="text-base text-ink-muted">
              {booking.handle && (
                <>
                  <Link
                    to="/inquire"
                    hash="book"
                    className="text-ink-sub underline underline-offset-4 hover:text-gold-text"
                  >
                    Book a call
                  </Link>
                  {'. '}
                </>
              )}
              Prefer the phone? Call{' '}
              <a
                href={`tel:${phone}`}
                className="text-ink-sub underline underline-offset-4 hover:text-gold-text"
              >
                {phone}
              </a>
              .
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
