import { createFileRoute } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { siteConfig } from '@/site.config'

export const Route = createFileRoute('/inquire')({
  head: () => ({
    meta: [
      { title: 'Request a Workflow Diagnostic | RelentNet' },
      {
        name: 'description',
        content:
          'Request a RelentNet Workflow Diagnostic by sharing the operational friction, disconnected tools, and workflow context inside your business.',
      },
    ],
  }),
  component: Contact,
})

export const inquiryContent = {
  headline: 'Request a Workflow Diagnostic.',
  body: 'Tell us where the business feels slow, manual, disconnected, or hard to see. We will use the diagnostic request to understand the operational friction before recommending the next step.',
  successTitle: 'Diagnostic Request Received.',
  successBody:
    'We will review the workflow context, look for the clearest operational opportunity, and follow up with the best next step.',
} as const

function Contact() {
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm({
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
      try {
        const response = await fetch(
          'https://n8n.relentnet.com/webhook/fe703944-aa84-4947-a491-0046d4c0f22a',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(value),
          },
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
      } catch (err) {
        setError('Something went wrong. Please try again later.')
      }
    },
  })

  return (
    <div className="min-h-screen overflow-hidden flex flex-col">
      <div className="grow pt-32 pb-12 px-6 md:px-20 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* LEFT COLUMN: Context & Info */}
          <div className="lg:col-span-5 space-y-12">
            <div className="animate-fade-in-up opacity-0">
              <h1 className="font-serif text-5xl md:text-6xl leading-[1.1] mb-6">
                Request a <br />
                <span className="italic text-gold">Diagnostic.</span>
              </h1>
              <p className="text-ink-sub font-light text-lg leading-relaxed">
                {inquiryContent.body}
              </p>
            </div>

            <div
              className="space-y-8 border-t border-line pt-8 animate-fade-in-up opacity-0"
              style={{ animationDelay: '200ms' }}
            >
              <div>
                <h4 className="text-xs font-bold tracking-[0.3em] text-gold uppercase mb-4">
                  Office Locations
                </h4>
                <p className="text-sm text-ink-sub leading-relaxed">
                  <strong className="text-ink-em">
                    {siteConfig.regions.join(', ')}
                  </strong>
                  <br />
                  <span className="text-xs text-ink-muted">
                    Available for in-person consultation
                  </span>
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold tracking-[0.3em] text-gold uppercase mb-4">
                  Direct Contact
                </h4>
                <div className="space-y-2 text-sm text-ink-sub">
                  <p>
                    <span className="block text-[10px] uppercase tracking-widest text-ink-faint">
                      Email
                    </span>
                    {siteConfig.contact.email}
                  </p>
                  <p>
                    <span className="block text-[10px] uppercase tracking-widest text-ink-faint">
                      Phone
                    </span>
                    {siteConfig.contact.phone}
                  </p>
                  <p>
                    <span className="block text-[10px] uppercase tracking-widest text-ink-faint">
                      Hours
                    </span>
                    {siteConfig.contact.hours}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Form */}
          <div
            className="lg:col-span-7 bg-card border border-line-faint p-8 md:p-12 backdrop-blur-sm animate-fade-in-up opacity-0"
            style={{ animationDelay: '400ms' }}
          >
            {isSuccess ? (
              <div className="h-full flex flex-col justify-center items-center text-center space-y-6 animate-fade-in-up">
                <div className="w-16 h-16 rounded-full border border-gold flex items-center justify-center text-gold">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-serif">
                  {inquiryContent.successTitle}
                </h3>
                <p className="text-ink-sub max-w-md">
                  {inquiryContent.successBody}
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="text-xs tracking-widest uppercase text-gold hover:underline mt-8"
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
                className="space-y-12"
              >
                {/* STEP 1: BASICS */}
                <div className="space-y-6">
                  <h3 className="text-lg font-serif italic text-black/25 dark:text-white/50 border-b border-line-faint pb-2">
                    01. Business Context
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <form.Field
                      name="fullName"
                      validators={{
                        onChange: ({ value }) =>
                          !value ? 'Full Name is required' : undefined,
                      }}
                      children={(field) => (
                        <div className="space-y-2">
                          <label
                            htmlFor={field.name}
                            className="text-xs uppercase tracking-widest text-ink-muted"
                          >
                            Full Name *
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
                          !value ? 'Company Name is required' : undefined,
                      }}
                      children={(field) => (
                        <div className="space-y-2">
                          <label
                            htmlFor={field.name}
                            className="text-xs uppercase tracking-widest text-ink-muted"
                          >
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
                  <form.Field
                    name="email"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value) return 'Business Email is required'
                        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
                          return 'Invalid email address'
                        return undefined
                      },
                    }}
                    children={(field) => (
                      <div className="space-y-2">
                        <label
                          htmlFor={field.name}
                          className="text-xs uppercase tracking-widest text-ink-muted"
                        >
                          Business Email *
                        </label>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="email"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="john@company.com"
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
                    name="currentUrl"
                    children={(field) => (
                      <div className="space-y-2">
                        <label
                          htmlFor={field.name}
                          className="text-xs uppercase tracking-widest text-ink-muted"
                        >
                          Current Website or Tool URL
                        </label>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Existing site, portal, CRM, spreadsheet, or tool link"
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

                {/* STEP 2: THE PROJECT */}
                <div className="space-y-6">
                  <h3 className="text-lg font-serif italic text-black/25 dark:text-white/50 border-b border-line-faint pb-2">
                    02. Workflow Friction
                  </h3>

                  <form.Field
                    name="projectNature"
                    children={(field) => (
                      <div className="space-y-2">
                        <label
                          htmlFor={field.name}
                          className="text-xs uppercase tracking-widest text-ink-muted"
                        >
                          Best Starting Point *
                        </label>
                        <div className="space-y-2">
                          {[
                            {
                              label: 'Workflow discovery',
                              value: 'workflow_discovery',
                            },
                            {
                              label: 'Custom software system',
                              value: 'custom_system',
                            },
                            {
                              label: 'Technology stewardship',
                              value: 'stewardship',
                            },
                            {
                              label: 'Not sure yet',
                              value: 'not_sure',
                            },
                          ].map((option) => (
                            <label
                              key={option.value}
                              className={`flex items-center gap-3 p-3 border ${field.state.value === option.value ? 'border-gold bg-gold/5' : 'border-line bg-inset'} cursor-pointer transition-all`}
                            >
                              <input
                                type="radio"
                                name={field.name}
                                value={option.value}
                                checked={field.state.value === option.value}
                                onChange={() =>
                                  field.handleChange(
                                    option.value as typeof field.state.value,
                                  )
                                }
                                className="accent-gold"
                              />
                              <span className="text-sm">{option.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  />

                  <form.Field
                    name="hasDeadline"
                    children={(field) => (
                      <div className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            name={field.name}
                            checked={field.state.value}
                            onChange={(e) =>
                              field.handleChange(e.target.checked)
                            }
                            className="w-4 h-4 accent-gold bg-inset border-line"
                          />
                          <span className="text-sm text-ink-sub">
                            Is there a firm urgency for this workflow?
                          </span>
                        </label>
                      </div>
                    )}
                  />

                  <form.Subscribe
                    selector={(state) => [state.values.hasDeadline]}
                    children={([hasDeadline]) =>
                      hasDeadline ? (
                        <form.Field
                          name="deadlineDate"
                          validators={{
                            onChange: ({ value }) =>
                              !value ? 'Deadline date is required' : undefined,
                          }}
                          children={(field) => (
                            <div className="space-y-2 animate-fade-in-up">
                              <label
                                htmlFor={field.name}
                                className="text-xs uppercase tracking-widest text-ink-muted"
                              >
                                Urgency Date *
                              </label>
                              <Input
                                id={field.name}
                                name={field.name}
                                type="date"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                              />
                              {field.state.meta.errors.length ? (
                                <em className="text-xs text-red-500">
                                  {field.state.meta.errors.join(', ')}
                                </em>
                              ) : null}
                            </div>
                          )}
                        />
                      ) : null
                    }
                  />

                  <form.Field
                    name="vision"
                    validators={{
                      onChange: ({ value }) =>
                        !value || value.length < 10
                          ? 'Please share a bit more about your vision'
                          : undefined,
                    }}
                    children={(field) => (
                      <div className="space-y-2">
                        <label
                          htmlFor={field.name}
                          className="text-xs uppercase tracking-widest text-ink-muted"
                        >
                          What workflow, tool, or operational problem should we
                          understand? *
                        </label>
                        <Textarea
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Describe the workflow pain, disconnected tools, reporting gaps, or manual process slowing the business down."
                          rows={4}
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

                {/* STEP 3: CONCIERGE PREFERENCES */}
                <div className="space-y-6">
                  <h3 className="text-lg font-serif italic text-black/25 dark:text-white/50 border-b border-line-faint pb-2">
                    03. Concierge Preferences
                  </h3>

                  <form.Field
                    name="communicationMethods"
                    validators={{
                      onChange: ({ value }) =>
                        value.length === 0
                          ? 'Select at least one method'
                          : undefined,
                    }}
                    children={(field) => (
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-ink-muted">
                          Communication Methods (Select all that apply) *
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {[
                            { label: 'Phone Calls', value: 'phone' },
                            { label: 'Texts', value: 'sms' },
                            { label: 'Emails', value: 'email' },
                            { label: 'Video Calls', value: 'video' },
                            { label: 'In-Person', value: 'person' },
                          ].map((option) => (
                            <label
                              key={option.value}
                              className={`flex items-center gap-3 p-3 border ${
                                field.state.value.includes(option.value)
                                  ? 'border-gold bg-gold/5'
                                  : 'border-line bg-inset'
                              } cursor-pointer transition-all`}
                            >
                              <input
                                type="checkbox"
                                value={option.value}
                                checked={field.state.value.includes(
                                  option.value,
                                )}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    field.handleChange([
                                      ...field.state.value,
                                      option.value,
                                    ])
                                  } else {
                                    field.handleChange(
                                      field.state.value.filter(
                                        (v) => v !== option.value,
                                      ),
                                    )
                                  }
                                }}
                                className="accent-gold"
                              />
                              <span className="text-sm">{option.label}</span>
                            </label>
                          ))}
                        </div>
                        {field.state.meta.errors.length ? (
                          <em className="text-xs text-red-500">
                            {field.state.meta.errors.join(', ')}
                          </em>
                        ) : null}
                      </div>
                    )}
                  />

                  <form.Subscribe
                    selector={(state) => [state.values.communicationMethods]}
                    children={([methods]) => (
                      <>
                        {(methods.includes('phone') ||
                          methods.includes('sms')) && (
                          <form.Field
                            name="phoneNumber"
                            validators={{
                              onChange: ({ value }) =>
                                !value ? 'Phone number is required' : undefined,
                            }}
                            children={(field) => (
                              <div className="space-y-2 animate-fade-in-up">
                                <label
                                  htmlFor={field.name}
                                  className="text-xs uppercase tracking-widest text-ink-muted"
                                >
                                  Mobile Number *
                                </label>
                                <Input
                                  id={field.name}
                                  name={field.name}
                                  type="tel"
                                  value={field.state.value}
                                  onBlur={field.handleBlur}
                                  onChange={(e) =>
                                    field.handleChange(e.target.value)
                                  }
                                  placeholder="+1 (555) 000-0000"
                                />
                                {field.state.meta.errors.length ? (
                                  <em className="text-xs text-red-500">
                                    {field.state.meta.errors.join(', ')}
                                  </em>
                                ) : null}
                              </div>
                            )}
                          />
                        )}

                        {methods.includes('person') && (
                          <div className="space-y-4 animate-fade-in-up">
                            <form.Field
                              name="inPersonState"
                              validators={{
                                onChange: ({ value }) =>
                                  !value ? 'Please select a state' : undefined,
                              }}
                              children={(field) => (
                                <div className="space-y-2">
                                  <label className="text-xs uppercase tracking-widest text-ink-muted">
                                    Preferred State *
                                  </label>
                                  <div className="grid grid-cols-2 gap-2">
                                    {[...siteConfig.regions, 'Other'].map(
                                      (option) => (
                                        <label
                                          key={option}
                                          className={`flex items-center gap-2 p-3 border ${
                                            field.state.value === option
                                              ? 'border-gold bg-gold/5'
                                              : 'border-line bg-inset'
                                          } cursor-pointer transition-all`}
                                        >
                                          <input
                                            type="radio"
                                            name={field.name}
                                            value={option}
                                            checked={
                                              field.state.value === option
                                            }
                                            onChange={() =>
                                              field.handleChange(option)
                                            }
                                            className="accent-gold"
                                          />
                                          <span className="text-sm">
                                            {option}
                                          </span>
                                        </label>
                                      ),
                                    )}
                                  </div>
                                  {field.state.meta.errors.length ? (
                                    <em className="text-xs text-red-500">
                                      {field.state.meta.errors.join(', ')}
                                    </em>
                                  ) : null}
                                </div>
                              )}
                            />

                            <form.Field
                              name="cityState"
                              validators={{
                                onChange: ({ value }) =>
                                  !value
                                    ? 'City & State is required'
                                    : undefined,
                              }}
                              children={(field) => (
                                <div className="space-y-2">
                                  <label
                                    htmlFor={field.name}
                                    className="text-xs uppercase tracking-widest text-ink-muted"
                                  >
                                    City & State *
                                  </label>
                                  <Input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                      field.handleChange(e.target.value)
                                    }
                                    placeholder="e.g. Nashville, TN"
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
                        )}
                      </>
                    )}
                  />
                </div>

                {/* SUBMIT */}
                <div className="pt-4">
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
