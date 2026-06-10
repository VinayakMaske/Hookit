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

    // Fetch related hooks (same category, different id, limit 24)
    // First try same-category hooks
const { data: categoryHooks } = await supabase
  .from('hooks')
  .select('id, slug, title, images, image_url, creator_name, category, views, creator_username, view_count, clicks, type, product_price')
  .eq('is_published', true)
  .eq('category', hook.category)
  .neq('slug', slug)
  .limit(24)

let related = categoryHooks || []

// If not enough, fill with random hooks from the platform
if (related.length < 24) {
  const { data: randomHooks } = await supabase
    .from('hooks')
    .select('id, slug, title, images, image_url, creator_name, category, views, creator_username, view_count, clicks, type, product_price')
    .eq('is_published', true)
    .neq('slug', slug)
    .limit(100)

  const existingIds = new Set(
    related.map((h) => h.id)
  )

  const fillers = (randomHooks || []).filter(
    (h) => !existingIds.has(h.id)
  )

  // shuffle
  fillers.sort(() => Math.random() - 0.5)

  related = [
    ...related,
    ...fillers
  ].slice(0, 24)
}

    return NextResponse.json({
      hook,
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