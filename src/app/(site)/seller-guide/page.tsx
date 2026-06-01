// src/app/(site)/seller-guide/page.tsx
import { Rocket, CheckCircle, UserPlus, Store, Camera, Tag, CreditCard, Truck, Bell, TrendingUp, ArrowRight, AlertCircle, Lightbulb, Star, ChevronRight, Shield, Zap } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata = {
    title: 'Seller Onboarding Guide - Hookit',
    description: 'Step-by-step guide to set up your store and start selling on Hookit in under 10 minutes.',
}

const steps = [
    {
        number: '01',
        icon: UserPlus,
        title: 'Create Your Account',
        duration: '2 minutes',
        description: 'Sign up with your email and phone. Verify your account to get started.',
        details: [
            'Click "Become a Seller" on the homepage',
            'Enter your full name, email, and phone number',
            'Create a secure password (min 6 characters)',
            'Verify your email via the confirmation link',
            'Your account is ready — no lengthy KYC required upfront',
        ],
        tip: 'Use the same email you use for your Instagram/business for consistency.',
    },
    {
        number: '02',
        icon: Store,
        title: 'Set Up Your Store',
        duration: '3 minutes',
        description: 'Create your store page with name, logo, banner, and description.',
        details: [
            'Choose a unique store name (this becomes your URL: hookit.online/store/your-name)',
            'Upload a logo (square, 500x500px recommended)',
            'Upload a banner (1200x400px recommended)',
            'Write a compelling store description (tell your story)',
            'Select your primary category',
            'Add your contact email and WhatsApp number for order notifications',
        ],
        tip: 'Your store description is your elevator pitch. Tell buyers what makes you unique.',
    },
    {
        number: '03',
        icon: Camera,
        title: 'Add Your First Product',
        duration: '4 minutes',
        description: 'List a product with great photos, clear description, and competitive pricing.',
        details: [
            'Click "Add Product" from your seller dashboard',
            'Upload 3-5 high-quality product images (use natural lighting)',
            'Write a clear, keyword-rich product title',
            'Add detailed description including materials, dimensions, care instructions',
            'Set your price (compare with similar products on the platform)',
            'Choose the correct category for better discoverability',
            'Set stock quantity',
            'Enable "Active" to make it visible to buyers',
        ],
        tip: 'Products with 5+ images get 3x more views. Show different angles and use cases.',
    },
    {
        number: '04',
        icon: CreditCard,
        title: 'Add Payout Details',
        duration: '1 minute',
        description: 'Set up your bank account or UPI ID to receive earnings.',
        details: [
            'Go to Seller Settings → Payment Details',
            'Enter your bank account number and IFSC code, OR',
            'Add your UPI ID (e.g., yourname@upi)',
            'Enter account holder name (must match bank records)',
            'Add notification email and phone for payout alerts',
            'Save and verify — first payout may take 7 days for verification',
        ],
        tip: 'UPI is faster for payouts below ₹10,000. Bank transfer is better for larger amounts.',
    },
    {
        number: '05',
        icon: Tag,
        title: 'Set Your Policies',
        duration: '2 minutes',
        description: 'Configure return, shipping, and delivery policies to set buyer expectations.',
        details: [
            'Go to Store Settings → Return & Refund Policy',
            'Decide if you accept returns (recommended: Yes, 7-day window)',
            'Write your return policy details',
            'Set processing time (how fast you ship)',
            'Set delivery time estimate (5-10 days is standard)',
            'Set shipping fee or free shipping threshold',
            'Write shipping policy details',
        ],
        tip: 'Stores with clear policies get 40% more orders. Buyers trust transparency.',
    },
    {
        number: '06',
        icon: Bell,
        title: 'Get Order Notifications',
        duration: '1 minute',
        description: 'Set up WhatsApp alerts so you never miss an order.',
        details: [
            'In Store Settings, add your WhatsApp number',
            'Enable order notifications',
            'Test by placing a test order (optional)',
            'You will receive WhatsApp alerts for: new orders, payment confirmation, buyer messages',
            'Also check your seller dashboard daily for updates',
        ],
        tip: 'Respond to orders within 2 hours for better seller ratings.',
    },
    {
        number: '07',
        icon: Truck,
        title: 'Ship & Fulfill Orders',
        duration: 'Ongoing',
        description: 'Process orders, ship products, and update tracking.',
        details: [
            'When you get an order, check Seller Dashboard → Orders',
            'Confirm the order and prepare for shipping',
            'Use reliable courier: Delhivery, Blue Dart, or India Post',
            'Update order status to "Shipped" and add tracking number',
            'Share tracking with buyer via WhatsApp',
            'Mark as "Delivered" once buyer receives it',
            'Mark as "Completed" after return window expires',
        ],
        tip: 'Ship within 48 hours to get "Fast Shipper" badge on your store.',
    },
    {
        number: '08',
        icon: TrendingUp,
        title: 'Grow Your Sales',
        duration: 'Ongoing',
        description: 'Optimize your store, use featured listings, and engage with buyers.',
        details: [
            'Add more products (10+ products = 5x more store visits)',
            'Use high-quality lifestyle photos (show products in use)',
            'Enable affiliate links for products you don\'t stock',
            'Share your store link on Instagram, WhatsApp, and other social media',
            'Respond to buyer reviews and questions promptly',
            'Upgrade to Pro plan for analytics and featured listings',
            'Run promotions during festivals and sales events',
        ],
        tip: 'Sellers who share their store link on Instagram Stories see 3x more traffic.',
    },
]

