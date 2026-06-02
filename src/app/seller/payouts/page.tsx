// src/app/seller/payouts/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Wallet, Clock, CheckCircle, TrendingUp } from 'lucide-react'

export default async function PayoutsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    // Get seller's payouts
    const { data: payouts } = await supabase
        .from('payouts')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false })

    const awaiting = payouts?.filter(p => p.status === 'awaiting_payout') || []
    const paid = payouts?.filter(p => p.status === 'paid') || []
    
    const totalAwaiting = awaiting.reduce((sum, p) => sum + Number(p.amount), 0)
    const totalPaid = paid.reduce((sum, p) => sum + Number(p.amount), 0)
    const totalEarned = totalAwaiting + totalPaid

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-neutral-900">Payouts</h1>
                <p className="text-neutral-500 mt-1">Track payments received from the platform</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-600 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Total Earned
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-neutral-900">₹{totalEarned.toFixed(2)}</div>
                        <p className="text-xs text-neutral-500 mt-1">From completed orders</p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-600">Total Paid</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">₹{totalPaid.toFixed(2)}</div>
                        <p className="text-xs text-neutral-500 mt-1">Transferred to your account</p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-600">Pending</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-600">₹{totalAwaiting.toFixed(2)}</div>
                        <p className="text-xs text-neutral-500 mt-1">Awaiting payout</p>
                    </CardContent>
                </Card>
            </div>

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
                                                    Order #{payout.order_id.slice(0, 8)} • {new Date(payout.created_at).toLocaleDateString('en-IN')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-amber-600">₹{Number(payout.amount).toFixed(2)}</p>
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

            <div>
                <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-purple-500" />
                    Payout History
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
                                                    Order #{payout.order_id.slice(0, 8)}
                                                </p>
                                                {payout.utr_number && (
                                                    <p className="text-xs text-neutral-400">
                                                        UTR: {payout.utr_number}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-green-600">₹{Number(payout.amount).toFixed(2)}</p>
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
                            <h3 className="text-lg font-medium text-neutral-900 mb-2">No payouts yet</h3>
                            <p className="text-neutral-500 text-center max-w-sm">
                                Payouts will appear here once the platform processes your payments.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}