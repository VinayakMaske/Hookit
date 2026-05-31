import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Store, Package, ShoppingCart, Phone } from 'lucide-react'

export default async function AdminSellersPage() {
    const supabase = await createClient()

    const { data: sellers } = await supabase
        .from('stores')
        .select('*, products(id), orders(id), profiles(full_name, email, phone)')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">All Sellers</h1>
                <p className="text-neutral-400 mt-1">{sellers?.length || 0} registered sellers</p>
            </div>

            {sellers && sellers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sellers.map((seller) => (
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
                                        <p className="text-sm font-bold text-white">{seller.products?.length || 0}</p>
                                        <p className="text-xs text-neutral-500">Products</p>
                                    </div>
                                    <div className="p-2 bg-neutral-800 rounded-lg">
                                        <ShoppingCart className="w-4 h-4 mx-auto mb-1 text-neutral-400" />
                                        <p className="text-sm font-bold text-white">{seller.orders?.length || 0}</p>
                                        <p className="text-xs text-neutral-500">Orders</p>
                                    </div>
                                    <div className="p-2 bg-neutral-800 rounded-lg">
                                        <Phone className="w-4 h-4 mx-auto mb-1 text-neutral-400" />
                                        <p className="text-sm font-bold text-white truncate">{seller.whatsapp_number || 'N/A'}</p>
                                        <p className="text-xs text-neutral-500">WhatsApp</p>
                                    </div>
                                </div>

                                <div className="text-sm text-neutral-400 space-y-1">
                                    <p>Owner: {seller.profiles?.full_name || 'N/A'}</p>
                                    <p>Email: {seller.profiles?.email || 'N/A'}</p>
                                    <p>Phone: {seller.profiles?.phone || 'N/A'}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
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