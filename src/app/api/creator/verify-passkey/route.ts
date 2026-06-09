import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email, passkey } = await req.json()
    if (!email?.includes('@') || !passkey) {
      return NextResponse.json({ error: 'Email and passkey required' }, { status: 400 })
    }

    const supabase = await createClient()
    const normalizedEmail = email.toLowerCase().trim()

    // Find creator and verify passkey matches
    const { data: creator, error: creatorError } = await supabase
      .from('creators')
      .select('id, username, email, passcode, display_name')
      .eq('email', normalizedEmail)
      .single()

    if (creatorError || !creator) {
      return NextResponse.json({ error: 'Creator not found' }, { status: 404 })
    }

    // Verify passkey belongs to this email
    if (creator.passcode !== passkey.trim().toUpperCase()) {
      return NextResponse.json({
        error: 'Invalid passkey. This passkey does not belong to your email. Please check the email from Hookit for your correct passkey.',
        needsNewPasskey: true,
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Passkey verified successfully',
      creator: {
        id: creator.id,
        username: creator.username,
        email: creator.email,
        display_name: creator.display_name,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}