// src/app/api/creator/otp/route.ts
import { createClient } from '@/lib/supabase/server'
import { sendCreatorOTP, sendReturningCreatorOTP } from '@/lib/email'
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

function generateUsername(email: string): string {
  const localPart = email.split('@')[0]
  const clean = localPart.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
  const random = Math.floor(1000 + Math.random() * 9000)
  return clean.slice(0, 12) + random
}

export async function POST(req: Request) {
  try {
    const { email, isReturning } = await req.json()
    if (!email?.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const supabase = await createClient()
    const normalizedEmail = email.toLowerCase().trim()

    // Check if creator exists
    const { data: existingCreator } = await supabase
      .from('creators')
      .select('id, username')
      .eq('email', normalizedEmail)
      .single()

    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 min

    if (isReturning && existingCreator) {
      // Returning creator - just send OTP for passkey verification
      await supabase.from('creator_passcodes').insert({
        email: normalizedEmail,
        otp,
        passkey: null, // not needed for returning, they already have one
        expires_at: expiresAt,
        used: false,
        is_returning: true,
      })

      await sendReturningCreatorOTP(email, otp, existingCreator.username)

      return NextResponse.json({
        success: true,
        message: 'OTP sent to returning creator',
        username: existingCreator.username,
        isReturning: true,
      })
    }

    // New creator - generate username and passkey, store with OTP
    const username = generateUsername(email)
    const passkey = generatePasskey()

    // Store in creator_passcodes table
    const { error: insertError } = await supabase.from('creator_passcodes').insert({
      email: normalizedEmail,
      otp,
      passkey,
      expires_at: expiresAt,
      used: false,
      is_returning: false,
      suggested_username: username,
    })

    if (insertError) {
      return NextResponse.json({ error: 'Failed to store OTP' }, { status: 500 })
    }

    await sendCreatorOTP(email, otp)

    return NextResponse.json({
      success: true,
      message: 'OTP sent to new creator',
      suggestedUsername: username,
      isReturning: false,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}