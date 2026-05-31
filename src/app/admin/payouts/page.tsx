import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Wallet, CheckCircle, Clock, ArrowRight } from 'lucide-react'

export default async function AdminPayoutsPage() {
    const supabase = await createClient()

    // Fetch all completed orders that need payout
    const { data: completedOrders } = await supabase
        .from('orders')
        .select('*, products(name, stores(name, owner_id, payout_details(*)))')
        .eq('status', 'completed')
        .eq('payment_status', 'paid')
        .order('created_at', { ascending: false })

    // Fetch existing payouts
    const { data: existingPayouts } = await supabase
        .from('payouts')
        .select('*, orders(total_amount)')
        .order('created_at', { ascending: false })

    const pendingPayouts = completedOrders?.filter(order => {
        const hasPayout = existingPayouts?.some(p => p.order_id === order.id && p.status !== 'failed')
        return !hasPayout
    }) || []

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Payout Management</h1>
                <p className="text-neutral-400 mt-1">Process payments to sellers</p>
            </div>

            {/* Pending Payouts */}
            <div>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-400" />
                    Pending Payouts ({pendingPayouts.length})
                </h2>

                {pendingPayouts.length > 0 ? (
                    <div className="space-y-4">
                        {pendingPayouts.map((order) => (
                            <Card key={order.id} className="bg-neutral-900 border-neutral-800">
                                <CardContent className="p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-semibold text-white">{order.products?.name}</h3>
                                                <Badge className="bg-amber-500/20 text-amber-400">Pending Payout</Badge>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <p className="text-neutral-500">Seller</p>
                                                    <p className="text-white">{order.products?.stores?.name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-neutral-500">Amount</p>
                                                    <p className="text-white font-bold">₹{order.total_amount}</p>
                                                </div>
                                                <div>
                                                    <p className="text-neutral-500">Payout Method</p>
                                                    <p className="text-white">
                                                        {order.products?.stores?.payout_details?.[0]?.upi_id || 'UPI not set'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <form action="/api/admin/payout" method="POST" className="flex items-center gap-3">
                                            <input type="hidden" name="orderId" value={order.id} />
                                            <input type="hidden" name="sellerId" value={order.products?.stores?.owner_id} />
                                            <input type="hidden" name="amount" value={order.total_amount} />
                                            <Input
                                                name="utrNumber"
                                                placeholder="UTR Number"
                                                className="w-40 bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
                                                required
                                            />
                                            <Button type="submit" className="gap-2 bg-green-600 hover:bg-green-700">
                                                <CheckCircle className="w-4 h-4" />
                                                Mark Paid
                                            </Button>
                                        </form>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
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
                        {existingPayouts.map((payout) => (
                            <Card key={payout.id} className="bg-neutral-900 border-neutral-800">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                'p-2 rounded-lg',
                                                payout.status === 'completed' ? 'bg-green-500/20' : 'bg-amber-500/20'
                                            )}>
                                                {payout.status === 'completed' ? (
                                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                                ) : (
                                                    <Clock className="w-5 h-5 text-amber-400" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">₹{payout.amount}</p>
                                                <p className="text-sm text-neutral-400">
                                                    Order #{payout.order_id?.slice(0, 8)} • UTR: {payout.utr_number || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge className={payout.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}>
                                            {payout.status}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
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

function cn(...classes: (string | undefined | false)[]) {
    return classes.filter(Boolean).join(' ')
}