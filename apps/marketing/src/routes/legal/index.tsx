import { Link, createFileRoute } from '@tanstack/react-router'
import { legalDocs } from '../../data/legalDocs'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/legal/')({
  head: () =>
    seo({
      title: 'Legal Documents | RelentNet',
      description: 'Access RelentNet\u2019s MSA, SOW, and Support Agreements.',
      path: '/legal',
    }),
  component: LegalIndex,
})

function LegalIndex() {
  return (
    <div className="min-h-screen">
      <div className="pt-48 pb-20 px-6 md:px-20 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl leading-[1.1] animate-fade-in-up opacity-0">
            Legal <span className="italic text-gold">Documentation.</span>
          </h1>
          <p
            className="mt-8 text-ink-sub font-light text-lg leading-relaxed animate-fade-in-up opacity-0"
            style={{ animationDelay: '200ms' }}
          >
            Review the governing terms, service descriptions, and support
            agreements that define our partnership.
          </p>
        </div>
      </div>

      <div className="pb-32 px-6 md:px-20 relative z-10">
        <div className="max-w-4xl mx-auto grid gap-8">
          {Object.values(legalDocs).map((doc, index) => (
            <Link
              key={doc.id}
              to="/legal/$docId"
              params={{ docId: doc.id }}
              className="group block border border-line bg-line-faint p-8 hover:border-gold transition-colors duration-300 animate-fade-in-up opacity-0"
              style={{ animationDelay: `${300 + index * 100}ms` }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl text-ink-em group-hover:text-gold transition-colors">
                    {doc.title}
                  </h2>
                  <p className="text-sm text-ink-muted mt-2">
                    {doc.description}
                  </p>
                </div>
                <div className="text-xs uppercase tracking-widest text-ink-faint group-hover:text-gold transition-colors whitespace-nowrap">
                  Updated {doc.lastUpdated} &rarr;
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
