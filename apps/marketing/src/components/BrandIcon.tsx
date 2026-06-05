import { Box } from 'lucide-react'
import {
  siGo,
  siPostgresql,
  siReact,
  siRedis,
  siRust,
  siTailwindcss,
  siTauri,
  siVite,
} from 'simple-icons'
import type { SimpleIcon } from 'simple-icons'

interface BrandIconProps {
  /** simple-icons slug — e.g. "react", "tauri". Falls back to lucide when unknown. */
  slug?: string
  /** Accessible label. Required so screen readers always get a name. */
  label: string
  className?: string
}

/**
 * Static slug→icon map. The map is explicit (not dynamic-by-key) so the
 * bundler can tree-shake unused icons. Add new entries here when a case
 * study adds a new stack item with a brand mark.
 */
const ICON_MAP: Record<string, SimpleIcon> = {
  react: siReact,
  tauri: siTauri,
  vite: siVite,
  tailwindcss: siTailwindcss,
  go: siGo,
  rust: siRust,
  postgresql: siPostgresql,
  redis: siRedis,
}

export function BrandIcon({ slug, label, className }: BrandIconProps) {
  const icon = slug ? ICON_MAP[slug] : undefined

  if (!icon) {
    return (
      <Box
        aria-label={label}
        role="img"
        className={className ?? 'size-4 text-ink-muted'}
      />
    )
  }

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={`fill-current ${className ?? 'size-4 text-ink-sub'}`}
    >
      <path d={icon.path} />
    </svg>
  )
}
