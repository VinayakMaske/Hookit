import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email, passcode, otp } = await request.json()
    const supabase = await createClient()
    const normalizedEmail = email.toLowerCase().trim()

    console.log('set-passcode called:', { email: normalizedEmail, otp, passcodeLength: passcode?.length })

    // Validate inputs
    if (!normalizedEmail || !otp || !passcode) {
      return NextResponse.json({ error: 'Email, OTP and passcode are required' }, { status: 400 })
    }

    // Validate passcode format
    if (!/^\d{4}$/.test(passcode)) {
      return NextResponse.json({ error: 'Passcode must be exactly 4 digits' }, { status: 400 })
    }

    // DEBUG: List ALL records for this email
    const { data: allRecords } = await supabase
      .from('creator_passcodes')
      .select('*')
      .eq('email', normalizedEmail)
      .order('created_at', { ascending: false })
    
    console.log('ALL records for email:', allRecords)

    // Find the verified OTP record — try with passcode_set_at null first
    let passcodeRecord = null

    const result1 = await supabase
      .from('creator_passcodes')
      .select('*')
      .eq('email', normalizedEmail)
      .eq('otp', otp)
      .eq('is_used', true)
      .not('verified_at', 'is', null)
      .is('passcode_set_at', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    passcodeRecord = result1.data
    console.log('Query 1 result:', passcodeRecord)

    // Fallback: try without passcode_set_at check (for old records or if column missing)
    if (!passcodeRecord) {
      const result2 = await supabase
        .from('creator_passcodes')
        .select('*')
        .eq('email', normalizedEmail)
        .eq('otp', otp)
        .eq('is_used', true)
        .not('verified_at', 'is', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      
      passcodeRecord = result2.data
      console.log('Query 2 (fallback) result:', passcodeRecord)
    }

    // Final fallback: just match email + otp + is_used (most lenient)
    if (!passcodeRecord) {
      const result3 = await supabase
        .from('creator_passcodes')
        .select('*')
        .eq('email', normalizedEmail)
        .eq('otp', otp)
        .eq('is_used', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      
      passcodeRecord = result3.data
      console.log('Query 3 (final fallback) result:', passcodeRecord)
    }

    if (!passcodeRecord) {
      return NextResponse.json({ error: 'Invalid or expired OTP session. Please verify your email again.' }, { status: 400 })
    }

    // Hash the 4-digit passcode
    const passcodeHash = await bcrypt.hash(passcode, 10)

    // Update the passcodes record with hashed passcode
    const { error: updateError } = await supabase
      .from('creator_passcodes')
      .update({
        passcode: passcodeHash,
        passcode_set_at: new Date().toISOString(),
      })
      .eq('id', passcodeRecord.id)

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json({ error: 'Failed to save passcode' }, { status: 500 })
    }

    // Get or create creator
    const { data: existingCreator } = await supabase
      .from('creators')
      .select('*')
      .eq('email', normalizedEmail)
      .maybeSingle()

    const username = passcodeRecord.suggested_username || normalizedEmail.split('@')[0]

    if (!existingCreator) {
      const { error: insertError } = await supabase.from('creators').insert({
        email: normalizedEmail,
        username,
        display_name: username,
        passcode_hash: passcodeHash,
        is_verified: true,
      })
      if (insertError) {
        console.error('Creator insert error:', insertError)
        return NextResponse.json({ error: 'Failed to create creator' }, { status: 500 })
      }
    } else {
      const { error: updateCreatorError } = await supabase
        .from('creators')
        .update({ passcode_hash: passcodeHash, is_verified: true })
        .eq('email', normalizedEmail)
      
      if (updateCreatorError) {
        console.error('Creator update error:', updateCreatorError)
      }
    }

    return NextResponse.json({
      success: true,
      username,
      message: 'Passcode set successfully',
    })
  } catch (error: any) {
    console.error('set-passcode error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}