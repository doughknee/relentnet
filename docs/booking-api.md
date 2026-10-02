# Booking API

The public API behind `hq.relentnet.com/book/<handle>`, for a site that wants its own booking UI
(REL-515, REL-527). hq's booking page uses the same endpoints, so anything it can do, your page can.

- **Base URL:** `https://hq.relentnet.com/api/book`
- **Handle:** the link name set in My settings → Book a call (Brandon's is `brandon-harris`).
- **Auth:** none. No cookies, no keys.
- **Who may call it from a browser:** only the origins listed in `BOOK_API_ORIGINS` on the server
  (rai: `https://relentnet.com https://www.relentnet.com`). Add a staging or local origin there
  before testing from it; `http://localhost` is not accepted, use an https tunnel or test in prod.
- **Call it from the visitor's browser, not from your server.** Rate limits count per visitor
  address. A server-side proxy makes every visitor share one quota.
- **Times** are ISO 8601 instants in UTC (`2026-10-05T14:00:00.000Z`). Show them in the visitor's
  zone with `Intl.DateTimeFormat`; send the visitor's IANA zone (`Intl.DateTimeFormat().resolvedOptions().timeZone`)
  where asked so their emails read in their time.
- **Errors** always look like `{ "error": { "code": "taken", "message": "That time was just taken. Pick another." } }`.
  The `message` is written for the visitor and safe to show as is.

| Status | Code                                               | When                                                     | What your page does                   |
| ------ | -------------------------------------------------- | -------------------------------------------------------- | ------------------------------------- |
| 400    | `bad_request`, `bad_name`, `bad_email`, `too_long` | A field is missing or wrong                              | Show the message next to the form     |
| 404    | `not_found`                                        | Unknown handle, page switched off, unknown token         | Hide booking, show the message        |
| 409    | `taken`                                            | Someone booked that time first                           | Show the message, reload slots        |
| 409    | `cancelled`, `started`                             | Managing a call that is cancelled or under way           | Show the message                      |
| 429    | `rate_limited`                                     | Too many requests from this visitor this hour            | Show the message                      |
| 503    | `unavailable`                                      | hq could not check the calendar, or calls are not set up | Show the message, offer email instead |

Limits: reads (page, slots, manage) 120 an hour per visitor address, writes (book, cancel, move)
10 an hour. Counters reset when hq restarts.

## GET `/:handle`

The page's settings.

```json
{
  "name": "Brandon Harris",
  "title": "Book a call with Brandon",
  "intro": "Pick a time that works for you. The call happens in your browser.",
  "lengths": [30, 60],
  "timeZone": "America/Chicago"
}
```

`lengths` are the call lengths in minutes, in the order to offer them. `timeZone` is the owner's.

## GET `/:handle/slots?from=&to=&length=`

Free start times for one call length.

- `length` (minutes): one of `lengths`. Defaults to the first.
- `from`, `to`: ISO instants. Default now to 21 days ahead; anything past 21 days or before now is
  clipped. At most 31 days per request.

```json
{ "slots": ["2026-10-05T14:00:00.000Z", "2026-10-05T14:15:00.000Z"] }
```

Slots start every 15 minutes, already net of the owner's calendar, hours, buffer, notice and daily
maximum. Nothing else from the calendar is ever returned. Group by day in the visitor's zone
yourself. A day with no slots simply has no entries.

## POST `/:handle`

Book a slot. `Content-Type: application/json`.

```json
{
  "start": "2026-10-05T14:00:00.000Z",
  "length": 30,
  "name": "Ann Lee",
  "email": "ann@acme.com",
  "about": "Pricing for the Q4 rollout",
  "timeZone": "Europe/London",
  "website": ""
}
```

- `name`: required, up to 80 characters.
- `email`: required; the invite goes here.
- `about`: optional, up to 1000 characters; the owner sees it with the meeting.
- `website`: a honeypot. Render it as a hidden text field and send whatever it holds; a person
  leaves it empty, a bot fills it in and gets a 400.

201:

```json
{
  "start": "2026-10-05T14:00:00.000Z",
  "minutes": 30,
  "link": "https://meet.relentnet.com/2zjdgxsp76",
  "manageUrl": "https://hq.relentnet.com/book/manage/<token>"
}
```

hq re-checks the time inside the booking, so a 409 `taken` is the only race you need to handle.
On success hq creates the meeting, puts it in the owner's calendar, and emails the visitor the
invite (with a calendar file, the call link and the manage link) and the owner a notice. Your page
only shows the confirmation.

## Managing a booking

The token is the last part of `manageUrl`. The invite email links to hq's own manage page; these
endpoints let you build your own.

- **GET `/manage/:token`**

  ```json
  {
    "status": "booked",
    "start": "2026-10-05T14:00:00.000Z",
    "minutes": 30,
    "ownerName": "Brandon Harris",
    "name": "Ann Lee",
    "link": "https://meet.relentnet.com/2zjdgxsp76",
    "handle": "brandon-harris"
  }
  ```

  `status` is `booked` or `cancelled`. `link` is null once cancelled. `handle` is null when the
  call can no longer be moved (cancelled, started, or the page is off): use it to fetch slots for
  a new time.

- **POST `/manage/:token/reschedule`** `{ "start": "...", "timeZone": "Europe/London" }`: the same
  length at a new time from the slots. 200 `{ "start", "minutes", "link" }`. Both sides get an
  updated invite.

- **POST `/manage/:token/cancel`** `{ "timeZone": "Europe/London" }`: 200 `{ "status": "cancelled" }`.
  Both sides get a cancellation.

## Example

```js
const API = 'https://hq.relentnet.com/api/book/brandon-harris'
const zone = Intl.DateTimeFormat().resolvedOptions().timeZone

const page = await (await fetch(API)).json()
const { slots } = await (
  await fetch(`${API}/slots?length=${page.lengths[0]}`)
).json()

const res = await fetch(API, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    start: slots[0],
    length: page.lengths[0],
    name,
    email,
    about,
    timeZone: zone,
    website: '',
  }),
})
const data = await res.json()
if (!res.ok) showError(data.error.message)
else showBooked(data)
```
