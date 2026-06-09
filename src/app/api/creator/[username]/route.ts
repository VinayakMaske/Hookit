import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: Promise<{ username: string }> }) {
  try {
    const { username } = await params
    const supabase = await createClient()

    // Fetch creator from creators table
    const { data: creator, error: creatorError } = await supabase
      .from('creators')
      .select('id, username, display_name, bio, location, website, avatar_url, banner_url, passcode, is_verified, total_views, total_clicks, created_at, updated_at, email')
      .eq('username', username)
      .single()

    let creatorData: any
    let creatorEmail: string | null = null

    if (creator && !creatorError) {
      creatorData = creator
      creatorEmail = creator.email
    } else {
      // Fallback: build from hooks table
      const { data: hooksByUsername } = await supabase
        .from('hooks')
        .select('creator_email_ref, creator_name, creator_username, created_at')
        .eq('creator_username', username)
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(1)

      const { data: hooksByName } = await supabase
        .from('hooks')
        .select('creator_email_ref, creator_name, creator_username, created_at')
        .eq('creator_name', username)
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(1)

      const { data: hooksByUsernameILike } = await supabase
        .from('hooks')
        .select('creator_email_ref, creator_name, creator_username, created_at')
        .ilike('creator_username', username)
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(1)

      const foundHook = hooksByUsername?.[0] || hooksByName?.[0] || hooksByUsernameILike?.[0]

      if (!foundHook) {
        return NextResponse.json({ error: 'Creator not found' }, { status: 404 })
      }

      creatorEmail = foundHook.creator_email_ref
      creatorData = {
        username: foundHook.creator_username || foundHook.creator_name || username,
        display_name: foundHook.creator_name || foundHook.creator_username || username,
        bio: null,
        location: null,
        website: null,
        joined_at: foundHook.created_at,
        is_verified: false,
        total_views: 0,
        total_clicks: 0,
        email: creatorEmail,
      }
    }

    // Fetch hooks
    const { data: hooksExact } = await supabase
      .from('hooks')
      .select('id, title, description, images, image_url, category, category_slug, tags, type, destination_url, blog_content, product_price, product_details, creator_name, creator_username, views, view_count, clicks, created_at')
      .eq('creator_username', creatorData.username)
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    const { data: hooksILike } = await supabase
      .from('hooks')
      .select('id, title, description, images, image_url, category, category_slug, tags, type, destination_url, blog_content, product_price, product_details, creator_name, creator_username, views, view_count, clicks, created_at')
      .ilike('creator_username', creatorData.username)
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    const { data: hooksByEmail } = await supabase
      .from('hooks')
      .select('id, title, description, images, image_url, category, category_slug, tags, type, destination_url, blog_content, product_price, product_details, creator_name, creator_username, views, view_count, clicks, created_at')
      .eq('creator_email_ref', creatorEmail || '')
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    const { data: hooksByName } = await supabase
      .from('hooks')
      .select('id, title, description, images, image_url, category, category_slug, tags, type, destination_url, blog_content, product_price, product_details, creator_name, creator_username, views, view_count, clicks, created_at')
      .eq('creator_name', creatorData.username)
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    const allHooks = [
      ...(hooksExact || []),
      ...(hooksILike || []),
      ...(hooksByEmail || []),
      ...(hooksByName || [])
    ]
    const seen = new Set()
    const uniqueHooks = allHooks.filter((hook) => {
      if (seen.has(hook.id)) return false
      seen.add(hook.id)
      return true
    })

    return NextResponse.json({
      creator: {
        username: creatorData.username,
        display_name: creatorData.display_name || creatorData.username,
        bio: creatorData.bio,
        location: creatorData.location,
        website: creatorData.website,
        avatar_url: creatorData.avatar_url,
        banner_url: creatorData.banner_url,
        joined_at: creatorData.joined_at || creatorData.created_at,
        verified: creatorData.is_verified,
        total_views: creatorData.total_views,
        total_clicks: creatorData.total_clicks,
      },
      hooks: uniqueHooks
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch creator' }, { status: 500 })
  }
}