// src/app/api/product-of-day/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabase = await createClient()

    // Use the SQL function for stable daily product
    const { data, error } = await supabase
        .rpc('get_product_of_the_day')

    if (error || !data || data.length === 0) {
        // Fallback: random product
        const { data: fallback } = await supabase
            .from('products')
            .select('*, stores(name, slug, logo_url)')
            .eq('is_active', true)
            .gt('stock_quantity', 0)
            .limit(1)
            .single()

        return NextResponse.json({ product: fallback })
    }

    // Get full product with store info
    const productId = data[0].id
    const { data: product } = await supabase
        .from('products')
        .select('*, stores(name, slug, logo_url)')
        .eq('id', productId)
        .single()

    return NextResponse.json({ product })
}