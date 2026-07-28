import { serve } from '@hono/node-server'

import { app } from './app.ts'

const port = Number(process.env.PORT ?? 8787)

serve({ fetch: app.fetch, port, hostname: '0.0.0.0' }, (info) => {
  console.log(`[proposals] listening on :${info.port}`)
})