const commonMistakes = [
    {
        mistake: 'Blurry or dark product photos',
        fix: 'Use natural daylight, plain background, and take photos from multiple angles',
    },
    {
        mistake: 'Vague product descriptions',
        fix: 'Include dimensions, materials, care instructions, and shipping details',
    },
    {
        mistake: 'Pricing too high or too low',
        fix: 'Research similar products. Price competitively but don\'t undervalue your work',
    },
    {
        mistake: 'Ignoring order notifications',
        fix: 'Set up WhatsApp alerts and check dashboard daily. Fast response = happy buyers',
    },
    {
        mistake: 'No return policy',
        fix: 'Always offer a return window. It builds trust and increases conversions by 25%',
    },
    {
        mistake: 'Taking buyers off-platform',
        fix: 'Never share direct payment links. All transactions must go through Hookit for protection',
    },
]

const successTips = [
    {
        icon: Star,
        title: 'Photo Quality Matters',
        description: 'Products with professional photos sell 5x more. Use a clean background, good lighting, and show scale.',
    },
    {
        icon: Zap,
        title: 'Ship Fast, Ship Safe',
        description: 'Orders shipped within 24 hours get 40% more repeat buyers. Use quality packaging.',
    },
    {
        icon: Shield,
        title: 'Build Trust with Reviews',
        description: 'Ask happy buyers to leave reviews. Stores with 10+ reviews get 3x more orders.',
    },
    {
        icon: TrendingUp,
        title: 'Price Strategically',
        description: 'Use "Compare at Price" to show discounts. Psychological pricing (₹499 vs ₹500) works.',
    },
]

