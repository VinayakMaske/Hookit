import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, ShoppingCart, Wallet, Store, LogOut } from 'lucide-react'

// Add your email here
const ADMIN_EMAILS = [
    'storeapp2026@gmail.com',
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Check if user is admin
    if (!ADMIN_EMAILS.includes(user.email || '')) {
        redirect('/seller/dashboard')
    }

    return (
        <div className="min-h-screen bg-neutral-950 flex">
            {/* Admin Sidebar */}
            <aside className="w-72 bg-neutral-900 border-r border-neutral-800 fixed h-full">
                <div className="p-6 border-b border-neutral-800">
                    <Link href="/admin" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#7C3AED] rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">A</span>
                        </div>
                        <span className="text-xl font-bold text-white">Admin</span>
                    </Link>
                </div>

                <nav className="p-4 space-y-1">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all">
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </Link>
                    <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all">
                        <ShoppingCart className="w-5 h-5" />
                        Orders
                    </Link>
                    <Link href="/admin/payouts" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all">
                        <Wallet className="w-5 h-5" />
                        Payouts
                    </Link>
                    <Link href="/admin/sellers" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all">
                        <Store className="w-5 h-5" />
                        Sellers
                    </Link>
                </nav>

                <div className="p-4 border-t border-neutral-800 absolute bottom-0 w-full">
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all">
                        <LogOut className="w-5 h-5" />
                        Back to Site
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-72">
                <div className="p-6 lg:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}