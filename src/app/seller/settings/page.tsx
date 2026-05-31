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
import { Loader2, Save, Trash2, Store, AlertTriangle } from 'lucide-react'

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
        isActive: true
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
                isActive: data.is_active
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
                is_active: formData.isActive
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

        // Delete store (cascades to products and orders via foreign keys)
        await supabase.from('stores').delete().eq('id', storeId)

        // Sign out user
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
                <p className="text-neutral-500 mt-1">Update your store details or delete your account</p>
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
                            <p className="text-xs text-neutral-500">URL: yoursite.com/store/{formData.slug}</p>
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
                            <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
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
                                    Save Changes
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