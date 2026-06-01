// src/app/api/order/get/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')

    if (!orderId) {
        return NextResponse.json({ error: 'No order ID' }, { status: 400 })
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
                detectSessionInUrl: false,
            },
        }
    )

    const { data: order, error } = await supabase
        .from('orders')
        .select('*, products(name, images, stores(name, whatsapp_number, contact_phone))')
        .eq('id', orderId)
        .single()

    if (error || !order) {
        console.error('Supabase error:', error)
        return NextResponse.json({ error: 'Order not found', details: error?.message }, { status: 404 })
    }

    return NextResponse.json({ order })
}