// src/app/api/hooks/[id]/click/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const hookId = params.id
    const supabase = await createClient()

    // Increment clicks by 1
    const { data: hook, error: fetchError } = await supabase
      .from('hooks')
      .select('clicks')
      .eq('id', hookId)
      .single()

    if (fetchError || !hook) {
      return NextResponse.json({ error: 'Hook not found' }, { status: 404 })
    }

    const { error: updateError } = await supabase
      .from('hooks')
      .update({ clicks: (hook.clicks || 0) + 1 })
      .eq('id', hookId)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to track click' }, { status: 500 })
  }
}