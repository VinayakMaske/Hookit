// src/app/(site)/store/[slug]/reviews/page.tsx
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Star, ArrowLeft, ShoppingBag, Filter, ThumbsUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function StoreReviewsPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const supabase = await createClient()

    const { data: store } = await supabase
        .from('stores')
        .select('id, name, slug, logo_url, description, category')
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

    if (!store) {
        notFound()
    }

    // Fetch all reviews for this store's products
    const { data: reviews } = await supabase
        .from('reviews')
        .select('*, products(name, images, price)')
        .eq('products.stores.id', store.id)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

    const averageRating = reviews && reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : '0'

    const ratingBreakdown = reviews ? {
        5: reviews.filter(r => r.rating === 5).length,
        4: reviews.filter(r => r.rating === 4).length,
        3: reviews.filter(r => r.rating === 3).length,
        2: reviews.filter(r => r.rating === 2).length,
        1: reviews.filter(r => r.rating === 1).length,
    } : { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

    const totalReviews = reviews?.length || 0

    return (
        <div className="min-h-screen bg-white pt-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Link */}
                <Link href={`/store/${slug}`} className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Store
                </Link>

                {/* Store Header */}
                <div className="flex items-center gap-4 mb-8">
                    {store.logo_url ? (
                        <img src={store.logo_url} alt={store.name} className="w-16 h-16 rounded-2xl object-cover" />
                    ) : (
                        <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center">
                            <ShoppingBag className="w-8 h-8 text-neutral-400" />
                        </div>
                    )}
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900">{store.name} Reviews</h1>
                        <p className="text-neutral-500">{store.category || 'General Store'}</p>
                    </div>
                </div>

                {/* Rating Summary */}
                <Card className="border-0 shadow-sm mb-8">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                            {/* Average */}
                            <div className="text-center md:text-left">
                                <div className="flex items-center gap-2 justify-center md:justify-start">
                                    <span className="text-5xl font-bold text-neutral-900">{averageRating}</span>
                                    <div className="flex flex-col">
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star 
                                                    key={star} 
                                                    className={`w-5 h-5 ${star <= Math.round(parseFloat(averageRating)) ? 'text-amber-400 fill-amber-400' : 'text-neutral-300'}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-neutral-500">{totalReviews} reviews</span>
                                    </div>
                                </div>
                            </div>

                            {/* Breakdown */}
                            <div className="col-span-2">
                                {[5, 4, 3, 2, 1].map((rating) => {
                                    const count = ratingBreakdown[rating as keyof typeof ratingBreakdown] || 0
                                    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
                                    return (
                                        <div key={rating} className="flex items-center gap-3 mb-2">
                                            <span className="text-sm text-neutral-600 w-8">{rating} ★</span>
                                            <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-amber-400 rounded-full"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                            <span className="text-sm text-neutral-500 w-10 text-right">{count}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Reviews List */}
                <div className="space-y-4">
                    {reviews && reviews.length > 0 ? (
                        reviews.map((review) => (
                            <Card key={review.id} className="border-0 shadow-sm">
                                <CardContent className="p-5">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                                            <span className="font-bold text-neutral-600">
                                                {review.buyer_name?.charAt(0) || 'A'}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <p className="font-medium text-neutral-900">{review.buyer_name || 'Anonymous'}</p>
                                                    <p className="text-xs text-neutral-500">
                                                        {new Date(review.created_at).toLocaleDateString('en-IN', {
                                                            day: 'numeric', month: 'long', year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star 
                                                            key={star} 
                                                            className={`w-4 h-4 ${star <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-neutral-300'}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            {review.products && (
                                                <Link href={`/product/${review.products.id}`} className="flex items-center gap-2 mb-3 p-2 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                                                    {review.products.images?.[0] ? (
                                                        <img src={review.products.images[0]} alt="" className="w-8 h-8 rounded object-cover" />
                                                    ) : (
                                                        <ShoppingBag className="w-4 h-4 text-neutral-400" />
                                                    )}
                                                    <span className="text-sm text-neutral-600">{review.products.name}</span>
                                                    <span className="text-sm font-medium text-neutral-900 ml-auto">₹{review.products.price}</span>
                                                </Link>
                                            )}

                                            <p className="text-neutral-700 text-sm leading-relaxed">{review.comment}</p>
                                            
                                            {review.verified_purchase && (
                                                <Badge className="mt-3 bg-green-50 text-green-700 border-0 text-xs">
                                                    <ThumbsUp className="w-3 h-3 mr-1" />
                                                    Verified Purchase
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-16">
                            <Star className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-neutral-900 mb-2">No reviews yet</h3>
                            <p className="text-neutral-500 mb-4">Be the first to review a product from this store</p>
                            <Link href={`/store/${slug}`}>
                                <Button variant="outline">Browse Products</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}