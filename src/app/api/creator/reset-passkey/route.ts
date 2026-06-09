import { createClient } from '@/lib/supabase/server'
import { sendNewPasskeyReset } from '@/lib/email'
import { NextResponse } from 'next/server'

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function generatePasskey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = 'HK-'
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
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
    const newPasskey = generatePasskey()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString()

    // Store reset request
    const { error: insertError } = await supabase.from('creator_passcodes').insert({
      email: normalizedEmail,
      otp,
      passcode: newPasskey,
      expires_at: expiresAt,
      is_used: false,
      is_returning: true,
      is_reset: true,
    })

    if (insertError) {
      return NextResponse.json({ error: 'Failed to store reset request' }, { status: 500 })
    }

    // Send email with new passkey + OTP
    await sendNewPasskeyReset(email, newPasskey, creator.username, otp)

    return NextResponse.json({
      success: true,
      message: 'New passkey and OTP sent to your email',
      username: creator.username,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}