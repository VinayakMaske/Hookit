import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Wallet, ArrowDownLeft, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react'

export default async function PayoutsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    // Get seller's store
    const { data: store } = await supabase
        .from('stores')
        .select('id')
        .eq('owner_id', user.id)
        .single()

    if (!store) redirect('/seller/store/create')

    // Fetch completed orders (money earned but may not be paid out yet)
    const { data: completedOrders } = await supabase
        .from('orders')
        .select('id, total_amount, status, created_at, store_id, product_id, payment_status, products(name)')
        .eq('store_id', store.id)
        .eq('status', 'completed')
        .eq('payment_status', 'paid')
        .order('created_at', { ascending: false })

    // Fetch existing payouts
    const { data: payouts } = await supabase
        .from('payouts')
        .select('id, order_id, amount, status, utr_number, created_at, seller_id')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false })

    // Calculate totals
    const totalEarned = completedOrders?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0
    const totalPaid = payouts?.filter(p => p.status === 'completed').reduce((sum, p) => sum + Number(p.amount), 0) || 0
    const totalPending = totalEarned - totalPaid

    // Pending payouts = completed orders that don't have a completed payout
    const completedOrderIds = new Set(payouts?.filter(p => p.status === 'completed').map(p => p.order_id) || [])
    const pendingPayouts = completedOrders?.filter(o => !completedOrderIds.has(o.id)) || []

    const statusConfig: Record<string, { color: string; icon: typeof CheckCircle }> = {
        pending: { color: 'bg-amber-100 text-amber-700', icon: Clock },
        processing: { color: 'bg-blue-100 text-blue-700', icon: ArrowDownLeft },
        completed: { color: 'bg-green-100 text-green-700', icon: CheckCircle },
        failed: { color: 'bg-red-100 text-red-700', icon: XCircle }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-neutral-900">Payouts</h1>
                <p className="text-neutral-500 mt-1">Track payments received from the platform</p>
            </div>

            {/* Stats Cards */}
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
                        <div className="text-2xl font-bold text-amber-600">₹{totalPending.toFixed(2)}</div>
                        <p className="text-xs text-neutral-500 mt-1">Awaiting payout</p>
                    </CardContent>
                </Card>
            </div>

            {/* Pending Payouts Section */}
            {pendingPayouts.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-amber-500" />
                        Pending Payouts ({pendingPayouts.length})
                    </h2>
                    <div className="space-y-3">
                        {pendingPayouts.map((order) => {
                            // products is an array from Supabase, get first item
                            const product = Array.isArray(order.products) ? order.products[0] : order.products
                            return (
                                <Card key={order.id} className="border-0 shadow-sm border-l-4 border-l-amber-400">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 rounded-lg bg-amber-50">
                                                    <Clock className="w-5 h-5 text-amber-500" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-neutral-900">
                                                        {product?.name || 'Order'}
                                                    </p>
                                                    <p className="text-sm text-neutral-500">
                                                        Order #{order.id.slice(0, 8)} • {new Date(order.created_at).toLocaleDateString('en-IN')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-amber-600">₹{Number(order.total_amount).toFixed(2)}</p>
                                                <Badge className="bg-amber-100 text-amber-700 border-0">
                                                    Awaiting Payout
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Payout History */}
            <div>
                <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-purple-500" />
                    Payout History
                </h2>

                {payouts && payouts.length > 0 ? (
                    <div className="space-y-3">
                        {payouts.map((payout) => {
                            const config = statusConfig[payout.status] || statusConfig.pending
                            const StatusIcon = config.icon

                            return (
                                <Card key={payout.id} className="border-0 shadow-sm">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={cn('p-2 rounded-lg', config.color)}>
                                                    <StatusIcon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-neutral-900">
                                                        ₹{Number(payout.amount).toFixed(2)}
                                                    </p>
                                                    <p className="text-sm text-neutral-500">
                                                        Order #{payout.order_id?.slice(0, 8) || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <Badge className={config.color}>
                                                    {payout.status === 'completed' ? 'Paid' : payout.status}
                                                </Badge>
                                                <p className="text-xs text-neutral-500 mt-1">
                                                    {new Date(payout.created_at).toLocaleDateString('en-IN', {
                                                        day: 'numeric', month: 'short', year: 'numeric'
                                                    })}
                                                </p>
                                                {payout.utr_number && (
                                                    <p className="text-xs text-neutral-400 mt-0.5">
                                                        UTR: {payout.utr_number}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                ) : (
                    <Card className="border-0 shadow-sm">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <Wallet className="w-12 h-12 text-neutral-300 mb-4" />
                            <h3 className="text-lg font-medium text-neutral-900 mb-2">No payouts yet</h3>
                            <p className="text-neutral-500 text-center max-w-sm">
                                Payouts will appear here once the platform processes your payments. You receive payouts after orders are completed.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}

function cn(...classes: (string | undefined | false)[]) {
    return classes.filter(Boolean).join(' ')
}