'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Helper: ensure creator exists in creators table
async function ensureCreator(supabase: any, username: string, displayName?: string) {
  const { data: existing } = await supabase
    .from('creators')
    .select('id, username')
    .eq('username', username)
    .maybeSingle()

  if (!existing) {
    const { data: hookData } = await supabase
      .from('hooks')
      .select('creator_email_ref, creator_name, created_at')
      .eq('creator_username', username)
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    const insertData = {
      username: username,
      display_name: displayName || hookData?.creator_name || username,
      email: hookData?.creator_email_ref || null,
      created_at: hookData?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data: inserted, error: insertError } = await supabase
      .from('creators')
      .insert(insertData)
      .select()

    if (insertError) {
      throw new Error('Failed to create creator: ' + insertError.message)
    }

    return inserted?.[0]
  }

  return existing
}

export async function updateProfile(currentUsername: string, data: {
  display_name?: string
  bio?: string
  location?: string
  website?: string
  avatar_url?: string
  banner_url?: string
}) {
  const supabase = await createClient()
  
  await ensureCreator(supabase, currentUsername, data.display_name)

  const updateData = {
    ...data,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('creators')
    .update(updateData)
    .eq('username', currentUsername)

  if (error) {
    throw new Error(error.message)
  }

  const { data: result, error: fetchError } = await supabase
    .from('creators')
    .select('*')
    .eq('username', currentUsername)
    .maybeSingle()

  if (fetchError || !result) {
    throw new Error(fetchError?.message || 'Creator not found after update')
  }

  revalidatePath(`/creator/${currentUsername}`)
  revalidatePath(`/creator/${currentUsername}/edit`)

  return { success: true, creator: result }
}

export async function updateUsername(currentUsername: string, newUsername: string) {
  const supabase = await createClient()
  const clean = newUsername.toLowerCase().trim()

  if (clean.length < 3) {
    throw new Error('Username must be at least 3 characters')
  }

  if (clean === currentUsername.toLowerCase()) {
    throw new Error('New username must be different')
  }

  const { data: existing } = await supabase
    .from('creators')
    .select('id')
    .eq('username', clean)
    .maybeSingle()

  if (existing) {
    throw new Error('Username already exists')
  }

  await ensureCreator(supabase, currentUsername)

  // Check before update
  const { data: before } = await supabase
    .from('creators')
    .select('id, username')
    .eq('username', currentUsername)
    .maybeSingle()

  console.log('Before update:', before)

  // Update
  const { error } = await supabase
    .from('creators')
    .update({ username: clean, updated_at: new Date().toISOString() })
    .eq('username', currentUsername)

  console.log('Update error:', error)

  if (error) {
    throw new Error(error.message)
  }

  // Check after update with new username
  const { data: after, error: fetchError } = await supabase
    .from('creators')
    .select('*')
    .eq('username', clean)
    .maybeSingle()

  console.log('After update:', after, 'fetchError:', fetchError)

  if (fetchError) {
    throw new Error(fetchError.message)
  }

  if (!after) {
    // Update might have worked but RLS prevents reading — try old username
    const { data: oldCheck } = await supabase
      .from('creators')
      .select('username')
      .eq('username', currentUsername)
      .maybeSingle()
    
    console.log('Old username still exists?', oldCheck)

    if (oldCheck) {
      throw new Error('Update failed silently — username still old. Check RLS policies.')
    }

    throw new Error('Creator not found after update — neither old nor new username exists')
  }

  await supabase.from('hooks').update({ creator_username: clean }).eq('creator_username', currentUsername)
  await supabase.from('hooks').update({ creator_name: clean }).eq('creator_name', currentUsername)

  revalidatePath(`/creator/${currentUsername}`)
  revalidatePath(`/creator/${clean}`)

  return { success: true, creator: after, newUsername: clean }
}

export async function deleteHook(hookId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('hooks')
    .delete()
    .eq('id', hookId)

  if (error) {
    throw new Error(error.message)
  }

  return { success: true }
}