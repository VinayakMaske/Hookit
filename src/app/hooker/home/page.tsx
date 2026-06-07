// src/app/hooker/home/page.tsx
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import {
  Heart,
  Bookmark,
  Loader2,
  Search,
  Sparkles,
  Flame,
  Clock,
  MessageCircle,
  Bell
} from 'lucide-react'
import Link from 'next/link'

interface Hook {
  id: string
  title: string
  description: string
  image_url: string
  images: string[]
  category: string
  tags: string[]
  creator_name: string
  likes_count: number
  saves_count: number
  created_at: string
  isLiked?: boolean
  isSaved?: boolean
}

const CATEGORY_COLORS: Record<string, string> = {
  'Travel': 'bg-purple-100 text-purple-700',
  'Art': 'bg-pink-100 text-pink-700',
  'Photography': 'bg-violet-100 text-violet-700',
  'Products': 'bg-fuchsia-100 text-fuchsia-700',
  'Fashion': 'bg-indigo-100 text-indigo-700',
  'Food': 'bg-rose-100 text-rose-700',
  'Technology': 'bg-blue-100 text-blue-700',
  'Gaming': 'bg-violet-100 text-violet-700',
  'Music': 'bg-amber-100 text-amber-700',
  'Books': 'bg-emerald-100 text-emerald-700',
  'Fitness': 'bg-red-100 text-red-700',
  'Home Decor': 'bg-teal-100 text-teal-700',
  'Automotive': 'bg-slate-100 text-slate-700',
  'Parenting': 'bg-sky-100 text-sky-700',
  'Business': 'bg-zinc-100 text-zinc-700',
  'Movies': 'bg-red-100 text-red-700',
  'Writing': 'bg-stone-100 text-stone-700',
  'Lifestyle': 'bg-pink-100 text-pink-700',
}