export default function SellerGuidePage() {
    return (
        <div className="min-h-screen bg-white pt-20">
            {/* Hero */}
            <div className="bg-[#f8f7fb] py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="w-16 h-16 bg-[#7C3AED]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Rocket className="w-8 h-8 text-[#7C3AED]" />
                    </div>
                    <h1 className="text-5xl font-bold text-neutral-900 mb-4">
                        Start selling in 10 minutes
                    </h1>
                    <p className="text-xl text-neutral-500 max-w-2xl mx-auto mb-8">
                        Your complete step-by-step guide to setting up a successful store on Hookit. 
                        No technical skills required.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/signup">
                            <Button className="bg-[#7C3AED] hover:bg-[#6d28d9] h-12 px-8 gap-2">
                                Create Your Store
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                        <Link href="/pricing">
                            <Button variant="outline" className="h-12 px-8 border-neutral-300">
                                View Pricing
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Progress Overview */}
            <div className="py-12 border-b border-neutral-200">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between overflow-x-auto gap-4 pb-2">
                        {steps.map((step, i) => (
                            <div key={step.number} className="flex items-center gap-2 shrink-0">
                                <div className="w-10 h-10 rounded-full bg-[#7C3AED]/10 flex items-center justify-center">
                                    <step.icon className="w-5 h-5 text-[#7C3AED]" />
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-xs font-medium text-neutral-900">Step {step.number}</p>
                                    <p className="text-xs text-neutral-500">{step.title}</p>
                                </div>
                                {i < steps.length - 1 && (
                                    <ChevronRight className="w-4 h-4 text-neutral-300 hidden md:block" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Steps */}
            <div className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-12">
                        {steps.map((step) => (
                            <div key={step.number} className="relative">
                                <div className="flex items-start gap-6">
                                    <div className="hidden md:flex flex-col items-center">
                                        <div className="w-14 h-14 rounded-2xl bg-[#7C3AED] flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-[#7C3AED]/20">
                                            {step.number}
                                        </div>
                                        <div className="w-0.5 h-full bg-neutral-200 mt-4" />
                                    </div>
                                    
                                    <div className="flex-1">
                                        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                                            <CardContent className="p-6 md:p-8">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-10 h-10 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center md:hidden">
                                                        <step.icon className="w-5 h-5 text-[#7C3AED]" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <h3 className="text-xl font-bold text-neutral-900">{step.title}</h3>
                                                            <Badge variant="secondary" className="text-xs">
                                                                {step.duration}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-neutral-500">{step.description}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-3 mt-6">
                                                    {step.details.map((detail, i) => (
                                                        <div key={i} className="flex items-start gap-3">
                                                            <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                                            <span className="text-neutral-700">{detail}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                
                                                <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                                                    <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                                    <p className="text-sm text-amber-800">
                                                        <strong>Pro tip:</strong> {step.tip}
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Common Mistakes */}
            <div className="py-16 bg-[#f8f7fb]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-6 h-6 text-red-500" />
                        </div>
                        <h2 className="text-3xl font-bold text-neutral-900 mb-3">Common mistakes to avoid</h2>
                        <p className="text-neutral-500">Learn from others' mistakes and start strong</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {commonMistakes.map((item, i) => (
                            <Card key={i} className="border-0 shadow-sm">
                                <CardContent className="p-5">
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                            <span className="text-sm font-bold text-red-500">✕</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-red-600 mb-1">{item.mistake}</p>
                                            <p className="text-sm text-neutral-600">{item.fix}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Success Tips */}
            <div className="py-16">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-neutral-900 mb-3">Tips from top sellers</h2>
                        <p className="text-neutral-500">What successful Hookit sellers do differently</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {successTips.map((tip) => (
                            <Card key={tip.title} className="border-0 shadow-sm">
                                <CardContent className="p-6 text-center">
                                    <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center mx-auto mb-4">
                                        <tip.icon className="w-6 h-6 text-[#7C3AED]" />
                                    </div>
                                    <h3 className="font-semibold text-neutral-900 mb-2">{tip.title}</h3>
                                    <p className="text-sm text-neutral-600">{tip.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Video Tutorials Placeholder */}
            <div className="py-16 bg-[#f8f7fb]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-neutral-900 mb-4">Video tutorials coming soon</h2>
                    <p className="text-neutral-500 mb-8">
                        We're creating step-by-step video guides for every part of the selling process. 
                        Subscribe to get notified when they launch.
                    </p>
                    <div className="bg-white rounded-2xl p-8 shadow-sm max-w-md mx-auto">
                        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Zap className="w-8 h-8 text-neutral-400" />
                        </div>
                        <p className="text-neutral-500 mb-4">Be the first to access video tutorials</p>
                        <div className="flex gap-2">
                            <Input placeholder="Enter your email" className="h-12" />
                            <Button className="h-12 bg-[#7C3AED] hover:bg-[#6d28d9] shrink-0">
                                Notify Me
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="py-20 bg-neutral-900 text-white">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Rocket className="w-12 h-12 text-[#7C3AED] mx-auto mb-6" />
                    <h2 className="text-4xl font-bold mb-4">Ready to start your journey?</h2>
                    <p className="text-xl text-neutral-400 mb-8">
                        Thousands of creators are already selling on Hookit. Your store is 10 minutes away.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/signup">
                            <Button size="lg" className="bg-[#7C3AED] hover:bg-[#6d28d9] h-14 px-10 text-lg gap-2">
                                Create Free Store
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </Link>
                        <Link href="/help">
                            <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-neutral-600 text-white hover:bg-white hover:text-neutral-900">
                                Visit Help Center
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}