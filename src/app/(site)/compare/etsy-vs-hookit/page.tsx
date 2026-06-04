// src/app/(site)/compare/etsy-vs-hookit/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
    CheckCircle, XCircle, ArrowRight, DollarSign, Truck, 
    Globe, Shield, Zap, Star, TrendingUp, Clock, CreditCard,
    Package, Users, Award, HelpCircle
} from 'lucide-react'

export const metadata: Metadata = {
    title: 'Hookit vs Etsy 2026: Which is Better for Indian Sellers?',
    description: 'Detailed comparison of Hookit and Etsy for Indian creators and sellers. Compare fees, payouts, shipping, GST, UPI support, and buyer discovery. See why Indian sellers are switching to Hookit.',
    keywords: [
        'hookit vs etsy',
        'etsy alternative india',
        'best marketplace indian sellers',
        'sell handmade india',
        'etsy fees india',
        'indian creator marketplace',
        'handmade marketplace india',
        'sell on etsy vs hookit',
        'vinayak maske hookit',
        'creator marketplace comparison'
    ],
    openGraph: {
        title: 'Hookit vs Etsy: Best Marketplace for Indian Sellers in 2026',
        description: 'Compare fees, payouts, shipping & more. See why Indian creators prefer Hookit over Etsy.',
        url: 'https://hookit.online/compare/etsy-vs-hookit',
    },
    alternates: {
        canonical: 'https://hookit.online/compare/etsy-vs-hookit',
    },
}

const comparisonData = [
    {
        feature: 'Platform Commission',
        hookit: '8% + 1.5% payment = 9.5% total',
        etsy: '6.5% + 3-4% payment + currency conversion',
        winner: 'hookit',
        detail: "Etsy appears cheaper but adds payment processing (3-4%) and currency conversion fees (2-3%) for INR sellers. Hookit's 9.5% is transparent and all-inclusive."
    },
    {
        feature: 'Listing Fee',
        hookit: 'Free unlimited listings',
        etsy: '$0.20 per listing (renewal every 4 months)',
        winner: 'hookit',
        detail: 'Etsy charges $0.20 per listing which adds up for sellers with 50+ products. Hookit offers unlimited free listings on all plans.'
    },
    {
        feature: 'Currency & Pricing',
        hookit: 'INR pricing, no conversion',
        etsy: 'USD pricing + 2-3% conversion fee',
        winner: 'hookit',
        detail: 'Etsy forces USD pricing for international sellers. Indian sellers lose 2-3% on every sale to currency conversion. Hookit uses INR natively.'
    },
    {
        feature: 'UPI Payments',
        hookit: 'Full UPI support via Razorpay',
        etsy: 'No UPI support',
        winner: 'hookit',
        detail: "UPI is India's most popular payment method (60%+ transactions). Etsy does not support UPI, limiting Indian buyer reach significantly."
    },
    {
        feature: 'Payout Speed',
        hookit: 'T+2 days (Pro), T+3 days (Free)',
        etsy: 'Weekly deposits only',
        winner: 'hookit',
        detail: 'Hookit offers T+2 day payouts to UPI or bank account. Etsy deposits weekly to your bank, creating cash flow issues for small sellers.'
    },
    {
        feature: 'Shipping Integration',
        hookit: 'Delhivery, Blue Dart, India Post',
        etsy: 'International shipping focus',
        winner: 'hookit',
        detail: 'Hookit is built for Indian logistics. Etsy is designed for international shipping (USPS, FedEx) which is expensive for domestic Indian orders.'
    },
    {
        feature: 'GST Handling',
        hookit: 'Built-in GST support for Indian sellers',
        etsy: 'No Indian GST integration',
        winner: 'hookit',
        detail: 'Hookit allows GST-inclusive or exclusive pricing and generates reports for Indian tax filing. Etsy has no Indian GST support.'
    },
    {
        feature: 'Buyer Discovery',
        hookit: 'Instagram-native, social selling',
        etsy: 'Etsy search algorithm',
        winner: 'tie',
        detail: 'Etsy has established search traffic but is saturated. Hookit leverages Instagram where Indian creators already have audiences.'
    },
    {
        feature: 'Setup Time',
        hookit: '5 minutes, no verification delay',
        etsy: '1-2 days for account approval',
        winner: 'hookit',
        detail: 'Hookit stores are live instantly. Etsy requires identity verification and can reject sellers, especially from India.'
    },
    {
        feature: 'Customer Support',
        hookit: 'WhatsApp + Email, India timezone',
        etsy: 'Email only, US timezone',
        winner: 'hookit',
        detail: 'Hookit offers WhatsApp support in IST timezone. Etsy support is email-only with 24-48 hour response times from US.'
    },
    {
        feature: 'Return Policy',
        hookit: 'Seller-defined, 7-day protection',
        etsy: 'Etsy-mandated policies',
        winner: 'tie',
        detail: 'Both allow custom return policies. Hookit adds 7-day buyer protection. Etsy has stricter case resolution that often favors buyers.'
    },
    {
        feature: 'Digital Products',
        hookit: 'Supported with instant delivery',
        etsy: 'Supported with instant delivery',
        winner: 'tie',
        detail: 'Both platforms support digital downloads (templates, presets, e-books). Hookit charges 0% extra for digital. Etsy charges same fees.'
    },
]

