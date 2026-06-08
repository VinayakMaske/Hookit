// src/app/api/search/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')?.trim().toLowerCase() || ''
    const type = searchParams.get('type') || 'all'
    const category = searchParams.get('category') || 'all'

    if (!query && type === 'all' && category === 'all') {
      return NextResponse.json({ hooks: [], creators: [], total: 0 })
    }

    const supabase = await createClient()

    // Build hooks query
    let hooksQuery = supabase
      .from('hooks')
      .select('*')
      .eq('is_published', true)

    if (query) {
      hooksQuery = hooksQuery.or(
        `title.ilike.%${query}%,description.ilike.%${query}%,creator_name.ilike.%${query}%,category.ilike.%${query}%,tags.cs.{${query}}`
      )
    }

    if (type !== 'all') {
      hooksQuery = hooksQuery.eq('type', type)
    }

    if (category !== 'all') {
      hooksQuery = hooksQuery.eq('category', category)
    }

    const { data: hooks, error: hooksError } = await hooksQuery
      .order('created_at', { ascending: false })
      .limit(50)

    if (hooksError) {
      return NextResponse.json({ error: hooksError.message }, { status: 500 })
    }

    // Search creators
    let creatorsQuery = supabase
      .from('creators')
      .select('id, username, display_name, bio, avatar_url, total_views, total_clicks, is_verified')

    if (query) {
      creatorsQuery = creatorsQuery.or(
        `username.ilike.%${query}%,display_name.ilike.%${query}%,bio.ilike.%${query}%`
      )
    }

    const { data: creators, error: creatorsError } = await creatorsQuery
      .limit(20)

    if (creatorsError) {
      return NextResponse.json({ error: creatorsError.message }, { status: 500 })
    }

    return NextResponse.json({
      hooks: hooks || [],
      creators: creators || [],
      total: (hooks?.length || 0) + (creators?.length || 0)
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Search failed' }, { status: 500 })
  }
}