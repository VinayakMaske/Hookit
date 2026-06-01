// src/app/(site)/store/[slug]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Store, ShoppingBag, MapPin, Phone, Mail, Shield, Star, Package, Users, Heart, ExternalLink } from 'lucide-react'

export default async function StorePage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
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

    const activeProducts = store.products?.filter((p: any) => p.is_active) || []

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

    return (
        <div className="min-h-screen bg-[#f8f7fb] pt-20">
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

                            {/* Actions */}
                            <div className="flex flex-col gap-2 shrink-0">
                                <Link href={`/store/${slug}/reviews`}>
                                    <Button variant="outline" className="w-full gap-2 rounded-full border-neutral-200">
                                        <Star className="w-4 h-4" />
                                        Read Reviews
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-neutral-900">All Products</h2>
                            <p className="text-sm text-neutral-500">{activeProducts.length} items available</p>
                        </div>
                    </div>

                    {activeProducts.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {activeProducts.map((product: any) => (
                                <Link
                                    key={product.id}
                                    href={`/product/${product.id}`}
                                    className="group block"
                                >
                                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                                        <div className="aspect-[3/4] bg-neutral-100 relative overflow-hidden">
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
                                            
                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <span className="bg-white text-neutral-900 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                                                    View Product <ExternalLink className="w-3 h-3" />
                                                </span>
                                            </div>

                                            {product.affiliate_link && (
                                                <Badge className="absolute top-2 left-2 bg-blue-600 text-white text-xs border-0">
                                                    Affiliate
                                                </Badge>
                                            )}

                                            {product.compare_price && (
                                                <Badge className="absolute top-2 right-2 bg-red-500 text-white text-xs border-0">
                                                    {Math.round((1 - product.price / product.compare_price) * 100)}% OFF
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="p-3">
                                            <h3 className="font-medium text-neutral-900 text-sm line-clamp-1 group-hover:text-[#7C3AED] transition-colors">
                                                {product.name}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="font-bold text-neutral-900">₹{product.price}</span>
                                                {product.compare_price && (
                                                    <span className="text-xs text-neutral-400 line-through">
                                                        ₹{product.compare_price}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
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
                                <Phone className="w-5 h-5 text-blue-600" />
                            </div>
                            <p className="text-sm font-medium text-neutral-900">Direct Support</p>
                            <p className="text-xs text-neutral-500">Chat with seller</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}