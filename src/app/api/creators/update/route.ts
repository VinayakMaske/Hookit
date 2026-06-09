import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    const currentUsername = body.current_username
    if (!currentUsername) {
      return NextResponse.json({ error: 'current_username is required' }, { status: 400 })
    }

    // ── UPDATE USERNAME ──
    if (body.action === 'update-username') {
      const newUsername = body.new_username?.toLowerCase().trim()

      if (!newUsername || newUsername.length < 3) {
        return NextResponse.json({ error: 'Username must be at least 3 characters' }, { status: 400 })
      }

      if (newUsername === currentUsername.toLowerCase()) {
        return NextResponse.json({ error: 'New username must be different' }, { status: 400 })
      }

      // Check if exists
      const { data: existing } = await supabase
        .from('creators')
        .select('id')
        .eq('username', newUsername)
        .single()

      if (existing) {
        return NextResponse.json({ error: 'Username already exists' }, { status: 409 })
      }

      // Update creators table
      const { data, error } = await supabase
        .from('creators')
        .update({ username: newUsername, updated_at: new Date().toISOString() })
        .eq('username', currentUsername)
        .select()

      if (error || !data || data.length === 0) {
        return NextResponse.json({ error: error?.message || 'Creator not found' }, { status: error ? 500 : 404 })
      }

      // Update hooks table
      await supabase.from('hooks').update({ creator_username: newUsername }).eq('creator_username', currentUsername)
      await supabase.from('hooks').update({ creator_name: newUsername }).eq('creator_name', currentUsername)

      return NextResponse.json({ success: true, creator: data[0], newUsername })
    }

    // ── UPDATE PROFILE ──
    if (body.action === 'update-profile') {
      const updateData: any = { updated_at: new Date().toISOString() }
      if (body.display_name !== undefined) updateData.display_name = body.display_name
      if (body.bio !== undefined) updateData.bio = body.bio
      if (body.location !== undefined) updateData.location = body.location
      if (body.website !== undefined) updateData.website = body.website
      if (body.avatar_url !== undefined) updateData.avatar_url = body.avatar_url
      if (body.banner_url !== undefined) updateData.banner_url = body.banner_url

      const { data, error } = await supabase
        .from('creators')
        .update(updateData)
        .eq('username', currentUsername)
        .select()

      if (error || !data || data.length === 0) {
        return NextResponse.json({ error: error?.message || 'Creator not found' }, { status: error ? 500 : 404 })
      }

      return NextResponse.json({ success: true, creator: data[0] })
    }

    return NextResponse.json({ error: 'Invalid action. Use "update-profile" or "update-username"' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update' }, { status: 500 })
  }
}