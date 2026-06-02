// src/app/api/orders/send-status-email/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { sendStatusUpdateEmail } from '@/lib/email'

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

        // Fetch order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('id, store_id, buyer_name, buyer_email, buyer_phone, total_amount, quantity, status, product_id')
            .eq('id', orderId)
            .single()

        if (orderError || !order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }

        // Verify ownership via store
        const { data: store } = await supabase
            .from('stores')
            .select('owner_id, name, whatsapp_number, contact_phone')
            .eq('id', order.store_id)
            .single()

        if (!store || store.owner_id !== user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        // Check if buyer has email
        if (!order.buyer_email) {
            return NextResponse.json({ error: 'Buyer has no email address' }, { status: 400 })
        }

        // Get product name
        const { data: product } = await supabase
            .from('products')
            .select('name')
            .eq('id', order.product_id)
            .single()

        // Update order status
        await supabase
            .from('orders')
            .update({ status })
            .eq('id', orderId)

        // Send status email
        const sellerPhone = store.whatsapp_number || store.contact_phone || ''

        await sendStatusUpdateEmail(order.buyer_email, {
            orderId: order.id,
            productName: product?.name || 'Unknown Product',
            quantity: order.quantity,
            totalAmount: order.total_amount,
            status: status,
            sellerName: store.name,
            sellerPhone: sellerPhone,
            buyerName: order.buyer_name
        })

        return NextResponse.json({
            success: true,
            message: `Status email sent to ${order.buyer_email}`
        })

    } catch (error: any) {
        console.error('Send status email error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to send status email' },
            { status: 500 }
        )
    }
}