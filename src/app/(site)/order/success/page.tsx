'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Package, Phone, Clock, ArrowRight, Home, Loader2 } from 'lucide-react'

function OrderSuccessContent() {
    const searchParams = useSearchParams()
    const orderId = searchParams.get('order')
    
    const [order, setOrder] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        console.log('Order ID from URL:', orderId) // DEBUG
        
        if (!orderId) {
            setError('No order ID found in URL')
            setLoading(false)
            return
        }
        fetchOrder()
    }, [orderId])

    const fetchOrder = async () => {
        try {
            const url = `/api/order/get?orderId=${orderId}`
            console.log('Fetching from:', url) // DEBUG
            
            const response = await fetch(url)
            console.log('Response status:', response.status) // DEBUG
            
            const data = await response.json()
            console.log('Response data:', data) // DEBUG

            if (!response.ok) {
                throw new Error(data.error || 'Order not found')
            }

            setOrder(data.order)
        } catch (err: any) {
            console.error('Fetch error:', err) // DEBUG
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
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

    return (
        <div className="min-h-screen bg-neutral-50 py-12">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-neutral-900 mb-2">Order Placed Successfully!</h1>
                    <p className="text-neutral-500">Thank you for your order. The seller will contact you soon.</p>
                </div>

                <Card className="border-0 shadow-sm mb-6">
                    <CardContent className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-neutral-500">Order ID</span>
                            <span className="font-mono text-sm font-medium">#{order.id.slice(0, 12).toUpperCase()}</span>
                        </div>

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
                    </CardContent>
                </Card>

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