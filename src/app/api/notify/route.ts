// src/app/api/notify/route.ts
import { NextResponse } from 'next/server'
import { sendOrderNotification, sendBuyerConfirmation } from '@/lib/email'

export async function POST(request: Request) {
    try {
        const {
            orderId,
            sellerEmail,
            sellerWhatsapp,
            sellerPhone,
            sellerName,
            buyerName,
            buyerPhone,
            buyerEmail,
            buyerAddress,
            productName,
            quantity,
            totalAmount,
        } = await request.json()

        const results: any = {}

        // 1. Send email to seller
        if (sellerEmail) {
            try {
                await sendOrderNotification(sellerEmail, {
                    orderId,
                    productName,
                    quantity,
                    totalAmount,
                    buyerName,
                    buyerPhone,
                    buyerEmail,
                    buyerAddress,
                })
                results.sellerEmail = 'sent'
            } catch (err: any) {
                console.error('Seller email failed:', err)
                results.sellerEmail = 'failed: ' + err.message
            }
        } else {
            results.sellerEmail = 'skipped: no email'
        }

        // 2. Send email to buyer (if email provided) — with e-invoice
        if (buyerEmail) {
            try {
                await sendBuyerConfirmation(buyerEmail, {
                    orderId,
                    productName,
                    quantity,
                    totalAmount,
                    sellerName: sellerName || 'Unknown Store',
                    sellerPhone: sellerPhone || 'Not available',
                    sellerWhatsapp: sellerWhatsapp || '',
                    buyerName: buyerName,
                    buyerAddress: buyerAddress,
                    buyerPhone: buyerPhone,
                })
                results.buyerEmail = 'sent'
            } catch (err: any) {
                console.error('Buyer email failed:', err)
                results.buyerEmail = 'failed: ' + err.message
            }
        } else {
            results.buyerEmail = 'skipped: no email'
        }

        // 3. Generate WhatsApp link
        const phone = sellerWhatsapp || sellerPhone
        let waLink = null
        if (phone) {
            const cleanPhone = phone.replace(/[^0-9]/g, '')
            const formattedPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`
            const message = `Hi, you have a new order #${orderId.slice(0, 8)} for ${productName} from ${buyerName}. Amount: ₹${totalAmount}`
            waLink = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`
        }

        return NextResponse.json({
            success: true,
            results: results,
            waLink: waLink,
        })

    } catch (error: any) {
        console.error('Notification error:', error)
        return NextResponse.json(
            { error: 'Failed to send notification: ' + error.message },
            { status: 500 }
        )
    }
}