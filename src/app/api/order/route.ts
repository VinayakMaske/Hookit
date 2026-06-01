// src/app/api/order/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        console.log('=== ORDER API CALLED ===')
        console.log('Request body:', JSON.stringify(body, null, 2))

        const {
            productId,
            storeId,
            buyerName,
            buyerPhone,
            addressLine1,
            city,
            state,
            pincode,
            quantity,
            totalAmount,
        } = body

        console.log('productId:', productId)
        console.log('storeId:', storeId)

        if (!productId || !storeId || !buyerName || !buyerPhone || !addressLine1 || !city || !state || !pincode) {
            console.log('Missing fields:', { productId, storeId, buyerName, buyerPhone, addressLine1, city, state, pincode })
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

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

        // Try fetching without is_active filter first to debug
        console.log('Fetching product with ID:', productId)
        
        const { data: product, error: productError } = await supabase
            .from('products')
            .select('id, stock_quantity, is_active, store_id, name')
            .eq('id', productId)
            .single()

        console.log('Product result:', product)
        console.log('Product error:', productError)

        if (productError) {
            console.error('Product fetch error:', productError)
            return NextResponse.json(
                { error: 'Database error: ' + productError.message },
                { status: 500 }
            )
        }

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found. ID: ' + productId },
                { status: 404 }
            )
        }

        if (!product.is_active) {
            return NextResponse.json(
                { error: 'Product is inactive' },
                { status: 400 }
            )
        }

        // Rest of your code...
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                product_id: productId,
                store_id: storeId,
                buyer_name: buyerName,
                buyer_email: body.buyerEmail || null,
                buyer_phone: buyerPhone,
                buyer_address: body.buyerAddress || null,
                address_line1: addressLine1,
                address_line2: body.addressLine2 || null,
                city: city,
                state: state,
                pincode: pincode,
                country: body.country || 'India',
                quantity: quantity,
                total_amount: totalAmount,
                delivery_fee: body.deliveryFee || 0,
                platform_fee: body.platformFee || 0,
                additional_fee: body.additionalFee || 0,
                gst_amount: body.gstAmount || 0,
                gst_type: body.gstType || 'none',
                gst_percentage: body.gstPercentage || 0,
                subtotal: body.subtotal || totalAmount,
                status: 'pending',
                payment_status: 'pending',
                payment_method: 'razorpay',
            })
            .select()
            .single()

        if (orderError) {
            console.error('Order creation error:', orderError)
            return NextResponse.json(
                { error: 'Failed to create order: ' + orderError.message },
                { status: 500 }
            )
        }

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

    } catch (error: any) {
        console.error('API error:', error)
        return NextResponse.json(
            { error: 'Internal server error: ' + error.message },
            { status: 500 }
        )
    }
}