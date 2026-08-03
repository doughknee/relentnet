import { Link, createFileRoute } from '@tanstack/react-router'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/portal')({
  // The portal is a gated login surface with no public content — keep it out
  // of search indexes (and out of the sitemap).
  head: () =>
    seo({
      title: 'Client Portal | RelentNet',
      description:
        'Secure access for active RelentNet clients. Prospects should start with a workflow diagnostic before requesting a build.',
      path: '/portal',
      noindex: true,
    }),
  component: Portal,
})

export const portalContent = {
  headline: 'Client access',
  body: 'For active clients with systems, support, and stewardship in motion.',
  prospectBody:
    'Not a client yet? Start with a workflow diagnostic so we understand the friction before recommending a build.',
  prospectCta: 'Start with a workflow diagnostic',
} as const

const labelClasses = 'text-[11px] uppercase tracking-[0.15em] text-ink-muted'

function Portal() {
  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col justify-center items-center pt-25 pb-15 px-4 relative z-10">
      <div className="animate-fade-in-up w-full max-w-[440px]">
        <div className="text-center mb-9">
          <h1 className="font-serif text-[52px] mb-3.5">
            Client <span className="italic text-gold-text">access</span>
          </h1>
          <p className="text-ink-sub text-sm font-light leading-[1.6]">
            {portalContent.body}
          </p>
        </div>

        <div className="border border-line bg-card p-7 md:p-10">
          <form
            method="post"
            action="https://clients.relentnet.com/dologin.php"
            className="flex flex-col gap-[22px]"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="username" className={labelClasses}>
                Email address
              </label>
              <Input type="text" name="username" id="username" size={50} />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className={labelClasses}>
                Password
              </label>
              <Input
                type="password"
                name="password"
                id="password"
                size={20}
                autoComplete="off"
              />
            </div>

            <div className="mt-2">
              <Button type="submit" fullWidth>
                Sign in
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <a
              href="https://clients.relentnet.com/pwreset.php"
              className="text-[11px] text-ink-muted hover:text-gold-text transition-colors uppercase tracking-[0.15em]"
            >
              Forgot password?
            </a>
          </div>
        </div>

        <p className="mt-7 text-center text-[13px] text-ink-muted leading-[1.6]">
          Not a client yet?{' '}
          <Link to="/diagnostic" className="text-gold-text hover:underline">
            Start with a workflow diagnostic
          </Link>{' '}
          so we understand the friction before recommending a build.
        </p>
      </div>
    </div>
  )
}
