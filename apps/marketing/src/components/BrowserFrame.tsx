import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'

interface BrowserFrameProps {
  url: string
  siteName: string
}

export function BrowserFrame({ url, siteName }: BrowserFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Responsive scaling — render iframe at 1440px desktop width, scale to fit
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setScale(entry.contentRect.width / 1440)
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Lazy-load iframe when approaching viewport
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsLoaded(true)
          io.disconnect()
        }
      },
      { rootMargin: '200px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const displayUrl = url.replace(/^https?:\/\//, '')

  return (
    <div
      ref={containerRef}
      className="group rounded-xl border border-line overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/50 transition-colors duration-500 hover:border-gold/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Browser chrome */}
      <div className="flex items-center px-5 py-3.5 bg-chrome border-b border-line-faint">
        <div className="flex gap-2 w-14">
          <div className="w-3 h-3 rounded-full bg-black/[0.04] dark:bg-white/10" />
          <div className="w-3 h-3 rounded-full bg-black/[0.04] dark:bg-white/10" />
          <div className="w-3 h-3 rounded-full bg-black/[0.04] dark:bg-white/10" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-inset rounded-md px-4 py-1.5">
            <span className="text-[11px] text-ink-muted font-mono tracking-wide">
              {displayUrl}
            </span>
          </div>
        </div>
        <div className="w-14" />
      </div>

      {/* Site viewport — 1440x810 (16:9) renders at natural desktop dimensions */}
      <div
        ref={viewportRef}
        className="relative overflow-hidden aspect-video bg-neutral-950"
      >
        {isLoaded && (
          <div
            className="absolute top-0 left-0 origin-top-left"
            style={{
              width: '1440px',
              height: '810px',
              transform: `scale(${scale})`,
            }}
          >
            <iframe
              src={url}
              title={`${siteName} — live preview`}
              width={1440}
              height={810}
              loading="lazy"
              className="pointer-events-none border-0"
            />
          </div>
        )}

        {/* Hover overlay */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-[2px] transition-opacity duration-300 focus-visible:opacity-100 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          aria-label={`Visit ${siteName} live site`}
        >
          <span className="flex items-center gap-2 border border-gold/50 px-8 py-4 text-sm tracking-widest uppercase text-gold transition-all duration-300 hover:bg-gold hover:text-black">
            Visit Live Site
            <ArrowUpRight size={16} />
          </span>
        </a>
      </div>
    </div>
  )
}
