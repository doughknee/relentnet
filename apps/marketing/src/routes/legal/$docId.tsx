import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { legalDocs } from '../../data/legalDocs'
import {
  MSAContent,
  SHAContent,
  SOWContent,
} from '../../components/legal/LegalContents'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/legal/$docId')({
  loader: ({ params }) => {
    const doc = legalDocs[params.docId]
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!doc) {
      throw notFound()
    }
    return doc
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    return seo({
      title: `${loaderData.title} | RelentNet`,
      description: loaderData.description,
      path: `/legal/${loaderData.id}`,
    })
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
    return <div className="text-ink">Document content not found</div>
  }

  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <section className="pt-48 pb-12 px-6 md:px-20 relative z-10">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/legal"
            className="text-xs uppercase tracking-widest text-ink-muted hover:text-gold transition-colors mb-8 block"
          >
            &larr; Back to Legal
          </Link>
          <h1 className="font-serif text-4xl md:text-6xl leading-[1.1] animate-fade-in-up opacity-0 mb-6">
            {doc.title}
          </h1>
          <p
            className="text-ink-sub font-light text-sm animate-fade-in-up opacity-0 border-t border-line pt-6 inline-block"
            style={{ animationDelay: '200ms' }}
          >
            Last Updated: <span className="text-ink-em">{doc.lastUpdated}</span>
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
