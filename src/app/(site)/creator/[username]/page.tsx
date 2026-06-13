// src/app/(site)/creator/[username]/page.tsx

import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { 
  ExternalLink, 
  FileText, 
  ShoppingBag, 
  Link2,
  MapPin,
  Star,
  Layers,
  Eye,
  MousePointerClick,
  Grid3X3,
  Bookmark,
  ArrowUpRight,
  Globe,
  Calendar,
  Hash
} from 'lucide-react'

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

function timeAgo(date: string | null): string {
  if (!date) return ''
  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays < 1) return 'Today'
  if (diffDays === 1) return '1d'
  if (diffDays < 30) return `${diffDays}d`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo`
  return `${Math.floor(diffDays / 365)}y`
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

// Hook type badge component
function HookTypeBadge({ type }: { type: string }) {
  const configs = {
    link: { icon: ExternalLink, label: 'Link', color: 'bg-blue-50 text-blue-700 border-blue-100' },
    blog: { icon: FileText, label: 'Blog', color: 'bg-purple-50 text-purple-700 border-purple-100' },
    product: { icon: ShoppingBag, label: 'Product', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  }
  const config = configs[type as keyof typeof configs] || configs.link
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold border ${config.color}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  )
}

// Hook card component - Pinterest style masonry
function HookCard({ hook, creatorName }: { hook: any; creatorName: string }) {
  const imageUrl =
    hook.image_url ||
    hook.images?.[0] ||
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop'

  const hookType = hook.hook_subtype || hook.type || 'hook'
  const views = hook.views || hook.view_count || 0
  const hookClicks = hook.clicks || 0

  return (
    <Link
      href={`/hook/${hook.slug}`}
      className="group block break-inside-avoid mb-4"
    >
      <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden hover:shadow-xl hover:shadow-purple-100/30 hover:border-purple-200 transition-all duration-300">
        {/* Image */}
        <div className="relative overflow-hidden">
          <img
            src={imageUrl}
            alt={hook.title}
            className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
            style={{ aspectRatio: 'auto' }}
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-3 left-3 right-3">
              <div className="flex items-center justify-between">
                <HookTypeBadge type={hookType} />
                <div className="flex items-center gap-3 text-white/90 text-xs">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {formatNumber(views)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MousePointerClick className="w-3 h-3" />
                    {formatNumber(hookClicks)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Type indicator - always visible top right */}
          <div className="absolute top-2.5 right-2.5">
            <div className="w-7 h-7 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
              {hookType === 'link' && <ExternalLink className="w-3.5 h-3.5 text-blue-600" />}
              {hookType === 'blog' && <FileText className="w-3.5 h-3.5 text-purple-600" />}
              {hookType === 'product' && <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-2.5">
          <h3 className="font-semibold text-[15px] text-neutral-900 leading-snug line-clamp-2 group-hover:text-purple-700 transition-colors">
            {hook.title}
          </h3>

          {hook.category && (
            <p className="text-xs text-neutral-400 mt-1.5 flex items-center gap-1">
              <Hash className="w-3 h-3" />
              {hook.category}
            </p>
          )}

          {/* Stats row */}
          <div className="flex items-center gap-3 mt-2.5 text-[11px] text-neutral-400">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {formatNumber(views)}
            </span>
            <span className="flex items-center gap-1">
              <MousePointerClick className="w-3 h-3" />
              {formatNumber(hookClicks)}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {timeAgo(hook.created_at)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default async function CreatorPage({ params }: Props) {
  const { username } = await params
  const { creator, hooks } = await getCreatorData(username)

  if (!creator) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-5">
            <Grid3X3 className="w-10 h-10 text-neutral-300" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-3">
            Creator not found
          </h1>
          <p className="text-neutral-500 mb-6">
            We could not find a creator with the username @{username}.
          </p>
          <Link
            href="/explore"
            className="inline-flex rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 font-medium text-sm hover:from-purple-700 hover:to-pink-600 transition-colors"
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

      {/* SEO Article */}
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

      {/* Main Page */}
      <div className="min-h-screen bg-white">

        {/* Profile Header - Pinterest style, clean and minimal */}
        <section className="pt-24 pb-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center text-center">

              {/* Avatar */}
<div className="relative mb-5" style={{ width: '112px', height: '112px' }}>
  <div 
    className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg"
    style={{ 
      borderRadius: '50%',
      overflow: 'hidden'
    }}
  >
    {creator.avatar_url ? (
      <img
        src={creator.avatar_url}
        alt={creator.display_name || creator.username}
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover'
        }}
      />
    ) : (
      <span style={{ fontSize: '40px' }}>
        {(creator.display_name || creator.username || 'A')[0].toUpperCase()}
      </span>
    )}
  </div>
  
  {creator.verified && (
    <div 
      className="absolute bg-purple-600 flex items-center justify-center"
      style={{ 
        borderRadius: '50%',
        width: '28px',
        height: '28px',
        bottom: '0',
        right: '0',
        border: '2px solid white'
      }}
    >
      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    </div>
  )}
</div>

              {/* Name & Username */}
              <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">
                {creator.display_name || creator.username}
              </h1>
              <p className="text-neutral-500 font-medium mt-1">
                @{creator.username}
              </p>

              {/* Bio */}
              {creator.bio && (
                <p className="text-neutral-600 mt-3 max-w-lg leading-relaxed text-sm md:text-base">
                  {creator.bio}
                </p>
              )}

              {/* Location & Website */}
              <div className="flex flex-wrap items-center justify-center gap-3 mt-3 text-sm text-neutral-500">
                {creator.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {creator.location}
                  </span>
                )}
                {creator.website && (
                  <a
                    href={creator.website}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="flex items-center gap-1 text-purple-600 hover:text-purple-700 hover:underline"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    {creator.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                  </a>
                )}
              </div>

              {/* Stats Row */}
              <div className="flex items-center justify-center gap-6 md:gap-10 mt-6">
                <div className="text-center">
                  <p className="text-xl md:text-2xl font-bold text-neutral-900">{formatNumber(hooks.length)}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">Hooks</p>
                </div>
                <div className="w-px h-10 bg-neutral-200" />
                <div className="text-center">
                  <p className="text-xl md:text-2xl font-bold text-neutral-900">{formatNumber(totalViews)}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">Views</p>
                </div>
                <div className="w-px h-10 bg-neutral-200" />
                <div className="text-center">
                  <p className="text-xl md:text-2xl font-bold text-neutral-900">{formatNumber(totalClicks)}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">Clicks</p>
                </div>
                {categories.length > 0 && (
                  <>
                    <div className="w-px h-10 bg-neutral-200" />
                    <div className="text-center">
                      <p className="text-xl md:text-2xl font-bold text-neutral-900">{formatNumber(categories.length)}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">Categories</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Categories Pills */}
        {categories.length > 0 && (
          <section className="px-4 pb-6 mb-5">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((category: string) => (
                  <Link
                    key={category}
                    href={`/category/${slugify(category)}`}
                    className="px-1.5 py-12.5 rounded-full bg-neutral-100 hover:bg-purple-50 text-neutral-600 hover:text-purple-700 text-xs font-medium transition-colors border border-transparent hover:border-purple-200"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Divider */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="border-t border-neutral-100" />
        </div>

        {/* Tabs - Hook Types */}
        {hookTypes.length > 1 && (
          <section className="px-4 py-4 sticky top-0 bg-white/80 backdrop-blur-md z-30">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-center gap-1 overflow-x-auto">
                <button className="px-4 py-2 rounded-full text-sm font-medium bg-neutral-900 text-white">
                  All
                </button>
                {hookTypes.map((type: string) => {
                  const label = type.replace(/_/g, ' ')
                  const configs: Record<string, { icon: any }> = {
                    blog: { icon: FileText },
                    product: { icon: ShoppingBag },
                    link: { icon: ExternalLink },
                  }
                  const Icon = configs[type]?.icon || Link2
                  return (
                    <button
                      key={type}
                      className="px-4 py-2 rounded-full text-sm font-medium text-neutral-600 hover:bg-neutral-100 transition-colors flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {label.charAt(0).toUpperCase() + label.slice(1)}
                    </button>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* Hooks Grid - Pinterest Masonry Style */}
        <section className="px-4 pb-16">
          <div className="max-w-7xl mx-auto">
            {hooks.length > 0 ? (
              <div 
                className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4"
                style={{ columnFill: 'balance' }}
              >
                {hooks.map((hook: any) => (
                  <HookCard 
                    key={hook.id} 
                    hook={hook} 
                    creatorName={creator.display_name || creator.username}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                  <Grid3X3 className="w-8 h-8 text-neutral-300" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  No hooks yet
                </h3>
                <p className="text-neutral-500 text-sm mb-6">
                  This creator has not published any hooks yet.
                </p>
                <Link
                  href="/hook/new"
                  className="inline-flex rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2.5 font-medium text-sm"
                >
                  Create a Hook
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-gradient-to-br from-purple-50 to-pink-50 border-t border-neutral-100">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-xl md:text-2xl font-bold text-neutral-900 mb-2">
              Create once. Get discovered everywhere.
            </h2>
            <p className="text-neutral-500 text-sm mb-5">
              Share your own products, blogs, resources, memories and useful links on Hookit.
            </p>
            <Link
              href="/hook/new"
              className="inline-flex rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-3 font-medium text-sm hover:from-purple-700 hover:to-pink-600 transition-colors"
            >
              Create a Hook
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}