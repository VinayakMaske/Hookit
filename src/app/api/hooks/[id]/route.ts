// src/app/api/hooks/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: hook, error: hookError } = await supabase
      .from('hooks')
      .select('*')
      .eq('id', id)
      .eq('is_published', true)
      .single()

    if (hookError || !hook) {
      return NextResponse.json({ error: 'Hook not found' }, { status: 404 })
    }

    // Increment views
    await supabase
      .from('hooks')
      .update({ views: (hook.views || 0) + 1 })
      .eq('id', id)

    const { data: related } = await supabase
      .from('hooks')
      .select('id, title, images, image_url, creator_name, category, likes, views')
      .eq('category', hook.category)
      .eq('is_published', true)
      .neq('id', id)
      .order('created_at', { ascending: false })
      .limit(12)

    const { data: moreFromCreator } = await supabase
      .from('hooks')
      .select('id, title, images, image_url, creator_name, category, likes, views')
      .eq('creator_email', hook.creator_email)
      .eq('is_published', true)
      .neq('id', id)
      .order('created_at', { ascending: false })
      .limit(6)

    const { data: comments } = await supabase
      .from('hook_comments')
      .select('*')
      .eq('hook_id', id)
      .order('created_at', { ascending: false })
      .limit(50)

    return NextResponse.json({
      hook,
      related: related || [],
      moreFromCreator: moreFromCreator || [],
      comments: comments || [],
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}