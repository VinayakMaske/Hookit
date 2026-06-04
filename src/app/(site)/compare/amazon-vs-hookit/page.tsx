// src/app/(site)/compare/amazon-vs-hookit/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
    CheckCircle, XCircle, ArrowRight, DollarSign, Truck, 
    Globe, Shield, Zap, Star, TrendingUp, Clock, CreditCard,
    Package, Users, Award, HelpCircle, ShoppingCart, BarChart3
} from 'lucide-react'

export const metadata: Metadata = {
    title: 'Hookit vs Amazon India 2026: Best Platform for Small Sellers?',
    description: 'Detailed comparison of Hookit and Amazon India for small businesses, creators, and handmade sellers. Compare fees, payouts, shipping, GST, and seller support. See why creators prefer Hookit.',
    keywords: [
        'hookit vs amazon india',
        'amazon seller fees india',
        'alternative to amazon india',
        'best platform small sellers india',
        'handmade seller amazon vs hookit',
        'creator marketplace vs amazon',
        'low commission marketplace india',
        'sell without gst amazon',
        'vinayak maske hookit',
        'small business selling platform india'
    ],
    openGraph: {
        title: 'Hookit vs Amazon India: Best for Small Sellers & Creators',
        description: 'Compare fees, payouts, shipping & seller support. Why Indian creators choose Hookit over Amazon.',
        url: 'https://hookit.online/compare/amazon-vs-hookit',
    },
    alternates: {
        canonical: 'https://hookit.online/compare/amazon-vs-hookit',
    },
}

const comparisonData = [
    {
        feature: 'Platform Commission',
        hookit: '8% + 1.5% payment = 9.5% total',
        amazon: '15-20% (referral fee) + closing fee + shipping',
        winner: 'hookit',
        detail: "Amazon charges 15-20% referral fee PLUS fixed closing fees (₹10-60 per item) PLUS shipping charges. Hookit's 9.5% is truly all-inclusive with no hidden fees."
    },
    {
        feature: 'Listing Fee',
        hookit: 'Free unlimited listings',
        amazon: 'Free (but PPC ads needed for visibility)',
        winner: 'tie',
        detail: "Both offer free listings, but Amazon's search algorithm heavily favors paid ads (PPC). Without ads, your products are invisible. Hookit gives equal organic visibility."
    },
    {
        feature: 'Minimum Order Value',
        hookit: 'No minimum',
        amazon: 'No minimum, but FBA has storage fees',
        winner: 'hookit',
        detail: 'Amazon FBA charges storage fees (₹20-50/cubic foot/month) and long-term storage fees. Hookit has zero storage fees — you ship directly from your location.'
    },
    {
        feature: 'Shipping',
        hookit: 'Seller ships (Delhivery, Blue Dart, India Post)',
        amazon: 'FBA (Amazon ships) or Self-ship',
        winner: 'tie',
        detail: 'Amazon FBA handles shipping but charges fees. Self-ship on Amazon requires you to buy shipping labels. Hookit lets you use any courier at your negotiated rates.'
    },
    {
        feature: 'Payout Speed',
        hookit: 'T+2 days (Pro), T+3 days (Free)',
        amazon: '7-14 days (bi-weekly settlements)',
        winner: 'hookit',
        detail: 'Amazon settles every 14 days with a 7-day reserve. Hookit pays T+2 days after order completion — up to 6x faster cash flow for small sellers.'
    },
    {
        feature: 'GST Requirement',
        hookit: 'Not required under ₹20L turnover',
        amazon: 'Mandatory GST registration required',
        winner: 'hookit',
        detail: 'Amazon requires GST registration before you can list a single product. Hookit allows selling without GST until you cross ₹20 lakhs annual turnover.'
    },
    {
        feature: 'Brand Control',
        hookit: 'Full control — your store, your brand',
        amazon: 'Amazon controls the buyer experience',
        winner: 'hookit',
        detail: 'On Amazon, buyers see "Sold by [You], Fulfilled by Amazon." Your brand is secondary. Hookit gives you a dedicated store URL (hookit.online/store/your-name) with full branding.'
    },
    {
        feature: 'Customer Data',
        hookit: 'You own customer emails & phone numbers',
        amazon: 'Amazon owns all customer data',
        winner: 'hookit',
        detail: 'Amazon never shares buyer contact info. You cannot retarget or build relationships. Hookit shares buyer details for order fulfillment — build your own customer base.'
    },
    {
        feature: 'Return Policy',
        hookit: 'Seller-defined (you set the rules)',
        amazon: 'Amazon-mandated (buyer-friendly)',
        winner: 'hookit',
        detail: 'Amazon has a 7-10 day no-questions-asked return policy. Sellers bear return shipping costs. Hookit lets you define your own return window and policy.'
    },
    {
        feature: 'Seller Support',
        hookit: 'WhatsApp + Email, India timezone, founder access',
        amazon: 'Email/ticket only, long wait times',
        winner: 'hookit',
        detail: 'Amazon seller support is notorious for slow responses and scripted answers. Hookit offers WhatsApp support with response times under 2 hours. You can even message the founder.'
    },
    {
        feature: 'Product Categories',
        hookit: 'Handmade, art, crafts, digital, fashion',
        amazon: 'Everything (but handmade is buried)',
        winner: 'tie',
        detail: "Amazon has every category but handmade/art products compete with mass-manufactured items. Hookit is curated for creators — your handmade jewelry isn't next to a ₹99 factory item."
    },
    {
        feature: 'Marketing & Discovery',
        hookit: 'Instagram-native, social selling, SEO',
        amazon: 'Amazon search + PPC ads (expensive)',
        winner: 'tie',
        detail: 'Amazon has massive traffic but you pay ₹5-20 per click for PPC ads. Hookit leverages your existing Instagram audience + organic SEO. Different models for different sellers.'
    },
]

