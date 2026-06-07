// src/app/hooker/explore/page.tsx
'use client'

import { useState, useEffect, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Search,
  Heart,
  Share2,
  Bookmark,
  MessageCircle,
  ArrowRight,
  Sparkles,
  Globe,
  Plane,
  Palette,
  Camera,
  ShoppingBag,
  Sparkles as SparklesIcon,
  Utensils,
  Laptop,
  Gamepad2,
  ExternalLink,
  X,
  TrendingUp,
  Eye,
  Flame,
  Clock,
  Loader2
} from 'lucide-react'

// Icon mapping for categories
const ICON_MAP: Record<string, React.ElementType> = {
  Plane,
  Palette,
  Camera,
  ShoppingBag,
  Sparkles: SparklesIcon,
  Utensils,
  Laptop,
  Gamepad2,
  Globe,
}

// Category color mapping
const CATEGORY_COLORS: Record<string, string> = {
  travel: 'from-purple-500 to-pink-500',
  art: 'from-pink-500 to-rose-500',
  photography: 'from-violet-500 to-purple-500',
  products: 'from-fuchsia-500 to-pink-500',
  fashion: 'from-purple-600 to-indigo-500',
  food: 'from-rose-500 to-orange-500',
  technology: 'from-indigo-500 to-purple-500',
  gaming: 'from-violet-600 to-fuchsia-500',
}

// Filter tabs
const FILTER_TABS = [
  { id: 'for-you', label: 'For You', icon: Sparkles },
  { id: 'trending', label: 'Trending', icon: Flame },
  { id: 'latest', label: 'Latest', icon: Clock },
]

