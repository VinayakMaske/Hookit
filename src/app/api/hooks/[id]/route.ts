// src/app/api/hooks/[id]/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: hookId } = await params
    const supabase = await createClient()

    // Fetch the hook
    const { data: hook, error: hookError } = await supabase
      .from('hooks')
      .select('*')
      .eq('id', hookId)
      .eq('is_published', true)
      .single()

    if (hookError || !hook) {
      return NextResponse.json({ error: 'Hook not found' }, { status: 404 })
    }

    // Fetch related hooks (same category, different id, limit 24)
    const { data: related, error: relatedError } = await supabase
      .from('hooks')
      .select('id, title, images, image_url, creator_name, category, views, view_count, clicks, click_count, type, product_price, price')
      .eq('is_published', true)
      .eq('category', hook.category)
      .neq('id', hookId)
      .order('created_at', { ascending: false })
      .limit(24)

    return NextResponse.json({
      hook,
      related: related || []
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch hook' }, { status: 500 })
  }
}