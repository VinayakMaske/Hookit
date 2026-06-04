// src/app/(site)/store/[slug]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Store, ShoppingBag, Shield, Star, Package, Users, Heart, ExternalLink, Truck, RotateCcw, Clock, CheckCircle, XCircle, Info, Tag, Grid3X3, LayoutList } from 'lucide-react'

// Product card component with stock badges
function StoreProductCard({ product }: { product: any }) {
    const stockQty = product.stock_quantity || 0
    const isSoldOut = stockQty <= 0 && !product.affiliate_link
    const isLowStock = stockQty > 0 && stockQty <= 5 && !product.affiliate_link

    return (
        <Link
            href={`/product/${product.id}`}
            className="group block"
        >
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="bg-neutral-100 relative overflow-hidden">
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

                    {/* Hover Overlay (only if not sold out) */}
                    {!isSoldOut && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="bg-white text-neutral-900 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                                View Product <ExternalLink className="w-3 h-3" />
                            </span>
                        </div>
                    )}

                    {product.affiliate_link && (
                        <Badge className="absolute top-2 left-2 bg-blue-600 text-white text-xs border-0 z-10">
                            Affiliate
                        </Badge>
                    )}

                    {product.compare_price && !isSoldOut && (
                        <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs border-0 z-10">
                            {Math.round((1 - product.price / product.compare_price) * 100)}% OFF
                        </Badge>
                    )}
                </div>
                <div className="p-3">
                    <h3 className="font-medium text-neutral-900 text-sm line-clamp-1 group-hover:text-[#7C3AED] transition-colors">
                        {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`font-bold ${isSoldOut ? 'text-neutral-400 line-through' : 'text-neutral-900'}`}>
                            ₹{product.price}
                        </span>
                        {product.compare_price && !isSoldOut && (
                            <span className="text-xs text-neutral-400 line-through">
                                ₹{product.compare_price}
                            </span>
                        )}
                        {/* Stock indicator text */}
                        {!product.affiliate_link && (
                            <span className={`text-xs ml-auto ${isSoldOut ? 'text-neutral-400' : isLowStock ? 'text-red-500' : 'text-neutral-400'}`}>
                                {isSoldOut ? 'Sold out' : `${stockQty} left`}
                            </span>
                        )}
                    </div>
                    {/* Collection tag */}
                    {product.collection && (
                        <Badge className="mt-2 bg-[#7C3AED]/10 text-[#7C3AED] border-0 text-[10px]">
                            <Tag className="w-2.5 h-2.5 mr-1" />
                            {product.collection}
                        </Badge>
                    )}
                </div>
            </div>
        </Link>
    )
}

