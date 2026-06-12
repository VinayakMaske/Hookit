// src/app/(site)/hook/[slug]/page.tsx

import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import HookDetailClient from '@/components/hook-detail-client'

type Props = {
  params: Promise<{
    slug: string
  }>
}

const SITE_URL = 'https://hookit.online'

function cleanDescription(description?: string | null) {
  if (!description) return ''
  return description.replace(/\s+/g, ' ').trim().slice(0, 160)
}

function getSourceUrl(hook: any) {
  if (hook.destination_url) return hook.destination_url

  if (hook.product_details?.external_store_url) {
    return hook.product_details.external_store_url
  }

  return ''
}

function getHookSubtype(hook: any) {
  return hook.hook_subtype || hook.type || 'link'
}

function getHookTypeLabel(hook: any) {
  return getHookSubtype(hook).replace(/_/g, ' ')
}

function getMetadataDescription(hook: any) {
  return (
    cleanDescription(hook.description || hook.why_care || hook.llm_summary) ||
    `Discover ${hook.title} on Hookit. A public SEO-friendly discovery page by ${
      hook.creator_name || hook.creator_username || 'a Hookit creator'
    }.`
  )
}

function getPageDescription(hook: any) {
  return (
    hook.description ||
    hook.why_care ||
    hook.llm_summary ||
    `Discover ${hook.title} on Hookit, an SEO-friendly discovery page that helps creator content become searchable across the internet.`
  )
}

