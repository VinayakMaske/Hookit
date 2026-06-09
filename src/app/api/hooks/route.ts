// src/app/api/hooks/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    const baseSlug = generateSlug(body.title)

const randomSuffix = Math.random()
  .toString(36)
  .substring(2, 7)

const slug = `${baseSlug}-${randomSuffix}`

    // Build the insert payload based on hook type
    const insertPayload: any = {
      slug,
      title: body.title,
      description: body.description || '',
      images: body.images || [],
      image_url: body.image_url || body.images?.[0] || '',
      category: body.category,
      category_slug: body.category_slug || body.category.toLowerCase(),
      tags: body.tags || [],
      creator_name: body.creator_name || 'Anonymous',
      creator_username: body.creator_username || body.creator_name || body.creator_email_ref?.split('@')[0] || 'anonymous',
      creator_email_ref: body.creator_email_ref || body.creator_email || '',
      is_published: true,
      type: body.type || 'link',
      clicks: 0,
      view_count: 0,
    }

    // Type-specific fields
    if (body.type === 'link') {
      insertPayload.destination_url = body.destination_url || ''
    } else if (body.type === 'blog') {
      insertPayload.blog_content = body.blog_content || ''
    } else if (body.type === 'product') {
      insertPayload.product_price = body.product_price || 0
      insertPayload.product_details = body.product_details || {}
    }

    const { data, error } = await supabase
      .from('hooks')
      .insert(insertPayload)
      .select('*, creator_username')
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // If product hook, also insert into hook_products table for future native checkout
    if (body.type === 'product' && data) {
      const { error: productError } = await supabase
        .from('hook_products')
        .insert({
          hook_id: data.id,
          price: body.product_price || 0,
          currency: body.product_details?.currency || 'USD',
          details: body.product_details || {},
          external_store_url: body.product_details?.external_store_url || '',
          is_native_checkout: false,
        })

      if (productError) {
        console.error('Hook product insert error:', productError)
        // Don't fail the whole request, just log it
      }
    }

    return NextResponse.json({
  success: true,
  id: data.id,
  slug: data.slug
})
  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json({ error: error.message || 'Failed to create hook' }, { status: 500 })
  }
}

// GET all published hooks (for explore feed)
export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('hooks')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ hooks: data })
  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json({ error: error.message || 'Failed to fetch hooks' }, { status: 500 })
  }
}