'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Loader2, X, Upload, ImageIcon } from 'lucide-react'

const PRODUCT_CATEGORIES = [
    'Art & Illustration',
    'Fashion & Clothing',
    'Handmade Crafts',
    'Jewelry & Accessories',
    'Home & Living',
    'Digital Products',
    'Photography',
    'Beauty & Wellness',
    'Food & Beverages',
    'Books & Stationery',
    'Music & Audio',
    'Toys & Games',
    'Electronics & Gadgets',
    'Vintage & Collectibles',
    'Pet Supplies',
    'Sports & Fitness',
    'Garden & Outdoor',
    'Kids & Baby',
    'Wedding & Party',
    'Custom & Personalized',
]

export default function EditProductPage() {
    const router = useRouter()
    const params = useParams()
    const productId = params.id as string

    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [uploadingImages, setUploadingImages] = useState(false)
    const [imagePreviews, setImagePreviews] = useState<string[]>([])
    const [uploadedUrls, setUploadedUrls] = useState<string[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [hasAffiliate, setHasAffiliate] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        comparePrice: '',
        category: '',
        stockQuantity: '1',
        affiliateLink: '',
        isActive: true
    })

    useEffect(() => {
        fetchProduct()
    }, [productId])

    const fetchProduct = async () => {
        setLoading(true)
        const supabase = createClient()
        
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .single()

        if (error || !data) {
            setError('Product not found')
            setLoading(false)
            return
        }

        setFormData({
            name: data.name,
            description: data.description || '',
            price: data.price.toString(),
            comparePrice: data.compare_price?.toString() || '',
            category: data.category || '',
            stockQuantity: data.stock_quantity?.toString() || '1',
            affiliateLink: data.affiliate_link || '',
            isActive: data.is_active
        })

        setHasAffiliate(!!data.affiliate_link)
        
        if (data.images && data.images.length > 0) {
            setUploadedUrls(data.images)
            setImagePreviews(data.images)
        }
        
        setLoading(false)
    }

    const uploadImages = async (files: FileList) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        setError('You must be logged in to upload images')
        return
    }

    setUploadingImages(true)
    const newUrls: string[] = []
    const newPreviews: string[] = []

    for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}/product-${Date.now()}-${i}.${fileExt}`

        const reader = new FileReader()
        reader.onloadend = () => {
            newPreviews.push(reader.result as string)
            if (newPreviews.length === files.length) {
                setImagePreviews(prev => [...prev, ...newPreviews])
            }
        }
        reader.readAsDataURL(file)

        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', 'products')
        formData.append('fileName', fileName)

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            const result = await response.json()

            if (!response.ok || !result.success) {
                setError(`Failed to upload image: ${result.error || 'Upload failed'}`)
                continue
            }

            newUrls.push(result.url)
        } catch (err: any) {
            setError(`Failed to upload image: ${err.message || 'Upload failed'}`)
            continue
        }
    }

    setUploadedUrls(prev => [...prev, ...newUrls])
    setUploadingImages(false)
}

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return
        uploadImages(files)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const removeImage = (index: number) => {
        setImagePreviews(prev => prev.filter((_, i) => i !== index))
        setUploadedUrls(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!formData.name || !formData.price) {
            setError('Product name and price are required')
            return
        }

        setSaving(true)

        const supabase = createClient()

        const { error: updateError } = await supabase
            .from('products')
            .update({
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                compare_price: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
                images: uploadedUrls,
                category: formData.category,
                affiliate_link: hasAffiliate ? formData.affiliateLink : null,
                stock_quantity: parseInt(formData.stockQuantity) || 0,
                is_active: formData.isActive
            })
            .eq('id', productId)

        if (updateError) {
            setError(updateError.message)
            setSaving(false)
            return
        }

        router.push('/seller/products')
        router.refresh()
        setSaving(false)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-neutral-900">Edit Product</h1>
                <p className="text-neutral-500 mt-1">Update your product details</p>
            </div>

            <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Product Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price (₹) *</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="comparePrice">Compare at Price (₹)</Label>
                                <Input
                                    id="comparePrice"
                                    type="number"
                                    step="0.01"
                                    value={formData.comparePrice}
                                    onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Category *</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-72">
                                        {PRODUCT_CATEGORIES.map((cat) => (
                                            <SelectItem key={cat} value={cat}>
                                                {cat}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stock">Stock Quantity</Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    value={formData.stockQuantity}
                                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Product Images - Store Page Style */}
                        <div className="space-y-3">
                            <Label>Product Images</Label>
                            
                            {/* Main Preview Area - Always Visible */}
                            {imagePreviews.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-neutral-200 group bg-neutral-100">
                                            <img
                                                src={preview}
                                                alt={`Product ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-sm"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="w-full h-48 bg-neutral-100 rounded-xl flex flex-col items-center justify-center border border-dashed border-neutral-300 gap-3">
                                    <ImageIcon className="w-12 h-12 text-neutral-400" />
                                    <div className="text-center">
                                        <p className="text-sm text-neutral-500 font-medium">No images uploaded yet</p>
                                        <p className="text-xs text-neutral-400 mt-1">Upload product images to showcase your product</p>
                                    </div>
                                </div>
                            )}

                            {/* Upload Button */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/png,image/jpeg,image/jpg,image/webp"
                                multiple
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploadingImages}
                                className="w-full gap-2 h-12"
                            >
                                {uploadingImages ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4" />
                                        {imagePreviews.length > 0 ? 'Add More Images' : 'Upload Images'}
                                    </>
                                )}
                            </Button>
                            <p className="text-xs text-neutral-500">
                                PNG, JPG or WebP. Max 5MB each. You can select multiple images at once.
                            </p>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                            <div>
                                <Label className="font-medium">Affiliate Product</Label>
                                <p className="text-sm text-neutral-500">Redirect buyers to external link</p>
                            </div>
                            <Switch
                                checked={hasAffiliate}
                                onCheckedChange={setHasAffiliate}
                            />
                        </div>

                        {hasAffiliate && (
                            <div className="space-y-2">
                                <Label htmlFor="affiliateLink">Affiliate Link *</Label>
                                <Input
                                    id="affiliateLink"
                                    type="url"
                                    value={formData.affiliateLink}
                                    onChange={(e) => setFormData({ ...formData, affiliateLink: e.target.value })}
                                    required={hasAffiliate}
                                />
                            </div>
                        )}

                        <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                            <div>
                                <Label className="font-medium">Active</Label>
                                <p className="text-sm text-neutral-500">Visible to buyers</p>
                            </div>
                            <Switch
                                checked={formData.isActive}
                                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 bg-red-50 p-3 rounded">{error}</p>
                        )}

                        <div className="flex gap-4">
                            <Button 
                                type="submit" 
                                className="flex-1" 
                                disabled={saving || uploadingImages} 
                                size="lg"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="lg"
                                onClick={() => router.push('/seller/products')}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}