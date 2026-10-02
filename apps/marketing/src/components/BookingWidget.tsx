import { useEffect, useId, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'

import { siteConfig } from '@/site.config'

/** The hq booking API, docs/booking-api.md. */
interface PageSettings {
  title: string
  intro: string
  lengths: Array<number>
}

interface Confirmation {
  start: string
  minutes: number
  link: string
  manageUrl: string
}

interface ApiError {
  code: string
  message: string
}

/** A message for the visitor, with the ways out that fit it. */
interface Notice {
  message: string
  /** Offer hq's own booking page. */
  page?: boolean
  /** Offer the email address. */
  email?: boolean
}

type Phase = 'idle' | 'loading' | 'ready' | 'notfound' | 'failed'
type Step = 'pick' | 'form' | 'done'

const READ_TIMEOUT_MS = 8000
const WRITE_TIMEOUT_MS = 20000

const locale = 'en-US'

const linkClass = 'hover:text-gold-text transition-colors'
const textLink = 'font-medium text-gold-text hover:underline underline-offset-4'
const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold'
const mono = 'font-mono text-[11px] tracking-[0.26em] uppercase text-ink-muted'
const inputClass = `block w-full border border-line bg-inset px-3.5 py-3 text-base text-ink placeholder:text-ink-faint ${focusRing}`

const phoneHref = () =>
  `tel:${siteConfig.contact.phoneFormatted.replace(/[^+\d]/g, '')}`

const visitorZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone

/** Fetch with a deadline: a request that never answers must not leave a
 *  spinner up forever. */
async function request(
  doFetch: typeof fetch,
  url: string,
  init: RequestInit | undefined,
  ms: number,
) {
  const controller = new AbortController()
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      controller.abort()
      reject(new Error('timeout'))
    }, ms)
  })
  try {
    return await Promise.race([
      doFetch(url, { ...init, signal: controller.signal }),
      timeout,
    ])
  } finally {
    clearTimeout(timer)
  }
}

async function readError(res: Response): Promise<ApiError | null> {
  try {
    const body = (await res.json()) as { error?: Partial<ApiError> }
    const { code, message } = body.error ?? {}
    return typeof message === 'string' ? { code: code ?? '', message } : null
  } catch {
    return null
  }
}

function isSettings(v: unknown): v is PageSettings {
  const s = v as Partial<PageSettings> | null
  return (
    !!s &&
    typeof s.title === 'string' &&
    typeof s.intro === 'string' &&
    Array.isArray(s.lengths) &&
    s.lengths.length > 0 &&
    s.lengths.every((n) => typeof n === 'number')
  )
}

function isConfirmation(v: unknown): v is Confirmation {
  const c = v as Partial<Confirmation> | null
  return (
    !!c &&
    typeof c.start === 'string' &&
    typeof c.minutes === 'number' &&
    typeof c.link === 'string' &&
    typeof c.manageUrl === 'string'
  )
}

/** In dev only, `?bookingMock=...` swaps the network for fixtures, because
 *  the live API refuses localhost. `import.meta.env.DEV` is a build-time
 *  constant, so production builds drop the whole branch and the fixtures. */
async function pickFetch(): Promise<typeof fetch> {
  if (import.meta.env.DEV) {
    const flag = new URLSearchParams(window.location.search).get('bookingMock')
    if (flag) return (await import('@/lib/bookingMock')).createMockFetch(flag)
  }
  return (...args) => fetch(...args)
}

function dayKey(iso: string, zone: string) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: zone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(iso))
}

/** Slots grouped by calendar day in `zone`, days in time order. */
export function groupByDay(slots: ReadonlyArray<string>, zone: string) {
  const days = new Map<string, Array<string>>()
  for (const iso of slots) {
    const key = dayKey(iso, zone)
    days.set(key, [...(days.get(key) ?? []), iso])
  }
  return [...days].map(([key, times]) => ({ key, times }))
}

const weekday = (iso: string, zone: string) =>
  new Intl.DateTimeFormat(locale, { timeZone: zone, weekday: 'short' }).format(
    new Date(iso),
  )