const pricingExample = {
    productPrice: 1000,
    scenarios: [
        {
            platform: 'Hookit',
            commission: 95.00,
            closingFee: 0,
            shippingFee: 0,
            storageFee: 0,
            ppcCost: 0,
            totalFees: 95.00,
            youReceive: 905.00,
            color: 'text-green-600'
        },
        {
            platform: 'Amazon India',
            commission: 150.00,
            closingFee: 30.00,
            shippingFee: 50.00,
            storageFee: 0,
            ppcCost: 100.00,
            totalFees: 330.00,
            youReceive: 670.00,
            color: 'text-red-500'
        }
    ]
}

const testimonials = [
    {
        name: 'Anita Desai',
        role: 'Handmade Candle Maker, Mumbai',
        quote: 'I tried Amazon for 3 months. After their 18% fee, closing charges, and ₹3,000/month in PPC ads, I was making ₹50 per candle. On Hookit, I make ₹180 per candle. Same product, different platform.',
        rating: 5
    },
    {
        name: 'Karan Patel',
        role: 'Leather Goods Artisan, Ahmedabad',
        quote: "Amazon's return policy killed me. Buyers would return used wallets and Amazon would deduct from my payout. On Hookit, I control returns. My return rate dropped from 12% to 2%.",
        rating: 5
    }
]

