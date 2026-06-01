// src/app/api/razorpay/create-order/route.ts
import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { amount, currency = 'INR', receipt, notes } = body

        // Validate amount (minimum 100 paise = ₹1)
        if (!amount || amount < 100) {
            return NextResponse.json(
                { error: 'Amount must be at least 100 paise (₹1)' },
                { status: 400 }
            )
        }

        const options = {
            amount: amount,
            currency: currency,
            receipt: receipt || `receipt_${Date.now()}`,
            notes: notes || {},
        }

        const order = await razorpay.orders.create(options)

        return NextResponse.json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
        })

    } catch (error: any) {
        console.error('Razorpay order creation error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to create order' },
            { status: 500 }
        )
    }
}