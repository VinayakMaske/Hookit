'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Loader2, Store, Upload, X, ImageIcon } from 'lucide-react'

const STORE_CATEGORIES = [
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

export default function CreateStorePage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [logoPreview, setLogoPreview] = useState<string | null>(null)
    const [bannerPreview, setBannerPreview] = useState<string | null>(null)
    const [uploadingLogo, setUploadingLogo] = useState(false)
    const [uploadingBanner, setUploadingBanner] = useState(false)
    const logoInputRef = useRef<HTMLInputElement>(null)
    const bannerInputRef = useRef<HTMLInputElement>(null)

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        category: '',
        contactEmail: '',
        contactPhone: '',
        whatsappNumber: '',
        logoUrl: '',
        bannerUrl: ''
    })

    const generateSlug = (name: string) => {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value
        setFormData(prev => ({
            ...prev,
            name,
            slug: generateSlug(name)
        }))
    }

    const uploadImage = async (file: File, type: 'logo' | 'banner') => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        setError('You must be logged in to upload images')
        return null
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${type}-${Date.now()}.${fileExt}`

    if (type === 'logo') setUploadingLogo(true)
    else setUploadingBanner(true)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'store-assets')
    formData.append('fileName', fileName)

    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        })

        const result = await response.json()

        if (!response.ok || !result.success) {
            setError(`Failed to upload ${type}: ${result.error || 'Upload failed'}`)
            if (type === 'logo') setUploadingLogo(false)
            else setUploadingBanner(false)
            return null
        }

        if (type === 'logo') setUploadingLogo(false)
        else setUploadingBanner(false)

        return result.url
    } catch (err: any) {
        setError(`Failed to upload ${type}: ${err.message || 'Upload failed'}`)
        if (type === 'logo') setUploadingLogo(false)
        else setUploadingBanner(false)
        return null
    }
}

    const handleLogoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Show preview immediately
        const reader = new FileReader()
        reader.onloadend = () => setLogoPreview(reader.result as string)
        reader.readAsDataURL(file)

        // Upload to Supabase
        const url = await uploadImage(file, 'logo')
        if (url) {
            setFormData(prev => ({ ...prev, logoUrl: url }))
        }
    }

    const handleBannerSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Show preview immediately
        const reader = new FileReader()
        reader.onloadend = () => setBannerPreview(reader.result as string)
        reader.readAsDataURL(file)

        // Upload to Supabase
        const url = await uploadImage(file, 'banner')
        if (url) {
            setFormData(prev => ({ ...prev, bannerUrl: url }))
        }
    }

    const removeLogo = () => {
        setLogoPreview(null)
        setFormData(prev => ({ ...prev, logoUrl: '' }))
        if (logoInputRef.current) logoInputRef.current.value = ''
    }

    const removeBanner = () => {
        setBannerPreview(null)
        setFormData(prev => ({ ...prev, bannerUrl: '' }))
        if (bannerInputRef.current) bannerInputRef.current.value = ''
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!formData.name || !formData.slug) {
            setError('Store name and slug are required')
            return
        }

        if (!formData.category) {
            setError('Please select a category')
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

        const { error: insertError } = await supabase
            .from('stores')
            .insert({
                owner_id: user.id,
                name: formData.name,
                slug: formData.slug,
                description: formData.description,
                category: formData.category,
                contact_email: formData.contactEmail,
                contact_phone: formData.contactPhone,
                whatsapp_number: formData.whatsappNumber,
                logo_url: formData.logoUrl,
                banner_url: formData.bannerUrl
            })

        if (insertError) {
            setError(insertError.message)
            setLoading(false)
            return
        }

        router.push('/seller/dashboard')
        router.refresh()
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-neutral-50 py-12 px-4">
            <Card className="max-w-2xl mx-auto">
                <CardHeader className="text-center">
                    <Store className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <CardTitle className="text-2xl font-bold">Create Your Store</CardTitle>
                    <CardDescription>
                        Set up your store to start selling products
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Store Name *</Label>
                            <Input
                                id="name"
                                placeholder="My Awesome Store"
                                value={formData.name}
                                onChange={handleNameChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">Store URL Slug *</Label>
                            <Input
                                id="slug"
                                placeholder="my-awesome-store"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                This will be your store URL: xyz.com/store/{formData.slug}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Tell customers about your store..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                            />
                        </div>

                        {/* Category Dropdown */}
                        <div className="space-y-2">
                            <Label htmlFor="category">Category *</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => setFormData({ ...formData, category: value })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent className="max-h-72">
                                    {STORE_CATEGORIES.map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="contactEmail">Contact Email (for order notifications)*</Label>
                                <Input
                                    id="contactEmail"
                                    type="email"
                                    placeholder="store@example.com"
                                    value={formData.contactEmail}
                                    required
                                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="contactPhone">Contact Phone (optional)</Label>
                                <Input
                                    id="contactPhone"
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    value={formData.contactPhone}
                                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="whatsappNumber">WhatsApp Number (optional) </Label> 
                            <Input
                                id="whatsappNumber"
                                type="tel"
                                placeholder="+91 98765 43210"
                                value={formData.whatsappNumber}
                                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                            />
                        </div>

                        {/* Logo Upload */}
                        <div className="space-y-2">
                            <Label>Store Logo</Label>
                            <div className="flex items-center gap-4">
                                {logoPreview ? (
                                    <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-neutral-200">
                                        <img
                                            src={logoPreview}
                                            alt="Logo preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeLogo}
                                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-24 h-24 bg-neutral-100 rounded-xl flex items-center justify-center border border-dashed border-neutral-300">
                                        <ImageIcon className="w-8 h-8 text-neutral-400" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        ref={logoInputRef}
                                        accept="image/png,image/jpeg,image/jpg,image/webp"
                                        onChange={handleLogoSelect}
                                        className="hidden"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => logoInputRef.current?.click()}
                                        disabled={uploadingLogo}
                                        className="w-full gap-2"
                                    >
                                        {uploadingLogo ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-4 h-4" />
                                                {logoPreview ? 'Change Logo' : 'Upload Logo'}
                                            </>
                                        )}
                                    </Button>
                                    <p className="text-xs text-neutral-500 mt-1">
                                        PNG, JPG or WebP. Max 5MB.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Banner Upload */}
                        <div className="space-y-2">
                            <Label>Store Banner</Label>
                            <div className="space-y-3">
                                {bannerPreview ? (
                                    <div className="relative w-full h-40 rounded-xl overflow-hidden border border-neutral-200">
                                        <img
                                            src={bannerPreview}
                                            alt="Banner preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeBanner}
                                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-full h-40 bg-neutral-100 rounded-xl flex flex-col items-center justify-center border border-dashed border-neutral-300 gap-2">
                                        <ImageIcon className="w-10 h-10 text-neutral-400" />
                                        <p className="text-sm text-neutral-500">Banner preview will appear here</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    ref={bannerInputRef}
                                    accept="image/png,image/jpeg,image/jpg,image/webp"
                                    onChange={handleBannerSelect}
                                    className="hidden"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => bannerInputRef.current?.click()}
                                    disabled={uploadingBanner}
                                    className="w-full gap-2"
                                >
                                    {uploadingBanner ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4" />
                                            {bannerPreview ? 'Change Banner' : 'Upload Banner'}
                                        </>
                                    )}
                                </Button>
                                <p className="text-xs text-neutral-500">
                                    Recommended: 1200x400 pixels. PNG, JPG or WebP. Max 5MB.
                                </p>
                            </div>
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 bg-red-50 p-3 rounded">{error}</p>
                        )}

                        <Button type="submit" className="w-full" disabled={loading || uploadingLogo || uploadingBanner} size="lg">
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating Store...
                                </>
                            ) : (
                                'Create Store'
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}