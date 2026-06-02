// src/app/(site)/stores/page.tsx
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Store, ShoppingBag, Star, Package, ArrowRight, MapPin, Users } from 'lucide-react'

export const metadata = {
    title: 'Stores - Hookit',
    description: 'Discover all creator stores on Hookit. Find unique products from independent sellers.',
}

// Store card with preview products
async function StoreCard({ store }: { store: any }) {
    const supabase = await createClient()

    // Fetch up to 4 active products for this store
    const { data: products } = await supabase
        .from('products')
        .select('id, name, price, images, stock_quantity, affiliate_link')
        .eq('store_id', store.id)
        .eq('is_active', true)
        .gt('stock_quantity', 0)
        .order('created_at', { ascending: false })
        .limit(4)

    // Fetch store rating
    const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('status', 'approved')
        .in('product_id', products?.map((p: any) => p.id) || [])

    const averageRating = reviews && reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : null

    const totalReviews = reviews?.length || 0
    const productCount = products?.length || 0

    return (
        <Card className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
            <CardContent className="p-0">
                {/* Store Header */}
                <div className="p-6 pb-4">
                    <div className="flex items-start gap-4">
                        {/* Logo */}
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                            {store.logo_url ? (
                                <img
                                    src={store.logo_url}
                                    alt={store.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-[#7C3AED] to-[#6d28d9] flex items-center justify-center">
                                    <Store className="w-8 h-8 text-white" />
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-lg text-neutral-900 truncate">{store.name}</h3>
                                <Badge className="bg-[#7C3AED]/10 text-[#7C3AED] border-0 text-xs shrink-0">
                                    <Store className="w-3 h-3 mr-1" />
                                    Verified
                                </Badge>
                            </div>
                            
                            <p className="text-sm text-neutral-500 line-clamp-1 mb-2">
                                {store.description || 'No description'}
                            </p>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                                {store.category && (
                                    <span className="px-2.5 py-1 bg-neutral-100 rounded-full text-neutral-600 font-medium">
                                        {store.category}
                                    </span>
                                )}
                                <span className="flex items-center gap-1">
                                    <Package className="w-3.5 h-3.5" />
                                    {productCount} products
                                </span>
                                {averageRating && (
                                    <span className="flex items-center gap-1">
                                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                        {averageRating} ({totalReviews})
                                    </span>
                                )}
                                <span className="flex items-center gap-1">
                                    <Users className="w-3.5 h-3.5" />
                                    Joined {new Date(store.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Preview Grid */}
                {products && products.length > 0 ? (
                    <div className="px-6 pb-4">
                        <div className="grid grid-cols-4 gap-2">
                            {products.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/product/${product.id}`}
                                    className="group block"
                                >
                                    <div className="aspect-square rounded-xl overflow-hidden bg-neutral-100 relative">
                                        {product.images?.[0] ? (
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ShoppingBag className="w-5 h-5 text-neutral-300" />
                                            </div>
                                        )}
                                        {/* Price overlay on hover */}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">₹{product.price}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="px-6 pb-4">
                        <p className="text-sm text-neutral-400 italic">No products available</p>
                    </div>
                )}

                {/* Visit Store Button */}
                <div className="px-6 pb-6">
                    <Link href={`/store/${store.slug}`} className="block">
                        <Button 
                            className="w-full gap-2 bg-[#7C3AED] hover:bg-[#6d28d9] h-11"
                        >
                            Visit Store
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}

export default async function StoresPage() {
    const supabase = await createClient()

    // Fetch all active stores
    const { data: stores } = await supabase
        .from('stores')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

    return (
        <div className="min-h-screen bg-white pt-20">
            {/* Hero */}
            <div className="bg-[#f8f7fb] py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="w-16 h-16 bg-[#7C3AED]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Store className="w-8 h-8 text-[#7C3AED]" />
                    </div>
                    <h1 className="text-4xl font-bold text-neutral-900 mb-4">
                        Discover Creator Stores
                    </h1>
                    <p className="text-xl text-neutral-500 max-w-2xl mx-auto">
                        Explore unique stores from talented creators, artists, and small businesses across India
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 mt-6">
                        <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm text-sm text-neutral-600">
                            <MapPin className="w-4 h-4" />
                            PAN India
                        </span>
                        <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm text-sm text-neutral-600">
                            <Store className="w-4 h-4" />
                            {stores?.length || 0} Stores
                        </span>
                        <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm text-sm text-neutral-600">
                            <Package className="w-4 h-4" />
                            Verified Sellers
                        </span>
                    </div>
                </div>
            </div>

            {/* Stores Grid */}
            <div className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {stores && stores.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {stores.map((store) => (
                                <StoreCard key={store.id} store={store} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <Store className="w-16 h-16 text-neutral-200 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-neutral-900 mb-2">No stores yet</h3>
                            <p className="text-neutral-500 mb-6">
                                Stores will appear here once sellers start joining
                            </p>
                            <Link href="/signup">
                                <Button className="bg-[#7C3AED] hover:bg-[#6d28d9] gap-2">
                                    Become a Seller
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* CTA */}
            <div className="py-20 bg-neutral-900 text-white">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Store className="w-12 h-12 text-[#7C3AED] mx-auto mb-6" />
                    <h2 className="text-4xl font-bold mb-4">Have something to sell?</h2>
                    <p className="text-xl text-neutral-400 mb-8">
                        Join thousands of creators and start your own store in under 5 minutes
                    </p>
                    <Link href="/signup">
                        <Button size="lg" className="bg-[#7C3AED] hover:bg-[#6d28d9] h-14 px-10 text-lg gap-2">
                            Create Free Store
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}