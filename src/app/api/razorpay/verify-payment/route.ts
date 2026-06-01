// src/app/api/razorpay/verify-payment/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = body

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json(
                { error: 'Missing required payment verification fields' },
                { status: 400 }
            )
        }

        const secret = process.env.RAZORPAY_KEY_SECRET!
        const generatedSignature = crypto
            .createHmac('sha256', secret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex')

        const isValid = generatedSignature === razorpay_signature

        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid payment signature', success: false },
                { status: 400 }
            )
        }

        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
                detectSessionInUrl: false,
            },
        })

        const { error: updateError } = await supabase
            .from('orders')
            .update({
                status: 'processing',
                payment_status: 'paid',
                payment_method: 'razorpay',
                razorpay_order_id: razorpay_order_id,
                razorpay_payment_id: razorpay_payment_id,
            })
            .eq('id', orderId)

        if (updateError) {
            console.error('Database update error:', updateError)
        }

        return NextResponse.json({
            success: true,
            message: 'Payment verified successfully',
            orderId: orderId,
            razorpay_order_id,
            razorpay_payment_id,
        })

    } catch (error: any) {
        console.error('Payment verification error:', error)
        return NextResponse.json(
            { error: error.message || 'Payment verification failed' },
            { status: 500 }
        )
    }
}