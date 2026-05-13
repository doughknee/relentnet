import { Link, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export const Route = createFileRoute('/portal')({
  head: () => ({
    meta: [
      { title: 'Client Portal | RelentNet' },
      {
        name: 'description',
        content:
          'Secure access for active RelentNet clients. Prospects can start with a workflow mapping inquiry.',
      },
    ],
  }),
  component: Portal,
})

export const portalContent = {
  headline: 'Client Access',
  body: 'Secure access for active RelentNet clients with systems, support, and stewardship already in motion.',
  prospectBody:
    'If you are not a client yet, start by sharing the workflow or operational friction you want mapped.',
  prospectCta: 'Start with a workflow map',
} as const

function Portal() {
  return (
    <div className="min-h-screen overflow-hidden flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md bg-card border border-line-faint p-8 md:p-12 backdrop-blur-sm animate-fade-in-up">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl md:text-4xl mb-4">
            Client <span className="italic text-gold">Access</span>
          </h1>
          <p className="text-ink-sub text-sm font-light">
            {portalContent.body}
          </p>
        </div>

        <form
          method="post"
          action="https://clients.relentnet.com/dologin.php"
          className="space-y-6"
        >
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="text-xs uppercase tracking-widest text-ink-muted"
            >
              Email Address
            </label>
            <Input type="text" name="username" id="username" size={50} />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-xs uppercase tracking-widest text-ink-muted"
            >
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

          <div className="pt-4">
            <Button type="submit" fullWidth>
              Login
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <a
            href="https://clients.relentnet.com/pwreset.php"
            className="text-xs text-ink-muted hover:text-gold transition-colors uppercase tracking-widest"
          >
            Forgot Password?
          </a>
        </div>

        <div className="mt-8 border-t border-line-faint pt-6 text-center">
          <p className="text-xs leading-relaxed text-ink-muted">
            {portalContent.prospectBody}
          </p>
          <Link
            to="/inquire"
            className="mt-4 inline-flex text-xs uppercase tracking-widest text-gold hover:underline"
          >
            {portalContent.prospectCta}
          </Link>
        </div>
      </div>
    </div>
  )
}