function buildStructuredData(hook: any, description: string, sourceUrl: string) {
  const hookUrl = `${SITE_URL}/hook/${hook.slug}`
  const subtype = getHookSubtype(hook)

  const common = {
    '@context': 'https://schema.org',
    url: hookUrl,
    isPartOf: {
    '@type': 'WebSite',
    name: 'Hookit',
    url: 'https://hookit.online',
  },
  }

  const creator = {
    '@type': 'Person',
    name: hook.creator_name || hook.creator_username || 'Anonymous',
    url: hook.creator_username
      ? `${SITE_URL}/creator/${hook.creator_username}`
      : undefined,
  }

  const publisher = {
    '@type': 'Organization',
    name: 'Hookit',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
  }

  switch (subtype) {
    case 'product':
      return {
        ...common,
        '@type': 'Product',
        name: hook.title,
        description,
        image: hook.image_url || hook.images?.[0],
        category: hook.category,
        sku: hook.id,
        brand: {
          '@type': 'Brand',
          name: hook.creator_name || hook.creator_username || 'Hookit Creator',
        },
        offers: {
          '@type': 'Offer',
          price: hook.product_price || 0,
          priceCurrency: hook.product_details?.currency || 'INR',
          availability: 'https://schema.org/InStock',
          url: sourceUrl || hookUrl,
        },
      }

    case 'blog':
    case 'memory':
    case 'life_lesson':
      return {
        ...common,
        '@type': subtype === 'blog' ? 'Article' : 'BlogPosting',
        headline: hook.title,
        description,
        image: hook.image_url || hook.images?.[0],
        datePublished: hook.created_at,
        dateModified: hook.updated_at || hook.created_at,
        author: creator,
        publisher,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': hookUrl,
        },
      }

    case 'video':
      return {
        ...common,
        '@type': 'VideoObject',
        name: hook.title,
        description,
        thumbnailUrl: hook.image_url || hook.images?.[0],
        uploadDate: hook.created_at,
        creator,
        publisher,
        contentUrl: sourceUrl || hookUrl,
      }

    case 'review':
    case 'recommendation':
      return {
        ...common,
        '@type': 'Review',
        name: hook.title,
        reviewBody: hook.description || hook.why_care || description,
        image: hook.image_url || hook.images?.[0],
        author: creator,
        publisher,
        itemReviewed: {
          '@type': 'CreativeWork',
          name: hook.title,
          description,
        },
      }

    case 'portfolio':
      return {
        ...common,
        '@type': 'CreativeWork',
        name: hook.title,
        description,
        image: hook.image_url || hook.images?.[0],
        creator,
        genre: hook.category,
      }

    case 'resource':
    case 'tool':
      return {
        ...common,
        '@type': subtype === 'resource' ? 'LearningResource' : 'SoftwareApplication',
        name: hook.title,
        description,
        image: hook.image_url || hook.images?.[0],
        creator,
        applicationCategory: subtype === 'tool' ? 'ProductivityApplication' : undefined,
      }

    case 'collection':
      return {
        ...common,
        '@type': 'CollectionPage',
        name: hook.title,
        description,
        image: hook.image_url || hook.images?.[0],
        creator,
        mainEntity: {
          '@type': 'ItemList',
          name: hook.title,
          description,
        },
      }

    case 'hidden_gem':
      return {
        ...common,
        '@type': 'WebPage',
        name: hook.title,
        description,
        image: hook.image_url || hook.images?.[0],
        mainEntity: {
          '@type': 'Place',
          name: hook.title,
          description,
        },
      }

    case 'website':
      return {
        ...common,
        '@type': 'WebSite',
        name: hook.title,
        description,
        image: hook.image_url || hook.images?.[0],
        creator,
      }

    default:
      return {
        ...common,
        '@type': 'WebPage',
        name: hook.title,
        description,
        image: hook.image_url || hook.images?.[0],
        mainEntity: {
          '@type': 'CreativeWork',
          name: hook.title,
          description,
          creator,
        },
      }
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: hook } = await supabase
    .from('hooks')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!hook) {
    return {
      title: 'Hook Not Found | Hookit',
      description: 'This Hook may have been removed or is no longer available.',
      alternates: {
        canonical: `${SITE_URL}/hook/${slug}`,
      },
    }
  }

  const description = getMetadataDescription(hook)

  const keywords = [
    ...(hook.tags || []),
    ...(hook.search_queries || []),
    ...(hook.target_audience || []),
    hook.category,
    hook.category_slug,
    hook.hook_subtype,
    hook.hook_purpose,
    hook.creator_username,
    'Hookit',
    'content discovery',
    'creator discovery',
  ].filter(Boolean)

  const imageUrl = hook.image_url || hook.images?.[0]
  const hookUrl = `${SITE_URL}/hook/${hook.slug}`

  return {
    title: `${hook.title} | ${hook.category || 'Discover'}`,
    description,
    keywords,
    alternates: {
      canonical: hookUrl,
    },
    openGraph: {
      title: hook.title,
      description,
      url: hookUrl,
      siteName: 'Hookit',
      type: 'article',
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: hook.title,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: hook.title,
      description,
      images: imageUrl ? [imageUrl] : [],
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

export default async function Page({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: hook } = await supabase
    .from('hooks')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!hook) {
    return <HookDetailClient slug={slug} />
  }

  const sourceUrl = getSourceUrl(hook)
  const description = getPageDescription(hook)
  const structuredData = buildStructuredData(hook, description, sourceUrl)

  const hookSubtype = getHookSubtype(hook)
  const hookTypeLabel = getHookTypeLabel(hook)
  const creatorUsername =
    hook.creator_username || hook.creator_name || 'anonymous'

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* SEO + LLM readable server-rendered content */}
      <article className="sr-only">
        <h1>{hook.title}</h1>

        {hook.llm_summary && (
          <section>
            <h2>Summary</h2>
            <p>{hook.llm_summary}</p>
          </section>
        )}

        <section>
          <h2>Overview</h2>
          <p>{description}</p>

          <p>
            This is a public Hookit discovery page created to make creator
            content, products, blogs, links, websites, tools, research, videos,
            portfolios, recommendations and resources easier to find through
            search engines and AI search tools.
          </p>

          <p>
            Hook type: {hookTypeLabel}. Hook purpose:{' '}
            {hook.hook_purpose || 'discovery'}. Category:{' '}
            {hook.category || 'General'}. Creator:{' '}
            {hook.creator_name || hook.creator_username || 'Anonymous'}.
          </p>
        </section>

        <section>
          <h2>About the {hook.category || 'General'} category</h2>

          <p>
            This Hook belongs to the {hook.category || 'General'} category on
            Hookit. Hookit is a discovery platform where creators share
            products, blogs, websites, tools, resources, recommendations,
            reviews, portfolios, videos, hidden gems, memories and experiences.
          </p>
        </section>

        {hook.why_care && (
          <section>
            <h2>Why should someone care?</h2>
            <p>{hook.why_care}</p>
          </section>
        )}

        {hook.search_queries?.length > 0 && (
          <section>
            <h2>Related Searches</h2>

            <ul>
              {hook.search_queries.map((query: string) => (
                <li key={query}>
                  <Link
                    href={`/search/${query
                      .toLowerCase()
                      .trim()
                      .replace(/\s+/g, '-')}`}
                  >
                    {query}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {hook.target_audience?.length > 0 && (
          <section>
            <h2>Who is this useful for?</h2>

            <ul>
              {hook.target_audience.map((audience: string) => (
                <li key={audience}>{audience}</li>
              ))}
            </ul>
          </section>
        )}

        {hook.tags?.length > 0 && (
          <section>
            <h2>Topics and tags</h2>

            <ul>
              {hook.tags.map((tag: string) => (
                <li key={tag}>
                  <Link href={`/explore?tag=${encodeURIComponent(tag)}`}>
                    {tag}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {hook.type === 'blog' && hook.blog_content && (
          <section>
            <h2>Full article</h2>
            <p>{hook.blog_content}</p>
          </section>
        )}

        {hookSubtype === 'blog' && hook.blog_content && hook.type !== 'blog' && (
          <section>
            <h2>Full article</h2>
            <p>{hook.blog_content}</p>
          </section>
        )}

        {sourceUrl && (
          <section>
            <h2>Original source</h2>
            <p>
              This Hook points users to the original creator source:{' '}
              <a href={sourceUrl} rel="nofollow noopener noreferrer">
                {sourceUrl}
              </a>
            </p>
          </section>
        )}

        {hook.social_links &&
          Object.keys(hook.social_links).some((key) => hook.social_links[key]) && (
            <section>
              <h2>Creator links</h2>

              <ul>
                {Object.entries(hook.social_links)
                  .filter(([, value]) => value)
                  .map(([platform, url]) => (
                    <li key={platform}>
                      <a
                        href={url as string}
                        rel="nofollow noopener noreferrer"
                      >
                        {platform}
                      </a>
                    </li>
                  ))}
              </ul>
            </section>
          )}

        <section>
          <h2>Creator profile</h2>

          <p>
            More Hooks from this creator are available at{' '}
            <Link href={`/creator/${creatorUsername}`}>
              @{creatorUsername}
            </Link>
            .
          </p>
        </section>

        <section>
          <h2>Discovery context</h2>

          <p>
            Hookit helps people discover useful creator content through
            individual Hook pages, category pages, creator profiles and
            search-intent pages. This Hook can appear in the{' '}
            <Link
  href={`/category/${
    hook.category_slug ||
    hook.category
      ?.toLowerCase()
      .replace(/\s+/g, '-')
  }`}
>
              {hook.category || 'General'} category
            </Link>{' '}
            and related search pages.
          </p>
        </section>
      </article>

      <HookDetailClient slug={slug} />
    </>
  )
}