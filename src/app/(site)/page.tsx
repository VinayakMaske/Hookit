
// src/app/(site)/page.tsx
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
    ArrowRight,
    Sparkles,
    Search,
    ShoppingBag,
    Store,
    Star,
    TrendingUp,
    Zap,
    Flame,
    Crown,
    Eye,
    Heart
} from 'lucide-react'

// ─── TYPES ────────────────────────────────────────────────────────

interface StoreInfo {
    name: string
    slug: string
    logo_url?: string
}

interface Product {
    id: string
    name: string
    price: number
    images?: string[]
    stock_quantity: number
    affiliate_link?: string
    category?: string
    featured?: boolean
    featured_order?: number
    compare_price?: number
    description?: string
    stores?: StoreInfo | StoreInfo[]
}

interface Store {
    id: string
    name: string
    slug: string
    logo_url?: string
    description?: string
    category?: string
    created_at: string
}

const VIOLET = '#7C3AED'

// Helper: Get R2 image URL
const getImageUrl = (path: string) => {
    const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL
    return `${r2PublicUrl}/landing-images/${path}.jpeg`
}

// ─── SERVER DATA FETCHING ─────────────────────────────────────────
async function getFeaturedProducts(): Promise<Product[]> {
    const supabase = await createClient()
    const { data } = await supabase
        .from('products')
        .select('id, name, price, images, stock_quantity, affiliate_link, category, featured, featured_order, stores(name, slug, logo_url)')
        .eq('is_active', true)
        .eq('featured', true)
        .gt('stock_quantity', 0)
        .order('featured_order', { ascending: true })
        .limit(8)
    return (data || []) as Product[]
}

async function getTopPicks(): Promise<Product[]> { 
    const supabase = await createClient()
    const { data } = await supabase
        .rpc('get_random_products', { limit_count: 8 })
    return (data || []) as Product[]
}

async function getProductOfTheDay(): Promise<Product | null> { 
    const supabase = await createClient()
    const { data } = await supabase
        .rpc('get_product_of_the_day')
    if (!data || data.length === 0) return null

    const { data: product } = await supabase
        .from('products')
        .select('*, stores(name, slug, logo_url)')
        .eq('id', data[0].id)
        .single()
    return product as Product | null
}

async function getExploreStores(): Promise<Store[]> {
    const supabase = await createClient()
    const { data } = await supabase
        .from('stores')
        .select('id, name, slug, logo_url, description, category, created_at')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(6)
    return data || []
}

async function getTrendingProducts(): Promise<Product[]> { 
    const supabase = await createClient()
    // Get products with most orders in last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data } = await supabase
        .from('products')
        .select('id, name, price, images, stock_quantity, affiliate_link, category, stores(name, slug, logo_url)')
        .eq('is_active', true)
        .gt('stock_quantity', 0)
        .order('created_at', { ascending: false })
        .limit(8)
    return (data || []) as Product[]
}

// ─── HELPERS ──────────────────────────────────────────────────────

function normalizeStoreInfo(stores: StoreInfo | StoreInfo[] | undefined): StoreInfo | undefined {
    if (!stores) return undefined
    if (Array.isArray(stores)) {
        return stores.length > 0 ? stores[0] : undefined
    }
    return stores
}

// ─── COMPONENTS ───────────────────────────────────────────────────

function StockBadge({ stock, affiliate }: { stock: number; affiliate?: string }) {
    if (affiliate) return null
    if (stock <= 0) {
        return <Badge className="bg-neutral-800 text-white border-0 text-[10px]">SOLD OUT</Badge>
    }
    if (stock <= 5) {
        return <Badge className="bg-red-500 text-white border-0 text-[10px] animate-pulse">Only {stock} left</Badge>
    }
    return null
}