export default async function StorePage({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { slug } = await params
    const queryParams = await searchParams
    const selectedCollection = typeof queryParams.collection === 'string' ? queryParams.collection : 'all'

    const supabase = await createClient()

    const { data: store } = await supabase
        .from('stores')
        .select('*, products(*), profiles(full_name)')
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

    if (!store) {
        notFound()
    }

    let activeProducts = store.products?.filter((p: any) => p.is_active) || []

    // Get unique collections from products
    const collections = [...new Set(
        activeProducts
            .map((p: any) => p.collection)
            .filter(Boolean)
    )].sort() as string[]

    // Filter products by collection if selected
    if (selectedCollection !== 'all' && selectedCollection) {
        activeProducts = activeProducts.filter((p: any) => p.collection === selectedCollection)
    }

    // Fetch store reviews
    const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('status', 'approved')
        .in('product_id', store.products?.map((p: any) => p.id) || [])

    const averageRating = reviews && reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : null

    const totalReviews = reviews?.length || 0

    // Check if seller has policies configured
    const hasReturnPolicy = store.accepts_returns && store.return_policy
    const hasShippingPolicy = store.shipping_policy

    return (
        <div className="min-h-screen bg-[#f8f7fb]">
            {/* Store Banner */}
            <div className="relative h-48 md:h-72 bg-neutral-900 overflow-hidden">
                {store.banner_url ? (
                    <img
                        src={store.banner_url}
                        alt={store.name}
                        className="w-full h-full object-cover opacity-80"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#7C3AED] via-[#6d28d9] to-[#5b21b6]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Store Header - Overlapping Banner */}
                <div className="relative -mt-16 mb-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            {/* Logo */}
                            <div className="w-24 h-24 md:w-28 md:h-28 bg-white rounded-2xl shadow-md overflow-hidden border-4 border-white -mt-16 md:-mt-20 ring-4 ring-[#f8f7fb]">
                                {store.logo_url ? (
                                    <img
                                        src={store.logo_url}
                                        alt={store.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-[#7C3AED] to-[#6d28d9] flex items-center justify-center">
                                        <Store className="w-10 h-10 text-white" />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">{store.name}</h1>
                                    <Badge className="bg-[#7C3AED]/10 text-[#7C3AED] border-0">
                                        <Shield className="w-3 h-3 mr-1" />
                                        Verified
                                    </Badge>
                                </div>
                                
                                <p className="text-neutral-500 mb-3 line-clamp-2 max-w-xl">
                                    {store.description || 'No description'}
                                </p>

                                <div className="flex flex-wrap items-center gap-4 text-sm">
                                    {store.category && (
                                        <span className="px-3 py-1 bg-neutral-100 rounded-full text-neutral-600 font-medium">
                                            {store.category}
                                        </span>
                                    )}
                                    
                                    <span className="flex items-center gap-1.5 text-neutral-500">
                                        <Package className="w-4 h-4" />
                                        {activeProducts.length} products
                                    </span>

                                    {averageRating && (
                                        <Link href={`/store/${slug}/reviews`} className="flex items-center gap-1.5 text-neutral-500 hover:text-[#7C3AED] transition-colors">
                                            <div className="flex items-center gap-0.5">
                                                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                                <span className="font-medium text-neutral-900">{averageRating}</span>
                                            </div>
                                            <span>({totalReviews} reviews)</span>
                                        </Link>
                                    )}

                                    <span className="flex items-center gap-1.5 text-neutral-500">
                                        <Users className="w-4 h-4" />
                                        Joined {new Date(store.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Policies Section - Below Store Info */}
<div className="mt-6 pt-6 border-t border-neutral-100">
    <div className="flex flex-wrap items-center gap-4">
        <p className="text-sm text-neutral-500 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-[#7C3AED]" />
            Store Policies:
        </p>
        
        {/* Return & Refund Policy Dialog */}
        {hasReturnPolicy ? (
            <Dialog>
                <DialogTrigger>
                    <span className="inline-flex items-center gap-1.5 text-sm text-[#7C3AED] hover:text-[#6d28d9] hover:underline transition-colors cursor-pointer">
                        <RotateCcw className="w-3.5 h-3.5" />
                        Return & Refund Policy
                    </span>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-lg">
                            <RotateCcw className="w-5 h-5 text-[#7C3AED]" />
                            Return & Refund Policy
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                            <div>
                                <p className="font-medium text-green-800">Returns Accepted</p>
                                <p className="text-sm text-green-600">{store.return_window_days || 7}-day return window</p>
                            </div>
                        </div>
                        
                        <div className="bg-neutral-50 rounded-lg p-4">
                            <h4 className="font-medium text-neutral-900 mb-2">Policy Details</h4>
                            <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-wrap">
                                {store.return_policy}
                            </p>
                        </div>

                        <div className="text-xs text-neutral-500 bg-neutral-100 rounded-lg p-3">
                            <p className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                Return window: {store.return_window_days || 7} days from delivery
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        ) : (
            <span className="inline-flex items-center gap-1.5 text-sm text-neutral-400">
                <XCircle className="w-3.5 h-3.5" />
                No Returns
            </span>
        )}

        <span className="text-neutral-300">|</span>

        {/* Shipping & Delivery Policy Dialog */}
        {hasShippingPolicy ? (
            <Dialog>
                <DialogTrigger>
                    <span className="inline-flex items-center gap-1.5 text-sm text-[#7C3AED] hover:text-[#6d28d9] hover:underline transition-colors cursor-pointer">
                        <Truck className="w-3.5 h-3.5" />
                        Shipping & Delivery Policy
                    </span>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-lg">
                            <Truck className="w-5 h-5 text-[#7C3AED]" />
                            Shipping & Delivery Policy
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-neutral-50 rounded-lg text-center">
                                <Clock className="w-5 h-5 text-[#7C3AED] mx-auto mb-1" />
                                <p className="text-sm font-medium text-neutral-900">{store.processing_time_days || 3} days</p>
                                <p className="text-xs text-neutral-500">Processing Time</p>
                            </div>
                            <div className="p-3 bg-neutral-50 rounded-lg text-center">
                                <Truck className="w-5 h-5 text-[#7C3AED] mx-auto mb-1" />
                                <p className="text-sm font-medium text-neutral-900">
                                    {store.delivery_time_days_min || 5}-{store.delivery_time_days_max || 10} days
                                </p>
                                <p className="text-xs text-neutral-500">Delivery Time</p>
                            </div>
                        </div>

                        <div className="bg-neutral-50 rounded-lg p-4">
                            <h4 className="font-medium text-neutral-900 mb-2">Shipping Details</h4>
                            <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-wrap">
                                {store.shipping_policy}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="p-3 bg-neutral-100 rounded-lg">
                                <p className="text-neutral-500 text-xs mb-1">Shipping Fee</p>
                                <p className="font-medium text-neutral-900">
                                    {store.shipping_fee > 0 ? `₹${store.shipping_fee}` : 'Free'}
                                </p>
                            </div>
                            {store.free_shipping_above && (
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <p className="text-green-600 text-xs mb-1">Free Shipping Above</p>
                                    <p className="font-medium text-green-700">₹{store.free_shipping_above}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        ) : (
            <span className="inline-flex items-center gap-1.5 text-sm text-neutral-400">
                <Info className="w-3.5 h-3.5" />
                Shipping details not set
            </span>
        )}
    </div>
</div>
                    </div>
                </div>

                {/* Collections Filter Bar */}
                {collections.length > 0 && (
                    <div className="mb-6">
                        <div className="bg-white rounded-xl shadow-sm p-4">
                            <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
                                <span className="text-sm font-medium text-neutral-500 flex items-center gap-1.5 shrink-0">
                                    <Tag className="w-4 h-4" />
                                    Collections:
                                </span>
                                
                                <Link
                                    href={`/store/${slug}`}
                                    className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                        selectedCollection === 'all' || !selectedCollection
                                            ? 'bg-[#7C3AED] text-white shadow-md'
                                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                    }`}
                                >
                                    All Products
                                </Link>

                                {collections.map((collection) => (
                                    <Link
                                        key={collection}
                                        href={`/store/${slug}?collection=${encodeURIComponent(collection)}`}
                                        className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                            selectedCollection === collection
                                                ? 'bg-[#7C3AED] text-white shadow-md'
                                                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                        }`}
                                    >
                                        {collection}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Products Grid */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-neutral-900">
                                {selectedCollection !== 'all' ? selectedCollection : 'All Products'}
                            </h2>
                            <p className="text-sm text-neutral-500">{activeProducts.length} items available</p>
                        </div>
                    </div>

                    {activeProducts.length > 0 ? (
                       <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
    {activeProducts.map((product: any) => (
        <div key={product.id} className="break-inside-avoid mb-4">
            <StoreProductCard product={product} />
        </div>
    ))}
</div>
                    ) : selectedCollection !== 'all' ? (
                        <Card className="border-0 shadow-sm bg-white">
                            <CardContent className="py-20 text-center">
                                <Tag className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-neutral-900 mb-2">No products in "{selectedCollection}"</h3>
                                <p className="text-neutral-500 mb-4">This collection doesn't have any products yet</p>
                                <Link href={`/store/${slug}`}>
                                    <Button variant="outline" className="gap-2">
                                        <Grid3X3 className="w-4 h-4" />
                                        View All Products
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-0 shadow-sm bg-white">
                            <CardContent className="py-20 text-center">
                                <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-neutral-900 mb-2">No products yet</h3>
                                <p className="text-neutral-500">This store hasn't listed any products</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Trust Footer */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div>
                            <div className="w-10 h-10 bg-[#7C3AED]/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                                <Shield className="w-5 h-5 text-[#7C3AED]" />
                            </div>
                            <p className="text-sm font-medium text-neutral-900">Secure Payments</p>
                            <p className="text-xs text-neutral-500">Razorpay protected</p>
                        </div>
                        <div>
                            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                                <Heart className="w-5 h-5 text-green-600" />
                            </div>
                            <p className="text-sm font-medium text-neutral-900">Buyer Protection</p>
                            <p className="text-xs text-neutral-500">7-day refund policy</p>
                        </div>
                        <div>
                            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                                <Star className="w-5 h-5 text-amber-600" />
                            </div>
                            <p className="text-sm font-medium text-neutral-900">Verified Reviews</p>
                            <p className="text-xs text-neutral-500">From real buyers</p>
                        </div>
                        <div>
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                                <Shield className="w-5 h-5 text-blue-600" />
                            </div>
                            <p className="text-sm font-medium text-neutral-900">Unique Products</p>
                            <p className="text-xs text-neutral-500">Verified Products</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}