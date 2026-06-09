import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  const { data: hooks } = await supabase
    .from('hooks')
    .select('slug, updated_at')
    .eq('is_published', true)

  const hookUrls =
    hooks?.map((hook) => ({
      url: `https://hookit.online/hook/${hook.slug}`,
      lastModified: new Date(
        hook.updated_at || Date.now()
      ),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
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

    ...hookUrls,
  ]
}