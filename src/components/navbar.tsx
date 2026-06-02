// src/components/navbar.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, Compass, Store, Info, HelpCircle, X, Tag, Newspaper, Briefcase, FileText, Flame, Calculator, Rocket, DollarSign } from 'lucide-react'
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
        { href: '/stores', label: 'Stores', icon: Store },
        { href: '/about', label: 'About', icon: Info },
    ]

    const moreLinks = [
        { href: '/pricing', label: 'Pricing', icon: DollarSign },
        { href: '/help', label: 'Help Center', icon: HelpCircle },
        { href: '/seller-guide', label: 'Seller Guide', icon: Rocket },
        { href: '/seller-calculator', label: 'Earnings Calculator', icon: Calculator },
        { href: '/payouts', label: 'Payout Schedule', icon: Tag },
        { href: '/press', label: 'Press', icon: Newspaper },
        { href: '/careers', label: 'Careers', icon: Briefcase },
        { href: '/blog', label: 'Blog', icon: FileText },
        { href: '/trending', label: 'Trending', icon: Flame },
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
                    {/* Logo */}
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
                        
                        {/* More Dropdown */}
                        <div className="relative group">
                            <button className="px-4 py-2 rounded-full text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-all flex items-center gap-1">
                                More
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-neutral-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2">
                                {moreLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
                                    >
                                        <link.icon className="w-4 h-4" />
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
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
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" className="rounded-full text-neutral-600">
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/signup">
                                    <Button className="gap-2 rounded-full bg-[#7C3AED] hover:bg-[#6d28d9]">
                                        Become a Seller
                                    </Button>
                                </Link>
                            </>
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
                                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                                    <p className="px-4 py-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Main</p>
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
                                    
                                    <p className="px-4 py-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider mt-4">Resources</p>
                                    {moreLinks.map((link) => (
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

                                    <p className="px-4 py-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider mt-4">Legal</p>
                                    <Link href="/privacy" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-100">
                                        Privacy Policy
                                    </Link>
                                    <Link href="/terms" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-100">
                                        Terms of Service
                                    </Link>
                                    <Link href="/cookies" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-100">
                                        Cookie Policy
                                    </Link>
                                    <Link href="/seller-agreement" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-100">
                                        Seller Agreement
                                    </Link>
                                </nav>
                                <div className="p-4 border-t">
                                    {user ? (
                                        <Link href="/seller/dashboard" onClick={() => setMobileOpen(false)}>
                                            <Button className="w-full gap-2 rounded-full bg-[#7C3AED] hover:bg-[#6d28d9]">
                                                Seller Dashboard
                                            </Button>
                                        </Link>
                                    ) : (
                                        <>
                                            <Link href="/login" onClick={() => setMobileOpen(false)}>
                                                <Button variant="outline" className="w-full mb-2 rounded-full">
                                                    Login
                                                </Button>
                                            </Link>
                                            <Link href="/signup" onClick={() => setMobileOpen(false)}>
                                                <Button className="w-full gap-2 rounded-full bg-[#7C3AED] hover:bg-[#6d28d9]">
                                                    Become a Seller
                                                </Button>
                                            </Link>
                                        </>
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