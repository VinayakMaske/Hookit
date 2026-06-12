// src/app/(site)/creator/[username]/page.tsx

import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

type Props = {
  params: Promise<{
    username: string
  }>
}

const SITE_URL = 'https://hookit.online'

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return String(num)
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
}

async function getCreatorData(username: string) {
  const supabase = await createClient()

  const { data: creator } = await supabase
    .from('creators')
    .select(
      'id, username, display_name, bio, location, website, avatar_url, banner_url, is_verified, total_views, total_clicks, created_at, updated_at, email'
    )
    .eq('username', username)
    .single()

  let creatorData: any = null
  let creatorEmail: string | null = null

  if (creator) {
    creatorData = creator
    creatorEmail = creator.email
  } else {
    const { data: fallbackHooks } = await supabase
      .from('hooks')
      .select('creator_email_ref, creator_name, creator_username, created_at')
      .eq('is_published', true)
      .or(
        `creator_username.eq.${username},creator_name.eq.${username},creator_username.ilike.${username}`
      )
      .order('created_at', { ascending: false })
      .limit(1)

    const foundHook = fallbackHooks?.[0]

    if (!foundHook) {
      return {
        creator: null,
        hooks: [],
      }
    }

    creatorEmail = foundHook.creator_email_ref

    creatorData = {
      username: foundHook.creator_username || foundHook.creator_name || username,
      display_name: foundHook.creator_name || foundHook.creator_username || username,
      bio: null,
      location: null,
      website: null,
      avatar_url: null,
      banner_url: null,
      is_verified: false,
      total_views: 0,
      total_clicks: 0,
      created_at: foundHook.created_at,
      email: creatorEmail,
    }
  }

  const selectFields = `
    id,
    slug,
    title,
    description,
    images,
    image_url,
    category,
    category_slug,
    tags,
    type,
    hook_purpose,
    hook_subtype,
    why_care,
    search_queries,
    target_audience,
    destination_url,
    blog_content,
    product_price,
    product_details,
    creator_name,
    creator_username,
    views,
    view_count,
    clicks,
    created_at,
    updated_at
  `

  const { data: hooksExact } = await supabase
    .from('hooks')
    .select(selectFields)
    .eq('creator_username', creatorData.username)
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  const { data: hooksByEmail } = await supabase
    .from('hooks')
    .select(selectFields)
    .eq('creator_email_ref', creatorEmail || '')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  const { data: hooksByName } = await supabase
    .from('hooks')
    .select(selectFields)
    .eq('creator_name', creatorData.username)
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  const allHooks = [
    ...(hooksExact || []),
    ...(hooksByEmail || []),
    ...(hooksByName || []),
  ]

  const seen = new Set<string>()

  const uniqueHooks = allHooks.filter((hook: any) => {
    if (seen.has(hook.id)) return false
    seen.add(hook.id)
    return true
  })

  return {
    creator: {
      username: creatorData.username,
      display_name: creatorData.display_name || creatorData.username,
      bio: creatorData.bio,
      location: creatorData.location,
      website: creatorData.website,
      avatar_url: creatorData.avatar_url,
      banner_url: creatorData.banner_url,
      joined_at: creatorData.created_at,
      verified: creatorData.is_verified,
      total_views: creatorData.total_views,
      total_clicks: creatorData.total_clicks,
    },
    hooks: uniqueHooks,
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  const { creator, hooks } = await getCreatorData(username)

  if (!creator) {
    return {
      title: 'Creator Not Found',
      description: 'This creator profile could not be found on Hookit.',
      alternates: {
        canonical: `${SITE_URL}/creator/${username}`,
      },
    }
  }

  const title = `${creator.display_name || creator.username} Hooks`
  const description =
    creator.bio ||
    `Explore ${hooks.length} hooks published by ${creator.display_name || creator.username} on Hookit. Discover their blogs, products, resources, recommendations and useful links.`

  const categories = [
    ...new Set(hooks.map((hook: any) => hook.category).filter(Boolean)),
  ]

  const searchQueries = [
    ...new Set(
      hooks
        .flatMap((hook: any) => hook.search_queries || [])
        .filter(Boolean)
    ),
  ].slice(0, 20)

  return {
    title,
    description,
    keywords: [
      creator.display_name,
      creator.username,
      ...categories,
      ...searchQueries,
      'Hookit creator',
      'creator hooks',
      'creator profile',
      'content discovery',
    ].filter(Boolean),
    alternates: {
      canonical: `${SITE_URL}/creator/${creator.username}`,
    },
    openGraph: {
      title: `${title} | Hookit`,
      description,
      url: `${SITE_URL}/creator/${creator.username}`,
      siteName: 'Hookit',
      type: 'profile',
      images: creator.avatar_url
        ? [
            {
              url: creator.avatar_url,
              width: 1200,
              height: 630,
              alt: creator.display_name || creator.username,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Hookit`,
      description,
      images: creator.avatar_url ? [creator.avatar_url] : [],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default async function CreatorPage({ params }: Props) {
  const { username } = await params
  const { creator, hooks } = await getCreatorData(username)

  if (!creator) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-neutral-900 mb-3">
            Creator not found
          </h1>

          <p className="text-neutral-500 mb-6">
            We could not find a creator with the username @{username}.
          </p>

          <Link
            href="/explore"
            className="inline-flex rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 font-medium"
          >
            Explore Hooks
          </Link>
        </div>
      </div>
    )
  }

  const totalViews = hooks.reduce(
    (sum: number, hook: any) => sum + (hook.views || hook.view_count || 0),
    0
  )

  const totalClicks = hooks.reduce(
    (sum: number, hook: any) => sum + (hook.clicks || 0),
    0
  )

  const categories = [
    ...new Set(hooks.map((hook: any) => hook.category).filter(Boolean)),
  ]

  const categorySlugs = [
    ...new Set(hooks.map((hook: any) => hook.category_slug).filter(Boolean)),
  ]

  const searchQueries = [
    ...new Set(
      hooks
        .flatMap((hook: any) => hook.search_queries || [])
        .filter(Boolean)
    ),
  ].slice(0, 30)

  const hookTypes = [
    ...new Set(
      hooks
        .map((hook: any) => hook.hook_subtype || hook.type)
        .filter(Boolean)
    ),
  ]

  const creatorUrl = `${SITE_URL}/creator/${creator.username}`

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: creator.display_name || creator.username,
    alternateName: creator.username,
    description:
      creator.bio ||
      `${creator.display_name || creator.username} is a creator on Hookit sharing discoverable hooks, blogs, products, links, resources and recommendations.`,
    url: creatorUrl,
    image: creator.avatar_url || undefined,
    address: creator.location
      ? {
          '@type': 'PostalAddress',
          addressLocality: creator.location,
        }
      : undefined,
    sameAs: [creator.website].filter(Boolean),
  }

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${creator.display_name || creator.username} Hooks`,
    description: `Explore hooks published by ${creator.display_name || creator.username} on Hookit.`,
    url: creatorUrl,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: hooks.length,
      itemListElement: hooks.map((hook: any, index: number) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}/hook/${hook.slug}`,
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
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Creators',
        item: `${SITE_URL}/creator`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: creator.display_name || creator.username,
        item: creatorUrl,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <article className="sr-only">
        <h1>{creator.display_name || creator.username} on Hookit</h1>

        <p>
          {creator.bio ||
            `${creator.display_name || creator.username} is a Hookit creator sharing blogs, products, websites, tools, resources, recommendations, memories and useful links.`}
        </p>

        <h2>Creator Information</h2>

        <p>Username: {creator.username}</p>
        <p>Total Hooks: {hooks.length}</p>
        <p>Total Views: {totalViews}</p>
        <p>Total Clicks: {totalClicks}</p>

        {creator.location && <p>Location: {creator.location}</p>}

        {creator.website && (
          <p>
            Website:{' '}
            <a href={creator.website} rel="nofollow noopener noreferrer">
              {creator.website}
            </a>
          </p>
        )}

        {categories.length > 0 && (
          <section>
            <h2>Creator Categories</h2>

            <ul>
              {categories.map((category: string) => (
                <li key={category}>
                  <Link href={`/category/${slugify(category)}`}>
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {hookTypes.length > 0 && (
          <section>
            <h2>Creator Hook Types</h2>

            <ul>
              {hookTypes.map((type: string) => (
                <li key={type}>{type.replace(/_/g, ' ')}</li>
              ))}
            </ul>
          </section>
        )}

        {searchQueries.length > 0 && (
          <section>
            <h2>Popular Topics</h2>

            <ul>
              {searchQueries.map((query: string) => (
                <li key={query}>
                  <Link href={`/search/${slugify(query)}`}>{query}</Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <h2>Published Hooks</h2>

          <ul>
            {hooks.map((hook: any) => (
              <li key={hook.id}>
                <Link href={`/hook/${hook.slug}`}>{hook.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      </article>

      <div className="min-h-screen bg-neutral-50">
        <section className="relative bg-gradient-to-br from-purple-600 via-pink-500 to-rose-500 pt-28 pb-20 overflow-hidden">
          {creator.banner_url && (
            <img
              src={creator.banner_url}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
          )}

          <div className="absolute inset-0 bg-black/20" />

          <div className="relative max-w-7xl mx-auto px-4">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl max-w-4xl">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-5xl font-bold overflow-hidden shrink-0">
                  {creator.avatar_url ? (
                    <img
                      src={creator.avatar_url}
                      alt={creator.display_name || creator.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    (creator.display_name || creator.username || 'A')[0].toUpperCase()
                  )}
                </div>

                <div className="flex-1">
                  <h1 className="text-3xl md:text-5xl font-bold text-neutral-900">
                    {creator.display_name || creator.username}
                  </h1>

                  <p className="text-neutral-500 font-medium mt-1">
                    @{creator.username}
                  </p>

                  {creator.bio && (
                    <p className="text-neutral-600 mt-4 max-w-2xl leading-relaxed">
                      {creator.bio}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-3 mt-5 text-sm">
                    {creator.location && (
                      <span className="px-4 py-2 rounded-full bg-neutral-100 text-neutral-600">
                        {creator.location}
                      </span>
                    )}

                    {creator.website && (
                      <a
                        href={creator.website}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        className="px-4 py-2 rounded-full bg-purple-50 text-purple-700 hover:bg-purple-100"
                      >
                        Website
                      </a>
                    )}

                    <span className="px-4 py-2 rounded-full bg-neutral-100 text-neutral-600">
                      {hooks.length} Hooks
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-neutral-100">
              <p className="text-sm text-neutral-500">Total Hooks</p>
              <p className="text-3xl font-bold text-neutral-900">
                {formatNumber(hooks.length)}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-neutral-100">
              <p className="text-sm text-neutral-500">Total Views</p>
              <p className="text-3xl font-bold text-neutral-900">
                {formatNumber(totalViews)}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-neutral-100">
              <p className="text-sm text-neutral-500">Total Clicks</p>
              <p className="text-3xl font-bold text-neutral-900">
                {formatNumber(totalClicks)}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-neutral-100">
              <p className="text-sm text-neutral-500">Categories</p>
              <p className="text-3xl font-bold text-neutral-900">
                {formatNumber(categories.length)}
              </p>
            </div>
          </div>
        </section>

        {categories.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 pb-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              Categories by {creator.display_name || creator.username}
            </h2>

            <div className="flex flex-wrap gap-3">
              {categories.map((category: string) => (
                <Link
                  key={category}
                  href={`/category/${slugify(category)}`}
                  className="px-4 py-2 rounded-full bg-white border border-neutral-200 hover:border-purple-300 hover:bg-purple-50 text-sm"
                >
                  {category}
                </Link>
              ))}
            </div>
          </section>
        )}

        {searchQueries.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 pb-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              Popular Topics
            </h2>

            <div className="flex flex-wrap gap-3">
              {searchQueries.map((query: string) => (
                <Link
                  key={query}
                  href={`/search/${slugify(query)}`}
                  className="px-4 py-2 rounded-full bg-purple-50 text-purple-700 hover:bg-purple-100 text-sm"
                >
                  {query}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="max-w-7xl mx-auto px-4 pb-16">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">
                Published Hooks
              </h2>

              <p className="text-neutral-500 text-sm mt-1">
                {hooks.length} hooks from @{creator.username}
              </p>
            </div>
          </div>

          {hooks.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hooks.map((hook: any) => {
                const imageUrl =
                  hook.image_url ||
                  hook.images?.[0] ||
                  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop'

                const hookType =
                  hook.hook_subtype || hook.type || 'hook'

                return (
                  <Link
                    key={hook.id}
                    href={`/hook/${hook.slug}`}
                    className="group bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-xl transition-all"
                  >
                    <img
                      src={imageUrl}
                      alt={hook.title}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    <div className="p-5">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <span className="text-xs text-purple-600 font-medium capitalize">
                          {hookType.replace(/_/g, ' ')}
                        </span>

                        {hook.category && (
                          <span className="text-xs text-neutral-400">
                            {hook.category}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-lg text-neutral-900 line-clamp-2">
                        {hook.title}
                      </h3>

                      <p className="text-sm text-neutral-500 mt-2 line-clamp-3">
                        {hook.why_care ||
                          hook.description ||
                          `Discover this hook by ${creator.display_name || creator.username}.`}
                      </p>

                      {hook.search_queries?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {hook.search_queries
                            .slice(0, 2)
                            .map((query: string) => (
                              <span
                                key={query}
                                className="text-xs px-2 py-1 rounded-full bg-neutral-100 text-neutral-500"
                              >
                                {query}
                              </span>
                            ))}
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-neutral-300">
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                No hooks yet
              </h3>

              <p className="text-neutral-500">
                This creator has not published any hooks yet.
              </p>
            </div>
          )}
        </section>

        <section className="py-12 bg-gradient-to-br from-purple-50 to-pink-50 border-t border-neutral-100">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3">
              Create once. Get discovered everywhere.
            </h2>

            <p className="text-neutral-500 mb-6">
              Share your own products, blogs, resources, memories and useful links on Hookit.
            </p>

            <Link
              href="/hook/new"
              className="inline-flex rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-4 font-medium"
            >
              Create a Hook
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}