import { createClient } from '@/lib/supabase/server'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, passcode } = await request.json()
    const supabase = await createClient()

    // Fetch creator
    const { data: creator, error } = await supabase
      .from('creators')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (error || !creator || !creator.passcode_hash) {
      return NextResponse.json({ error: 'Creator not found' }, { status: 404 })
    }

    // Compare 4-digit passcode with hash
    const isValid = await bcrypt.compare(passcode, creator.passcode_hash)

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid passcode' }, { status: 401 })
    }

    return NextResponse.json({
      verified: true,
      creator: {
        id: creator.id,
        username: creator.username,
        email: creator.email,
      }
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}