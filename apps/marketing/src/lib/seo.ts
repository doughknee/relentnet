import { siteConfig } from '@/site.config'

export interface SeoInput {
  /** Page title. Shown in the tab and as og:title / twitter:title. Defaults to the site title. */
  title?: string
  /** Meta description, reused for og:description / twitter:description. Defaults to the site description. */
  description?: string
  /**
   * Absolute path beginning with '/', e.g. '/clients/scrollr'. When provided,
   * a canonical link and og:url are emitted for it. Omit on the root route so
   * that only the matched leaf route emits a canonical (avoids duplicates).
   */
  path?: string
  /**
   * OG/Twitter image. Either an absolute URL or a path from /public
   * (e.g. '/case-studies/scrollr/hero.webp'). Defaults to the site OG image.
   */
  image?: string
  /** Keep the page out of search indexes (e.g. the client portal). */
  noindex?: boolean
}

type MetaTag = { title: string } | { name: string; content: string } | {
  property: string
  content: string
}

export interface SeoHead {
  meta: Array<MetaTag>
  links: Array<{ rel: string; href: string }>
}

/**
 * Builds a complete, per-route head() payload: title, description, canonical
 * link, and Open Graph + Twitter card tags. Centralizing this keeps every
 * route's social/search metadata consistent and overrides the site defaults
 * declared on the root route.
 */
export function seo(input: SeoInput): SeoHead {
  const {
    title = siteConfig.meta.title,
    description = siteConfig.meta.description,
    path,
    image = siteConfig.meta.ogImage,
    noindex,
  } = input

  const url = `${siteConfig.domain}${path ?? ''}`
  const imageUrl = image.startsWith('http')
    ? image
    : `${siteConfig.domain}${image}`

  const meta: Array<MetaTag> = [
    { title },
    { name: 'description', content: description },
    // Open Graph
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:image', content: imageUrl },
    { property: 'og:url', content: url },
    { property: 'og:type', content: 'website' },
    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: imageUrl },
  ]

  if (noindex) {
    meta.push({ name: 'robots', content: 'noindex, nofollow' })
  }

  // Only emit a canonical when a concrete path is given (leaf routes), so the
  // root's site-wide defaults don't produce a second, conflicting canonical.
  return {
    meta,
    links: path ? [{ rel: 'canonical', href: url }] : [],
  }
}
