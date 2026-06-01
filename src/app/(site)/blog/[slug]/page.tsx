// src/app/(site)/blog/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, Share2, Tag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa'
import { Card, CardContent } from '@/components/ui/card'

const BLOG_POSTS = [
    {
        slug: 'how-to-sell-on-instagram-2026',
        title: 'How to Sell on Instagram in 2026: Complete Guide for Creators',
        excerpt: 'Learn the strategies top creators use to convert Instagram followers into paying customers.',
        category: 'Selling Tips',
        readTime: '8 min',
        date: 'May 28, 2026',
        author: 'Hookit Team',
        content: `
            <p>Instagram has evolved from a photo-sharing app to a full-fledged commerce platform. In 2026, creators who master Instagram selling are earning 3x more than those who don't.</p>
            
            <h2>1. Optimize Your Bio for Sales</h2>
            <p>Your bio is your storefront. Use a clear description, add a link to your Hookit store, and use highlights to showcase products and reviews.</p>
            
            <h2>2. Use Stories with Product Tags</h2>
            <p>Stories disappear in 24 hours, creating urgency. Tag products directly in Stories so viewers can tap and buy instantly.</p>
            
            <h2>3. Create Reels That Convert</h2>
            <p>Reels get 2x more reach than regular posts. Show your product in action, share behind-the-scenes, and add trending audio.</p>
            
            <h2>4. Build Trust with UGC</h2>
            <p>User-generated content (customer photos, reviews) builds trust. Repost customer content and tag them.</p>
            
            <h2>5. Use DM Automation Wisely</h2>
            <p>Set up quick replies for common questions. Respond within 2 hours for maximum conversion.</p>
        `,
    },
    {
        slug: 'product-photography-smartphone',
        title: 'Product Photography with Your Smartphone: Pro Results on Zero Budget',
        excerpt: 'You don\'t need a DSLR. Here\'s how to take stunning product photos using just your phone.',
        category: 'Photography',
        readTime: '6 min',
        date: 'May 20, 2026',
        author: 'Hookit Team',
        content: `
            <p>Great product photos can increase sales by 40%. The good news? Your smartphone is enough.</p>
            
            <h2>1. Lighting is Everything</h2>
            <p>Shoot near a window during golden hour (1 hour after sunrise, 1 hour before sunset). Avoid direct sunlight — use a white curtain as a diffuser.</p>
            
            <h2>2. Use a Clean Background</h2>
            <p>White poster board, wooden table, or marble surface. Keep it simple so the product stands out.</p>
            
            <h2>3. Shoot from Multiple Angles</h2>
            <p>Front, back, side, detail shots, and lifestyle shots (product in use). Minimum 5 images per product.</p>
            
            <h2>4. Edit with Free Apps</h2>
            <p>Snapseed, Lightroom Mobile, and VSCO are free and powerful. Adjust brightness, contrast, and sharpness.</p>
        `,
    },
    {
        slug: 'pricing-strategy-handmade-products',
        title: 'Pricing Strategy for Handmade Products: Stop Undercharging',
        excerpt: 'Most creators underprice their work. Learn how to calculate true costs and price with confidence.',
        category: 'Business',
        readTime: '10 min',
        date: 'May 15, 2026',
        author: 'Hookit Team',
        content: `
            <p>The #1 mistake handmade sellers make? Underpricing. If you're not making a profit, you have an expensive hobby, not a business.</p>
            
            <h2>The Pricing Formula</h2>
            <p><strong>Price = (Materials + Labor + Overhead) × Profit Margin</strong></p>
            
            <h2>1. Calculate Material Costs</h2>
            <p>Track every rupee spent on materials. Divide by number of products made from those materials.</p>
            
            <h2>2. Value Your Time</h2>
            <p>If you spend 3 hours on a product and value your time at ₹200/hour, that's ₹600 in labor.</p>
            
            <h2>3. Add Overhead</h2>
            <p>Packaging, shipping materials, tools, workspace rent. Divide monthly overhead by products sold per month.</p>
            
            <h2>4. Add Profit Margin</h2>
            <p>Multiply total cost by 2x (100% markup) minimum. For premium products, 3x or 4x is common.</p>
        `,
    },
    {
        slug: 'shipping-guide-small-businesses-india',
        title: 'Shipping Guide for Small Businesses in India',
        excerpt: 'Compare courier services, packaging tips, and how to offer free shipping without losing money.',
        category: 'Operations',
        readTime: '7 min',
        date: 'May 10, 2026',
        author: 'Hookit Team',
        content: `
            <p>Shipping can make or break your customer experience. Here's how to do it right without eating into profits.</p>
            
            <h2>Courier Comparison</h2>
            <p><strong>Delhivery:</strong> Best for e-commerce, good rates, pan-India coverage.</p>
            <p><strong>Blue Dart:</strong> Premium, faster, higher cost. Good for high-value items.</p>
            <p><strong>India Post:</strong> Cheapest for remote areas. Slower but reliable.</p>
            
            <h2>Packaging Tips</h2>
            <p>Use bubble wrap for fragile items. Branded packaging increases perceived value. Keep it light to reduce weight-based charges.</p>
            
            <h2>Free Shipping Strategy</h2>
            <p>Add shipping cost to product price. Offer "Free Shipping above ₹500" to increase average order value.</p>
        `,
    },
    {
        slug: 'gst-registration-creators',
        title: 'GST for Creators: When You Need It and How to Register',
        excerpt: 'Confused about GST? We break down the threshold, registration process, and pricing.',
        category: 'Legal',
        readTime: '5 min',
        date: 'May 5, 2026',
        author: 'Hookit Team',
        content: `
            <p>GST registration is mandatory for businesses with annual turnover above ₹20 lakhs (₹10 lakhs for special states).</p>
            
            <h2>When You DON'T Need GST</h2>
            <p>If your annual revenue is below ₹20 lakhs, GST is optional. You can still sell on Hookit without it.</p>
            
            <h2>When You NEED GST</h2>
            <p>Cross ₹20 lakhs in a financial year? You must register. Selling interstate? Register regardless of turnover.</p>
            
            <h2>How to Register</h2>
            <p>Visit gst.gov.in, fill Form GST REG-01, submit documents (PAN, Aadhaar, bank statement, address proof). Get GSTIN in 3-7 days.</p>
        `,
    },
    {
        slug: 'success-story-artist-pune',
        title: 'Success Story: How This Pune Artist Made ₹2 Lakhs in 3 Months',
        excerpt: 'Meet Priya, a watercolor artist who turned her hobby into a full-time business.',
        category: 'Success Stories',
        readTime: '4 min',
        date: 'April 28, 2026',
        author: 'Hookit Team',
        content: `
            <p>Priya Sharma, 26, was working as a graphic designer in Pune. She painted watercolors on weekends and posted them on Instagram.</p>
            
            <h2>The Turning Point</h2>
            <p>"I had 5,000 followers but zero sales. A friend told me about Hookit. I created my store in 10 minutes and listed 8 paintings."</p>
            
            <h2>First Month: ₹18,000</h2>
            <p>Priya priced her paintings at ₹1,500-₹3,000. She sold 12 pieces in the first month. "I was shocked. People actually wanted to buy my art."</p>
            
            <h2>Month Three: ₹2,10,000</h2>
            <p>By month three, Priya had 45 products listed, repeat customers, and a 4.8-star rating. She quit her job to paint full-time.</p>
            
            <h2>Her Advice</h2>
            <p>"Start before you're ready. Your first products won't be perfect. List them anyway. Improve as you go."</p>
        `,
    },
]

