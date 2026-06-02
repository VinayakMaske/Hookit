// src/app/(site)/explore/page.tsx
'use client'

import { useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react'

const ALL_CATEGORIES = [
    { name: 'Art & Illustration', slug: 'art-and-illustration', tagline: 'Discover unique art that speaks to your soul' },
    { name: 'Fashion & Clothing', slug: 'fashion-and-clothing', tagline: 'Wear your personality with handmade fashion' },
    { name: 'Handmade Crafts', slug: 'handmade-crafts', tagline: 'One-of-a-kind creations made with love' },
    { name: 'Jewelry & Accessories', slug: 'jewelry-and-accessories', tagline: 'Adorn yourself with artisan treasures' },
    { name: 'Home & Living', slug: 'home-and-living', tagline: 'Transform your space with creator-made decor' },
    { name: 'Digital Products', slug: 'digital-products', tagline: 'Download creativity in an instant' },
    { name: 'Photography', slug: 'photography', tagline: 'Capture moments through unique lenses' },
    { name: 'Beauty & Wellness', slug: 'beauty-and-wellness', tagline: 'Glow naturally with handmade self-care' },
    { name: 'Food & Beverages', slug: 'food-and-beverages', tagline: 'Taste the passion of artisan creators' },
    { name: 'Books & Stationery', slug: 'books-and-stationery', tagline: 'Write your story with beautiful tools' },
    { name: 'Music & Audio', slug: 'music-and-audio', tagline: 'Find your rhythm with creator-made sounds' },
    { name: 'Toys & Games', slug: 'toys-and-games', tagline: 'Playtime reimagined by creative hands' },
    { name: 'Electronics & Gadgets', slug: 'electronics-and-gadgets', tagline: 'Tech with a personal touch' },
    { name: 'Vintage & Collectibles', slug: 'vintage-and-collectibles', tagline: 'Own a piece of history' },
    { name: 'Pet Supplies', slug: 'pet-supplies', tagline: 'Spoil your furry friends with handmade love' },
    { name: 'Sports & Fitness', slug: 'sports-and-fitness', tagline: 'Gear up with passion-driven fitness' },
    { name: 'Garden & Outdoor', slug: 'garden-and-outdoor', tagline: 'Grow your paradise with creator tools' },
    { name: 'Kids & Baby', slug: 'kids-and-baby', tagline: 'Little treasures for little ones' },
    { name: 'Wedding & Party', slug: 'wedding-and-party', tagline: 'Make your special day unforgettable' },
    { name: 'Custom & Personalized', slug: 'custom-and-personalized', tagline: 'Create something uniquely yours' },
]

const INITIAL_CATEGORIES_COUNT = 10

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL

function ExploreContent() {
    const [showAll, setShowAll] = useState(false)
    const [products, setProducts] = useState<any[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [isSearching, setIsSearching] = useState(false)

    const visibleCategories = showAll ? ALL_CATEGORIES : ALL_CATEGORIES.slice(0, INITIAL_CATEGORIES_COUNT)
    const hiddenCount = ALL_CATEGORIES.length - INITIAL_CATEGORIES_COUNT

    const getCategoryImage = (slug: string) => {
        return `${SUPABASE_URL}/storage/v1/object/public/landing-images/categories/${slug}.jpg`
    }

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!searchQuery.trim()) return

        setIsSearching(true)
        const supabase = createClient()
        
        const { data } = await supabase
            .from('products')
            .select('*, stores(name, slug, logo_url)')
            .eq('is_active', true)
            .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
            .order('created_at', { ascending: false })
            .limit(20)

        setProducts(data || [])
        setIsSearching(false)
    }

    const clearSearch = () => {
        setSearchQuery('')
        setProducts([])
    }

    return (
        <div className="min-h-screen bg-white pt-20">
            {/* Search Bar */}
            <div className="bg-neutral-50 border-b border-neutral-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <h1 className="text-4xl font-bold text-neutral-900 mb-2 text-center">Explore</h1>
                    <p className="text-neutral-500 text-center mb-6">Discover unique products from creators</p>
                    
                    <form className="max-w-2xl mx-auto" onSubmit={handleSearch}>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                            <Input
                                name="q"
                                placeholder="Search products, creators, categories..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-14 bg-white border-neutral-200 text-base rounded-full shadow-sm"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#7C3AED] hover:underline"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search Results */}
                {searchQuery && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                            {isSearching ? 'Searching...' : `${products.length} results for "${searchQuery}"`}
                        </h2>

                        {products.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {products.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/product/${product.id}`}
                                        className="group block"
                                    >
                                        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-100">
                                            {product.images?.[0] ? (
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ShoppingBag className="w-8 h-8 text-neutral-300" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            
                                            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                                <p className="text-white font-medium text-sm line-clamp-2 drop-shadow-lg">
                                                    {product.name}
                                                </p>
                                                <p className="text-white/70 text-xs mt-1">
                                                    by {product.stores?.name || 'Unknown'}
                                                </p>
                                            </div>

                                            {product.affiliate_link && (
                                                <Badge className="absolute top-2 left-2 bg-[#7C3AED] text-white text-xs border-0">
                                                    Affiliate
                                                </Badge>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : !isSearching && (
                            <div className="text-center py-20">
                                <ShoppingBag className="w-16 h-16 text-neutral-200 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-neutral-900 mb-2">No products found</h3>
                                <p className="text-neutral-500 mb-6">Try a different search term</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Category Grid */}
                {!searchQuery && (
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-6">Browse by Category</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {visibleCategories.map((cat) => (
                                <Link
                                    key={cat.name}
                                    href={`/category/${cat.slug}`}
                                    className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300"
                                >
                                    <img
                                        src={getCategoryImage(cat.slug)}
                                        alt={cat.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                                        <h3 className="text-lg font-bold text-center text-white drop-shadow-lg">
                                            {cat.name}
                                        </h3>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Show More / Show Less Button */}
                        {ALL_CATEGORIES.length > INITIAL_CATEGORIES_COUNT && (
                            <div className="flex justify-center mt-8">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowAll(!showAll)}
                                    className="gap-2 h-12 px-8 rounded-full border-neutral-300 hover:border-[#7C3AED] hover:text-[#7C3AED] transition-all"
                                >
                                    {showAll ? (
                                        <>
                                            <ChevronUp className="w-4 h-4" />
                                            Show Less
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDown className="w-4 h-4" />
                                            Show {hiddenCount} More Categories
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* Trending Products */}
                {!searchQuery && products.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold text-neutral-900 mb-6">Trending Now</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {products.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/product/${product.id}`}
                                    className="group block"
                                >
                                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-100">
                                        {product.images?.[0] ? (
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ShoppingBag className="w-8 h-8 text-neutral-300" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        
                                        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                            <p className="text-white font-medium text-sm line-clamp-2 drop-shadow-lg">
                                                {product.name}
                                            </p>
                                            <p className="text-white/70 text-xs mt-1">
                                                by {product.stores?.name || 'Unknown'}
                                            </p>
                                        </div>

                                        {product.affiliate_link && (
                                            <Badge className="absolute top-2 left-2 bg-[#7C3AED] text-white text-xs border-0">
                                                Affiliate
                                            </Badge>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default function ExplorePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center pt-20">
                <div className="animate-spin w-8 h-8 border-2 border-[#7C3AED] border-t-transparent rounded-full" />
            </div>
        }>
            <ExploreContent />
        </Suspense>
    )
}