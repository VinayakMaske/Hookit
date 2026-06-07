// src/app/hooker/layout.tsx
'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Home, Compass, PlusCircle, Settings, Loader2, MessageCircle, Bell, User } from 'lucide-react'

export default function HookerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
      
      const publicPaths = ['/hooker/login', '/hooker/signup', '/hooker/forgot-password', '/hooker/reset-password']
      if (!user && !publicPaths.some(p => pathname.startsWith(p))) {
        router.push('/hooker/login')
      }
    }
    checkAuth()
  }, [pathname, router])

  const isAuthPage = pathname.startsWith('/hooker/login') || 
                     pathname.startsWith('/hooker/signup') || 
                     pathname.startsWith('/hooker/forgot-password') || 
                     pathname.startsWith('/hooker/reset-password') ||
                     pathname.startsWith('/hooker/onboarding')

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

  const navItems = [
    { href: '/hooker/home', label: 'Home', icon: Home },
    { href: '/hooker/explore', label: 'Explore', icon: Compass },
    { href: '/hooker/hook/new', label: 'Create', icon: PlusCircle },
    { href: '/hooker/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <main className={!isAuthPage ? 'lg:pl-20' : ''}>
        {children}
      </main>

      {/* Desktop Left Sidebar */}
      {!isAuthPage && (
        <>
          <nav className="hidden lg:flex fixed left-0 top-0 bottom-0 w-20 bg-white border-r border-neutral-100 flex-col items-center py-6 z-50">
            {/* Logo */}
            <Link href="/hooker/home" className="mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                <span className="text-white font-bold text-lg" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>H</span>
              </div>
            </Link>

            {/* Nav Items */}
            <div className="flex flex-col gap-2 flex-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative flex flex-col items-center gap-1 p-3 rounded-2xl transition-all duration-300 group ${
                      isActive 
                        ? 'text-purple-600 bg-purple-50' 
                        : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    <Icon className={`w-6 h-6 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} strokeWidth={isActive ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">{item.label}</span>
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-purple-600 rounded-r-full" />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Bottom actions */}
            <div className="flex flex-col gap-2">
              <button className="p-3 rounded-2xl text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 transition-all">
                <Bell className="w-5 h-5" />
              </button>
              <Link href="/hooker/settings">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                  {(user?.user_metadata?.full_name || 'U').charAt(0).toUpperCase()}
                </div>
              </Link>
            </div>
          </nav>

          {/* Mobile Bottom Navigation */}
          <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-neutral-100 z-50 safe-area-pb">
            <div className="flex items-center justify-around px-2 py-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300 ${
                      isActive 
                        ? 'text-purple-600 bg-purple-50' 
                        : 'text-neutral-400 hover:text-neutral-600'
                    }`}
                  >
                    <Icon className={`w-6 h-6 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </nav>
        </>
      )}
    </div>
  )
}