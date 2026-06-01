// src/app/(site)/blog/page.tsx
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Calendar, Clock, ArrowRight, Tag, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

export const metadata = {
    title: 'Blog - Hookit',
    description: 'Tips, guides, and stories for creators and sellers on the Hookit marketplace.',
}

const BLOG_POSTS = [
    {
        slug: 'how-to-sell-on-instagram-2026',
        title: 'How to Sell on Instagram in 2026: Complete Guide for Creators',
        excerpt: 'Learn the strategies top creators use to convert Instagram followers into paying customers. From bio optimization to Stories that sell.',
        category: 'Selling Tips',
        readTime: '8 min',
        date: 'May 28, 2026',
        image: 'blog-1.jpg',
    },
    {
        slug: 'product-photography-smartphone',
        title: 'Product Photography with Your Smartphone: Pro Results on Zero Budget',
        excerpt: 'You don\'t need a DSLR. Here\'s how to take stunning product photos using just your phone, natural light, and free editing apps.',
        category: 'Photography',
        readTime: '6 min',
        date: 'May 20, 2026',
        image: 'blog-2.jpg',
    },
    {
        slug: 'pricing-strategy-handmade-products',
        title: 'Pricing Strategy for Handmade Products: Stop Undercharging',
        excerpt: 'Most creators underprice their work. Learn how to calculate true costs, add profit margin, and price with confidence.',
        category: 'Business',
        readTime: '10 min',
        date: 'May 15, 2026',
        image: 'blog-3.jpg',
    },
    {
        slug: 'shipping-guide-small-businesses-india',
        title: 'Shipping Guide for Small Businesses in India: Delhivery, Blue Dart & More',
        excerpt: 'Compare courier services, packaging tips, and how to offer free shipping without losing money.',
        category: 'Operations',
        readTime: '7 min',
        date: 'May 10, 2026',
        image: 'blog-4.jpg',
    },
    {
        slug: 'gst-registration-creators',
        title: 'GST for Creators: When You Need It and How to Register',
        excerpt: 'Confused about GST? We break down the threshold, registration process, and how to add GST to your product pricing.',
        category: 'Legal',
        readTime: '5 min',
        date: 'May 5, 2026',
        image: 'blog-5.jpg',
    },
    {
        slug: 'success-story-artist-pune',
        title: 'Success Story: How This Pune Artist Made ₹2 Lakhs in 3 Months',
        excerpt: 'Meet Priya, a watercolor artist who turned her hobby into a full-time business using Hookit. Her journey, tips, and advice.',
        category: 'Success Stories',
        readTime: '4 min',
        date: 'April 28, 2026',
        image: 'blog-6.jpg',
    },
]

const categories = ['All', 'Selling Tips', 'Photography', 'Business', 'Operations', 'Legal', 'Success Stories']

export default async function BlogPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams
    const selectedCategory = typeof params.category === 'string' ? params.category : 'All'

    const filteredPosts = selectedCategory === 'All' 
        ? BLOG_POSTS 
        : BLOG_POSTS.filter(p => p.category === selectedCategory)

    return (
        <div className="min-h-screen bg-white pt-20">
            {/* Hero */}
            <div className="bg-[#f8f7fb] py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-bold text-neutral-900 mb-4">Hookit Blog</h1>
                    <p className="text-xl text-neutral-500 max-w-2xl mx-auto mb-8">
                        Tips, guides, and success stories to help creators grow their business
                    </p>
                    <form className="max-w-lg mx-auto relative" action="/blog" method="GET">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <Input
                            name="q"
                            placeholder="Search articles..."
                            className="pl-12 h-12 rounded-full bg-white border-neutral-200 shadow-sm"
                        />
                    </form>
                </div>
            </div>

            {/* Categories */}
            <div className="py-8 border-b border-neutral-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {categories.map((cat) => (
                            <Link
                                key={cat}
                                href={cat === 'All' ? '/blog' : `/blog?category=${encodeURIComponent(cat)}`}
                            >
                                <Badge
                                    className={`cursor-pointer px-4 py-2 text-sm ${
                                        selectedCategory === cat
                                            ? 'bg-[#7C3AED] text-white hover:bg-[#6d28d9]'
                                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                    }`}
                                >
                                    {cat}
                                </Badge>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Posts Grid */}
            <div className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map((post) => (
                            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                                <Card className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 h-full">
                                    <CardContent className="p-0">
                                        <div className="aspect-[16/10] bg-neutral-100 rounded-t-xl overflow-hidden">
                                            <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                                                <span className="text-neutral-400 text-sm">Blog Image</span>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center gap-3 mb-3">
                                                <Badge className="bg-[#7C3AED]/10 text-[#7C3AED] border-0 text-xs">
                                                    {post.category}
                                                </Badge>
                                                <span className="text-xs text-neutral-500 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" /> {post.readTime}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold text-neutral-900 mb-2 group-hover:text-[#7C3AED] transition-colors line-clamp-2">
                                                {post.title}
                                            </h3>
                                            <p className="text-sm text-neutral-500 line-clamp-3 mb-4">
                                                {post.excerpt}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-neutral-400 flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" /> {post.date}
                                                </span>
                                                <span className="text-sm text-[#7C3AED] font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                                                    Read More <ArrowRight className="w-3 h-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}