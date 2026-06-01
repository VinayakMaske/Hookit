import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Phone, MapPin, Calendar, Store, ShoppingCart } from 'lucide-react'

export default async function AdminOrdersPage() {
    const supabase = await createClient()

    // Fetch all orders
    const { data: orders, error } = await supabase
        .from('orders')
        .select('id, total_amount, status, payment_status, buyer_name, buyer_phone, buyer_address, created_at, quantity, store_id, product_id, payment_method')
        .order('created_at', { ascending: false })

    // Fetch products for names/images
    const { data: products } = await supabase
        .from('products')
        .select('id, name, images')

    // Fetch stores for names
    const { data: stores } = await supabase
        .from('stores')
        .select('id, name')

    // Build lookup maps
    const productMap = new Map(products?.map(p => [p.id, p]) || [])
    const storeMap = new Map(stores?.map(s => [s.id, s]) || [])

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
                <p className="text-neutral-400 mt-1">{orders?.length || 0} total orders</p>
            </div>

            {error && (
                <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 text-red-300 text-sm">
                    Error: {error.message}
                </div>
            )}

            {orders && orders.length > 0 ? (
                <div className="space-y-4">
                    {orders.map((order) => {
                        const product = productMap.get(order.product_id)
                        const store = storeMap.get(order.store_id)
                        
                        return (
                            <Card key={order.id} className="bg-neutral-900 border-neutral-800">
                                <CardContent className="p-6">
                                    <div className="flex flex-col lg:flex-row gap-6">
                                        <div className="w-24 h-24 bg-neutral-800 rounded-lg overflow-hidden shrink-0">
                                            {product?.images?.[0] ? (
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
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
                                                    <h3 className="font-semibold text-white">{product?.name || 'Unknown Product'}</h3>
                                                    <p className="text-sm text-neutral-400 flex items-center gap-1 mt-1">
                                                        <Store className="w-3 h-3" />
                                                        {store?.name || 'Unknown Store'}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-white">₹{order.total_amount}</p>
                                                    <Badge className={statusColors[order.status] || 'bg-neutral-800'}>
                                                        {order.status}
                                                    </Badge>
                                                    <Badge className={order.payment_status === 'paid' ? 'bg-green-500/20 text-green-400 ml-2' : 'bg-amber-500/20 text-amber-400 ml-2'}>
                                                        {order.payment_status}
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
                                                        <MapPin className="w-3 h-3 mt-0.5 shrink-0" /> {order.buyer_address}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-neutral-500 uppercase mb-1">Order Info</p>
                                                    <p className="text-sm text-neutral-300 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(order.created_at).toLocaleDateString('en-IN')}
                                                    </p>
                                                    <p className="text-xs text-neutral-500 mt-1">
                                                        Qty: {order.quantity} • {order.payment_method || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
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