// src/app/seller/settings/page.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Loader2, Save, Trash2, Store, AlertTriangle, Truck, RotateCcw, Upload, X, ImageIcon, Clock, Mail, CheckCircle } from 'lucide-react'

export default function SettingsPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [storeId, setStoreId] = useState('')
    const [deleting, setDeleting] = useState(false)
    const [deleteRequested, setDeleteRequested] = useState(false)

    // Image upload states
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
        bannerUrl: '',
        isActive: true,
        // Policies
        returnPolicy: '',
        returnWindowDays: '7',
        acceptsReturns: true,
        shippingPolicy: '',
        processingTimeDays: '3',
        deliveryTimeDaysMin: '5',
        deliveryTimeDaysMax: '10',
        freeShippingAbove: '',
        shippingFee: '0',
    })

    useEffect(() => {
        fetchStore()
    }, [])

    // Check if store is already pending deletion
    useEffect(() => {
        if (storeId && formData.isActive === false) {
            setDeleteRequested(true)
        }
    }, [storeId, formData.isActive])

    const fetchStore = async () => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return

        const { data } = await supabase
            .from('stores')
            .select('*')
            .eq('owner_id', user.id)
            .single()

        if (data) {
            setStoreId(data.id)
            setFormData({
                name: data.name,
                slug: data.slug,
                description: data.description || '',
                category: data.category || '',
                contactEmail: data.contact_email || '',
                contactPhone: data.contact_phone || '',
                whatsappNumber: data.whatsapp_number || '',
                logoUrl: data.logo_url || '',
                bannerUrl: data.banner_url || '',
                isActive: data.is_active,
                returnPolicy: data.return_policy || '',
                returnWindowDays: data.return_window_days?.toString() || '7',
                acceptsReturns: data.accepts_returns ?? true,
                shippingPolicy: data.shipping_policy || '',
                processingTimeDays: data.processing_time_days?.toString() || '3',
                deliveryTimeDaysMin: data.delivery_time_days_min?.toString() || '5',
                deliveryTimeDaysMax: data.delivery_time_days_max?.toString() || '10',
                freeShippingAbove: data.free_shipping_above?.toString() || '',
                shippingFee: data.shipping_fee?.toString() || '0',
            })
            // Set previews from existing URLs
            if (data.logo_url) setLogoPreview(data.logo_url)
            if (data.banner_url) setBannerPreview(data.banner_url)
        }

        setLoading(false)
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

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess(false)
        setSaving(true)

        const supabase = createClient()

        const { error: updateError } = await supabase
            .from('stores')
            .update({
                name: formData.name,
                slug: formData.slug,
                description: formData.description,
                category: formData.category,
                contact_email: formData.contactEmail,
                contact_phone: formData.contactPhone,
                whatsapp_number: formData.whatsappNumber,
                logo_url: formData.logoUrl,
                banner_url: formData.bannerUrl,
                is_active: formData.isActive,
                return_policy: formData.returnPolicy,
                return_window_days: parseInt(formData.returnWindowDays) || 7,
                accepts_returns: formData.acceptsReturns,
                shipping_policy: formData.shippingPolicy,
                processing_time_days: parseInt(formData.processingTimeDays) || 3,
                delivery_time_days_min: parseInt(formData.deliveryTimeDaysMin) || 5,
                delivery_time_days_max: parseInt(formData.deliveryTimeDaysMax) || 10,
                free_shipping_above: formData.freeShippingAbove ? parseFloat(formData.freeShippingAbove) : null,
                shipping_fee: parseFloat(formData.shippingFee) || 0,
            })
            .eq('id', storeId)

        if (updateError) {
            setError(updateError.message)
            setSaving(false)
            return
        }

        setSuccess(true)
        setSaving(false)
    }

    const handleDelete = async () => {
        setDeleting(true)
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            setDeleting(false)
            return
        }

        try {
            // 1. Deactivate store (don't delete yet)
            const { error: updateError } = await supabase
                .from('stores')
                .update({ 
                    is_active: false,
                    deletion_requested_at: new Date().toISOString()
                })
                .eq('id', storeId)

            if (updateError) {
                setError(updateError.message)
                setDeleting(false)
                return
            }

            // 2. Deactivate all products
            await supabase
                .from('products')
                .update({ is_active: false })
                .eq('store_id', storeId)

            // 3. Send admin notification email
            await fetch('/api/admin/delete-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    storeId: storeId,
                    storeName: formData.name,
                    storeSlug: formData.slug,
                    sellerEmail: user.email,
                    sellerName: formData.name,
                    sellerPhone: formData.contactPhone,
                    sellerId: user.id,
                    requestedAt: new Date().toISOString(),
                })
            })

            setDeleteRequested(true)
            setSuccess(true)

        } catch (err: any) {
            setError('Failed to process deletion request: ' + err.message)
        }

        setDeleting(false)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-neutral-900">Store Settings</h1>
                <p className="text-neutral-500 mt-1">Update your store details, policies, and preferences</p>
            </div>

            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Store className="w-5 h-5" />
                        Store Information
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Store Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">Store Slug</Label>
                            <Input
                                id="slug"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                required
                            />
                            <p className="text-xs text-neutral-500">URL: hookit.online/store/{formData.slug}</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Input
                                id="category"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="contactEmail">Contact Email (for order notifications)</Label>
                                <Input
                                    id="contactEmail"
                                    type="email"
                                    value={formData.contactEmail}
                                    required
                                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contactPhone">Contact Phone</Label>
                                <Input
                                    id="contactPhone"
                                    type="tel"
                                    value={formData.contactPhone}
                                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                            <Input
                                id="whatsappNumber"
                                type="tel"
                                value={formData.whatsappNumber}
                                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                            />
                        </div>

                        {/* ===== LOGO UPLOAD ===== */}
                        <div className="space-y-3">
                            <Label>Store Logo</Label>
                            <div className="flex items-center gap-4">
                                {logoPreview ? (
                                    <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-neutral-200 shrink-0">
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
                                    <div className="w-24 h-24 bg-neutral-100 rounded-xl flex items-center justify-center border border-dashed border-neutral-300 shrink-0">
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
                                        PNG, JPG or WebP. Max 5MB. Recommended: 400x400px.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ===== BANNER UPLOAD ===== */}
                        <div className="space-y-3">
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

                        <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                            <div>
                                <Label className="font-medium">Store Active</Label>
                                <p className="text-sm text-neutral-500">Make your store visible to buyers</p>
                            </div>
                            <Switch
                                checked={formData.isActive}
                                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                            />
                        </div>

                        {/* ===== RETURN & REFUND POLICY ===== */}
                        <div className="border-t border-neutral-200 pt-6">
                            <CardHeader className="px-0 pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <RotateCcw className="w-5 h-5 text-[#7C3AED]" />
                                    Return & Refund Policy
                                </CardTitle>
                            </CardHeader>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                                    <div>
                                        <Label className="font-medium">Accept Returns</Label>
                                        <p className="text-sm text-neutral-500">Allow buyers to return products</p>
                                    </div>
                                    <Switch
                                        checked={formData.acceptsReturns}
                                        onCheckedChange={(checked) => setFormData({ ...formData, acceptsReturns: checked })}
                                    />
                                </div>

                                {formData.acceptsReturns && (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="returnWindowDays">Return Window (Days)</Label>
                                                <Input
                                                    id="returnWindowDays"
                                                    type="number"
                                                    min="1"
                                                    max="30"
                                                    value={formData.returnWindowDays}
                                                    onChange={(e) => setFormData({ ...formData, returnWindowDays: e.target.value })}
                                                />
                                                <p className="text-xs text-neutral-500">Days after delivery buyer can request return</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="returnPolicy">Return Policy Details</Label>
                                            <Textarea
                                                id="returnPolicy"
                                                placeholder="e.g., We accept returns within 7 days for unused items in original packaging. Refunds processed within 5 business days."
                                                value={formData.returnPolicy}
                                                onChange={(e) => setFormData({ ...formData, returnPolicy: e.target.value })}
                                                rows={4}
                                            />
                                            <p className="text-xs text-neutral-500">This will be displayed on your store page and product pages</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* ===== SHIPPING & DELIVERY POLICY ===== */}
                        <div className="border-t border-neutral-200 pt-6">
                            <CardHeader className="px-0 pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Truck className="w-5 h-5 text-[#7C3AED]" />
                                    Shipping & Delivery Policy
                                </CardTitle>
                            </CardHeader>
                            
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="processingTimeDays">Processing Time (Days)</Label>
                                        <Input
                                            id="processingTimeDays"
                                            type="number"
                                            min="1"
                                            max="14"
                                            value={formData.processingTimeDays}
                                            onChange={(e) => setFormData({ ...formData, processingTimeDays: e.target.value })}
                                        />
                                        <p className="text-xs text-neutral-500">Days to ship after order</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="deliveryTimeDaysMin">Delivery Min (Days)</Label>
                                        <Input
                                            id="deliveryTimeDaysMin"
                                            type="number"
                                            min="1"
                                            value={formData.deliveryTimeDaysMin}
                                            onChange={(e) => setFormData({ ...formData, deliveryTimeDaysMin: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="deliveryTimeDaysMax">Delivery Max (Days)</Label>
                                        <Input
                                            id="deliveryTimeDaysMax"
                                            type="number"
                                            min="1"
                                            value={formData.deliveryTimeDaysMax}
                                            onChange={(e) => setFormData({ ...formData, deliveryTimeDaysMax: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="shippingFee">Standard Shipping Fee (₹)</Label>
                                        <Input
                                            id="shippingFee"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={formData.shippingFee}
                                            onChange={(e) => setFormData({ ...formData, shippingFee: e.target.value })}
                                        />
                                        <p className="text-xs text-neutral-500">0 for free shipping</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="freeShippingAbove">Free Shipping Above (₹)</Label>
                                        <Input
                                            id="freeShippingAbove"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            placeholder="e.g., 500"
                                            value={formData.freeShippingAbove}
                                            onChange={(e) => setFormData({ ...formData, freeShippingAbove: e.target.value })}
                                        />
                                        <p className="text-xs text-neutral-500">Leave empty if no free shipping threshold</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="shippingPolicy">Shipping Policy Details</Label>
                                    <Textarea
                                        id="shippingPolicy"
                                        placeholder="e.g., We ship via Delhivery and Blue Dart. All orders are carefully packed and dispatched within 2-3 business days. Tracking details are shared via WhatsApp."
                                        value={formData.shippingPolicy}
                                        onChange={(e) => setFormData({ ...formData, shippingPolicy: e.target.value })}
                                        rows={4}
                                    />
                                    <p className="text-xs text-neutral-500">Displayed on your store page</p>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 bg-red-50 p-3 rounded">{error}</p>
                        )}

                        {success && (
                            <p className="text-sm text-green-600 bg-green-50 p-3 rounded">
                                Store settings updated successfully!
                            </p>
                        )}

                        <Button type="submit" className="w-full gap-2" disabled={saving || uploadingLogo || uploadingBanner} size="lg">
                            {saving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save All Changes
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Danger Zone */}
            {deleteRequested ? (
                <Card className="border-amber-200 shadow-sm bg-amber-50">
                    <CardContent className="p-6 text-center">
                        <Clock className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-amber-800 mb-2">
                            Store Deactivation Pending
                        </h3>
                        <p className="text-amber-700 mb-4 max-w-md mx-auto">
                            Your store has been deactivated and is scheduled for permanent deletion within <strong>48 hours</strong>.
                        </p>
                        <div className="bg-white rounded-lg p-4 mb-4 text-left max-w-md mx-auto">
                            <p className="text-sm text-neutral-600 mb-2">
                                <Mail className="w-4 h-4 inline mr-2" />
                                We've notified our team. You'll receive an email confirmation shortly.
                            </p>
                            <p className="text-sm text-neutral-600">
                                <CheckCircle className="w-4 h-4 inline mr-2" />
                                Your store and products are no longer visible to buyers.
                            </p>
                        </div>
                        <p className="text-xs text-amber-600">
                            Changed your mind? Contact support at support@hookit.online
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <Card className="border-red-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="w-5 h-5" />
                            Danger Zone
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-neutral-600 mb-4">
                            Deactivating your store will hide all products from buyers. Our team will review and permanently delete your data within 48 hours.
                        </p>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="gap-2" disabled={deleting}>
                                    <Trash2 className="w-4 h-4" />
                                    {deleting ? 'Processing...' : 'Delete Store'}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will deactivate your store immediately. All products will be hidden from buyers. 
                                        Your store data will be permanently deleted by our team within 48 hours after review.
                                        This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        className="bg-red-600 hover:bg-red-700"
                                        disabled={deleting}
                                    >
                                        {deleting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                                Processing...
                                            </>
                                        ) : (
                                            'Yes, Deactivate & Delete'
                                        )}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}