import type { ReactNode } from 'react'

/**
 * Screenshot frame: 1px line border, 10px padding, page background, with the
 * scanline overlay and drafting-style crop marks at the corners. Put the
 * image inside with `group-hover:scale-[1.03]` classes for the designed hover
 * zoom (the figure is the `group`). Optional `caption` renders a mono
 * "Fig. 01 — ..." line under the image.
 */
export function Frame({
  children,
  caption,
  className = '',
}: {
  children: ReactNode
  caption?: string
  className?: string
}) {
  return (
    <figure
      className={`group relative border border-line p-2.5 bg-page ${className}`}
    >
      {/* Drafting crop marks */}
      <span
        aria-hidden="true"
        className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t border-l border-gold-deep"
      />
      <span
        aria-hidden="true"
        className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t border-r border-gold-deep"
      />
      <span
        aria-hidden="true"
        className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b border-l border-gold-deep"
      />
      <span
        aria-hidden="true"
        className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b border-r border-gold-deep"
      />
      <div className="overflow-hidden relative">
        {children}
        <span
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none scanlines"
        />
      </div>
      {caption && (
        <figcaption className="mt-2.5 font-mono text-[10px] tracking-[0.22em] uppercase text-ink-faint">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
