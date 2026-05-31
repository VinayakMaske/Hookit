'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    CreditCard,
    Wallet,
    Settings,
    Store,
    LogOut,
    ChevronRight,
    Menu,
    X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/seller/dashboard' },
    { icon: Package, label: 'Products', href: '/seller/products' },
    { icon: ShoppingCart, label: 'Orders', href: '/seller/orders' },
    { icon: CreditCard, label: 'Payments', href: '/seller/payments' },
    { icon: Wallet, label: 'Payouts', href: '/seller/payouts' },
    { icon: Settings, label: 'Settings', href: '/seller/settings' },
]

export default function SellerLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const [mobileOpen, setMobileOpen] = useState(false)

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            <div className="p-6 border-b border-neutral-200">
                <Link href="/seller/dashboard" className="flex items-center gap-2">
                    <Store className="w-8 h-8 text-neutral-900" />
                    <span className="text-xl font-bold text-neutral-900">Seller Hub</span>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                                isActive
                                    ? 'bg-neutral-900 text-white shadow-md'
                                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                            )}
                        >
                            <item.icon className={cn('w-5 h-5', isActive ? 'text-white' : 'text-neutral-500')} />
                            {item.label}
                            {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-neutral-200">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleLogout}
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </Button>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-neutral-50 flex">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-72 bg-white border-r border-neutral-200 fixed h-full shadow-sm">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild className="lg:hidden">
                    <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
                        <Menu className="w-6 h-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0">
                    <SidebarContent />
                </SheetContent>
            </Sheet>

            {/* Main Content */}
            <main className="flex-1 lg:ml-72">
                <div className="p-6 lg:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}