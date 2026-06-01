'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ExternalLink, ShoppingBag, Store, ArrowLeft, Truck, Shield, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useEffect } from 'react'

export default function ProductPage() {
    const params = useParams()
    const id = params.id as string

    const [product, setProduct] = useState<any>(null)
    const [relatedProducts, setRelatedProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [mainImageIndex, setMainImageIndex] = useState(0)

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
                        {/* Main Image */}
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

                        {/* Thumbnail Grid */}
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
                                <Truck className="w-5 h-5 mx-auto mb-1 text-neutral-600" />
                                <p className="text-xs font-medium text-neutral-700">Fast Delivery</p>
                            </div>
                            <div className="text-center p-3 bg-neutral-50 rounded-lg">
                                <Shield className="w-5 h-5 mx-auto mb-1 text-neutral-600" />
                                <p className="text-xs font-medium text-neutral-700">Secure Payment</p>
                            </div>
                            <div className="text-center p-3 bg-neutral-50 rounded-lg">
                                <Clock className="w-5 h-5 mx-auto mb-1 text-neutral-600" />
                                <p className="text-xs font-medium text-neutral-700">24/7 Support</p>
                            </div>
                        </div>

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
                                        Buy Now — No Login Required
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

                {/* Related Products */}
                {relatedProducts && relatedProducts.length > 0 && (
                    <div className="mt-20">
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