import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json()
    if (!email?.includes('@') || !otp || otp.length !== 6) {
      return NextResponse.json({ error: 'Invalid email or OTP' }, { status: 400 })
    }

    const supabase = await createClient()
    const normalizedEmail = email.toLowerCase().trim()

    // Find the reset record
    const { data: resetRecord, error } = await supabase
      .from('creator_passcodes')
      .select('*')
      .eq('email', normalizedEmail)
      .eq('otp', otp)
      .eq('is_used', false)
      .eq('is_reset', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error || !resetRecord) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 })
    }

    // Check expiry
    if (new Date(resetRecord.expires_at) < new Date()) {
      return NextResponse.json({ error: 'OTP has expired' }, { status: 400 })
    }

    // Mark as used
    await supabase
      .from('creator_passcodes')
      .update({ is_used: true })
      .eq('id', resetRecord.id)

    // Update creator's passkey
    const { data: creator, error: updateError } = await supabase
      .from('creators')
      .update({ passcode: resetRecord.passcode })
      .eq('email', normalizedEmail)
      .select('id, username, email, passcode')
      .single()

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update passkey' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'New passkey activated successfully',
      newPasskey: resetRecord.passcode,
      creator: {
        id: creator.id,
        username: creator.username,
        email: creator.email,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}