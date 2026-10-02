import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderToString } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { BookingWidget, groupByDay } from '../BookingWidget'
import { siteConfig } from '@/site.config'

const { api, page } = siteConfig.contact.booking
const base = `${api}/brandon-harris`
const ZONE = 'America/Chicago'

const settings = {
  name: 'Brandon Harris',
  title: 'Book a call with Brandon',
  intro: 'Pick a time that works for you. The call happens in your browser.',
  lengths: [30, 60],
  timeZone: ZONE,
}
// 14:00Z is 9:00 AM in Chicago (CDT) on Oct 5 and 6 2026. 03:30Z on Oct 6 is
// 10:30 PM on Oct 5 there, so it must group under the 5th, not the 6th.
const slots30 = [
  '2026-10-05T14:00:00.000Z',
  '2026-10-05T14:30:00.000Z',
  '2026-10-06T03:30:00.000Z',
  '2026-10-06T14:00:00.000Z',
]
const slots60 = ['2026-10-07T15:00:00.000Z']
const booked = {
  start: '2026-10-05T14:00:00.000Z',
  minutes: 30,
  link: 'https://meet.relentnet.com/abc',
  manageUrl: 'https://hq.relentnet.com/book/manage/tok',
}

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status })
const apiError = (status: number, code: string, message: string) =>
  json(status, { error: { code, message } })

type Handler = (url: string, init?: RequestInit) => Response | Promise<Response>

/** Routes the three API calls; `post` and `get` can be overridden per test. */
function mockApi(
  over: { get?: Handler; post?: Handler; slots?: Handler } = {},
) {
  const fn = vi.fn((url: string, init?: RequestInit) => {
    if (init?.method === 'POST') {
      return Promise.resolve(over.post?.(url, init) ?? json(201, booked))
    }
    if (url.includes('/slots')) {
      return Promise.resolve(
        over.slots?.(url, init) ??
          json(200, { slots: url.endsWith('length=60') ? slots60 : slots30 }),
      )
    }
    return Promise.resolve(over.get?.(url, init) ?? json(200, settings))
  })
  vi.stubGlobal('fetch', fn)
  return fn
}

const calls = (fn: ReturnType<typeof mockApi>, match: string) =>
  fn.mock.calls.filter(([url]) => url.includes(match))

const fallback = <p>CONTACT-FALLBACK</p>

function renderWidget() {
  return render(<BookingWidget fallback={fallback} timeZone={ZONE} />)
}

async function pickFirstTime(user: ReturnType<typeof userEvent.setup>) {
  await user.click(await screen.findByRole('button', { name: '9:00 AM' }))
}

async function fillAndSubmit(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Name'), 'Ann Lee')
  await user.type(screen.getByLabelText('Email'), 'ann@acme.com')
  await user.type(screen.getByLabelText(/about/i), 'Pricing')
  await user.click(screen.getByRole('button', { name: 'Book this time' }))
}

const realFetch = globalThis.fetch

beforeEach(() => {
  siteConfig.contact.booking.handle = 'brandon-harris'
})
afterEach(() => {
  // Put back only fetch: unstubAllGlobals would also drop the setup file's
  // IntersectionObserver and matchMedia stubs.
  vi.stubGlobal('fetch', realFetch)
  vi.useRealTimers()
})

describe('groupByDay', () => {
  it('groups by the calendar day in the given zone, not UTC', () => {
    const days = groupByDay(slots30, ZONE)
    expect(days.map((d) => d.key)).toEqual(['2026-10-05', '2026-10-06'])
    expect(days[0].times).toEqual([slots30[0], slots30[1], slots30[2]])
    expect(groupByDay(slots30, 'UTC').map((d) => d.key)).toEqual([
      '2026-10-05',
      '2026-10-06',
    ])
    expect(groupByDay(slots30, 'UTC')[0].times).toHaveLength(2)
  })
})

