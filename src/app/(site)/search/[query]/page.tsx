import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

type Props = {
  params: Promise<{
    query: string
  }>
}

function formatQuery(slug: string) {
  return decodeURIComponent(slug)
    .replace(/-/g, ' ')
    .trim()
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { query } = await params

  const readableQuery = formatQuery(query)

  return {
    title: `${readableQuery}`,
    description: `Discover hooks, products, blogs, creators and resources related to ${readableQuery} on Hookit.`,

    alternates: {
      canonical: `https://hookit.online/search/${query}`,
    },

    openGraph: {
      title: `${readableQuery} | Hookit`,
      description: `Discover hooks related to ${readableQuery}.`,
      url: `https://hookit.online/search/${query}`,
      siteName: 'Hookit',
      type: 'website',
    },

    twitter: {
      card: 'summary_large_image',
      title: `${readableQuery} | Hookit`,
      description: `Discover hooks related to ${readableQuery}.`,
    },
  }
}

export default async function SearchQueryPage(
  { params }: Props
) {
  const { query } = await params

  const readableQuery = formatQuery(query)

  const supabase = await createClient()

  const { data: hooks } = await supabase
    .from('hooks')
    .select('*')
    .eq('is_published', true)

  const matchingHooks = (hooks || []).filter((hook) => {
    const title =
      hook.title?.toLowerCase() || ''

    const description =
      hook.description?.toLowerCase() || ''

    const whyCare =
      hook.why_care?.toLowerCase() || ''

    const tags = Array.isArray(hook.tags)
      ? hook.tags.join(' ').toLowerCase()
      : ''

    const searchQueries = Array.isArray(hook.search_queries)
      ? hook.search_queries.join(' ').toLowerCase()
      : ''

    const q = readableQuery.toLowerCase()

    return (
      title.includes(q) ||
      description.includes(q) ||
      whyCare.includes(q) ||
      tags.includes(q) ||
      searchQueries.includes(q)
    )
  })

  const relatedCategories = [
    ...new Set(
      matchingHooks
        .map((h) => h.category_slug)
        .filter(Boolean)
    ),
  ]

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: readableQuery,
    description: `Discover hooks related to ${readableQuery}.`,
    url: `https://hookit.online/search/${query}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: matchingHooks.length,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* SEO CONTENT */}
      <article className="sr-only">
  <h1>{readableQuery}</h1>

  <p>
    Discover products, blogs, tools,
    resources, websites, recommendations,
    reviews and creators related to
    {` ${readableQuery} `} on Hookit.
  </p>

  <h2>Related Hooks</h2>

  <ul>
    {matchingHooks.map((hook) => (
      <li key={hook.id}>
        {hook.title}
      </li>
    ))}
  </ul>

  <h2>Related Categories</h2>

  <ul>
    {relatedCategories.map((category) => (
      <li key={category}>
        {category}
      </li>
    ))}
  </ul>
</article>

      <div className="min-h-screen bg-white">
        <section className="bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-24 pb-14">
          <div className="max-w-7xl mx-auto px-4">

            <p className="text-sm font-medium text-purple-600 mb-3">
              Search Results
            </p>

            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-4 capitalize">
              {readableQuery}
            </h1>

            <p className="text-lg text-neutral-500 max-w-3xl">
              Discover hooks, blogs, products,
              creators and resources related to
              {` ${readableQuery}`}.
            </p>

          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-12">

          <div className="mb-10">

  <h2 className="text-2xl font-bold mb-4">
    Related Searches
  </h2>

  <div className="flex flex-wrap gap-3">

    {matchingHooks
      .flatMap(
        (hook) => hook.search_queries || []
      )
      .slice(0, 20)
      .map((query: string) => (
        <Link
          key={query}
          href={`/search/${query
            .toLowerCase()
            .replace(/\s+/g, '-')}`}
          className="px-4 py-2 rounded-full bg-neutral-100"
        >
          {query}
        </Link>
      ))}

  </div>

</div>

          {relatedCategories.length > 0 && (
            <div className="mb-10">

              <h2 className="text-2xl font-bold mb-4">
                Related Categories
              </h2>

              <div className="flex flex-wrap gap-3">

                {relatedCategories.map((category) => (
                  <Link
                    key={category}
                    href={`/category/${category}`}
                    className="px-4 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200"
                  >
                    {category}
                  </Link>
                ))}

              </div>

            </div>
          )}

          <div className="mb-8">

            <h2 className="text-2xl font-bold text-neutral-900">
              Related Hooks
            </h2>

            <p className="text-neutral-500 text-sm mt-1">
              {matchingHooks.length} hooks found
            </p>

          </div>

          {matchingHooks.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {matchingHooks.map((hook) => (
                <Link
                  key={hook.id}
                  href={`/hook/${hook.slug}`}
                  className="group rounded-2xl border border-neutral-200 overflow-hidden bg-white hover:shadow-xl transition-all"
                >
                  <img
                    src={
                      hook.image_url ||
                      hook.images?.[0] ||
                      '/placeholder.jpg'
                    }
                    alt={hook.title}
                    className="w-full h-56 object-cover"
                  />

                  <div className="p-5">

                    <p className="text-xs text-purple-600 font-medium mb-2">
                      {hook.type}
                    </p>

                    <h3 className="font-bold text-lg text-neutral-900 line-clamp-2">
                      {hook.title}
                    </h3>

                    <p className="text-sm text-neutral-500 mt-2 line-clamp-3">
                      {hook.why_care ||
                        hook.description}
                    </p>

                  </div>
                </Link>
              ))}

            </div>
          ) : (
            <div className="text-center py-20">

              <h3 className="text-xl font-semibold">
                No hooks found
              </h3>

              <p className="text-neutral-500 mt-2">
                No hooks currently match
                "{readableQuery}".
              </p>

            </div>
          )}
        </section>
      </div>
    </>
  )
}