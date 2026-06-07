// src/app/api/hooks/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('hooks')
      .insert({
        title: body.title,
        description: body.description || '',
        images: body.images || [],
        image_url: body.image_url || body.images?.[0] || '',
        category: body.category,
        category_slug: body.category_slug || body.category.toLowerCase(),
        tags: body.tags || [],
        external_links: body.external_links || [],
        creator_name: body.creator_name || 'Anonymous',
        creator_email: body.creator_email,
        is_published: true,
        likes: 0,
        like_count: 0,
        saves: 0,
        save_count: 0,
        shares: 0,
        share_count: 0,
        view_count: 0,
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data.id })
  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json({ error: error.message || 'Failed to create hook' }, { status: 500 })
  }
}