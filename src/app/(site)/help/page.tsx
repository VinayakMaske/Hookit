// src/app/(site)/help/page.tsx
import { Search, MessageCircle, Truck, CreditCard, Shield, Store, Package, User, ChevronRight, HelpCircle, Mail, Phone } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

export const metadata = {
    title: 'Help Center - Hookit',
    description: 'Find answers to common questions about buying, selling, shipping, payments, and more on Hookit.',
}

const categories = [
    {
        icon: Store,
        title: 'Getting Started',
        description: 'Creating your store, first product, and account setup',
        articles: [
            'How do I create a seller account?',
            'What documents do I need to sell?',
            'How do I set up my store page?',
            'How do I list my first product?',
            'Is GST registration required?',
        ],
    },
    {
        icon: CreditCard,
        title: 'Payments & Pricing',
        description: 'Commission fees, payouts, and payment methods',
        articles: [
            'What is the commission structure?',
            'When will I receive my payout?',
            'What payment methods do buyers use?',
            'How do I add my bank account for payouts?',
            'Are there any hidden fees?',
        ],
    },
    {
        icon: Truck,
        title: 'Shipping & Delivery',
        description: 'Shipping policies, tracking, and delivery times',
        articles: [
            'How do I set shipping fees?',
            'How do I ship orders to buyers?',
            'What courier services should I use?',
            'How do I update tracking information?',
            'What if a delivery fails?',
        ],
    },
    {
        icon: Package,
        title: 'Orders & Returns',
        description: 'Managing orders, cancellations, and returns',
        articles: [
            'How do I manage incoming orders?',
            'How do I update order status?',
            'What is the return policy?',
            'How do I handle a return request?',
            'What if a buyer cancels an order?',
        ],
    },
    {
        icon: Shield,
        title: 'Trust & Safety',
        description: 'Buyer protection, disputes, and fraud prevention',
        articles: [
            'How does buyer protection work?',
            'What happens in a dispute?',
            'How do I report a fraudulent buyer?',
            'Is my payment information secure?',
            'What items are prohibited?',
        ],
    },
    {
        icon: User,
        title: 'Account & Settings',
        description: 'Profile management, verification, and closing account',
        articles: [
            'How do I verify my account?',
            'How do I change my store name?',
            'How do I update my payout details?',
            'Can I have multiple stores?',
            'How do I delete my account?',
        ],
    },
]

const popularQuestions = [
    {
        question: 'What is Hookit and how does it work?',
        answer: 'Hookit is a curated marketplace for creators, artists, and small businesses to sell their products directly to buyers. As a seller, you create a store, list products, and receive orders. We handle payment processing through Razorpay and transfer your earnings to your bank account after deducting our commission (8% platform fee + 1.5% payment processing).',
    },
    {
        question: 'How much does it cost to sell on Hookit?',
        answer: 'Creating a store and listing products is completely free. You only pay when you make a sale. Our fee is 8% platform commission + 1.5% payment processing fee (total 9.5%). For example, on a ₹1,000 sale, you receive ₹905. We also offer Pro (₹199/month, 6% commission) and Business plans (₹499/month, 3% commission) for sellers who want more features.',
    },
    {
        question: 'When do I get paid for my sales?',
        answer: 'Payouts are processed based on your plan: Starter sellers get paid T+7 days (7 days after order delivery), Pro sellers get T+3 days, and Business sellers get T+2 days. The minimum payout balance is ₹500. Your first payout may take up to 7 days for account verification. All payouts are sent directly to your registered bank account or UPI ID.',
    },
    {
        question: 'What can I sell on Hookit?',
        answer: 'You can sell handmade crafts, art, jewelry, fashion, home decor, digital products, photography, and much more. Prohibited items include: counterfeit goods, weapons, drugs, adult content, hazardous materials, and anything illegal under Indian law. Each product listing is reviewed to ensure compliance.',
    },
    {
        question: 'How do returns and refunds work?',
        answer: 'Return policies are set by individual sellers. As a seller, you can configure your return window (1-30 days) and policy details in your store settings. Buyers can request returns within your specified window. If a dispute arises, Hookit mediates between buyer and seller. For valid disputes, refunds are processed from your pending payouts.',
    },
    {
        question: 'Is my payment information secure?',
        answer: 'Absolutely. All payments are processed through Razorpay, which is PCI-DSS compliant and uses bank-grade encryption. Hookit never stores your card or bank details. We use TLS 1.3 encryption for all data transmission and Supabase for secure cloud storage. Your financial information is always protected.',
    },
    {
        question: 'Can I sell without GST registration?',
        answer: 'Yes, GST registration is not required unless your annual turnover exceeds ₹20 lakhs (₹10 lakhs for special category states). However, if you are GST registered, you can configure GST-inclusive or exclusive pricing for your products in the product creation form.',
    },
    {
        question: 'How do I handle shipping?',
        answer: 'You are responsible for shipping products to buyers. We recommend using Delhivery, Blue Dart, or India Post. You must ship orders within your specified processing time (default 3 business days). Update order status to "Shipped" and share tracking details with the buyer via WhatsApp or email.',
    },
]

