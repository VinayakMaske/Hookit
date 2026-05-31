import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
    const { supabaseResponse, user } = await updateSession(request)

    // Protect seller routes
    if (request.nextUrl.pathname.startsWith('/seller') && !user) {
        return Response.redirect(new URL('/login', request.url))
    }

    // Redirect logged-in users from auth pages
    if ((request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup') && user) {
        return Response.redirect(new URL('/seller/store', request.url))
    }

    return supabaseResponse
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}