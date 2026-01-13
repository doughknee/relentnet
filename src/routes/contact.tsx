import { createFileRoute } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { Header } from '@/components/Header'

export const Route = createFileRoute('/contact')({
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
      communicationMethod: 'email' as
        | 'sms'
        | 'phone'
        | 'email'
        | 'person_nsh'
        | 'person_la',
      phoneNumber: '',
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
          throw new Error('Failed to submit form')
        }

        setIsSuccess(true)
      } catch (err) {
        setError('Something went wrong. Please try again later.')
        console.error(err)
      }
    },
  })

  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e5e5] font-sans selection:bg-[#E1BE4C] selection:text-black overflow-hidden flex flex-col">
      {/* NAVIGATION */}
      <Header />

      <div className="flex-grow pt-32 pb-12 px-6 md:px-20 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* LEFT COLUMN: Context & Info */}
          <div className="lg:col-span-5 space-y-12">
            <div>
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

            <div className="space-y-8 border-t border-white/10 pt-8">
              <div>
                <h4 className="text-xs font-bold tracking-[0.3em] text-[#E1BE4C] uppercase mb-4">
                  Office Locations
                </h4>
                <p className="text-sm text-neutral-400 mb-2">
                  <strong className="text-white">Nashville, TN</strong> • available for in-person consultation
                </p>
                <p className="text-sm text-neutral-400">
                  <strong className="text-white">Baton Rouge, LA</strong> • available for in-person consultation
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold tracking-[0.3em] text-[#E1BE4C] uppercase mb-4">
                  Direct Contact
                </h4>
                <div className="space-y-2 text-sm text-neutral-400">
                  <p>
                    <span className="block text-[10px] uppercase tracking-widest text-neutral-600">Email</span>
                    inquires@relentnet.com
                  </p>
                  <p>
                    <span className="block text-[10px] uppercase tracking-widest text-neutral-600">Phone</span>
                    727-616-1060
                  </p>
                  <p>
                    <span className="block text-[10px] uppercase tracking-widest text-neutral-600">Hours</span>
                    9am - 5pm CST (Mon-Fri)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Form */}
          <div className="lg:col-span-7 bg-neutral-900/30 border border-white/5 p-8 md:p-12 backdrop-blur-sm">
            {isSuccess ? (
              <div className="h-full flex flex-col justify-center items-center text-center space-y-6 animate-fade-in-up">
                <div className="w-16 h-16 rounded-full border border-[#E1BE4C] flex items-center justify-center text-[#E1BE4C]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="text-2xl font-serif">Message Received.</h3>
                <p className="text-neutral-400 max-w-md">
                  Your vision has been received. A RelentNet partner will reach out
                  shortly via your preferred method.
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
                  <h3 className="text-lg font-serif italic text-white/50 border-b border-white/5 pb-2">01. The Basics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <form.Field
                      name="fullName"
                      validators={{
                        onChange: ({ value }) => !value ? 'Full Name is required' : undefined
                      }}
                      children={(field) => (
                        <div className="space-y-2">
                          <label htmlFor={field.name} className="text-xs uppercase tracking-widest text-neutral-500">Full Name *</label>
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
                            <em className="text-xs text-red-500">{field.state.meta.errors.join(', ')}</em>
                          ) : null}
                        </div>
                      )}
                    />
                     <form.Field
                      name="companyName"
                      validators={{
                        onChange: ({ value }) => !value ? 'Company Name is required' : undefined
                      }}
                      children={(field) => (
                        <div className="space-y-2">
                          <label htmlFor={field.name} className="text-xs uppercase tracking-widest text-neutral-500">Company *</label>
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
                            <em className="text-xs text-red-500">{field.state.meta.errors.join(', ')}</em>
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
                          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email address'
                          return undefined
                        }
                      }}
                      children={(field) => (
                        <div className="space-y-2">
                          <label htmlFor={field.name} className="text-xs uppercase tracking-widest text-neutral-500">Business Email *</label>
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
                            <em className="text-xs text-red-500">{field.state.meta.errors.join(', ')}</em>
                          ) : null}
                        </div>
                      )}
                    />
                    <form.Field
                      name="currentUrl"
                      children={(field) => (
                        <div className="space-y-2">
                          <label htmlFor={field.name} className="text-xs uppercase tracking-widest text-neutral-500">Current Website</label>
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
                            <em className="text-xs text-red-500">{field.state.meta.errors.join(', ')}</em>
                          ) : null}
                        </div>
                      )}
                    />
                </div>

                {/* STEP 2: THE PROJECT */}
                <div className="space-y-6">
                   <h3 className="text-lg font-serif italic text-white/50 border-b border-white/5 pb-2">02. The Project</h3>
                   
                   <form.Field
                      name="projectNature"
                      children={(field) => (
                        <div className="space-y-2">
                          <label htmlFor={field.name} className="text-xs uppercase tracking-widest text-neutral-500">Current State *</label>
                          <div className="space-y-2">
                            {[
                              { label: "New Build (I do not have a website yet)", value: "new_build" },
                              { label: "Rebuild & Elevate (I want to replace my current site)", value: "rebuild" },
                              { label: "Management Takeover (I need better hosting/updates)", value: "management" }
                            ].map(option => (
                              <label key={option.value} className={`flex items-center gap-3 p-3 border ${field.state.value === option.value ? 'border-[#E1BE4C] bg-[#E1BE4C]/5' : 'border-white/10 bg-black/20'} cursor-pointer transition-all`}>
                                <input 
                                  type="radio" 
                                  name={field.name} 
                                  value={option.value} 
                                  checked={field.state.value === option.value}
                                  onChange={() => field.handleChange(option.value as any)}
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
                                onChange={(e) => field.handleChange(e.target.checked)}
                                className="w-4 h-4 accent-[#E1BE4C] bg-black/20 border-white/10"
                              />
                              <span className="text-sm text-neutral-300">Is there a firm deadline for this project?</span>
                           </label>
                        </div>
                      )}
                    />

                    <form.Subscribe
                        selector={(state) => [state.values.hasDeadline]}
                        children={([hasDeadline]) => (
                            hasDeadline ? (
                              <form.Field
                                name="deadlineDate"
                                validators={{
                                  onChange: ({ value }) => !value ? 'Deadline date is required' : undefined
                                }}
                                children={(field) => (
                                  <div className="space-y-2 animate-fade-in-up">
                                    <label htmlFor={field.name} className="text-xs uppercase tracking-widest text-neutral-500">Target Launch Date *</label>
                                    <input
                                      id={field.name}
                                      name={field.name}
                                      type="date"
                                      value={field.state.value}
                                      onBlur={field.handleBlur}
                                      onChange={(e) => field.handleChange(e.target.value)}
                                      className="w-full bg-black/20 border border-white/10 p-3 text-sm focus:border-[#E1BE4C] focus:outline-hidden transition-colors color-scheme-dark"
                                    />
                                     {field.state.meta.errors ? (
                                      <em className="text-xs text-red-500">{field.state.meta.errors.join(', ')}</em>
                                    ) : null}
                                  </div>
                                )}
                              />
                            ) : null
                        )}
                    />

                    <form.Field
                      name="vision"
                      validators={{
                        onChange: ({ value }) => (!value || value.length < 10) ? 'Please share a bit more about your vision' : undefined
                      }}
                      children={(field) => (
                        <div className="space-y-2">
                          <label htmlFor={field.name} className="text-xs uppercase tracking-widest text-neutral-500">The Vision *</label>
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
                            <em className="text-xs text-red-500">{field.state.meta.errors.join(', ')}</em>
                          ) : null}
                        </div>
                      )}
                    />
                </div>

                 {/* STEP 3: CONCIERGE PREFERENCES */}
                 <div className="space-y-6">
                   <h3 className="text-lg font-serif italic text-white/50 border-b border-white/5 pb-2">03. Concierge Preferences</h3>
                   
                   <form.Field
                      name="communicationMethod"
                      children={(field) => (
                        <div className="space-y-2">
                          <label htmlFor={field.name} className="text-xs uppercase tracking-widest text-neutral-500">Preferred Contact Method *</label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {[
                              { label: "Executive Text / SMS", value: "sms" },
                              { label: "Phone Call", value: "phone" },
                              { label: "Email Only", value: "email" },
                              { label: "In-Person (Nashville)", value: "person_nsh" },
                              { label: "In-Person (Baton Rouge)", value: "person_la" }
                            ].map(option => (
                              <label key={option.value} className={`flex items-center gap-3 p-3 border ${field.state.value === option.value ? 'border-[#E1BE4C] bg-[#E1BE4C]/5' : 'border-white/10 bg-black/20'} cursor-pointer transition-all`}>
                                <input 
                                  type="radio" 
                                  name={field.name} 
                                  value={option.value} 
                                  checked={field.state.value === option.value}
                                  onChange={() => field.handleChange(option.value as any)}
                                  className="accent-[#E1BE4C]"
                                />
                                <span className="text-sm">{option.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    />

                     <form.Subscribe
                        selector={(state) => [state.values.communicationMethod]}
                        children={([method]) => (
                            ['sms', 'phone', 'person_nsh', 'person_la'].includes(method) ? (
                              <form.Field
                                name="phoneNumber"
                                validators={{
                                  onChange: ({ value }) => !value ? 'Phone number is required' : undefined
                                }}
                                children={(field) => (
                                  <div className="space-y-2 animate-fade-in-up">
                                    <label htmlFor={field.name} className="text-xs uppercase tracking-widest text-neutral-500">Mobile Number *</label>
                                    <input
                                      id={field.name}
                                      name={field.name}
                                      type="tel"
                                      value={field.state.value}
                                      onBlur={field.handleBlur}
                                      onChange={(e) => field.handleChange(e.target.value)}
                                      placeholder="+1 (555) 000-0000"
                                      className="w-full bg-black/20 border border-white/10 p-3 text-sm focus:border-[#E1BE4C] focus:outline-hidden transition-colors"
                                    />
                                     {field.state.meta.errors ? (
                                      <em className="text-xs text-red-500">{field.state.meta.errors.join(', ')}</em>
                                    ) : null}
                                  </div>
                                )}
                              />
                            ) : null
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
                    {error && <p className="text-red-500 text-xs mt-4 text-center">{error}</p>}
                 </div>

              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
