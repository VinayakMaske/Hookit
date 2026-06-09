import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email?.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const supabase = await createClient()

    // Check if creator exists
    const { data: creator, error } = await supabase
      .from('creators')
      .select('id, username, email, display_name')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Also check if there's a pending passcode
    const { data: pendingPasscode } = await supabase
      .from('creator_passcodes')
      .select('id, created_at')
      .eq('email', email.toLowerCase().trim())
      .eq('is_used', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    return NextResponse.json({
      exists: !!creator,
      creator: creator || null,
      hasPendingPasscode: !!pendingPasscode,
      pendingPasscodeId: pendingPasscode?.id || null,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}