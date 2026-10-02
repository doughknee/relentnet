/**
 * Dev-only stand-in for the hq booking API, which refuses localhost. Loaded
 * by `BookingWidget` only when `import.meta.env.DEV` and the page URL carries
 * `?bookingMock=ok` (any value works) or `?bookingMock=taken` (the first
 * booking attempt answers 409, then everything succeeds). Never imported in
 * production, so the bundle does not contain it.
 */

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

/** Weekday slots every 15 minutes, 14:00 to 21:45 UTC, for the next 14 days. */
function fixtureSlots() {
  const slots: Array<string> = []
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)
  for (let d = 1; d <= 14; d++) {
    const day = new Date(today.getTime() + d * 86_400_000)
    if ([0, 6].includes(day.getUTCDay()) || d % 4 === 0) continue
    for (let m = 14 * 60; m < 22 * 60; m += 15) {
      slots.push(new Date(day.getTime() + m * 60_000).toISOString())
    }
  }
  return slots
}

export function createMockFetch(flag: string): typeof fetch {
  let takenPending = flag === 'taken'
  const slots = fixtureSlots()
  return async (input, init) => {
    const url = new URL(String(input))
    await new Promise((r) => setTimeout(r, 250))
    if (init?.method === 'POST') {
      if (takenPending) {
        takenPending = false
        return json(409, {
          error: {
            code: 'taken',
            message: 'That time was just taken. Pick another.',
          },
        })
      }
      const body = JSON.parse(String(init.body)) as {
        start: string
        length: number
      }
      return json(201, {
        start: body.start,
        minutes: body.length,
        link: 'https://meet.relentnet.com/mock-call',
        manageUrl: 'https://hq.relentnet.com/book/manage/mock-token',
      })
    }
    if (url.pathname.endsWith('/slots')) {
      const length = Number(url.searchParams.get('length'))
      // The 60-minute list is a little shorter, as a longer call fits fewer starts.
      return json(200, {
        slots: length === 60 ? slots.filter((_, i) => i % 2 === 0) : slots,
      })
    }
    return json(200, {
      name: 'Brandon Harris',
      title: 'Book a call with Brandon',
      intro:
        'Pick a time that works for you. The call happens in your browser.',
      lengths: [30, 60],
      timeZone: 'America/Chicago',
    })
  }
}