describe('BookingWidget', () => {
  it('renders title, intro, length toggle and times in the given zone', async () => {
    mockApi()
    renderWidget()
    expect(
      await screen.findByRole('heading', { name: settings.title }),
    ).toBeInTheDocument()
    expect(screen.getByText(settings.intro)).toBeInTheDocument()
    const lengths = screen.getAllByRole('button', { name: /min$/ })
    expect(lengths.map((b) => b.textContent)).toEqual(['30 min', '60 min'])
    expect(lengths[0]).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText(`Times shown in ${ZONE}`)).toBeInTheDocument()
    // Day strip: only days with slots; the 10:30 PM slot sits on the 5th.
    expect(screen.getByRole('button', { name: /Oct 5/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Oct 6/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Oct 7/ })).toBeNull()
    const times = within(screen.getByRole('group', { name: /Times on/ }))
    expect(times.getAllByRole('button').map((b) => b.textContent)).toEqual([
      '9:00 AM',
      '9:30 AM',
      '10:30 PM',
    ])
  })

  it('prerenders the booking-page link, phone and email, never an empty box', () => {
    // Server render and no-JS markup: effects never run, so no fetch either.
    const fn = mockApi()
    const html = renderToString(<BookingWidget fallback={fallback} />)
    expect(html).toContain('Pick a time on our booking page')
    expect(html).toContain(`href="${page}"`)
    expect(html).toContain(siteConfig.contact.phone)
    expect(html).toContain(`mailto:${siteConfig.contact.email}`)
    expect(fn).not.toHaveBeenCalled()
  })

  it('makes one slots request per length, however many days are picked', async () => {
    const fn = mockApi()
    const user = userEvent.setup()
    renderWidget()
    await screen.findByRole('button', { name: /Oct 5/ })
    await user.click(screen.getByRole('button', { name: /Oct 6/ }))
    await user.click(screen.getByRole('button', { name: /Oct 5/ }))
    expect(calls(fn, '/slots')).toHaveLength(1)
    expect(calls(fn, 'length=30')).toHaveLength(1)

    await user.click(screen.getByRole('button', { name: '60 min' }))
    await screen.findByRole('button', { name: /Oct 7/ })
    expect(calls(fn, '/slots')).toHaveLength(2)

    await user.click(screen.getByRole('button', { name: '30 min' }))
    await screen.findByRole('button', { name: /Oct 5/ })
    expect(calls(fn, '/slots')).toHaveLength(2)
  })

  it('posts the booking with the honeypot and zone, then confirms', async () => {
    const fn = mockApi()
    const user = userEvent.setup()
    renderWidget()
    await pickFirstTime(user)

    const form = screen.getByRole('heading', { name: 'Your details' })
    await waitFor(() => expect(form).toHaveFocus())

    const honeypot = document.querySelector<HTMLInputElement>(
      'input[name="website"]',
    )
    expect(honeypot).not.toBeNull()
    expect(honeypot).toHaveAttribute('tabindex', '-1')
    expect(honeypot).toHaveAttribute('autocomplete', 'off')
    expect(honeypot?.closest('[aria-hidden="true"]')).not.toBeNull()
    expect(honeypot?.closest('div')?.className).toContain('-left-')
    expect(screen.getByLabelText('Name')).toHaveAttribute('maxlength', '80')
    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email')
    expect(screen.getByLabelText(/about/i)).toHaveAttribute('maxlength', '1000')

    await user.type(honeypot as HTMLInputElement, 'bot')
    await fillAndSubmit(user)

    const [url, init] = calls(fn, base).find(([, i]) => i?.method === 'POST')!
    expect(url).toBe(base)
    expect(init?.headers).toEqual({ 'Content-Type': 'application/json' })
    expect(JSON.parse(String(init?.body))).toEqual({
      start: '2026-10-05T14:00:00.000Z',
      length: 30,
      name: 'Ann Lee',
      email: 'ann@acme.com',
      about: 'Pricing',
      timeZone: ZONE,
      website: 'bot',
    })

    const heading = await screen.findByRole('heading', { name: /booked/i })
    await waitFor(() => expect(heading).toHaveFocus())
    const conf = within(screen.getByTestId('booking-confirmation'))
    expect(conf.getByText(/Monday, October 5 at 9:00 AM CDT/)).toBeVisible()
    expect(conf.getByText('30 minutes')).toBeInTheDocument()
    expect(conf.getByText(/invite is on its way to ann@acme.com/)).toBeVisible()
    expect(conf.getByRole('link', { name: 'Join the call' })).toHaveAttribute(
      'href',
      booked.link,
    )
    expect(
      conf.getByRole('link', { name: 'Change or cancel' }),
    ).toHaveAttribute('href', booked.manageUrl)
  })

  it('disables the submit button while posting, so it cannot double submit', async () => {
    let release: (r: Response) => void = () => {}
    const fn = mockApi({
      post: () => new Promise<Response>((r) => (release = r)) as never,
    })
    const user = userEvent.setup()
    renderWidget()
    await pickFirstTime(user)
    await fillAndSubmit(user)
    const button = screen.getByRole('button', { name: 'Booking…' })
    expect(button).toBeDisabled()
    await user.click(button)
    expect(
      calls(fn, base).filter(([, i]) => i?.method === 'POST'),
    ).toHaveLength(1)
    release(json(201, booked))
    await screen.findByTestId('booking-confirmation')
  })

  it('409 taken shows the message, refetches that length and returns to the picker', async () => {
    const fn = mockApi({
      post: () =>
        apiError(409, 'taken', 'That time was just taken. Pick another.'),
    })
    const user = userEvent.setup()
    renderWidget()
    await pickFirstTime(user)
    await fillAndSubmit(user)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'That time was just taken. Pick another.',
    )
    expect(screen.queryByRole('heading', { name: 'Your details' })).toBeNull()
    expect(screen.getByRole('button', { name: '9:30 AM' })).toBeInTheDocument()
    await waitFor(() => expect(calls(fn, 'length=30')).toHaveLength(2))
  })

  it('400 shows the message next to the form and keeps it open', async () => {
    mockApi({
      post: () => apiError(400, 'bad_email', 'That email looks wrong.'),
    })
    const user = userEvent.setup()
    renderWidget()
    await pickFirstTime(user)
    await fillAndSubmit(user)
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'That email looks wrong.',
    )
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
  })

  it('429 shows the message', async () => {
    mockApi({
      post: () =>
        apiError(429, 'rate_limited', 'Too many tries. Wait an hour.'),
    })
    const user = userEvent.setup()
    renderWidget()
    await pickFirstTime(user)
    await fillAndSubmit(user)
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Too many tries. Wait an hour.',
    )
  })

  it('503 shows the message and the email link', async () => {
    mockApi({
      post: () => apiError(503, 'unavailable', 'Calls are not available now.'),
    })
    const user = userEvent.setup()
    renderWidget()
    await pickFirstTime(user)
    await fillAndSubmit(user)
    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('Calls are not available now.')
    expect(
      within(alert).getByRole('link', { name: /inquiries@relentnet.com/ }),
    ).toHaveAttribute('href', 'mailto:inquiries@relentnet.com')
  })

  it('404 hides the booking UI and shows the contact fallback', async () => {
    mockApi({ get: () => apiError(404, 'not_found', 'Not found.') })
    renderWidget()
    expect(await screen.findByText('CONTACT-FALLBACK')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: settings.title })).toBeNull()
  })

  it('a network failure shows the hq booking page and email links', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')))
    renderWidget()
    const failed = await screen.findByTestId('booking-failed')
    expect(
      within(failed).getByRole('link', { name: /booking page/i }),
    ).toHaveAttribute('href', page)
    expect(
      within(failed).getByRole('link', { name: /inquiries@relentnet.com/ }),
    ).toHaveAttribute('href', 'mailto:inquiries@relentnet.com')
  })

  it('an unreadable response is treated as a failure too', async () => {
    mockApi({ get: () => new Response('<html>', { status: 200 }) })
    renderWidget()
    expect(await screen.findByTestId('booking-failed')).toBeInTheDocument()
  })

  it('stops spinning after 8 seconds and offers the hq link', async () => {
    vi.useFakeTimers()
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise(() => {})),
    )
    renderWidget()
    expect(screen.getByRole('status')).toBeInTheDocument()
    await act(async () => {
      await vi.advanceTimersByTimeAsync(8100)
    })
    const failed = screen.getByTestId('booking-failed')
    expect(
      within(failed).getByRole('link', { name: /booking page/i }),
    ).toHaveAttribute('href', page)
    expect(screen.queryByRole('status')).toBeNull()
  })
})
