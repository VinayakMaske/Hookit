// src/components/navbar.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, Compass, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import Logo from '@/components/logo'

export default function Navbar() {
    const pathname = usePathname()
    const [isScrolled, setIsScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const checkUser = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        checkUser()
    }, [])

    const navLinks = [
        { href: '/explore', label: 'Explore', icon: Compass },
        { href: '/about', label: 'About', icon: Info },
    ]

    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                isScrolled
                    ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-100'
                    : 'bg-transparent'
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo — Purple brand color */}
                    <Link href="/" className="group">
                        <Logo className="h-8 w-auto group-hover:scale-105 transition-transform" />
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'px-4 py-2 rounded-full text-sm font-medium transition-all',
                                    pathname === link.href
                                        ? 'bg-neutral-900 text-white'
                                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Side */}
                    <div className="hidden md:flex items-center gap-3">
                        {user ? (
                            <Link href="/seller/dashboard">
                                <Button variant="outline" className="gap-2 rounded-full border-neutral-200">
                                    Seller Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/signup">
                                <Button className="gap-2 rounded-full bg-[#7C3AED] hover:bg-[#6d28d9]">
                                    Become a Seller
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu */}
                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon">
                                <Menu className="w-6 h-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-80">
                            <div className="flex flex-col h-full">
                                <div className="flex items-center justify-between p-4 border-b">
                                    <Logo className="h-7 w-auto" />
                                    <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>
                                <nav className="flex-1 p-4 space-y-2">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setMobileOpen(false)}
                                            className={cn(
                                                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium',
                                                pathname === link.href
                                                    ? 'bg-neutral-900 text-white'
                                                    : 'text-neutral-600 hover:bg-neutral-100'
                                            )}
                                        >
                                            <link.icon className="w-5 h-5" />
                                            {link.label}
                                        </Link>
                                    ))}
                                </nav>
                                <div className="p-4 border-t">
                                    {user ? (
                                        <Link href="/seller/dashboard" onClick={() => setMobileOpen(false)}>
                                            <Button className="w-full gap-2 rounded-full bg-[#7C3AED] hover:bg-[#6d28d9]">
                                                Seller Dashboard
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Link href="/signup" onClick={() => setMobileOpen(false)}>
                                            <Button className="w-full gap-2 rounded-full bg-[#7C3AED] hover:bg-[#6d28d9]">
                                                Become a Seller
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}