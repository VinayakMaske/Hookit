// src/components/guest-review-form.tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Star, Loader2, CheckCircle } from 'lucide-react'

interface GuestReviewFormProps {
    productId: string
    orderId: string
    buyerName: string
}

export default function GuestReviewForm({ productId, orderId, buyerName }: GuestReviewFormProps) {
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [comment, setComment] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = async () => {
        if (rating === 0) return

        setSubmitting(true)
        const supabase = createClient()

        const { error } = await supabase
            .from('reviews')
            .insert({
                product_id: productId,
                order_id: orderId,
                buyer_name: buyerName,
                rating: rating,
                comment: comment,
                verified_purchase: true,
                status: 'pending',
            })

        if (!error) {
            setSubmitted(true)
        }
        setSubmitting(false)
    }

    if (submitted) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-green-800 mb-1">Thank you!</h3>
                <p className="text-sm text-green-600">Your review has been submitted and will appear after moderation.</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h3 className="font-semibold text-neutral-900 mb-4">Leave a Review</h3>
            
            <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-colors"
                    >
                        <Star 
                            className={`w-8 h-8 ${
                                star <= (hoverRating || rating) 
                                    ? 'text-amber-400 fill-amber-400' 
                                    : 'text-neutral-300'
                            }`}
                        />
                    </button>
                ))}
                <span className="text-sm text-neutral-500 ml-2">
                    {rating > 0 ? ['Terrible', 'Poor', 'Average', 'Good', 'Excellent'][rating - 1] : 'Tap to rate'}
                </span>
            </div>

            <Textarea
                placeholder="Share your experience with this product..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="mb-4"
            />

            <Button 
                onClick={handleSubmit} 
                disabled={rating === 0 || submitting}
                className="w-full bg-[#7C3AED] hover:bg-[#6d28d9]"
            >
                {submitting ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Submitting...
                    </>
                ) : (
                    'Submit Review'
                )}
            </Button>
        </div>
    )
}