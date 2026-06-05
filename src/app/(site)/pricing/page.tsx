// src/app/(site)/pricing/page.tsx
import { Check, X, Zap, TrendingUp, Shield, Calculator, ArrowRight, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const metadata = {
    title: 'Pricing - Hookit',
    description: 'Simple, transparent pricing for creators. 8% commission + 1.5% payment processing fee.',
}

const COMMISSION_RATE = 8
const PAYMENT_FEE = 1.5
const TOTAL_FEE = COMMISSION_RATE + PAYMENT_FEE

const plans = [
    {
        name: 'Starter',
        price: 'Free',
        period: 'forever',
        description: 'Perfect for hobbyists and new creators',
        commission: 8,
        features: [
            '1.5% Payment Processing fee',
            'List up to 50 products',
            'Basic store page',
            'Standard analytics',
            'Email support',
            'Payouts every Friday',
        ],
        notIncluded: [
            'Featured listings',
            'Custom domain',
            'Priority support',
            'Advanced analytics',
        ],
        cta: 'Start Free',
        popular: false,
    },
    {
        name: 'Pro',
        price: '₹199',
        period: '/month',
        description: 'For serious creators growing their business',
        commission: 0,
        features: [
            '3% Payment Processing fee',
            'List up to 300 products',
            'Custom store branding',
            'Advanced analytics dashboard',
            '5 featured listings/month',
            'Priority email support',
            'Faster payouts (T+3)',
            'Seller success program access',
        ],
        notIncluded: [
            'API access',
            'Dedicated account manager',
        ],
        cta: 'Comming Soon',
        popular: true,
    },
    {
        name: 'Business',
        price: '₹499',
        period: '/month',
        description: 'For established brands and high-volume sellers',
        commission: 0,
        features: [
            '2.5% Payment Processing fee',
            'Unlimited products',
            'Custom domain support',
            'Full analytics suite',
            '20 featured listings/month',
            'Priority phone + email support',
            'Fastest payouts (T+2)',
            'API access',
            'Dedicated account manager',
            'Bulk product upload',
        ],
        notIncluded: [],
        cta: 'Comming Soon',
        popular: false,
    },
]

const calculateEarnings = (saleAmount: number, commissionPercent: number) => {
    const commission = (saleAmount * commissionPercent) / 100
    const paymentFee = (saleAmount * PAYMENT_FEE) / 100
    const totalDeduction = commission + paymentFee
    const sellerReceives = saleAmount - totalDeduction
    return {
        commission,
        paymentFee,
        totalDeduction,
        sellerReceives,
    }
}

export default function PricingPage() {
    const examples = [
        { amount: 500, label: 'Small Item' },
        { amount: 1000, label: 'Standard Product' },
        { amount: 2500, label: 'Premium Product' },
        { amount: 5000, label: 'High-Value Item' },
    ]

    return (
        <div className="min-h-screen bg-white pt-20">
            {/* Hero */}
            <div className="bg-[#f8f7fb] py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="w-16 h-16 bg-[#7C3AED]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Calculator className="w-8 h-8 text-[#7C3AED]" />
                    </div>
                    <h1 className="text-5xl font-bold text-neutral-900 mb-4">
                        Simple, transparent pricing
                    </h1>
                    <p className="text-xl text-neutral-500 max-w-2xl mx-auto">
                        No hidden fees. No setup costs. Only pay when you sell. 
                        Keep more of what you earn compared to other marketplaces.
                    </p>
                    
                    {/* Commission Badge */}
                    <div className="mt-8 inline-flex items-center gap-4 bg-white rounded-2xl px-8 py-4 shadow-lg">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-[#7C3AED]">{COMMISSION_RATE}%</p>
                            <p className="text-sm text-neutral-500">Platform Commission</p>
                        </div>
                        <div className="w-px h-12 bg-neutral-200" />
                        <div className="text-center">
                            <p className="text-3xl font-bold text-[#7C3AED]">{PAYMENT_FEE}%</p>
                            <p className="text-sm text-neutral-500">Payment Processing</p>
                        </div>
                        <div className="w-px h-12 bg-neutral-200" />
                        <div className="text-center">
                            <p className="text-3xl font-bold text-neutral-900">{TOTAL_FEE}%</p>
                            <p className="text-sm text-neutral-500">Total Fee</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Comparison with competitors */}
            <div className="py-16">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-neutral-900 text-center mb-10">
                        How we compare
                    </h2>
                    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
                        <div className="grid grid-cols-4 gap-0">
                            <div className="p-4 bg-neutral-50 font-medium text-neutral-900 border-b border-neutral-200">Platform</div>
                            <div className="p-4 bg-neutral-50 font-medium text-neutral-900 border-b border-neutral-200 text-center">Commission</div>
                            <div className="p-4 bg-neutral-50 font-medium text-neutral-900 border-b border-neutral-200 text-center">Listing Fee</div>
                            <div className="p-4 bg-neutral-50 font-medium text-neutral-900 border-b border-neutral-200 text-center">Monthly Fee</div>
                            
                            <div className="p-4 font-bold text-[#7C3AED] border-b border-neutral-200">Hookit (Starter)</div>
                            <div className="p-4 text-center font-bold text-[#7C3AED] border-b border-neutral-200">8% + 1.5%</div>
                            <div className="p-4 text-center text-green-600 font-medium border-b border-neutral-200">Free</div>
                            <div className="p-4 text-center text-green-600 border-b border-neutral-200">Free</div>
                            
                            <div className="p-4 text-neutral-700 border-b border-neutral-200">Amazon India</div>
                            <div className="p-4 text-center text-neutral-600 border-b border-neutral-200">15-20%</div>
                            <div className="p-4 text-center text-red-500 border-b border-neutral-200">₹30/item</div>
                            <div className="p-4 text-center text-neutral-600 border-b border-neutral-200">Variable</div>
                            
                            <div className="p-4 text-neutral-700 border-b border-neutral-200">Flipkart</div>
                            <div className="p-4 text-center text-neutral-600 border-b border-neutral-200">15-25%</div>
                            <div className="p-4 text-center text-red-500 border-b border-neutral-200">Variable</div>
                            <div className="p-4 text-center text-neutral-600 border-b border-neutral-200">Variable</div>
                        </div>
                    </div>
                    <p className="text-sm text-neutral-500 text-center mt-4">
                        * Competitor rates are approximate and may vary by category. Last updated June 2026.
                    </p>
                </div>
            </div>

            {/* Pricing Plans */}
            <div className="py-16 bg-[#f8f7fb]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-neutral-900 text-center mb-4">
                        Choose your plan
                    </h2>
                    <p className="text-neutral-500 text-center mb-12 max-w-2xl mx-auto">
                        Start free and upgrade as you grow. All plans include secure payments, 
                        order management, and buyer protection.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {plans.map((plan) => (
                            <Card 
                                key={plan.name} 
                                className={`border-0 shadow-sm relative overflow-hidden ${
                                    plan.popular ? 'ring-2 ring-[#7C3AED] shadow-xl' : ''
                                }`}
                            >
                                {plan.popular && (
                                    <div className="absolute top-0 right-0 bg-[#7C3AED] text-white text-xs font-medium px-4 py-1 rounded-bl-xl">
                                        Most Popular
                                    </div>
                                )}
                                <CardContent className="p-8">
                                    <h3 className="text-xl font-bold text-neutral-900 mb-2">{plan.name}</h3>
                                    <p className="text-sm text-neutral-500 mb-6">{plan.description}</p>
                                    
                                    <div className="mb-6">
                                        <span className="text-4xl font-bold text-neutral-900">{plan.price}</span>
                                        <span className="text-neutral-500">{plan.period}</span>
                                    </div>
                                    
                                    <div className="bg-neutral-50 rounded-lg p-3 mb-6">
                                        <p className="text-sm text-neutral-600">
                                            <span className="font-bold text-[#7C3AED]">{plan.commission}%</span> commission per sale
                                        </p>
                                    </div>
                                    
                                    <div className="space-y-3 mb-8">
                                        {plan.features.map((feature) => (
                                            <div key={feature} className="flex items-center gap-3">
                                                <Check className="w-5 h-5 text-green-500 shrink-0" />
                                                <span className="text-sm text-neutral-700">{feature}</span>
                                            </div>
                                        ))}
                                        {plan.notIncluded.map((feature) => (
                                            <div key={feature} className="flex items-center gap-3 opacity-50">
                                                <X className="w-5 h-5 text-neutral-400 shrink-0" />
                                                <span className="text-sm text-neutral-500">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <Link href={plan.name === 'Business' ? '/contact' : '/signup'}>
                                        <Button 
                                            className={`w-full h-12 ${
                                                plan.popular 
                                                    ? 'bg-[#7C3AED] hover:bg-[#6d28d9]' 
                                                    : 'bg-neutral-900 hover:bg-neutral-800'
                                            }`}
                                        >
                                            {plan.cta}
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Earnings Calculator */}
            <div className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                            Earnings Calculator
                        </h2>
                        <p className="text-neutral-500">
                            See exactly how much you'll earn on every sale
                        </p>
                    </div>
                    
                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="font-semibold text-neutral-900 mb-4">Starter (8% commission)</h3>
                                    <div className="space-y-4">
                                        {examples.map((ex) => {
                                            const earnings = calculateEarnings(ex.amount, 8)
                                            return (
                                                <div key={ex.amount} className="bg-neutral-50 rounded-lg p-4">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-sm font-medium text-neutral-700">{ex.label}</span>
                                                        <span className="font-bold text-neutral-900">₹{ex.amount}</span>
                                                    </div>
                                                    <div className="space-y-1 text-xs text-neutral-500">
                                                        <div className="flex justify-between">
                                                            <span>Platform Fee (8%)</span>
                                                            <span>-₹{earnings.commission.toFixed(2)}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Payment Fee (1.5%)</span>
                                                            <span>-₹{earnings.paymentFee.toFixed(2)}</span>
                                                        </div>
                                                        <div className="border-t border-neutral-200 pt-1 flex justify-between font-medium text-green-600">
                                                            <span>You Receive</span>
                                                            <span>₹{earnings.sellerReceives.toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-neutral-900 mb-4">Pro Plan (6% commission)</h3>
                                    <div className="space-y-4">
                                        {examples.map((ex) => {
                                            const earnings = calculateEarnings(ex.amount, 6)
                                            return (
                                                <div key={ex.amount} className="bg-neutral-50 rounded-lg p-4">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-sm font-medium text-neutral-700">{ex.label}</span>
                                                        <span className="font-bold text-neutral-900">₹{ex.amount}</span>
                                                    </div>
                                                    <div className="space-y-1 text-xs text-neutral-500">
                                                        <div className="flex justify-between">
                                                            <span>Platform Fee (6%)</span>
                                                            <span>-₹{earnings.commission.toFixed(2)}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Payment Fee (1.5%)</span>
                                                            <span>-₹{earnings.paymentFee.toFixed(2)}</span>
                                                        </div>
                                                        <div className="border-t border-neutral-200 pt-1 flex justify-between font-medium text-green-600">
                                                            <span>You Receive</span>
                                                            <span>₹{earnings.sellerReceives.toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className="font-semibold text-neutral-900 mb-4">Business Plan (3% commission)</h3>
                                    <div className="space-y-4">
                                        {examples.map((ex) => {
                                            const earnings = calculateEarnings(ex.amount, 3)
                                            return (
                                                <div key={ex.amount} className="bg-neutral-50 rounded-lg p-4">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-sm font-medium text-neutral-700">{ex.label}</span>
                                                        <span className="font-bold text-neutral-900">₹{ex.amount}</span>
                                                    </div>
                                                    <div className="space-y-1 text-xs text-neutral-500">
                                                        <div className="flex justify-between">
                                                            <span>Platform Fee (3%)</span>
                                                            <span>-₹{earnings.commission.toFixed(2)}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Payment Fee (1.5%)</span>
                                                            <span>-₹{earnings.paymentFee.toFixed(2)}</span>
                                                        </div>
                                                        <div className="border-t border-neutral-200 pt-1 flex justify-between font-medium text-green-600">
                                                            <span>You Receive</span>
                                                            <span>₹{earnings.sellerReceives.toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div className="mt-6 bg-[#7C3AED]/10 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <TrendingUp className="w-5 h-5 text-[#7C3AED]" />
                                            <span className="font-semibold text-[#7C3AED]">Save more with Business</span>
                                        </div>
                                        <p className="text-sm text-neutral-600">
                                            On a ₹5,000 sale, you save ₹100 compared to Pro plan. 
                                            At 20 sales/month, the Business plan pays for itself.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* FAQ */}
            <div className="py-16 bg-[#f8f7fb]">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-neutral-900 text-center mb-10">
                        Common questions
                    </h2>
                    <div className="space-y-4">
                        {[
                            {
                                q: 'When do I get paid?',
                                a: 'Your earnings are processed every Friday for orders that are marked as Delivered. Minimum payout balance is ₹500.',
                            },
                            {
                                q: 'Are there any setup or listing fees?',
                                a: 'No. Creating a store and listing products is completely free on all plans. You only pay when you make a sale.',
                            },
                            {
                                q: 'What payment methods do buyers use?',
                                a: 'Buyers can pay via UPI, Credit/Debit cards, Net Banking, Wallets, and EMI through Razorpay. All major Indian payment methods are supported.',
                            },
                            {
                                q: 'Can I cancel my Pro/Business plan anytime?',
                                a: 'Yes, you can downgrade or cancel anytime. Your store will remain active on the free plan. Any pending payouts will be processed normally.',
                            },
                            {
                                q: 'What happens if a buyer returns a product?',
                                a: 'Return policies are set by you. If you offer returns, the refund amount is deducted from your next payout. Hookit does not charge commission on refunded orders.',
                            },
                            {
                                q: 'Do I need GST registration?',
                                a: 'GST is required only if your annual turnover exceeds ₹20 lakhs (₹10 lakhs for special states). We support GST-inclusive and exclusive pricing.',
                            },
                        ].map((faq, i) => (
                            <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <HelpCircle className="w-5 h-5 text-[#7C3AED] shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-semibold text-neutral-900 mb-2">{faq.q}</h3>
                                        <p className="text-sm text-neutral-600">{faq.a}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="py-20 bg-neutral-900 text-white">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Shield className="w-12 h-12 text-[#7C3AED] mx-auto mb-6" />
                    <h2 className="text-4xl font-bold mb-4">Ready to start selling?</h2>
                    <p className="text-xl text-neutral-400 mb-8">
                        Join thousands of creators earning on Hookit. No credit card required.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/signup">
                            <Button size="lg" className="bg-[#7C3AED] hover:bg-[#6d28d9] h-14 px-8 text-lg">
                                Create Free Store
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                        <Link href="/seller-agreement">
                            <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-neutral-600 text-white hover:bg-white hover:text-neutral-900">
                                Read Seller Agreement
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}