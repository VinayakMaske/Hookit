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
    const status = formData.get('status') as string

    if (!orderId || !status) {
        return NextResponse.redirect(new URL('/seller/orders', request.url))
    }

    // Verify ownership - fetch order with store details
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .select(`
            id,
            store_id,
            buyer_name,
            buyer_phone,
            total_amount,
            stores!inner (
                owner_id,
                whatsapp_number,
                name
            )
        `)
        .eq('id', orderId)
        .single()

    if (orderError || !order) {
        return NextResponse.redirect(new URL('/seller/orders', request.url))
    }

    // Handle both array and object response from Supabase
    const storeData = Array.isArray(order.stores) ? order.stores[0] : order.stores

    if (!storeData || storeData.owner_id !== user.id) {
        return NextResponse.redirect(new URL('/seller/orders', request.url))
    }

    // Update order status
    await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)

    // Send WhatsApp notification to seller if status changed to processing or shipped
    if (status === 'processing' || status === 'shipped') {
        const sellerWhatsapp = storeData.whatsapp_number
        if (sellerWhatsapp) {
            console.log(`WhatsApp notification to seller ${sellerWhatsapp}: Order #${orderId.slice(0, 8)} is now ${status}`)
        }
    }

    return NextResponse.redirect(new URL('/seller/orders', request.url))
}