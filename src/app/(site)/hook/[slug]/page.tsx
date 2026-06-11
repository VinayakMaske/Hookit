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

function cleanDescription(description?: string | null) {
  if (!description) return ''
  return description.replace(/\s+/g, ' ').trim().slice(0, 160)
}

function getSourceUrl(hook: any) {
  if (hook.type === 'link') return hook.destination_url || ''
  if (hook.type === 'product') return hook.product_details?.external_store_url || ''
  return ''
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
    }
  }

  const description =
    cleanDescription(hook.description) ||
    `Discover ${hook.title} on Hookit. A public SEO-friendly discovery page by ${hook.creator_name || 'a Hookit creator'}.`

  return {
    title: hook.title,
    description,
    keywords: hook.tags || [],
    alternates: {
      canonical: `https://hookit.online/hook/${hook.slug}`,
    },
    openGraph: {
      title: hook.title,
      description,
      url: `https://hookit.online/hook/${hook.slug}`,
      siteName: 'Hookit',
      type: 'article',
      images: hook.image_url ? [{ url: hook.image_url, alt: hook.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: hook.title,
      description,
      images: hook.image_url ? [hook.image_url] : [],
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
  const description =
    hook.description ||
    `Discover ${hook.title} on Hookit, an SEO-friendly discovery page that helps creator content become searchable across the internet.`

  const structuredData =
    hook.type === 'product'
      ? {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: hook.title,
          description,
          image: hook.image_url,
          category: hook.category,
          sku: hook.id,
          url: `https://hookit.online/hook/${hook.slug}`,
          brand: {
            '@type': 'Brand',
            name: hook.creator_name || 'Hookit Creator',
          },
          offers: {
            '@type': 'Offer',
            price: hook.product_price || 0,
            priceCurrency: hook.product_details?.currency || 'INR',
            availability: 'https://schema.org/InStock',
            url: sourceUrl || `https://hookit.online/hook/${hook.slug}`,
          },
        }
      : hook.type === 'blog'
      ? {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: hook.title,
          description,
          image: hook.image_url,
          datePublished: hook.created_at,
          dateModified: hook.updated_at || hook.created_at,
          url: `https://hookit.online/hook/${hook.slug}`,
          author: {
            '@type': 'Person',
            name: hook.creator_name || hook.creator_username || 'Anonymous',
          },
          publisher: {
            '@type': 'Organization',
            name: 'Hookit',
            url: 'https://hookit.online',
          },
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: hook.title,
          description,
          image: hook.image_url,
          url: `https://hookit.online/hook/${hook.slug}`,
          mainEntity: {
            '@type': 'CreativeWork',
            name: hook.title,
            description,
            creator: {
              '@type': 'Person',
              name: hook.creator_name || hook.creator_username || 'Anonymous',
            },
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

      {/* SEO + LLM readable server-rendered content */}
      <article className="sr-only">
        <h1>{hook.title}</h1>

        <p>{description}</p>

        <p>
          This is a public Hookit discovery page created to make creator content,
          products, blogs, links, research, videos, and resources easier to find
          through search engines and AI search tools.
        </p>

        <p>
  Hook type: {hook.type || 'link'}.
  Category: {hook.category || 'General'}.
  Creator: {hook.creator_name || hook.creator_username || 'Anonymous'}.
</p>

{/* NEW SEO SECTION */}
{hook.why_care && (
  <section>
    <h2>Why should someone care?</h2>
    <p>{hook.why_care}</p>
  </section>
)}

{/* NEW SEO SECTION */}
{hook.search_queries?.length > 0 && (
  <section>
    <h2>Related Searches</h2>

    <ul>
      {hook.search_queries.map((query: string) => (
        <li key={query}>{query}</li>
      ))}
    </ul>
  </section>
)}

{hook.tags && hook.tags.length > 0 && (
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

        {sourceUrl && (
          <section>
            <h2>Original source</h2>
            <p>
              This hook points users to the original creator source:
              <a href={sourceUrl} rel="nofollow noopener noreferrer">
                {sourceUrl}
              </a>
            </p>
          </section>
        )}

        <section>
          <h2>Creator profile</h2>
          <p>
            More hooks from this creator are available at{' '}
            <Link href={`/creator/${hook.creator_username || hook.creator_name || 'anonymous'}`}>
              @{hook.creator_username || hook.creator_name || 'anonymous'}
            </Link>
            .
          </p>
        </section>
      </article>

      <HookDetailClient slug={slug} />
    </>
  )
}