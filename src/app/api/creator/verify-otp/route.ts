import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log('verify-otp received body:', body)
    
    const { email, otp } = body
    
    console.log('verify-otp extracted:', { email, otp, otpType: typeof otp, otpLength: otp?.length })

    if (!email?.includes('@')) {
      console.log('verify-otp fail: invalid email')
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }
    
    if (!otp || typeof otp !== 'string' || otp.length !== 6) {
      console.log('verify-otp fail: invalid otp', { otp, type: typeof otp, length: otp?.length })
      return NextResponse.json({ error: 'Invalid OTP. Must be 6 digits.' }, { status: 400 })
    }

    const supabase = await createClient()
    const normalizedEmail = email.toLowerCase().trim()

    // Find the passcode record
    const { data: passcodeRecord, error } = await supabase
      .from('creator_passcodes')
      .select('*')
      .eq('email', normalizedEmail)
      .eq('otp', otp)
      .eq('is_used', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    console.log('verify-otp db query:', { passcodeRecord, error })

    if (error || !passcodeRecord) {
      console.log('verify-otp fail: record not found')
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 })
    }

    // Check if expired
    if (new Date(passcodeRecord.expires_at) < new Date()) {
      console.log('verify-otp fail: expired')
      return NextResponse.json({ error: 'OTP has expired. Please request a new one.' }, { status: 400 })
    }

    // Mark OTP as used
    const { error: updateError } = await supabase
      .from('creator_passcodes')
      .update({ is_used: true, verified_at: new Date().toISOString() })
      .eq('id', passcodeRecord.id)

    if (updateError) {
      console.error('verify-otp update error:', updateError)
      return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 })
    }

    console.log('verify-otp update success, id:', passcodeRecord.id)

    // If new creator, return verified status so frontend shows passcode creation
    if (!passcodeRecord.is_returning) {
      return NextResponse.json({
        verified: true,
        email: normalizedEmail,
        suggestedUsername: passcodeRecord.suggested_username,
        message: 'OTP verified. Please create your 4-digit passcode.',
        isNewCreator: true,
      })
    }

    // Returning creator - OTP verified, now they need to enter passcode
    return NextResponse.json({
      verified: true,
      email: normalizedEmail,
      message: 'OTP verified. Now enter your 4-digit passcode.',
      isNewCreator: false,
    })
  } catch (err: any) {
    console.error('Verify OTP error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}