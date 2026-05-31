import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Wallet, ArrowDownLeft, Clock, CheckCircle, XCircle } from 'lucide-react'

export default async function PayoutsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const { data: payouts } = await supabase
        .from('payouts')
        .select('*, orders(total_amount, buyer_name)')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false })

    const statusConfig: Record<string, { color: string; icon: typeof CheckCircle }> = {
        pending: { color: 'bg-amber-100 text-amber-700', icon: Clock },
        processing: { color: 'bg-blue-100 text-blue-700', icon: ArrowDownLeft },
        completed: { color: 'bg-green-100 text-green-700', icon: CheckCircle },
        failed: { color: 'bg-red-100 text-red-700', icon: XCircle }
    }

    const totalPaid = payouts?.filter(p => p.status === 'completed').reduce((sum, p) => sum + Number(p.amount), 0) || 0
    const totalPending = payouts?.filter(p => p.status === 'pending').reduce((sum, p) => sum + Number(p.amount), 0) || 0

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-neutral-900">Payouts</h1>
                <p className="text-neutral-500 mt-1">Track payments received from the platform</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-600">Total Paid</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">₹{totalPaid.toFixed(2)}</div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-600">Pending</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-600">₹{totalPending.toFixed(2)}</div>
                    </CardContent>
                </Card>
            </div>

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
                                                    ₹{payout.amount}
                                                </p>
                                                <p className="text-sm text-neutral-500">
                                                    Order #{payout.order_id?.slice(0, 8) || 'N/A'} • {payout.orders?.buyer_name || 'Unknown buyer'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge className={config.color}>
                                                {payout.status}
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
    )
}

function cn(...classes: (string | undefined | false)[]) {
    return classes.filter(Boolean).join(' ')
}