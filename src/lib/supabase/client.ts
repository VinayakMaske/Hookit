// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            auth: {
                // Auto-refresh tokens silently
                autoRefreshToken: true,
                // Don't throw on refresh errors
                detectSessionInUrl: true,
            }
        }
    )
}