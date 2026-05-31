import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Trash2, Package, ExternalLink } from 'lucide-react'

export default async function ProductsPage() {
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

            {products && products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {products.map((product) => (
                        <Card key={product.id} className="border-0 shadow-sm overflow-hidden group">
                            <div className="aspect-square bg-neutral-100 relative overflow-hidden">
                                {product.images && product.images[0] ? (
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-neutral-400">
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
                    ))}
                </div>
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