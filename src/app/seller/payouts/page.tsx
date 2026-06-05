// src/app/seller/payouts/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Wallet, Clock, CheckCircle, TrendingUp, AlertCircle, Percent } from 'lucide-react'

interface Payout {
    id: string
    seller_id: string
    order_id: string
    store_id: string
    product_name: string | null
    amount: number          // total order amount
    paid_amount: number | null  // what seller gets after commission
    platform_fee: number | null // your commission
    status: string
    utr_number: string | null
    paid_at: string | null
    created_at: string
    updated_at: string
}

export default function PayoutsPage() {
    const [payouts, setPayouts] = useState<Payout[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [commissionRate, setCommissionRate] = useState<number>(9.5)

    const fetchPayouts = async () => {
        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                setLoading(false)
                return
            }

            // Fetch commission rate
            const { data: settings } = await supabase
                .from('platform_settings')
                .select('value')
                .eq('key', 'commission_rate')
                .single()

            if (settings) {
                setCommissionRate(parseFloat(settings.value))
            }

            // Fetch payouts
            const { data, error: fetchError } = await supabase
                .from('payouts')
                .select('*')
                .eq('seller_id', user.id)
                .order('created_at', { ascending: false })

            if (fetchError) {
                console.error('Error fetching payouts:', fetchError)
                setError(fetchError.message)
                setLoading(false)
                return
            }

            setPayouts(data || [])
            setLoading(false)
        } catch (err: any) {
            console.error('Exception:', err)
            setError(err.message)
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPayouts()
    }, [])

    // Calculate totals
    const awaiting = payouts.filter(p => p.status === 'awaiting_payout')
    const paid = payouts.filter(p => p.status === 'paid')
    
    // Total Earned = sum of all order amounts (what buyer paid)
    const totalEarned = payouts.reduce((sum, p) => sum + Number(p.amount), 0)
    
    // Total Paid = sum of paid_amount (what you actually transferred to seller)
    const totalPaid = paid.reduce((sum, p) => sum + Number(p.paid_amount || 0), 0)
    
    // Pending = awaiting payouts show their paid_amount (after commission)
    const totalPending = awaiting.reduce((sum, p) => sum + Number(p.paid_amount || 0), 0)
    
    // Your total commission earned
    const totalCommission = payouts.reduce((sum, p) => sum + Number(p.platform_fee || 0), 0)

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <div>
                        <p className="font-medium text-red-700">Error loading payouts</p>
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-neutral-900">Payouts</h1>
                <p className="text-neutral-500 mt-1">Track payments received from the platform</p>
                <p className="text-red-900 mt-1">Your earnings are processed every Friday for orders which are marked as delivered. Minimum payout balance is ₹500.</p>
                <p className="text-red-900 mt-1">For payment related queries please contact on +918459444524 or storeapp2026@gmail.com.</p>
    
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 text-sm text-neutral-600 mb-2">
                            <TrendingUp className="w-4 h-4" />
                            Total Earned
                        </div>
                        <div className="text-2xl font-bold text-neutral-900">₹{totalEarned.toFixed(2)}</div>
                        <p className="text-xs text-neutral-500 mt-1">From completed orders</p>
                    </CardContent>
                </Card>
                
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 text-sm text-neutral-600 mb-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Total Paid
                        </div>
                        <div className="text-2xl font-bold text-green-600">₹{totalPaid.toFixed(2)}</div>
                        <p className="text-xs text-neutral-500 mt-1">Transferred to seller</p>
                    </CardContent>
                </Card>
                
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 text-sm text-neutral-600 mb-2">
                            <Clock className="w-4 h-4 text-amber-500" />
                            Pending
                        </div>
                        <div className="text-2xl font-bold text-amber-600">₹{totalPending.toFixed(2)}</div>
                        <p className="text-xs text-neutral-500 mt-1">Awaiting payout </p>
                    </CardContent>
                </Card>
            </div>

            {/* Pending Payouts */}
            {awaiting.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-amber-500" />
                        Pending Payouts ({awaiting.length})
                    </h2>
                    <div className="space-y-3">
                        {awaiting.map((payout) => (
                            <Card key={payout.id} className="border-0 shadow-sm border-l-4 border-l-amber-400">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 rounded-lg bg-amber-50">
                                                <Clock className="w-5 h-5 text-amber-500" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-neutral-900">
                                                    {payout.product_name || 'Order'}
                                                </p>
                                                <p className="text-sm text-neutral-500">
                                                    Order #{payout.order_id?.slice(0, 8)} • {new Date(payout.created_at).toLocaleDateString('en-IN')}
                                                </p>
                                                <p className="text-xs text-neutral-400">
                                                    Order: ₹{Number(payout.amount).toFixed(2)} → You pay: ₹{Number(payout.paid_amount).toFixed(2)} (Fee: ₹{Number(payout.platform_fee).toFixed(2)})
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-amber-600">₹{Number(payout.paid_amount).toFixed(2)}</p>
                                            <Badge className="bg-amber-100 text-amber-700 border-0">
                                                Awaiting Payout
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Paid History */}
            <div>
                <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-green-500" />
                    Payout History ({paid.length})
                </h2>

                {paid.length > 0 ? (
                    <div className="space-y-3">
                        {paid.map((payout) => (
                            <Card key={payout.id} className="border-0 shadow-sm border-l-4 border-l-green-400">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 rounded-lg bg-green-50">
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-neutral-900">
                                                    {payout.product_name || 'Order'}
                                                </p>
                                                <p className="text-sm text-neutral-500">
                                                    Order #{payout.order_id?.slice(0, 8)}
                                                </p>
                                                <p className="text-xs text-neutral-400">
                                                    Paid: ₹{Number(payout.paid_amount).toFixed(2)} (Fee: ₹{Number(payout.platform_fee).toFixed(2)})
                                                </p>
                                                {payout.utr_number && (
                                                    <p className="text-xs text-neutral-400">
                                                        UTR: {payout.utr_number}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-green-600">₹{Number(payout.paid_amount).toFixed(2)}</p>
                                            <Badge className="bg-green-100 text-green-700 border-0">
                                                Paid
                                            </Badge>
                                            <p className="text-xs text-neutral-500 mt-1">
                                                {payout.paid_at ? new Date(payout.paid_at).toLocaleDateString('en-IN') : ''}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="border-0 shadow-sm">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <Wallet className="w-12 h-12 text-neutral-300 mb-4" />
                            <h3 className="text-lg font-medium text-neutral-900 mb-2">No paid payouts yet</h3>
                            <p className="text-neutral-500 text-center max-w-sm">
                                Payouts will appear here once admin processes them.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}