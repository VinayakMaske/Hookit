// src/app/seller/settings/page.tsx - UPDATED WITH POLICY FIELDS
'use client'

import { useState, useEffect } from 'react'
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
import { Loader2, Save, Trash2, Store, AlertTriangle, Truck, RotateCcw, Shield, Globe } from 'lucide-react'

export default function SettingsPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [storeId, setStoreId] = useState('')
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
                // Policies
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
        }

        setLoading(false)
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
                // Policies
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
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return

        await supabase.from('stores').delete().eq('id', storeId)
        await supabase.auth.signOut()

        router.push('/')
        router.refresh()
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
                                <Label htmlFor="contactEmail">Contact Email</Label>
                                <Input
                                    id="contactEmail"
                                    type="email"
                                    value={formData.contactEmail}
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
                            <Label htmlFor="whatsappNumber">WhatsApp Number (for order notifications)</Label>
                            <Input
                                id="whatsappNumber"
                                type="tel"
                                value={formData.whatsappNumber}
                                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="logoUrl">Logo URL</Label>
                            <Input
                                id="logoUrl"
                                type="url"
                                value={formData.logoUrl}
                                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bannerUrl">Banner URL</Label>
                            <Input
                                id="bannerUrl"
                                type="url"
                                value={formData.bannerUrl}
                                onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                            />
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

                        <Button type="submit" className="w-full gap-2" disabled={saving} size="lg">
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
            <Card className="border-red-200 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="w-5 h-5" />
                        Danger Zone
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-neutral-600 mb-4">
                        Deleting your store will permanently remove all products, orders, and data. This action cannot be undone.
                    </p>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="gap-2">
                                <Trash2 className="w-4 h-4" />
                                Delete Store
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete your store, all products, orders, and payout history.
                                    You will be logged out and all data will be lost forever.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    Yes, Delete Everything
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>
        </div>
    )
}