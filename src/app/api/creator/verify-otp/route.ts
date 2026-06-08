// src/app/api/creator/verify-otp/route.ts
import { createClient } from '@/lib/supabase/server'
import { sendCreatorPasskey } from '@/lib/email'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json()
    if (!email?.includes('@') || !otp || otp.length !== 6) {
      return NextResponse.json({ error: 'Invalid email or OTP' }, { status: 400 })
    }

    const supabase = await createClient()
    const normalizedEmail = email.toLowerCase().trim()

    // Find the passcode record
    const { data: passcodeRecord, error } = await supabase
      .from('creator_passcodes')
      .select('*')
      .eq('email', normalizedEmail)
      .eq('otp', otp)
      .eq('used', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error || !passcodeRecord) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 })
    }

    // Check if expired
    if (new Date(passcodeRecord.expires_at) < new Date()) {
      return NextResponse.json({ error: 'OTP has expired. Please request a new one.' }, { status: 400 })
    }

    // Mark OTP as used
    await supabase
      .from('creator_passcodes')
      .update({ used: true })
      .eq('id', passcodeRecord.id)

    // If new creator, create creator profile and send passkey
    if (!passcodeRecord.is_returning) {
      const { data: existingCreator } = await supabase
        .from('creators')
        .select('id')
        .eq('email', normalizedEmail)
        .single()

      let creator
      if (!existingCreator) {
        // Create new creator
        const { data: newCreator, error: createError } = await supabase
          .from('creators')
          .insert({
            email: normalizedEmail,
            username: passcodeRecord.suggested_username,
            display_name: passcodeRecord.suggested_username,
            passkey: passcodeRecord.passkey,
            is_verified: true,
          })
          .select()
          .single()

        if (createError) {
          return NextResponse.json({ error: 'Failed to create creator profile' }, { status: 500 })
        }
        creator = newCreator
      } else {
        creator = existingCreator
      }

      // Send passkey email
      await sendCreatorPasskey(email, passcodeRecord.passkey, creator.username)

      return NextResponse.json({
        success: true,
        message: 'Email verified. Passkey sent to your email.',
        creator: {
          id: creator.id,
          username: creator.username,
          email: normalizedEmail,
        },
        passkey: passcodeRecord.passkey,
        isNewCreator: true,
      })
    }

    // Returning creator - OTP verified, now they need to enter passkey
    return NextResponse.json({
      success: true,
      message: 'OTP verified. Now enter your Creator Passkey.',
      isNewCreator: false,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}