// Sample data for demo (remove when you have real hooks)
const SAMPLE_HOOKS: Hook[] = [
  { id: '1', title: 'Sunset in Bali', description: '', image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop', images: [], category: 'Travel', tags: [], creator_name: 'TravelBug', likes_count: 234, saves_count: 56, created_at: '', isLiked: false, isSaved: false },
  { id: '2', title: 'Minimalist Watch', description: '', image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=500&fit=crop', images: [], category: 'Products', tags: [], creator_name: 'AlexDesign', likes_count: 567, saves_count: 123, created_at: '', isLiked: false, isSaved: false },
  { id: '3', title: 'Abstract Art', description: '', image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=550&fit=crop', images: [], category: 'Art', tags: [], creator_name: 'MayaArts', likes_count: 891, saves_count: 234, created_at: '', isLiked: false, isSaved: false },
  { id: '4', title: 'Street Fashion', description: '', image_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=480&fit=crop', images: [], category: 'Fashion', tags: [], creator_name: 'StyleIcon', likes_count: 445, saves_count: 89, created_at: '', isLiked: false, isSaved: false },
  { id: '5', title: 'Gaming Setup', description: '', image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=520&fit=crop', images: [], category: 'Gaming', tags: [], creator_name: 'PixelPro', likes_count: 665, saves_count: 156, created_at: '', isLiked: false, isSaved: false },
  { id: '6', title: 'Healthy Bowl', description: '', image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=450&fit=crop', images: [], category: 'Food', tags: [], creator_name: 'FitChef', likes_count: 876, saves_count: 198, created_at: '', isLiked: false, isSaved: false },
  { id: '7', title: 'Coding Setup', description: '', image_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=500&fit=crop', images: [], category: 'Technology', tags: [], creator_name: 'DevLife', likes_count: 678, saves_count: 145, created_at: '', isLiked: false, isSaved: false },
  { id: '8', title: 'Swiss Alps', description: '', image_url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=600&fit=crop', images: [], category: 'Travel', tags: [], creator_name: 'Wanderlust', likes_count: 1234, saves_count: 312, created_at: '', isLiked: false, isSaved: false },
  { id: '9', title: 'Portrait Photo', description: '', image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=550&fit=crop', images: [], category: 'Photography', tags: [], creator_name: 'SarahClicks', likes_count: 567, saves_count: 134, created_at: '', isLiked: false, isSaved: false },
  { id: '10', title: 'Modern Art', description: '', image_url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=480&fit=crop', images: [], category: 'Art', tags: [], creator_name: 'GalleryX', likes_count: 334, saves_count: 67, created_at: '', isLiked: false, isSaved: false },
  { id: '11', title: 'Mountain Lake', description: '', image_url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=500&fit=crop', images: [], category: 'Travel', tags: [], creator_name: 'NatureLover', likes_count: 1567, saves_count: 423, created_at: '', isLiked: false, isSaved: false },
  { id: '12', title: 'Polaroid Camera', description: '', image_url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=450&fit=crop', images: [], category: 'Products', tags: [], creator_name: 'RetroVibes', likes_count: 223, saves_count: 45, created_at: '', isLiked: false, isSaved: false },
  { id: '13', title: 'Pizza Recipe', description: '', image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=520&fit=crop', images: [], category: 'Food', tags: [], creator_name: 'ChefMike', likes_count: 890, saves_count: 267, created_at: '', isLiked: false, isSaved: false },
  { id: '14', title: 'Data Dashboard', description: '', image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=480&fit=crop', images: [], category: 'Technology', tags: [], creator_name: 'TechNinja', likes_count: 312, saves_count: 78, created_at: '', isLiked: false, isSaved: false },
  { id: '15', title: 'Boutique Store', description: '', image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=550&fit=crop', images: [], category: 'Fashion', tags: [], creator_name: 'ShopOwner', likes_count: 543, saves_count: 112, created_at: '', isLiked: false, isSaved: false },
  { id: '16', title: 'Runway Model', description: '', image_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=600&fit=crop', images: [], category: 'Fashion', tags: [], creator_name: 'FashionWeek', likes_count: 987, saves_count: 234, created_at: '', isLiked: false, isSaved: false },
  { id: '17', title: 'Foggy Forest', description: '', image_url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=500&fit=crop', images: [], category: 'Travel', tags: [], creator_name: 'Wanderlust', likes_count: 1123, saves_count: 345, created_at: '', isLiked: false, isSaved: false },
  { id: '18', title: 'Model Shoot', description: '', image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=550&fit=crop', images: [], category: 'Photography', tags: [], creator_name: 'LensMaster', likes_count: 678, saves_count: 156, created_at: '', isLiked: false, isSaved: false },
]

export default function HookerHomePage() {
  const router = useRouter()
  const [hooks, setHooks] = useState<Hook[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [preferences, setPreferences] = useState<string[]>([])
  const [activeFilter, setActiveFilter] = useState<'for-you' | 'trending' | 'latest'>('for-you')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: prefs } = await supabase
          .from('hooker_preferences')
          .select('categories')
          .eq('user_id', user.id)
          .single()

        if (prefs?.categories && prefs.categories.length > 0) {
          setPreferences(prefs.categories)
        }

        // Try to fetch real hooks, fallback to sample
        const { data: realHooks } = await supabase
          .from('hooks')
          .select('*')
          .eq('is_published', true)
          .limit(50)

        if (realHooks && realHooks.length > 0) {
          setHooks(realHooks)
        } else {
          // Show sample data for demo
          setHooks(SAMPLE_HOOKS)
        }
      } else {
        setHooks(SAMPLE_HOOKS)
      }

      setLoading(false)
    }

    init()
  }, [router])

  const handleLike = async (hookId: string) => {
    if (!user) {
      router.push('/hooker/login?redirect=' + encodeURIComponent('/hooker/home'))
      return
    }
    setHooks(prev => prev.map(h => 
      h.id === hookId 
        ? { ...h, isLiked: !h.isLiked, likes_count: h.isLiked ? h.likes_count - 1 : h.likes_count + 1 } 
        : h
    ))
  }

  const handleSave = async (hookId: string) => {
    if (!user) {
      router.push('/hooker/login?redirect=' + encodeURIComponent('/hooker/home'))
      return
    }
    setHooks(prev => prev.map(h => 
      h.id === hookId 
        ? { ...h, isSaved: !h.isSaved, saves_count: h.isSaved ? h.saves_count - 1 : h.saves_count + 1 } 
        : h
    ))
  }

  const filteredHooks = searchQuery
    ? hooks.filter(h => 
        h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.creator_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : hooks

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Header - Sticky */}
      <header className="sticky top-0 z-40 bg-white">
        <div className="max-w-[1600px] mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Mobile Logo */}
            <Link href="/hooker/home" className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>H</span>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                placeholder="Search your favorite ideas"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 h-12 rounded-full bg-neutral-100 border-0 focus:ring-2 focus:ring-purple-500/20 text-sm"
              />
            </div>

            {/* Desktop Right Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <button className="p-3 rounded-full hover:bg-neutral-100 transition-colors text-neutral-600">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-3 rounded-full hover:bg-neutral-100 transition-colors text-neutral-600">
                <MessageCircle className="w-5 h-5" />
              </button>
              <Link href="/hooker/settings">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                  {(user?.user_metadata?.full_name || 'U').charAt(0).toUpperCase()}
                </div>
              </Link>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveFilter('for-you')}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                activeFilter === 'for-you'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> For You
            </button>
            <button
              onClick={() => setActiveFilter('trending')}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                activeFilter === 'trending'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5" /> Trending
            </button>
            <button
              onClick={() => setActiveFilter('latest')}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                activeFilter === 'latest'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" /> Latest
            </button>
          </div>
        </div>
      </header>

      {/* Dense Masonry Feed - Fills entire screen */}
      <div className="max-w-[1600px] mx-auto px-2 pb-4">
        {filteredHooks.length === 0 ? (
          <div className="text-center py-20">
            <Sparkles className="w-16 h-16 text-neutral-200 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-700 mb-2">No hooks yet</h3>
            <p className="text-neutral-400 mb-6">Be the first to create something amazing!</p>
            <Link href="/hook/new">
              <button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full h-12 px-8 font-medium hover:shadow-lg transition-all">
                Create Your First Hook
              </button>
            </Link>
          </div>
        ) : (
          <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-2 space-y-2">
            {filteredHooks.map((hook) => {
              const categoryColor = CATEGORY_COLORS[hook.category] || 'bg-neutral-100 text-neutral-700'

              return (
                <div
                  key={hook.id}
                  className="break-inside-avoid group relative rounded-2xl overflow-hidden cursor-pointer mb-2"
                >
                  <Link href={`/hook/${hook.id}`}>
                    <div className="relative">
                      <img
                        src={hook.image_url}
                        alt={hook.title}
                        className="w-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      
                      {/* Dark gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                        {/* Top right - Save button */}
                        <div className="absolute top-3 right-3">
                          <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSave(hook.id) }}
                            className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
                              hook.isSaved ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/40'
                            }`}
                          >
                            <Bookmark className={`w-4 h-4 ${hook.isSaved ? 'fill-white' : ''}`} />
                          </button>
                        </div>

                        {/* Bottom - Title and creator */}
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">{hook.title}</h3>
                          <div className="flex items-center justify-between">
                            <span className="text-white/70 text-xs">{hook.creator_name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Category badge - top left */}
                  <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-medium ${categoryColor} opacity-0 group-hover:opacity-100 transition-opacity`}>
                    {hook.category}
                  </div>

                  {/* Bottom action bar - always visible on mobile, hover on desktop */}
                  <div className="md:hidden absolute bottom-2 right-2 flex gap-1.5">
                    <button
                      onClick={() => handleLike(hook.id)}
                      className={`p-1.5 rounded-full backdrop-blur-md ${
                        hook.isLiked ? 'bg-red-500 text-white' : 'bg-black/40 text-white'
                      }`}
                    >
                      <Heart className={`w-3 h-3 ${hook.isLiked ? 'fill-white' : ''}`} />
                    </button>
                  </div>

                  {/* Desktop hover actions */}
                  <div className="hidden md:flex absolute bottom-2 right-2 gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleLike(hook.id)}
                      className={`p-2 rounded-full backdrop-blur-md transition-all ${
                        hook.isLiked ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/40'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${hook.isLiked ? 'fill-white' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleSave(hook.id)}
                      className={`p-2 rounded-full backdrop-blur-md transition-all ${
                        hook.isSaved ? 'bg-purple-500 text-white' : 'bg-white/20 text-white hover:bg-white/40'
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${hook.isSaved ? 'fill-white' : ''}`} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}