// src/app/(site)/compare/meesho-vs-hookit/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
    CheckCircle, XCircle, ArrowRight, DollarSign, Truck, 
    Globe, Shield, Zap, Star, TrendingUp, Clock, CreditCard,
    Package, Users, Award, HelpCircle, ShoppingBag, Repeat
} from 'lucide-react'

export const metadata: Metadata = {
    title: 'Hookit vs Meesho 2026: Best for Resellers vs Creators?',
    description: 'Detailed comparison of Hookit and Meesho for Indian sellers. Compare commission, margins, branding, product types, and who each platform is built for. See why creators choose Hookit over Meesho.',
    keywords: [
        'hookit vs meesho',
        'meesho alternative india',
        'best platform resellers india',
        'creator vs reseller marketplace',
        'meesho commission fees',
        'sell handmade vs resell',
        'indian marketplace comparison',
        'meesho profit margins',
        'vinayak maske hookit',
        'creator marketplace india'
    ],
    openGraph: {
        title: 'Hookit vs Meesho: Creators vs Resellers in 2026',
        description: 'Compare commission, margins, branding & seller control. Why creators prefer Hookit over Meesho.',
        url: 'https://hookit.online/compare/meesho-vs-hookit',
    },
    alternates: {
        canonical: 'https://hookit.online/compare/meesho-vs-hookit',
    },
}

const comparisonData = [
    {
        feature: 'Platform Commission',
        hookit: '8% + 1.5% payment = 9.5% total',
        meesho: '0% commission (reseller model)',
        winner: 'tie',
        detail: 'Meesho charges 0% commission but you buy products at wholesale and resell at retail. Hookit charges 9.5% but you sell your OWN products at full margin. Different models for different sellers.'
    },
    {
        feature: 'Product Ownership',
        hookit: 'You create/own your products',
        meesho: "You resell Meesho's catalog products",
        winner: 'hookit',
        detail: "On Hookit, you sell your handmade art, jewelry, crafts — products you created. On Meesho, you sell mass-produced items from Meesho's catalog. No creativity or uniqueness on Meesho."
    },
    {
        feature: 'Profit Margin',
        hookit: '70-90% margin (you set price)',
        meesho: '10-20% margin (wholesale to retail spread)',
        winner: 'hookit',
        detail: 'Hookit sellers price their own products and keep 90.5% of revenue. Meesho resellers make 10-20% margin per sale because they buy at wholesale and sell at retail. Hookit is 4-9x more profitable per sale.'
    },
    {
        feature: 'Brand Building',
        hookit: 'Full brand control — your store URL',
        meesho: 'No branding — Meesho owns the customer',
        winner: 'hookit',
        detail: "Hookit gives you hookit.online/store/your-name with your logo, banner, and story. Meesho transactions happen through Meesho's app with zero seller branding. You're invisible on Meesho."
    },
    {
        feature: 'Customer Relationship',
        hookit: 'You own customer emails & phone numbers',
        meesho: 'Meesho owns all customer data',
        winner: 'hookit',
        detail: 'Hookit shares buyer contact info for fulfillment — build your own customer list for repeat sales. Meesho never shares buyer data. You cannot retarget, upsell, or build loyalty.'
    },
    {
        feature: 'Product Uniqueness',
        hookit: 'Handmade, unique, one-of-a-kind',
        meesho: 'Mass-produced, generic, commoditized',
        winner: 'hookit',
        detail: 'Hookit is for creators who make unique products. Meesho is for resellers selling the same ₹299 kurta that 10,000 other resellers are selling. Competition on Meesho is brutal.'
    },
    {
        feature: 'Pricing Control',
        hookit: 'You set your own prices freely',
        meesho: 'Meesho sets MRP, you add margin on top',
        winner: 'hookit',
        detail: "On Hookit, you price based on your time, materials, and creativity. On Meesho, you can only add 10-20% on top of Meesho's wholesale price. Your pricing power is severely limited."
    },
    {
        feature: 'Setup & Investment',
        hookit: 'Free, 5-minute setup, no inventory needed',
        meesho: 'Free, but you must buy samples to photograph',
        winner: 'tie',
        detail: 'Both are free to start. Meesho requires buying product samples to create listings (₹500-2,000 investment). Hookit requires you to already have products you made. Different starting points.'
    },
    {
        feature: 'Payout Speed',
        hookit: 'T+2 days (Pro), T+3 days (Free)',
        meesho: 'T+7 to T+15 days after delivery',
        winner: 'hookit',
        detail: 'Hookit pays T+2 days after order completion. Meesho pays 7-15 days after delivery confirmation. Cash flow is much faster on Hookit — critical for small creators.'
    },
    {
        feature: 'Return Handling',
        hookit: 'Seller-defined return policy',
        meesho: 'Meesho-mandated returns (high rate)',
        winner: 'hookit',
        detail: "Meesho has a high return rate (15-25%) because buyers order multiple sizes and return what doesn't fit. Sellers bear return costs. Hookit lets you set your own return policy and has lower return rates (5-8%)."
    },
    {
        feature: 'Product Photography',
        hookit: 'You photograph your own creations',
        meesho: 'Meesho provides catalog images',
        winner: 'tie',
        detail: 'Meesho gives you professional catalog photos — easier for resellers. Hookit requires you to photograph your handmade products (better for authentic creator branding). Different effort levels.'
    },
    {
        feature: 'Social Selling',
        hookit: 'Built for Instagram, WhatsApp, social',
        meesho: 'Built for WhatsApp sharing in groups',
        winner: 'tie',
        detail: 'Both leverage social selling. Meesho is optimized for WhatsApp group sharing (family groups, colony groups). Hookit is optimized for Instagram creators with follower bases. Different social strategies.'
    },
]

