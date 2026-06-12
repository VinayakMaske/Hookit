import { createClient } from '@/lib/supabase/server'
import { sendPasscodeResetOTP } from '@/lib/email'
import { NextResponse } from 'next/server'

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email?.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const supabase = await createClient()
    const normalizedEmail = email.toLowerCase().trim()

    // Check if creator exists
    const { data: creator, error: creatorError } = await supabase
      .from('creators')
      .select('id, username, email')
      .eq('email', normalizedEmail)
      .single()

    if (creatorError || !creator) {
      return NextResponse.json({ error: 'No creator found with this email' }, { status: 404 })
    }

    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString()

    // Store reset request (no passcode — user will create it after OTP)
    const { error: insertError } = await supabase.from('creator_passcodes').insert({
      email: normalizedEmail,
      otp,
      expires_at: expiresAt,
      is_used: false,
      is_returning: true,
      is_reset: true,
    })

    if (insertError) {
      return NextResponse.json({ error: 'Failed to store reset request' }, { status: 500 })
    }

    // Send email with OTP only (no passcode — user creates it)
    await sendPasscodeResetOTP(email, creator.username, otp)

    return NextResponse.json({
      success: true,
      message: 'OTP sent to your email. Use it to set a new 4-digit passcode.',
      username: creator.username,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}