import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
    LayoutDashboard,
    ShoppingCart,
    Wallet,
    Users,
    Store,
    ArrowLeft,
    LogOut
} from 'lucide-react'

const ADMIN_EMAILS = ['storeapp2026@gmail.com'] // Same as middleware

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
        redirect('/')
    }

    const navItems = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/orders', label: 'All Orders', icon: ShoppingCart },
        { href: '/admin/payouts', label: 'Payouts', icon: Wallet },
        { href: '/admin/sellers', label: 'Sellers', icon: Users },
    ]

    return (
        <div className="min-h-screen bg-neutral-950 text-white flex">
            {/* Sidebar */}
            <aside className="w-64 bg-neutral-900 border-r border-neutral-800 fixed h-full">
                <div className="p-6 border-b border-neutral-800">
                    <div className="flex items-center gap-2">
                        <Store className="w-6 h-6 text-white" />
                        <span className="text-lg font-bold">Admin Panel</span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">{user.email}</p>
                </div>

                <nav className="p-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all"
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-800 space-y-2">
                    <Link href="/" className="block">
                        <Button variant="ghost" className="w-full justify-start gap-2 text-neutral-400 hover:text-white">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Site
                        </Button>
                    </Link>
                    <form action="/api/auth/signout" method="POST">
                        <Button variant="ghost" className="w-full justify-start gap-2 text-red-400 hover:text-red-300 hover:bg-red-950">
                            <LogOut className="w-4 h-4" />
                            Logout
                        </Button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64">
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}