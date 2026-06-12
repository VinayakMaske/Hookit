// src/app/(site)/explore/page.tsx
'use client'

import { useState, useEffect, Suspense, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Search,
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  LayoutList,
  Compass,
  Globe,
  Plane,
  Palette,
  Grid3X3,
  Camera,
  ShoppingBag,
  Sparkles as SparklesIcon,
  Utensils,
  Laptop,
  Gamepad2,
  ExternalLink,
  FileText,
  ShoppingBag as ShoppingBagIcon,
  X,
  TrendingUp,
  Eye,
  MousePointerClick,
  ChevronLeft,
  ChevronRight,
  Layers,
  Zap,
  Flame,
  Clock,
  Loader2,
  Shuffle
} from 'lucide-react'

// ============================================
// ICON MAPPING
// ============================================
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

// ============================================
// CATEGORY COLOR MAPPING
// ============================================
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

// ============================================
// HOOK TYPE CONFIG
// ============================================
const HOOK_TYPE_CONFIG: Record<string, { icon: React.ElementType; label: string; color: string; bgColor: string; textColor: string }> = {
  link: { icon: ExternalLink, label: 'Link', color: 'bg-blue-500', bgColor: 'bg-blue-50', textColor: 'text-blue-700' },
  blog: { icon: FileText, label: 'Blog', color: 'bg-purple-500', bgColor: 'bg-purple-50', textColor: 'text-purple-700' },
  product: { icon: ShoppingBagIcon, label: 'Product', color: 'bg-emerald-500', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700' },
}

// ============================================
// FILTER TABS
// ============================================
const FILTER_TABS = [
  { id: 'all', label: 'All', icon: Layers },
  { id: 'link', label: 'Links', icon: ExternalLink },
  { id: 'blog', label: 'Blogs', icon: FileText },
  { id: 'product', label: 'Products', icon: ShoppingBagIcon },
]

// ============================================
// DEMO HOOKS - All 3 types mixed
// ============================================
const DEMO_HOOKS = [
  { id: 'demo-1', type: 'link', src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=500&fit=crop', title: 'Minimal Watch Design', creator: 'alexdesign', category: 'Products', views: 234, clicks: 89 },
  { id: 'demo-2', type: 'blog', src: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=450&fit=crop', title: 'The Future of Abstract Art', creator: 'mayaarts', category: 'Art', views: 891, clicks: 445 },
  { id: 'demo-3', type: 'product', src: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=510&fit=crop', title: 'Vintage Polaroid Camera', creator: 'retrovibes', category: 'Products', price: 129, views: 223, clicks: 98 },
  { id: 'demo-4', type: 'link', src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop', title: 'Portrait Photography Guide', creator: 'sarahclicks', category: 'Photography', views: 567, clicks: 234 },
  { id: 'demo-5', type: 'blog', src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=480&fit=crop', title: 'Street Fashion Trends 2026', creator: 'styleicon', category: 'Fashion', views: 445, clicks: 234 },
  { id: 'demo-6', type: 'product', src: 'https://images.unsplash.com/photo-1472120435266-53107fd0c44a?w=400&h=460&fit=crop', title: 'Sunset Photography Prints', creator: 'goldenhour', category: 'Photography', price: 35, views: 789, clicks: 345 },
  { id: 'demo-7', type: 'link', src: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=550&fit=crop', title: 'Swiss Alps Travel Guide', creator: 'travelbug', category: 'Travel', views: 1234, clicks: 567 },
  { id: 'demo-8', type: 'blog', src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=470&fit=crop', title: 'Authentic Pizza Recipe', creator: 'chefmike', category: 'Food', views: 890, clicks: 567 },
  { id: 'demo-9', type: 'product', src: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=400&h=540&fit=crop', title: 'Colorful Art Prints Set', creator: 'artstudio', category: 'Art', price: 59, views: 556, clicks: 234 },
  { id: 'demo-10', type: 'link', src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=520&fit=crop', title: 'Best Coding Setup 2026', creator: 'devlife', category: 'Technology', views: 678, clicks: 345 },
  { id: 'demo-11', type: 'blog', src: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=580&fit=crop', title: 'Modern Art Movements', creator: 'galleryx', category: 'Art', views: 334, clicks: 178 },
  { id: 'demo-12', type: 'product', src: 'https://images.unsplash.com/photo-1511376777868-611b54f68947?w=400&h=440&fit=crop', title: 'Music Production Kit', creator: 'beatmaker', category: 'Music', price: 199, views: 432, clicks: 189 },
  { id: 'demo-13', type: 'link', src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=500&fit=crop', title: 'Retro Gaming Collection', creator: 'pixelpro', category: 'Gaming', views: 665, clicks: 289 },
  { id: 'demo-14', type: 'blog', src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=490&fit=crop', title: 'Mountain Lake Photography', creator: 'naturelover', category: 'Travel', views: 1567, clicks: 789 },
  { id: 'demo-15', type: 'product', src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=480&fit=crop', title: 'Handmade Jewelry Collection', creator: 'shopowner', category: 'Products', price: 45, views: 543, clicks: 267 },
  { id: 'demo-16', type: 'link', src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=420&fit=crop', title: 'Analytics Dashboard UI', creator: 'techninja', category: 'Technology', views: 312, clicks: 156 },
  { id: 'demo-17', type: 'blog', src: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=560&fit=crop', title: 'Healthy Eating Guide', creator: 'fitchef', category: 'Food', views: 876, clicks: 456 },
  { id: 'demo-18', type: 'product', src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=530&fit=crop', title: 'Designer Fashion Pieces', creator: 'fashionweek', category: 'Fashion', price: 299, views: 987, clicks: 456 },
  { id: 'demo-19', type: 'link', src: 'https://images.unsplash.com/photo-1470071459604-3b98c0f71b9d?w=400&h=470&fit=crop', title: 'Nature Photography Book', creator: 'wanderlust', category: 'Travel', views: 1123, clicks: 678 },
  { id: 'demo-20', type: 'product', src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=510&fit=crop', title: 'Portrait Photography Course', creator: 'lensmaster', category: 'Photography', price: 79, views: 678, clicks: 345 },
]

// ============================================
// SHUFFLE ARRAY (Fisher-Yates)
// ============================================
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// ============================================
// HOOK CARD COMPONENT
// ============================================
function HookCard({ hook, isDemo = false }: { hook: any; isDemo?: boolean }) {
  const [isHovered, setIsHovered] = useState(false)

  const imageUrl = isDemo
    ? hook.src
    : (hook.images?.[0] || hook.image_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=500&fit=crop')

  const viewCount = hook.views || hook.view_count || 0
  const clickCount = hook.clicks || hook.click_count || 0
  const hookType = hook.type || 'link'
  const price = hook.price || hook.product_price
  const cfg = HOOK_TYPE_CONFIG[hookType] || HOOK_TYPE_CONFIG.link
  const TypeIcon = cfg.icon
  const catColor = CATEGORY_COLORS[hook.category?.toLowerCase()] || 'from-purple-500 to-pink-500'

  return (
    <div
      className="break-inside-avoid mb-4 group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
        <img
          src={imageUrl}
          alt={hook.title || hook.name}
          className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradient overlay on hover */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

        {/* Type Icon — top right, hover only */}
        <div className={`absolute top-3 right-3 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
          <div className={`p-2 ${cfg.color}/90 backdrop-blur-sm rounded-full shadow-lg`}>
            <TypeIcon className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Category Badge — top left, hover only */}
        <div className={`absolute top-3 left-3 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r ${catColor} text-white shadow-lg`}>
            {hook.category}
          </span>
        </div>

        {/* Price — bottom left, always for products */}
        {price && (
          <div className={`absolute bottom-3 left-3 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500 text-white text-sm font-bold shadow-lg">
              {hook.currency === 'INR' ? '₹' : hook.currency === 'EUR' ? '€' : hook.currency === 'GBP' ? '£' : hook.currency === 'JPY' ? '¥' : hook.currency === 'AUD' ? 'A$' : hook.currency === 'CAD' ? 'C$' : '$'}{price}
            </span>
          </div>
        )}

        {/* Bottom info on hover */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">{(hook.creator_name || hook.creator || hook.creator_username || 'A')[0]}</span>
              </div>
              <span className="text-white/80 text-xs">@{hook.creator_name || hook.creator || hook.creator_username || 'anonymous'}</span>
            </div>
            <div className="flex items-center gap-2 text-white/70 text-xs">
              <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {viewCount}</span>
              <span className="flex items-center gap-1"><MousePointerClick className="w-3 h-3" /> {clickCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Title below image */}
      <div className="pt-2.5 pb-1">
        <h3 className="font-semibold text-neutral-900 text-sm leading-tight group-hover:text-purple-700 transition-colors line-clamp-2">
          {hook.title || hook.name}
        </h3>
        {/* Search terms chips */}
        {hook.searchTerms && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {hook.searchTerms.slice(0, 2).map((term: string, j: number) => (
              <span key={j} className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-600 text-[10px] font-medium border border-purple-100">
                {term}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// CATEGORY PILL COMPONENT
// ============================================
function CategoryPill({
  category,
  isActive,
  onClick,
  count,
}: {
  category: any
  isActive: boolean
  onClick: () => void
  count?: number
}) {
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

      <span>{category.name}</span>

      {count !== undefined && (
        <span
          className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
            isActive
              ? 'bg-white/20'
              : 'bg-neutral-100 text-neutral-500'
          }`}
        >
          {count}
        </span>
      )}

      {/* SEO Link */}
      <Link
        href={`/category/${category.slug}`}
        onClick={(e) => e.stopPropagation()}
        className={`ml-1 transition-opacity hover:opacity-70 ${
          isActive ? 'text-white' : 'text-purple-600'
        }`}
        title={`View ${category.name} page`}
      >
        <ArrowUpRight className="w-3 h-3" />
      </Link>
    </button>
  )
}

// ============================================
// FEATURED CARD (Netflix-style)
// ============================================
function FeaturedCard({ hook }: { hook: any }) {
  const hookType = hook.type || 'link'
  const price = hook.price || hook.product_price
  const cfg = HOOK_TYPE_CONFIG[hookType] || HOOK_TYPE_CONFIG.link
  const TypeIcon = cfg.icon

  return (
    <Link href={hook.slug ? `/hook/${hook.slug}` : '#'} className="block flex-shrink-0">
      <div className="group relative rounded-2xl overflow-hidden bg-neutral-100 aspect-[4/3] cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 w-[300px] sm:w-[360px] md:w-[420px]">
        <img
          src={hook.images?.[0] || hook.image_url || hook.src || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop'}
          alt={hook.title || hook.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Featured Badge */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-bold shadow-lg">
            Featured
          </span>
        </div>

        {/* Type Icon */}
        <div className="absolute top-4 right-4">
          <div className={`p-2 ${cfg.color}/90 backdrop-blur-sm rounded-full shadow-lg`}>
            <TypeIcon className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Price */}
        {price && (
          <div className="absolute bottom-4 right-4">
            <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-sm font-bold shadow-lg">
              ${price}
            </span>
          </div>
        )}

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm`}>
              <TypeIcon className="w-3 h-3" />
              {cfg.label}
            </span>
          </div>
          <h3 className="text-white font-bold text-lg mb-1 line-clamp-1">{hook.title || hook.name}</h3>
          <p className="text-white/60 text-sm mb-3 line-clamp-2">{hook.description || ''}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="text-white text-xs font-bold">{(hook.creator_name || hook.creator || hook.creator_username || 'A')[0]}</span>
              </div>
              <span className="text-white/80 text-sm">@{hook.creator_name || hook.creator || hook.creator_username || 'anonymous'}</span>
            </div>
            <div className="flex items-center gap-3 text-white/60 text-xs">
              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {hook.views || hook.view_count || 0}</span>
              <span className="flex items-center gap-1"><MousePointerClick className="w-3.5 h-3.5" /> {hook.clicks || hook.click_count || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

// ============================================
// FEATURED ROW (Netflix-style horizontal scroll)
// ============================================
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
      <div className="flex items-center justify-between mb-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">{title}</h2>
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => scroll('left')}
          className={`absolute left-2 sm:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
            canScrollLeft ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <ChevronLeft className="w-5 h-5 text-neutral-700" />
        </button>

        <button
          onClick={() => scroll('right')}
          className={`absolute right-2 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
            canScrollRight ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <ChevronRight className="w-5 h-5 text-neutral-700" />
        </button>

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

// ============================================
// MAIN EXPLORE CONTENT
// ============================================
function ExploreContent() {
  const [categories, setCategories] = useState<any[]>([])
  const [hooks, setHooks] = useState<any[]>([])
  const [filteredHooks, setFilteredHooks] = useState<any[]>([])
  const [featuredHooks, setFeaturedHooks] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const [shuffledDemo, setShuffledDemo] = useState<any[]>([])
  const [viewMode, setViewMode] = useState<'masonry' | 'grid'>('masonry')

  const supabase = createClient()

  useEffect(() => {
    setIsVisible(true)
    setShuffledDemo(shuffleArray(DEMO_HOOKS))
    fetchCategories()
    fetchHooks()
  }, [])

  useEffect(() => {
    if (hooks.length > 0) setHooks(prev => shuffleArray(prev))
  }, [hooks.length])

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name')
    setCategories(data || [])
  }

  const fetchHooks = async () => {
    setLoading(true)
    const { data: featured } = await supabase
      .from('hooks').select('*').eq('is_published', true).eq('is_featured', true)
      .order('created_at', { ascending: false }).limit(10)
    setFeaturedHooks(shuffleArray(featured || []))

    const { data } = await supabase
      .from('hooks').select('*').eq('is_published', true)
      .order('created_at', { ascending: false }).limit(50)
    const shuffled = shuffleArray(data || [])
    setHooks(shuffled)
    setFilteredHooks(shuffled)
    setLoading(false)
  }

  const handleShuffle = useCallback(() => {
    if (hooks.length > 0) {
      const s = shuffleArray(hooks)
      setHooks(s)
      setFilteredHooks(s)
    } else {
      setShuffledDemo(shuffleArray(DEMO_HOOKS))
    }
  }, [hooks])

  useEffect(() => {
    let filtered = hooks
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(h => h.category_slug === selectedCategory || h.category?.toLowerCase() === selectedCategory)
    }
    if (selectedType !== 'all') {
      filtered = filtered.filter(h => h.type === selectedType)
    }
    setFilteredHooks(shuffleArray(filtered))
  }, [selectedCategory, selectedType, hooks])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      setFilteredHooks(shuffleArray(hooks))
      return
    }
    const filtered = hooks.filter(h =>
      (h.title || h.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (h.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (h.creator_name || h.creator || h.creator_username || '').toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredHooks(shuffleArray(filtered))
  }

  const clearSearch = () => {
    setSearchQuery('')
    setFilteredHooks(shuffleArray(hooks))
    setSelectedCategory('all')
    setSelectedType('all')
  }

  const getCategoryCount = (slug: string) => hooks.filter(h => h.category_slug === slug || h.category?.toLowerCase() === slug).length

  const getHeadingText = () => {
    if (selectedCategory === 'all' && selectedType === 'all') return 'Discover Hooks'
    if (selectedType !== 'all') {
      const labels: Record<string, string> = { link: 'Link', blog: 'Blog', product: 'Product' }
      return `${labels[selectedType]} Hooks`
    }
    return categories.find(c => c.slug === selectedCategory)?.name || 'Hooks'
  }

  const displayHooks = hooks.length > 0 ? filteredHooks : shuffledDemo.filter(h => {
    const catMatch = selectedCategory === 'all' ? true : h.category.toLowerCase() === selectedCategory
    const typeMatch = selectedType === 'all' ? true : h.type === selectedType
    return catMatch && typeMatch
  })

  const displayFeatured = featuredHooks.length > 0 ? featuredHooks : shuffledDemo.slice(0, 8)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-24 pb-8 lg:pt-32 lg:pb-12 overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Badge className="mb-4 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-0 px-4 py-1.5 text-sm font-medium">
              <Compass className="w-3 h-3 mr-1" />
              Search Discovery Engine
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight mb-4">
              Explore{' '}
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 bg-clip-text text-transparent">
                Every Hook
              </span>
            </h1>

            <p className="text-xl text-neutral-500 mb-8 max-w-2xl mx-auto">
              Search, discover, and find exactly what you are looking for. 
              Every Hook is a searchable page designed to be found.
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

            {/* Type Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {FILTER_TABS.map((tab) => {
                const Icon = tab.icon
                const isActive = selectedType === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedType(tab.id)}
                    className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      isActive 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md shadow-purple-200' 
                        : 'bg-white text-neutral-600 border border-neutral-200 hover:border-purple-300 hover:text-purple-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="absolute top-20 left-0 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-200/20 rounded-full blur-3xl -z-10" />
      </section>

      {/* Featured Hooks - Netflix Style */}
      {selectedCategory === 'all' && selectedType === 'all' && !searchQuery && (
        <section className="py-8">
          <FeaturedRow hooks={displayFeatured} title="Featured Hooks" />
        </section>
      )}

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">{getHeadingText()}</h2>
              <p className="text-neutral-500 text-sm mt-1">
                {displayHooks.length} {displayHooks.length === 1 ? 'Hook' : 'Hooks'} found
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="hidden sm:flex items-center bg-neutral-100 rounded-full p-1">
                <button onClick={() => setViewMode('masonry')} className={`p-2 rounded-full transition-all ${viewMode === 'masonry' ? 'bg-white shadow-sm text-purple-600' : 'text-neutral-400 hover:text-neutral-600'}`}>
                  <LayoutList className="w-4 h-4" />
                </button>
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-full transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-purple-600' : 'text-neutral-400 hover:text-neutral-600'}`}>
                  <Grid3X3 className="w-4 h-4" />
                </button>
              </div>
              {/* Shuffle */}
              <button onClick={handleShuffle} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-white text-neutral-600 border border-neutral-200 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200 shadow-sm">
                <Shuffle className="w-4 h-4" />
                Shuffle
              </button>
              {hooks.length === 0 && (
                <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">Demo Content</Badge>
              )}
            </div>
          </div>

          {loading && hooks.length === 0 ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
            </div>
          ) : displayHooks.length > 0 ? (
            <div className={viewMode === 'masonry' ? 'columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4' : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'}>
              {displayHooks.map((hook, i) => (
                <Link key={hook.id || i} href={hook.slug ? `/hook/${hook.slug}` : '#'}>
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
              <p className="text-neutral-500 mb-6">Try a different filter or search term</p>
              <Button onClick={clearSearch} variant="outline" className="rounded-full gap-2">
                <X className="w-4 h-4" /> Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-10 md:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

            <h2 className="text-3xl md:text-4xl font-bold mb-4 relative z-10">
              Can't find what you're looking for?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto relative z-10">
              Create your own Hook and share it with the world. No signup needed.
            </p>
            <Link href="/hook/new" className="relative z-10 inline-block">
              <Button size="lg" className="bg-white text-purple-700 hover:bg-white/90 rounded-full h-14 px-10 text-lg gap-2 shadow-xl">
                <Zap className="w-5 h-5" />
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
        <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
      </div>
    }>
      <ExploreContent />
    </Suspense>
  )
}