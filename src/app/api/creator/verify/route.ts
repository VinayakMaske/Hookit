import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const { email, passcode } = await req.json()
  const supabase = await createClient()
  
  const { data: valid } = await supabase
    .from('creator_passcodes')
    .select('*')
    .eq('email', email)
    .eq('passcode', passcode)
    .eq('is_used', false)
    .gt('expires_at', new Date().toISOString())
    .single()
  
  if (!valid) return NextResponse.json({ error: 'Invalid passcode' }, { status: 400 })
  
  await supabase.from('creator_passcodes').update({ is_used: true }).eq('id', valid.id)
  
  let { data: creator } = await supabase.from('creators').select('*').eq('email', email).single()
  
  if (!creator) {
    const { data: newCreator } = await supabase.from('creators').insert({ email, is_verified: true }).select().single()
    creator = newCreator
  } else {
    await supabase.from('creators').update({ 
      passcode, 
      passcode_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() 
    }).eq('id', creator.id)
  }
  
  return NextResponse.json({ success: true, creator })
}