export default function HelpCenterPage() {
    return (
        <div className="min-h-screen bg-white pt-20">
            {/* Hero */}
            <div className="bg-[#f8f7fb] py-16">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="w-16 h-16 bg-[#7C3AED]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <HelpCircle className="w-8 h-8 text-[#7C3AED]" />
                    </div>
                    <h1 className="text-4xl font-bold text-neutral-900 mb-4">How can we help?</h1>
                    <p className="text-lg text-neutral-500 mb-8">
                        Find answers to common questions about buying, selling, and using Hookit
                    </p>
                    <div className="relative max-w-lg mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <Input
                            placeholder="Search for answers..."
                            className="pl-12 h-14 rounded-full bg-white border-neutral-200 text-base shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-neutral-900 mb-8">Browse by topic</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((cat) => (
                            <Card key={cat.title} className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center shrink-0 group-hover:bg-[#7C3AED]/20 transition-colors">
                                            <cat.icon className="w-6 h-6 text-[#7C3AED]" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-neutral-900 mb-1 group-hover:text-[#7C3AED] transition-colors">
                                                {cat.title}
                                            </h3>
                                            <p className="text-sm text-neutral-500 mb-3">{cat.description}</p>
                                            <div className="space-y-1">
                                                {cat.articles.slice(0, 3).map((article) => (
                                                    <div key={article} className="flex items-center gap-2 text-sm text-neutral-600 hover:text-[#7C3AED] transition-colors">
                                                        <ChevronRight className="w-3 h-3" />
                                                        <span>{article}</span>
                                                    </div>
                                                ))}
                                                {cat.articles.length > 3 && (
                                                    <p className="text-sm text-[#7C3AED] font-medium mt-2">
                                                        +{cat.articles.length - 3} more articles
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Popular Questions */}
            <div className="py-16 bg-[#f8f7fb]">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-neutral-900 mb-8">Most asked questions</h2>
                    <div className="space-y-4">
                        {popularQuestions.map((faq, i) => (
                            <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="p-6">
                                    <h3 className="font-semibold text-neutral-900 mb-3 flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#7C3AED]/10 flex items-center justify-center shrink-0">
                                            <span className="text-sm font-bold text-[#7C3AED]">Q{i + 1}</span>
                                        </div>
                                        {faq.question}
                                    </h3>
                                    <p className="text-neutral-600 leading-relaxed pl-11">{faq.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Contact CTA */}
            <div className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-neutral-900 rounded-2xl p-8 md:p-12 text-center text-white">
                        <MessageCircle className="w-12 h-12 text-[#7C3AED] mx-auto mb-6" />
                        <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
                        <p className="text-neutral-400 mb-8 max-w-lg mx-auto">
                            Can't find what you're looking for? Our support team is here to help you with any questions.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="mailto:storeapp2026@gmail.com" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#7C3AED] hover:bg-[#6d28d9] rounded-full text-white font-medium transition-colors">
                                <Mail className="w-5 h-5" />
                                Email Support
                            </a>
                            <a href="https://wa.me/918459444524" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-full text-white font-medium transition-colors">
                                <Phone className="w-5 h-5" />
                                WhatsApp Support
                            </a>
                        </div>
                        <div className="mt-8 pt-8 border-t border-neutral-800 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                            <div>
                                <p className="text-neutral-400 mb-1">Email</p>
                                <p className="text-white">storeapp2026@gmail.com</p>
                            </div>
                            <div>
                                <p className="text-neutral-400 mb-1">WhatsApp</p>
                                <p className="text-white">+91 8459444524</p>
                            </div>
                            <div>
                                <p className="text-neutral-400 mb-1">Response Time</p>
                                <p className="text-white">Within 24 hours</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Links */}
            <div className="py-12 bg-[#f8f7fb]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <Link href="/privacy" className="text-center p-4 bg-white rounded-xl hover:shadow-sm transition-shadow">
                            <Shield className="w-6 h-6 text-[#7C3AED] mx-auto mb-2" />
                            <p className="text-sm font-medium text-neutral-900">Privacy Policy</p>
                        </Link>
                        <Link href="/terms" className="text-center p-4 bg-white rounded-xl hover:shadow-sm transition-shadow">
                            <HelpCircle className="w-6 h-6 text-[#7C3AED] mx-auto mb-2" />
                            <p className="text-sm font-medium text-neutral-900">Terms of Service</p>
                        </Link>
                        <Link href="/seller-agreement" className="text-center p-4 bg-white rounded-xl hover:shadow-sm transition-shadow">
                            <Store className="w-6 h-6 text-[#7C3AED] mx-auto mb-2" />
                            <p className="text-sm font-medium text-neutral-900">Seller Agreement</p>
                        </Link>
                        <Link href="/pricing" className="text-center p-4 bg-white rounded-xl hover:shadow-sm transition-shadow">
                            <CreditCard className="w-6 h-6 text-[#7C3AED] mx-auto mb-2" />
                            <p className="text-sm font-medium text-neutral-900">Pricing</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}