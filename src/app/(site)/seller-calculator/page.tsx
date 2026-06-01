// src/app/(site)/seller-calculator/page.tsx
'use client'

import { useState } from 'react'
import { Calculator, ArrowRight, TrendingUp, Percent, Wallet, Package, Zap, Info } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const COMMISSION_RATES = {
    starter: 12,
    pro: 10,
    business: 8,
}

const PAYMENT_FEE = 1.5

export default function SellerCalculatorPage() {
    const [salePrice, setSalePrice] = useState('1000')
    const [quantity, setQuantity] = useState('1')
    const [deliveryFee, setDeliveryFee] = useState('0')
    const [plan, setPlan] = useState<'starter' | 'pro' | 'business'>('pro')

    const price = parseFloat(salePrice) || 0
    const qty = parseInt(quantity) || 1
    const delivery = parseFloat(deliveryFee) || 0
    const itemTotal = price * qty

    const calculate = (commissionRate: number) => {
        const commission = (itemTotal * commissionRate) / 100
        const paymentProcessing = (itemTotal * PAYMENT_FEE) / 100
        const totalFees = commission + paymentProcessing
        const sellerReceives = itemTotal - totalFees + delivery

        return {
            commission,
            paymentProcessing,
            totalFees,
            sellerReceives,
            commissionRate,
        }
    }

    const starter = calculate(COMMISSION_RATES.starter)
    const pro = calculate(COMMISSION_RATES.pro)
    const business = calculate(COMMISSION_RATES.business)

    const selected = plan === 'starter' ? starter : plan === 'pro' ? pro : business

    const monthlyPlans = {
        starter: 0,
        pro: 499,
        business: 1999,
    }

    const breakEven = monthlyPlans[plan] > 0 ? Math.ceil(monthlyPlans[plan] / ((COMMISSION_RATES.starter - selected.commissionRate) / 100 * price)) : 0

    return (
        <div className="min-h-screen bg-white pt-20">
            {/* Hero */}
            <div className="bg-[#f8f7fb] py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="w-16 h-16 bg-[#7C3AED]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Calculator className="w-8 h-8 text-[#7C3AED]" />
                    </div>
                    <h1 className="text-4xl font-bold text-neutral-900 mb-4">
                        Seller Earnings Calculator
                    </h1>
                    <p className="text-xl text-neutral-500 max-w-2xl mx-auto">
                        See exactly how much you'll earn on every sale. Compare plans and find what works for you.
                    </p>
                </div>
            </div>

            {/* Calculator */}
            <div className="py-16">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        {/* Inputs */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="border-0 shadow-sm sticky top-24">
                                <CardContent className="p-6 space-y-6">
                                    <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
                                        <Package className="w-5 h-5 text-[#7C3AED]" />
                                        Sale Details
                                    </h2>

                                    <div className="space-y-2">
                                        <Label htmlFor="price">Product Price (₹)</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            min="0"
                                            step="1"
                                            value={salePrice}
                                            onChange={(e) => setSalePrice(e.target.value)}
                                            className="h-12 text-lg"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="quantity">Quantity Sold</Label>
                                        <Input
                                            id="quantity"
                                            type="number"
                                            min="1"
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            className="h-12"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="delivery">Delivery Fee Charged to Buyer (₹)</Label>
                                        <Input
                                            id="delivery"
                                            type="number"
                                            min="0"
                                            value={deliveryFee}
                                            onChange={(e) => setDeliveryFee(e.target.value)}
                                            className="h-12"
                                        />
                                        <p className="text-xs text-neutral-500">You keep 100% of delivery fees</p>
                                    </div>

                                    <div className="space-y-3">
                                        <Label>Your Plan</Label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {(['starter', 'pro', 'business'] as const).map((p) => (
                                                <button
                                                    key={p}
                                                    onClick={() => setPlan(p)}
                                                    className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                                                        plan === p
                                                            ? 'border-[#7C3AED] bg-[#7C3AED]/5 text-[#7C3AED]'
                                                            : 'border-neutral-200 hover:border-neutral-300 text-neutral-600'
                                                    }`}
                                                >
                                                    <span className="block capitalize">{p}</span>
                                                    <span className="block text-xs font-normal mt-1">
                                                        {COMMISSION_RATES[p]}% fee
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Results */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Main Result */}
                            <Card className="border-0 shadow-lg bg-neutral-900 text-white">
                                <CardContent className="p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <p className="text-neutral-400 text-sm mb-1">You will receive</p>
                                            <p className="text-5xl font-bold">₹{selected.sellerReceives.toFixed(2)}</p>
                                        </div>
                                        <div className="w-16 h-16 rounded-2xl bg-[#7C3AED]/20 flex items-center justify-center">
                                            <Wallet className="w-8 h-8 text-[#7C3AED]" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                        <div className="bg-white/10 rounded-lg p-3">
                                            <p className="text-neutral-400 mb-1">Sale Amount</p>
                                            <p className="font-semibold">₹{itemTotal.toFixed(2)}</p>
                                        </div>
                                        <div className="bg-white/10 rounded-lg p-3">
                                            <p className="text-neutral-400 mb-1">Total Fees</p>
                                            <p className="font-semibold text-red-400">-₹{selected.totalFees.toFixed(2)}</p>
                                        </div>
                                        <div className="bg-white/10 rounded-lg p-3">
                                            <p className="text-neutral-400 mb-1">Delivery</p>
                                            <p className="font-semibold text-green-400">+₹{delivery.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Fee Breakdown */}
                            <Card className="border-0 shadow-sm">
                                <CardContent className="p-6">
                                    <h3 className="font-semibold text-neutral-900 mb-4">Fee Breakdown</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <Percent className="w-4 h-4 text-[#7C3AED]" />
                                                <span className="text-sm text-neutral-700">Platform Commission ({selected.commissionRate}%)</span>
                                            </div>
                                            <span className="font-medium text-neutral-900">₹{selected.commission.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <Percent className="w-4 h-4 text-blue-500" />
                                                <span className="text-sm text-neutral-700">Payment Processing ({PAYMENT_FEE}%)</span>
                                            </div>
                                            <span className="font-medium text-neutral-900">₹{selected.paymentProcessing.toFixed(2)}</span>
                                        </div>
                                        <div className="border-t border-neutral-200 pt-3 flex justify-between items-center">
                                            <span className="font-semibold text-neutral-900">Total Deduction</span>
                                            <span className="font-bold text-red-500">₹{selected.totalFees.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold text-neutral-900">You Keep</span>
                                            <span className="font-bold text-green-600 text-lg">₹{selected.sellerReceives.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Plan Comparison */}
                            <Card className="border-0 shadow-sm">
                                <CardContent className="p-6">
                                    <h3 className="font-semibold text-neutral-900 mb-4">Compare All Plans</h3>
                                    <div className="space-y-3">
                                        {[starter, pro, business].map((calc) => (
                                            <div 
                                                key={calc.commissionRate}
                                                className={`p-4 rounded-xl border-2 transition-all ${
                                                    calc.commissionRate === selected.commissionRate
                                                        ? 'border-[#7C3AED] bg-[#7C3AED]/5'
                                                        : 'border-neutral-100'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-neutral-900">
                                                            {calc.commissionRate === 12 ? 'Starter' : calc.commissionRate === 10 ? 'Pro' : 'Business'}
                                                        </span>
                                                        {calc.commissionRate === selected.commissionRate && (
                                                            <Badge className="bg-[#7C3AED] text-white border-0 text-xs">Selected</Badge>
                                                        )}
                                                    </div>
                                                    <span className="font-bold text-neutral-900">₹{calc.sellerReceives.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm text-neutral-500">
                                                    <span>{calc.commissionRate}% commission + {PAYMENT_FEE}% processing</span>
                                                    <span>₹{calc.totalFees.toFixed(2)} fees</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Monthly Plan Value */}
                            {plan !== 'starter' && breakEven > 0 && (
                                <Card className="border-0 shadow-sm bg-[#7C3AED]/5 border-[#7C3AED]/20">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-3">
                                            <Zap className="w-5 h-5 text-[#7C3AED] shrink-0 mt-0.5" />
                                            <div>
                                                <h3 className="font-semibold text-neutral-900 mb-1">
                                                    Plan pays for itself at {breakEven} sales/month
                                                </h3>
                                                <p className="text-sm text-neutral-600">
                                                    {plan === 'pro' ? 'Pro' : 'Business'} plan costs ₹{monthlyPlans[plan]}/month. 
                                                    You save ₹{((COMMISSION_RATES.starter - selected.commissionRate) / 100 * price).toFixed(2)} per sale 
                                                    compared to Starter. Break even at {breakEven} sales.
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Volume Projection */}
                            <Card className="border-0 shadow-sm">
                                <CardContent className="p-6">
                                    <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-[#7C3AED]" />
                                        Monthly Projection
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {[10, 20, 50, 100].map((sales) => {
                                            const monthlyRevenue = sales * selected.sellerReceives
                                            const monthlyFees = sales * selected.totalFees
                                            return (
                                                <div key={sales} className="bg-neutral-50 rounded-lg p-3 text-center">
                                                    <p className="text-2xl font-bold text-neutral-900">{sales}</p>
                                                    <p className="text-xs text-neutral-500 mb-2">sales/month</p>
                                                    <p className="text-sm font-semibold text-green-600">₹{monthlyRevenue.toFixed(0)}</p>
                                                    <p className="text-xs text-neutral-400">₹{monthlyFees.toFixed(0)} in fees</p>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Section */}
            <div className="py-16 bg-[#f8f7fb]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-0 shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-3">
                                    <Info className="w-5 h-5 text-[#7C3AED] shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-semibold text-neutral-900 mb-2">When do fees apply?</h3>
                                        <p className="text-sm text-neutral-600">
                                            Fees are only deducted when you make a sale. No monthly fees, 
                                            no listing fees, no setup costs on the Starter plan. You only 
                                            pay when you earn.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-0 shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-3">
                                    <Info className="w-5 h-5 text-[#7C3AED] shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-semibold text-neutral-900 mb-2">When do I get paid?</h3>
                                        <p className="text-sm text-neutral-600">
                                            Starter: T+7 days. Pro: T+3 days. Business: T+2 days after order 
                                            completion. Minimum payout balance is ₹500.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="py-20 bg-neutral-900 text-white">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Calculator className="w-12 h-12 text-[#7C3AED] mx-auto mb-6" />
                    <h2 className="text-4xl font-bold mb-4">Ready to start earning?</h2>
                    <p className="text-xl text-neutral-400 mb-8">
                        Create your store and make your first sale today. No credit card required.
                    </p>
                    <Link href="/signup">
                        <Button size="lg" className="bg-[#7C3AED] hover:bg-[#6d28d9] h-14 px-10 text-lg gap-2">
                            Create Free Store
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}