const pricingExample = {
    productPrice: 800,
    scenarios: [
        {
            platform: 'Hookit',
            revenue: 800.00,
            commission: 76.00,
            costOfGoods: 200.00,
            netProfit: 524.00,
            margin: '65.5%',
            color: 'text-green-600'
        },
        {
            platform: 'Meesho',
            revenue: 800.00,
            commission: 0.00,
            wholesaleCost: 640.00,
            shippingReturnRisk: 80.00,
            netProfit: 80.00,
            margin: '10%',
            color: 'text-red-500'
        }
    ]
}

const testimonials = [
    {
        name: 'Sneha Reddy',
        role: 'Handmade Jewelry Maker, Hyderabad',
        quote: 'I tried Meesho first. I was selling the same earrings as 500 other resellers for ₹50 profit. On Hookit, I sell my own designs for ₹400 profit per piece. Same effort, 8x more money. Plus buyers know MY brand now.',
        rating: 5
    },
    {
        name: 'Amit Kumar',
        role: 'Former Meesho Reseller, Delhi',
        quote: "Meesho's 0% commission sounds great until you do the math. After wholesale cost, shipping, and 20% return rate, I made ₹30 per ₹500 sale. On Hookit, I make ₹400+ selling my own art. I closed my Meesho account after 6 months.",
        rating: 5
    }
]

const prosCons = {
    hookit: {
        pros: [
            '70-90% profit margins on your own products',
            'Full brand control with dedicated store URL',
            'You own customer data for repeat sales',
            'Sell unique, handmade, one-of-a-kind products',
            'Complete pricing control — value your creativity',
            'T+2 day payouts — fast cash flow',
            'Lower return rates (5-8% vs 15-25% on Meesho)',
            'Instagram-native social selling built-in',
            'Build a brand, not just a side hustle',
            'GST not required under ₹20L turnover',
            'Curated marketplace — no commoditized competition',
            'Direct relationship with buyers who appreciate your work'
        ],
        cons: [
            'You must create/make your own products',
            'Requires product photography skills',
            'Smaller initial buyer base than Meesho',
            'No catalog of ready-made products to sell',
            'You handle all production and quality control',
            'Building a brand takes time vs quick Meesho sales'
        ]
    },
    meesho: {
        pros: [
            '0% commission — no platform fees',
            'No inventory investment (dropship model)',
            'Professional catalog photos provided',
            'Large existing buyer base in tier-2/3 cities',
            'WhatsApp group sharing optimized',
            'No product creation required',
            'Quick start — sell same day you sign up',
            'Wide product range (fashion, home, electronics)',
            'Meesho handles shipping and logistics',
            'Low barrier to entry for beginners'
        ],
        cons: [
            'Only 10-20% profit margins per sale',
            "Zero brand building — you're invisible",
            'Meesho owns all customer data',
            'Selling the same products as thousands of resellers',
            'Brutal price competition drives margins to zero',
            'High return rates (15-25%) eat into profits',
            'Meesho sets MRP — limited pricing power',
            'Payout delays (T+7 to T+15 days)',
            'No creativity or uniqueness in products',
            'Quality issues with catalog products damage your reputation',
            'Cannot build a sustainable long-term business',
            "Dependent on Meesho's catalog and policies"
        ]
    }
}