// Demo masonry images for when no hooks exist yet
const DEMO_HOOKS = [
  { id: 'demo-1', src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=500&fit=crop', title: 'Minimal Watch', creator: 'Alex Design', category: 'Products', likes: 234, saves: 45, comments: 12, views: 1200, is_demo: true },
  { id: 'demo-2', src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop', title: 'Portrait Photography', creator: 'Sarah Clicks', category: 'Photography', likes: 567, saves: 89, comments: 23, views: 3400, is_demo: true },
  { id: 'demo-3', src: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=450&fit=crop', title: 'Abstract Art', creator: 'Maya Arts', category: 'Art', likes: 891, saves: 156, comments: 34, views: 5600, is_demo: true },
  { id: 'demo-4', src: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=550&fit=crop', title: 'Swiss Alps', creator: 'Travel Bug', category: 'Travel', likes: 1234, saves: 234, comments: 56, views: 8900, is_demo: true },
  { id: 'demo-5', src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=480&fit=crop', title: 'Street Fashion', creator: 'Style Icon', category: 'Fashion', likes: 445, saves: 67, comments: 18, views: 2100, is_demo: true },
  { id: 'demo-6', src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=520&fit=crop', title: 'Coding Setup', creator: 'Dev Life', category: 'Technology', likes: 678, saves: 123, comments: 45, views: 4500, is_demo: true },
  { id: 'demo-7', src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=470&fit=crop', title: 'Pizza Recipe', creator: 'Chef Mike', category: 'Food', likes: 890, saves: 198, comments: 67, views: 6700, is_demo: true },
  { id: 'demo-8', src: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=580&fit=crop', title: 'Modern Art', creator: 'Gallery X', category: 'Art', likes: 334, saves: 56, comments: 14, views: 1800, is_demo: true },
  { id: 'demo-9', src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=490&fit=crop', title: 'Mountain Lake', creator: 'Nature Lover', category: 'Travel', likes: 1567, saves: 345, comments: 89, views: 12000, is_demo: true },
  { id: 'demo-10', src: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=510&fit=crop', title: 'Polaroid Camera', creator: 'Retro Vibes', category: 'Products', likes: 223, saves: 34, comments: 8, views: 900, is_demo: true },
  { id: 'demo-11', src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=460&fit=crop', title: 'Sunset Vibes', creator: 'Golden Hour', category: 'Photography', likes: 789, saves: 145, comments: 32, views: 4300, is_demo: true },
  { id: 'demo-12', src: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=400&h=540&fit=crop', title: 'Colorful Art', creator: 'Art Studio', category: 'Art', likes: 556, saves: 89, comments: 21, views: 3200, is_demo: true },
  { id: 'demo-13', src: 'https://images.unsplash.com/photo-1511376777868-611b54f68947?w=400&h=440&fit=crop', title: 'Music Studio', creator: 'Beat Maker', category: 'Art', likes: 432, saves: 78, comments: 19, views: 2800, is_demo: true },
  { id: 'demo-14', src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=500&fit=crop', title: 'Retro Gaming', creator: 'Pixel Pro', category: 'Gaming', likes: 665, saves: 134, comments: 43, views: 5100, is_demo: true },
  { id: 'demo-15', src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=420&fit=crop', title: 'Data Dashboard', creator: 'Tech Ninja', category: 'Technology', likes: 312, saves: 45, comments: 12, views: 1500, is_demo: true },
  { id: 'demo-16', src: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=560&fit=crop', title: 'Healthy Bowl', creator: 'Fit Chef', category: 'Food', likes: 876, saves: 167, comments: 54, views: 7200, is_demo: true },
  { id: 'demo-17', src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=480&fit=crop', title: 'Boutique Store', creator: 'Shop Owner', category: 'Products', likes: 543, saves: 98, comments: 27, views: 3600, is_demo: true },
  { id: 'demo-18', src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=530&fit=crop', title: 'Runway Model', creator: 'Fashion Week', category: 'Fashion', likes: 987, saves: 234, comments: 76, views: 8900, is_demo: true },
  { id: 'demo-19', src: 'https://images.unsplash.com/photo-1470071459604-3b98c0f71b9d?w=400&h=470&fit=crop', title: 'Foggy Forest', creator: 'Wanderlust', category: 'Travel', likes: 1123, saves: 289, comments: 65, views: 9500, is_demo: true },
  { id: 'demo-20', src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=510&fit=crop', title: 'Model Shoot', creator: 'Lens Master', category: 'Photography', likes: 678, saves: 123, comments: 34, views: 4100, is_demo: true },
]

// Hook card component
function HookCard({ hook, isDemo = false, currentUserId }: { hook: any; isDemo?: boolean; currentUserId?: string | null }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [likeCount, setLikeCount] = useState<number>(hook.likes || hook.like_count || 0)
  const [saveCount, setSaveCount] = useState<number>(hook.saves || hook.save_count || 0)
  const supabase = createClient()

  const imageUrl = isDemo
    ? hook.src
    : (hook.images?.[0] || hook.image_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=500&fit=crop')

  const commentCount = hook.comments || hook.comment_count || 0
  const viewCount = hook.views || hook.view_count || 0

  // Check if user has liked/saved this hook
  useEffect(() => {
    if (!currentUserId || isDemo) return

    const checkInteractions = async () => {
      const { data: likeData } = await supabase
        .from('hook_likes')
        .select('id')
        .eq('hook_id', hook.id)
        .eq('user_id', currentUserId)
        .single()

      const { data: saveData } = await supabase
        .from('hook_saves')
        .select('id')
        .eq('hook_id', hook.id)
        .eq('user_id', currentUserId)
        .single()

      setIsLiked(!!likeData)
      setIsSaved(!!saveData)
    }

    checkInteractions()
  }, [currentUserId, hook.id, isDemo])

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!currentUserId || isDemo) return

    if (isLiked) {
      await supabase.from('hook_likes').delete().eq('hook_id', hook.id).eq('user_id', currentUserId)
      setLikeCount((prev: number) => prev - 1)
    } else {
      await supabase.from('hook_likes').insert({ hook_id: hook.id, user_id: currentUserId })
      setLikeCount((prev: number) => prev + 1)
    }
    setIsLiked(!isLiked)
  }

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!currentUserId || isDemo) return

    if (isSaved) {
      await supabase.from('hook_saves').delete().eq('hook_id', hook.id).eq('user_id', currentUserId)
      setSaveCount((prev: number) => prev - 1)
    } else {
      await supabase.from('hook_saves').insert({ hook_id: hook.id, user_id: currentUserId })
      setSaveCount((prev: number) => prev + 1)
    }
    setIsSaved(!isSaved)
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const shareUrl = `${window.location.origin}/hook/${hook.id}`

    if (navigator.share) {
      await navigator.share({
        title: hook.title || hook.name,
        url: shareUrl,
      })
    } else {
      await navigator.clipboard.writeText(shareUrl)
      // Could show toast here
    }
  }

  return (
    <div
      className="break-inside-avoid mb-4 group relative rounded-2xl overflow-hidden cursor-pointer bg-neutral-100 shadow-sm hover:shadow-xl transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={hook.id ? `/hooker/hook/${hook.id}` : '#'}>
        <img
          src={imageUrl}
          alt={hook.title || hook.name}
          className="w-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Hover Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          {/* Top Actions */}
          <div className="absolute top-3 right-3 flex gap-2">
            <button 
              onClick={handleSave}
              className={`p-2.5 backdrop-blur-md rounded-full transition-colors ${isSaved ? 'bg-purple-500 text-white' : 'bg-white/20 hover:bg-white/40 text-white'}`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
            </button>
            <button 
              onClick={handleShare}
              className="p-2.5 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40 transition-colors text-white"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">{hook.title || hook.name}</h3>
            <div className="flex items-center justify-between">
              <span className="text-white/80 text-xs">{hook.creator || hook.creator_name || 'Anonymous'}</span>
            </div>

            {/* Engagement Stats */}
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/20">
              <button 
                onClick={handleLike}
                className={`flex items-center gap-1 text-xs transition-colors ${isLiked ? 'text-pink-400' : 'text-white/70'}`}
              >
                <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-pink-400' : ''}`} />
                {likeCount >= 1000 ? `${(likeCount / 1000).toFixed(1)}K` : likeCount}
              </button>
              <div className="flex items-center gap-1 text-white/70 text-xs">
                <MessageCircle className="w-3.5 h-3.5" />
                {commentCount}
              </div>
              <div className="flex items-center gap-1 text-white/70 text-xs">
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-purple-400 text-purple-400' : ''}`} />
                {saveCount >= 1000 ? `${(saveCount / 1000).toFixed(1)}K` : saveCount}
              </div>
              <div className="flex items-center gap-1 text-white/70 text-xs ml-auto">
                <Eye className="w-3.5 h-3.5" />
                {viewCount >= 1000 ? `${(viewCount / 1000).toFixed(1)}K` : viewCount}
              </div>
            </div>
          </div>
        </div>

        {/* Category Badge */}
        <Badge className={`absolute top-3 left-3 bg-gradient-to-r ${CATEGORY_COLORS[hook.category_slug || hook.category?.toLowerCase() || 'art']} text-white border-0 text-xs backdrop-blur-sm shadow-lg`}>
          {hook.category}
        </Badge>

        {/* Trending Badge */}
        {(likeCount > 500 || viewCount > 3000) && (
          <Badge className="absolute top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white border-0 text-xs backdrop-blur-sm shadow-lg flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Trending
          </Badge>
        )}
      </Link>
    </div>
  )
}

// Category pill component
function CategoryPill({ category, isActive, onClick, count }: { category: any; isActive: boolean; onClick: () => void; count?: number }) {
  const Icon = ICON_MAP[category.icon] || Globe

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
        isActive
          ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/25 scale-105'
          : 'bg-white text-neutral-600 border border-neutral-200 hover:border-purple-300 hover:text-purple-600 hover:shadow-md'
      }`}
    >
      <Icon className="w-4 h-4" />
      {category.name}
      {count !== undefined && (
        <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${isActive ? 'bg-white/20' : 'bg-neutral-100 text-neutral-500'}`}>
          {count}
        </span>
      )}
    </button>
  )
}

// Filter tab component
function FilterTab({ tab, isActive, onClick }: { tab: any; isActive: boolean; onClick: () => void }) {
  const Icon = tab.icon
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
        isActive
          ? 'bg-neutral-900 text-white shadow-lg'
          : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
      }`}
    >
      <Icon className="w-4 h-4" />
      {tab.label}
    </button>
  )
}

function ExploreContent() {
  const [categories, setCategories] = useState<any[]>([])
  const [hooks, setHooks] = useState<any[]>([])
  const [filteredHooks, setFilteredHooks] = useState<any[]>([])
  const [featuredHooks, setFeaturedHooks] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [activeFilter, setActiveFilter] = useState<string>('for-you')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    setIsVisible(true)
    fetchCurrentUser()
    fetchCategories()
    fetchHooks()
  }, [])

  // Fetch current user
  const fetchCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setCurrentUserId(user?.id || null)
  }

  // Fetch categories from DB
  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    setCategories(data || [])
  }

  // Fetch ALL hooks from DB (both guest and logged-in users)
  const fetchHooks = async () => {
    setLoading(true)

    // Fetch featured hooks
    const { data: featured } = await supabase
      .from('hooks')
      .select('*')
      .eq('is_published', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(3)

    setFeaturedHooks(featured || [])

    // Fetch ALL published hooks (both guest and logged-in users)
    // Guest hooks have creator_name, logged-in hooks have user_id
    const { data } = await supabase
      .from('hooks')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(100)

    setHooks(data || [])
    setFilteredHooks(data || [])
    setLoading(false)
  }

  // Apply filters (category + search + filter tab)
  useEffect(() => {
    let result = [...hooks]

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((h) => 
        h.category_slug === selectedCategory || h.category?.toLowerCase() === selectedCategory
      )
    }

    // Search filter
    if (searchQuery.trim()) {
      result = result.filter((h) =>
        (h.title || h.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (h.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (h.creator_name || h.creator || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter tab sorting
    if (activeFilter === 'trending') {
      result = [...result].sort((a, b) => (b.likes || b.like_count || 0) - (a.likes || a.like_count || 0))
    } else if (activeFilter === 'latest') {
      result = [...result].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }
    // 'for-you' keeps default order (could be personalized later)

    setFilteredHooks(result)
  }, [selectedCategory, searchQuery, activeFilter, hooks])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is already handled by useEffect
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setActiveFilter('for-you')
  }

  // Count hooks per category
  const getCategoryCount = (slug: string) => {
    return hooks.filter((h) => h.category_slug === slug || h.category?.toLowerCase() === slug).length
  }

  // Use demo hooks if no real hooks exist yet
  const displayHooks = hooks.length > 0 ? filteredHooks : DEMO_HOOKS.filter((h) =>
    selectedCategory === 'all' ? true : h.category.toLowerCase() === selectedCategory
  )

  const displayFeatured = featuredHooks.length > 0 ? featuredHooks : DEMO_HOOKS.slice(0, 3)

  return (
    <div className="min-h-screen bg-white">
      {/* Top Search Bar - Matching screenshot layout */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-4">
            {/* Search Input */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <Input
                  placeholder="Search your favorite ideas"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 bg-neutral-100 border-0 text-base rounded-full focus:ring-2 focus:ring-purple-500/20 hover:bg-neutral-50 transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-neutral-200 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-neutral-400" />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Filter Tabs - For You / Trending / Latest */}
      <div className="sticky top-[60px] z-20 bg-white border-b border-neutral-100">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3">
            {FILTER_TABS.map((tab) => (
              <FilterTab
                key={tab.id}
                tab={tab}
                isActive={activeFilter === tab.id}
                onClick={() => setActiveFilter(tab.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <CategoryPill
            category={{ name: 'All', icon: 'Globe', slug: 'all' }}
            isActive={selectedCategory === 'all'}
            onClick={() => setSelectedCategory('all')}
            count={hooks.length}
          />
          {categories.map((cat) => (
            <CategoryPill
              key={cat.slug}
              category={cat}
              isActive={selectedCategory === cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              count={getCategoryCount(cat.slug)}
            />
          ))}
        </div>
      </div>

      {/* Featured Hooks Section (only when not filtering) */}
      {selectedCategory === 'all' && !searchQuery && activeFilter === 'for-you' && (
        <section className="pb-8">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h2 className="text-2xl font-bold text-neutral-900">Featured Hooks</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {displayFeatured.map((hook, i) => (
                <Link key={hook.id || i} href={hook.id ? `/hooker/hook/${hook.id}` : '#'}>
                  <div className="group relative rounded-3xl overflow-hidden bg-neutral-100 aspect-[4/3] cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
                    <img
                      src={hook.images?.[0] || hook.image_url || hook.src || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop'}
                      alt={hook.title || hook.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    <div className="absolute top-4 left-4">
                      <Badge className="bg-gradient-to-r from-purple-600 to-pink-500 text-white border-0 shadow-lg">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-white font-bold text-xl mb-2">{hook.title || hook.name}</h3>
                      <p className="text-white/80 text-sm mb-3 line-clamp-2">{hook.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{(hook.creator_name || hook.creator || 'A')[0]}</span>
                          </div>
                          <span className="text-white/90 text-sm">{hook.creator_name || hook.creator || 'Anonymous'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-white/70 text-sm">
                          <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> {hook.likes || hook.like_count || 0}</span>
                          <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {hook.view_count || hook.views || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Hooks Masonry Grid */}
      <section className="pb-12">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">
                {selectedCategory === 'all' ? 'Discover Hooks' : categories.find(c => c.slug === selectedCategory)?.name || 'Hooks'}
              </h2>
              <p className="text-neutral-500 text-sm mt-1">
                {displayHooks.length} {displayHooks.length === 1 ? 'Hook' : 'Hooks'} found
              </p>
            </div>

            {hooks.length === 0 && (
              <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                Showing demo content — create your first Hook!
              </Badge>
            )}
          </div>

          {/* Loading State */}
          {loading && hooks.length === 0 ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
            </div>
          ) : displayHooks.length > 0 ? (
            <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-4">
              {displayHooks.map((hook, i) => (
                <HookCard 
                  key={hook.id || i} 
                  hook={hook} 
                  isDemo={hooks.length === 0}
                  currentUserId={currentUserId}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No hooks found</h3>
              <p className="text-neutral-500 mb-6">Try a different category or search term</p>
              <Button
                onClick={clearSearch}
                variant="outline"
                className="rounded-full gap-2"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
      </div>
    }>
      <ExploreContent />
    </Suspense>
  )
}