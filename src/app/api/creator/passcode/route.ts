import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendCreatorPasscode } from '@/lib/email'

export async function POST(req: Request) {
  const { email } = await req.json()
  if (!email?.includes('@')) return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  
  const supabase = await createClient()
  const passcode = Math.floor(100000 + Math.random() * 900000).toString()
  
  await supabase.from('creator_passcodes').insert({
    email, passcode, expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  })
  
  await sendCreatorPasscode(email, passcode)
  return NextResponse.json({ success: true })
}