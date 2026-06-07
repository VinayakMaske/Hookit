// src/app/(site)/explore/page.tsx
'use client'

import { useState, useEffect, Suspense, useRef } from 'react'
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
  ChevronLeft,
  ChevronRight
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

// Category color mapping (matches landing page)
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

// Demo masonry images for when no hooks exist yet
const DEMO_HOOKS = [
  { id: 'demo-1', src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=500&fit=crop', title: 'Minimal Watch', creator: 'Alex Design', category: 'Products', likes: 234, saves: 45, comments: 12, views: 1200 },
  { id: 'demo-2', src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop', title: 'Portrait Photography', creator: 'Sarah Clicks', category: 'Photography', likes: 567, saves: 89, comments: 23, views: 3400 },
  { id: 'demo-3', src: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=450&fit=crop', title: 'Abstract Art', creator: 'Maya Arts', category: 'Art', likes: 891, saves: 156, comments: 34, views: 5600 },
  { id: 'demo-4', src: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=550&fit=crop', title: 'Swiss Alps', creator: 'Travel Bug', category: 'Travel', likes: 1234, saves: 234, comments: 56, views: 8900 },
  { id: 'demo-5', src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=480&fit=crop', title: 'Street Fashion', creator: 'Style Icon', category: 'Fashion', likes: 445, saves: 67, comments: 18, views: 2100 },
  { id: 'demo-6', src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=520&fit=crop', title: 'Coding Setup', creator: 'Dev Life', category: 'Technology', likes: 678, saves: 123, comments: 45, views: 4500 },
  { id: 'demo-7', src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=470&fit=crop', title: 'Pizza Recipe', creator: 'Chef Mike', category: 'Food', likes: 890, saves: 198, comments: 67, views: 6700 },
  { id: 'demo-8', src: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=580&fit=crop', title: 'Modern Art', creator: 'Gallery X', category: 'Art', likes: 334, saves: 56, comments: 14, views: 1800 },
  { id: 'demo-9', src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=490&fit=crop', title: 'Mountain Lake', creator: 'Nature Lover', category: 'Travel', likes: 1567, saves: 345, comments: 89, views: 12000 },
  { id: 'demo-10', src: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=510&fit=crop', title: 'Polaroid Camera', creator: 'Retro Vibes', category: 'Products', likes: 223, saves: 34, comments: 8, views: 900 },
  { id: 'demo-11', src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=460&fit=crop', title: 'Sunset Vibes', creator: 'Golden Hour', category: 'Photography', likes: 789, saves: 145, comments: 32, views: 4300 },
  { id: 'demo-12', src: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=400&h=540&fit=crop', title: 'Colorful Art', creator: 'Art Studio', category: 'Art', likes: 556, saves: 89, comments: 21, views: 3200 },
  { id: 'demo-13', src: 'https://images.unsplash.com/photo-1511376777868-611b54f68947?w=400&h=440&fit=crop', title: 'Music Studio', creator: 'Beat Maker', category: 'Art', likes: 432, saves: 78, comments: 19, views: 2800 },
  { id: 'demo-14', src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=500&fit=crop', title: 'Retro Gaming', creator: 'Pixel Pro', category: 'Gaming', likes: 665, saves: 134, comments: 43, views: 5100 },
  { id: 'demo-15', src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=420&fit=crop', title: 'Data Dashboard', creator: 'Tech Ninja', category: 'Technology', likes: 312, saves: 45, comments: 12, views: 1500 },
  { id: 'demo-16', src: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=560&fit=crop', title: 'Healthy Bowl', creator: 'Fit Chef', category: 'Food', likes: 876, saves: 167, comments: 54, views: 7200 },
  { id: 'demo-17', src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=480&fit=crop', title: 'Boutique Store', creator: 'Shop Owner', category: 'Products', likes: 543, saves: 98, comments: 27, views: 3600 },
  { id: 'demo-18', src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=530&fit=crop', title: 'Runway Model', creator: 'Fashion Week', category: 'Fashion', likes: 987, saves: 234, comments: 76, views: 8900 },
  { id: 'demo-19', src: 'https://images.unsplash.com/photo-1470071459604-3b98c0f71b9d?w=400&h=470&fit=crop', title: 'Foggy Forest', creator: 'Wanderlust', category: 'Travel', likes: 1123, saves: 289, comments: 65, views: 9500 },
  { id: 'demo-20', src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=510&fit=crop', title: 'Model Shoot', creator: 'Lens Master', category: 'Photography', likes: 678, saves: 123, comments: 34, views: 4100 },
]

// Hook card component
function HookCard({ hook, isDemo = false }: { hook: any; isDemo?: boolean }) {
  const [isHovered, setIsHovered] = useState(false)

  const imageUrl = isDemo
    ? hook.src
    : (hook.images?.[0] || hook.image_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=500&fit=crop')

  const likeCount = hook.likes || hook.like_count || 0
  const saveCount = hook.saves || hook.save_count || 0
  const commentCount = hook.comments || 0
  const viewCount = hook.views || hook.view_count || 0

  return (
    <div
      className="break-inside-avoid mb-4 group relative rounded-2xl overflow-hidden cursor-pointer bg-neutral-100 shadow-sm hover:shadow-xl transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Natural height image - no forced aspect ratio */}
      <img
        src={imageUrl}
        alt={hook.title || hook.name}
        className="w-full h-auto object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />

      {/* Hover Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        {/* Top Actions */}
        <div className="absolute top-3 right-3 flex gap-2">
          <button className="p-2.5 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40 transition-colors">
            <Bookmark className="w-4 h-4 text-white" />
          </button>
          <button className="p-2.5 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40 transition-colors">
            <Share2 className="w-4 h-4 text-white" />
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
            <div className="flex items-center gap-1 text-white/70 text-xs">
              <Heart className="w-3.5 h-3.5" />
              {likeCount >= 1000 ? `${(likeCount / 1000).toFixed(1)}K` : likeCount}
            </div>
            <div className="flex items-center gap-1 text-white/70 text-xs">
              <MessageCircle className="w-3.5 h-3.5" />
              {commentCount}
            </div>
            <div className="flex items-center gap-1 text-white/70 text-xs">
              <Bookmark className="w-3.5 h-3.5" />
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

// Netflix-style Featured Card
function FeaturedCard({ hook }: { hook: any }) {
  return (
    <Link href={hook.id ? `/hook/${hook.id}` : '#'} className="block flex-shrink-0">
      <div className="group relative rounded-2xl overflow-hidden bg-neutral-100 aspect-[16/10] cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 w-[320px] sm:w-[380px] md:w-[420px]">
        <img
          src={hook.images?.[0] || hook.image_url || hook.src || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop'}
          alt={hook.title || hook.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        <div className="absolute top-3 left-3">
          <Badge className="bg-gradient-to-r from-purple-600 to-pink-500 text-white border-0 shadow-lg text-xs">
            <Sparkles className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="text-white font-bold text-lg mb-1 line-clamp-1">{hook.title || hook.name}</h3>
          <p className="text-white/70 text-sm mb-3 line-clamp-2">{hook.description || ''}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="text-white text-xs font-bold">{(hook.creator_name || hook.creator || 'A')[0]}</span>
              </div>
              <span className="text-white/80 text-sm">{hook.creator_name || hook.creator || 'Anonymous'}</span>
            </div>
            <div className="flex items-center gap-3 text-white/70 text-sm">
              <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> {hook.likes || hook.like_count || 0}</span>
              <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {hook.view_count || hook.views || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

// Netflix-style horizontal scroll row
// Netflix-style horizontal scroll row
function FeaturedRow({ hooks, title }: { hooks: any[]; title: string }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', checkScroll)
    checkScroll()
    return () => el.removeEventListener('scroll', checkScroll)
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const scrollAmount = direction === 'left' ? -400 : 400
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }

  if (hooks.length === 0) return null

  return (
    <div className="relative group/row max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">{title}</h2>
        </div>
      </div>

      {/* Scroll Container */}
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className={`absolute left-2 sm:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
            canScrollLeft ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <ChevronLeft className="w-5 h-5 text-neutral-700" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className={`absolute right-2 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
            canScrollRight ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <ChevronRight className="w-5 h-5 text-neutral-700" />
        </button>

        {/* Cards Row - aligned with page padding */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 px-4 sm:px-6 lg:px-8 scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {hooks.map((hook, i) => (
            <FeaturedCard key={hook.id || i} hook={hook} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ExploreContent() {
  const [categories, setCategories] = useState<any[]>([])
  const [hooks, setHooks] = useState<any[]>([])
  const [filteredHooks, setFilteredHooks] = useState<any[]>([])
  const [featuredHooks, setFeaturedHooks] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    setIsVisible(true)
    fetchCategories()
    fetchHooks()
  }, [])

  // Fetch categories from DB
  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    setCategories(data || [])
  }

  // Fetch hooks from DB
  const fetchHooks = async () => {
    setLoading(true)
    
    // Fetch featured hooks
    const { data: featured } = await supabase
      .from('hooks')
      .select('*')
      .eq('is_published', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(10)

    setFeaturedHooks(featured || [])

    // Fetch all hooks
    const { data } = await supabase
      .from('hooks')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(50)

    setHooks(data || [])
    setFilteredHooks(data || [])
    setLoading(false)
  }

  // Filter by category
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredHooks(hooks)
    } else {
      setFilteredHooks(hooks.filter((h) => h.category_slug === selectedCategory || h.category?.toLowerCase() === selectedCategory))
    }
  }, [selectedCategory, hooks])

  // Search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      setFilteredHooks(hooks)
      return
    }

    const filtered = hooks.filter((h) =>
      (h.title || h.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (h.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (h.creator_name || h.creator || '').toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredHooks(filtered)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setFilteredHooks(hooks)
    setSelectedCategory('all')
  }

  // Count hooks per category
  const getCategoryCount = (slug: string) => {
    return hooks.filter((h) => h.category_slug === slug || h.category?.toLowerCase() === slug).length
  }

  // Use demo hooks if no real hooks exist yet
  const displayHooks = hooks.length > 0 ? filteredHooks : DEMO_HOOKS.filter((h) =>
    selectedCategory === 'all' ? true : h.category.toLowerCase() === selectedCategory
  )

  const displayFeatured = featuredHooks.length > 0 ? featuredHooks : DEMO_HOOKS.slice(0, 8)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Gradient like landing page */}
      <section className="relative pt-24 pb-8 lg:pt-32 lg:pb-12 overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Badge className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-200 border-0 px-4 py-1.5 text-sm font-medium">
              <Sparkles className="w-3 h-3 mr-1" />
              Discover Amazing Hooks
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight mb-4">
              Explore{' '}
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 bg-clip-text text-transparent">
                creator Hooks
              </span>
            </h1>

            <p className="text-xl text-neutral-500 mb-8 max-w-2xl mx-auto">
              From art and photography to products and travel — find inspiration from creators around the world.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <Input
                  placeholder="Search hooks, creators, ideas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 bg-white border-neutral-200 text-base rounded-full shadow-lg shadow-purple-100/50 focus:ring-2 focus:ring-purple-500/20"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-neutral-100 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-neutral-400" />
                  </button>
                )}
              </div>
            </form>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide justify-start md:justify-center px-1">
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
        </div>

        {/* Background decoration */}
        <div className="absolute top-20 left-0 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-200/20 rounded-full blur-3xl -z-10" />
      </section>

      {/* Featured Hooks - Netflix Style Horizontal Scroll */}
      {selectedCategory === 'all' && !searchQuery && (
        <section className="py-8">
          <FeaturedRow hooks={displayFeatured} title="Featured Hooks" />
        </section>
      )}

      {/* All Hooks Masonry Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">
                {selectedCategory === 'all' ? 'All Hooks' : categories.find(c => c.slug === selectedCategory)?.name || 'Hooks'}
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
              <div className="animate-spin w-10 h-10 border-3 border-purple-600 border-t-transparent rounded-full" />
            </div>
          ) : displayHooks.length > 0 ? (
            <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4">
              {displayHooks.map((hook, i) => (
                <Link key={hook.id || i} href={hook.id ? `/hook/${hook.id}` : '#'}>
                  <HookCard hook={hook} isDemo={hooks.length === 0} />
                </Link>
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

      {/* CTA Section - Matching landing page style */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-10 md:p-12 text-white relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

            <h2 className="text-3xl md:text-4xl font-bold mb-4 relative z-10">
              Can't find what you're looking for?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto relative z-10">
              Create your own Hook and share it with the world. It only takes 30 seconds.
            </p>
            <Link href="/hook/new" className="relative z-10 inline-block">
              <Button size="lg" className="bg-white text-purple-700 hover:bg-white/90 rounded-full h-14 px-10 text-lg gap-2 shadow-xl">
                <Sparkles className="w-5 h-5" />
                Create a Hook
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-3 border-purple-600 border-t-transparent rounded-full" />
      </div>
    }>
      <ExploreContent />
    </Suspense>
  )
}