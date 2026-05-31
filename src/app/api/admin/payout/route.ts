import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const ADMIN_EMAILS = ['your-email@example.com'] // Same as middleware

export async function POST(request: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const formData = await request.formData()
    const orderId = formData.get('orderId') as string
    const sellerId = formData.get('sellerId') as string
    const amount = parseFloat(formData.get('amount') as string)
    const utrNumber = formData.get('utrNumber') as string

    if (!orderId || !sellerId || !amount || !utrNumber) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // Create payout record
    const { error } = await supabase
        .from('payouts')
        .insert({
            seller_id: sellerId,
            order_id: orderId,
            amount: amount,
            status: 'completed',
            utr_number: utrNumber,
            paid_at: new Date().toISOString(),
        })

    if (error) {
        console.error('Payout error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.redirect(new URL('/admin/payouts', request.url))
}