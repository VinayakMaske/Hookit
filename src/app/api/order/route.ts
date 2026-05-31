import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const {
            productId,
            storeId,
            buyerName,
            buyerEmail,
            buyerPhone,
            buyerAddress,
            quantity,
            totalAmount,
        } = body

        // Validation
        if (!productId || !storeId || !buyerName || !buyerPhone || !buyerAddress) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Use service role client (bypasses RLS)
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        )

        // Verify product exists and is active
        const { data: product } = await supabase
            .from('products')
            .select('id, stock_quantity, is_active')
            .eq('id', productId)
            .eq('is_active', true)
            .single()

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found or inactive' },
                { status: 404 }
            )
        }

        // Check stock
        if (product.stock_quantity !== null && product.stock_quantity < quantity) {
            return NextResponse.json(
                { error: 'Insufficient stock' },
                { status: 400 }
            )
        }

        // Create order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                product_id: productId,
                store_id: storeId,
                buyer_name: buyerName,
                buyer_email: buyerEmail || null,
                buyer_phone: buyerPhone,
                buyer_address: buyerAddress,
                quantity: quantity,
                total_amount: totalAmount,
                status: 'pending',
                payment_status: 'pending',
                payment_method: 'cod',
            })
            .select()
            .single()

        if (orderError) {
            console.error('Order creation error:', orderError)
            return NextResponse.json(
                { error: 'Failed to create order' },
                { status: 500 }
            )
        }

        // Decrease stock
        if (product.stock_quantity !== null) {
            await supabase
                .from('products')
                .update({ stock_quantity: product.stock_quantity - quantity })
                .eq('id', productId)
        }

        return NextResponse.json({
            success: true,
            orderId: order.id,
        })

    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}