const pricingExample = {
    productPrice: 1500,
    scenarios: [
        {
            platform: 'Hookit',
            commission: 142.50,
            paymentFee: 0,
            currencyConversion: 0,
            listingFee: 0,
            totalFees: 142.50,
            youReceive: 1357.50,
            color: 'text-green-600'
        },
        {
            platform: 'Etsy',
            commission: 97.50,
            paymentFee: 52.50,
            currencyConversion: 37.50,
            listingFee: 16.50,
            totalFees: 204.00,
            youReceive: 1296.00,
            color: 'text-red-500'
        }
    ]
}

const testimonials = [
    {
        name: 'Priya Sharma',
        role: 'Watercolor Artist, Pune',
        quote: 'I sold on Etsy for 2 years but the currency conversion killed my margins. Switching to Hookit saved me ₹200-300 per sale. Plus my buyers can pay via UPI now.',
        rating: 5
    },
    {
        name: 'Rahul Verma',
        role: 'Jewelry Maker, Jaipur',
        quote: 'Etsy took 4 days to approve my account and rejected my first shop. Hookit was live in 5 minutes. The WhatsApp support is a game-changer for Indian sellers.',
        rating: 5
    }
]

const prosCons = {
    hookit: {
        pros: [
            'Transparent 9.5% total fee — no hidden charges',
            'INR pricing with zero currency conversion loss',
            'Full UPI support for 600M+ Indian users',
            'T+2 day payouts to UPI or bank account',
            'Built for Indian shipping (Delhivery, Blue Dart)',
            'GST-ready for Indian tax compliance',
            'Instant store setup with no approval delays',
            'WhatsApp support in India timezone',
            'Instagram-native social selling features',
            'Free unlimited product listings'
        ],
        cons: [
            'Newer platform with smaller buyer base',
            'Limited international shipping options',
            'Fewer built-in marketing tools than Etsy',
            'No Etsy Ads equivalent for paid promotion'
        ]
    },
    etsy: {
        pros: [
            'Established global marketplace with high traffic',
            'Strong brand recognition among handmade buyers',
            'Etsy Ads for paid promotion',
            'Large community of handmade sellers',
            'International shipping tools built-in',
            'Etsy Pattern for standalone websites'
        ],
        cons: [
            'Hidden fees: payment processing + currency conversion',
            'No UPI support — misses 60% of Indian payments',
            'USD pricing forces currency conversion loss',
            'Weekly payouts only — cash flow issues',
            'Account approval can reject Indian sellers',
            'No Indian GST or tax support',
            '$0.20 listing fee per product adds up',
            'US-based support with slow email-only responses',
            'High competition from international sellers',
            'Shipping integrations designed for US/EU'
        ]
    }
}

