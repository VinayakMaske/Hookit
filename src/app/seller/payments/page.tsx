'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Save, Banknote, CreditCard, Smartphone } from 'lucide-react'

export default function PaymentsPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [formData, setFormData] = useState({
        accountHolderName: '',
        upiId: '',
        bankAccountNumber: '',
        ifscCode: '',
        bankName: '',
        email: '',
        phone: ''
    })

    useEffect(() => {
        fetchPayoutDetails()
    }, [])

    const fetchPayoutDetails = async () => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return

        const { data } = await supabase
            .from('payout_details')
            .select('*')
            .eq('seller_id', user.id)
            .single()

        if (data) {
            setFormData({
                accountHolderName: data.account_holder_name || '',
                upiId: data.upi_id || '',
                bankAccountNumber: data.bank_account_number || '',
                ifscCode: data.ifsc_code || '',
                bankName: data.bank_name || '',
                email: data.email || '',
                phone: data.phone || ''
            })
        }

        setLoading(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess(false)
        setSaving(true)

        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            setError('You must be logged in')
            setSaving(false)
            return
        }

        const { error: upsertError } = await supabase
            .from('payout_details')
            .upsert({
                seller_id: user.id,
                account_holder_name: formData.accountHolderName,
                upi_id: formData.upiId,
                bank_account_number: formData.bankAccountNumber,
                ifsc_code: formData.ifscCode,
                bank_name: formData.bankName,
                email: formData.email,
                phone: formData.phone
            }, { onConflict: 'seller_id' })

        if (upsertError) {
            setError(upsertError.message)
            setSaving(false)
            return
        }

        setSuccess(true)
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
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-neutral-900">Payment Details</h1>
                <p className="text-neutral-500 mt-1">Add your payout information to receive payments</p>
                <p className="text-red-900 mt-1">Your earnings are processed every Friday for orders which are marked as delivered. Minimum payout balance is ₹500.</p>
            </div>

            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Banknote className="w-5 h-5" />
                        Payout Information
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="accountHolderName">Account Holder Name</Label>
                            <Input
                                id="accountHolderName"
                                placeholder="Full name as per bank account"
                                value={formData.accountHolderName}
                                onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                            />
                        </div>

                        <div className="p-4 bg-blue-50 rounded-lg space-y-4">
                            <div className="flex items-center gap-2 text-blue-700 font-medium">
                                <Smartphone className="w-5 h-5" />
                                UPI Details
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="upiId">UPI ID</Label>
                                <Input
                                    id="upiId"
                                    placeholder="yourname@upi"
                                    value={formData.upiId}
                                    onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="p-4 bg-neutral-50 rounded-lg space-y-4">
                            <div className="flex items-center gap-2 text-neutral-700 font-medium">
                                <CreditCard className="w-5 h-5" />
                                Bank Account Details
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="bankAccountNumber">Account Number</Label>
                                    <Input
                                        id="bankAccountNumber"
                                        placeholder="1234567890"
                                        value={formData.bankAccountNumber}
                                        onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ifscCode">IFSC Code</Label>
                                    <Input
                                        id="ifscCode"
                                        placeholder="SBIN0001234"
                                        value={formData.ifscCode}
                                        onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bankName">Bank Name</Label>
                                <Input
                                    id="bankName"
                                    placeholder="State Bank of India"
                                    value={formData.bankName}
                                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email for Notifications</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="payouts@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone for Notifications</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 bg-red-50 p-3 rounded">{error}</p>
                        )}

                        {success && (
                            <p className="text-sm text-green-600 bg-green-50 p-3 rounded">
                                Payout details saved successfully!
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
                                    Save Payout Details
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}