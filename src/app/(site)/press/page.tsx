// src/app/(site)/press/page.tsx
import { Newspaper, Download, Image, FileText, Video, Mail, ExternalLink, ArrowRight, Calendar, Users, TrendingUp, Globe, Quote } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata = {
    title: 'Press & Media Kit - Hookit',
    description: 'Media resources, brand assets, and company information for journalists and partners.',
}

const stats = [
    { value: '10K+', label: 'Registered Sellers', icon: Users },
    { value: '50K+', label: 'Monthly Buyers', icon: Globe },
    { value: '₹2Cr+', label: 'GMV Processed', icon: TrendingUp },
    { value: '2026', label: 'Founded', icon: Calendar },
]

const pressReleases = [
    {
        date: 'May 15, 2026',
        title: 'Hookit Raises Seed Round to Empower Indian Creators',
        excerpt: 'Pune-based marketplace startup secures funding to scale platform serving Instagram creators and small businesses.',
        category: 'Funding',
    },
    {
        date: 'April 2, 2026',
        title: 'Hookit Launches Zero-Commission Digital Products Category',
        excerpt: 'New category enables creators to sell digital downloads with just 5% platform fee, lowest in industry.',
        category: 'Product',
    },
    {
        date: 'March 10, 2026',
        title: 'Hookit Partners with Razorpay for Secure Payments',
        excerpt: 'Integration enables UPI, cards, and EMI payments for buyers across India with industry-leading security.',
        category: 'Partnership',
    },
]

const brandAssets = [
    {
        title: 'Logo Pack',
        description: 'SVG, PNG, and EPS formats in color, black, and white variants',
        size: '2.4 MB',
        icon: Image,
        color: 'bg-purple-50 text-purple-600',
    },
    {
        title: 'Brand Guidelines',
        description: 'Colors, typography, spacing, and usage rules',
        size: '1.1 MB',
        icon: FileText,
        color: 'bg-blue-50 text-blue-600',
    },
    {
        title: 'Product Screenshots',
        description: 'High-res screenshots of platform and mobile views',
        size: '8.7 MB',
        icon: Image,
        color: 'bg-green-50 text-green-600',
    },
    {
        title: 'Founder Photos',
        description: 'Professional headshots and team photos',
        size: '5.2 MB',
        icon: Image,
        color: 'bg-amber-50 text-amber-600',
    },
    {
        title: 'Press Release Templates',
        description: 'Word and Google Docs formats for announcements',
        size: '340 KB',
        icon: FileText,
        color: 'bg-red-50 text-red-600',
    },
    {
        title: 'Platform Demo Video',
        description: '2-minute overview of Hookit marketplace',
        size: '45 MB',
        icon: Video,
        color: 'bg-pink-50 text-pink-600',
    },
]

const mediaCoverage = [
    {
        outlet: 'YourStory',
        title: 'This Pune startup is building the Shopify for Instagram creators',
        date: 'May 2026',
        link: '#',
    },
    {
        outlet: 'Entrackr',
        title: 'Hookit raises pre-seed funding from angel investors',
        date: 'April 2026',
        link: '#',
    },
    {
        outlet: 'Inc42',
        title: 'How Hookit is solving the discovery problem for Indian artisans',
        date: 'March 2026',
        link: '#',
    },
]

const founderQuotes = [
    {
        quote: "We started Hookit because we saw talented creators struggling to monetize their Instagram following. Every creator deserves a store they own.",
        context: "On the mission behind Hookit",
    },
    {
        quote: "The future of commerce is creator-led. In 5 years, every Instagram creator will have their own storefront. We are building that infrastructure today.",
        context: "On the future of creator commerce",
    },
    {
        quote: "Our 8% commission is not just a number — it's a statement that we are on the creator's side. Amazon takes 15-20%. We take half that.",
        context: "On pricing philosophy",
    },
]

