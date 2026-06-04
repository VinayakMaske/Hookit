// src/app/seller/products/new/page.tsx
'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Loader2, X, Upload, ImageIcon, Truck, Shield, Plus, Receipt, Percent, Tag } from 'lucide-react'

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

const GST_SLABS = [
    { label: 'None (0%)', value: 'none', percentage: 0 },
    { label: '5% GST', value: '5', percentage: 5 },
    { label: '12% GST', value: '12', percentage: 12 },
    { label: '18% GST', value: '18', percentage: 18 },
    { label: '28% GST', value: '28', percentage: 28 },
    { label: 'Custom %', value: 'custom', percentage: 0 },
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

    // Collection state
    const [collections, setCollections] = useState<string[]>([])
    const [collectionInput, setCollectionInput] = useState('')
    const [showCollectionInput, setShowCollectionInput] = useState(false)

    // Fee toggles
    const [hasDeliveryFee, setHasDeliveryFee] = useState(false)
    const [hasPlatformFee, setHasPlatformFee] = useState(false)
    const [hasAdditionalFee, setHasAdditionalFee] = useState(false)

    // GST state
    const [gstType, setGstType] = useState<'none' | 'inclusive' | 'exclusive'>('none')
    const [gstSlab, setGstSlab] = useState('none')
    const [customGstPercentage, setCustomGstPercentage] = useState('')

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        comparePrice: '',
        category: '',
        collection: '',
        stockQuantity: '1',
        affiliateLink: '',
        isActive: true,
        // Fees
        deliveryFee: '',
        platformFee: '',
        additionalFee: '',
        additionalFeeName: '',
    })

    // Fetch existing collections on mount
    useEffect(() => {
        fetchCollections()
    }, [])

    const fetchCollections = async () => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return

        const { data: store } = await supabase
            .from('stores')
            .select('id')
            .eq('owner_id', user.id)
            .single()

        if (!store) return

        // Get unique collections from this store's products
        const { data } = await supabase
            .from('products')
            .select('collection')
            .eq('store_id', store.id)
            .not('collection', 'is', null)
            .not('collection', 'eq', '')

        if (data) {
            const uniqueCollections = [...new Set(data.map(p => p.collection).filter(Boolean))]
            setCollections(uniqueCollections)
        }
    }

    // Generate unique ID
    const generateId = () => Math.random().toString(36).substring(2, 9)

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        const newImages: ImageFile[] = []

        for (let i = 0; i < files.length; i++) {
            const file = files[i]

            if (file.size > 5 * 1024 * 1024) {
                setError(`File ${file.name} is too large. Max 5MB.`)
                continue
            }

            if (!file.type.startsWith('image/')) {
                setError(`File ${file.name} is not an image.`)
                continue
            }

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

        setImages(prev => [...prev, ...newImages])

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

        const formData = new FormData()
        formData.append('file', imageFile.file)
        formData.append('folder', 'products')
        formData.append('fileName', fileName)

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            const result = await response.json()

            if (!response.ok || !result.success) {
                updateImageStatus(imageFile.id, { error: result.error || 'Upload failed', uploading: false })
                return
            }

            updateImageStatus(imageFile.id, { url: result.url, uploading: false, error: null })
        } catch (err: any) {
            updateImageStatus(imageFile.id, { error: err.message || 'Upload failed', uploading: false })
        }
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

    // Calculate GST percentage from slab
    const getGstPercentage = (): number => {
        if (gstType === 'none' || gstSlab === 'none') return 0
        if (gstSlab === 'custom') {
            return parseFloat(customGstPercentage) || 0
        }
        const slab = GST_SLABS.find(s => s.value === gstSlab)
        return slab?.percentage || 0
    }

    // Calculate price breakdown for preview
    const calculateBreakdown = () => {
        const basePrice = parseFloat(formData.price) || 0
        const deliveryFee = hasDeliveryFee ? parseFloat(formData.deliveryFee) || 0 : 0
        const platformFee = hasPlatformFee ? parseFloat(formData.platformFee) || 0 : 0
        const additionalFee = hasAdditionalFee ? parseFloat(formData.additionalFee) || 0 : 0
        const gstPercent = getGstPercentage()

        let subtotal = basePrice
        let gstAmount = 0
        let total = 0

        if (gstType === 'inclusive') {
            gstAmount = basePrice - (basePrice / (1 + gstPercent / 100))
            subtotal = basePrice - gstAmount
            total = basePrice + deliveryFee + platformFee + additionalFee
        } else if (gstType === 'exclusive') {
            gstAmount = basePrice * (gstPercent / 100)
            subtotal = basePrice
            total = basePrice + gstAmount + deliveryFee + platformFee + additionalFee
        } else {
            subtotal = basePrice
            total = basePrice + deliveryFee + platformFee + additionalFee
        }

        return {
            subtotal: Math.round(subtotal * 100) / 100,
            gstAmount: Math.round(gstAmount * 100) / 100,
            deliveryFee,
            platformFee,
            additionalFee,
            total: Math.round(total * 100) / 100,
            gstPercent
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!formData.name || !formData.price) {
            setError('Product name and price are required')
            return
        }

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

        const validUrls = images
            .filter(img => img.url !== null && !img.error)
            .map(img => img.url as string)

        const gstPercent = getGstPercentage()

        // Save collection if it's new
        const collectionValue = formData.collection?.trim() || null

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
                collection: collectionValue,
                affiliate_link: hasAffiliate ? formData.affiliateLink : null,
                stock_quantity: parseInt(formData.stockQuantity) || 0,
                is_active: formData.isActive,
                // Fees
                delivery_fee: hasDeliveryFee ? parseFloat(formData.deliveryFee) || 0 : 0,
                platform_fee: hasPlatformFee ? parseFloat(formData.platformFee) || 0 : 0,
                additional_fee: hasAdditionalFee ? parseFloat(formData.additionalFee) || 0 : 0,
                // GST
                gst_type: gstType,
                gst_percentage: gstPercent,
                gst_slab: gstSlab,
            })

        if (insertError) {
            setError(insertError.message)
            setLoading(false)
            return
        }

        images.forEach(img => URL.revokeObjectURL(img.preview))

        router.push('/seller/products')
        router.refresh()
        setLoading(false)
    }

    const anyUploading = images.some(img => img.uploading)
    const breakdown = calculateBreakdown()

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-neutral-900">Add New Hook</h1>
                <p className="text-neutral-500 mt-1">Add a hook with pricing, fees, and GST to your store</p>
            </div>

            <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* ===== BASIC INFO ===== */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
                                <Receipt className="w-5 h-5 text-[#161616]" />
                                Basic Information
                            </h2>

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
                                    <Label htmlFor="price">Base Price (₹) *</Label>
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

                            {/* ===== COLLECTION ===== */}
                            <div className="space-y-2">
                                <Label htmlFor="collection" className="flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-[#7C3AED]" />
                                    Collection
                                </Label>
                                
                                {showCollectionInput ? (
                                    <div className="flex gap-2">
                                        <Input
                                            id="collection"
                                            placeholder="e.g., Summer Collection, Wedding Special, New Arrivals"
                                            value={collectionInput}
                                            onChange={(e) => setCollectionInput(e.target.value)}
                                            className="flex-1"
                                            autoFocus
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                if (collectionInput.trim()) {
                                                    setFormData({ ...formData, collection: collectionInput.trim() })
                                                    if (!collections.includes(collectionInput.trim())) {
                                                        setCollections([...collections, collectionInput.trim()])
                                                    }
                                                }
                                                setShowCollectionInput(false)
                                                setCollectionInput('')
                                            }}
                                            className="shrink-0"
                                        >
                                            Save
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => {
                                                setShowCollectionInput(false)
                                                setCollectionInput('')
                                            }}
                                            className="shrink-0"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <Select
                                            value={formData.collection}
                                            onValueChange={(value) => {
                                                if (value === '__new__') {
                                                    setShowCollectionInput(true)
                                                    setCollectionInput('')
                                                } else {
                                                    setFormData({ ...formData, collection: value })
                                                }
                                            }}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select or create a collection" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="__new__">
                                                    <span className="flex items-center gap-2 text-[#7C3AED] font-medium">
                                                        <Plus className="w-4 h-4" />
                                                        + Create New Collection
                                                    </span>
                                                </SelectItem>
                                                {collections.length > 0 && (
                                                    <>
                                                        <div className="px-2 py-1.5 text-xs text-neutral-400 font-medium border-t mt-1">
                                                            Your Collections
                                                        </div>
                                                        {collections.map((col) => (
                                                            <SelectItem key={col} value={col}>
                                                                {col}
                                                            </SelectItem>
                                                        ))}
                                                    </>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                                
                                {formData.collection && !showCollectionInput && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge className="bg-[#7C3AED]/10 text-[#7C3AED] border-0">
                                            <Tag className="w-3 h-3 mr-1" />
                                            {formData.collection}
                                        </Badge>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, collection: '' })}
                                            className="text-xs text-neutral-400 hover:text-red-500 transition-colors"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                                
                                <p className="text-xs text-neutral-500">
                                    Group products into collections like "Summer 2026", "Wedding Collection", or "Best Sellers" for better organization
                                </p>
                            </div>
                        </div>

                        <div className="border-t border-neutral-200" />

                        {/* ===== GST SECTION ===== */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
                                <Percent className="w-5 h-5 text-[#161616]" />
                                GST (Tax)
                            </h2>

                            <div className="space-y-4">
                                <Label>GST Type</Label>
                                <div className="grid grid-cols-3 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setGstType('none')}
                                        className={`p-4 rounded-xl border-2 text-sm font-medium transition-all ${
                                            gstType === 'none'
                                                ? 'border-[#161616] bg-[#7C3AED]/5 text-[#161616]'
                                                : 'border-neutral-200 hover:border-neutral-300 text-neutral-600'
                                        }`}
                                    >
                                        No GST
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setGstType('inclusive')}
                                        className={`p-4 rounded-xl border-2 text-sm font-medium transition-all ${
                                            gstType === 'inclusive'
                                                ? 'border-[#161616] bg-[#7C3AED]/5 text-[#161616]'
                                                : 'border-neutral-200 hover:border-neutral-300 text-neutral-600'
                                        }`}
                                    >
                                        GST Inclusive
                                        <span className="block text-xs font-normal mt-1 text-neutral-400">
                                            Tax included in price
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setGstType('exclusive')}
                                        className={`p-4 rounded-xl border-2 text-sm font-medium transition-all ${
                                            gstType === 'exclusive'
                                                ? 'border-[#161616] bg-[#7C3AED]/5 text-[#161616]'
                                                : 'border-neutral-200 hover:border-neutral-300 text-neutral-600'
                                        }`}
                                    >
                                        GST Exclusive
                                        <span className="block text-xs font-normal mt-1 text-neutral-400">
                                            Tax added to price
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {gstType !== 'none' && (
                                <div className="space-y-4 p-4 bg-[#f8f7fb] rounded-xl border border-[#7C3AED]/10">
                                    <div className="space-y-2">
                                        <Label>GST Slab</Label>
                                        <Select
                                            value={gstSlab}
                                            onValueChange={setGstSlab}
                                        >
                                            <SelectTrigger className="w-full bg-white">
                                                <SelectValue placeholder="Select GST slab" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {GST_SLABS.map((slab) => (
                                                    <SelectItem key={slab.value} value={slab.value}>
                                                        {slab.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {gstSlab === 'custom' && (
                                        <div className="space-y-2">
                                            <Label htmlFor="customGst">Custom GST Percentage (%)</Label>
                                            <Input
                                                id="customGst"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                max="100"
                                                placeholder="e.g., 7.5"
                                                value={customGstPercentage}
                                                onChange={(e) => setCustomGstPercentage(e.target.value)}
                                                className="bg-white"
                                            />
                                        </div>
                                    )}

                                    {gstType === 'inclusive' && (
                                        <p className="text-sm text-neutral-500 bg-white p-3 rounded-lg">
                                            <span className="font-medium text-[#161616]">Inclusive:</span> The base price you entered includes GST. 
                                            Customer pays exactly ₹{formData.price || '0'}.
                                        </p>
                                    )}
                                    {gstType === 'exclusive' && (
                                        <p className="text-sm text-neutral-500 bg-white p-3 rounded-lg">
                                            <span className="font-medium text-[#161616]">Exclusive:</span> GST will be added on top of the base price.
                                            Customer pays ₹{formData.price || '0'} + GST.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="border-t border-neutral-200" />

                        {/* ===== FEES SECTION ===== */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
                                <Plus className="w-5 h-5 text-[#161616]" />
                                Additional Fees
                            </h2>

                            {/* Delivery Fee */}
                            <div 
                                onClick={() => setHasDeliveryFee(!hasDeliveryFee)}
                                className={`p-5 rounded-xl border-2 transition-all cursor-pointer ${
                                    hasDeliveryFee 
                                        ? 'border-[#161616] bg-[#7C3AED]/5' 
                                        : 'border-neutral-200 hover:border-neutral-300'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                                            hasDeliveryFee ? 'bg-[#161616] text-white' : 'bg-neutral-100 text-neutral-500'
                                        }`}>
                                            <Truck className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <Label className="font-medium text-base cursor-pointer">Delivery Fee</Label>
                                            <p className="text-sm text-neutral-500">Charge for shipping/delivery</p>
                                        </div>
                                    </div>
                                    <div 
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex items-center gap-3"
                                    >
                                        <span className={`text-sm font-medium transition-colors ${
                                            hasDeliveryFee ? 'text-[#7C3AED]' : 'text-neutral-400'
                                        }`}>
                                            {hasDeliveryFee ? 'ON' : 'OFF'}
                                        </span>
                                        <Switch
                                            checked={hasDeliveryFee}
                                            onCheckedChange={setHasDeliveryFee}
                                            className="data-[state=checked]:bg-[#161616]"
                                        />
                                    </div>
                                </div>
                                {hasDeliveryFee && (
                                    <div 
                                    onClick={(e) => e.stopPropagation()}
                                    className="mt-4 pl-13">
                                        <Label htmlFor="deliveryFee" className="text-sm">Delivery Amount (₹)</Label>
                                        <Input
                                            id="deliveryFee"
                                            type="number"
                                            step="0.01"
                                            placeholder="e.g., 50.00"
                                            value={formData.deliveryFee}
                                            onChange={(e) => setFormData({ ...formData, deliveryFee: e.target.value })}
                                            className="mt-2 bg-white max-w-xs"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Platform Fee */}
                            <div 
                                onClick={() => setHasPlatformFee(!hasPlatformFee)}
                                className={`p-5 rounded-xl border-2 transition-all cursor-pointer ${
                                    hasPlatformFee 
                                        ? 'border-[#161616] bg-[#7C3AED]/5' 
                                        : 'border-neutral-200 hover:border-neutral-300'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                                            hasPlatformFee ? 'bg-[#161616] text-white' : 'bg-neutral-100 text-neutral-500'
                                        }`}>
                                            <Shield className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <Label className="font-medium text-base cursor-pointer">Platform Fee</Label>
                                            <p className="text-sm text-neutral-500">Service/convenience charge</p>
                                        </div>
                                    </div>
                                    <div 
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex items-center gap-3"
                                    >
                                        <span className={`text-sm font-medium transition-colors ${
                                            hasPlatformFee ? 'text-[#7C3AED]' : 'text-neutral-400'
                                        }`}>
                                            {hasPlatformFee ? 'ON' : 'OFF'}
                                        </span>
                                        <Switch
                                            checked={hasPlatformFee}
                                            onCheckedChange={setHasPlatformFee}
                                            className="data-[state=checked]:bg-[#161616]"
                                        />
                                    </div>
                                </div>
                                {hasPlatformFee && (
                                    <div 
                                    onClick={(e) => e.stopPropagation()}
                                    className="mt-4 pl-13">
                                        <Label htmlFor="platformFee" className="text-sm">Platform Fee Amount (₹)</Label>
                                        <Input
                                            id="platformFee"
                                            type="number"
                                            step="0.01"
                                            placeholder="e.g., 20.00"
                                            value={formData.platformFee}
                                            onChange={(e) => setFormData({ ...formData, platformFee: e.target.value })}
                                            className="mt-2 bg-white max-w-xs"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Additional Fee */}
                            <div 
                                onClick={() => setHasAdditionalFee(!hasAdditionalFee)}
                                className={`p-5 rounded-xl border-2 transition-all cursor-pointer ${
                                    hasAdditionalFee 
                                        ? 'border-[#161616] bg-[#7C3AED]/5' 
                                        : 'border-neutral-200 hover:border-neutral-300'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                                            hasAdditionalFee ? 'bg-[#161616] text-white' : 'bg-neutral-100 text-neutral-500'
                                        }`}>
                                            <Plus className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <Label className="font-medium text-base cursor-pointer">Additional Fee</Label>
                                            <p className="text-sm text-neutral-500">Custom fee (packaging, handling, etc.)</p>
                                        </div>
                                    </div>
                                    <div 
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex items-center gap-3"
                                    >
                                        <span className={`text-sm font-medium transition-colors ${
                                            hasAdditionalFee ? 'text-[#7C3AED]' : 'text-neutral-400'
                                        }`}>
                                            {hasAdditionalFee ? 'ON' : 'OFF'}
                                        </span>
                                        <Switch
                                            checked={hasAdditionalFee}
                                            onCheckedChange={setHasAdditionalFee}
                                            className="data-[state=checked]:bg-[#161616]"
                                        />
                                    </div>
                                </div>
                                {hasAdditionalFee && (
                                    <div 
                                    onClick={(e) => e.stopPropagation()}
                                    className="mt-4 space-y-3 pl-13">
                                        <div>
                                            <Label htmlFor="additionalFeeName" className="text-sm">Fee Name</Label>
                                            <Input
                                                id="additionalFeeName"
                                                placeholder="e.g., Packaging Fee"
                                                value={formData.additionalFeeName}
                                                onChange={(e) => setFormData({ ...formData, additionalFeeName: e.target.value })}
                                                className="mt-2 bg-white max-w-xs"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="additionalFee" className="text-sm">Fee Amount (₹)</Label>
                                            <Input
                                                id="additionalFee"
                                                type="number"
                                                step="0.01"
                                                placeholder="e.g., 30.00"
                                                value={formData.additionalFee}
                                                onChange={(e) => setFormData({ ...formData, additionalFee: e.target.value })}
                                                className="mt-2 bg-white max-w-xs"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="border-t border-neutral-200" />

                        {/* ===== PRICE PREVIEW ===== */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-neutral-900">Price Breakdown Preview</h2>
                            <div className="bg-neutral-50 rounded-xl p-5 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-600">Subtotal</span>
                                    <span>₹{breakdown.subtotal.toFixed(2)}</span>
                                </div>
                                {gstType !== 'none' && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-600">GST ({breakdown.gstPercent}%)</span>
                                        <span>₹{breakdown.gstAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                {hasDeliveryFee && breakdown.deliveryFee > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-600">Delivery Fee</span>
                                        <span>₹{breakdown.deliveryFee.toFixed(2)}</span>
                                    </div>
                                )}
                                {hasPlatformFee && breakdown.platformFee > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-600">Platform Fee</span>
                                        <span>₹{breakdown.platformFee.toFixed(2)}</span>
                                    </div>
                                )}
                                {hasAdditionalFee && breakdown.additionalFee > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-600">{formData.additionalFeeName || 'Additional Fee'}</span>
                                        <span>₹{breakdown.additionalFee.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="border-t border-neutral-200 pt-3 flex justify-between items-center">
                                    <span className="font-semibold text-neutral-900">Total Customer Pays</span>
                                    <span className="text-xl font-bold text-[#161616]">₹{breakdown.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-neutral-200" />

                        {/* ===== PRODUCT IMAGES ===== */}
                        <div className="space-y-3">
                            <h2 className="text-lg font-semibold text-neutral-900">Product Images</h2>
                            
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
                                            
                                            {img.uploading && (
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                                                </div>
                                            )}
                                            
                                            {img.error && (
                                                <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center p-2">
                                                    <p className="text-white text-xs text-center">{img.error}</p>
                                                </div>
                                            )}
                                            
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

                        <div className="border-t border-neutral-200" />

                        {/* ===== AFFILIATE & ACTIVE ===== */}
                        <div className="space-y-4">
                            <div 
                                onClick={() => setHasAffiliate(!hasAffiliate)}
                                className={`flex items-center justify-between p-5 rounded-xl border-2 transition-all cursor-pointer ${
                                    hasAffiliate 
                                        ? 'border-[#161616] bg-[#7C3AED]/5' 
                                        : 'border-neutral-200'
                                }`}
                            >
                                <div>
                                    <Label className="font-medium text-base cursor-pointer">Affiliate Product</Label>
                                    <p className="text-sm text-neutral-500">Redirect buyers to an external link</p>
                                </div>
                                <div 
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center gap-3"
                                >
                                    <span className={`text-sm font-medium transition-colors ${
                                        hasAffiliate ? 'text-[#7C3AED]' : 'text-neutral-400'
                                    }`}>
                                        {hasAffiliate ? 'ON' : 'OFF'}
                                    </span>
                                    <Switch
                                        checked={hasAffiliate}
                                        onCheckedChange={setHasAffiliate}
                                        className="data-[state=checked]:bg-[#161616]"
                                    />
                                </div>
                            </div>

                            {hasAffiliate && (
                                <div className="space-y-2 p-4 bg-[#f8f7fb] rounded-xl">
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

                            <div 
                                onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                                className="flex items-center justify-between p-5 rounded-xl border-2 border-neutral-200 cursor-pointer"
                            >
                                <div>
                                    <Label className="font-medium text-base cursor-pointer">Active</Label>
                                    <p className="text-sm text-neutral-500">Make this product visible to buyers</p>
                                </div>
                                <div 
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center gap-3"
                                >
                                    <span className={`text-sm font-medium transition-colors ${
                                        formData.isActive ? 'text-[#7C3AED]' : 'text-neutral-400'
                                    }`}>
                                        {formData.isActive ? 'ON' : 'OFF'}
                                    </span>
                                    <Switch
                                        checked={formData.isActive}
                                        onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                                        className="data-[state=checked]:bg-[#161616]"
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>
                        )}

                        <div className="flex gap-4 pt-4">
                            <Button 
                                type="submit" 
                                className="flex-1 h-12 text-lg" 
                                style={{ backgroundColor: '#7C3AED' }}
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
                                className="h-12 px-8"
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