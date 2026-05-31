import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Store, ShoppingBag, MapPin, Phone, Mail } from 'lucide-react'

export default async function StorePage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const supabase = await createClient()

    const { data: store } = await supabase
        .from('stores')
        .select('*, products(*), profiles(full_name)')
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

    if (!store) {
        notFound()
    }

    const activeProducts = store.products?.filter((p: any) => p.is_active) || []

    return (
        <div className="min-h-screen bg-white pt-20">
            {/* Store Banner */}
            <div className="relative h-64 md:h-80 bg-neutral-100 overflow-hidden">
                {store.banner_url ? (
                    <img
                        src={store.banner_url}
                        alt={store.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Store Header */}
                <div className="relative -mt-20 mb-10">
                    <div className="flex flex-col md:flex-row items-end md:items-end gap-6">
                        <div className="w-32 h-32 bg-white rounded-2xl shadow-lg overflow-hidden border-4 border-white">
                            {store.logo_url ? (
                                <img
                                    src={store.logo_url}
                                    alt={store.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
                                    <Store className="w-12 h-12 text-neutral-400" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 pb-2">
                            <h1 className="text-3xl font-bold text-neutral-900">{store.name}</h1>
                            <p className="text-neutral-500 mt-1">{store.description || 'No description'}</p>
                            <div className="flex items-center gap-4 mt-3 text-sm text-neutral-500">
                                {store.category && <Badge variant="secondary">{store.category}</Badge>}
                                <span>{activeProducts.length} products</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Info */}
                <Card className="border-0 shadow-sm mb-10 bg-neutral-50">
                    <CardContent className="p-4">
                        <div className="flex flex-wrap items-center gap-6">
                            {store.whatsapp_number && (
                                <a
                                    href={`https://wa.me/${store.whatsapp_number.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700"
                                >
                                    <Phone className="w-4 h-4" />
                                    WhatsApp
                                </a>
                            )}
                            {store.contact_phone && (
                                <span className="flex items-center gap-2 text-sm text-neutral-600">
                                    <Phone className="w-4 h-4" />
                                    {store.contact_phone}
                                </span>
                            )}
                            {store.contact_email && (
                                <span className="flex items-center gap-2 text-sm text-neutral-600">
                                    <Mail className="w-4 h-4" />
                                    {store.contact_email}
                                </span>
                            )}
                            {store.profiles?.full_name && (
                                <span className="flex items-center gap-2 text-sm text-neutral-600">
                                    <Store className="w-4 h-4" />
                                    Owner: {store.profiles.full_name}
                                </span>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Products Grid */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-neutral-900 mb-6">Products</h2>

                    {activeProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {activeProducts.map((product: any) => (
                                <Link
                                    key={product.id}
                                    href={`/product/${product.id}`}
                                    className="group block"
                                >
                                    <div className="bg-white rounded-2xl overflow-hidden border border-neutral-100 hover:border-neutral-300 hover:shadow-lg transition-all duration-300">
                                        <div className="aspect-square bg-neutral-100 relative overflow-hidden">
                                            {product.images?.[0] ? (
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ShoppingBag className="w-10 h-10 text-neutral-300" />
                                                </div>
                                            )}
                                            {product.affiliate_link && (
                                                <Badge className="absolute top-3 left-3 bg-blue-600 text-white">
                                                    Affiliate
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className="font-semibold text-neutral-900 line-clamp-1 group-hover:text-neutral-700 transition-colors">
                                                    {product.name}
                                                </h3>
                                                <span className="font-bold text-neutral-900 shrink-0">₹{product.price}</span>
                                            </div>
                                            {product.compare_price && (
                                                <p className="text-sm text-neutral-400 line-through">
                                                    ₹{product.compare_price}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <Card className="border-0 shadow-sm">
                            <CardContent className="py-16 text-center">
                                <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                                <p className="text-neutral-500">No products available</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}