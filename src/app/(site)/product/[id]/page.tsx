// src/app/(site)/product/[id]/page.tsx - FULL UPDATED VERSION
'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ExternalLink, ShoppingBag, Store, ArrowLeft, Truck, Shield, Clock, Lock, BadgeCheck, Star, AlertTriangle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useEffect } from 'react'
import OrderProtectionBadge from '@/components/order-protection-badge'

export default function ProductPage() {
    const params = useParams()
    const id = params.id as string

    const [product, setProduct] = useState<any>(null)
    const [relatedProducts, setRelatedProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [mainImageIndex, setMainImageIndex] = useState(0)
    const [reviews, setReviews] = useState<any[]>([])

    useEffect(() => {
        fetchProduct()
    }, [id])

    const fetchProduct = async () => {
        const supabase = createClient()
        
        const { data: productData } = await supabase
            .from('products')
            .select('*, stores(*)')
            .eq('id', id)
            .eq('is_active', true)
            .single()

        if (!productData) {
            setLoading(false)
            return
        }

        setProduct(productData)

        // Fetch reviews
        const { data: reviewsData } = await supabase
            .from('reviews')
            .select('*')
            .eq('product_id', id)
            .eq('status', 'approved')
            .order('created_at', { ascending: false })
            .limit(5)

        setReviews(reviewsData || [])

        // Fetch related products
        const { data: related } = await supabase
            .from('products')
            .select('id, name, price, images, category, affiliate_link')
            .eq('is_active', true)
            .neq('id', id)
            .or(`store_id.eq.${productData.store_id},category.eq.${productData.category}`)
            .limit(4)

        setRelatedProducts(related || [])
        setLoading(false)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-neutral-200 border-t-[#7C3AED] rounded-full animate-spin" />
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
                <p className="text-neutral-500">Product not found</p>
            </div>
        )
    }

    const isAffiliate = !!product.affiliate_link
    const hasImages = product.images && product.images.length > 0
    const allImages = product.images || []
    const mainImage = allImages[mainImageIndex] || allImages[0]

    const handleThumbnailClick = (index: number) => {
        setMainImageIndex(index)
    }

    const averageRating = reviews.length > 0 
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : '0'

    return (
        <div className="min-h-screen bg-white pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <Link
                    href="/explore"
                    className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Explore
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                    {/* Images */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-neutral-100 rounded-2xl overflow-hidden relative group">
                            {hasImages ? (
                                <img
                                    src={mainImage}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <ShoppingBag className="w-16 h-16 text-neutral-300" />
                                </div>
                            )}
                        </div>

                        {allImages.length > 1 && (
                            <div className="grid grid-cols-4 gap-3">
                                {allImages.slice(0, 5).map((img: string, i: number) => (
                                    <button
                                        key={i}
                                        onClick={() => handleThumbnailClick(i)}
                                        className={`aspect-square bg-neutral-100 rounded-lg overflow-hidden border-2 transition-all ${
                                            mainImageIndex === i
                                                ? 'border-[#7C3AED] ring-2 ring-[#7C3AED]/20'
                                                : 'border-transparent hover:border-neutral-300'
                                        }`}
                                    >
                                        <img
                                            src={img}
                                            alt={`${product.name} ${i + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        {/* Store Badge */}
                        <Link
                            href={`/store/${product.stores?.slug}`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-full hover:bg-neutral-200 transition-colors"
                        >
                            {product.stores?.logo_url ? (
                                <img
                                    src={product.stores.logo_url}
                                    alt={product.stores.name}
                                    className="w-6 h-6 rounded-full object-cover"
                                />
                            ) : (
                                <Store className="w-5 h-5 text-neutral-500" />
                            )}
                            <span className="text-sm font-medium text-neutral-700">
                                {product.stores?.name || 'Unknown Store'}
                            </span>
                        </Link>

                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-3">
                                {product.name}
                            </h1>
                            {product.category && (
                                <Badge variant="secondary" className="mb-4">
                                    {product.category}
                                </Badge>
                            )}
                        </div>

                        {/* Rating */}
                        {reviews.length > 0 && (
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star 
                                            key={star} 
                                            className={`w-4 h-4 ${star <= Math.round(parseFloat(averageRating)) ? 'text-amber-400 fill-amber-400' : 'text-neutral-300'}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm font-medium text-neutral-900">{averageRating}</span>
                                <span className="text-sm text-neutral-500">({reviews.length} reviews)</span>
                            </div>
                        )}

                        {/* Price */}
                        <div className="flex items-baseline gap-3">
                            <span className="text-4xl font-bold text-neutral-900">₹{product.price}</span>
                            {product.compare_price && (
                                <>
                                    <span className="text-xl text-neutral-400 line-through">
                                        ₹{product.compare_price}
                                    </span>
                                    <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                                        {Math.round((1 - product.price / product.compare_price) * 100)}% OFF
                                    </Badge>
                                </>
                            )}
                        </div>

                        {/* Order Protection Badge */}
                        <div className="flex items-center gap-3 py-2">
                            <OrderProtectionBadge size="md" variant="green" />
                            <div className="flex items-center gap-1 text-sm text-neutral-500">
                                <Lock className="w-3.5 h-3.5" />
                                <span>Secure payment</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-neutral-500">
                                <BadgeCheck className="w-3.5 h-3.5" />
                                <span>Verified seller</span>
                            </div>
                        </div>

                        {/* Description */}
                        {product.description && (
                            <p className="text-neutral-600 leading-relaxed text-lg">
                                {product.description}
                            </p>
                        )}

                        <Separator />

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-3 bg-neutral-50 rounded-lg">
                                <Shield className="w-5 h-5 mx-auto mb-1 text-neutral-600" />
                                <p className="text-xs font-medium text-neutral-700">Verified Seller</p>
                            </div>
                            <div className="text-center p-3 bg-neutral-50 rounded-lg">
                                <Lock className="w-5 h-5 mx-auto mb-1 text-neutral-600" />
                                <p className="text-xs font-medium text-neutral-700">Secure Payment</p>
                            </div>
                            <div className="text-center p-3 bg-neutral-50 rounded-lg">
                                <Clock className="w-5 h-5 mx-auto mb-1 text-neutral-600" />
                                <p className="text-xs font-medium text-neutral-700">24/7 Support</p>
                            </div>
                        </div>

                        {/* Buyer Protection Card */}
                        <Card className="border-0 shadow-sm bg-green-50/50 border border-green-100">
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <Shield className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-green-800 text-sm">Buyer Protection</p>
                                        <p className="text-xs text-green-600 mt-1">
                                            Your payment is held securely until you receive your order. 
                                            If the product is not as described, you can request a full refund within 7 days.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Anti-Leakage Warning */}
                        <Card className="border-0 shadow-sm bg-amber-50/50 border border-amber-100">
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-amber-800 text-sm">Stay Protected</p>
                                        <p className="text-xs text-amber-600 mt-1">
                                            Always complete your purchase on Hookit. Never pay the seller directly outside the platform. 
                                            Off-platform transactions are not covered by our Buyer Protection.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <div className="space-y-3 pt-4">
                            {isAffiliate ? (
                                <a
                                    href={product.affiliate_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block"
                                >
                                    <Button size="lg" className="w-full h-14 text-lg gap-2 bg-blue-600 hover:bg-blue-700">
                                        <ExternalLink className="w-5 h-5" />
                                        Buy via Affiliate Link
                                    </Button>
                                </a>
                            ) : (
                                <Link href={`/checkout?product=${product.id}`} className="block">
                                    <Button size="lg" className="w-full h-14 text-lg gap-2 bg-neutral-900 hover:bg-neutral-800">
                                        <ShoppingBag className="w-5 h-5" />
                                        Buy Now — Protected Checkout
                                    </Button>
                                </Link>
                            )}

                            {isAffiliate && (
                                <p className="text-sm text-neutral-500 text-center">
                                    You'll be redirected to the seller's external store
                                </p>
                            )}
                        </div>

                        {/* Store Info Card */}
                        <Card className="border-0 shadow-sm bg-neutral-50">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                    {product.stores?.logo_url ? (
                                        <img
                                            src={product.stores.logo_url}
                                            alt={product.stores.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-neutral-200 rounded-full flex items-center justify-center">
                                            <Store className="w-6 h-6 text-neutral-500" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-neutral-900">{product.stores?.name}</h4>
                                        <p className="text-sm text-neutral-500 line-clamp-1">
                                            {product.stores?.description || 'No description'}
                                        </p>
                                    </div>
                                    <Link href={`/store/${product.stores?.slug}`}>
                                        <Button variant="outline" size="sm">
                                            Visit Store
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Reviews Section */}
                {reviews.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                            Buyer Reviews ({reviews.length})
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {reviews.map((review) => (
                                <Card key={review.id} className="border-0 shadow-sm">
                                    <CardContent className="p-5">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
                                                <span className="text-sm font-bold text-neutral-600">
                                                    {review.buyer_name?.charAt(0) || 'A'}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-neutral-900">{review.buyer_name || 'Anonymous'}</p>
                                                <p className="text-xs text-neutral-500">
                                                    {new Date(review.created_at).toLocaleDateString('en-IN')}
                                                </p>
                                            </div>
                                            <div className="ml-auto flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star 
                                                        key={star} 
                                                        className={`w-3.5 h-3.5 ${star <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-neutral-300'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-sm text-neutral-600">{review.comment}</p>
                                        {review.verified_purchase && (
                                            <Badge variant="secondary" className="mt-3 text-xs bg-green-50 text-green-700 border-0">
                                                <BadgeCheck className="w-3 h-3 mr-1" />
                                                Verified Purchase
                                            </Badge>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Related Products */}
                {relatedProducts && relatedProducts.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-8">More from this Creator</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/product/${item.id}`}
                                    className="group block"
                                >
                                    <div className="bg-white rounded-2xl overflow-hidden border border-neutral-100 hover:border-neutral-300 hover:shadow-lg transition-all duration-300">
                                        <div className="aspect-square bg-neutral-100 relative overflow-hidden">
                                            {item.images?.[0] ? (
                                                <img
                                                    src={item.images[0]}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ShoppingBag className="w-8 h-8 text-neutral-300" />
                                                </div>
                                            )}
                                            {item.affiliate_link && (
                                                <Badge className="absolute top-2 left-2 bg-blue-600 text-white text-xs">
                                                    Affiliate
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-medium text-neutral-900 line-clamp-1">{item.name}</h3>
                                            <p className="font-bold text-neutral-900 mt-1">₹{item.price}</p>
                                        </div>
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