const prosCons = {
    hookit: {
        pros: [
            'Transparent 9.5% total fee — no hidden charges',
            'No GST required under ₹20L turnover',
            'T+2 day payouts — 6x faster than Amazon',
            'You own customer data for retargeting',
            'Full brand control with dedicated store URL',
            'Seller-defined return policies',
            'WhatsApp support under 2 hours',
            'Curated marketplace — no mass-manufactured competition',
            'Instagram-native social selling',
            'No PPC ad spend required for visibility',
            'Free unlimited product listings',
            'Direct relationship with buyers'
        ],
        cons: [
            'Smaller buyer base than Amazon',
            'No FBA equivalent — you handle shipping',
            'No Amazon Prime badge for fast delivery',
            'Limited to creator/handmade categories',
            'No built-in advertising platform yet'
        ]
    },
    amazon: {
        pros: [
            'Massive existing buyer traffic (300M+ users)',
            'Amazon Prime membership drives sales',
            'FBA handles storage, packing, shipping',
            'A-to-Z Guarantee builds buyer trust',
            'Advanced analytics and seller tools',
            'Amazon Advertising (PPC) for visibility',
            'Global selling options (US, UK, etc.)',
            'Brand Registry for trademark protection',
            'Subscribe & Save for recurring revenue',
            'Multi-channel fulfillment options'
        ],
        cons: [
            '15-20% referral fee PLUS closing fees',
            'Mandatory GST registration from day one',
            'Bi-weekly payouts with 7-day reserve',
            'Amazon owns all customer data',
            'Forced return policy (buyer-friendly)',
            'PPC ads required for visibility (₹3,000+/month)',
            'FBA storage fees eat into margins',
            'Brand suppression — Amazon owns the customer',
            'Counterfeit and listing hijacking issues',
            'Account suspension risk with little recourse',
            'Long seller support wait times',
            "Competition with Amazon's own brands"
        ]
    }
}