export default function MeeshoVsHookitPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* ComparisonPage Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ComparisonPage",
                        "name": "Hookit vs Meesho Comparison",
                        "description": "Detailed comparison of Hookit and Meesho for Indian sellers and creators",
                        "url": "https://hookit.online/compare/meesho-vs-hookit",
                        "about": [
                            {
                                "@type": "Organization",
                                "name": "Hookit",
                                "url": "https://hookit.online",
                                "founder": { "@type": "Person", "name": "Vinayak Maske" }
                            },
                            {
                                "@type": "Organization",
                                "name": "Meesho",
                                "url": "https://meesho.com"
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
                                    "value": item.winner === 'hookit' ? 'Hookit wins' : item.winner === 'meesho' ? 'Meesho wins' : 'Tie'
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
                        Hookit vs Meesho
                    </h1>
                    <p className="text-xl text-white/80 max-w-2xl mx-auto mb-6">
                        Creators vs Resellers: Which platform is right for you? 
                        A brutally honest comparison of margins, branding, and long-term value.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 text-sm">
                        <span className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                            <DollarSign className="w-4 h-4" /> Profit Margins
                        </span>
                        <span className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                            <Shield className="w-4 h-4" /> Brand Control
                        </span>
                        <span className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                            <Package className="w-4 h-4" /> Product Ownership
                        </span>
                        <span className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                            <TrendingUp className="w-4 h-4" /> Long-term Value
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
                            <strong>Choose based on your product type:</strong> Meesho is for resellers who want quick, low-margin sales of mass-produced products. Hookit is for creators who want to build a brand selling handmade, unique products with 4-9x higher margins. If you make things with your hands, Hookit is the only logical choice.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <Badge className="bg-green-100 text-green-700 border-0">Hookit wins: 6 categories</Badge>
                            <Badge className="bg-neutral-100 text-neutral-600 border-0">Tie: 6 categories</Badge>
                            <Badge className="bg-red-100 text-red-600 border-0">Meesho wins: 0 categories</Badge>
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
                        <Card key={i} className={`border-0 shadow-sm ${item.winner === 'hookit' ? 'border-l-4 border-l-[#7C3AED]' : item.winner === 'meesho' ? 'border-l-4 border-l-pink-500' : ''}`}>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                                    <div className="lg:col-span-3">
                                        <h3 className="font-semibold text-neutral-900">{item.feature}</h3>
                                        {item.winner === 'hookit' && (
                                            <Badge className="bg-[#7C3AED]/10 text-[#7C3AED] border-0 mt-2 text-xs">
                                                <CheckCircle className="w-3 h-3 mr-1" /> Hookit Wins
                                            </Badge>
                                        )}
                                        {item.winner === 'meesho' && (
                                            <Badge className="bg-pink-100 text-pink-600 border-0 mt-2 text-xs">
                                                <CheckCircle className="w-3 h-3 mr-1" /> Meesho Wins
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
                                            <div className="w-6 h-6 rounded bg-pink-100 flex items-center justify-center shrink-0 mt-0.5">
                                                <span className="text-xs font-bold text-pink-600">M</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-neutral-900">{item.meesho}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-1 flex justify-end">
                                        {item.winner === 'hookit' ? (
                                            <CheckCircle className="w-6 h-6 text-green-500" />
                                        ) : item.winner === 'meesho' ? (
                                            <CheckCircle className="w-6 h-6 text-pink-500" />
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

            {/* Real Profit Example */}
            <div className="bg-[#f8f7fb] py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-neutral-900 text-center mb-2">Real Profit Comparison</h2>
                    <p className="text-neutral-500 text-center mb-10">
                        What you actually keep on a ₹800 sale
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {pricingExample.scenarios.map((scenario) => (
                            <Card key={scenario.platform} className={`border-0 shadow-lg ${scenario.platform === 'Hookit' ? 'ring-2 ring-[#7C3AED]' : ''}`}>
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${scenario.platform === 'Hookit' ? 'bg-[#7C3AED]/10' : 'bg-pink-100'}`}>
                                            <span className={`font-bold ${scenario.platform === 'Hookit' ? 'text-[#7C3AED]' : 'text-pink-600'}`}>
                                                {scenario.platform[0]}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-neutral-900">{scenario.platform}</h3>
                                    </div>

                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-neutral-500">Sale Price</span>
                                            <span className="font-medium">₹{scenario.revenue.toFixed(2)}</span>
                                        </div>

                                        {scenario.platform === 'Hookit' ? (
                                            <>
                                                <div className="flex justify-between">
                                                    <span className="text-neutral-500">Platform Fee (9.5%)</span>
                                                    <span className="text-red-500">-₹{scenario.commission.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-neutral-500">Materials/Cost of Goods</span>
                                                    <span className="text-red-500">-₹{scenario.costOfGoods?.toFixed(2)}</span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex justify-between">
                                                    <span className="text-neutral-500">Platform Fee (0%)</span>
                                                    <span className="text-green-500">₹0.00</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-neutral-500">Wholesale Cost (80% of MRP)</span>
                                                    <span className="text-red-500">-₹{scenario.wholesaleCost?.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-neutral-500">Shipping + Return Risk (est.)</span>
                                                    <span className="text-red-500">-₹{scenario.shippingReturnRisk?.toFixed(2)}</span>
                                                </div>
                                            </>
                                        )}

                                        <div className="border-t pt-3 flex justify-between text-lg">
                                            <span className="font-bold text-neutral-900">Net Profit</span>
                                            <span className={`font-bold ${scenario.color}`}>₹{scenario.netProfit.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-neutral-500">Profit Margin</span>
                                            <Badge className={`${scenario.platform === 'Hookit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'} border-0`}>
                                                {scenario.margin}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="mt-6 text-center">
                        <Badge className="bg-green-100 text-green-700 border-0 text-sm px-4 py-2">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            You make 6.5x more profit per sale on Hookit vs Meesho
                        </Badge>
                        <p className="text-sm text-neutral-500 mt-2">
                            On 30 sales/month, that's ₹15,720 more in your pocket — enough to quit your day job
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
                                    <p className="text-sm text-neutral-500">Best for creators & makers</p>
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

                    {/* Meesho */}
                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
                                    <span className="font-bold text-pink-600">M</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900">Meesho</h3>
                                    <p className="text-sm text-neutral-500">Best for resellers & side hustles</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <h4 className="font-semibold text-green-600 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" /> Pros
                                </h4>
                                {prosCons.meesho.pros.map((pro, i) => (
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
                                {prosCons.meesho.cons.map((con, i) => (
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
                    <h2 className="text-3xl font-bold text-neutral-900 text-center mb-2">Why Creators Left Meesho</h2>
                    <p className="text-neutral-500 text-center mb-10">Real stories from Indian makers</p>

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
                                    'You make/create your own products (art, jewelry, crafts)',
                                    'You want 70-90% profit margins',
                                    'You want to build your own brand and customer base',
                                    'You have an Instagram following to leverage',
                                    'You want pricing control for your creativity',
                                    'You value uniqueness over volume',
                                    'You want to own customer data for repeat sales',
                                    'You prefer lower return rates (5-8%)',
                                    'You want fast payouts (T+2 days)',
                                    'You need GST-free selling under ₹20L',
                                    'You want a curated marketplace without commoditized competition',
                                    "You're building a long-term business, not a side hustle"
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
                            <h3 className="text-xl font-bold text-pink-600 mb-4">Choose Meesho If...</h3>
                            <ul className="space-y-3">
                                {[
                                    'You want to resell products without creating anything',
                                    'You have a large WhatsApp network (family, colony groups)',
                                    'You want zero upfront investment (no product creation)',
                                    "You're okay with 10-20% margins per sale",
                                    'You want quick sales without building a brand',
                                    'You sell in tier-2/3 cities where Meesho is popular',
                                    'You want Meesho to handle all shipping and logistics',
                                    "You don't care about product uniqueness",
                                    'You want access to a wide product catalog instantly',
                                    "You're doing this as a temporary side hustle",
                                    'You have time to handle high return rates (15-25%)',
                                    'You want to test ecommerce without any creative investment'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                                        <CheckCircle className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
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
                                q: 'Can I sell on both Hookit and Meesho?',
                                a: 'Yes, but they serve completely different purposes. Use Meesho for quick reselling of mass-market products to your WhatsApp network. Use Hookit for selling your handmade creations to Instagram followers. Many sellers start on Meesho for quick cash, then move to Hookit to build a real brand.'
                            },
                            {
                                q: 'Is Meesho really 0% commission?',
                                a: 'Technically yes — Meesho charges 0% platform fee. But you buy products at wholesale price (typically 70-80% of MRP) and resell at MRP. Your "commission" is the wholesale-to-retail spread, which is 10-20%. Hookit charges 9.5% but you keep 90.5% of YOUR price. The math favors creators on Hookit.'
                            },
                            {
                                q: 'Why do Meesho resellers switch to Hookit?',
                                a: 'Three reasons: 1) Margins — 10-20% on Meesho vs 70-90% on Hookit, 2) Brand — invisible on Meesho vs branded store on Hookit, 3) Sustainability — reselling is a race to the bottom on price. Creating unique products builds a defensible business.'
                            },
                            {
                                q: 'Can I use Meesho products and sell them on Hookit?',
                                a: "No — Hookit is for products you create or own. Reselling Meesho catalog items violates Hookit's seller agreement. Hookit is a creator marketplace, not a reseller platform. If you want to resell, Meesho is the right platform."
                            },
                            {
                                q: 'Which platform has better long-term potential?',
                                a: 'For creators: Hookit. You build a brand, own customers, and can scale by hiring help. For resellers: Meesho has volume but no moat — anyone can copy your strategy. A Hookit store becomes an asset you can sell. A Meesho reseller account has zero transferable value.'
                            },
                            {
                                q: 'Do I need GST for Meesho vs Hookit?',
                                a: 'Meesho requires GST registration for all sellers. Hookit allows selling without GST until ₹20 lakhs annual turnover. This makes Hookit ideal for creators starting out. Once you cross ₹20L, GST is mandatory on both platforms.'
                            },
                            {
                                q: 'Can I dropship on Hookit like Meesho?',
                                a: 'Hookit supports affiliate/dropship products in the Business plan, but the platform is primarily designed for creators selling their own products. Meesho is built entirely around the dropship/reseller model. If dropshipping is your main strategy, Meesho is better suited.'
                            },
                            {
                                q: 'How do return rates compare?',
                                a: "Meesho has 15-25% return rates because buyers order multiple sizes and return what doesn't fit. Sellers bear return shipping costs. Hookit has 5-8% return rates because products are unique and buyers know what they're getting. Lower returns = higher actual profit."
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
                    <ShoppingBag className="w-12 h-12 text-[#7C3AED] mx-auto mb-6" />
                    <h2 className="text-4xl font-bold mb-4">Stop reselling. Start creating.</h2>
                    <p className="text-xl text-neutral-400 mb-4">
                        Join thousands of Indian creators who chose building over reselling
                    </p>
                    <p className="text-neutral-500 mb-8">
                        6.5x higher margins • Your own brand • Customer ownership • T+2 payouts
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