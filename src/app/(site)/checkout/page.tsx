'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Loader2, ShoppingBag, ArrowLeft, MapPin, Phone, User, Mail, Package } from 'lucide-react'

function CheckoutContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const productId = searchParams.get('product')

    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [product, setProduct] = useState<any>(null)
    const [quantity, setQuantity] = useState(1)
    const [formData, setFormData] = useState({
        buyerName: '',
        buyerEmail: '',
        buyerPhone: '',
        buyerAddress: '',
    })

    useEffect(() => {
        if (!productId) {
            router.push('/explore')
            return
        }
        fetchProduct()
    }, [productId])

    const fetchProduct = async () => {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('products')
            .select('*, stores(name, whatsapp_number, contact_phone, contact_email, slug)')
            .eq('id', productId)
            .eq('is_active', true)
            .single()

        if (error || !data) {
            router.push('/explore')
            return
        }

        setProduct(data)
        setLoading(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!formData.buyerName.trim() || !formData.buyerPhone.trim()) {
            setError('Name and phone number are required')
            return
        }

        // Phone validation (basic)
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/
        if (!phoneRegex.test(formData.buyerPhone.replace(/\s/g, ''))) {
            setError('Please enter a valid phone number')
            return
        }

        setSubmitting(true)

        try {
            // 1. Create order
            const response = await fetch('/api/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: product.id,
                    storeId: product.store_id,
                    buyerName: formData.buyerName,
                    buyerEmail: formData.buyerEmail,
                    buyerPhone: formData.buyerPhone,
                    buyerAddress: formData.buyerAddress,
                    quantity: quantity,
                    totalAmount: product.price * quantity,
                }),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || 'Failed to create order')
            }

            // 2. Send email notification to seller + buyer
            const notifyResponse = await fetch('/api/notify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId: result.orderId,
                    sellerEmail: product.stores?.contact_email,
                    sellerWhatsapp: product.stores?.whatsapp_number,
                    sellerPhone: product.stores?.contact_phone,
                    sellerName: product.stores?.name,
                    buyerName: formData.buyerName,
                    buyerPhone: formData.buyerPhone,
                    buyerEmail: formData.buyerEmail,
                    buyerAddress: formData.buyerAddress,
                    productName: product.name,
                    quantity: quantity,
                    totalAmount: product.price * quantity,
                }),
            })

            const notifyData = await notifyResponse.json()
            console.log('Notification result:', notifyData)

            // 3. Redirect to success page
            window.location.href = `/order/success?order=${result.orderId}`
        } catch (err: any) {
            setError(err.message || 'Something went wrong')
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
            </div>
        )
    }

    const totalPrice = product.price * quantity

    return (
        <div className="min-h-screen bg-neutral-50 pt-20 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Product
                </button>

                <h1 className="text-3xl font-bold text-neutral-900 mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Order Form */}
                    <div className="lg:col-span-3 space-y-6">
                        <Card className="border-0 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Your Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="buyerName" className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-neutral-400" />
                                            Full Name *
                                        </Label>
                                        <Input
                                            id="buyerName"
                                            placeholder="Enter your full name"
                                            value={formData.buyerName}
                                            onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                                            required
                                            className="h-12"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="buyerPhone" className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-neutral-400" />
                                            Phone Number *
                                        </Label>
                                        <Input
                                            id="buyerPhone"
                                            type="tel"
                                            placeholder="+91 98765 43210"
                                            value={formData.buyerPhone}
                                            onChange={(e) => setFormData({ ...formData, buyerPhone: e.target.value })}
                                            required
                                            className="h-12"
                                        />
                                        <p className="text-xs text-neutral-500">
                                            Seller will contact you on WhatsApp for order updates
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="buyerEmail" className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-neutral-400" />
                                            Email (optional)
                                        </Label>
                                        <Input
                                            id="buyerEmail"
                                            type="email"
                                            placeholder="your@email.com"
                                            value={formData.buyerEmail}
                                            onChange={(e) => setFormData({ ...formData, buyerEmail: e.target.value })}
                                            className="h-12"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="buyerAddress" className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-neutral-400" />
                                            Delivery Address *
                                        </Label>
                                        <Textarea
                                            id="buyerAddress"
                                            placeholder="Full address with pincode..."
                                            value={formData.buyerAddress}
                                            onChange={(e) => setFormData({ ...formData, buyerAddress: e.target.value })}
                                            required
                                            rows={4}
                                        />
                                    </div>

                                    {error && (
                                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                            <p className="text-sm text-red-600">{error}</p>
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full h-14 text-lg bg-neutral-900 hover:bg-neutral-800"
                                        disabled={submitting}
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                Placing Order...
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingBag className="w-5 h-5 mr-2" />
                                                Place Order — Cash on Delivery
                                            </>
                                        )}
                                    </Button>

                                    <p className="text-xs text-center text-neutral-500">
                                        No account required. Your phone number is only shared with the seller for delivery.
                                    </p>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-2">
                        <Card className="border-0 shadow-sm sticky top-24">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="w-5 h-5" />
                                    Order Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Product */}
                                <div className="flex gap-4">
                                    <div className="w-20 h-20 bg-neutral-100 rounded-lg overflow-hidden shrink-0">
                                        {product.images?.[0] ? (
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ShoppingBag className="w-6 h-6 text-neutral-300" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-neutral-900 line-clamp-2">{product.name}</h3>
                                        <p className="text-sm text-neutral-500">{product.stores?.name}</p>
                                    </div>
                                </div>

                                <Separator />

                                {/* Quantity */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-neutral-600">Quantity</span>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="w-8 text-center font-medium">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <Separator />

                                {/* Price Breakdown */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-600">Price</span>
                                        <span>₹{product.price} × {quantity}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-600">Delivery</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-600">Platform Fee</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-neutral-900">Total</span>
                                    <span className="text-2xl font-bold text-neutral-900">₹{totalPrice}</span>
                                </div>

                                <div className="p-3 bg-green-50 rounded-lg">
                                    <p className="text-sm text-green-700 text-center font-medium">
                                        Cash on Delivery
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    )
}