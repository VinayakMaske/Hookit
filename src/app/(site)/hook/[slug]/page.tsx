// src/app/(site)/hook/[slug]/page.tsx

import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import HookDetailClient from '@/components/hook-detail-client'

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

  const { data: hook } = await supabase
    .from('hooks')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!hook) {
    return {
      title: 'Hook Not Found | Hookit',
    }
  }

  return {
    title: hook.title,

    description:
      hook.description?.slice(0, 160) ||
      `Discover ${hook.title} on Hookit`,

    openGraph: {
      title: hook.title,
      description: hook.description,
      images: hook.image_url
        ? [hook.image_url]
        : [],
    },

    twitter: {
      card: 'summary_large_image',
      title: hook.title,
      description: hook.description,
      images: hook.image_url
        ? [hook.image_url]
        : [],
    },

    alternates: {
      canonical: `https://hookit.online/hook/${hook.slug}`,
    },
  }
}

export default async function Page(
  { params }: Props
) {
  const { slug } = await params

  const supabase = await createClient()

  const { data: hook } = await supabase
    .from('hooks')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!hook) {
    return <HookDetailClient slug={slug} />
  }

  const structuredData =
    hook.type === 'product'
      ? {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: hook.title,
          description: hook.description,
          image: hook.image_url,
          category: hook.category,
          sku: hook.id,
          brand: {
            '@type': 'Brand',
            name: hook.creator_name || 'Hookit Creator',
          },
          offers: {
            '@type': 'Offer',
            price: hook.product_price || 0,
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
          },
        }
      : hook.type === 'blog'
      ? {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: hook.title,
          description: hook.description,
          image: hook.image_url,
          datePublished: hook.created_at,
          author: {
            '@type': 'Person',
            name: hook.creator_name || 'Anonymous',
          },
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: hook.title,
          description: hook.description,
          image: hook.image_url,
        }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <HookDetailClient slug={slug} />
    </>
  )
}