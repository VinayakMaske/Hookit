// src/app/api/orders/update-status/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { orderId, status } = body

        if (!orderId || !status) {
            return NextResponse.json({ error: 'Missing orderId or status' }, { status: 400 })
        }

        // Verify ownership - get store first
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('id, store_id, status')
            .eq('id', orderId)
            .single()

        if (orderError || !order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }

        // Get store to verify owner
        const { data: store } = await supabase
            .from('stores')
            .select('owner_id')
            .eq('id', order.store_id)
            .single()

        if (!store || store.owner_id !== user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        // Update order status - trigger will auto-create payout if completed
        const { error: updateError } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', orderId)

        if (updateError) {
            return NextResponse.json({ error: updateError.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, message: 'Status updated' })

    } catch (error: any) {
        console.error('Update status error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to update status' },
            { status: 500 }
        )
    }
}