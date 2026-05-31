import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    const formData = await request.formData()
    const productId = formData.get('productId') as string

    if (!productId) {
        return NextResponse.redirect(new URL('/seller/products', request.url))
    }

    // Verify ownership
    const { data: product } = await supabase
        .from('products')
        .select('store_id')
        .eq('id', productId)
        .single()

    if (!product) {
        return NextResponse.redirect(new URL('/seller/products', request.url))
    }

    const { data: store } = await supabase
        .from('stores')
        .select('owner_id')
        .eq('id', product.store_id)
        .single()

    if (store?.owner_id !== user.id) {
        return NextResponse.redirect(new URL('/seller/products', request.url))
    }

    await supabase.from('products').delete().eq('id', productId)

    return NextResponse.redirect(new URL('/seller/products', request.url))
}