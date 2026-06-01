// src/app/api/order/route.ts
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
            addressLine1,
            addressLine2,
            city,
            state,
            pincode,
            country,
            quantity,
            totalAmount,
            deliveryFee,
            platformFee,
            additionalFee,
            gstAmount,
            gstType,
            gstPercentage,
            subtotal,
        } = body

        if (!productId || !storeId || !buyerName || !buyerPhone || !addressLine1 || !city || !state || !pincode) {
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

        // FIX: Better error handling - separate "not found" from "inactive"
        const { data: product, error: productError } = await supabase
            .from('products')
            .select('id, stock_quantity, is_active, store_id')
            .eq('id', productId)
            .single()

        if (productError || !product) {
            console.error('Product fetch error:', productError)
            return NextResponse.json(
                { error: 'Product not found in database' },
                { status: 404 }
            )
        }

        if (!product.is_active) {
            return NextResponse.json(
                { error: 'Product is currently inactive' },
                { status: 400 }
            )
        }

        // FIX: Verify store_id matches
        if (product.store_id !== storeId) {
            return NextResponse.json(
                { error: 'Store mismatch' },
                { status: 400 }
            )
        }

        if (product.stock_quantity !== null && product.stock_quantity < quantity) {
            return NextResponse.json(
                { error: 'Insufficient stock' },
                { status: 400 }
            )
        }

        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                product_id: productId,
                store_id: storeId,
                buyer_name: buyerName,
                buyer_email: buyerEmail || null,
                buyer_phone: buyerPhone,
                buyer_address: buyerAddress || null,
                address_line1: addressLine1,
                address_line2: addressLine2 || null,
                city: city,
                state: state,
                pincode: pincode,
                country: country || 'India',
                quantity: quantity,
                total_amount: totalAmount,
                delivery_fee: deliveryFee || 0,
                platform_fee: platformFee || 0,
                additional_fee: additionalFee || 0,
                gst_amount: gstAmount || 0,
                gst_type: gstType || 'none',
                gst_percentage: gstPercentage || 0,
                subtotal: subtotal || totalAmount,
                status: 'pending',
                payment_status: 'pending',
                payment_method: 'razorpay', // <-- FIXED: was 'cod'
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