export async function generateStaticParams() {
    return BLOG_POSTS.map((post) => ({
        slug: post.slug,
    }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const post = BLOG_POSTS.find(p => p.slug === slug)
    
    if (!post) return { title: 'Not Found' }

    return {
        title: `${post.title} - Hookit Blog`,
        description: post.excerpt,
    }
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const post = BLOG_POSTS.find(p => p.slug === slug)

    if (!post) {
        notFound()
    }

    const relatedPosts = BLOG_POSTS
        .filter(p => p.category === post.category && p.slug !== slug)
        .slice(0, 3)

    return (
        <div className="min-h-screen bg-white pt-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Back Link */}
                <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Blog
                </Link>

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Badge className="bg-[#7C3AED]/10 text-[#7C3AED] border-0">
                            {post.category}
                        </Badge>
                        <span className="text-sm text-neutral-500 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {post.readTime}
                        </span>
                        <span className="text-sm text-neutral-500 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> {post.date}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                        {post.title}
                    </h1>
                    <p className="text-lg text-neutral-500">{post.excerpt}</p>
                </div>

                {/* Share */}
                <div className="flex items-center gap-3 mb-8 pb-8 border-b border-neutral-200">
                    <span className="text-sm text-neutral-500 flex items-center gap-1">
                        <Share2 className="w-4 h-4" /> Share:
                    </span>
                    <button className="p-2 bg-neutral-100 rounded-lg hover:bg-[#1DA1F2] hover:text-white transition-colors">
                        <FaTwitter className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-neutral-100 rounded-lg hover:bg-[#1877F2] hover:text-white transition-colors">
                        <FaFacebook className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-neutral-100 rounded-lg hover:bg-[#0A66C2] hover:text-white transition-colors">
                        <FaLinkedin className="w-4 h-4" />
                    </button>
                </div>

                {/* Content */}
                <div 
                    className="prose prose-neutral max-w-none prose-headings:font-bold prose-headings:text-neutral-900 prose-p:text-neutral-600 prose-li:text-neutral-600 prose-strong:text-neutral-900"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Author */}
                <div className="mt-12 pt-8 border-t border-neutral-200">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#7C3AED]/10 flex items-center justify-center">
                            <span className="font-bold text-[#7C3AED]">H</span>
                        </div>
                        <div>
                            <p className="font-medium text-neutral-900">{post.author}</p>
                            <p className="text-sm text-neutral-500">Content Team at Hookit</p>
                        </div>
                    </div>
                </div>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <div className="mt-12">
                        <h3 className="text-xl font-bold text-neutral-900 mb-6">Related Articles</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {relatedPosts.map((related) => (
                                <Link key={related.slug} href={`/blog/${related.slug}`} className="group block">
                                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                                        <CardContent className="p-4">
                                            <Badge className="bg-[#7C3AED]/10 text-[#7C3AED] border-0 text-xs mb-2">
                                                {related.category}
                                            </Badge>
                                            <h4 className="font-medium text-neutral-900 text-sm group-hover:text-[#7C3AED] transition-colors line-clamp-2">
                                                {related.title}
                                            </h4>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* CTA */}
                <div className="mt-12 bg-[#f8f7fb] rounded-2xl p-8 text-center">
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">Ready to start selling?</h3>
                    <p className="text-neutral-500 mb-4">Apply what you learned. Create your store in 10 minutes.</p>
                    <Link href="/signup">
                        <Button className="bg-[#7C3AED] hover:bg-[#6d28d9]">
                            Create Free Store <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}