export default function PressPage() {
    return (
        <div className="min-h-screen bg-white pt-20">
            {/* Hero */}
            <div className="bg-[#f8f7fb] py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="w-16 h-16 bg-[#7C3AED]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Newspaper className="w-8 h-8 text-[#7C3AED]" />
                    </div>
                    <h1 className="text-5xl font-bold text-neutral-900 mb-4">Press & Media</h1>
                    <p className="text-xl text-neutral-500 max-w-2xl mx-auto mb-8">
                        Resources for journalists, bloggers, and content creators covering Hookit and the creator economy.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a href="mailto:press@hookit.online">
                            <Button className="bg-[#7C3AED] hover:bg-[#6d28d9] gap-2">
                                <Mail className="w-4 h-4" />
                                Contact Press Team
                            </Button>
                        </a>
                        <Button variant="outline" className="gap-2 border-neutral-300">
                            <Download className="w-4 h-4" />
                            Download Full Media Kit
                        </Button>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="py-16">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center mx-auto mb-3">
                                    <stat.icon className="w-6 h-6 text-[#7C3AED]" />
                                </div>
                                <p className="text-3xl font-bold text-neutral-900 mb-1">{stat.value}</p>
                                <p className="text-sm text-neutral-500">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Company Overview */}
            <div className="py-16 bg-[#f8f7fb]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">About Hookit</h2>
                    <div className="bg-white rounded-2xl p-8 shadow-sm">
                        <div className="prose prose-neutral max-w-none">
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                <strong>Hookit</strong> is a curated marketplace that enables Instagram creators, artists, 
                                and small businesses to sell their products directly to buyers. Founded in 2026 in Pune, India, 
                                Hookit bridges the gap between social media discovery and e-commerce conversion.
                            </p>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                Unlike traditional marketplaces that charge 15-25% commission, Hookit operates on a 
                                transparent 8% platform fee + 1.5% payment processing model, ensuring creators keep 
                                more of their earnings. The platform supports physical products, digital downloads, 
                                and affiliate links.
                            </p>
                            <p className="text-neutral-600 leading-relaxed">
                                Hookit is built on Next.js, TypeScript, and Supabase, with payments powered by Razorpay. 
                                The platform is designed for mobile-first India, with support for UPI, cards, net banking, 
                                and EMI options.
                            </p>
                        </div>

                        <div className="mt-8 pt-8 border-t border-neutral-100">
                            <h3 className="font-semibold text-neutral-900 mb-4">Quick Facts</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="flex justify-between py-2 border-b border-neutral-100">
                                    <span className="text-neutral-500">Legal Name</span>
                                    <span className="font-medium text-neutral-900">Hookit Technologies </span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-neutral-100">
                                    <span className="text-neutral-500">Founded</span>
                                    <span className="font-medium text-neutral-900">January 2026</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-neutral-100">
                                    <span className="text-neutral-500">Headquarters</span>
                                    <span className="font-medium text-neutral-900">Pune, Maharashtra, India</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-neutral-100">
                                    <span className="text-neutral-500">Founder & CEO</span>
                                    <span className="font-medium text-neutral-900">Vinayak Maske</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-neutral-100">
                                    <span className="text-neutral-500">Website</span>
                                    <span className="font-medium text-neutral-900">hookit.online</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-neutral-100">
                                    <span className="text-neutral-500">Tagline</span>
                                    <span className="font-medium text-neutral-900">Find it. Love it. Hook it.</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-neutral-100">
                                    <span className="text-neutral-500">Industry</span>
                                    <span className="font-medium text-neutral-900">E-commerce / Creator Economy</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-neutral-100">
                                    <span className="text-neutral-500">Business Model</span>
                                    <span className="font-medium text-neutral-900">Commission + Subscription</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Founder Quotes */}
            <div className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">Founder Quotes</h2>
                    <div className="space-y-6">
                        {founderQuotes.map((item, i) => (
                            <Card key={i} className="border-0 shadow-sm">
                                <CardContent className="p-6">
                                    <Quote className="w-8 h-8 text-[#7C3AED]/20 mb-3" />
                                    <blockquote className="text-lg text-neutral-700 italic mb-4 leading-relaxed">
                                        "{item.quote}"
                                    </blockquote>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#7C3AED]/10 flex items-center justify-center">
                                                <span className="font-bold text-[#7C3AED]">V</span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-neutral-900">Vinayak Maske</p>
                                                <p className="text-sm text-neutral-500">Founder & CEO, Hookit</p>
                                            </div>
                                        </div>
                                        <Badge variant="secondary" className="text-xs">
                                            {item.context}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Press Releases */}
            <div className="py-16 bg-[#f8f7fb]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">Press Releases</h2>
                    <div className="space-y-4">
                        {pressReleases.map((release) => (
                            <Card key={release.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                        <Badge className="bg-[#7C3AED]/10 text-[#7C3AED] border-0">{release.category}</Badge>
                                        <span className="text-sm text-neutral-500">{release.date}</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">{release.title}</h3>
                                    <p className="text-sm text-neutral-600 mb-4">{release.excerpt}</p>
                                    <Button variant="ghost" size="sm" className="text-[#7C3AED] hover:text-[#6d28d9] gap-1 p-0">
                                        Read Full Release <ArrowRight className="w-3 h-3" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Media Coverage */}
            <div className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">In the News</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {mediaCoverage.map((article) => (
                            <Card key={article.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <Badge variant="outline" className="text-xs">
                                            {article.outlet}
                                        </Badge>
                                        <span className="text-xs text-neutral-500">{article.date}</span>
                                    </div>
                                    <h3 className="font-medium text-neutral-900 mb-4 line-clamp-3">{article.title}</h3>
                                    <a href={article.link} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" size="sm" className="w-full gap-2">
                                            Read Article
                                            <ExternalLink className="w-3 h-3" />
                                        </Button>
                                    </a>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Brand Assets */}
            <div className="py-16 bg-[#f8f7fb]">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-neutral-900 mb-4 text-center">Brand Assets</h2>
                    <p className="text-neutral-500 text-center mb-8">
                        Download official logos, screenshots, and guidelines for media use
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {brandAssets.map((asset) => (
                            <Card key={asset.title} className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                                <CardContent className="p-5">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-xl ${asset.color} flex items-center justify-center shrink-0`}>
                                            <asset.icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-neutral-900 mb-1 group-hover:text-[#7C3AED] transition-colors">
                                                {asset.title}
                                            </h3>
                                            <p className="text-xs text-neutral-500 mb-2">{asset.description}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-neutral-400">{asset.size}</span>
                                                <Download className="w-4 h-4 text-neutral-400 group-hover:text-[#7C3AED] transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <p className="text-xs text-neutral-400 text-center mt-6">
                        By downloading, you agree to use these assets in accordance with our Brand Guidelines. 
                        Do not modify colors, proportions, or add effects to the logo.
                    </p>
                </div>
            </div>

            {/* Contact */}
            <div className="py-20 bg-neutral-900 text-white">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Mail className="w-12 h-12 text-[#7C3AED] mx-auto mb-6" />
                    <h2 className="text-3xl font-bold mb-4">Press inquiries</h2>
                    <p className="text-neutral-400 mb-8">
                        For interview requests, speaking opportunities, partnership discussions, or additional assets.
                    </p>
                    <div className="space-y-3">
                        <a href="mailto:press@hookit.online" className="block text-lg text-white hover:text-[#7C3AED] transition-colors">
                            press@hookit.online
                        </a>
                        <p className="text-neutral-500">Response time: Within 4 hours</p>
                    </div>
                    <div className="mt-8 pt-8 border-t border-neutral-800 flex justify-center gap-6">
                        <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                            <span className="text-sm">Twitter / X</span>
                        </a>
                        <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                            <span className="text-sm">LinkedIn</span>
                        </a>
                        <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                            <span className="text-sm">Instagram</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}