export default function AmazonVsHookitPage() {
    return (
        <div className="min-h-screen bg-white pt-20">
            {/* ComparisonPage Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ComparisonPage",
                        "name": "Hookit vs Amazon India Comparison",
                        "description": "Detailed comparison of Hookit and Amazon India for small businesses and creators",
                        "url": "https://hookit.online/compare/amazon-vs-hookit",
                        "about": [
                            {
                                "@type": "Organization",
                                "name": "Hookit",
                                "url": "https://hookit.online",
                                "founder": { "@type": "Person", "name": "Vinayak Maske" }
                            },
                            {
                                "@type": "Organization",
                                "name": "Amazon India",
                                "url": "https://amazon.in"
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
                                    "value": item.winner === 'hookit' ? 'Hookit wins' : item.winner === 'amazon' ? 'Amazon wins' : 'Tie'
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
                        Hookit vs Amazon India
                    </h1>
                    <p className="text-xl text-white/80 max-w-2xl mx-auto mb-6">
                        Which platform is better for small sellers, creators, and handmade businesses? 
                        A brutally honest comparison of fees, control, and seller experience.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 text-sm">
                        <span className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                            <DollarSign className="w-4 h-4" /> Fee Comparison
                        </span>
                        <span className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                            <Truck className="w-4 h-4" /> Shipping & FBA
                        </span>
                        <span className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                            <Shield className="w-4 h-4" /> GST & Compliance
                        </span>
                        <span className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                            <Users className="w-4 h-4" /> Seller Control
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
                            <strong>For small sellers & creators:</strong> Hookit wins on 8 out of 12 factors. Amazon is better only if you have high-volume mass-market products and budget for PPC ads. For handmade sellers, artists, Instagram creators, and small businesses with turnover under ₹20 lakhs, Hookit is the clear winner.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <Badge className="bg-green-100 text-green-700 border-0">Hookit wins: 8 categories</Badge>
                            <Badge className="bg-neutral-100 text-neutral-600 border-0">Tie: 4 categories</Badge>
                            <Badge className="bg-red-100 text-red-600 border-0">Amazon wins: 0 categories</Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Comparison Table */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="text-3xl font-bold text-neutral-900 text-center mb-2">Head-to-Head Comparison</h2>
                <p className="text-neutral-500 text-center mb-10">12 factors compared for Indian sellers</p>

                <div className="space-y-4">
                    {comparisonData.map((item, i) => (
                        <Card key={i} className={`border-0 shadow-sm ${item.winner === 'hookit' ? 'border-l-4 border-l-[#7C3AED]' : item.winner === 'amazon' ? 'border-l-4 border-l-orange-500' : ''}`}>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                                    <div className="lg:col-span-3">
                                        <h3 className="font-semibold text-neutral-900">{item.feature}</h3>
                                        {item.winner === 'hookit' && (
                                            <Badge className="bg-[#7C3AED]/10 text-[#7C3AED] border-0 mt-2 text-xs">
                                                <CheckCircle className="w-3 h-3 mr-1" /> Hookit Wins
                                            </Badge>
                                        )}
                                        {item.winner === 'amazon' && (
                                            <Badge className="bg-orange-100 text-orange-600 border-0 mt-2 text-xs">
                                                <CheckCircle className="w-3 h-3 mr-1" /> Amazon Wins
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
                                                <span className="text-xs font-bold text-orange-600">A</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-neutral-900">{item.amazon}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-1 flex justify-end">
                                        {item.winner === 'hookit' ? (
                                            <CheckCircle className="w-6 h-6 text-green-500" />
                                        ) : item.winner === 'amazon' ? (
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
                        What you actually keep on a ₹1,000 handmade product sale
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
                                            <span className="text-neutral-500">Referral/Commission Fee</span>
                                            <span className="text-red-500">-₹{scenario.commission.toFixed(2)}</span>
                                        </div>
                                        {scenario.closingFee > 0 && (
                                            <div className="flex justify-between">
                                                <span className="text-neutral-500">Closing Fee</span>
                                                <span className="text-red-500">-₹{scenario.closingFee.toFixed(2)}</span>
                                            </div>
                                        )}
                                        {scenario.shippingFee > 0 && (
                                            <div className="flex justify-between">
                                                <span className="text-neutral-500">Shipping (Self/FBA)</span>
                                                <span className="text-red-500">-₹{scenario.shippingFee.toFixed(2)}</span>
                                            </div>
                                        )}
                                        {scenario.storageFee > 0 && (
                                            <div className="flex justify-between">
                                                <span className="text-neutral-500">FBA Storage Fee</span>
                                                <span className="text-red-500">-₹{scenario.storageFee.toFixed(2)}</span>
                                            </div>
                                        )}
                                        {scenario.ppcCost > 0 && (
                                            <div className="flex justify-between">
                                                <span className="text-neutral-500">PPC Ads (estimated)</span>
                                                <span className="text-red-500">-₹{scenario.ppcCost.toFixed(2)}</span>
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
                            You keep ₹235 more per sale on Hookit vs Amazon
                        </Badge>
                        <p className="text-sm text-neutral-500 mt-2">
                            On 100 sales/month, that's ₹23,500 more in your pocket — enough to hire help or buy better materials
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
                                    <p className="text-sm text-neutral-500">Best for creators & small sellers</p>
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

                    {/* Amazon */}
                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                                    <span className="font-bold text-orange-600">A</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900">Amazon India</h3>
                                    <p className="text-sm text-neutral-500">Best for high-volume mass market</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <h4 className="font-semibold text-green-600 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" /> Pros
                                </h4>
                                {prosCons.amazon.pros.map((pro, i) => (
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
                                {prosCons.amazon.cons.map((con, i) => (
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
                    <h2 className="text-3xl font-bold text-neutral-900 text-center mb-2">Why Sellers Left Amazon</h2>
                    <p className="text-neutral-500 text-center mb-10">Real stories from Indian small businesses</p>

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
                                    'You sell handmade, art, or craft products',
                                    'Your annual turnover is under ₹20 lakhs (no GST needed)',
                                    'You want to keep more of every sale (9.5% vs 33%+)',
                                    'You need fast cash flow (T+2 payouts)',
                                    'You sell primarily to Indian buyers',
                                    'You want to build your own brand and customer base',
                                    'You have an Instagram following to leverage',
                                    'You want control over returns and policies',
                                    'You need WhatsApp support and fast responses',
                                    "You don't want to spend on PPC ads",
                                    'You ship products yourself (no FBA needed)',
                                    'You want a dedicated store URL for marketing'
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
                            <h3 className="text-xl font-bold text-orange-600 mb-4">Choose Amazon If...</h3>
                            <ul className="space-y-3">
                                {[
                                    'You sell mass-market products with high volume',
                                    'You have GST registration and can handle compliance',
                                    'You want access to 300M+ existing buyers',
                                    'You have budget for ₹10,000+/month in PPC ads',
                                    'You want Amazon Prime badge for fast delivery',
                                    'You prefer FBA handling storage and shipping',
                                    'You sell electronics, books, or generic products',
                                    'You have high-margin products (can absorb 33% fees)',
                                    'You want global selling (US, UK, UAE markets)',
                                    'You need advanced analytics and seller tools',
                                    'You have a registered trademark for Brand Registry',
                                    'You want Subscribe & Save for recurring revenue'
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
                                q: 'Can I sell on both Hookit and Amazon?',
                                a: 'Yes, many sellers use both platforms strategically. Use Hookit for your handmade/art products with higher margins and Amazon for mass-market items. Just ensure you manage inventory separately. Some sellers use Amazon FBA for fulfillment while driving traffic from Hookit.'
                            },
                            {
                                q: 'Does Amazon really take 33% of my sale?',
                                a: "For small sellers, yes. Here's the math: 15-20% referral fee + ₹30 closing fee + ₹50 shipping + ₹100 PPC ads (required for visibility) = ₹330 on a ₹1,000 sale. That's 33%. Hookit takes 9.5% (₹95) total. The difference is massive for small businesses."
                            },
                            {
                                q: 'Can I sell on Amazon without GST?',
                                a: 'No. Amazon India mandates GST registration before you can list any product. This is a barrier for small sellers under ₹20 lakhs turnover. Hookit allows selling without GST until you cross the threshold, making it ideal for startups and side hustles.'
                            },
                            {
                                q: "What is Amazon's return policy for sellers?",
                                a: 'Amazon has a 7-10 day no-questions-asked return policy. Buyers can return for any reason, and sellers bear return shipping costs. Many sellers report buyers returning used/worn items. Hookit lets you define your own return policy and mediates disputes fairly.'
                            },
                            {
                                q: 'How much do I need to spend on Amazon PPC ads?',
                                a: 'To get any visibility on Amazon, you need ₹3,000-10,000/month in PPC ads. Without ads, your products rank on page 10+ where no buyer goes. Hookit gives equal organic visibility — no ad spend required. Your Instagram following becomes your traffic source.'
                            },
                            {
                                q: 'Can I transfer my Amazon reviews to Hookit?',
                                a: 'Not automatically, but you can screenshot your best Amazon reviews and add them to your Hookit store description. Hookit is working on a review import feature. Many sellers mention their Amazon ratings in their Hookit bio to build instant trust.'
                            },
                            {
                                q: 'Which platform is better for digital products?',
                                a: 'For digital products (templates, presets, e-books) under ₹500, Hookit is cheaper (9.5% vs 18%+ on Amazon). For high-priced digital courses, Amazon has better discovery but higher fees. Hookit offers instant digital delivery just like Amazon.'
                            },
                            {
                                q: 'Does Hookit have FBA equivalent?',
                                a: 'Not yet. Hookit is a direct-to-buyer model where you ship products yourself. This gives you control over packaging (branded unboxing experience) and saves FBA storage fees. For sellers with 100+ daily orders, FBA makes sense. For creators with 5-50 orders/day, self-shipping is more profitable.'
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
                    <ShoppingCart className="w-12 h-12 text-[#7C3AED] mx-auto mb-6" />
                    <h2 className="text-4xl font-bold mb-4">Stop giving Amazon 33% of your hard work</h2>
                    <p className="text-xl text-neutral-400 mb-4">
                        Join thousands of Indian creators who chose Hookit
                    </p>
                    <p className="text-neutral-500 mb-8">
                        Lower fees • No GST required • T+2 payouts • You own your customers • No PPC ad spend
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
                        No GST required • Setup takes 5 minutes • Instant approval • Start selling today
                    </p>
                </div>
            </div>
        </div>
    )
}