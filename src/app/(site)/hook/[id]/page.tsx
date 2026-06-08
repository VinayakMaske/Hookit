// src/app/(site)/hook/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  ExternalLink,
  BookOpen,
  ShoppingBag,
  Sparkles,
  Eye,
  MousePointerClick,
  Clock,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Globe,
  DollarSign,
  Tag,
  User,
  ArrowUpRight,
  Link2
} from 'lucide-react'

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
  music: 'from-amber-500 to-orange-500',
}

// ============================================
// HOOK TYPE CONFIG
// ============================================
const HOOK_TYPE_CONFIG: Record<string, { icon: React.ElementType; label: string; color: string; bgColor: string; textColor: string; actionText: string }> = {
  link: { icon: ExternalLink, label: 'Link', color: 'bg-blue-500', bgColor: 'bg-blue-50', textColor: 'text-blue-700', actionText: 'Visit Website' },
  blog: { icon: BookOpen, label: 'Blog', color: 'bg-purple-500', bgColor: 'bg-purple-50', textColor: 'text-purple-700', actionText: 'Read Article' },
  product: { icon: ShoppingBag, label: 'Product', color: 'bg-emerald-500', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700', actionText: 'View Product' },
}

// ============================================
// DEMO RELATED HOOKS - Mixed types for visual fill
// ============================================
const DEMO_RELATED = [
  { id: 'r1', type: 'link', src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=500&fit=crop', title: 'Minimal Watch Design', creator: 'alexdesign', category: 'Products', views: 234, clicks: 89 },
  { id: 'r2', type: 'blog', src: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=450&fit=crop', title: 'The Future of Abstract Art', creator: 'mayaarts', category: 'Art', views: 891, clicks: 445 },
  { id: 'r3', type: 'product', src: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=510&fit=crop', title: 'Vintage Polaroid Camera', creator: 'retrovibes', category: 'Products', price: 129, views: 223, clicks: 98 },
  { id: 'r4', type: 'link', src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop', title: 'Portrait Photography Guide', creator: 'sarahclicks', category: 'Photography', views: 567, clicks: 234 },
  { id: 'r5', type: 'blog', src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=480&fit=crop', title: 'Street Fashion Trends 2026', creator: 'styleicon', category: 'Fashion', views: 445, clicks: 234 },
  { id: 'r6', type: 'product', src: 'https://images.unsplash.com/photo-1472120435266-53107fd0c44a?w=400&h=460&fit=crop', title: 'Sunset Photography Prints', creator: 'goldenhour', category: 'Photography', price: 35, views: 789, clicks: 345 },
  { id: 'r7', type: 'link', src: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=550&fit=crop', title: 'Swiss Alps Travel Guide', creator: 'travelbug', category: 'Travel', views: 1234, clicks: 567 },
  { id: 'r8', type: 'blog', src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=470&fit=crop', title: 'Authentic Pizza Recipe', creator: 'chefmike', category: 'Food', views: 890, clicks: 567 },
  { id: 'r9', type: 'product', src: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=400&h=540&fit=crop', title: 'Colorful Art Prints Set', creator: 'artstudio', category: 'Art', price: 59, views: 556, clicks: 234 },
  { id: 'r10', type: 'link', src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=520&fit=crop', title: 'Best Coding Setup 2026', creator: 'devlife', category: 'Technology', views: 678, clicks: 345 },
  { id: 'r11', type: 'blog', src: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=580&fit=crop', title: 'Modern Art Movements', creator: 'galleryx', category: 'Art', views: 334, clicks: 178 },
  { id: 'r12', type: 'product', src: 'https://images.unsplash.com/photo-1511376777868-611b54f68947?w=400&h=440&fit=crop', title: 'Music Production Kit', creator: 'beatmaker', category: 'Music', price: 199, views: 432, clicks: 189 },
  { id: 'r13', type: 'link', src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=500&fit=crop', title: 'Retro Gaming Collection', creator: 'pixelpro', category: 'Gaming', views: 665, clicks: 289 },
  { id: 'r14', type: 'blog', src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=490&fit=crop', title: 'Mountain Lake Photography', creator: 'naturelover', category: 'Travel', views: 1567, clicks: 789 },
  { id: 'r15', type: 'product', src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=480&fit=crop', title: 'Handmade Jewelry Collection', creator: 'shopowner', category: 'Products', price: 45, views: 543, clicks: 267 },
  { id: 'r16', type: 'link', src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=420&fit=crop', title: 'Analytics Dashboard UI', creator: 'techninja', category: 'Technology', views: 312, clicks: 156 },
  { id: 'r17', type: 'blog', src: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=560&fit=crop', title: 'Healthy Eating Guide', creator: 'fitchef', category: 'Food', views: 876, clicks: 456 },
  { id: 'r18', type: 'product', src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=530&fit=crop', title: 'Designer Fashion Pieces', creator: 'fashionweek', category: 'Fashion', price: 299, views: 987, clicks: 456 },
  { id: 'r19', type: 'link', src: 'https://images.unsplash.com/photo-1470071459604-3b98c0f71b9d?w=400&h=470&fit=crop', title: 'Nature Photography Book', creator: 'wanderlust', category: 'Travel', views: 1123, clicks: 678 },
  { id: 'r20', type: 'product', src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=510&fit=crop', title: 'Portrait Photography Course', creator: 'lensmaster', category: 'Photography', price: 79, views: 678, clicks: 345 },
  { id: 'r21', type: 'blog', src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=500&fit=crop', title: 'Event Photography Tips', creator: 'shutterbug', category: 'Photography', views: 445, clicks: 234 },
  { id: 'r22', type: 'link', src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=520&fit=crop', title: 'Fashion Week Highlights', creator: 'runwaydaily', category: 'Fashion', views: 2345, clicks: 890 },
  { id: 'r23', type: 'product', src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=480&fit=crop', title: 'Mountain Hiking Gear', creator: 'trailblazer', category: 'Travel', price: 159, views: 876, clicks: 432 },
  { id: 'r24', type: 'blog', src: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=550&fit=crop', title: 'Book Design Principles', creator: 'typography', category: 'Art', views: 567, clicks: 298 },
]

// ============================================
// SHUFFLE ARRAY
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
// RELATED HOOK CARD
// ============================================
function RelatedCard({ hook }: { hook: any }) {
  const [isHovered, setIsHovered] = useState(false)
  const hookType = hook.type || 'link'
  const price = hook.price || hook.product_price
  const viewCount = hook.views || hook.view_count || 0
  const clickCount = hook.clicks || hook.click_count || 0

  const imageUrl = hook.src || hook.images?.[0] || hook.image_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=500&fit=crop'

  return (
    <Link href={hook.id ? `/hook/${hook.id}` : '#'} className="block break-inside-avoid mb-4">
      <div
        className="group relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          <img
            src={imageUrl}
            alt={hook.title}
            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Type Icon */}
          <div className="absolute top-2 right-2">
            {hookType === 'link' && (
              <div className="p-1.5 bg-blue-500/90 backdrop-blur-sm rounded-full shadow-lg">
                <ExternalLink className="w-3 h-3 text-white" />
              </div>
            )}
            {hookType === 'blog' && (
              <div className="p-1.5 bg-purple-500/90 backdrop-blur-sm rounded-full shadow-lg">
                <BookOpen className="w-3 h-3 text-white" />
              </div>
            )}
            {hookType === 'product' && (
              <div className="p-1.5 bg-emerald-500/90 backdrop-blur-sm rounded-full shadow-lg">
                <ShoppingBag className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          {/* Category Badge */}
          <Badge className={`absolute top-2 left-2 bg-gradient-to-r ${CATEGORY_COLORS[hook.category?.toLowerCase() || 'art']} text-white border-0 text-[10px] backdrop-blur-sm shadow-lg px-2 py-0.5`}>
            {hook.category}
          </Badge>

          {/* Price */}
          {price && (
            <div className="absolute bottom-2 left-2 bg-emerald-500 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-lg">
              ${price}
            </div>
          )}
        </div>

        <div className="p-3">
          <h3 className="font-semibold text-neutral-900 text-sm mb-1 line-clamp-2 leading-tight">{hook.title}</h3>
          <div className="flex items-center justify-between">
            <span className="text-neutral-500 text-xs">@{hook.creator || hook.creator_name || 'anonymous'}</span>
            <div className="flex items-center gap-2 text-neutral-400 text-[10px]">
              <span className="flex items-center gap-0.5">
                <Eye className="w-3 h-3" />
                {viewCount >= 1000 ? `${(viewCount / 1000).toFixed(1)}K` : viewCount}
              </span>
              <span className="flex items-center gap-0.5">
                <MousePointerClick className="w-3 h-3" />
                {clickCount >= 1000 ? `${(clickCount / 1000).toFixed(1)}K` : clickCount}
              </span>
            </div>
          </div>
        </div>

        {/* Hover Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/20 text-white backdrop-blur-sm">
              {hookType === 'link' && <ExternalLink className="w-3 h-3" />}
              {hookType === 'blog' && <BookOpen className="w-3 h-3" />}
              {hookType === 'product' && <ShoppingBag className="w-3 h-3" />}
              {HOOK_TYPE_CONFIG[hookType]?.label}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

// ============================================
// MAIN PAGE
// ============================================
export default function HookDetailPage() {
  const params = useParams()
  const router = useRouter()
  const hookId = params.id as string

  const [hook, setHook] = useState<any>(null)
  const [related, setRelated] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    fetchHook()
  }, [hookId])

  const fetchHook = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/hooks/${hookId}`)
      if (!res.ok) throw new Error('Hook not found')
      const data = await res.json()
      setHook(data.hook)
      // Shuffle related hooks
      setRelated(shuffleArray(data.related || DEMO_RELATED))
    } catch (err: any) {
      setError(err.message)
      // Fallback to demo data with shuffle
      setRelated(shuffleArray(DEMO_RELATED))
    } finally {
      setLoading(false)
    }
  }

  // Track view on mount
  useEffect(() => {
    if (hookId) {
      fetch(`/api/hooks/${hookId}/view`, { method: 'POST' }).catch(() => {})
    }
  }, [hookId])

  const handleClickAction = () => {
    if (!hook) return

    // Track click
    fetch(`/api/hooks/${hookId}/click`, { method: 'POST' }).catch(() => {})

    if (hook.type === 'link' && hook.destination_url) {
      window.open(hook.destination_url, '_blank', 'noopener,noreferrer')
    } else if (hook.type === 'blog') {
      // Scroll to blog content or show full article
      document.getElementById('blog-content')?.scrollIntoView({ behavior: 'smooth' })
    } else if (hook.type === 'product' && hook.product_details?.external_store_url) {
      window.open(hook.product_details.external_store_url, '_blank', 'noopener,noreferrer')
    }
  }

  const timeAgo = (dateStr: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000)
    if (seconds < 60) return 'Just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 30) return `${days}d ago`
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-neutral-500">Loading Hook...</p>
        </div>
      </div>
    )
  }

  // Error State
  if (error || !hook) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-neutral-400" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Hook not found</h1>
          <p className="text-neutral-500 mb-6">This Hook may have been removed or the link is incorrect.</p>
          <Link href="/explore">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full px-8">
              Explore Hooks
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const hookType = hook.type || 'link'
  const typeConfig = HOOK_TYPE_CONFIG[hookType]
  const TypeIcon = typeConfig.icon
  const images = hook.images?.length ? hook.images : hook.image_url ? [hook.image_url] : []
  const currentImage = images[currentImageIndex] || ''
  const price = hook.product_price || hook.price

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Sticky Back Button */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-4">
          <Link href="/explore" className="flex items-center gap-2 text-neutral-600 hover:text-purple-600 transition-colors group">
            <div className="w-8 h-8 rounded-full bg-neutral-100 group-hover:bg-purple-100 flex items-center justify-center transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium hidden sm:inline">Back to Explore</span>
          </Link>
          <div className="flex-1" />
          <Badge className={`bg-gradient-to-r ${CATEGORY_COLORS[hook.category_slug || hook.category?.toLowerCase() || 'art']} text-white border-0 shadow-sm`}>
            {hook.category}
          </Badge>
        </div>
      </div>

      {/* MAIN DETAIL SECTION - Medium Size, Centered */}
      <section className={`py-8 lg:py-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl shadow-purple-100/20 overflow-hidden border border-neutral-100">
            
            {/* Top: Image + Details Side by Side on Desktop */}
            <div className="grid lg:grid-cols-[1fr_420px]">
              
              {/* LEFT: Image Gallery */}
              <div className="relative bg-neutral-100">
                <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full">
                  <img
                    src={currentImage}
                    alt={hook.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Image Navigation */}
                  {images.length > 1 && (
                    <>
                      <button 
                        onClick={() => setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:scale-110 transition-all z-10"
                      >
                        <ChevronLeft className="w-5 h-5 text-neutral-700" />
                      </button>
                      <button 
                        onClick={() => setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:scale-110 transition-all z-10"
                      >
                        <ChevronRight className="w-5 h-5 text-neutral-700" />
                      </button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full z-10">
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    </>
                  )}

                  {/* Type Badge on Image */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white ${typeConfig.color} shadow-lg backdrop-blur-sm`}>
                      <TypeIcon className="w-3.5 h-3.5" />
                      {typeConfig.label}
                    </div>
                  </div>
                </div>

                {/* Thumbnail Strip */}
                {images.length > 1 && (
                  <div className="flex gap-2 p-3 overflow-x-auto bg-white border-t border-neutral-100">
                    {images.map((img: string, i: number) => (
                      <button 
                        key={i} 
                        onClick={() => setCurrentImageIndex(i)}
                        className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden transition-all ${i === currentImageIndex ? 'ring-2 ring-purple-500 ring-offset-2' : 'opacity-60 hover:opacity-100'}`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* RIGHT: Details Panel */}
              <div className="p-6 lg:p-8 flex flex-col">
                {/* Creator */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {(hook.creator_name || hook.creator || 'A')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-neutral-900">@{hook.creator_name || hook.creator || 'anonymous'}</p>
                    <p className="text-xs text-neutral-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {timeAgo(hook.created_at)}
                    </p>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900 leading-tight mb-3">
                  {hook.title}
                </h1>

                {/* Description */}
                {hook.description && (
                  <p className="text-sm text-neutral-600 leading-relaxed mb-4 line-clamp-4">
                    {hook.description}
                  </p>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 mb-5 py-3 border-y border-neutral-100">
                  <div className="flex items-center gap-1.5 text-sm text-neutral-500">
                    <Eye className="w-4 h-4 text-purple-400" />
                    <span className="font-semibold text-neutral-700">{(hook.views || hook.view_count || 0).toLocaleString()}</span>
                    <span>views</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-neutral-500">
                    <MousePointerClick className="w-4 h-4 text-blue-400" />
                    <span className="font-semibold text-neutral-700">{(hook.clicks || hook.click_count || 0).toLocaleString()}</span>
                    <span>clicks</span>
                  </div>
                </div>

                {/* Tags */}
                {hook.tags && hook.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {hook.tags.map((tag: string) => (
                      <Link key={tag} href={`/explore?tag=${tag}`}>
                        <span className="text-xs text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full hover:bg-purple-100 transition-colors border border-purple-100">
                          #{tag}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Type-Specific Info */}
                <div className="space-y-3 mb-6">
                  {hookType === 'link' && hook.destination_url && (
                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
                      <Globe className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-blue-700 truncate flex-1">{hook.destination_url}</span>
                    </div>
                  )}

                  {hookType === 'blog' && (
                    <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-xl border border-purple-100">
                      <BookOpen className="w-4 h-4 text-purple-500" />
                      <span className="text-sm text-purple-700">Full article available on Hookit</span>
                    </div>
                  )}

                  {hookType === 'product' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                        <DollarSign className="w-4 h-4 text-emerald-500" />
                        <span className="text-lg font-bold text-emerald-700">${hook.product_price || price}</span>
                        <span className="text-xs text-emerald-500 ml-1">USD</span>
                      </div>
                      {hook.product_details?.external_store_url && (
                        <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                          <Link2 className="w-4 h-4 text-neutral-500" />
                          <span className="text-sm text-neutral-600 truncate flex-1">{hook.product_details.external_store_url}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <div className="mt-auto">
                  <Button 
                    onClick={handleClickAction}
                    className={`w-full h-14 rounded-2xl text-base font-semibold gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] ${
                      hookType === 'link' ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600' :
                      hookType === 'blog' ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' :
                      'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'
                    } text-white`}
                  >
                    {hookType === 'link' && <ExternalLink className="w-5 h-5" />}
                    {hookType === 'blog' && <BookOpen className="w-5 h-5" />}
                    {hookType === 'product' && <ShoppingBag className="w-5 h-5" />}
                    {typeConfig.actionText}
                    <ArrowUpRight className="w-5 h-5" />
                  </Button>
                  <p className="text-center text-xs text-neutral-400 mt-2">
                    {hookType === 'link' && 'You will be redirected to an external website'}
                    {hookType === 'blog' && 'Read the full article on Hookit'}
                    {hookType === 'product' && 'View product details or visit store'}
                  </p>
                </div>
              </div>
            </div>

            {/* Blog Content Section (if blog type) */}
            {hookType === 'blog' && hook.blog_content && (
              <div id="blog-content" className="border-t border-neutral-100 p-6 lg:p-8 bg-neutral-50/50">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-purple-500" />
                  <h2 className="text-lg font-bold text-neutral-900">Full Article</h2>
                </div>
                <div className="prose prose-neutral max-w-none">
                  <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">
                    {hook.blog_content}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* RELATED HOOKS - FILLS THE ENTIRE PAGE BELOW */}
      <section className="py-8 lg:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <h2 className="text-xl lg:text-2xl font-bold text-neutral-900">More to Explore</h2>
            </div>
            <div className="flex items-center gap-1 text-sm text-neutral-500">
              <span>{related.length} Hooks</span>
            </div>
          </div>

          {/* Masonry Grid - Fills the Page */}
          <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-4">
            {related.map((item, i) => (
              <RelatedCard key={item.id || i} hook={item} />
            ))}
          </div>

          {/* Load More / End of Feed */}
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-100 text-neutral-500 text-sm">
              <Sparkles className="w-4 h-4" />
              That's all for now
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-3">
            Want to share your own?
          </h2>
          <p className="text-neutral-500 mb-6">
            Create a Hook in seconds. No signup needed.
          </p>
          <Link href="/hook/new">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full h-14 px-10 text-lg gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-105">
              <Sparkles className="w-5 h-5" />
              Create a Hook
              <ArrowUpRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}