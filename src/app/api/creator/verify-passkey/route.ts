// src/app/api/creator/verify-passkey/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email, passkey, otp } = await req.json()
    if (!email?.includes('@') || !passkey || !otp || otp.length !== 6) {
      return NextResponse.json({ error: 'Email, passkey, and OTP required' }, { status: 400 })
    }

    const supabase = await createClient()
    const normalizedEmail = email.toLowerCase().trim()

    // 1. Verify the OTP is valid and recent
    const { data: otpRecord } = await supabase
      .from('creator_passcodes')
      .select('*')
      .eq('email', normalizedEmail)
      .eq('otp', otp)
      .eq('used', true) // must be already verified
      .eq('is_returning', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (!otpRecord) {
      return NextResponse.json({ error: 'Invalid OTP. Please request a new one.' }, { status: 400 })
    }

    // 2. Check if OTP is not too old (15 min window)
    if (new Date(otpRecord.created_at) < new Date(Date.now() - 15 * 60 * 1000)) {
      return NextResponse.json({ error: 'OTP expired. Please request a new one.' }, { status: 400 })
    }

    // 3. Find creator and verify passkey matches
    const { data: creator, error: creatorError } = await supabase
      .from('creators')
      .select('id, username, email, passkey, display_name')
      .eq('email', normalizedEmail)
      .single()

    if (creatorError || !creator) {
      return NextResponse.json({ error: 'Creator not found' }, { status: 404 })
    }

    // Verify passkey belongs to this email
    if (creator.passkey !== passkey.trim().toUpperCase()) {
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