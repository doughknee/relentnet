import { createFileRoute } from '@tanstack/react-router'

import { CtaLink } from '@/components/CtaLink'
import { Eyebrow } from '@/components/Eyebrow'
import { siteConfig } from '@/site.config'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/inquire')({
  head: () =>
    seo({
      title: 'Request a Workflow Diagnostic | RelentNet',
      description:
        'Request a RelentNet Workflow Diagnostic by sharing the operational friction, disconnected tools, and workflow context inside your business.',
      path: '/inquire',
    }),
  component: Contact,
})

const mailtoPrompts = [
  'What feels slow or manual:',
  'Tools we use today:',
  'Best way to reach me:',
]

/** A mailto: with the subject and the three prompts filled in as body text. */
function buildMailto() {
  const subject = encodeURIComponent('Inquiry from [your company]')
  const body = encodeURIComponent(mailtoPrompts.join('\n\n'))
  return `mailto:${siteConfig.contact.email}?subject=${subject}&body=${body}`
}

export const inquiryContent = {
  headline: 'Tell us where it feels slow.',
  body: "Manual, disconnected, hard to see. Even a few sentences is enough, and we'll read it before we reply.",
} as const

export const inquiryNextSteps = [
  'We read your note and reply within one business day.',
  'A short call to confirm the diagnostic is the right first step.',
  'A diagnostic, then a clear build / connect / don’t-build answer.',
] as const

function Contact() {
  return (
    <div className="relative overflow-x-clip">
      {/* Radial gold glow over the top of the page */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-screen pointer-events-none bg-[radial-gradient(ellipse_760px_420px_at_calc(50%-350px)_60px,rgba(203,171,69,0.06),transparent_65%)]"
      />

      <div className="relative z-10 pt-[110px] pb-20 px-5 md:px-12">
        <div className="max-w-[720px] mx-auto flex flex-col gap-11">
          <div className="animate-fade-in-up">
            <Eyebrow className="mb-7">Start a conversation</Eyebrow>
            <h1 className="font-serif text-[clamp(36px,6vw,72px)] leading-none mb-6 text-balance">
              Tell us where it{' '}
              <span className="italic text-gold-text">feels slow.</span>
            </h1>
            <p className="text-ink-sub font-light leading-[1.65] max-w-[400px]">
              {inquiryContent.body}
            </p>
          </div>

          <div
            className="animate-fade-in-up"
            style={{ animationDelay: '100ms' }}
          >
            <p className="font-mono text-[10px] tracking-[0.26em] uppercase text-ink-faint mb-4">
              Reach us directly
            </p>
            {/* Hidden until Brandon sets siteConfig.contact.bookingUrl. */}
            {siteConfig.contact.bookingUrl && (
              <div className="mb-6">
                <CtaLink
                  href={siteConfig.contact.bookingUrl}
                  external
                  arrow
                  block
                >
                  Book a 20-minute call
                </CtaLink>
              </div>
            )}
            {/* From siteConfig, like the footer and the homepage. This page
                was the last copy still typed out by hand, which is how a
                number gets changed everywhere except one place. */}
            <p className="font-serif text-[26px] text-ink-em">
              <a
                href={`tel:${siteConfig.contact.phoneFormatted.replace(/[^+\d]/g, '')}`}
                className="hover:text-gold-text transition-colors"
              >
                {siteConfig.contact.phone}
              </a>
            </p>
            <p className="mt-1.5 text-sm text-ink-sub">
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="hover:text-gold-text transition-colors"
              >
                {siteConfig.contact.email}
              </a>{' '}
              · {siteConfig.contact.hours}
            </p>
            <p className="mt-3.5 text-xs text-ink-muted">
              In-person available across TN, LA, GA, FL.
            </p>
          </div>

          <div
            className="animate-fade-in-up border border-line bg-card p-7 md:p-10"
            style={{ animationDelay: '200ms' }}
          >
            <h2 className="font-serif text-[28px] leading-tight mb-6">
              Or write to us
            </h2>
            <CtaLink href={buildMailto()} variant="outline" block>
              Email us
            </CtaLink>
            <p className="mt-5 text-sm font-light text-ink-sub leading-normal">
              A few sentences is enough. We read every note and reply within one
              business day.
            </p>
          </div>

          <div
            className="animate-fade-in-up border-t border-line-faint pt-8"
            style={{ animationDelay: '300ms' }}
          >
            <p className="font-mono text-[10px] tracking-[0.26em] uppercase text-ink-faint mb-5">
              What happens next
            </p>
            <div className="flex flex-col">
              {inquiryNextSteps.map((text, i) => (
                <div
                  key={i}
                  className="flex items-baseline gap-[18px] border-b border-line-faint py-3.5"
                >
                  <span className="font-serif italic text-[15px] text-gold-text shrink-0">
                    {['i.', 'ii.', 'iii.'][i]}
                  </span>
                  <span className="text-sm font-light text-ink-sub leading-normal">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
