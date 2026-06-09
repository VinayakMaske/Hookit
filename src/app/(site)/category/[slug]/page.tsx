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

  const categoryName = category?.name || slug.replace(/-/g, ' ')

  return {
    title: `Best ${categoryName} Hooks`,
    description: `Discover the best ${categoryName} products, blogs, links, creators and ideas on Hookit.`,
    alternates: {
      canonical: `https://hookit.online/category/${slug}`,
    },
    openGraph: {
      title: `Best ${categoryName} Hooks`,
      description: `Explore ${categoryName} creators, products, blogs and links on Hookit.`,
      url: `https://hookit.online/category/${slug}`,
      siteName: 'Hookit',
      type: 'website',
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
    .select('*')
    .eq('is_published', true)
    .eq('category_slug', slug)
    .order('created_at', { ascending: false })

  const categoryName = category?.name || slug.replace(/-/g, ' ')

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-24 pb-14">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm font-medium text-purple-600 mb-3">
            Hookit Category
          </p>

          <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-4 capitalize">
            Best {categoryName} Hooks
          </h1>

          <p className="text-lg text-neutral-500 max-w-2xl">
            Discover the best {categoryName} products, blogs, links, creators and ideas shared on Hookit.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
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
                    {hook.description || `Discover this ${categoryName} hook on Hookit.`}
                  </p>

                  <p className="text-xs text-neutral-400 mt-4">
                    @{hook.creator_username || hook.creator_name || 'anonymous'}
                  </p>
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
  )
}