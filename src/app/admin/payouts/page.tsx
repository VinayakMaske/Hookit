import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Wallet, CheckCircle, Clock, TrendingUp, IndianRupee } from 'lucide-react'

export default async function AdminPayoutsPage() {
    const supabase = await createClient()

    // Fetch all completed & paid orders
    const { data: completedOrders, error: ordersError } = await supabase
        .from('orders')
        .select('id, total_amount, status, payment_status, created_at, store_id, product_id')
        .eq('status', 'completed')
        .order('created_at', { ascending: false })

    // Fetch existing payouts
    const { data: existingPayouts, error: payoutsError } = await supabase
        .from('payouts')
        .select('id, order_id, amount, status, utr_number, created_at, seller_id, store_id')
        .order('created_at', { ascending: false })

    // Fetch stores with payout details
    const { data: stores } = await supabase
        .from('stores')
        .select('id, name, owner_id, payout_details(*)')

    // Fetch products
    const { data: products } = await supabase
        .from('products')
        .select('id, name')

    // Build lookup maps
    const storeMap = new Map(stores?.map(s => [s.id, s]) || [])
    const productMap = new Map(products?.map(p => [p.id, p]) || [])

    // Find pending payouts (completed orders without a payout record)
    const paidOrderIds = new Set(existingPayouts?.filter(p => p.status === 'completed').map(p => p.order_id) || [])
    const pendingPayouts = completedOrders?.filter(order => !paidOrderIds.has(order.id)) || []

    // Calculate totals
    const totalPendingAmount = pendingPayouts.reduce((sum, o) => sum + Number(o.total_amount || 0), 0)
    const totalPaidAmount = existingPayouts?.filter(p => p.status === 'completed').reduce((sum, p) => sum + Number(p.amount || 0), 0) || 0

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Payout Management</h1>
                <p className="text-neutral-400 mt-1">Process payments to sellers</p>
            </div>

            {(ordersError || payoutsError) && (
                <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 text-red-300 text-sm">
                    {ordersError && <p>Orders: {ordersError.message}</p>}
                    {payoutsError && <p>Payouts: {payoutsError.message}</p>}
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-neutral-900 border-neutral-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-400 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-amber-400" />
                            Total Pending
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-400">₹{totalPendingAmount.toFixed(2)}</div>
                        <p className="text-xs text-neutral-500 mt-1">{pendingPayouts.length} orders awaiting payout</p>
                    </CardContent>
                </Card>
                <Card className="bg-neutral-900 border-neutral-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-400 flex items-center gap-2">
                            <IndianRupee className="w-4 h-4 text-green-400" />
                            Total Paid Out
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-400">₹{totalPaidAmount.toFixed(2)}</div>
                        <p className="text-xs text-neutral-500 mt-1">All time payouts</p>
                    </CardContent>
                </Card>
                <Card className="bg-neutral-900 border-neutral-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-400">Total Sellers Owed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">
                            {new Set(pendingPayouts.map(o => o.store_id)).size}
                        </div>
                        <p className="text-xs text-neutral-500 mt-1">Unique sellers with pending payouts</p>
                    </CardContent>
                </Card>
            </div>

            {/* Pending Payouts */}
            <div>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-400" />
                    Pending Payouts ({pendingPayouts.length})
                </h2>

                {pendingPayouts.length > 0 ? (
                    <div className="space-y-4">
                        {pendingPayouts.map((order) => {
                            const store = storeMap.get(order.store_id)
                            const product = productMap.get(order.product_id)
                            const payoutDetails = store?.payout_details ? (Array.isArray(store.payout_details) ? store.payout_details : [store.payout_details]).filter(Boolean) : []
                            const payoutDetail = payoutDetails[0]
                            
                            const payoutMethod = payoutDetail?.upi_id 
                                ? `UPI: ${payoutDetail.upi_id}` 
                                : payoutDetail?.bank_account_number 
                                    ? `Bank: ${payoutDetail.bank_name || 'N/A'} • ****${payoutDetail.bank_account_number.slice(-4)}`
                                    : 'No payout method set'

                            return (
                                <Card key={order.id} className="bg-neutral-900 border-neutral-800">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="font-semibold text-white">{product?.name || 'Unknown Product'}</h3>
                                                    <Badge className="bg-amber-500/20 text-amber-400">Pending Payout</Badge>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-neutral-500">Seller</p>
                                                        <p className="text-white">{store?.name || 'Unknown'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-neutral-500">Amount</p>
                                                        <p className="text-white font-bold text-lg">₹{Number(order.total_amount).toFixed(2)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-neutral-500">Payout Method</p>
                                                        <p className="text-white text-xs">{payoutMethod}</p>
                                                    </div>
                                                </div>
                                                {payoutDetail && (
                                                    <div className="mt-3 p-3 bg-neutral-800/50 rounded-lg text-xs space-y-1">
                                                        <p className="text-neutral-400">
                                                            <span className="text-neutral-300">Account Holder:</span> {payoutDetail.account_holder_name || 'N/A'}
                                                        </p>
                                                        {payoutDetail.upi_id && (
                                                            <p className="text-neutral-400">
                                                                <span className="text-neutral-300">UPI:</span> {payoutDetail.upi_id}
                                                            </p>
                                                        )}
                                                        {payoutDetail.bank_account_number && (
                                                            <p className="text-neutral-400">
                                                                <span className="text-neutral-300">Bank:</span> {payoutDetail.bank_name} • {payoutDetail.bank_account_number} • IFSC: {payoutDetail.ifsc_code}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <form action="/api/admin/payout" method="POST" className="flex flex-col gap-3 shrink-0">
                                                <input type="hidden" name="orderId" value={order.id} />
                                                <input type="hidden" name="sellerId" value={store?.owner_id} />
                                                <input type="hidden" name="storeId" value={order.store_id} />
                                                <input type="hidden" name="amount" value={order.total_amount} />
                                                <Input
                                                    name="utrNumber"
                                                    placeholder="Enter UTR Number"
                                                    className="w-48 bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
                                                    required
                                                />
                                                <Button type="submit" className="gap-2 bg-green-600 hover:bg-green-700 w-48">
                                                    <CheckCircle className="w-4 h-4" />
                                                    Mark as Paid
                                                </Button>
                                            </form>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                ) : (
                    <Card className="bg-neutral-900 border-neutral-800">
                        <CardContent className="py-12 text-center">
                            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                            <p className="text-white font-medium">All caught up!</p>
                            <p className="text-neutral-400 text-sm">No pending payouts</p>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Payout History */}
            <div>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-purple-400" />
                    Payout History
                </h2>

                {existingPayouts && existingPayouts.length > 0 ? (
                    <div className="space-y-3">
                        {existingPayouts.map((payout) => {
                            const store = storeMap.get(payout.store_id)
                            return (
                                <Card key={payout.id} className="bg-neutral-900 border-neutral-800">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-lg ${payout.status === 'completed' ? 'bg-green-500/20' : 'bg-amber-500/20'}`}>
                                                    {payout.status === 'completed' ? (
                                                        <CheckCircle className="w-5 h-5 text-green-400" />
                                                    ) : (
                                                        <Clock className="w-5 h-5 text-amber-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">₹{Number(payout.amount).toFixed(2)}</p>
                                                    <p className="text-sm text-neutral-400">
                                                        Order #{payout.order_id?.slice(0, 8)} • UTR: {payout.utr_number || 'N/A'}
                                                    </p>
                                                    <p className="text-xs text-neutral-500">
                                                        Seller: {store?.name || 'Unknown'} • {new Date(payout.created_at).toLocaleDateString('en-IN')}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge className={payout.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}>
                                                {payout.status === 'completed' ? 'Paid' : payout.status}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                ) : (
                    <Card className="bg-neutral-900 border-neutral-800">
                        <CardContent className="py-8 text-center">
                            <p className="text-neutral-400">No payouts processed yet</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}