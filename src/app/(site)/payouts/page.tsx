// src/app/(site)/payouts/page.tsx
import { Calendar, Clock, Wallet, ArrowRight, CheckCircle, AlertCircle, TrendingUp, Zap, Shield, Banknote, Smartphone, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata = {
    title: 'Payout Schedule - Hookit',
    description: 'Understand when and how sellers receive payouts on Hookit. Transparent, fast, and reliable.',
}

const payoutSchedules = [
    {
        plan: 'Starter',
        planColor: 'bg-neutral-100 text-neutral-700',
        price: 'Free',
        settlement: 'T+3',
        settlementDays: 3,
        description: '3 business days after order delivery/completion',
        minPayout: '₹500',
        methods: ['UPI', 'Bank Transfer'],
        features: [
            'Standard processing queue',
            'Weekly automatic payouts',
            'Email notification on payout',
        ],
        timeline: [
            { day: 'Day 0', event: 'Order delivered to buyer', icon: CheckCircle },
            { day: 'Day 1', event: 'Return window active (dispute check)', icon: Shield },
            { day: 'Day 2', event: 'Return window closes, payout queued', icon: Clock },
            { day: 'Day 3', event: 'Payout processed to your account', icon: Wallet },
        ],
    },
    {
        plan: 'Pro',
        planColor: 'bg-[#7C3AED]/10 text-[#7C3AED]',
        price: '₹499/mo',
        settlement: 'T+2',
        settlementDays: 2,
        description: '2 business days after order delivery/completion',
        minPayout: '₹500',
        methods: ['UPI', 'Bank Transfer'],
        features: [
            'Priority processing queue',
            'Bi-weekly or weekly payouts',
            'WhatsApp + Email notifications',
            'Payout calendar access',
        ],
        timeline: [
            { day: 'Day 0', event: 'Order delivered to buyer', icon: CheckCircle },
            { day: 'Day 1', event: 'Return window active (dispute check)', icon: Shield },
            { day: 'Day 2', event: 'Payout processed to your account', icon: Wallet },
        ],
        popular: true,
    },
    {
        plan: 'Business',
        planColor: 'bg-amber-100 text-amber-700',
        price: '₹1,999/mo',
        settlement: 'T+1',
        settlementDays: 1,
        description: 'Next business day after order delivery/completion',
        minPayout: '₹500',
        methods: ['UPI', 'Bank Transfer', 'Instant Transfer'],
        features: [
            'Fastest processing queue',
            'Daily automatic payouts',
            'Instant transfer option (1% fee)',
            'Dedicated payout support',
            'Advanced payout analytics',
        ],
        timeline: [
            { day: 'Day 0', event: 'Order delivered to buyer', icon: CheckCircle },
            { day: 'Day 1', event: 'Payout processed to your account', icon: Wallet },
        ],
    },
]

const faqs = [
    {
        question: 'What does "T+2" or "T+3" mean?',
        answer: '"T" is the day the order is marked as delivered/completed. "T+2" means 2 business days after that. Weekends and bank holidays are not counted.',
    },
    {
        question: 'Why is there a holding period?',
        answer: 'The holding period allows time for buyers to report issues, request returns, or raise disputes. It protects both buyers and sellers. After the window closes, the payout is released.',
    },
    {
        question: 'What if a buyer disputes an order?',
        answer: 'If a dispute is raised during the holding period, the payout is paused until the dispute is resolved. Hookit mediates between buyer and seller. Valid disputes result in refunds; invalid disputes release the payout.',
    },
    {
        question: 'Can I request an early payout?',
        answer: 'Business plan sellers can use Instant Transfer for a 1% fee. Pro and Starter sellers must wait for the standard schedule. Early payout is not available for first-time sellers (first payout always T+7 for verification).',
    },
    {
        question: 'What happens if my payout fails?',
        answer: 'If your bank account or UPI ID is incorrect, the payout bounces back. We notify you immediately via email and WhatsApp. Update your details in Settings → Payment Details and the payout will be reprocessed in the next cycle.',
    },
    {
        question: 'Is there a minimum payout amount?',
        answer: 'Yes, ₹500 minimum balance. If your earnings are below ₹500, they roll over to the next cycle until the threshold is reached. This reduces transaction fees for small amounts.',
    },
]

const importantDates = [
    {
        title: 'First Payout',
        description: 'New sellers receive their first payout T+7 days after first order completion. This is for account verification and fraud prevention.',
        badge: 'All Plans',
    },
    {
        title: 'Bank Holidays',
        description: 'Payouts are not processed on bank holidays (RBI holidays). If your payout date falls on a holiday, it moves to the next business day.',
        badge: 'All Plans',
    },
    {
        title: 'Failed Payout Retry',
        description: 'Failed payouts are automatically retried after 3 business days. You can also update your details and request manual reprocessing.',
        badge: 'All Plans',
    },
    {
        title: 'Instant Transfer',
        description: 'Business plan sellers can request instant transfer (within 4 hours) for a 1% convenience fee. Available 24/7 including weekends.',
        badge: 'Business Only',
    },
]

export default function PayoutSchedulePage() {
    return (
        <div className="min-h-screen bg-white pt-20">
            {/* Hero */}
            <div className="bg-[#f8f7fb] py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="w-16 h-16 bg-[#7C3AED]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Calendar className="w-8 h-8 text-[#7C3AED]" />
                    </div>
                    <h1 className="text-4xl font-bold text-neutral-900 mb-4">
                        Payout Schedule
                    </h1>
                    <p className="text-xl text-neutral-500 max-w-2xl mx-auto mb-8">
                        Transparent, predictable payouts. Know exactly when you'll receive your earnings.
                    </p>
                    <div className="inline-flex items-center gap-6 bg-white rounded-2xl px-8 py-4 shadow-lg">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-[#7C3AED]">T+2</p>
                            <p className="text-xs text-neutral-500">Razorpay Standard</p>
                        </div>
                        <div className="w-px h-10 bg-neutral-200" />
                        <div className="text-center">
                            <p className="text-2xl font-bold text-[#7C3AED]">T+3</p>
                            <p className="text-xs text-neutral-500">Hookit Starter</p>
                        </div>
                        <div className="w-px h-10 bg-neutral-200" />
                        <div className="text-center">
                            <p className="text-2xl font-bold text-[#7C3AED]">T+1</p>
                            <p className="text-xs text-neutral-500">Hookit Business</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <div className="py-16">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-neutral-900 text-center mb-12">How payouts work</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            {
                                icon: CheckCircle,
                                step: '1',
                                title: 'Order Delivered',
                                desc: 'Buyer receives the product. You mark order as "Delivered" in dashboard.',
                            },
                            {
                                icon: Shield,
                                step: '2',
                                title: 'Holding Period',
                                desc: 'Return/dispute window is active. Buyer can raise issues during this time.',
                            },
                            {
                                icon: Clock,
                                step: '3',
                                title: 'Payout Queued',
                                desc: 'After holding period, earnings are queued for payout based on your plan.',
                            },
                            {
                                icon: Wallet,
                                step: '4',
                                title: 'Money Received',
                                desc: 'Funds transferred to your bank account or UPI. You get notified.',
                            },
                        ].map((item) => (
                            <div key={item.step} className="text-center">
                                <div className="w-16 h-16 rounded-2xl bg-[#7C3AED]/10 flex items-center justify-center mx-auto mb-4">
                                    <item.icon className="w-8 h-8 text-[#7C3AED]" />
                                </div>
                                <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                                    {item.step}
                                </div>
                                <h3 className="font-semibold text-neutral-900 mb-2">{item.title}</h3>
                                <p className="text-sm text-neutral-500">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Plan Comparison */}
            <div className="py-16 bg-[#f8f7fb]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-neutral-900 text-center mb-12">Compare payout speeds</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {payoutSchedules.map((schedule) => (
                            <Card 
                                key={schedule.plan} 
                                className={`border-0 shadow-sm relative overflow-hidden ${
                                    schedule.popular ? 'ring-2 ring-[#7C3AED] shadow-xl' : ''
                                }`}
                            >
                                {schedule.popular && (
                                    <div className="absolute top-0 right-0 bg-[#7C3AED] text-white text-xs font-medium px-4 py-1 rounded-bl-xl">
                                        Most Popular
                                    </div>
                                )}
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Badge className={`${schedule.planColor} border-0`}>
                                            {schedule.plan}
                                        </Badge>
                                        <span className="text-sm text-neutral-500">{schedule.price}</span>
                                    </div>
                                    
                                    <div className="text-center py-6 bg-neutral-50 rounded-xl mb-6">
                                        <p className="text-4xl font-bold text-neutral-900 mb-1">{schedule.settlement}</p>
                                        <p className="text-sm text-neutral-500">{schedule.description}</p>
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-neutral-500">Min. Payout</span>
                                            <span className="font-medium text-neutral-900">{schedule.minPayout}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-neutral-500">Payout Methods</span>
                                            <span className="font-medium text-neutral-900">{schedule.methods.join(', ')}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-6">
                                        {schedule.features.map((feature) => (
                                            <div key={feature} className="flex items-center gap-2 text-sm">
                                                <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                                <span className="text-neutral-700">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Timeline Visualization */}
                                    <div className="bg-neutral-50 rounded-lg p-4">
                                        <p className="text-xs font-medium text-neutral-500 mb-3 uppercase tracking-wider">Timeline</p>
                                        <div className="space-y-3">
                                            {schedule.timeline.map((item, i) => (
                                                <div key={i} className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-white border-2 border-[#7C3AED] flex items-center justify-center shrink-0">
                                                        <item.icon className="w-4 h-4 text-[#7C3AED]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-medium text-neutral-900">{item.day}</p>
                                                        <p className="text-xs text-neutral-500">{item.event}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Important Dates */}
            <div className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-neutral-900 text-center mb-12">Important payout dates</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {importantDates.map((item) => (
                            <Card key={item.title} className="border-0 shadow-sm">
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-semibold text-neutral-900">{item.title}</h3>
                                        <Badge variant="secondary" className="text-xs">{item.badge}</Badge>
                                    </div>
                                    <p className="text-sm text-neutral-600">{item.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Example Calendar */}
            <div className="py-16 bg-[#f8f7fb]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-neutral-900 text-center mb-4">Example: June 2026 Payout Calendar</h2>
                    <p className="text-neutral-500 text-center mb-8">For a Pro plan seller (T+2 settlement)</p>
                    
                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-6">
                            <div className="grid grid-cols-7 gap-2 text-center mb-4">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                                    <div key={day} className="text-xs font-medium text-neutral-500 py-2">
                                        {day}
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-2">
                                {/* Empty cells for alignment */}
                                {[...Array(1)].map((_, i) => (
                                    <div key={`empty-${i}`} className="aspect-square" />
                                ))}
                                {[...Array(30)].map((_, i) => {
                                    const day = i + 1
                                    const isWeekend = (day + 1) % 7 === 0 || (day + 1) % 7 === 1
                                    const isHoliday = [15, 16].includes(day) // Example holidays
                                    const hasDelivery = [2, 5, 9, 12, 16, 19, 23, 26, 30].includes(day)
                                    const hasPayout = [4, 7, 11, 14, 18, 21, 25, 28].includes(day)
                                    
                                    return (
                                        <div 
                                            key={day} 
                                            className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm relative ${
                                                isWeekend || isHoliday 
                                                    ? 'bg-neutral-100 text-neutral-400' 
                                                    : 'bg-white border border-neutral-200'
                                            }`}
                                        >
                                            <span className={`font-medium ${
                                                hasDelivery ? 'text-[#7C3AED]' : 
                                                hasPayout ? 'text-green-600' : 'text-neutral-700'
                                            }`}>
                                                {day}
                                            </span>
                                            {hasDelivery && (
                                                <span className="text-[8px] text-[#7C3AED] mt-0.5">Delivery</span>
                                            )}
                                            {hasPayout && (
                                                <span className="text-[8px] text-green-600 mt-0.5">Payout</span>
                                            )}
                                            {isHoliday && (
                                                <span className="text-[8px] text-red-400 mt-0.5">Holiday</span>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="flex flex-wrap gap-4 mt-6 justify-center text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#7C3AED]" />
                                    <span className="text-neutral-600">Order Delivery</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                    <span className="text-neutral-600">Payout Day</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                    <span className="text-neutral-600">Bank Holiday</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* FAQ */}
            <div className="py-16">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-neutral-900 text-center mb-10">Payout FAQs</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <Card key={i} className="border-0 shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-3">
                                        <HelpCircle className="w-5 h-5 text-[#7C3AED] shrink-0 mt-0.5" />
                                        <div>
                                            <h3 className="font-semibold text-neutral-900 mb-2">{faq.question}</h3>
                                            <p className="text-sm text-neutral-600 leading-relaxed">{faq.answer}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="py-20 bg-neutral-900 text-white">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Wallet className="w-12 h-12 text-[#7C3AED] mx-auto mb-6" />
                    <h2 className="text-4xl font-bold mb-4">Start earning today</h2>
                    <p className="text-xl text-neutral-400 mb-8">
                        Set up your store, make your first sale, and receive your first payout within a week.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/signup">
                            <Button size="lg" className="bg-[#7C3AED] hover:bg-[#6d28d9] h-14 px-10 text-lg gap-2">
                                Create Free Store
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </Link>
                        <Link href="/seller-guide">
                            <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-neutral-600 text-white hover:bg-white hover:text-neutral-900">
                                Read Onboarding Guide
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}