/**
 * Generates public/sitemap.xml from the same data the app renders, so the
 * sitemap can never drift from the real set of routes and case studies.
 *
 * Run via `npm run sitemap` (also invoked automatically by `npm run build`).
 */
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { caseStudies } from '@/data/caseStudies'
import { legalDocs } from '@/data/legalDocs'
import { siteConfig } from '@/site.config'

interface SitemapEntry {
  path: string
  changefreq: 'weekly' | 'monthly' | 'yearly'
  priority: string
}

// Static, hand-tuned routes. /portal is intentionally omitted — it is a gated
// login surface marked noindex.
const staticEntries: Array<SitemapEntry> = [
  { path: '/', changefreq: 'monthly', priority: '1.0' },
  { path: '/diagnostic', changefreq: 'monthly', priority: '0.8' },
  { path: '/process', changefreq: 'monthly', priority: '0.8' },
  { path: '/clients', changefreq: 'weekly', priority: '0.9' },
  { path: '/inquire', changefreq: 'monthly', priority: '0.8' },
  { path: '/legal', changefreq: 'yearly', priority: '0.3' },
]

const caseStudyEntries: Array<SitemapEntry> = caseStudies.map((study) => ({
  path: `/clients/${study.slug}`,
  changefreq: 'monthly',
  priority: '0.7',
}))

const legalEntries: Array<SitemapEntry> = Object.keys(legalDocs).map((id) => ({
  path: `/legal/${id}`,
  changefreq: 'yearly',
  priority: '0.3',
}))

const entries = [...staticEntries, ...caseStudyEntries, ...legalEntries]
const lastmod = new Date().toISOString().slice(0, 10)

const body = entries
  .map(
    (entry) =>
      `  <url>\n` +
      `    <loc>${siteConfig.domain}${entry.path}</loc>\n` +
      `    <lastmod>${lastmod}</lastmod>\n` +
      `    <changefreq>${entry.changefreq}</changefreq>\n` +
      `    <priority>${entry.priority}</priority>\n` +
      `  </url>`,
  )
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`

const outPath = fileURLToPath(new URL('../public/sitemap.xml', import.meta.url))
writeFileSync(outPath, xml)

console.log(`Wrote ${entries.length} urls to ${outPath}`)
