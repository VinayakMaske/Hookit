// src/app/(site)/trending/page.tsx
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { TrendingUp, Flame, Clock, Eye, ShoppingBag, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata = {
    title: 'Trending Products - Hookit',
    description: 'Discover the most popular and trending products on Hookit right now.',
}

export default async function TrendingPage() {
    const supabase = await createClient()

    // Fetch products with most orders in last 30 days
    const { data: trendingProducts } = await supabase
        .from('products')
        .select('*, stores(name, slug, logo_url), orders(count)')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(20)

    // Sort by order count (manual since we can't do complex aggregates in single query easily)
    const sortedProducts = (trendingProducts || []).sort((a, b) => {
        const aOrders = a.orders?.length || 0
        const bOrders = b.orders?.length || 0
        return bOrders - aOrders
    }).slice(0, 12)

    // New arrivals (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data: newArrivals } = await supabase
        .from('products')
        .select('*, stores(name, slug)')
        .eq('is_active', true)
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(8)

    // Most viewed (placeholder - would need analytics table in production)
    const { data: mostViewed } = await supabase
        .from('products')
        .select('*, stores(name, slug)')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(8)

    return (
        <div className="min-h-screen bg-white pt-20">
            {/* Hero */}
            <div className="bg-gradient-to-r from-[#7C3AED] to-[#6d28d9] py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Flame className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Trending Now</h1>
                    <p className="text-xl text-white/80 max-w-2xl mx-auto">
                        The most popular products that buyers are loving right now
                    </p>
                </div>
            </div>

            {/* Trending Products */}
            <div className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
                                <TrendingUp className="w-6 h-6 text-[#7C3AED]" />
                                Hot Right Now
                            </h2>
                            <p className="text-neutral-500">Products with the most orders this week</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {sortedProducts.map((product, index) => (
                            <Link key={product.id} href={`/product/${product.id}`} className="group block">
                                <div className="relative">
                                    <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-100">
                                        {product.images?.[0] ? (
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ShoppingBag className="w-8 h-8 text-neutral-300" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        
                                        {/* Rank Badge */}
                                        {index < 3 && (
                                            <div className="absolute top-2 left-2">
                                                <Badge className={`border-0 text-white ${
                                                    index === 0 ? 'bg-amber-500' : 
                                                    index === 1 ? 'bg-neutral-400' : 
                                                    'bg-amber-700'
                                                }`}>
                                                    #{index + 1} Trending
                                                </Badge>
                                            </div>
                                        )}

                                        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                            <p className="text-white font-medium text-sm line-clamp-2 drop-shadow-lg">
                                                {product.name}
                                            </p>
                                            <p className="text-white/70 text-xs mt-1">
                                                by {product.stores?.name || 'Unknown'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <p className="font-medium text-neutral-900 text-sm line-clamp-1 group-hover:text-[#7C3AED] transition-colors">
                                        {product.name}
                                    </p>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="font-bold text-neutral-900">₹{product.price}</span>
                                        <span className="text-xs text-neutral-500 flex items-center gap-1">
                                            <Eye className="w-3 h-3" /> {product.orders?.length || 0} sold
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* New Arrivals */}
            <div className="py-16 bg-[#f8f7fb]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
                                <Clock className="w-6 h-6 text-[#7C3AED]" />
                                New Arrivals
                            </h2>
                            <p className="text-neutral-500">Fresh products added this week</p>
                        </div>
                        <Link href="/explore">
                            <Button variant="ghost" className="gap-2 text-[#7C3AED]">
                                View All <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {(newArrivals || []).map((product) => (
                            <Link key={product.id} href={`/product/${product.id}`} className="group block">
                                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                                    <CardContent className="p-0">
                                        <div className="aspect-square bg-neutral-100 relative overflow-hidden">
                                            {product.images?.[0] ? (
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ShoppingBag className="w-8 h-8 text-neutral-300" />
                                                </div>
                                            )}
                                            <Badge className="absolute top-2 left-2 bg-green-500 text-white border-0">
                                                New
                                            </Badge>
                                        </div>
                                        <div className="p-4">
                                            <p className="font-medium text-neutral-900 text-sm line-clamp-1">{product.name}</p>
                                            <p className="text-xs text-neutral-500 mt-1">{product.stores?.name}</p>
                                            <p className="font-bold text-neutral-900 mt-2">₹{product.price}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="py-20 bg-neutral-900 text-white">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <TrendingUp className="w-12 h-12 text-[#7C3AED] mx-auto mb-6" />
                    <h2 className="text-4xl font-bold mb-4">Want to trend?</h2>
                    <p className="text-xl text-neutral-400 mb-8">
                        List your products and get discovered by thousands of buyers
                    </p>
                    <Link href="/signup">
                        <Button size="lg" className="bg-[#7C3AED] hover:bg-[#6d28d9] h-14 px-10 text-lg gap-2">
                            Start Selling
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}