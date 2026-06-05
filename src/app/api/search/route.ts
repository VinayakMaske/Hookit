// src/app/api/search/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')?.trim()

    if (!query || query.length < 2) {
        return NextResponse.json({ products: [], stores: [] })
    }

    const supabase = await createClient()

    // Search products by name (case-insensitive, partial match)
    const { data: products } = await supabase
        .from('products')
        .select('id, name, price, images, stock_quantity, affiliate_link, category, stores(name, slug, logo_url)')
        .eq('is_active', true)
        .ilike('name', `%${query}%`)
        .order('featured', { ascending: false })
        .order('featured_order', { ascending: true })
        .limit(20)

    // Search stores by name
    const { data: stores } = await supabase
        .from('stores')
        .select('id, name, slug, logo_url, description, category')
        .eq('is_active', true)
        .ilike('name', `%${query}%`)
        .limit(10)

    return NextResponse.json({ products: products || [], stores: stores || [] })
}