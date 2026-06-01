import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    const formData = await request.formData()
    const orderId = formData.get('orderId') as string
    const sellerId = formData.get('sellerId') as string
    const storeId = formData.get('storeId') as string
    const amount = formData.get('amount') as string
    const utrNumber = formData.get('utrNumber') as string

    if (!orderId || !sellerId || !storeId || !amount || !utrNumber) {
        return NextResponse.redirect(new URL('/admin/payouts?error=missing_fields', request.url))
    }

    // Verify the order exists and is completed
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('id, status, payment_status')
        .eq('id', orderId)
        .single()

    if (orderError || !order) {
        return NextResponse.redirect(new URL('/admin/payouts?error=order_not_found', request.url))
    }

    if (order.status !== 'completed' || order.payment_status !== 'paid') {
        return NextResponse.redirect(new URL('/admin/payouts?error=order_not_eligible', request.url))
    }

    // Check if payout already exists
    const { data: existingPayout } = await supabase
        .from('payouts')
        .select('id')
        .eq('order_id', orderId)
        .single()

    if (existingPayout) {
        return NextResponse.redirect(new URL('/admin/payouts?error=already_paid', request.url))
    }

    // Create payout record
    const { error: insertError } = await supabase
        .from('payouts')
        .insert({
            order_id: orderId,
            seller_id: sellerId,
            store_id: storeId,
            amount: parseFloat(amount),
            status: 'completed',
            utr_number: utrNumber,
        })

    if (insertError) {
        console.error('Payout creation error:', insertError)
        return NextResponse.redirect(new URL('/admin/payouts?error=' + encodeURIComponent(insertError.message), request.url))
    }

    return NextResponse.redirect(new URL('/admin/payouts?success=payout_processed', request.url))
}