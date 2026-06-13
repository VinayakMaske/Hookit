// src/app/(site)/category/[slug]/page.tsx

import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

type Props = {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  const categoryName =
    category?.name ||
    slug.replace(/-/g, ' ')

  const title = `${categoryName} Blogs, Products & Creators | Hookit`

  const description = `Discover the best ${categoryName} products, blogs, links, creators and ideas on Hookit.`

  return {
    title,
    description,

    alternates: {
      canonical: `https://hookit.online/category/${slug}`,
    },

    openGraph: {
      title,
      description,
      url: `https://hookit.online/category/${slug}`,
      siteName: 'Hookit',
      type: 'website',
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function CategoryPage(
  { params }: Props
) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  const { data: hooks } = await supabase
    .from('hooks')
    .select(`
    *,
    search_queries,
    why_care
  `)
    .eq('is_published', true)
    .eq('category_slug', slug)
    .order('created_at', { ascending: false })

  const categoryName =
    category?.name ||
    slug.replace(/-/g, ' ')

  const searchQueryMap = new Map<string, number>()

;(hooks || []).forEach((hook) => {
  if (Array.isArray(hook.search_queries)) {
    hook.search_queries.forEach((query: string) => {
      const normalized = query.trim()

      if (!normalized) return

      searchQueryMap.set(
        normalized,
        (searchQueryMap.get(normalized) || 0) + 1
      )
    })
  }
})

const popularSearchQueries = Array.from(
  searchQueryMap.entries()
)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 20)

const creatorMap = new Map<
  string,
  {
    username: string
    name: string
    count: number
  }
>()

;(hooks || []).forEach((hook) => {
  const username =
    hook.creator_username ||
    hook.creator_name ||
    'anonymous'

  if (!creatorMap.has(username)) {
    creatorMap.set(username, {
      username,
      name: hook.creator_name || username,
      count: 0,
    })
  }

  creatorMap.get(username)!.count += 1
})

const topCreators = Array.from(
  creatorMap.values()
)
  .sort((a, b) => b.count - a.count)
  .slice(0, 12)

  const categorySchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',

  name: `${categoryName} Blogs, Products & Creators`,

  description: `Discover the best ${categoryName} products, blogs, links, creators and ideas on Hookit.`,

  url: `https://hookit.online/category/${slug}`,

  publisher: {
    '@type': 'Organization',
    name: 'Hookit',
    url: 'https://hookit.online',
  },

  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: hooks?.length || 0,

    itemListElement:
      (hooks || []).map((hook, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `https://hookit.online/hook/${hook.slug}`,
        name: hook.title,
      })),
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',

  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://hookit.online',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Category',
      item: 'https://hookit.online/category',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: categoryName,
      item: `https://hookit.online/category/${slug}`,
    },
  ],
}

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(categorySchema),
        }}
      />

      <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(breadcrumbSchema),
  }}
/>

<article className="sr-only">
  <h1>{categoryName} on Hookit</h1>

  <p>
    Discover blogs, products, websites, tools,
    resources, recommendations and creators
    related to {categoryName}.
  </p>

  <h2>Popular Searches</h2>

  <ul>
    {popularSearchQueries.map(([query]) => (
      <li key={query}>{query}</li>
    ))}
  </ul>

  <h2>Top Creators</h2>

  <ul>
    {topCreators.map((creator) => (
      <li key={creator.username}>
        {creator.name}
      </li>
    ))}
  </ul>
</article>

      <div className="min-h-screen bg-white">
        <section className="bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-24 pb-14">
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-sm font-medium text-purple-600 mb-3">
              Hookit Category
            </p>

            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-4 capitalize">
              {categoryName} Blogs, Products & Creators
            </h1>

            <p className="text-lg text-neutral-500 max-w-2xl">
              Discover the best {categoryName} products, blogs, links,
              creators and ideas shared on Hookit.
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-12">
  <div className="max-w-4xl">

    <h2 className="text-3xl font-bold text-neutral-900 mb-4">
      About {categoryName}
    </h2>

    <p className="text-neutral-600 leading-relaxed">
      Explore the latest {categoryName} hooks shared by creators,
      bloggers, researchers, artists and businesses on Hookit.
      Every hook is a discoverable page that helps users find
      products, ideas, resources, articles and recommendations.
    </p>

  </div>
</section>

        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="mb-8">

            {popularSearchQueries.length > 0 && (
  <div className="mb-10">

    <h2 className="text-2xl font-bold text-neutral-900 mb-4">
      Popular Searches In {categoryName}
    </h2>

    <div className="flex flex-wrap gap-3">

      {popularSearchQueries.map(([query]) => (
        <Link
          key={query}
          href={`/search/${encodeURIComponent(
            query
              .toLowerCase()
              .replace(/\s+/g, '-')
          )}`}
          className="px-4 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-sm"
        >
          {query}
        </Link>
      ))}

    </div>

  </div>
)}

{topCreators.length > 0 && (
  <div className="mb-10">

    <h2 className="text-2xl font-bold text-neutral-900 mb-4">
      Top Creators In {categoryName}
    </h2>

    <div className="flex flex-wrap gap-3">

      {topCreators.map((creator) => (
        <Link
          key={creator.username}
          href={`/creator/${creator.username}`}
          className="px-4 py-2 rounded-full bg-purple-50 text-purple-700 hover:bg-purple-100 text-sm transition-colors"
        >
          @{creator.username}
        </Link>
      ))}

    </div>

  </div>
)}

            <h2 className="text-2xl font-bold text-neutral-900">
              Latest {categoryName} Hooks
            </h2>

            <p className="text-neutral-500 text-sm mt-1">
              {(hooks || []).length} hooks found
            </p>
          </div>

          {(hooks || []).length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(hooks || []).map((hook) => (
                <Link
                  key={hook.id}
                  href={`/hook/${hook.slug}`}
                  className="group rounded-2xl border border-neutral-200 overflow-hidden bg-white hover:shadow-xl transition-all"
                >
                  <img
                    src={
                      hook.image_url ||
                      hook.images?.[0] ||
                      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop'
                    }
                    alt={hook.title}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  <div className="p-5">
                    <p className="text-xs text-purple-600 font-medium mb-2">
                      {hook.type || 'hook'}
                    </p>

                    <h3 className="font-bold text-lg text-neutral-900 line-clamp-2">
                      {hook.title}
                    </h3>

                    <p className="text-sm text-neutral-500 mt-2 line-clamp-3">
                      {hook.description ||
                        `Discover this ${categoryName} hook on Hookit.`}
                    </p>

                    <span className="text-xs text-neutral-400 mt-4 block">
  @{hook.creator_username ||
    hook.creator_name ||
    'anonymous'}
</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-neutral-300 rounded-3xl">
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                No hooks yet in {categoryName}
              </h3>

              <p className="text-neutral-500 mb-6">
                Be the first creator to share something in this category.
              </p>

              <Link
                href="/hook/new"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 font-medium"
              >
                Create a Hook
              </Link>
            </div>
          )}
        </section>
      </div>
    </>
  )
}