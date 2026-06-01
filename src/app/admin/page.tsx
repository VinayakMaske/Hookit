import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, ShoppingCart, Store } from 'lucide-react'
import { cn } from '@/lib/utils'

export default async function AdminDashboardPage() {
    const supabase = await createClient()

    // Simple queries - no joins
    const { data: sellers, error: sellersError } = await supabase
        .from('stores')
        .select('id')
    
    const { data: allOrders, error: ordersError } = await supabase
        .from('orders')
        .select('id, total_amount, status, payment_status')
    
    const { data: payouts, error: payoutsError } = await supabase
        .from('payouts')
        .select('id, amount, status')

    const totalRevenue = allOrders?.reduce((sum, o) => sum + Number(o.total_amount || 0), 0) || 0
    const completedOrders = allOrders?.filter(o => o.status === 'completed').length || 0
    const pendingOrders = allOrders?.filter(o => o.status === 'pending').length || 0
    const paidOrders = allOrders?.filter(o => o.payment_status === 'paid').length || 0
    const totalPaidOut = payouts?.filter(p => p.status === 'completed').reduce((sum, p) => sum + Number(p.amount || 0), 0) || 0

    const stats = [
        { title: 'Total Sellers', value: sellers?.length || 0, icon: Store, color: 'bg-blue-500/20 text-blue-400' },
        { title: 'Total Orders', value: allOrders?.length || 0, icon: ShoppingCart, color: 'bg-green-500/20 text-green-400' },
        { title: 'Platform Revenue', value: `₹${totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'bg-amber-500/20 text-amber-400' },
        { title: 'Total Paid Out', value: `₹${totalPaidOut.toFixed(2)}`, icon: DollarSign, color: 'bg-purple-500/20 text-purple-400' },
    ]

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Platform Overview</h1>
                <p className="text-neutral-400 mt-1">Manage all sellers, orders, and payouts</p>
            </div>

            {(sellersError || ordersError || payoutsError) && (
                <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 text-red-300 text-sm">
                    {sellersError && <p>Sellers: {sellersError.message}</p>}
                    {ordersError && <p>Orders: {ordersError.message}</p>}
                    {payoutsError && <p>Payouts: {payoutsError.message}</p>}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Card key={stat.title} className="bg-neutral-900 border-neutral-800">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-neutral-400">{stat.title}</CardTitle>
                            <div className={cn('p-2 rounded-lg', stat.color)}>
                                <stat.icon className="w-4 h-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-neutral-900 border-neutral-800">
                    <CardHeader>
                        <CardTitle className="text-white">Order Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-neutral-400">Total Orders</span>
                                <span className="text-white font-bold">{allOrders?.length || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-neutral-400">Pending</span>
                                <span className="text-amber-400 font-bold">{pendingOrders}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-neutral-400">Completed</span>
                                <span className="text-green-400 font-bold">{completedOrders}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-neutral-400">Payment Received</span>
                                <span className="text-emerald-400 font-bold">{paidOrders}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-neutral-900 border-neutral-800">
                    <CardHeader>
                        <CardTitle className="text-white">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <a href="/admin/orders" className="block p-4 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors">
                            <p className="font-medium text-white">View All Orders</p>
                            <p className="text-sm text-neutral-400">{allOrders?.length || 0} orders to manage</p>
                        </a>
                        <a href="/admin/payouts" className="block p-4 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors">
                            <p className="font-medium text-white">Process Payouts</p>
                            <p className="text-sm text-neutral-400">
                                {allOrders?.filter(o => o.status === 'completed' && o.payment_status === 'paid').length || 0} completed & paid orders
                            </p>
                        </a>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}