function ProductCard({ product, badge }: { product: Product; badge?: React.ReactNode }) {
    const isSoldOut = (product.stock_quantity || 0) <= 0 && !product.affiliate_link
    const isFeatured = product.featured
    const storeInfo = normalizeStoreInfo(product.stores)

    return (
        <Link href={`/product/${product.id}`} className="group block">
            <div className="relative">
                {/* REMOVED fixed aspect-ratio container. Now image shows at its natural size */}
                <div className="rounded-2xl overflow-hidden bg-neutral-100">
                    {product.images?.[0] ? (
                        <img
                            src={product.images[0]}
                            alt={product.name}
                            className={`w-full h-auto object-cover ${isSoldOut ? '' : 'group-hover:scale-105 transition-transform duration-500'}`}
                        />
                    ) : (
                        <div className="w-full aspect-[3/4] flex items-center justify-center">
                            <ShoppingBag className="w-8 h-8 text-neutral-300" />
                        </div>
                    )}

                    {isSoldOut && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                            <span className="text-white font-bold text-sm tracking-wider">SOLD OUT</span>
                        </div>
                    )}

                    {/* Badge overlay */}
                    <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                        {badge}
                        <StockBadge stock={product.stock_quantity || 0} affiliate={product.affiliate_link} />
                        {product.affiliate_link && (
                            <Badge className="bg-blue-600 text-white border-0 text-[10px]">Affiliate</Badge>
                        )}
                        {isFeatured && !badge && (
                            <Badge className="bg-amber-500 text-white border-0 text-[10px]">
                                <Crown className="w-2.5 h-2.5 mr-0.5" /> Featured
                            </Badge>
                        )}
                    </div>

                    {/* Hover overlay */}
                    {!isSoldOut && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}
                </div>
            </div>
            <div className="mt-3 px-1">
                <p className="font-medium text-neutral-900 text-sm line-clamp-1 group-hover:text-[#7C3AED] transition-colors">
                    {product.name}
                </p>
                <div className="flex items-center justify-between mt-1">
                    <span className={`font-bold text-sm ${isSoldOut ? 'text-neutral-400 line-through' : 'text-neutral-900'}`}>
                        ₹{product.price}
                    </span>
                    {storeInfo?.name && (
                        <span className="text-xs text-neutral-400 truncate max-w-[80px]">
                            {storeInfo.name}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    )
}

function StoreCard({ store }: { store: Store }) {
    return (
        <Link href={`/store/${store.slug}`} className="group block">
            <Card className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden bg-white">
                <CardContent className="p-0">
                    <div className="p-5">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                                {store.logo_url ? (
                                    <img src={store.logo_url} alt={store.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-[#7C3AED] to-[#6d28d9] flex items-center justify-center">
                                        <Store className="w-6 h-6 text-white" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-neutral-900 truncate">{store.name}</h3>
                                <p className="text-xs text-neutral-500 line-clamp-1">{store.description || 'Unique creations'}</p>
                                {store.category && (
                                    <span className="inline-block mt-1 text-[10px] px-2 py-0.5 bg-neutral-100 rounded-full text-neutral-600">
                                        {store.category}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="px-5 pb-5">
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full gap-2 text-[#7C3AED] border-[#7C3AED]/30 hover:bg-[#7C3AED] hover:text-white transition-all rounded-full"
                        >
                            Visit Store <ArrowRight className="w-3 h-3" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────

export default async function LandingPage() {
    const [featuredProducts, topPicks, productOfDay, exploreStores, trendingProducts] = await Promise.all([
        getFeaturedProducts(),
        getTopPicks(),
        getProductOfTheDay(),
        getExploreStores(),
        getTrendingProducts()
    ])

    return (
        <div className="bg-white min-h-screen">
            {/* ========== HERO SECTION with SEARCH ========== */}
            <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-neutral-900">
                {/* Background gradient orbs */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#7C3AED]/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#7C3AED]/10 rounded-full blur-[100px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#7C3AED]/5 rounded-full blur-[150px]" />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
                    <div className="text-center max-w-3xl mx-auto">
                        {/* Tagline */}
                        <Badge
                            variant="secondary"
                            className="mb-8 px-5 py-2.5 text-sm bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium"
                        >
                            <Sparkles className="w-4 h-4 mr-2 text-[#7C3AED]" />
                            India's Creator Marketplace
                        </Badge>

                        {/* Headline */}
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6">
                            Find it. <span className="text-[#7C3AED]">Love it.</span><br />Hook it.
                        </h1>

                        <p className="text-lg text-neutral-400 mb-10 leading-relaxed max-w-xl mx-auto">
                            Discover unique products from Instagram creators, artists, and small businesses across India.
                        </p>

                        {/* SEARCH BAR */}
                        <div className="max-w-2xl mx-auto mb-10">
                            <form action="/explore" method="GET" className="relative">
                                <div className="relative flex items-center">
                                    <Search className="absolute left-5 w-5 h-5 text-neutral-400 z-10" />
                                    <input
                                        type="text"
                                        name="q"
                                        placeholder="Search for handmade jewelry, art, crafts..."
                                        className="w-full h-14 pl-14 pr-32 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-neutral-400 text-base outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/30 transition-all"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-2 h-10 px-6 rounded-full bg-[#7C3AED] text-white font-medium text-sm hover:bg-[#6d28d9] transition-colors"
                                    >
                                        Search
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Quick tags */}
                        <div className="flex flex-wrap justify-center gap-2">
                            {['Handmade', 'Jewelry', 'Art', 'Digital', 'Fashion'].map((tag) => (
                                <Link
                                    key={tag}
                                    href={`/explore?category=${encodeURIComponent(tag)}`}
                                    className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-neutral-300 hover:bg-white/10 hover:text-white transition-all"
                                >
                                    {tag}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
                        <div className="w-1.5 h-2.5 bg-white/60 rounded-full" />
                    </div>
                </div>
            </section>

            {/* ========== PRODUCT OF THE DAY ========== */}
            {productOfDay && (
                <section className="py-20 bg-[#f8f7fb]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center">
                                <Flame className="w-5 h-5 text-[#7C3AED]" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-neutral-900">Hook of the Day</h2>
                                <p className="text-sm text-neutral-500">Handpicked fresh every day</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-neutral-100">
                            <div className="grid lg:grid-cols-2 gap-0">
                                {/* Image */}
                                <div className="relative bg-neutral-100">
                                    {productOfDay.images?.[0] ? (
                                        <img
                                            src={productOfDay.images[0]}
                                            alt={productOfDay.name}
                                            className="w-full h-auto object-cover"
                                        />
                                    ) : (
                                        <div className="w-full aspect-square flex items-center justify-center">
                                            <ShoppingBag className="w-16 h-16 text-neutral-300" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <Badge className="bg-[#7C3AED] text-white border-0 text-sm px-4 py-1.5">
                                            <Crown className="w-3.5 h-3.5 mr-1.5" /> Hook of the Day
                                        </Badge>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-8 lg:p-12 flex flex-col justify-center">
                                    {productOfDay.stores && (
                                        <Link href={`/store/${normalizeStoreInfo(productOfDay.stores)?.slug || '#'}`} className="inline-flex items-center gap-2 mb-4 group">
                                            {normalizeStoreInfo(productOfDay.stores)?.logo_url ? (
                                                <img src={normalizeStoreInfo(productOfDay.stores)?.logo_url} className="w-6 h-6 rounded-full object-cover" alt="" />
                                            ) : (
                                                <Store className="w-5 h-5 text-neutral-400" />
                                            )}
                                            <span className="text-sm text-neutral-500 group-hover:text-[#7C3AED] transition-colors">{normalizeStoreInfo(productOfDay.stores)?.name}</span>
                                        </Link>
                                    )}

                                    <h3 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">{productOfDay.name}</h3>

                                    {productOfDay.category && (
                                        <Badge variant="secondary" className="w-fit mb-4 bg-[#7C3AED]/10 text-[#7C3AED] border-0">
                                            {productOfDay.category}
                                        </Badge>
                                    )}

                                    {productOfDay.description && (
                                        <p className="text-neutral-500 mb-6 leading-relaxed">{productOfDay.description}</p>
                                    )}

                                    <div className="flex items-baseline gap-3 mb-8">
                                        <span className="text-4xl font-bold text-neutral-900">₹{productOfDay.price}</span>
                                        {productOfDay.compare_price && (
                                            <span className="text-xl text-neutral-400 line-through">₹{productOfDay.compare_price}</span>
                                        )}
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Link href={`/product/${productOfDay.id}`} className="block">
                                            <Button size="lg" variant="outline" className="w-full h-14 rounded-full text-lg border-neutral-300">
                                                View Details
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ========== FEATURED PRODUCTS ========== */}
            {featuredProducts.length > 0 && (
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                                    <Crown className="w-5 h-5 text-amber-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-neutral-900">Featured Products</h2>
                                    <p className="text-sm text-neutral-500">Curated by our team</p>
                                </div>
                            </div>
                            <Link href="/explore?sort=featured">
                                <Button variant="ghost" className="gap-2 text-[#7C3AED] hover:text-[#7C3AED] hover:bg-[#7C3AED]/10 rounded-full">
                                    View all <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                            {featuredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    badge={
                                        <Badge className="bg-amber-500 text-white border-0 text-[10px]">
                                            <Crown className="w-2.5 h-2.5 mr-0.5" /> Featured
                                        </Badge>
                                    }
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ========== TOP PICKS (Random) ========== */}
            {topPicks.length > 0 && (
                <section className="py-20 bg-[#f8f7fb]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center">
                                    <Zap className="w-5 h-5 text-[#7C3AED]" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-neutral-900">Top Picks</h2>
                                    <p className="text-sm text-neutral-500">Fresh finds every time you visit</p>
                                </div>
                            </div>
                            <Link href="/explore">
                                <Button variant="ghost" className="gap-2 text-[#7C3AED] hover:text-[#7C3AED] hover:bg-[#7C3AED]/10 rounded-full">
                                    Explore all <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                            {topPicks.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ========== TRENDING NOW ========== */}
            {trendingProducts.length > 0 && (
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-red-500" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-neutral-900">Trending Now</h2>
                                    <p className="text-sm text-neutral-500">What's popular this week</p>
                                </div>
                            </div>
                            <Link href="/trending">
                                <Button variant="ghost" className="gap-2 text-[#7C3AED] hover:text-[#7C3AED] hover:bg-[#7C3AED]/10 rounded-full">
                                    See trending <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                            {trendingProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ========== EXPLORE OUR STORES ========== */}
            {exploreStores.length > 0 && (
                <section className="py-20 bg-[#f8f7fb]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center">
                                    <Store className="w-5 h-5 text-[#7C3AED]" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-neutral-900">Explore Our Stores</h2>
                                    <p className="text-sm text-neutral-500">Meet the creators behind the products</p>
                                </div>
                            </div>
                            <Link href="/stores">
                                <Button variant="ghost" className="gap-2 text-[#7C3AED] hover:text-[#7C3AED] hover:bg-[#7C3AED]/10 rounded-full">
                                    All stores <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {exploreStores.map((store) => (
                                <StoreCard key={store.id} store={store} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

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
                        Join thousands of creators and buyers. Your next favorite thing is one click away.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/explore">
                            <Button size="lg" className="bg-[#7C3AED] hover:bg-[#6d28d9] text-white text-lg px-10 h-14 rounded-full shadow-lg shadow-[#7C3AED]/30">
                                Explore Hooks
                            </Button>
                        </Link>
                        <Link href="/signup">
                            <Button size="lg" variant="outline" className="text-lg px-10 h-14 rounded-full border-neutral-600 text-white hover:bg-white hover:text-neutral-900">
                                Start Selling
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}