import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Phone, Mail, MapPin, Calendar, Store } from 'lucide-react'

export default async function AdminOrdersPage() {
    const supabase = await createClient()

    const { data: orders } = await supabase
        .from('orders')
        .select('*, products(name, images, stores(name, owner_id))')
        .order('created_at', { ascending: false })

    const statusColors: Record<string, string> = {
        pending: 'bg-amber-500/20 text-amber-400',
        processing: 'bg-blue-500/20 text-blue-400',
        shipped: 'bg-purple-500/20 text-purple-400',
        delivered: 'bg-green-500/20 text-green-400',
        completed: 'bg-emerald-500/20 text-emerald-400',
        cancelled: 'bg-red-500/20 text-red-400'
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">All Orders</h1>
                <p className="text-neutral-400 mt-1">View and manage all platform orders</p>
            </div>

            {orders && orders.length > 0 ? (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <Card key={order.id} className="bg-neutral-900 border-neutral-800">
                            <CardContent className="p-6">
                                <div className="flex flex-col lg:flex-row gap-6">
                                    <div className="w-24 h-24 bg-neutral-800 rounded-lg overflow-hidden shrink-0">
                                        {order.products?.images?.[0] ? (
                                            <img
                                                src={order.products.images[0]}
                                                alt={order.products.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-neutral-500 text-xs">
                                                No Image
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-semibold text-white">{order.products?.name || 'Unknown'}</h3>
                                                <p className="text-sm text-neutral-400 flex items-center gap-1 mt-1">
                                                    <Store className="w-3 h-3" />
                                                    {order.products?.stores?.name || 'Unknown Store'}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-white">₹{order.total_amount}</p>
                                                <Badge className={statusColors[order.status] || 'bg-neutral-800'}>
                                                    {order.status}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-neutral-800/50 rounded-lg">
                                            <div>
                                                <p className="text-xs text-neutral-500 uppercase mb-1">Buyer</p>
                                                <p className="text-sm text-white font-medium">{order.buyer_name}</p>
                                                <p className="text-sm text-neutral-400 flex items-center gap-1">
                                                    <Phone className="w-3 h-3" /> {order.buyer_phone}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-neutral-500 uppercase mb-1">Address</p>
                                                <p className="text-sm text-neutral-300 flex items-start gap-1">
                                                    <MapPin className="w-3 h-3 mt-0.5" /> {order.buyer_address}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-neutral-500 uppercase mb-1">Order Date</p>
                                                <p className="text-sm text-neutral-300 flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(order.created_at).toLocaleDateString('en-IN')}
                                                </p>
                                                <p className="text-xs text-neutral-500 mt-1">
                                                    Payment: {order.payment_status}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="bg-neutral-900 border-neutral-800">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <ShoppingCart className="w-12 h-12 text-neutral-600 mb-4" />
                        <p className="text-neutral-400">No orders yet</p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

function ShoppingCart(props: any) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
    )
}