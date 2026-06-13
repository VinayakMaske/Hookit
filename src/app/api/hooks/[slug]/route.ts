// src/app/api/hooks/[slug]/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const supabase = await createClient()

    // Fetch the hook
    const { data: hook, error: hookError } = await supabase
      .from('hooks')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()

        if (hookError || !hook) {
      return NextResponse.json({ error: 'Hook not found' }, { status: 404 })
    }

    // Fetch creator avatar from creators table
    const { data: creator } = await supabase
      .from('creators')
      .select('avatar_url, display_name, username')
      .eq('username', hook.creator_username || hook.creator_name || '')
      .maybeSingle()

    // Attach creator data to hook
    const hookWithCreator = {
      ...hook,
      creator_avatar_url: creator?.avatar_url || null,
      creator_display_name: creator?.display_name || hook.creator_name || hook.creator_username,
    }

    // Fetch related hooks using search intent + same category + fallback hooks

    // Fetch related hooks using search intent + same category + fallback hooks
const relatedSelect = `
  id,
  slug,
  title,
  description,
  why_care,
  search_queries,
  images,
  image_url,
  creator_name,
  creator_username,
  category,
  view_count,
  clicks,
  type,
  product_price
`

const searchQueries = Array.isArray(hook.search_queries)
  ? hook.search_queries
  : []

// 1. First try hooks with matching search queries
let searchRelated: any[] = []

if (searchQueries.length > 0) {
  const { data } = await supabase
    .from('hooks')
    .select(relatedSelect)
    .eq('is_published', true)
    .neq('slug', slug)
    .overlaps('search_queries', searchQueries)
    .limit(24)

  searchRelated = data || []
}

// 2. Then get hooks from same category
const { data: categoryHooks } = await supabase
  .from('hooks')
  .select(relatedSelect)
  .eq('is_published', true)
  .eq('category', hook.category)
  .neq('slug', slug)
  .limit(24)

// 3. Merge search-related + category-related hooks
const relatedMap = new Map()

for (const item of [...searchRelated, ...(categoryHooks || [])]) {
  relatedMap.set(item.id, item)
}

let related = Array.from(relatedMap.values()).slice(0, 24)

// 4. If still not enough, fill with random hooks
if (related.length < 24) {
  const { data: randomHooks } = await supabase
    .from('hooks')
    .select(relatedSelect)
    .eq('is_published', true)
    .neq('slug', slug)
    .limit(100)

  for (const item of randomHooks || []) {
    if (!relatedMap.has(item.id)) {
      relatedMap.set(item.id, item)
    }
  }

  related = Array.from(relatedMap.values())
    .sort(() => Math.random() - 0.5)
    .slice(0, 24)
}

    return NextResponse.json({
      hook: hookWithCreator,
      related: related || []
    })
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch hook' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const supabase = await createClient()

    const { error } = await supabase
      .from('hooks')
      .delete()
      .eq('slug', slug)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}