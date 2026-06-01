// src/hooks/useRazorpay.ts
'use client'

import { useCallback } from 'react'

interface RazorpayOptions {
    amount: number // in paise
    currency?: string
    name: string
    description?: string
    orderId: string
    prefill?: {
        name?: string
        email?: string
        contact?: string
    }
    notes?: Record<string, string>
    onSuccess?: (response: any) => void
    onError?: (error: any) => void
    onDismiss?: () => void
}

declare global {
    interface Window {
        Razorpay: any
    }
}

export function useRazorpay() {
    const loadScript = useCallback(() => {
        return new Promise<void>((resolve, reject) => {
            if (window.Razorpay) {
                resolve()
                return
            }

            const script = document.createElement('script')
            script.src = 'https://checkout.razorpay.com/v1/checkout.js'
            script.onload = () => resolve()
            script.onerror = () => reject(new Error('Failed to load Razorpay script'))
            document.body.appendChild(script)
        })
    }, [])

    const openPayment = useCallback(async (options: RazorpayOptions) => {
        try {
            await loadScript()

            const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID

            if (!keyId) {
                throw new Error('Razorpay key ID not configured')
            }

            const razorpayOptions = {
                key: keyId,
                amount: options.amount,
                currency: options.currency || 'INR',
                name: options.name,
                description: options.description || '',
                order_id: options.orderId,
                prefill: options.prefill || {},
                notes: options.notes || {},
                theme: {
                    color: '#7C3AED', // Hookit purple
                },
                handler: function (response: any) {
                    options.onSuccess?.(response)
                },
                modal: {
                    ondismiss: function () {
                        options.onDismiss?.()
                    },
                },
            }

            const rzp = new window.Razorpay(razorpayOptions)

            rzp.on('payment.failed', function (response: any) {
                options.onError?.(response.error)
            })

            rzp.open()

        } catch (error: any) {
            options.onError?.(error)
        }
    }, [loadScript])

    return { openPayment }
}