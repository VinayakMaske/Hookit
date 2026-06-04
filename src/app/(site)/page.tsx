// src/app/(site)/page.tsx
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Sparkles, Heart, Eye, ShoppingBag, Search } from 'lucide-react'

// Deep Violet accent color
const VIOLET = '#7C3AED'

// 10 categories for landing page
const LANDING_CATEGORIES = [
    { name: 'Art & Illustration', slug: 'art-and-illustration' },
    { name: 'Fashion & Clothing', slug: 'fashion-and-clothing' },
    { name: 'Handmade Crafts', slug: 'handmade-crafts' },
    { name: 'Jewelry & Accessories', slug: 'jewelry-and-accessories' },
    { name: 'Home & Living', slug: 'home-and-living' },
    { name: 'Digital Products', slug: 'digital-products' },
    { name: 'Beauty & Wellness', slug: 'beauty-and-wellness' },
    { name: 'Food & Beverages', slug: 'food-and-beverages' },
    { name: 'Books & Stationery', slug: 'books-and-stationery' },
    { name: 'Photography', slug: 'photography' },
]

const getImageUrl = (path: string) => {
    const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL
    return `${r2PublicUrl}/landing-images/${path}.jpeg`
}

export default async function LandingPage() {
    const supabase = await createClient()

    // Build category image URL
    const getCategoryImage = (slug: string) => {
        return getImageUrl(`categories/${slug}.jpg`)
    }

    return (
        <div className="bg-white">
            {/* ========== HERO SECTION ========== */}
            <section className="relative min-h-screen flex items-center overflow-hidden bg-[#f8f7fb]">
                <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-[#7C3AED]/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-20 w-[400px] h-[400px] bg-[#7C3AED]/8 rounded-full blur-3xl" />
                
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-screen py-24">
                        {/* Left: Text */}
                        <div className="max-w-xl">
                            <Badge 
                                variant="secondary" 
                                className="mb-6 px-4 py-2 text-sm bg-white shadow-sm border-0 text-[#7C3AED] font-medium"
                            >
                                <Sparkles className="w-4 h-4 mr-2 text-[#7C3AED]" />
                                Creator first marketplace
                            </Badge>

                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-neutral-900 tracking-tight leading-[1.1] mb-6">
                                Find it.<br />
                                <span className="text-[#7C3AED]">Love it.</span><br />
                                Hook it.
                            </h1>

                            <p className="text-lg text-neutral-500 mb-8 leading-relaxed max-w-md">
                                Discover unique hooks from Instagram creators, artists, and small businesses. 
                                No account needed to shop.
                            </p>

                            <div className="flex flex-col sm:flex-row items-start gap-4">
                                <Link href="/explore">
                                    <Button 
                                        size="lg" 
                                        className="gap-2 text-lg px-8 h-14 rounded-full shadow-lg shadow-[#7C3AED]/20 hover:shadow-xl hover:shadow-[#7C3AED]/30 transition-all"
                                        style={{ backgroundColor: '#7C3AED' }}
                                    >
                                        Explore Hooks
                                        <ArrowRight className="w-5 h-5" />
                                    </Button>
                                </Link>
                                <Link href="/signup">
                                    <Button 
                                        size="lg" 
                                        variant="outline" 
                                        className="gap-2 text-lg px-8 h-14 rounded-full border-neutral-300 hover:border-[#7C3AED] hover:text-[#7C3AED] transition-all"
                                    >
                                        <ShoppingBag className="w-5 h-5" />
                                        Start Selling
                                    </Button>
                                </Link>
                            </div>

                            <div className="flex flex-wrap gap-3 mt-10">
                                {['Handmade', 'Unique', 'Creator-owned'].map((tag) => (
                                    <span 
                                        key={tag} 
                                        className="px-4 py-2 bg-white rounded-full text-sm text-neutral-600 shadow-sm border border-neutral-100"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Right: Floating Product Images */}
                        <div className="relative hidden lg:block h-[600px]">
                            {/* Main large image */}
                            <div className="absolute top-0 right-0 w-72 h-96 rounded-3xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 bg-neutral-200">
                                <img
                                    src={getImageUrl('main-1.jpg')}
                                    alt="Featured product"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            
                            {/* Secondary image */}
                            <div className="absolute top-20 left-0 w-56 h-72 rounded-3xl overflow-hidden shadow-xl -rotate-2 hover:rotate-0 transition-transform duration-500 bg-neutral-200">
                                <img
                                    src={getImageUrl('main-2.jpg')}
                                    alt="Featured product"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Small accent image */}
                            <div className="absolute bottom-10 right-20 w-48 h-64 rounded-3xl overflow-hidden shadow-lg rotate-6 hover:rotate-0 transition-transform duration-500 bg-neutral-200">
                                <img
                                    src={getImageUrl('main-3.jpg')}
                                    alt="Featured product"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Floating stat card */}
                            <div className="absolute bottom-0 left-10 bg-white rounded-2xl p-4 shadow-lg border border-neutral-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#7C3AED]/10 flex items-center justify-center">
                                        <Heart className="w-5 h-5 text-[#7C3AED]" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold text-neutral-900">10K+</p>
                                        <p className="text-xs text-neutral-500">Happy buyers</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== FEATURE SECTION 1: DISCOVER ========== */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left: Image mockup with real images */}
                        <div className="relative">
                            <div className="bg-[#f8f7fb] rounded-[2.5rem] p-8 relative overflow-hidden">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-4">
                                        <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                                            <img
                                                src={getImageUrl('discover-1.jpg')}
                                                alt="Discover products"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="aspect-square rounded-2xl overflow-hidden">
                                            <img
                                                src={getImageUrl('discover-2.jpg')}
                                                alt="Discover products"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4 pt-8">
                                        <div className="aspect-square rounded-2xl overflow-hidden">
                                            <img
                                                src={getImageUrl('discover-3.jpg')}
                                                alt="Discover products"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                                            <img
                                                src={getImageUrl('discover-4.jpg')}
                                                alt="Discover products"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Floating search pill */}
                                <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
                                    <Search className="w-4 h-4 text-neutral-400" />
                                    <span className="text-sm text-neutral-600">Handmade ceramics</span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Text */}
                        <div className="max-w-md">
                            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6 leading-tight">
                                Discover things<br />
                                <span className="text-[#7C3AED]">you'll love</span>
                            </h2>
                            <p className="text-lg text-neutral-500 mb-8 leading-relaxed">
                                Browse through thousands of unique hooks from independent creators. 
                                From handmade jewelry to digital art — find something that speaks to you.
                            </p>
                            <Link href="/explore">
                                <Button 
                                    className="gap-2 rounded-full px-6 h-12"
                                    style={{ backgroundColor: '#7C3AED' }}
                                >
                                    Start Exploring
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== FEATURE SECTION 2: SELL ========== */}
            <section className="py-24 bg-[#f8f7fb]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left: Text */}
                        <div className="max-w-md lg:order-1 order-2">
                            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6 leading-tight">
                                Turn your passion<br />
                                <span className="text-[#7C3AED]">into profit</span>
                            </h2>
                            <p className="text-lg text-neutral-500 mb-8 leading-relaxed">
                                Set up your store in under 5 minutes. Instant setup, 
                                and full control over your brand. Your creations deserve an audience.
                            </p>
                            
                            <div className="space-y-4 mb-8">
                                {[
                                    { icon: ShoppingBag, text: 'Set up in 5 minutes' },
                                    { icon: Heart, text: 'Create unique hooks' },
                                    { icon: Eye, text: 'Reach thousands of buyers' },
                                ].map((item) => (
                                    <div key={item.text} className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#7C3AED]/10 flex items-center justify-center">
                                            <item.icon className="w-4 h-4 text-[#7C3AED]" />
                                        </div>
                                        <span className="text-neutral-700 font-medium">{item.text}</span>
                                    </div>
                                ))}
                            </div>

                            <Link href="/signup">
                                <Button 
                                    variant="outline"
                                    className="gap-2 rounded-full px-6 h-12 border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white transition-all"
                                >
                                    Become a Seller
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>

                        {/* Right: Store preview with real image */}
                        <div className="lg:order-2 order-1">
                            <div className="bg-white rounded-[2.5rem] p-6 shadow-xl relative">
                                <div className="rounded-2xl overflow-hidden aspect-[4/3] mb-4">
                                    <img
                                        src={getImageUrl('sell-1.jpg')}
                                        alt="Store preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex items-center gap-3 px-2">
                                    <div className="w-12 h-12 rounded-full bg-neutral-200" />
                                    <div>
                                        <p className="font-semibold text-neutral-900">Your Store Name</p>
                                        <p className="text-sm text-neutral-500">120 products • 2.5K followers</p>
                                    </div>
                                </div>
                                
                                {/* Floating badge */}
                                <div className="absolute -top-4 -right-4 bg-[#7C3AED] text-white rounded-2xl px-4 py-3 shadow-lg">
                                    <p className="text-xs font-medium">New Order!</p>
                                    <p className="text-lg font-bold">₹1,299</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== CATEGORIES SECTION (Pinterest-style grid) ========== */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-4xl font-bold text-neutral-900 mb-2">Browse by category</h2>
                            <p className="text-neutral-500">Whatever you're into, there's a creator making it</p>
                        </div>
                        <Link href="/explore">
                            <Button 
                                variant="ghost" 
                                className="gap-2 text-[#7C3AED] hover:text-[#7C3AED] hover:bg-[#7C3AED]/10 rounded-full"
                            >
                                View all <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {LANDING_CATEGORIES.map((cat) => {
                            const imageUrl = getCategoryImage(cat.slug)
                            return (
                                <Link
                                    key={cat.name}
                                    href={`/explore?category=${encodeURIComponent(cat.name)}`}
                                    className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300"
                                >
                                    <img
                                        src={imageUrl}
                                        alt={cat.name}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                                    <div className="absolute inset-0 flex items-center justify-center p-4">
                                        <h3 className="text-lg font-bold text-center text-white drop-shadow-lg">
                                            {cat.name}
                                        </h3>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* ========== CTA SECTION ========== */}
            <section className="py-24 bg-neutral-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#7C3AED] rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#7C3AED] rounded-full blur-3xl" />
                </div>
                
                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-5xl font-bold mb-6">
                        Ready to get <span className="text-[#7C3AED]">hooked</span>?
                    </h2>
                    <p className="text-xl text-neutral-400 mb-10 max-w-2xl mx-auto">
                        Join thousands of creators and buyers on Hookit. 
                        Your next favorite thing is one click away.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/explore">
                            <Button 
                                size="lg" 
                                className="bg-[#7C3AED] hover:bg-[#6d28d9] text-white text-lg px-10 h-14 rounded-full shadow-lg shadow-[#7C3AED]/30"
                            >
                                Explore Hooks
                            </Button>
                        </Link>
                        <Link href="/signup">
                            <Button 
                                size="lg" 
                                variant="outline" 
                                className="text-lg px-10 h-14 rounded-full border-neutral-600 text-white hover:bg-white hover:text-neutral-900"
                            >
                                Start Selling
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}