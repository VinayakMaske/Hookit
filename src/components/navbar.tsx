// src/components/navbar.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Search,
  Camera,
  Menu,
  X,
  Compass,
  PlusCircle,
  User,
  LogIn,
  ChevronDown,
  Sparkles,
  Store
} from 'lucide-react'

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [signupOpen, setSignupOpen] = useState(false)

  const loginRef = useRef<HTMLDivElement>(null)
  const signupRef = useRef<HTMLDivElement>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (loginRef.current && !loginRef.current.contains(e.target as Node)) {
        setLoginOpen(false)
      }
      if (signupRef.current && !signupRef.current.contains(e.target as Node)) {
        setSignupOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              hookit
            </span>
          </Link>

          {/* Search - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                placeholder="Search hooks, creators, ideas..."
                className="w-full pl-10 h-10 rounded-full bg-neutral-100 border-0 focus:ring-2 focus:ring-purple-500/20 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/explore">
              <Button variant="ghost" className="gap-2 text-neutral-600 hover:text-purple-600 hover:bg-purple-50 rounded-full">
                <Compass className="w-4 h-4" />
                Explore
              </Button>
            </Link>
            <Link href="/hook/new">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-full gap-2 shadow-lg shadow-purple-500/20">
                <PlusCircle className="w-4 h-4" />
                Create Hook
              </Button>
            </Link>

            {/* Login Dropdown */}
            <div className="relative" ref={loginRef}>
              <Button 
                variant="ghost" 
                className="text-neutral-600 hover:text-purple-600 rounded-full gap-2"
                onClick={() => {
                  setLoginOpen(!loginOpen)
                  setSignupOpen(false)
                }}
              >
                <LogIn className="w-4 h-4" />
                Log in
                <ChevronDown className={`w-3 h-3 transition-transform ${loginOpen ? 'rotate-180' : ''}`} />
              </Button>
              
              {loginOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-neutral-100 overflow-hidden py-2 z-50">
                  <Link href="/hooker/login" onClick={() => setLoginOpen(false)}>
                    <div className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 transition-colors cursor-pointer">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-neutral-900">Hookit for Creators</p>
                        <p className="text-xs text-neutral-500">Share your work</p>
                      </div>
                    </div>
                  </Link>
                  <div className="mx-4 my-1 h-px bg-neutral-100" />
                  <Link href="/login" onClick={() => setLoginOpen(false)}>
                    <div className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 transition-colors cursor-pointer">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                        <Store className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-neutral-900">Hookit for Business</p>
                        <p className="text-xs text-neutral-500">Sell your products</p>
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Signup Dropdown */}
            <div className="relative" ref={signupRef}>
              <Button 
                className="bg-neutral-900 hover:bg-neutral-800 text-white rounded-full gap-2"
                onClick={() => {
                  setSignupOpen(!signupOpen)
                  setLoginOpen(false)
                }}
              >
                <User className="w-4 h-4" />
                Sign up
                <ChevronDown className={`w-3 h-3 transition-transform ${signupOpen ? 'rotate-180' : ''}`} />
              </Button>
              
              {signupOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-neutral-100 overflow-hidden py-2 z-50">
                  <Link href="/hooker/signup" onClick={() => setSignupOpen(false)}>
                    <div className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 transition-colors cursor-pointer">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-neutral-900">Hookit for Creators</p>
                        <p className="text-xs text-neutral-500">Create & share hooks</p>
                      </div>
                    </div>
                  </Link>
                  <div className="mx-4 my-1 h-px bg-neutral-100" />
                  <Link href="/signup" onClick={() => setSignupOpen(false)}>
                    <div className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 transition-colors cursor-pointer">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                        <Store className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-neutral-900">Hookit for Business</p>
                        <p className="text-xs text-neutral-500">Open your store</p>
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-neutral-600" /> : <Menu className="w-6 h-6 text-neutral-600" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-100 shadow-lg">
          <div className="px-4 py-4 space-y-3">
            {/* Mobile Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                placeholder="Search hooks, creators..."
                className="w-full pl-10 h-11 rounded-full bg-neutral-100 border-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Link href="/explore" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start gap-3 text-neutral-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl h-12">
                <Compass className="w-5 h-5" />
                Explore
              </Button>
            </Link>
            <Link href="/hook/new" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full justify-start gap-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl h-12">
                <PlusCircle className="w-5 h-5" />
                Create Hook
              </Button>
            </Link>

            {/* Mobile Login Options */}
            <div className="pt-2 border-t border-neutral-100">
              <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider px-2 mb-2">Log In</p>
              <Link href="/hooker/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-3 text-neutral-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl h-12">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  Hookit for Creators
                </Button>
              </Link>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-3 text-neutral-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl h-12">
                  <Store className="w-5 h-5 text-indigo-500" />
                  Hookit for Business
                </Button>
              </Link>
            </div>

            {/* Mobile Signup Options */}
            <div className="pt-2 border-t border-neutral-100">
              <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider px-2 mb-2">Sign Up</p>
              <Link href="/hooker/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-3 text-neutral-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl h-12">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  Hookit for Creators
                </Button>
              </Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-3 text-neutral-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl h-12">
                  <Store className="w-5 h-5 text-indigo-500" />
                  Hookit for Business
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}