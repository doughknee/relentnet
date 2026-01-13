import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { legalDocs } from '../../data/legalDocs'
import {
  MSAContent,
  SHAContent,
  SOWContent,
} from '../../components/legal/LegalContents'

export const Route = createFileRoute('/legal/$docId')({
  loader: ({ params }) => {
    const doc = legalDocs[params.docId]
    if (!doc) {
      throw notFound()
    }
    return doc
  },
  head: ({ loaderData }) => {
    return {
      meta: [
        { title: `${loaderData?.title} | RelentNet` },
        {
          name: 'description',
          content: loaderData?.description,
        },
      ],
    }
  },
  component: LegalDoc,
})

function LegalDoc() {
  const doc = Route.useLoaderData()
  const { docId } = Route.useParams()

  const ContentComponent = {
    msa: MSAContent,
    sow: SOWContent,
    sha: SHAContent,
  }[docId]

  if (!ContentComponent) {
    return <div className="text-white">Document content not found</div>
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e5e5] font-sans selection:bg-[#E1BE4C] selection:text-black">
      {/* HEADER */}
      <section className="pt-48 pb-12 px-6 md:px-20 relative z-10">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/legal"
            className="text-xs uppercase tracking-widest text-neutral-500 hover:text-[#E1BE4C] transition-colors mb-8 block"
          >
            &larr; Back to Legal
          </Link>
          <h1 className="font-serif text-4xl md:text-6xl leading-[1.1] animate-fade-in-up opacity-0 mb-6">
            {doc.title}
          </h1>
          <p
            className="text-neutral-400 font-light text-sm animate-fade-in-up opacity-0 border-t border-white/10 pt-6 inline-block"
            style={{ animationDelay: '200ms' }}
          >
            Last Updated: <span className="text-white">{doc.lastUpdated}</span>
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="pb-32 px-6 md:px-20 relative z-10">
        <div className="max-w-4xl mx-auto animate-fade-in-up opacity-0 delay-200">
          <ContentComponent />
        </div>
      </section>
    </div>
  )
}
