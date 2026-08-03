import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/Button'

export function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative z-10 text-ink">
      <h1 className="font-serif text-9xl md:text-[220px] text-watermark select-none">
        404
      </h1>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="animate-fade-in-up font-mono text-[11px] tracking-[0.3em] uppercase text-gold-text font-medium mb-6">
          Page not found
        </p>
        <h2 className="font-serif text-3xl md:text-5xl mb-4 animate-fade-in-up">
          This page{' '}
          <span className="italic text-gold-text">doesn't exist.</span>
        </h2>
        <p className="text-ink-sub font-light mb-8 max-w-md animate-fade-in-up delay-200">
          The address may have moved, or it never earned its place.
        </p>
        <div className="animate-fade-in-up delay-500">
          <Link to="/">
            <Button variant="outline">Back to home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
