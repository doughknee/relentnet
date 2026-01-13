import { Link, createFileRoute } from '@tanstack/react-router'
import { legalDocs } from '../../data/legalDocs'

export const Route = createFileRoute('/legal/')({
  head: () => ({
    meta: [
      { title: 'Legal Documents | RelentNet' },
      {
        name: 'description',
        content: 'Access RelentNet’s MSA, SOW, and Support Agreements.',
      },
    ],
  }),
  component: LegalIndex,
})

function LegalIndex() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e5e5] font-sans selection:bg-[#E1BE4C] selection:text-black">
      <div className="pt-48 pb-20 px-6 md:px-20 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl md:text-7xl leading-[1.1] animate-fade-in-up opacity-0">
            Legal <span className="italic text-[#E1BE4C]">Documentation.</span>
          </h1>
          <p
            className="mt-8 text-neutral-400 font-light text-lg leading-relaxed animate-fade-in-up opacity-0"
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
              className="group block border border-white/10 bg-white/5 p-8 hover:border-[#E1BE4C] transition-colors duration-300 animate-fade-in-up opacity-0"
              style={{ animationDelay: `${300 + index * 100}ms` }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl text-white group-hover:text-[#E1BE4C] transition-colors">
                    {doc.title}
                  </h2>
                  <p className="text-sm text-neutral-500 mt-2">
                    {doc.description}
                  </p>
                </div>
                <div className="text-xs uppercase tracking-widest text-neutral-600 group-hover:text-[#E1BE4C] transition-colors whitespace-nowrap">
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