const dayNumber = (iso: string, zone: string) =>
  new Intl.DateTimeFormat(locale, {
    timeZone: zone,
    month: 'short',
    day: 'numeric',
  }).format(new Date(iso))
const clock = (iso: string, zone: string) =>
  new Intl.DateTimeFormat(locale, {
    timeZone: zone,
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(iso))
const longWhen = (iso: string, zone: string) =>
  new Intl.DateTimeFormat(locale, {
    timeZone: zone,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(new Date(iso))

function Spinner({ label }: { label: string }) {
  return (
    <p
      role="status"
      className="flex items-center gap-3 py-8 text-base text-ink-sub"
    >
      <span
        aria-hidden="true"
        className="size-4 rounded-full border-2 border-line border-t-gold motion-safe:animate-spin"
      />
      {label}
    </p>
  )
}

function Contact() {
  const { phone, email } = siteConfig.contact
  return (
    <>
      <a href={phoneHref()} className={linkClass}>
        {phone}
      </a>{' '}
      ·{' '}
      <a href={`mailto:${email}`} className={linkClass}>
        {email}
      </a>
    </>
  )
}

/** What shows before the script runs, and for no-JS: a way to book on hq's
 *  own page, and the phone and email. Never an empty box. */
function StaticFallback() {
  return (
    <div data-testid="booking-static">
      <h2 className="font-serif text-[28px] leading-tight">Book a call</h2>
      <p className="mt-4 text-base">
        <a href={siteConfig.contact.booking.page} className={textLink}>
          Pick a time on our booking page &rarr;
        </a>
      </p>
      <p className="mt-3 text-base text-ink-muted">
        Or reach us directly: <Contact />
      </p>
    </div>
  )
}

function NoticeLine({ notice }: { notice: Notice }) {
  const { booking, email } = siteConfig.contact
  return (
    <p role="alert" className="mt-4 border border-line bg-card p-3.5 text-base">
      <span className="text-ink">{notice.message}</span>
      {(notice.page || notice.email) && (
        <>
          {' '}
          {notice.page && (
            <a href={booking.page} className={textLink}>
              Book on our booking page
            </a>
          )}
          {notice.page && notice.email && ' or '}
          {notice.email && (
            <a href={`mailto:${email}`} className={textLink}>
              email {email}
            </a>
          )}
          .
        </>
      )}
    </p>
  )
}

interface BookingWidgetProps {
  /** Shown instead of the booking UI when hq says the page is off (404). */
  fallback: ReactNode
  /** IANA zone to group and format times in. Defaults to the visitor's. */
  timeZone?: string
}

/**
 * Native booking on hq's API. Everything is fetched in the visitor's browser
 * after hydration; the prerendered markup is the static link-and-contact
 * fallback, which is also what a failed or stalled load shows.
 */
export function BookingWidget({ fallback, timeZone }: BookingWidgetProps) {
  const { api, handle } = siteConfig.contact.booking
  const base = `${api}/${handle}`
  const zone = timeZone ?? visitorZone()
  const uid = useId()

  const [phase, setPhase] = useState<Phase>('idle')
  const [failure, setFailure] = useState<string | undefined>()
  const [settings, setSettings] = useState<PageSettings | null>(null)
  const [length, setLength] = useState<number | null>(null)
  // One request per length, kept for the life of the component.
  const [slotsByLength, setSlotsByLength] = useState<
    Record<number, Array<string>>
  >({})
  const requested = useRef(new Set<number>())
  const fetcher = useRef<Promise<typeof fetch> | null>(null)
  const alive = useRef(true)

  const [day, setDay] = useState<string | null>(null)
  const [picked, setPicked] = useState<string | null>(null)
  const [step, setStep] = useState<Step>('pick')
  const [pickNotice, setPickNotice] = useState<Notice | null>(null)
  const [formNotice, setFormNotice] = useState<Notice | null>(null)
  const [isPosting, setIsPosting] = useState(false)
  const [booked, setBooked] = useState<Confirmation | null>(null)
  const [bookedEmail, setBookedEmail] = useState('')

  const formHeading = useRef<HTMLHeadingElement>(null)
  const doneHeading = useRef<HTMLHeadingElement>(null)

  const getFetch = () => (fetcher.current ??= pickFetch())

  const isAlive = () => alive.current

  function fail(message?: string) {
    if (!isAlive()) return
    setFailure(message)
    setPhase('failed')
  }

  /** Load one length's slots. `force` is the refetch after a 409. */
  async function loadSlots(len: number, force = false) {
    if (!force && requested.current.has(len)) return
    requested.current.add(len)
    try {
      const res = await request(
        await getFetch(),
        `${base}/slots?length=${len}`,
        undefined,
        READ_TIMEOUT_MS,
      )
      if (!alive.current) return
      if (res.status === 404) return setPhase('notfound')
      if (!res.ok) return fail((await readError(res))?.message)
      const body = (await res.json()) as { slots?: unknown }
      if (
        !Array.isArray(body.slots) ||
        !body.slots.every((s) => typeof s === 'string')
      ) {
        throw new Error('bad slots')
      }
      if (isAlive()) {
        setSlotsByLength((prev) => ({
          ...prev,
          [len]: body.slots as Array<string>,
        }))
      }
    } catch {
      requested.current.delete(len)
      fail()
    }
  }

  useEffect(() => {
    alive.current = true
    setPhase('loading')
    void (async () => {
      try {
        const res = await request(
          await getFetch(),
          base,
          undefined,
          READ_TIMEOUT_MS,
        )
        if (!alive.current) return
        if (res.status === 404) return setPhase('notfound')
        if (!res.ok) return fail((await readError(res))?.message)
        const body: unknown = await res.json()
        if (!isSettings(body)) throw new Error('bad settings')
        if (!isAlive()) return
        setSettings(body)
        setLength(body.lengths[0])
        void loadSlots(body.lengths[0])
      } catch {
        fail()
      }
    })()
    return () => {
      alive.current = false
    }
    // Runs once per mount; loadSlots and getFetch only read refs and `base`.
  }, [])

  // The spinner shows until settings and the first slots are both in.
  const firstSlots = length === null ? undefined : slotsByLength[length]
  useEffect(() => {
    if (phase === 'loading' && settings && firstSlots) setPhase('ready')
  }, [phase, settings, firstSlots])

  useEffect(() => {
    if (step === 'form') formHeading.current?.focus()
    if (step === 'done') doneHeading.current?.focus()
  }, [step])

  function chooseLength(len: number) {
    setLength(len)
    setDay(null)
    setPickNotice(null)
    void loadSlots(len)
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (isPosting || !picked || length === null) return
    const data = new FormData(e.currentTarget)
    const field = (name: string) => {
      const v = data.get(name)
      return typeof v === 'string' ? v : ''
    }
    const email = field('email').trim()
    setIsPosting(true)
    setFormNotice(null)
    try {
      const res = await request(
        await getFetch(),
        base,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            start: picked,
            length,
            name: field('name').trim(),
            email,
            about: field('about').trim(),
            timeZone: zone,
            website: field('website'),
          }),
        },
        WRITE_TIMEOUT_MS,
      )
      if (!alive.current) return
      if (res.status === 201) {
        const body: unknown = await res.json()
        if (!isConfirmation(body)) throw new Error('bad confirmation')
        setBooked(body)
        setBookedEmail(email)
        setStep('done')
        return
      }
      const err = await readError(res)
      if (res.status === 404) return setPhase('notfound')
      if (!err) throw new Error('unreadable error')
      if (res.status === 409 && err.code === 'taken') {
        setPickNotice({ message: err.message })
        setPicked(null)
        setStep('pick')
        void loadSlots(length, true)
        return
      }
      setFormNotice({ message: err.message, email: res.status === 503 })
    } catch {
      if (alive.current) {
        setFormNotice({
          message:
            'We could not reach the calendar. If no invite arrives by email, your time was not booked.',
          page: true,
          email: true,
        })
      }
    } finally {
      if (alive.current) setIsPosting(false)
    }
  }

  if (phase === 'idle') return <StaticFallback />
  if (phase === 'notfound') return <>{fallback}</>
  if (phase === 'failed') {
    return (
      <div data-testid="booking-failed">
        <h2 className="font-serif text-[28px] leading-tight">Book a call</h2>
        <NoticeLine
          notice={{
            message:
              failure ?? 'We could not load times here, so book another way.',
            page: true,
            email: true,
          }}
        />
      </div>
    )
  }
  if (phase === 'loading' || !settings || length === null) {
    return <Spinner label="Loading available times" />
  }

  const days = groupByDay(slotsByLength[length] ?? [], zone)
  const activeDay = days.find((d) => d.key === day) ?? days.at(0)

  if (step === 'done' && booked) {
    return (
      <div data-testid="booking-confirmation">
        <h2
          ref={doneHeading}
          tabIndex={-1}
          className="font-serif text-[28px] leading-tight outline-none"
        >
          You&rsquo;re booked
        </h2>
        <p className="mt-4 text-lg text-ink-em">
          {longWhen(booked.start, zone)}
        </p>
        <p className={`mt-1 ${mono}`}>{booked.minutes} minutes</p>
        <p className="mt-5 text-base text-ink-sub">
          An invite is on its way to {bookedEmail}.
        </p>
        <div className="mt-6 flex flex-col gap-3 min-[480px]:flex-row min-[480px]:items-center min-[480px]:gap-6">
          <a
            href={booked.link}
            className={`chromatic-hover inline-flex justify-center bg-gold border border-gold px-[30px] py-[17px] text-xs uppercase tracking-[0.15em] font-medium text-gold-ink hover:bg-transparent hover:text-gold-text transition-all duration-300 ${focusRing}`}
          >
            Join the call
          </a>
          <a href={booked.manageUrl} className={textLink}>
            Change or cancel
          </a>
        </div>
      </div>
    )
  }

  const pickedLabel = picked && `${longWhen(picked, zone)} · ${length} minutes`

  return (
    <div data-testid="booking-live">
      <h2 className="font-serif text-[28px] leading-tight">{settings.title}</h2>
      <p className="mt-3 text-base font-light leading-6 text-ink-sub">
        {settings.intro}
      </p>

      {step === 'form' && picked ? (
        <form onSubmit={onSubmit} className="mt-6 border-t border-line pt-6">
          <h3
            ref={formHeading}
            tabIndex={-1}
            className="text-lg font-medium text-ink-em outline-none"
          >
            Your details
          </h3>
          <p className={`mt-2 ${mono}`}>{pickedLabel}</p>
          <button
            type="button"
            onClick={() => {
              setStep('pick')
              setFormNotice(null)
            }}
            className={`mt-2 text-base text-gold-text hover:underline underline-offset-4 ${focusRing}`}
          >
            Change time
          </button>
          <div className="mt-5 flex flex-col gap-4">
            <div>
              <label
                htmlFor={`${uid}-name`}
                className="mb-1.5 block text-base text-ink-sub"
              >
                Name
              </label>
              <input
                id={`${uid}-name`}
                name="name"
                type="text"
                required
                maxLength={80}
                autoComplete="name"
                className={inputClass}
              />
            </div>
            <div>
              <label
                htmlFor={`${uid}-email`}
                className="mb-1.5 block text-base text-ink-sub"
              >
                Email
              </label>
              <input
                id={`${uid}-email`}
                name="email"
                type="email"
                required
                autoComplete="email"
                className={inputClass}
              />
            </div>
            <div>
              <label
                htmlFor={`${uid}-about`}
                className="mb-1.5 block text-base text-ink-sub"
              >
                What is the call about?{' '}
                <span className="text-ink-muted">(optional)</span>
              </label>
              <textarea
                id={`${uid}-about`}
                name="about"
                rows={4}
                maxLength={1000}
                className={inputClass}
              />
            </div>
            {/* Honeypot: people never see or fill it; bots do. */}
            <div
              aria-hidden="true"
              className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
            >
              <label htmlFor={`${uid}-website`}>Website</label>
              <input
                id={`${uid}-website`}
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                defaultValue=""
              />
            </div>
          </div>
          {formNotice && <NoticeLine notice={formNotice} />}
          <button
            type="submit"
            disabled={isPosting}
            className={`chromatic-hover mt-5 flex w-full justify-center bg-gold border border-gold px-5 py-[17px] text-xs uppercase tracking-[0.15em] font-medium text-gold-ink transition-all duration-300 hover:bg-transparent hover:text-gold-text disabled:cursor-wait disabled:opacity-60 ${focusRing}`}
          >
            {isPosting ? 'Booking…' : 'Book this time'}
          </button>
        </form>
      ) : (
        <div className="mt-6 border border-line p-4 min-[480px]:p-5">
          {settings.lengths.length > 1 && (
            <div
              role="group"
              aria-label="Call length"
              className="mb-5 flex flex-wrap gap-2"
            >
              {settings.lengths.map((len) => (
                <button
                  key={len}
                  type="button"
                  aria-pressed={len === length}
                  onClick={() => chooseLength(len)}
                  className={`px-4 py-2 font-mono text-[11px] tracking-[0.2em] uppercase border transition-colors ${focusRing} ${
                    len === length
                      ? 'bg-gold border-gold text-gold-ink'
                      : 'border-line text-ink-sub hover:border-gold'
                  }`}
                >
                  {len} min
                </button>
              ))}
            </div>
          )}

          {pickNotice && (
            <div className="mb-4">
              <NoticeLine notice={pickNotice} />
            </div>
          )}

          {!(length in slotsByLength) ? (
            <Spinner label="Loading available times" />
          ) : days.length === 0 ? (
            <p className="py-4 text-base text-ink-sub">
              No times are open in the next three weeks.{' '}
              <a href={siteConfig.contact.booking.page} className={textLink}>
                Check our booking page
              </a>{' '}
              or <Contact />.
            </p>
          ) : (
            <>
              <div
                role="group"
                aria-label="Pick a day"
                className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2"
              >
                {days.map((d) => (
                  <button
                    key={d.key}
                    type="button"
                    aria-pressed={d.key === activeDay?.key}
                    onClick={() => {
                      setDay(d.key)
                      setPickNotice(null)
                    }}
                    className={`shrink-0 min-w-[72px] border px-3 py-2.5 text-center transition-colors ${focusRing} ${
                      d.key === activeDay?.key
                        ? 'bg-gold border-gold text-gold-ink'
                        : 'border-line text-ink hover:border-gold'
                    }`}
                  >
                    <span className="block font-mono text-[10px] tracking-[0.2em] uppercase">
                      {weekday(d.times[0], zone)}
                    </span>
                    <span className="mt-0.5 block text-base">
                      {dayNumber(d.times[0], zone)}
                    </span>
                  </button>
                ))}
              </div>

              {activeDay && (
                <div
                  role="group"
                  aria-label={`Times on ${dayNumber(activeDay.times[0], zone)}`}
                  className="mt-4 grid max-h-[272px] grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-4"
                >
                  {activeDay.times.map((iso) => (
                    <button
                      key={iso}
                      type="button"
                      aria-pressed={iso === picked}
                      onClick={() => {
                        setPicked(iso)
                        setPickNotice(null)
                        setStep('form')
                      }}
                      className={`border px-2 py-3 text-base transition-colors ${focusRing} ${
                        iso === picked
                          ? 'bg-gold border-gold text-gold-ink'
                          : 'border-line text-ink hover:border-gold'
                      }`}
                    >
                      {clock(iso, zone)}
                    </button>
                  ))}
                </div>
              )}
              <p className={`mt-4 ${mono} normal-case tracking-[0.1em]`}>
                Times shown in {zone}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
