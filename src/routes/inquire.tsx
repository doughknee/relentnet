import { createFileRoute } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useState } from 'react'

export const Route = createFileRoute('/inquire')({
  head: () => ({
    meta: [
      { title: 'Inquire | Start the Conversation with RelentNet' },
      {
        name: 'description',
        content:
          'Tell us about your vision. We provide the architecture to build your digital legacy. Bespoke creation and white-glove management.',
      },
    ],
  }),
  component: Contact,
})

function Contact() {
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      fullName: '',
      companyName: '',
      email: '',
      currentUrl: '',
      projectNature: 'new_build' as 'new_build' | 'rebuild' | 'management',
      hasDeadline: false,
      deadlineDate: '',
      vision: '',
      communicationMethods: [] as string[],
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
    <div className="min-h-screen bg-[#050505] text-[#e5e5e5] font-sans selection:bg-[#E1BE4C] selection:text-black overflow-hidden flex flex-col">
      <div className="grow pt-32 pb-12 px-6 md:px-20 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* LEFT COLUMN: Context & Info */}
          <div className="lg:col-span-5 space-y-12">
            <div className="animate-fade-in-up opacity-0">
              <h1 className="font-serif text-5xl md:text-6xl leading-[1.1] mb-6">
                Start the <br />
                <span className="italic text-[#E1BE4C]">Conversation.</span>
              </h1>
              <p className="text-neutral-400 font-light text-lg leading-relaxed">
                You have a vision. We have the architecture to build it. Tell us
                about your project, and we will determine if RelentNet is the
                right steward for your digital legacy.
              </p>
            </div>

            <div
              className="space-y-8 border-t border-white/10 pt-8 animate-fade-in-up opacity-0"
              style={{ animationDelay: '200ms' }}
            >
              <div>
                <h4 className="text-xs font-bold tracking-[0.3em] text-[#E1BE4C] uppercase mb-4">
                  Office Locations
                </h4>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  <strong className="text-white">
                    Tennessee, Louisiana, Georgia, Florida
                  </strong>
                  <br />
                  <span className="text-xs text-neutral-500">
                    Available for in-person consultation
                  </span>
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold tracking-[0.3em] text-[#E1BE4C] uppercase mb-4">
                  Direct Contact
                </h4>
                <div className="space-y-2 text-sm text-neutral-400">
                  <p>
                    <span className="block text-[10px] uppercase tracking-widest text-neutral-600">
                      Email
                    </span>
                    inquires@relentnet.com
                  </p>
                  <p>
                    <span className="block text-[10px] uppercase tracking-widest text-neutral-600">
                      Phone
                    </span>
                    727-616-1060
                  </p>
                  <p>
                    <span className="block text-[10px] uppercase tracking-widest text-neutral-600">
                      Hours
                    </span>
                    9am - 5pm CST (Mon-Fri)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Form */}
          <div
            className="lg:col-span-7 bg-neutral-900/30 border border-white/5 p-8 md:p-12 backdrop-blur-sm animate-fade-in-up opacity-0"
            style={{ animationDelay: '400ms' }}
          >
            {isSuccess ? (
              <div className="h-full flex flex-col justify-center items-center text-center space-y-6 animate-fade-in-up">
                <div className="w-16 h-16 rounded-full border border-[#E1BE4C] flex items-center justify-center text-[#E1BE4C]">
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
                <h3 className="text-2xl font-serif">Message Received.</h3>
                <p className="text-neutral-400 max-w-md">
                  Your vision has been received. A senior partner will review
                  your inquiry and contact you within 24 hours.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="text-xs tracking-widest uppercase text-[#E1BE4C] hover:underline mt-8"
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
                  <h3 className="text-lg font-serif italic text-white/50 border-b border-white/5 pb-2">
                    01. The Basics
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
                            className="text-xs uppercase tracking-widest text-neutral-500"
                          >
                            Full Name *
                          </label>
                          <input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="John Doe"
                            className="w-full bg-black/20 border border-white/10 p-3 text-sm focus:border-[#E1BE4C] focus:outline-hidden transition-colors"
                          />
                          {field.state.meta.errors ? (
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
                            className="text-xs uppercase tracking-widest text-neutral-500"
                          >
                            Company *
                          </label>
                          <input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="Relentless Industries"
                            className="w-full bg-black/20 border border-white/10 p-3 text-sm focus:border-[#E1BE4C] focus:outline-hidden transition-colors"
                          />
                          {field.state.meta.errors ? (
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
                          className="text-xs uppercase tracking-widest text-neutral-500"
                        >
                          Business Email *
                        </label>
                        <input
                          id={field.name}
                          name={field.name}
                          type="email"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="john@company.com"
                          className="w-full bg-black/20 border border-white/10 p-3 text-sm focus:border-[#E1BE4C] focus:outline-hidden transition-colors"
                        />
                        {field.state.meta.errors ? (
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
                          className="text-xs uppercase tracking-widest text-neutral-500"
                        >
                          Current Website
                        </label>
                        <input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="https://..."
                          className="w-full bg-black/20 border border-white/10 p-3 text-sm focus:border-[#E1BE4C] focus:outline-hidden transition-colors"
                        />
                        {field.state.meta.errors ? (
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
                  <h3 className="text-lg font-serif italic text-white/50 border-b border-white/5 pb-2">
                    02. The Project
                  </h3>

                  <form.Field
                    name="projectNature"
                    children={(field) => (
                      <div className="space-y-2">
                        <label
                          htmlFor={field.name}
                          className="text-xs uppercase tracking-widest text-neutral-500"
                        >
                          Current State *
                        </label>
                        <div className="space-y-2">
                          {[
                            {
                              label: 'New Build (I do not have a website yet)',
                              value: 'new_build',
                            },
                            {
                              label:
                                'Rebuild & Elevate (I want to replace my current site)',
                              value: 'rebuild',
                            },
                            {
                              label:
                                'Management Takeover (I need better hosting/updates)',
                              value: 'management',
                            },
                          ].map((option) => (
                            <label
                              key={option.value}
                              className={`flex items-center gap-3 p-3 border ${field.state.value === option.value ? 'border-[#E1BE4C] bg-[#E1BE4C]/5' : 'border-white/10 bg-black/20'} cursor-pointer transition-all`}
                            >
                              <input
                                type="radio"
                                name={field.name}
                                value={option.value}
                                checked={field.state.value === option.value}
                                onChange={() =>
                                  field.handleChange(option.value as any)
                                }
                                className="accent-[#E1BE4C]"
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
                            className="w-4 h-4 accent-[#E1BE4C] bg-black/20 border-white/10"
                          />
                          <span className="text-sm text-neutral-300">
                            Is there a firm deadline for this project?
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
                                className="text-xs uppercase tracking-widest text-neutral-500"
                              >
                                Target Launch Date *
                              </label>
                              <input
                                id={field.name}
                                name={field.name}
                                type="date"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                className="w-full bg-black/20 border border-white/10 p-3 text-sm focus:border-[#E1BE4C] focus:outline-hidden transition-colors color-scheme-dark"
                              />
                              {field.state.meta.errors ? (
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
                          className="text-xs uppercase tracking-widest text-neutral-500"
                        >
                          The Vision *
                        </label>
                        <textarea
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Tell us about your goals, design preferences, or the specific problems you are trying to solve..."
                          rows={4}
                          className="w-full bg-black/20 border border-white/10 p-3 text-sm focus:border-[#E1BE4C] focus:outline-hidden transition-colors resize-none"
                        />
                        {field.state.meta.errors ? (
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
                  <h3 className="text-lg font-serif italic text-white/50 border-b border-white/5 pb-2">
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
                        <label className="text-xs uppercase tracking-widest text-neutral-500">
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
                                  ? 'border-[#E1BE4C] bg-[#E1BE4C]/5'
                                  : 'border-white/10 bg-black/20'
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
                                className="accent-[#E1BE4C]"
                              />
                              <span className="text-sm">{option.label}</span>
                            </label>
                          ))}
                        </div>
                        {field.state.meta.errors ? (
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
                                  className="text-xs uppercase tracking-widest text-neutral-500"
                                >
                                  Mobile Number *
                                </label>
                                <input
                                  id={field.name}
                                  name={field.name}
                                  type="tel"
                                  value={field.state.value}
                                  onBlur={field.handleBlur}
                                  onChange={(e) =>
                                    field.handleChange(e.target.value)
                                  }
                                  placeholder="+1 (555) 000-0000"
                                  className="w-full bg-black/20 border border-white/10 p-3 text-sm focus:border-[#E1BE4C] focus:outline-hidden transition-colors"
                                />
                                {field.state.meta.errors ? (
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
                                  <label className="text-xs uppercase tracking-widest text-neutral-500">
                                    Preferred State *
                                  </label>
                                  <div className="grid grid-cols-2 gap-2">
                                    {[
                                      'Tennessee',
                                      'Louisiana',
                                      'Georgia',
                                      'Florida',
                                      'Other',
                                    ].map((option) => (
                                      <label
                                        key={option}
                                        className={`flex items-center gap-2 p-3 border ${
                                          field.state.value === option
                                            ? 'border-[#E1BE4C] bg-[#E1BE4C]/5'
                                            : 'border-white/10 bg-black/20'
                                        } cursor-pointer transition-all`}
                                      >
                                        <input
                                          type="radio"
                                          name={field.name}
                                          value={option}
                                          checked={field.state.value === option}
                                          onChange={() =>
                                            field.handleChange(option)
                                          }
                                          className="accent-[#E1BE4C]"
                                        />
                                        <span className="text-sm">
                                          {option}
                                        </span>
                                      </label>
                                    ))}
                                  </div>
                                  {field.state.meta.errors ? (
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
                                    className="text-xs uppercase tracking-widest text-neutral-500"
                                  >
                                    City & State *
                                  </label>
                                  <input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                      field.handleChange(e.target.value)
                                    }
                                    placeholder="e.g. Nashville, TN"
                                    className="w-full bg-black/20 border border-white/10 p-3 text-sm focus:border-[#E1BE4C] focus:outline-hidden transition-colors"
                                  />
                                  {field.state.meta.errors ? (
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
                      <button
                        type="submit"
                        disabled={!canSubmit || isSubmitting}
                        className="w-full bg-[#E1BE4C] text-black font-bold uppercase tracking-widest py-4 px-8 hover:bg-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Sending...' : 'Request Consultation'}
                      </button>
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
