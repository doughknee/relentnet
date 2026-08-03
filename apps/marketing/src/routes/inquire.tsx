import { createFileRoute } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Eyebrow } from '@/components/Eyebrow'
import { siteConfig } from '@/site.config'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/inquire')({
  head: () =>
    seo({
      title: 'Request a Workflow Diagnostic | RelentNet',
      description:
        'Request a RelentNet Workflow Diagnostic by sharing the operational friction, disconnected tools, and workflow context inside your business.',
      path: '/inquire',
    }),
  component: Contact,
})

const WEBHOOK_URL =
  'https://n8n.relentnet.com/webhook/fe703944-aa84-4947-a491-0046d4c0f22a'
const REQUEST_TIMEOUT_MS = 15000

/** fetch() that aborts if the request outlives `timeoutMs`. */
async function fetchWithTimeout(
  input: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(input, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

export const inquiryContent = {
  headline: 'Tell us where it feels slow.',
  body: "Manual, disconnected, hard to see. Even a few sentences is enough, and we'll read it before we reply.",
  successTitle: 'Request received.',
  successBody:
    "We'll review the workflow context and follow up with the best next step.",
} as const

export const inquiryNextSteps = [
  'We read your note and reply within one business day.',
  'A short call to confirm the diagnostic is the right first step.',
  'A free diagnostic, then a clear build / connect / don’t-build answer.',
] as const

const commOptions = [
  { label: 'Phone call', value: 'phone' },
  { label: 'Text', value: 'sms' },
  { label: 'Email', value: 'email' },
  { label: 'Video call', value: 'video' },
  { label: 'In person', value: 'person' },
] as const

const labelClasses = 'text-[11px] uppercase tracking-[0.15em] text-ink-muted'

function Contact() {
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm({
    // Field set matches the long-standing webhook payload — fields the v4
    // form no longer collects are sent with their defaults so n8n keeps
    // receiving the same shape.
    defaultValues: {
      fullName: '',
      companyName: '',
      email: '',
      currentUrl: '',
      projectNature: 'workflow_discovery' as
        | 'workflow_discovery'
        | 'custom_system'
        | 'stewardship'
        | 'not_sure',
      hasDeadline: false,
      deadlineDate: '',
      vision: '',
      communicationMethods: [] as Array<string>,
      phoneNumber: '',
      inPersonState: '',
      cityState: '',
    },
    onSubmit: async ({ value }) => {
      setError(null)
      const body = JSON.stringify(value)
      // One retry, for transient network/timeout failures only. HTTP errors
      // (the server responded) are not retried — the request reached n8n, so
      // retrying would risk a duplicate lead.
      const maxAttempts = 2

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const response = await fetchWithTimeout(
            WEBHOOK_URL,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body,
            },
            REQUEST_TIMEOUT_MS,
          )

          if (!response.ok) {
            const responseBody = await response.text()

            // N8N Workaround: If the workflow runs but lacks a response node, it returns 500 with this message.
            // We treat this as a success since the data successfully reached the webhook.
            if (
              response.status === 500 &&
              responseBody.includes('No Respond to Webhook node found')
            ) {
              setIsSuccess(true)
              return
            }

            throw new Error(
              `Failed to submit form: ${response.status} ${response.statusText}`,
            )
          }

          setIsSuccess(true)
          return
        } catch (err) {
          // AbortError = our timeout fired; TypeError = network failure. Both
          // are transient and safe to retry while attempts remain.
          const isTimeout =
            err instanceof DOMException && err.name === 'AbortError'
          const isNetwork = err instanceof TypeError
          if (attempt < maxAttempts && (isTimeout || isNetwork)) {
            continue
          }
          setError('Something went wrong. Please try again later.')
          return
        }
      }
    },
  })

  return (
    <div className="relative overflow-x-clip">
      {/* Radial gold glow over the top of the page */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-screen pointer-events-none bg-[radial-gradient(ellipse_760px_420px_at_calc(50%-350px)_60px,rgba(203,171,69,0.06),transparent_65%)]"
      />

      <div className="relative z-10 pt-[110px] pb-20 px-5 md:px-12">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 min-[1024px]:grid-cols-[5fr_7fr] gap-12 min-[1024px]:gap-20 items-start">
          {/* ── Left: context ── */}
          <div className="flex flex-col gap-11">
            <div className="animate-fade-in-up">
              <Eyebrow className="mb-7">Book a diagnostic</Eyebrow>
              <h1 className="font-serif text-[clamp(36px,6vw,72px)] leading-none mb-6 text-balance">
                Tell us where it{' '}
                <span className="italic text-gold-text">feels slow.</span>
              </h1>
              <p className="text-ink-sub font-light leading-[1.65] max-w-[400px]">
                {inquiryContent.body}
              </p>
            </div>

            <div
              className="animate-fade-in-up border-t border-line-faint pt-8"
              style={{ animationDelay: '150ms' }}
            >
              <p className="font-mono text-[10px] tracking-[0.26em] uppercase text-ink-faint mb-5">
                What happens next
              </p>
              <div className="flex flex-col">
                {inquiryNextSteps.map((text, i) => (
                  <div
                    key={i}
                    className="flex items-baseline gap-[18px] border-b border-line-faint py-3.5"
                  >
                    <span className="font-serif italic text-[15px] text-gold-text shrink-0">
                      {['i.', 'ii.', 'iii.'][i]}
                    </span>
                    <span className="text-sm font-light text-ink-sub leading-normal">
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="animate-fade-in-up"
              style={{ animationDelay: '250ms' }}
            >
              <p className="font-mono text-[10px] tracking-[0.26em] uppercase text-ink-faint mb-4">
                Prefer to talk
              </p>
              {/* From siteConfig, like the footer and the homepage. This page
                  was the last copy still typed out by hand, which is how a
                  number gets changed everywhere except one place. */}
              <p className="font-serif text-[26px] text-ink-em">
                <a
                  href={`tel:${siteConfig.contact.phoneFormatted.replace(/[^+\d]/g, '')}`}
                  className="hover:text-gold-text transition-colors"
                >
                  {siteConfig.contact.phone}
                </a>
              </p>
              <p className="mt-1.5 text-sm text-ink-sub">
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="hover:text-gold-text transition-colors"
                >
                  {siteConfig.contact.email}
                </a>{' '}
                · 9am–5pm CST, Mon–Fri
              </p>
              <p className="mt-3.5 text-xs text-ink-muted">
                In-person available across TN, LA, GA, FL.
              </p>
            </div>
          </div>

          {/* ── Right: form card ── */}
          <div
            className="animate-fade-in-up border border-line bg-card p-7 md:p-12"
            style={{ animationDelay: '300ms' }}
          >
            {isSuccess ? (
              <div className="min-h-[400px] flex flex-col justify-center items-center text-center gap-5">
                <div className="w-16 h-16 rounded-full border border-gold flex items-center justify-center text-gold-text">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-[30px] h-[30px]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </div>
                <h3 className="font-serif text-[32px]">
                  {inquiryContent.successTitle}
                </h3>
                <p className="text-ink-sub font-light leading-[1.6] max-w-[400px]">
                  {inquiryContent.successBody}
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="mt-6 text-[11px] tracking-[0.15em] uppercase text-gold-text cursor-pointer hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  form.handleSubmit()
                }}
                className="flex flex-col gap-7"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <form.Field
                    name="fullName"
                    validators={{
                      onChange: ({ value }) =>
                        !value ? 'Full name is required' : undefined,
                    }}
                    children={(field) => (
                      <div className="flex flex-col gap-2">
                        <label htmlFor={field.name} className={labelClasses}>
                          Full name *
                        </label>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Full name"
                        />
                        {field.state.meta.errors.length ? (
                          <em className="text-xs text-red-500">
                            {field.state.meta.errors.join(', ')}
                          </em>
                        ) : null}
                      </div>
                    )}
                  />
                  <form.Field
                    name="companyName"
                    validators={{
                      onChange: ({ value }) =>
                        !value ? 'Company is required' : undefined,
                    }}
                    children={(field) => (
                      <div className="flex flex-col gap-2">
                        <label htmlFor={field.name} className={labelClasses}>
                          Company *
                        </label>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Company or organization"
                        />
                        {field.state.meta.errors.length ? (
                          <em className="text-xs text-red-500">
                            {field.state.meta.errors.join(', ')}
                          </em>
                        ) : null}
                      </div>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <form.Field
                    name="email"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value) return 'Business email is required'
                        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
                          return 'Invalid email address'
                        return undefined
                      },
                    }}
                    children={(field) => (
                      <div className="flex flex-col gap-2">
                        <label htmlFor={field.name} className={labelClasses}>
                          Business email *
                        </label>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="email"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="you@company.com"
                        />
                        {field.state.meta.errors.length ? (
                          <em className="text-xs text-red-500">
                            {field.state.meta.errors.join(', ')}
                          </em>
                        ) : null}
                      </div>
                    )}
                  />
                  <form.Field
                    name="phoneNumber"
                    children={(field) => (
                      <div className="flex flex-col gap-2">
                        <label htmlFor={field.name} className={labelClasses}>
                          Phone
                        </label>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="tel"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    )}
                  />
                </div>

                <form.Field
                  name="currentUrl"
                  children={(field) => (
                    <div className="flex flex-col gap-2">
                      <label htmlFor={field.name} className={labelClasses}>
                        Current site, portal, or tool{' '}
                        <span className="text-ink-faint normal-case tracking-normal">
                          (optional)
                        </span>
                      </label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="A link to whatever you work in today"
                      />
                    </div>
                  )}
                />

                <form.Field
                  name="vision"
                  validators={{
                    onChange: ({ value }) =>
                      !value || value.length < 10
                        ? 'Please share a bit more detail'
                        : undefined,
                  }}
                  children={(field) => (
                    <div className="flex flex-col gap-2">
                      <label htmlFor={field.name} className={labelClasses}>
                        Where does the business feel slow? *
                      </label>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="The workflow pain, disconnected tools, reporting gaps, or manual process slowing you down."
                        rows={5}
                      />
                      {field.state.meta.errors.length ? (
                        <em className="text-xs text-red-500">
                          {field.state.meta.errors.join(', ')}
                        </em>
                      ) : null}
                    </div>
                  )}
                />

                <form.Field
                  name="communicationMethods"
                  validators={{
                    onChange: ({ value }) =>
                      value.length === 0
                        ? 'Select at least one method'
                        : undefined,
                  }}
                  children={(field) => (
                    <div className="flex flex-col gap-2.5">
                      <span className={labelClasses}>
                        How should we reach you? *
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {commOptions.map((option) => {
                          const on = field.state.value.includes(option.value)
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() =>
                                field.handleChange(
                                  on
                                    ? field.state.value.filter(
                                        (v) => v !== option.value,
                                      )
                                    : [...field.state.value, option.value],
                                )
                              }
                              aria-pressed={on}
                              className={`px-[18px] py-2.5 text-[13px] cursor-pointer transition-all duration-200 border ${
                                on
                                  ? 'border-gold bg-gold-tint text-gold-text'
                                  : 'border-line bg-transparent text-ink-sub'
                              }`}
                            >
                              {option.label}
                            </button>
                          )
                        })}
                      </div>
                      {field.state.meta.errors.length ? (
                        <em className="text-xs text-red-500">
                          {field.state.meta.errors.join(', ')}
                        </em>
                      ) : null}
                    </div>
                  )}
                />

                <div className="pt-2">
                  <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                      <Button
                        type="submit"
                        fullWidth
                        disabled={!canSubmit || isSubmitting}
                      >
                        {isSubmitting ? 'Sending...' : 'Request Diagnostic'}
                      </Button>
                    )}
                  />
                  <p className="mt-3.5 text-center text-xs text-ink-faint">
                    Free diagnostic · transparent pricing · no mystery retainers
                  </p>
                  {error && (
                    <p className="text-red-500 text-xs mt-4 text-center">
                      {error}
                    </p>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