export default function EtsyVsHookitPage() {
    return (
        <div className="min-h-screen bg-white pt-20">
            {/* ComparisonPage Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ComparisonPage",
                        "name": "Hookit vs Etsy Comparison",
                        "description": "Detailed comparison of Hookit and Etsy for Indian creators and sellers",
                        "url": "https://hookit.online/compare/etsy-vs-hookit",
                        "about": [
                            {
                                "@type": "Organization",
                                "name": "Hookit",
                                "url": "https://hookit.online",
                                "founder": { "@type": "Person", "name": "Vinayak Maske" }
                            },
                            {
                                "@type": "Organization",
                                "name": "Etsy",
                                "url": "https://etsy.com"
                            }
                        ],
                        "mainEntity": {
                            "@type": "ItemList",
                            "itemListElement": comparisonData.map((item, i) => ({
                                "@type": "ListItem",
                                "position": i + 1,
                                "item": {
                                    "@type": "PropertyValue",
                                    "name": item.feature,
                                    "value": item.winner === 'hookit' ? 'Hookit wins' : item.winner === 'etsy' ? 'Etsy wins' : 'Tie'
                                }
                            }))
                        }
                    })
                }}
            />

            {/* Hero */}
            <div className="bg-gradient-to-br from-[#7C3AED] to-[#6d28d9] py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <Badge className="bg-white/20 text-white border-0 mb-4 hover:bg-white/30">
                        2026 Comparison
                    </Badge>
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                        Hookit vs Etsy
                    </h1>
                    <p className="text-xl text-white/80 max-w-2xl mx-auto mb-6">
                        Which marketplace is better for Indian creators, artists, and handmade sellers? 
                        A detailed, no-BS comparison of fees, features, and seller experience.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 text-sm">
                        <span className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                            <DollarSign className="w-4 h-4" /> Fee Comparison
                        </span>
                        <span className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                            <Truck className="w-4 h-4" /> Shipping
                        </span>
                        <span className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                            <CreditCard className="w-4 h-4" /> UPI & Payments
                        </span>
                        <span className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                            <Clock className="w-4 h-4" /> Payout Speed
                        </span>
                    </div>
                </div>
            </div>

            {/* Quick Verdict */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Card className="border-0 shadow-lg bg-[#f8f7fb]">
                    <CardContent className="p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Award className="w-8 h-8 text-[#7C3AED]" />
                            <h2 className="text-2xl font-bold text-neutral-900">Quick Verdict</h2>
                        </div>
                        <p className="text-lg text-neutral-700 leading-relaxed mb-4">
                            <strong>For Indian sellers:</strong> Hookit wins on 8 out of 12 factors. Etsy is better only if you primarily sell to US/EU buyers. For selling handmade products, art, jewelry, and crafts to Indian buyers, Hookit is the clear winner due to lower total fees, UPI support, INR pricing, faster payouts, and India-specific features.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <Badge className="bg-green-100 text-green-700 border-0">Hookit wins: 8 categories</Badge>
                            <Badge className="bg-neutral-100 text-neutral-600 border-0">Tie: 3 categories</Badge>
                            <Badge className="bg-red-100 text-red-600 border-0">Etsy wins: 1 category</Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Comparison Table */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="text-3xl font-bold text-neutral-900 text-center mb-2">Head-to-Head Comparison</h2>
                <p className="text-neutral-500 text-center mb-10">12 factors compared side by side</p>

                <div className="space-y-4">
                    {comparisonData.map((item, i) => (
                        <Card key={i} className={`border-0 shadow-sm ${item.winner === 'hookit' ? 'border-l-4 border-l-[#7C3AED]' : item.winner === 'etsy' ? 'border-l-4 border-l-orange-500' : ''}`}>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                                    <div className="lg:col-span-3">
                                        <h3 className="font-semibold text-neutral-900">{item.feature}</h3>
                                        {item.winner === 'hookit' && (
                                            <Badge className="bg-[#7C3AED]/10 text-[#7C3AED] border-0 mt-2 text-xs">
                                                <CheckCircle className="w-3 h-3 mr-1" /> Hookit Wins
                                            </Badge>
                                        )}
                                        {item.winner === 'etsy' && (
                                            <Badge className="bg-orange-100 text-orange-600 border-0 mt-2 text-xs">
                                                <CheckCircle className="w-3 h-3 mr-1" /> Etsy Wins
                                            </Badge>
                                        )}
                                        {item.winner === 'tie' && (
                                            <Badge className="bg-neutral-100 text-neutral-600 border-0 mt-2 text-xs">
                                                Tie
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="lg:col-span-4">
                                        <div className="flex items-start gap-2">
                                            <div className="w-6 h-6 rounded bg-[#7C3AED]/10 flex items-center justify-center shrink-0 mt-0.5">
                                                <span className="text-xs font-bold text-[#7C3AED]">H</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-neutral-900">{item.hookit}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-4">
                                        <div className="flex items-start gap-2">
                                            <div className="w-6 h-6 rounded bg-orange-100 flex items-center justify-center shrink-0 mt-0.5">
                                                <span className="text-xs font-bold text-orange-600">E</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-neutral-900">{item.etsy}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-1 flex justify-end">
                                        {item.winner === 'hookit' ? (
                                            <CheckCircle className="w-6 h-6 text-green-500" />
                                        ) : item.winner === 'etsy' ? (
                                            <CheckCircle className="w-6 h-6 text-orange-500" />
                                        ) : (
                                            <span className="text-neutral-400 text-sm">=</span>
                                        )}
                                    </div>
                                </div>
                                <p className="text-sm text-neutral-500 mt-3 pl-8">{item.detail}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Real Pricing Example */}
            <div className="bg-[#f8f7fb] py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-neutral-900 text-center mb-2">Real Pricing Example</h2>
                    <p className="text-neutral-500 text-center mb-10">
                        What you actually keep on a ₹1,500 handmade jewelry sale
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {pricingExample.scenarios.map((scenario) => (
                            <Card key={scenario.platform} className={`border-0 shadow-lg ${scenario.platform === 'Hookit' ? 'ring-2 ring-[#7C3AED]' : ''}`}>
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${scenario.platform === 'Hookit' ? 'bg-[#7C3AED]/10' : 'bg-orange-100'}`}>
                                            <span className={`font-bold ${scenario.platform === 'Hookit' ? 'text-[#7C3AED]' : 'text-orange-600'}`}>
                                                {scenario.platform[0]}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-neutral-900">{scenario.platform}</h3>
                                    </div>

                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-neutral-500">Product Price</span>
                                            <span className="font-medium">₹{pricingExample.productPrice}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-neutral-500">Platform Commission</span>
                                            <span className="text-red-500">-₹{scenario.commission.toFixed(2)}</span>
                                        </div>
                                        {scenario.paymentFee > 0 && (
                                            <div className="flex justify-between">
                                                <span className="text-neutral-500">Payment Processing</span>
                                                <span className="text-red-500">-₹{scenario.paymentFee.toFixed(2)}</span>
                                            </div>
                                        )}
                                        {scenario.currencyConversion > 0 && (
                                            <div className="flex justify-between">
                                                <span className="text-neutral-500">Currency Conversion</span>
                                                <span className="text-red-500">-₹{scenario.currencyConversion.toFixed(2)}</span>
                                            </div>
                                        )}
                                        {scenario.listingFee > 0 && (
                                            <div className="flex justify-between">
                                                <span className="text-neutral-500">Listing Fee</span>
                                                <span className="text-red-500">-₹{scenario.listingFee.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="border-t pt-3 flex justify-between">
                                            <span className="font-medium text-neutral-900">Total Fees</span>
                                            <span className="font-bold text-red-500">₹{scenario.totalFees.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-lg">
                                            <span className="font-bold text-neutral-900">You Receive</span>
                                            <span className={`font-bold ${scenario.color}`}>₹{scenario.youReceive.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="mt-6 text-center">
                        <Badge className="bg-green-100 text-green-700 border-0 text-sm px-4 py-2">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            You save ₹61.50 per sale on Hookit vs Etsy
                        </Badge>
                        <p className="text-sm text-neutral-500 mt-2">
                            On 50 sales/month, that's ₹3,075 more in your pocket every month
                        </p>
                    </div>
                </div>
            </div>

            {/* Pros & Cons */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-3xl font-bold text-neutral-900 text-center mb-10">Pros & Cons</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Hookit */}
                    <Card className="border-0 shadow-lg ring-2 ring-[#7C3AED]">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center">
                                    <span className="font-bold text-[#7C3AED]">H</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900">Hookit</h3>
                                    <p className="text-sm text-neutral-500">Best for Indian creators</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <h4 className="font-semibold text-green-600 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" /> Pros
                                </h4>
                                {prosCons.hookit.pros.map((pro, i) => (
                                    <div key={i} className="flex items-start gap-2 text-sm">
                                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                        <span className="text-neutral-700">{pro}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-semibold text-red-500 flex items-center gap-2">
                                    <XCircle className="w-4 h-4" /> Cons
                                </h4>
                                {prosCons.hookit.cons.map((con, i) => (
                                    <div key={i} className="flex items-start gap-2 text-sm">
                                        <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                                        <span className="text-neutral-700">{con}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Etsy */}
                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                                    <span className="font-bold text-orange-600">E</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900">Etsy</h3>
                                    <p className="text-sm text-neutral-500">Best for US/EU sellers</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <h4 className="font-semibold text-green-600 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" /> Pros
                                </h4>
                                {prosCons.etsy.pros.map((pro, i) => (
                                    <div key={i} className="flex items-start gap-2 text-sm">
                                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                        <span className="text-neutral-700">{pro}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-semibold text-red-500 flex items-center gap-2">
                                    <XCircle className="w-4 h-4" /> Cons
                                </h4>
                                {prosCons.etsy.cons.map((con, i) => (
                                    <div key={i} className="flex items-start gap-2 text-sm">
                                        <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                                        <span className="text-neutral-700">{con}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Seller Testimonials */}
            <div className="bg-[#f8f7fb] py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-neutral-900 text-center mb-2">Why Sellers Switched</h2>
                    <p className="text-neutral-500 text-center mb-10">Real stories from Indian creators</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {testimonials.map((t, i) => (
                            <Card key={i} className="border-0 shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex gap-1 mb-3">
                                        {[...Array(t.rating)].map((_, j) => (
                                            <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                                        ))}
                                    </div>
                                    <blockquote className="text-neutral-700 italic mb-4 leading-relaxed">
                                        "{t.quote}"
                                    </blockquote>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#7C3AED]/10 flex items-center justify-center">
                                            <span className="font-bold text-[#7C3AED]">{t.name[0]}</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-neutral-900 text-sm">{t.name}</p>
                                            <p className="text-xs text-neutral-500">{t.role}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* When to Choose Which */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-3xl font-bold text-neutral-900 text-center mb-10">Which Platform Should You Choose?</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-0 shadow-lg ring-2 ring-[#7C3AED]">
                        <CardContent className="p-6">
                            <h3 className="text-xl font-bold text-[#7C3AED] mb-4">Choose Hookit If...</h3>
                            <ul className="space-y-3">
                                {[
                                    'You sell primarily to Indian buyers',
                                    'Your buyers prefer UPI payments',
                                    'You want INR pricing without conversion loss',
                                    'You need fast payouts (T+2 days)',
                                    'You want free unlimited listings',
                                    'You need WhatsApp support',
                                    'You sell on Instagram and want a store link',
                                    'You need GST-compliant invoicing',
                                    'You ship within India (Delhivery, Blue Dart)',
                                    'You want transparent, all-inclusive pricing'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-6">
                            <h3 className="text-xl font-bold text-orange-600 mb-4">Choose Etsy If...</h3>
                            <ul className="space-y-3">
                                {[
                                    'You sell primarily to US/EU buyers',
                                    'Your products are priced $50+ (high-end handmade)',
                                    "You want access to Etsy's established buyer base",
                                    'You need international shipping tools',
                                    'You want to use Etsy Ads for promotion',
                                    "Your products fit Etsy's 'vintage' or 'craft supply' categories",
                                    "You don't mind currency conversion fees",
                                    'You can wait weekly for payouts',
                                    'You have budget for listing fees and ads',
                                    'You want Etsy Pattern for a standalone website'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                                        <CheckCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-[#f8f7fb] py-16">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-neutral-900 text-center mb-10">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {[
                            {
                                q: 'Can I sell on both Hookit and Etsy?',
                                a: 'Yes, many sellers use both platforms. Hookit for Indian buyers (UPI, INR, fast payouts) and Etsy for international buyers. Just ensure you manage inventory across both platforms.'
                            },
                            {
                                q: 'Does Etsy reject Indian sellers?',
                                a: 'Etsy does not explicitly reject Indian sellers, but their verification process is stricter for non-US/EU countries. Many Indian sellers report delays or additional documentation requests. Hookit has instant approval for all Indian sellers.'
                            },
                            {
                                q: 'How do Etsy fees add up for a ₹1,000 sale?',
                                a: 'Etsy: 6.5% commission (₹65) + 3-4% payment processing (₹35) + 2-3% currency conversion (₹25) + $0.20 listing fee (₹17) = ~₹142 total. Hookit: 8% + 1.5% = 9.5% (₹95) total. You save ~₹47 per sale on Hookit.'
                            },
                            {
                                q: 'Can I transfer my Etsy reviews to Hookit?',
                                a: 'Not automatically, but you can screenshot your Etsy reviews and add them to your Hookit store description. Hookit is working on an import feature for 2026.'
                            },
                            {
                                q: 'Which platform is better for digital products?',
                                a: 'Both support digital downloads. Hookit charges 9.5% total with no listing fees. Etsy charges 6.5% + payment fees + listing fees. For digital products under ₹500, Hookit is cheaper. For high-priced digital products ($50+), Etsy may be comparable.'
                            },
                            {
                                q: 'Does Hookit have an app like Etsy?',
                                a: 'Hookit is mobile-optimized via web browser. A native app is planned for Q3 2026. Etsy has iOS and Android apps with more mature mobile features currently.'
                            }
                        ].map((faq, i) => (
                            <Card key={i} className="border-0 shadow-sm">
                                <CardContent className="p-6">
                                    <h3 className="font-semibold text-neutral-900 mb-2 flex items-start gap-2">
                                        <HelpCircle className="w-5 h-5 text-[#7C3AED] shrink-0 mt-0.5" />
                                        {faq.q}
                                    </h3>
                                    <p className="text-neutral-600 text-sm leading-relaxed pl-7">{faq.a}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="bg-neutral-900 text-white py-20">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Zap className="w-12 h-12 text-[#7C3AED] mx-auto mb-6" />
                    <h2 className="text-4xl font-bold mb-4">Ready to switch?</h2>
                    <p className="text-xl text-neutral-400 mb-4">
                        Join thousands of Indian creators who chose Hookit over Etsy
                    </p>
                    <p className="text-neutral-500 mb-8">
                        Lower fees • UPI payments • T+2 payouts • INR pricing • Free listings
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
                                Read Seller Guide
                            </Button>
                        </Link>
                    </div>
                    <p className="text-sm text-neutral-500 mt-6">
                        No credit card required • Setup takes 5 minutes • Instant approval
                    </p>
                </div>
            </div>
        </div>
    )
}