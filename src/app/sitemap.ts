// src/app/sitemap.ts
import { createClient } from '@/lib/supabase/server'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://hookit.online'
  const supabase = await createClient()

  const staticPages = [
    { route: '', priority: 1.0, freq: 'daily' as const },
    { route: '/about', priority: 0.8, freq: 'weekly' as const },
    { route: '/contact', priority: 0.8, freq: 'weekly' as const },
    { route: '/careers', priority: 0.6, freq: 'weekly' as const },
    { route: '/press', priority: 0.7, freq: 'weekly' as const },
    { route: '/blog', priority: 0.9, freq: 'daily' as const },
    { route: '/pricing', priority: 0.9, freq: 'weekly' as const },
    { route: '/payouts', priority: 0.8, freq: 'weekly' as const },
    { route: '/seller-guide', priority: 0.9, freq: 'weekly' as const },
    { route: '/seller-agreement', priority: 0.5, freq: 'monthly' as const },
    { route: '/terms', priority: 0.5, freq: 'monthly' as const },
    { route: '/privacy', priority: 0.5, freq: 'monthly' as const },
    { route: '/cookies', priority: 0.5, freq: 'monthly' as const },
    { route: '/help', priority: 0.8, freq: 'weekly' as const },
    { route: '/explore', priority: 0.9, freq: 'daily' as const },
    { route: '/stores', priority: 0.8, freq: 'daily' as const },
    { route: '/trending', priority: 0.9, freq: 'daily' as const },
  ]

  const staticEntries = staticPages.map(p => ({
    url: `${baseUrl}${p.route}`,
    lastModified: new Date(),
    changeFrequency: p.freq,
    priority: p.priority,
  }))

  const blogSlugs = [
    'how-to-sell-on-instagram-2026',
    'product-photography-smartphone',
    'pricing-strategy-handmade-products',
    'shipping-guide-small-businesses-india',
    'gst-registration-creators',
    'success-story-artist-pune'
  ]

  const blogEntries = blogSlugs.map(slug => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const { data: stores } = await supabase
    .from('stores')
    .select('slug, updated_at')
    .eq('is_active', true)

  const storeEntries = (stores || []).map(store => ({
    url: `${baseUrl}/store/${store.slug}`,
    lastModified: store.updated_at ? new Date(store.updated_at) : new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  const { data: products } = await supabase
    .from('products')
    .select('id, updated_at')
    .eq('is_active', true)

  const productEntries = (products || []).map(product => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  return [...staticEntries, ...blogEntries, ...storeEntries, ...productEntries]
}