// src/app/api/hooks/[id]/view/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: hookId } = await params
    const supabase = await createClient()

    // Increment view_count by 1
    const { data: hook, error: fetchError } = await supabase
      .from('hooks')
      .select('view_count')
      .eq('id', hookId)
      .single()

    if (fetchError || !hook) {
      return NextResponse.json({ error: 'Hook not found' }, { status: 404 })
    }

    const { error: updateError } = await supabase
      .from('hooks')
      .update({ view_count: (hook.view_count || 0) + 1 })
      .eq('id', hookId) 

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to track view' }, { status: 500 })
  }
}