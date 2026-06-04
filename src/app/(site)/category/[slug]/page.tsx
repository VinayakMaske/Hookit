// src/app/(site)/category/[slug]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShoppingBag, ArrowLeft, ExternalLink } from 'lucide-react'

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

const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL

// Product card with stock badges
function CategoryProductCard({ product }: { product: any }) {
    const stockQty = product.stock_quantity || 0
    const isSoldOut = stockQty <= 0 && !product.affiliate_link
    const isLowStock = stockQty > 0 && stockQty <= 5 && !product.affiliate_link

    return (
        <Link
            href={`/product/${product.id}`}
            className="group block"
        >
            <div className="relative rounded-2xl overflow-hidden bg-neutral-100">
                {product.images?.[0] ? (
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className={`w-full h-auto object-contain transition-transform duration-500 ${isSoldOut ? '' : 'group-hover:scale-105'}`}
                    />
                ) : (
                    <div className="w-full aspect-[3/4] flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-neutral-300" />
                    </div>
                )}

                {/* Sold Out Overlay */}
                {isSoldOut && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
                        <div className="bg-white px-4 py-2 rounded-xl shadow-lg">
                            <p className="text-neutral-900 font-bold text-lg tracking-wider">SOLD OUT</p>
                        </div>
                    </div>
                )}

                {/* Low Stock Badge */}
                {isLowStock && (
                    <div className="absolute top-2 right-2 z-10">
                        <Badge className="bg-red-500 text-white border-0 text-xs animate-pulse">
                            Only {stockQty} left!
                        </Badge>
                    </div>
                )}

                {/* Hover overlay - shows "View Product" button */}
                {!isSoldOut && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="bg-white text-neutral-900 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                            View Hook <ExternalLink className="w-3 h-3" />
                        </span>
                    </div>
                )}

                {product.affiliate_link && (
                    <Badge className="absolute top-2 left-2 bg-[#7C3AED] text-white text-xs border-0 z-10">
                        Affiliate
                    </Badge>
                )}
            </div>

            {/* Text below image - separate from card, Pinterest-style */}
            <div className="mt-2 px-1">
                <h3 className="font-medium text-neutral-900 text-sm line-clamp-2 group-hover:text-[#7C3AED] transition-colors">
                    {product.name}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                    {product.stores?.name || 'Unknown'}
                </p>
            </div>
        </Link>
    )
}

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
    const categoryImageUrl = `${R2_PUBLIC_URL}/landing-images/categories/${slug}.jpg.jpeg`

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
                {/* ========== PRODUCTS GRID ========== */}
{products && products.length > 0 ? (
    <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4">
    {products.map((product) => (
        <div key={product.id} className="break-inside-avoid mb-4">
            <CategoryProductCard product={product} />
        </div>
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