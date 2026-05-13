import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/Button'

export function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative z-10 text-ink">
      <h1 className="font-serif text-6xl md:text-9xl text-black/[0.04] dark:text-white/10 select-none animate-pulse">
        404
      </h1>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <h2 className="font-serif text-3xl md:text-5xl mb-4 animate-fade-in-up">
          Lost in the <span className="italic text-gold">Ether.</span>
        </h2>
        <p className="text-ink-sub font-light mb-8 max-w-md animate-fade-in-up delay-200">
          The coordinates you requested do not exist in this sector.
        </p>
        <div className="animate-fade-in-up delay-500">
          <Link to="/">
            <Button variant="outline">Return to Base</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
