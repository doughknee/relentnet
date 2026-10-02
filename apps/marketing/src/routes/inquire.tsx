import { Link, createFileRoute } from '@tanstack/react-router'

import { founders } from './about'
import { AgendaRow } from '@/components/AgendaRow'
import { BookingBlock } from '@/components/BookingBlock'
import { CtaLink } from '@/components/CtaLink'
import { Eyebrow } from '@/components/Eyebrow'
import { FitLists } from '@/components/FitLists'
import { Reveal } from '@/components/Reveal'
import { leadClass, sectionInner, surfaces } from '@/components/SectionHead'
import { caseStudies } from '@/data/caseStudies'
import { diagnosticFit } from '@/data/fit'
import { seo } from '@/lib/seo'
import { siteConfig } from '@/site.config'

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

const mailtoSubject = 'Inquiry from [your company]'

/** A mailto: with the subject and the three prompts filled in as body text. */
function buildMailto() {
  const subject = encodeURIComponent(mailtoSubject)
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

/** The 30-minute call. `minutes` stays unset until Brandon confirms the
 *  split; a row shows its time only when it is set. */
export const callAgenda: ReadonlyArray<{
  title: string
  detail: string
  minutes?: number
}> = [
  {
    title: 'What feels slow or manual',
    detail: 'Manual, disconnected, hard to see. Tell us where it feels slow.',
  },
  {
    title: 'Tools you use today',
    detail:
      'What the work already runs on, so nothing gets rebuilt that only needs connecting.',
  },
  {
    title: 'Whether the diagnostic is the right first step',
    detail: `If it is, the ${siteConfig.pricing.diagnostic.price} diagnostic ends with a clear build / connect / don’t-build answer. If it is not, we say so.`,
  },
]

/** A sentence from Jason Hall's Cambridge letter, verbatim. The proof band
 *  renders only while the letter still contains it. */
export const inquiryProofQuote =
  'The design process was practically painless for our team.'

const PROOF_SLUG = 'cambridge-building-group'

const mono = 'font-mono text-[11px] tracking-[0.26em] uppercase text-ink-muted'

function Contact() {
  const { phone, phoneFormatted, email, hours } = siteConfig.contact
  const mailto = buildMailto()
  const testimonial = caseStudies.find(
    (s) => s.slug === PROOF_SLUG,
  )?.testimonial
  const showProof = testimonial?.paragraphs.some((p) =>
    p.includes(inquiryProofQuote),
  )

  return (
    <div className="relative overflow-x-clip">
      {/* Radial gold glow over the top of the page */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-screen pointer-events-none bg-[radial-gradient(ellipse_760px_420px_at_calc(50%-350px)_60px,rgba(203,171,69,0.06),transparent_65%)]"
      />

      {/* ── Hero: copy + agenda, booking block ── */}
      <section className="relative pt-[112px] pb-[72px] md:pb-[104px] px-5 md:px-12 xl:px-20">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,540px)] gap-y-10 xl:gap-x-20 xl:gap-y-0 xl:grid-rows-[auto_1fr] items-start">
          <div>
            <Eyebrow className="animate-fade-in-up mb-7">
              Start a conversation
            </Eyebrow>
            <h1
              className="animate-fade-in-up font-serif text-[clamp(38px,6vw,72px)] leading-none mb-6 text-balance"
              style={{ animationDelay: '80ms' }}
            >
              Tell us where it{' '}
              <span className="italic text-gold-text">feels slow.</span>
            </h1>
            <p
              className={`animate-fade-in-up ${leadClass} max-w-[640px]`}
              style={{ animationDelay: '160ms' }}
            >
              {inquiryContent.body}
            </p>
          </div>

          {/* Beside the copy on wide screens, between copy and agenda when
              stacked, as in the mobile frame. */}
          <div
            className="animate-fade-in-up xl:col-start-2 xl:row-start-1 xl:row-span-2"
            style={{ animationDelay: '200ms' }}
          >
            <BookingBlock founder={founders[0]} mailto={mailto} />
          </div>

          <div
            className="animate-fade-in-up xl:mt-12"
            style={{ animationDelay: '240ms' }}
          >
            <div className="flex items-baseline justify-between border-b border-gold pb-3">
              <h2 className="font-mono text-[11px] tracking-[0.26em] uppercase text-gold-text">
                What happens on the call
              </h2>
              <span className={mono}>30 minutes</span>
            </div>
            <ol>
              {callAgenda.map((row) => (
                <AgendaRow key={row.title} {...row} />
              ))}
            </ol>
          </div>
        </div>
      </section>

      <FitLists
        goodFit={diagnosticFit.goodFit}
        notFit={diagnosticFit.notFit}
        surface="card"
      />

      {/* ── Write to us ── */}
      <section className={surfaces.page}>
        <div
          className={`${sectionInner} grid grid-cols-1 min-[900px]:grid-cols-2 gap-12 min-[900px]:gap-20`}
        >
          <Reveal>
            <Eyebrow className="mb-5">No call needed</Eyebrow>
            <h2 className="font-serif text-[clamp(34px,4.4vw,56px)] leading-[1.07] mb-5">
              Or write to us
            </h2>
            <p className="text-lg font-light leading-[30px] text-ink-sub mb-8 max-w-[560px]">
              A few sentences is enough. We read every note and reply within one
              business day.
            </p>
            <div
              data-testid="mailto-preview"
              className="border border-line bg-card p-5 mb-8 max-w-[560px] flex flex-col gap-2"
            >
              <p className={mono}>To: {email}</p>
              <p className={mono}>Subject: {mailtoSubject}</p>
              {mailtoPrompts.map((prompt) => (
                <p key={prompt} className="text-base text-ink-sub pt-2">
                  {prompt}
                </p>
              ))}
            </div>
            <CtaLink href={mailto} variant="outline" arrow>
              Email us
            </CtaLink>
          </Reveal>
          <Reveal delay={100}>
            <p className={`${mono} mb-4`}>Reach us directly</p>
            <p className="font-serif text-[clamp(40px,5vw,64px)] leading-none text-ink-em">
              <a
                href={`tel:${phoneFormatted.replace(/[^+\d]/g, '')}`}
                className="hover:text-gold-text transition-colors"
              >
                {phone}
              </a>
            </p>
            <p className="mt-4 text-lg text-ink-sub">
              <a
                href={`mailto:${email}`}
                className="hover:text-gold-text transition-colors"
              >
                {email}
              </a>{' '}
              · {hours}
            </p>
            <p className="mt-3 text-base text-ink-muted">
              In-person available across TN, LA, GA, FL.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── What happens next ── */}
      <section className={surfaces.card}>
        <div className={sectionInner}>
          <Reveal>
            <Eyebrow className="mb-10">What happens next</Eyebrow>
          </Reveal>
          <ol className="grid grid-cols-1 min-[900px]:grid-cols-3 gap-8 min-[900px]:gap-10">
            {inquiryNextSteps.map((text, i) => (
              <li key={text}>
                <Reveal delay={i * 100}>
                  <div className="border-t border-line pt-5">
                    <span className="font-serif italic text-[28px] text-gold-text">
                      {['i.', 'ii.', 'iii.'][i]}
                    </span>
                    <p className="mt-3 text-lg font-light leading-[30px] text-ink-sub">
                      {text}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Proof ── */}
      {showProof && testimonial && (
        <section data-testid="inquire-proof" className={surfaces.tint}>
          <div
            className={`${sectionInner} flex flex-col items-center gap-6 text-center`}
          >
            <Reveal>
              <figure>
                <blockquote className="font-serif italic text-[clamp(28px,3.6vw,48px)] leading-[1.2] text-ink-em text-balance">
                  &ldquo;{inquiryProofQuote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 font-mono text-[11px] tracking-[0.26em] uppercase leading-[1.5] text-gold-text">
                  {testimonial.attribution.name} ·{' '}
                  {testimonial.attribution.role},{' '}
                  {testimonial.attribution.company}
                </figcaption>
              </figure>
            </Reveal>
            <Reveal delay={150}>
              <Link
                to="/clients/$slug"
                params={{ slug: PROOF_SLUG }}
                className="text-lg font-medium text-gold-text hover:underline underline-offset-4"
              >
                Read the Cambridge case study &rarr;
              </Link>
            </Reveal>
          </div>
        </section>
      )}
    </div>
  )
}
