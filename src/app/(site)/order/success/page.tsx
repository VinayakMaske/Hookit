// src/app/(site)/order/success/page.tsx
'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Package, Phone, Clock, ArrowRight, Home, Loader2, XCircle, Star, Shield } from 'lucide-react'
import GuestReviewForm from '@/components/guest-review-form'

function OrderSuccessContent() {
    const searchParams = useSearchParams()
    const orderId = searchParams.get('order')
    
    const [order, setOrder] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!orderId) {
            setError('No order ID found in URL')
            setLoading(false)
            return
        }
        fetchOrder()
    }, [orderId])

    const fetchOrder = async () => {
        try {
            const orderResponse = await fetch(`/api/order/get?orderId=${orderId}`)
            const orderData = await orderResponse.json()

            if (!orderResponse.ok) {
                throw new Error(orderData.error || 'Order not found')
            }

            setOrder(orderData.order)
        } catch (err: any) {
            console.error('Error:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-neutral-400 mx-auto mb-4" />
                    <p className="text-neutral-500">Loading your order...</p>
                </div>
            </div>
        )
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-neutral-500 mb-4">{error || 'Order not found'}</p>
                    <p className="text-sm text-neutral-400 mb-4">Order ID: {orderId || 'none'}</p>
                    <Link href="/explore">
                        <Button variant="outline">Continue Shopping</Button>
                    </Link>
                </div>
            </div>
        )
    }

    const isPaid = order.payment_status === 'paid'

    return (
        <div className="min-h-screen bg-neutral-50 py-12">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                        {isPaid ? 'Payment Successful!' : 'Order Placed!'}
                    </h1>
                    <p className="text-neutral-500">
                        {isPaid 
                            ? 'Thank you for your payment. The seller will contact you soon.' 
                            : 'Your order is confirmed. Please complete the payment.'}
                    </p>
                </div>

                <Card className="border-0 shadow-sm mb-6">
                    <CardContent className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-neutral-500">Order ID</span>
                            <span className="font-mono text-sm font-medium">#{order.id.slice(0, 12).toUpperCase()}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-neutral-500">Payment Status</span>
                            <span className={`text-sm font-medium ${isPaid ? 'text-green-600' : 'text-amber-600'}`}>
                                {isPaid ? '✅ Paid via Razorpay' : '⏳ Pending'}
                            </span>
                        </div>

                        {order.razorpay_payment_id && (
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-neutral-500">Payment ID</span>
                                <span className="font-mono text-xs">{order.razorpay_payment_id}</span>
                            </div>
                        )}

                        <div className="flex gap-4">
                            <div className="w-24 h-24 bg-neutral-100 rounded-lg overflow-hidden shrink-0">
                                {order.products?.images?.[0] ? (
                                    <img src={order.products.images[0]} alt={order.products.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center"><Package className="w-8 h-8 text-neutral-300" /></div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-neutral-900">{order.products?.name}</h3>
                                <p className="text-sm text-neutral-500">{order.products?.stores?.name}</p>
                                <p className="text-sm text-neutral-500 mt-1">Qty: {order.quantity}</p>
                                <p className="font-bold text-neutral-900 mt-2">₹{order.total_amount}</p>
                            </div>
                        </div>

                        <div className="p-4 bg-neutral-50 rounded-lg space-y-3">
                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-neutral-400" />
                                <div>
                                    <p className="text-sm font-medium text-neutral-900">Order Status</p>
                                    <p className="text-sm text-neutral-500 capitalize">{order.status}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-neutral-400" />
                                <div>
                                    <p className="text-sm font-medium text-neutral-900">Seller Contact</p>
                                    <p className="text-sm text-neutral-500">{order.products?.stores?.whatsapp_number || 'Not available'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Protection Badge */}
                        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                            <Shield className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-medium text-green-800">Protected by Hookit Buyer Protection</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Guest Review Form */}
                {order.products?.id && (
                    <div className="mb-6">
                        <GuestReviewForm 
                            productId={order.products.id}
                            orderId={order.id}
                            buyerName={order.buyer_name}
                        />
                    </div>
                )}

                {order.products?.stores?.whatsapp_number && (
                    <a href={`https://wa.me/${order.products.stores.whatsapp_number.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="block mb-4">
                        <Button className="w-full h-14 text-lg gap-2 bg-green-600 hover:bg-green-700">
                            <Phone className="w-5 h-5" /> Chat with Seller on WhatsApp
                        </Button>
                    </a>
                )}

                <div className="flex gap-3">
                    <Link href="/explore" className="flex-1">
                        <Button variant="outline" className="w-full h-12 gap-2"><ArrowRight className="w-4 h-4" /> Continue Shopping</Button>
                    </Link>
                    <Link href="/" className="flex-1">
                        <Button variant="outline" className="w-full h-12 gap-2"><Home className="w-4 h-4" /> Back to Home</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
            </div>
        }>
            <OrderSuccessContent />
        </Suspense>
    )
}