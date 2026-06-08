// src/app/api/creator/[username]/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: { username: string } }) {
  try {
    const username = params.username
    const supabase = await createClient()

    // Fetch creator
    const { data: creator, error: creatorError } = await supabase
      .from('creators')
      .select('id, username, display_name, bio, location, website, joined_at, is_verified, total_views, total_clicks, email')
      .eq('username', username)
      .single()

    if (creatorError || !creator) {
      return NextResponse.json({ error: 'Creator not found' }, { status: 404 })
    }

    // Fetch hooks by creator_email_ref OR creator_name (fallback)
    const { data: hooksByEmail, error: emailError } = await supabase
      .from('hooks')
      .select('id, title, description, images, image_url, category, category_slug, tags, type, destination_url, blog_content, product_price, product_details, creator_name, views, view_count, clicks, click_count, created_at')
      .eq('creator_email_ref', creator.email)
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    const { data: hooksByName, error: nameError } = await supabase
      .from('hooks')
      .select('id, title, description, images, image_url, category, category_slug, tags, type, destination_url, blog_content, product_price, product_details, creator_name, views, view_count, clicks, click_count, created_at')
      .eq('creator_name', creator.username)
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    // Merge and deduplicate
    const allHooks = [...(hooksByEmail || []), ...(hooksByName || [])]
    const uniqueHooks = allHooks.filter((hook, index, self) => 
      index === self.findIndex(h => h.id === hook.id)
    )

    return NextResponse.json({
      creator: {
        username: creator.username,
        display_name: creator.display_name,
        bio: creator.bio,
        location: creator.location,
        website: creator.website,
        joined_at: creator.joined_at,
        verified: creator.is_verified,
        total_views: creator.total_views,
        total_clicks: creator.total_clicks,
      },
      hooks: uniqueHooks
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch creator' }, { status: 500 })
  }
}