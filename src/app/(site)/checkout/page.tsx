// src/app/(site)/checkout/page.tsx
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRazorpay } from '@/hooks/useRazorpay'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Loader2, ShoppingBag, ArrowLeft, MapPin, Phone, User, Mail, Package, Truck, Shield, Plus, Receipt, Percent, CreditCard, Home, Building, Landmark } from 'lucide-react'

function CheckoutContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const productId = searchParams.get('product')
    const { openPayment } = useRazorpay()

    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [product, setProduct] = useState<any>(null)
    const [quantity, setQuantity] = useState(1)
    const [formData, setFormData] = useState({
        buyerName: '',
        buyerEmail: '',
        buyerPhone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
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

    const calculateBreakdown = () => {
        if (!product) return null

        const basePrice = product.price || 0
        const qty = quantity
        const itemTotal = basePrice * qty

        const deliveryFee = (product.delivery_fee || 0) * qty
        const platformFee = (product.platform_fee || 0) * qty
        const additionalFee = (product.additional_fee || 0) * qty

        let subtotal = itemTotal
        let gstAmount = 0
        let total = 0

        if (product.gst_type === 'inclusive') {
            gstAmount = itemTotal - (itemTotal / (1 + (product.gst_percentage || 0) / 100))
            subtotal = itemTotal - gstAmount
            total = itemTotal + deliveryFee + platformFee + additionalFee
        } else if (product.gst_type === 'exclusive') {
            gstAmount = itemTotal * ((product.gst_percentage || 0) / 100)
            subtotal = itemTotal
            total = itemTotal + gstAmount + deliveryFee + platformFee + additionalFee
        } else {
            subtotal = itemTotal
            total = itemTotal + deliveryFee + platformFee + additionalFee
        }

        return {
            itemTotal,
            subtotal: Math.round(subtotal * 100) / 100,
            gstAmount: Math.round(gstAmount * 100) / 100,
            deliveryFee: Math.round(deliveryFee * 100) / 100,
            platformFee: Math.round(platformFee * 100) / 100,
            additionalFee: Math.round(additionalFee * 100) / 100,
            total: Math.round(total * 100) / 100,
            totalInPaise: Math.round(total * 100),
            gstType: product.gst_type,
            gstPercentage: product.gst_percentage,
            hasDeliveryFee: product.delivery_fee > 0,
            hasPlatformFee: product.platform_fee > 0,
            hasAdditionalFee: product.additional_fee > 0,
            additionalFeeName: product.additional_fee_name || 'Additional Fee',
        }
    }

    const handleRazorpayPayment = async () => {
        setError('')

        // Validation
        if (!formData.buyerName.trim() || !formData.buyerPhone.trim()) {
            setError('Name and phone number are required')
            return
        }

        if (!formData.addressLine1.trim() || !formData.city.trim() || !formData.state.trim() || !formData.pincode.trim()) {
            setError('Please fill in all required address fields')
            return
        }

        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/
        if (!phoneRegex.test(formData.buyerPhone.replace(/\s/g, ''))) {
            setError('Please enter a valid phone number')
            return
        }

        const pincodeRegex = /^[0-9]{6}$/
        if (!pincodeRegex.test(formData.pincode.replace(/\s/g, ''))) {
            setError('Please enter a valid 6-digit pincode')
            return
        }

        setSubmitting(true)

        try {
            const breakdown = calculateBreakdown()
            if (!breakdown) throw new Error('Could not calculate order total')

            // Step 1: Create order in your database first
            const fullAddress = [
                formData.addressLine1,
                formData.addressLine2,
                formData.city,
                formData.state,
                formData.pincode,
                formData.country,
            ].filter(Boolean).join(', ')

            const orderResponse = await fetch('/api/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: product.id,
                    storeId: product.store_id,
                    buyerName: formData.buyerName,
                    buyerEmail: formData.buyerEmail,
                    buyerPhone: formData.buyerPhone,
                    buyerAddress: fullAddress,
                    addressLine1: formData.addressLine1,
                    addressLine2: formData.addressLine2 || null,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode,
                    country: formData.country,
                    quantity: quantity,
                    totalAmount: breakdown.total,
                    deliveryFee: breakdown.deliveryFee,
                    platformFee: breakdown.platformFee,
                    additionalFee: breakdown.additionalFee,
                    gstAmount: breakdown.gstAmount,
                    gstType: breakdown.gstType,
                    gstPercentage: breakdown.gstPercentage,
                    subtotal: breakdown.subtotal,
                }),
            })

            const orderResult = await orderResponse.json()

            if (!orderResponse.ok) {
                throw new Error(orderResult.error || 'Failed to create order')
            }

            // Step 2: Create Razorpay order
            const razorpayOrderResponse = await fetch('/api/razorpay/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: breakdown.totalInPaise,
                    currency: 'INR',
                    receipt: orderResult.orderId,
                    notes: {
                        order_id: orderResult.orderId,
                        product_name: product.name,
                        store_name: product.stores?.name,
                    },
                }),
            })

            const razorpayOrder = await razorpayOrderResponse.json()

            if (!razorpayOrderResponse.ok) {
                throw new Error(razorpayOrder.error || 'Failed to create payment order')
            }

            // Step 3: Open Razorpay checkout
            openPayment({
                amount: breakdown.totalInPaise,
                currency: 'INR',
                name: 'Hookit',
                description: `${product.name} × ${quantity}`,
                orderId: razorpayOrder.orderId,
                prefill: {
                    name: formData.buyerName,
                    email: formData.buyerEmail || undefined,
                    contact: formData.buyerPhone,
                },
                notes: {
                    hookit_order_id: orderResult.orderId,
                },
                onSuccess: async (response: any) => {
                    // Step 4: Verify payment
                    try {
                        const verifyResponse = await fetch('/api/razorpay/verify-payment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                orderId: orderResult.orderId,
                            }),
                        })

                        const verifyData = await verifyResponse.json()

                        if (!verifyResponse.ok || !verifyData.success) {
                            throw new Error(verifyData.error || 'Payment verification failed')
                        }

                        // Send notifications
                        await fetch('/api/notify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                orderId: orderResult.orderId,
                                sellerEmail: product.stores?.contact_email,
                                sellerWhatsapp: product.stores?.whatsapp_number,
                                sellerPhone: product.stores?.contact_phone,
                                sellerName: product.stores?.name,
                                buyerName: formData.buyerName,
                                buyerPhone: formData.buyerPhone,
                                buyerEmail: formData.buyerEmail,
                                buyerAddress: fullAddress,
                                productName: product.name,
                                quantity: quantity,
                                totalAmount: breakdown.total,
                            }),
                        })

                        window.location.href = `/order/success?order=${orderResult.orderId}`

                    } catch (err: any) {
                        setError(err.message || 'Payment verification failed')
                        setSubmitting(false)
                    }
                },
                onError: (error: any) => {
                    setError(error.description || error.message || 'Payment failed')
                    setSubmitting(false)
                },
                onDismiss: () => {
                    setSubmitting(false)
                },
            })

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

    const breakdown = calculateBreakdown()

    return (
        <div className="min-h-screen bg-neutral-50 pt-20 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                                <div className="space-y-5">
                                    {/* Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="buyerName" className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-neutral-400" />
                                            Full Name *
                                        </Label>
                                        <Input
                                            id="buyerName"
                                            placeholder="Enter your full name"
                                            value={formData.buyerName}
                                            required
                                            onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                                            className="h-12"
                                        />
                                    </div>

                                    {/* Phone */}
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
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <Label htmlFor="buyerEmail" className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-neutral-400" />
                                            Email *
                                        </Label>
                                        <Input
                                            id="buyerEmail"
                                            type="email"
                                            placeholder="your@email.com"
                                            value={formData.buyerEmail}
                                            onChange={(e) => setFormData({ ...formData, buyerEmail: e.target.value })}
                                            required
                                            className="h-12"
                                        />
                                    </div>

                                    {/* Delivery Address Section */}
                                    <div className="space-y-4">
                                        <Label className="flex items-center gap-2 text-base font-medium">
                                            <MapPin className="w-4 h-4 text-neutral-400" />
                                            Delivery Address *
                                        </Label>

                                        {/* Address Line 1 */}
                                        <div className="space-y-2">
                                            <Label htmlFor="addressLine1" className="text-sm text-neutral-600">
                                                <Home className="w-3.5 h-3.5 inline mr-1" />
                                                Flat / House No. / Building *
                                            </Label>
                                            <Input
                                                id="addressLine1"
                                                placeholder="e.g., 12B, Sunshine Apartments"
                                                value={formData.addressLine1}
                                                onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                                                className="h-12"
                                                required
                                            />
                                        </div>

                                        {/* Address Line 2 */}
                                        <div className="space-y-2">
                                            <Label htmlFor="addressLine2" className="text-sm text-neutral-600">
                                                <Building className="w-3.5 h-3.5 inline mr-1" />
                                                Street / Area / Landmark (optional)
                                            </Label>
                                            <Input
                                                id="addressLine2"
                                                placeholder="e.g., Near City Mall, MG Road"
                                                value={formData.addressLine2}
                                                onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                                                className="h-12"
                                            />
                                        </div>

                                        {/* City & State */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="city" className="text-sm text-neutral-600">
                                                    City *
                                                </Label>
                                                <Input
                                                    id="city"
                                                    placeholder="e.g., Pune"
                                                    value={formData.city}
                                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                    className="h-12"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="state" className="text-sm text-neutral-600">
                                                    State *
                                                </Label>
                                                <Input
                                                    id="state"
                                                    placeholder="e.g., Maharashtra"
                                                    value={formData.state}
                                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                                    className="h-12"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Pincode & Country */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="pincode" className="text-sm text-neutral-600">
                                                    Pincode *
                                                </Label>
                                                <Input
                                                    id="pincode"
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={6}
                                                    placeholder="e.g., 411001"
                                                    value={formData.pincode}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/\D/g, '').slice(0, 6)
                                                        setFormData({ ...formData, pincode: val })
                                                    }}
                                                    className="h-12"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="country" className="text-sm text-neutral-600">
                                                    <Landmark className="w-3.5 h-3.5 inline mr-1" />
                                                    Country
                                                </Label>
                                                <Input
                                                    id="country"
                                                    placeholder="India"
                                                    value={formData.country}
                                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                                    className="h-12 bg-neutral-50"
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                            <p className="text-sm text-red-600">{error}</p>
                                        </div>
                                    )}

                                    <Button
                                        onClick={handleRazorpayPayment}
                                        className="w-full h-14 text-lg gap-2"
                                        style={{ backgroundColor: '#7C3AED' }}
                                        disabled={submitting}
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard className="w-5 h-5 mr-2" />
                                                Pay ₹{breakdown?.total.toFixed(2)}
                                            </>
                                        )}
                                    </Button>
                                </div>
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
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-600">Price</span>
                                        <span>₹{product.price} × {quantity}</span>
                                    </div>
                                    
                                    {breakdown && (
                                        <>
                                            {breakdown.gstType !== 'none' && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-neutral-600 flex items-center gap-1">
                                                        <Percent className="w-3 h-3" />
                                                        GST ({breakdown.gstPercentage}%)
                                                        <span className="text-xs text-neutral-400 capitalize">({breakdown.gstType})</span>
                                                    </span>
                                                    <span>₹{breakdown.gstAmount.toFixed(2)}</span>
                                                </div>
                                            )}

                                            {breakdown.hasDeliveryFee && breakdown.deliveryFee > 0 && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-neutral-600 flex items-center gap-1">
                                                        <Truck className="w-3 h-3" />
                                                        Delivery Fee
                                                    </span>
                                                    <span>₹{breakdown.deliveryFee.toFixed(2)}</span>
                                                </div>
                                            )}

                                            {breakdown.hasPlatformFee && breakdown.platformFee > 0 && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-neutral-600 flex items-center gap-1">
                                                        <Shield className="w-3 h-3" />
                                                        Platform Fee
                                                    </span>
                                                    <span>₹{breakdown.platformFee.toFixed(2)}</span>
                                                </div>
                                            )}

                                            {breakdown.hasAdditionalFee && breakdown.additionalFee > 0 && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-neutral-600 flex items-center gap-1">
                                                        <Plus className="w-3 h-3" />
                                                        {breakdown.additionalFeeName}
                                                    </span>
                                                    <span>₹{breakdown.additionalFee.toFixed(2)}</span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                <Separator />

                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-neutral-900">Total</span>
                                    <span className="text-2xl font-bold text-[#7C3AED]">₹{breakdown?.total.toFixed(2)}</span>
                                </div>

                                <div className="p-3 bg-[#7C3AED]/10 rounded-lg">
                                    <p className="text-sm text-[#7C3AED] text-center font-medium flex items-center justify-center gap-2">
                                        <CreditCard className="w-4 h-4" />
                                        Secure Payment by Razorpay
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