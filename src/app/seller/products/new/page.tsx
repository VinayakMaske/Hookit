'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
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

interface ImageFile {
    id: string
    file: File
    preview: string
    url: string | null
    uploading: boolean
    error: string | null
}

export default function NewProductPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [images, setImages] = useState<ImageFile[]>([])
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

    // Generate unique ID
    const generateId = () => Math.random().toString(36).substring(2, 9)

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        const newImages: ImageFile[] = []

        for (let i = 0; i < files.length; i++) {
            const file = files[i]

            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError(`File ${file.name} is too large. Max 5MB.`)
                continue
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError(`File ${file.name} is not an image.`)
                continue
            }

            // Create instant preview using object URL
            const preview = URL.createObjectURL(file)

            newImages.push({
                id: generateId(),
                file,
                preview,
                url: null,
                uploading: true,
                error: null
            })
        }

        if (newImages.length === 0) {
            if (fileInputRef.current) fileInputRef.current.value = ''
            return
        }

        // Add to state immediately so previews show
        setImages(prev => [...prev, ...newImages])

        // Upload each image
        newImages.forEach((img) => {
            uploadSingleImage(img)
        })

        if (fileInputRef.current) fileInputRef.current.value = ''
    }, [])

    const uploadSingleImage = async (imageFile: ImageFile) => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            updateImageStatus(imageFile.id, { error: 'Not logged in', uploading: false })
            return
        }

        const fileExt = imageFile.file.name.split('.').pop()
        const fileName = `${user.id}/product-${Date.now()}-${imageFile.id}.${fileExt}`

        const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(fileName, imageFile.file, {
                cacheControl: '3600',
                upsert: false
            })

        if (uploadError) {
            updateImageStatus(imageFile.id, { error: uploadError.message, uploading: false })
            return
        }

        const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName)

        updateImageStatus(imageFile.id, { url: publicUrl, uploading: false, error: null })
    }

    const updateImageStatus = (id: string, updates: Partial<ImageFile>) => {
        setImages(prev => prev.map(img => 
            img.id === id ? { ...img, ...updates } : img
        ))
    }

    const removeImage = (id: string) => {
        setImages(prev => {
            const img = prev.find(i => i.id === id)
            if (img) {
                URL.revokeObjectURL(img.preview)
            }
            return prev.filter(i => i.id !== id)
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!formData.name || !formData.price) {
            setError('Product name and price are required')
            return
        }

        // Check if any images are still uploading
        const uploadingCount = images.filter(img => img.uploading).length
        if (uploadingCount > 0) {
            setError(`Please wait for ${uploadingCount} image(s) to finish uploading`)
            return
        }

        setLoading(true)

        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            setError('You must be logged in')
            setLoading(false)
            return
        }

        const { data: store } = await supabase
            .from('stores')
            .select('id')
            .eq('owner_id', user.id)
            .single()

        if (!store) {
            setError('Store not found')
            setLoading(false)
            return
        }

        // Only save successfully uploaded images
        const validUrls = images
            .filter(img => img.url !== null && !img.error)
            .map(img => img.url as string)

        const { error: insertError } = await supabase
            .from('products')
            .insert({
                store_id: store.id,
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                compare_price: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
                images: validUrls,
                category: formData.category,
                affiliate_link: hasAffiliate ? formData.affiliateLink : null,
                stock_quantity: parseInt(formData.stockQuantity) || 0,
                is_active: formData.isActive
            })

        if (insertError) {
            setError(insertError.message)
            setLoading(false)
            return
        }

        // Clean up object URLs
        images.forEach(img => URL.revokeObjectURL(img.preview))

        router.push('/seller/products')
        router.refresh()
        setLoading(false)
    }

    const anyUploading = images.some(img => img.uploading)

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-neutral-900">Add New Product</h1>
                <p className="text-neutral-500 mt-1">Add a product or affiliate link to your store</p>
            </div>

            <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Product Name *</Label>
                            <Input
                                id="name"
                                placeholder="e.g., Handmade Ceramic Mug"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe your product..."
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
                                    placeholder="499.00"
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
                                    placeholder="699.00"
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
                                    placeholder="10"
                                    value={formData.stockQuantity}
                                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Product Images */}
                        <div className="space-y-3">
                            <Label>Product Images</Label>
                            
                            {/* Image Preview Grid */}
                            {images.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {images.map((img) => (
                                        <div 
                                            key={img.id} 
                                            className="relative aspect-square rounded-xl overflow-hidden border border-neutral-200 group bg-neutral-100"
                                        >
                                            <img
                                                src={img.preview}
                                                alt="Product preview"
                                                className="w-full h-full object-cover"
                                            />
                                            
                                            {/* Uploading overlay */}
                                            {img.uploading && (
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                                                </div>
                                            )}
                                            
                                            {/* Error overlay */}
                                            {img.error && (
                                                <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center p-2">
                                                    <p className="text-white text-xs text-center">{img.error}</p>
                                                </div>
                                            )}
                                            
                                            {/* Remove button */}
                                            <button
                                                type="button"
                                                onClick={() => removeImage(img.id)}
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
                                accept="image/*"
                                multiple
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={anyUploading}
                                className="w-full gap-2 h-12"
                            >
                                {anyUploading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4" />
                                        {images.length > 0 ? 'Add More Images' : 'Upload Images'}
                                    </>
                                )}
                            </Button>
                            <p className="text-xs text-neutral-500">
                                PNG, JPG or WebP. Max 5MB each. You can select multiple images at once.
                            </p>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                            <div>
                                <Label className="font-medium">This is an Affiliate Product</Label>
                                <p className="text-sm text-neutral-500">Enable if you want to redirect buyers to an external link</p>
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
                                    placeholder="https://amazon.in/product/..."
                                    value={formData.affiliateLink}
                                    onChange={(e) => setFormData({ ...formData, affiliateLink: e.target.value })}
                                    required={hasAffiliate}
                                />
                            </div>
                        )}

                        <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                            <div>
                                <Label className="font-medium">Active</Label>
                                <p className="text-sm text-neutral-500">Make this product visible to buyers</p>
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
                                disabled={loading || anyUploading} 
                                size="lg"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Product'
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