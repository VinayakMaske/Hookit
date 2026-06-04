import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Trash2, Package, ExternalLink, Tag } from 'lucide-react'

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const queryParams = await searchParams
    const selectedCollection = typeof queryParams.collection === 'string' ? queryParams.collection : 'all'

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const { data: store } = await supabase
        .from('stores')
        .select('id')
        .eq('owner_id', user.id)
        .single()

    if (!store) redirect('/seller/store/create')

    const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', store.id)
        .order('created_at', { ascending: false })

    // Get unique collections from products
    const collections = [...new Set(
        (products || [])
            .map((p) => p.collection)
            .filter(Boolean)
    )].sort() as string[]

    // Filter products by collection if selected
    let filteredProducts = products || []
    if (selectedCollection !== 'all' && selectedCollection) {
        filteredProducts = filteredProducts.filter((p) => p.collection === selectedCollection)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900">Products</h1>
                    <p className="text-neutral-500 mt-1">Manage your products and affiliate links</p>
                </div>
                <Link href="/seller/products/new">
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Add Product
                    </Button>
                </Link>
            </div>

            {/* Collections Filter Bar */}
            {collections.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
                        <span className="text-sm font-medium text-neutral-500 flex items-center gap-1.5 shrink-0">
                            <Tag className="w-4 h-4" />
                            Collections:
                        </span>

                        <Link
                            href="/seller/products"
                            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                selectedCollection === 'all' || !selectedCollection
                                    ? 'bg-[#161616] text-white shadow-md'
                                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                            }`}
                        >
                            All Products
                        </Link>

                        {collections.map((collection) => (
                            <Link
                                key={collection}
                                href={`/seller/products?collection=${encodeURIComponent(collection)}`}
                                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                    selectedCollection === collection
                                        ? 'bg-[#161616] text-white shadow-md'
                                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                }`}
                            >
                                {collection}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {filteredProducts && filteredProducts.length > 0 ? (
                <div className="columns-2 md:columns-3 xl:columns-4 gap-4 space-y-4">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="break-inside-avoid mb-4">
                            <Card className="border-0 shadow-sm overflow-hidden group">
                                <div className="bg-neutral-100 relative overflow-hidden">
                                    {product.images && product.images[0] ? (
                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full aspect-square flex items-center justify-center text-neutral-400">
                                            <Plus className="w-12 h-12" />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <Badge variant={product.is_active ? 'default' : 'secondary'}>
                                            {product.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-semibold text-neutral-900 line-clamp-1">{product.name}</h3>
                                        <span className="font-bold text-neutral-900">₹{product.price}</span>
                                    </div>
                                    <p className="text-sm text-neutral-500 line-clamp-2 mb-3">{product.description}</p>

                                    {product.collection && (
                                        <Badge className="mb-2 bg-[#7C3AED]/10 text-[#7C3AED] border-0 text-[10px]">
                                            <Tag className="w-2.5 h-2.5 mr-1" />
                                            {product.collection}
                                        </Badge>
                                    )}

                                    {product.affiliate_link && (
                                        <div className="flex items-center gap-1 text-xs text-blue-600 mb-3">
                                            <ExternalLink className="w-3 h-3" />
                                            Affiliate link enabled
                                        </div>
                                    )}

                                    <div className="flex gap-2">
                                        <Link href={`/seller/products/edit/${product.id}`} className="flex-1">
                                            <Button variant="outline" size="sm" className="w-full gap-2">
                                                <Pencil className="w-3 h-3" />
                                                Edit
                                            </Button>
                                        </Link>
                                        <form action={`/api/products/delete`} method="POST" className="flex-1">
                                            <input type="hidden" name="productId" value={product.id} />
                                            <Button variant="outline" size="sm" className="w-full gap-2 text-red-600 hover:text-red-700 hover:bg-red-50" type="submit">
                                                <Trash2 className="w-3 h-3" />
                                                Delete
                                            </Button>
                                        </form>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            ) : selectedCollection !== 'all' ? (
                <Card className="border-0 shadow-sm">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <Tag className="w-12 h-12 text-neutral-300 mb-4" />
                        <h3 className="text-lg font-medium text-neutral-900 mb-2">No products in "{selectedCollection}"</h3>
                        <p className="text-neutral-500 mb-6 text-center max-w-sm">
                            This collection doesn't have any products yet
                        </p>
                        <Link href="/seller/products">
                            <Button variant="outline" className="gap-2">
                                <Package className="w-4 h-4" />
                                View All Products
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <Card className="border-0 shadow-sm">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <Package className="w-12 h-12 text-neutral-300 mb-4" />
                        <h3 className="text-lg font-medium text-neutral-900 mb-2">No products yet</h3>
                        <p className="text-neutral-500 mb-6 text-center max-w-sm">
                            Start selling by adding your first product or affiliate link
                        </p>
                        <Link href="/seller/products/new">
                            <Button className="gap-2">
                                <Plus className="w-4 h-4" />
                                Add Your First Product
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}