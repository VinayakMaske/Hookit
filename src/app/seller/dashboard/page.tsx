// src/app/seller/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Package, ShoppingCart, DollarSign, TrendingUp, Bell, ExternalLink, ArrowLeft, Store, Shield, CheckCircle, AlertTriangle, XCircle, Copy, Check } from 'lucide-react'
import CopyStoreLinkButton from '@/components/copy-store-link-button'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const { data: store } = await supabase
        .from('stores')
        .select('*, penalty_count, account_status')
        .eq('owner_id', user.id)
        .single()

    if (!store) redirect('/seller/store/create')

    // Fetch stats
    const { data: products } = await supabase
        .from('products')
        .select('id')
        .eq('store_id', store.id)

    const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('store_id', store.id)
        .order('created_at', { ascending: false })

    const totalOrders = orders?.length || 0
    const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0
    const totalRevenue = orders?.filter(o => o.status === 'completed').reduce((sum, o) => sum + Number(o.total_amount), 0) || 0

    const stats = [
        { title: 'Total Products', value: products?.length || 0, icon: Package, color: 'bg-blue-50 text-blue-600' },
        { title: 'Total Orders', value: totalOrders, icon: ShoppingCart, color: 'bg-green-50 text-green-600' },
        { title: 'Pending Orders', value: pendingOrders, icon: TrendingUp, color: 'bg-amber-50 text-amber-600' },
        { title: 'Revenue', value: `₹${totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'bg-emerald-50 text-emerald-600' },
    ]

    // Account status config
    const statusConfig = {
        active: { color: 'bg-green-50 text-green-700', icon: CheckCircle, label: 'Good Standing', desc: 'No active penalties. Keep up the great work!' },
        suspended: { color: 'bg-amber-50 text-amber-700', icon: AlertTriangle, label: 'Suspended', desc: 'Your account has violations. Contact support.' },
        banned: { color: 'bg-red-50 text-red-700', icon: XCircle, label: 'Banned', desc: 'Account permanently banned. Appeal available.' },
    }

    const currentStatus = statusConfig[store.account_status as keyof typeof statusConfig] || statusConfig.active
    const StatusIcon = currentStatus.icon

    return (
        <div className="space-y-8">
            {/* Header with Back to Marketplace + Visit Store + Copy Link */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900">{store.name}</h1>
                    <p className="text-neutral-500 mt-1">Manage your store and track performance</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/explore">
                        <Button variant="ghost" className="gap-2 text-neutral-600 hover:text-neutral-900">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Marketplace
                        </Button>
                    </Link>
                    <Link href={`/store/${store.slug}`} target="_blank">
                        <Button className="gap-2 bg-neutral-900 hover:bg-neutral-800">
                            <ExternalLink className="w-4 h-4" />
                            Visit Store
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Store Link Copy Section - NEW */}
            <div className="bg-white rounded-xl border border-neutral-200 p-4 flex items-center gap-4">
                <div className="p-3 bg-neutral-100 rounded-lg shrink-0">
                    <Store className="w-5 h-5 text-neutral-600" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-medium text-neutral-900 text-sm">Your Store Link</p>
                    <p className="text-sm text-neutral-500 truncate">hookit.online/store/{store.slug}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">Copy this link and paste it in your Instagram bio, WhatsApp status, or any social media</p>
                </div>
                <CopyStoreLinkButton slug={store.slug} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Card key={stat.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-neutral-600">{stat.title}</CardTitle>
                            <div className={cn('p-2 rounded-lg', stat.color)}>
                                <stat.icon className="w-4 h-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-neutral-900">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Account Health / Penalty Card */}
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Account Health
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className={`flex items-center justify-between p-4 ${currentStatus.color} rounded-lg`}>
                            <div className="flex items-center gap-3">
                                <StatusIcon className="w-5 h-5" />
                                <div>
                                    <span className="font-medium">{currentStatus.label}</span>
                                    <p className="text-sm opacity-80">{currentStatus.desc}</p>
                                </div>
                            </div>
                            {store.penalty_count > 0 && (
                                <Badge className="bg-white/80 text-neutral-900 border-0">
                                    {store.penalty_count} {store.penalty_count === 1 ? 'violation' : 'violations'}
                                </Badge>
                            )}
                        </div>

                        <div className="text-sm text-neutral-500">
                            <p className="mb-2 font-medium text-neutral-700">Avoid these violations to maintain good standing:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {[
                                    { text: 'Taking transactions off-platform', severity: 'critical' },
                                    { text: 'Selling counterfeit or prohibited items', severity: 'critical' },
                                    { text: 'Fake reviews or review manipulation', severity: 'high' },
                                    { text: 'Harassment or abusive behavior', severity: 'high' },
                                    { text: 'Multiple accounts for same seller', severity: 'medium' },
                                    { text: 'Sharing buyer contact data externally', severity: 'critical' },
                                    { text: 'Misrepresenting product details', severity: 'medium' },
                                    { text: 'Fraudulent or deceptive practices', severity: 'critical' },
                                ].map((item) => (
                                    <div key={item.text} className="flex items-center gap-2">
                                        <AlertTriangle className={`w-3.5 h-3.5 shrink-0 ${
                                            item.severity === 'critical' ? 'text-red-500' : 
                                            item.severity === 'high' ? 'text-amber-500' : 'text-neutral-400'
                                        }`} />
                                        <span className="text-neutral-600">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {store.penalty_count > 0 && (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                <p className="text-sm text-amber-800">
                                    <strong>Warning:</strong> Repeated violations may result in account suspension or permanent ban. 
                                    <a href="/help" className="text-[#7C3AED] hover:underline ml-1">Learn more</a>
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* WhatsApp Notification Card */}
            <Card className="border-0 shadow-sm bg-amber-50">
                <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 bg-amber-100 rounded-lg">
                        <Bell className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="flex-1">
                        <p className="font-medium text-amber-900">New Order Notifications</p>
                        <p className="text-sm text-amber-700">
                            You get Email notifications for new orders.
                        </p>
                    </div>
                    <Link href="/seller/settings">
                        <Button variant="outline" size="sm" className="border-amber-300 text-amber-700 hover:bg-amber-100">
                            Update
                        </Button>
                    </Link>
                </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    {orders && orders.length > 0 ? (
                        <div className="space-y-3">
                            {orders.slice(0, 5).map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-neutral-900">{order.buyer_name}</p>
                                        <p className="text-sm text-neutral-500">₹{order.total_amount} • {order.quantity} item(s)</p>
                                    </div>
                                    <span className={cn(
                                        'px-3 py-1 rounded-full text-xs font-medium',
                                        order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                        order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                        'bg-blue-100 text-blue-700'
                                    )}>
                                        {order.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-neutral-500 text-center py-8">No orders yet</p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

function cn(...classes: (string | undefined | false)[]) {
    return classes.filter(Boolean).join(' ')
}