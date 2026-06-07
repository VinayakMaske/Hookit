// src/app/api/hooks/[id]/comments/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { content, author_name, author_email } = body

    if (!content?.trim() || !author_name?.trim()) {
      return NextResponse.json({ error: 'Content and name required' }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('hook_comments')
      .insert({
        hook_id: id,
        content: content.trim(),
        author_name: author_name.trim(),
        author_email: author_email || 'anonymous@hookit.online',
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}