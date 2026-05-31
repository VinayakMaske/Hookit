// src/app/(site)/category/[slug]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShoppingBag, ArrowLeft } from 'lucide-react'

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

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const supabase = await createClient()

    // Find category info
    const category = ALL_CATEGORIES.find(c => c.slug === slug)
    if (!category) {
        notFound()
    }

    // Fetch products for this category
    const { data: products } = await supabase
        .from('products')
        .select('*, stores(name, slug, logo_url)')
        .eq('is_active', true)
        .eq('category', category.name)
        .order('created_at', { ascending: false })

    // Build category image URL
    const categoryImageUrl = `${SUPABASE_URL}/storage/v1/object/public/landing-images/categories/${slug}.jpg`

    return (
        <div className="min-h-screen bg-white pt-20">
            {/* ========== HERO BANNER ========== */}
            <div className="relative h-72 md:h-96 overflow-hidden">
                <img
                    src={categoryImageUrl}
                    alt={category.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
                    <Badge className="mb-3 bg-white/20 text-white border-0 backdrop-blur-sm">
                        Explore
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold mb-3">{category.name}</h1>
                    <p className="text-lg md:text-xl text-white/80 max-w-xl">{category.tagline}</p>
                </div>
            </div>

            {/* ========== BACK + PRODUCTS ========== */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <Link href="/explore">
                        <Button variant="ghost" className="gap-2 text-neutral-600 hover:text-neutral-900">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Explore
                        </Button>
                    </Link>
                    <p className="text-neutral-500 text-sm">
                        {products?.length || 0} products
                    </p>
                </div>

                {/* ========== PRODUCTS GRID ========== */}
                {products && products.length > 0 ? (
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
                                    
                                    {/* Hover overlay with product name */}
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
                ) : (
                    <div className="text-center py-20">
                        <ShoppingBag className="w-16 h-16 text-neutral-200 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-neutral-900 mb-2">
                            No products in {category.name}
                        </h3>
                        <p className="text-neutral-500 mb-6">
                            Products will appear here once sellers add them to this category
                        </p>
                        <Link href="/explore">
                            <Button variant="outline" className="gap-2">
                                <ShoppingBag className="w-4 h-4" />
                                Browse All Categories
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}