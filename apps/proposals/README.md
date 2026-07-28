# @relentnet/proposals · Proposal Studio

Proposal delivery at **ap.relentnet.com**. Upload a Stripe quote PDF, personalize a branded page, and send the client a unique unlisted link where they accept or decline with feedback. The internal generator (`/`) and dashboard (`/dashboard`) sit behind Basic auth. Proposal pages (`/p/<slug>-<token>`) are public but unguessable and noindex.

## Architecture

- **SPA**: Vite 7 + React 19 + TanStack Router/Form + Tailwind 4. Dark only, reusing the marketing design tokens.
- **Server** (`server/`): Hono on Node 24, which runs the TypeScript sources natively with no build step. One container serves the API, uploaded PDFs, and the built SPA.
- **Storage**: a JSON file plus uploaded PDFs under `DATA_DIR` (`/data` volume in compose, `.data/` locally). Swap for SQLite if volume ever demands it.
- **Quote parsing**: text-layer extraction from the Stripe quote PDF (`server/stripeQuotePdf.ts`), verified against a real quote in `design_handoff_proposal_studio/assets/`. Every parsed field stays editable in the generator, so a parse miss costs a keystroke, not correctness.

## Commands

```sh
npm run dev -w @relentnet/proposals    # API server :8787 + Vite :3001 (proxied)
npm run build -w @relentnet/proposals  # vite build + tsc
npm run test -w @relentnet/proposals   # vitest (parser + API lifecycle)
npm run start -w @relentnet/proposals  # serve built SPA + API (production mode)
```

## Environment

| Variable             | Default                    | Purpose                                          |
| -------------------- | -------------------------- | ------------------------------------------------ |
| `ADMIN_USER`         | `daniel`                   | Basic-auth username for the internal studio      |
| `ADMIN_PASSWORD`     | (none; `dev` outside prod) | Basic-auth password; unset in prod → studio 503s |
| `NOTIFY_WEBHOOK_URL` | (none; log only)           | POSTed JSON on viewed / accepted / declined      |
| `PUBLIC_ORIGIN`      | `https://ap.relentnet.com` | Origin used in generated links and notifications |
| `DATA_DIR`           | `.data`                    | Proposals JSON + uploaded PDFs                   |
| `PORT`               | `8787` (`80` in Docker)    | Server port                                      |

## Deploying on Coolify (one-time setup)

The marketing site and Proposal Studio deploy together from the same compose file, so this is a one-time setup on the Coolify resource you already have for relentnet.com. Marketing is not affected by any of it.

1. **Merge to main.** Coolify builds from the repo, so the code has to land first.
2. **Tell Coolify about the new service.** Open the relentnet compose resource and click "Reload Compose File" (or just Redeploy). A second service named `proposals` appears next to `marketing`.
3. **Set the studio password.** In the resource's Environment Variables, add `PROPOSALS_ADMIN_PASSWORD`. This is what you type when the browser asks you to sign in; the username is `daniel` unless you also set `PROPOSALS_ADMIN_USER`. Optionally add `PROPOSALS_NOTIFY_WEBHOOK_URL` (an n8n webhook) to get pinged when a client views, accepts, or declines. Skip it if you don't have one yet; events still show in the container logs.
4. **Point the domain.** On the `proposals` service, set the domain to `https://ap.relentnet.com`.
5. **Add the DNS record.** At your DNS provider, add an A record for `ap` pointing at the same server IP as relentnet.com. Coolify issues the TLS certificate itself once DNS resolves.
6. **Deploy, then check three URLs.**
   - `https://ap.relentnet.com/healthz` says `ok`
   - `https://ap.relentnet.com/` asks for your username and password, then shows the generator
   - A made-up link like `https://ap.relentnet.com/p/test` shows the branded "page not found"

The order is forgiving. If you deploy before setting the password, marketing and the public proposal pages work fine, and the internal studio returns 503 until the password exists. You can't lock yourself out or take marketing down by doing these steps in the wrong order.

### Your data survives redeploys

Proposals and uploaded PDFs live on a named Docker volume (`proposals-data`, mounted at `/data`). A redeploy replaces the container but reattaches the same volume, so shipping updates never loses data. The volume only goes away if you delete it on purpose (for example, deleting the whole Coolify resource along with its volumes). It is still a single copy on one server: if signed proposals become business-critical, take an occasional backup of `/data`.

## Status lifecycle

`sent` → `viewed` (first page load) → `accepted` | `declined` (feedback required). Decisions are immutable; revisits show the settled state. Each transition notifies the webhook.
