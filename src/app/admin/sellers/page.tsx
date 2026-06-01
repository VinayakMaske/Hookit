import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Store, Package, ShoppingCart, Phone } from 'lucide-react'

export default async function AdminSellersPage() {
    const supabase = await createClient()

    // Fetch stores
    const { data: sellers, error: sellersError } = await supabase
        .from('stores')
        .select('id, name, slug, logo_url, is_active, created_at, whatsapp_number, category, owner_id')
        .order('created_at', { ascending: false })

    // Fetch all products
    const { data: products } = await supabase
        .from('products')
        .select('id, store_id')

    // Fetch all orders
    const { data: orders } = await supabase
        .from('orders')
        .select('id, store_id')

    // Fetch all profiles
    const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, phone')

    // Build lookup maps
    const productsByStore = new Map()
    products?.forEach(p => {
        productsByStore.set(p.store_id, (productsByStore.get(p.store_id) || 0) + 1)
    })

    const ordersByStore = new Map()
    orders?.forEach(o => {
        ordersByStore.set(o.store_id, (ordersByStore.get(o.store_id) || 0) + 1)
    })

    const profileMap = new Map(profiles?.map(p => [p.id, p]) || [])

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">All Sellers</h1>
                <p className="text-neutral-400 mt-1">{sellers?.length || 0} registered sellers</p>
            </div>

            {sellersError && (
                <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 text-red-300 text-sm">
                    Error: {sellersError.message}
                </div>
            )}

            {sellers && sellers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sellers.map((seller) => {
                        const profile = profileMap.get(seller.owner_id)
                        const productCount = productsByStore.get(seller.id) || 0
                        const orderCount = ordersByStore.get(seller.id) || 0
                        
                        return (
                            <Card key={seller.id} className="bg-neutral-900 border-neutral-800">
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex items-center gap-4">
                                        {seller.logo_url ? (
                                            <img
                                                src={seller.logo_url}
                                                alt={seller.name}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center">
                                                <Store className="w-6 h-6 text-neutral-500" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-white truncate">{seller.name}</h3>
                                            <p className="text-sm text-neutral-400">@{seller.slug}</p>
                                        </div>
                                        <Badge className={seller.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                                            {seller.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 text-center">
                                        <div className="p-2 bg-neutral-800 rounded-lg">
                                            <Package className="w-4 h-4 mx-auto mb-1 text-neutral-400" />
                                            <p className="text-sm font-bold text-white">{productCount}</p>
                                            <p className="text-xs text-neutral-500">Products</p>
                                        </div>
                                        <div className="p-2 bg-neutral-800 rounded-lg">
                                            <ShoppingCart className="w-4 h-4 mx-auto mb-1 text-neutral-400" />
                                            <p className="text-sm font-bold text-white">{orderCount}</p>
                                            <p className="text-xs text-neutral-500">Orders</p>
                                        </div>
                                        <div className="p-2 bg-neutral-800 rounded-lg">
                                            <Phone className="w-4 h-4 mx-auto mb-1 text-neutral-400" />
                                            <p className="text-sm font-bold text-white truncate">{seller.whatsapp_number || 'N/A'}</p>
                                            <p className="text-xs text-neutral-500">WhatsApp</p>
                                        </div>
                                    </div>

                                    <div className="text-sm text-neutral-400 space-y-1">
                                        <p>Owner: {profile?.full_name || 'N/A'}</p>
                                        <p>Phone: {profile?.phone || seller.whatsapp_number || 'N/A'}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            ) : (
                <Card className="bg-neutral-900 border-neutral-800">
                    <CardContent className="py-12 text-center">
                        <Store className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
                        <p className="text-neutral-400">No sellers yet</p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}