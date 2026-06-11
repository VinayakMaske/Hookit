import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  // Hooks
  const { data: hooks } = await supabase
    .from('hooks')
    .select('slug, updated_at')
    .eq('is_published', true)

  // Categories
  const { data: categories } = await supabase
    .from('categories')
    .select('slug')

  // Creators
  const { data: creators } = await supabase
    .from('hooks')
    .select('creator_username')
    .not('creator_username', 'is', null)

  const { data: searchQueryHooks } = await supabase
  .from('hooks')
  .select('search_queries')
  .eq('is_published', true)

  const searchQueries = new Set<string>()

searchQueryHooks?.forEach((hook) => {
  if (Array.isArray(hook.search_queries)) {
    hook.search_queries.forEach((query) => {
      if (query?.trim()) {
        searchQueries.add(
          query
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
        )
      }
    })
  }
})

const searchUrls = Array.from(searchQueries).map(
  (query) => ({
    url: `https://hookit.online/search/${query}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })
)

  const hookUrls =
    hooks?.map((hook) => ({
      url: `https://hookit.online/hook/${hook.slug}`,
      lastModified: new Date(
        hook.updated_at || Date.now()
      ),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })) || []

  const categoryUrls =
    categories?.map((category) => ({
      url: `https://hookit.online/category/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })) || []

  const uniqueCreators = [
    ...new Set(
      creators?.map((c) => c.creator_username).filter(Boolean)
    ),
  ]

  const creatorUrls =
    uniqueCreators.map((username) => ({
      url: `https://hookit.online/creator/${username}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })) || []

  return [
    {
      url: 'https://hookit.online',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },

    {
      url: 'https://hookit.online/explore',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },

    ...categoryUrls,
    ...creatorUrls,
    ...hookUrls,
    ...searchUrls,
  ]
}