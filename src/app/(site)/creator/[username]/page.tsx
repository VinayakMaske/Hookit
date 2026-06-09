// src/app/(site)/creator/[username]/page.tsx
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
  Globe,
  Link2,
  MapPin,
  Calendar,
  TrendingUp,
  Grid3X3,
  FileText,
  DollarSign,
  Loader2,
  Copy,
  CheckCircle2,
  Mail
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
const HOOK_TYPE_CONFIG: Record<string, { icon: React.ElementType; label: string; color: string; bgColor: string; textColor: string }> = {
  link: { icon: ExternalLink, label: 'Link', color: 'bg-blue-500', bgColor: 'bg-blue-50', textColor: 'text-blue-700' },
  blog: { icon: BookOpen, label: 'Blog', color: 'bg-purple-500', bgColor: 'bg-purple-50', textColor: 'text-purple-700' },
  product: { icon: ShoppingBag, label: 'Product', color: 'bg-emerald-500', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700' },
}

// ============================================
// DEMO CREATOR DATA
// ============================================
const DEMO_CREATOR = {
  username: 'mayaarts',
  display_name: 'Maya Arts',
  bio: 'Visual artist exploring the intersection of color, emotion, and digital expression. Creating hooks that inspire.',
  location: 'Pune, India',
  website: 'https://mayaarts.design',
  joined_at: '2026-01-15T00:00:00Z',
  total_hooks: 24,
  total_views: 45231,
  total_clicks: 12890,
  verified: true,
}

// ============================================
// DEMO HOOKS
// ============================================
const DEMO_HOOKS = [
  { id: 'h1', type: 'blog', src: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=500&fit=crop', title: 'The Future of Abstract Art', creator: 'mayaarts', category: 'Art', views: 891, clicks: 445, created_at: '2026-06-01T00:00:00Z' },
  { id: 'h2', type: 'product', src: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=400&h=540&fit=crop', title: 'Colorful Art Prints Set', creator: 'mayaarts', category: 'Art', price: 59, views: 556, clicks: 234, created_at: '2026-05-28T00:00:00Z' },
  { id: 'h3', type: 'link', src: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=580&fit=crop', title: 'Modern Art Movements', creator: 'mayaarts', category: 'Art', views: 334, clicks: 178, created_at: '2026-05-20T00:00:00Z' },
  { id: 'h4', type: 'blog', src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=490&fit=crop', title: 'Mountain Lake Photography', creator: 'mayaarts', category: 'Travel', views: 1567, clicks: 789, created_at: '2026-05-15T00:00:00Z' },
  { id: 'h5', type: 'product', src: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=510&fit=crop', title: 'Vintage Polaroid Camera', creator: 'mayaarts', category: 'Products', price: 129, views: 223, clicks: 98, created_at: '2026-05-10T00:00:00Z' },
  { id: 'h6', type: 'link', src: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=480&fit=crop', title: 'Book Design Principles', creator: 'mayaarts', category: 'Art', views: 567, clicks: 298, created_at: '2026-05-05T00:00:00Z' },
  { id: 'h7', type: 'blog', src: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=560&fit=crop', title: 'Healthy Eating Guide', creator: 'mayaarts', category: 'Food', views: 876, clicks: 456, created_at: '2026-04-28T00:00:00Z' },
  { id: 'h8', type: 'product', src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=530&fit=crop', title: 'Designer Fashion Pieces', creator: 'mayaarts', category: 'Fashion', price: 299, views: 987, clicks: 456, created_at: '2026-04-20T00:00:00Z' },
  { id: 'h9', type: 'link', src: 'https://images.unsplash.com/photo-1470071459604-3b98c0f71b9d?w=400&h=470&fit=crop', title: 'Nature Photography Book', creator: 'mayaarts', category: 'Travel', views: 1123, clicks: 678, created_at: '2026-04-15T00:00:00Z' },
  { id: 'h10', type: 'blog', src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=500&fit=crop', title: 'Event Photography Tips', creator: 'mayaarts', category: 'Photography', views: 445, clicks: 234, created_at: '2026-04-10T00:00:00Z' },
  { id: 'h11', type: 'product', src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=510&fit=crop', title: 'Portrait Photography Course', creator: 'mayaarts', category: 'Photography', price: 79, views: 678, clicks: 345, created_at: '2026-04-05T00:00:00Z' },
  { id: 'h12', type: 'link', src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=520&fit=crop', title: 'Fashion Week Highlights', creator: 'mayaarts', category: 'Fashion', views: 2345, clicks: 890, created_at: '2026-03-28T00:00:00Z' },
]

// ============================================
// SHUFFLE
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
// FORMAT NUMBERS
// ============================================
function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

// ============================================
// TIME AGO
// ============================================
function timeAgo(dateStr: string): string {
  const seconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000)
  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

// ============================================
// HOOK CARD
// ============================================
function HookCard({ hook }: { hook: any }) {
  const [isHovered, setIsHovered] = useState(false)
  const hookType = hook.type || 'link'
  const price = hook.price || hook.product_price
  const viewCount = hook.views || hook.view_count || 0
  const clickCount = hook.clicks || hook.click_count || 0
  const typeConfig = HOOK_TYPE_CONFIG[hookType]
  const TypeIcon = typeConfig.icon

  const imageUrl = hook.src || hook.images?.[0] || hook.image_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=500&fit=crop'

  return (
    <Link href={`/hook/${hook.slug}`} className="block break-inside-avoid mb-4">
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
            <div className={`p-1.5 ${typeConfig.color} backdrop-blur-sm rounded-full shadow-lg`}>
              <TypeIcon className="w-3 h-3 text-white" />
            </div>
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
          <h3 className="font-semibold text-neutral-900 text-sm mb-1 line-clamp-2 leading-tight group-hover:text-purple-600 transition-colors">{hook.title}</h3>
          <div className="flex items-center justify-between">
            <span className="text-neutral-400 text-[10px] flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timeAgo(hook.created_at)}
            </span>
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
        <div className={`absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent transition-opacity duration-300 pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${typeConfig.bgColor} ${typeConfig.textColor}`}>
              <TypeIcon className="w-3 h-3" />
              {typeConfig.label}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

// ============================================
// STAT CARD
// ============================================
function StatCard({ icon: Icon, label, value, color, delay }: { icon: any; label: string; value: string; color: string; delay: number }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div className={`bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm hover:shadow-md transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className="text-sm text-neutral-500">{label}</span>
      </div>
      <p className="text-2xl font-bold text-neutral-900">{value}</p>
    </div>
  )
}

// ============================================
// MAIN CREATOR PROFILE PAGE
// ============================================
export default function CreatorProfilePage() {
  const params = useParams()
  const router = useRouter()
  const username = params.username as string

  const [creator, setCreator] = useState<any>(null)
  const [hooks, setHooks] = useState<any[]>([])
  const [filteredHooks, setFilteredHooks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const [activeFilter, setActiveFilter] = useState<'all' | 'link' | 'blog' | 'product'>('all')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    fetchCreator()
  }, [username])

      const fetchCreator = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/creator/${username}`)
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Creator not found')
      }
      const data = await res.json()
      setCreator(data.creator)
      const shuffled = shuffleArray(data.hooks || [])
      setHooks(shuffled)
      setFilteredHooks(shuffled)
    } catch (err: any) {
      // NO DEMO FALLBACK - show actual error state
      setCreator(null)
      setHooks([])
      setFilteredHooks([])
      console.error('Creator fetch error:', err.message)
    } finally {
      setLoading(false)
    }
  }

  // Filter hooks
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredHooks(hooks)
    } else {
      setFilteredHooks(hooks.filter(h => h.type === activeFilter))
    }
  }, [activeFilter, hooks])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://hookit.online/creator/${username}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const creatorData = creator 
  const totalHooks = hooks.length
  const totalViews = hooks.reduce((sum, h) => sum + (h.views || h.view_count || 0), 0)
  const totalClicks = hooks.reduce((sum, h) => sum + (h.clicks || h.click_count || 0), 0)
  const linkCount = hooks.filter(h => h.type === 'link').length
  const blogCount = hooks.filter(h => h.type === 'blog').length
  const productCount = hooks.filter(h => h.type === 'product').length

  // Loading
    // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-neutral-500">Loading creator profile...</p>
        </div>
      </div>
    )
  }

  // Not found state
  if (!loading && !creator) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-neutral-400" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Creator not found</h1>
          <p className="text-neutral-500 mb-6">We couldn&apos;t find a creator with the username &quot;@{username}&quot;.</p>
          <Link href="/explore">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full h-12 px-8 gap-2">
              Explore Hooks
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Banner */}
      {/* Hero Banner */}
<div className="relative h-48 sm:h-64 lg:h-80 bg-gradient-to-br from-purple-600 via-pink-500 to-rose-500 overflow-hidden">
  {creatorData.banner_url ? (
    <img src={creatorData.banner_url} alt="" className="w-full h-full object-cover opacity-60" />
  ) : (
    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1920&h=400&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay" />
  )}
  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-transparent" />

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Profile Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`relative -mt-20 sm:-mt-24 mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-purple-100/20 border border-white">
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              {/* Avatar */}
              <div className="relative">
  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 flex items-center justify-center text-white text-4xl sm:text-5xl font-bold shadow-2xl shadow-purple-500/30 border-4 border-white overflow-hidden">
    {creatorData.avatar_url ? (
      <img src={creatorData.avatar_url} alt="" className="w-full h-full object-cover" />
    ) : (
      (creatorData.display_name || creatorData.username || 'A')[0].toUpperCase()
    )}
  </div>
                {creatorData.verified && (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-1">
                      {creatorData.display_name || creatorData.username}
                    </h1>
                    <p className="text-neutral-500 font-medium mb-3">@{creatorData.username}</p>
                    
                    {creatorData.bio && (
                      <p className="text-neutral-600 text-sm leading-relaxed max-w-xl mb-4">
                        {creatorData.bio}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-500">
                      {creatorData.location && (
                        <span className="flex items-center gap-1 bg-neutral-50 px-3 py-1.5 rounded-full border border-neutral-100">
                          <MapPin className="w-3.5 h-3.5 text-purple-400" />
                          {creatorData.location}
                        </span>
                      )}
                      {creatorData.website && (
                        <a 
                          href={creatorData.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 bg-neutral-50 px-3 py-1.5 rounded-full border border-neutral-100 hover:border-purple-200 hover:bg-purple-50 transition-colors"
                        >
                          <Link2 className="w-3.5 h-3.5 text-purple-400" />
                          <span className="text-purple-600 hover:text-purple-700">{creatorData.website.replace(/^https?:\/\//, '')}</span>
                        </a>
                      )}
                      <span className="flex items-center gap-1 bg-neutral-50 px-3 py-1.5 rounded-full border border-neutral-100">
                        <Calendar className="w-3.5 h-3.5 text-purple-400" />
                        Joined {new Date(creatorData.joined_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyLink}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-100 text-neutral-700 text-sm font-medium hover:bg-purple-50 hover:text-purple-700 transition-colors border border-neutral-200"
                    >
                      {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Share Profile'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8">
          <StatCard icon={Grid3X3} label="Total Hooks" value={formatNumber(totalHooks)} color="bg-gradient-to-br from-purple-500 to-pink-500" delay={100} />
          <StatCard icon={Eye} label="Total Views" value={formatNumber(totalViews)} color="bg-gradient-to-br from-blue-500 to-indigo-500" delay={200} />
          <StatCard icon={MousePointerClick} label="Total Clicks" value={formatNumber(totalClicks)} color="bg-gradient-to-br from-emerald-500 to-teal-500" delay={300} />
          <StatCard icon={ExternalLink} label="Links" value={formatNumber(linkCount)} color="bg-gradient-to-br from-sky-500 to-blue-500" delay={400} />
          <StatCard icon={FileText} label="Blogs" value={formatNumber(blogCount)} color="bg-gradient-to-br from-violet-500 to-purple-500" delay={500} />
          <StatCard icon={DollarSign} label="Products" value={formatNumber(productCount)} color="bg-gradient-to-br from-amber-500 to-orange-500" delay={600} />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { key: 'all' as const, label: 'All Hooks', icon: Grid3X3, count: totalHooks },
            { key: 'link' as const, label: 'Links', icon: ExternalLink, count: linkCount },
            { key: 'blog' as const, label: 'Blogs', icon: FileText, count: blogCount },
            { key: 'product' as const, label: 'Products', icon: DollarSign, count: productCount },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeFilter === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md shadow-purple-200'
                    : 'bg-white text-neutral-600 border border-neutral-200 hover:border-purple-300 hover:text-purple-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${isActive ? 'bg-white/20' : 'bg-neutral-100 text-neutral-500'}`}>
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Hooks Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              {activeFilter === 'all' ? 'All Hooks' : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}s`}
            </h2>
            <span className="text-sm text-neutral-500">
              {filteredHooks.length} {filteredHooks.length === 1 ? 'Hook' : 'Hooks'}
            </span>
          </div>

          {filteredHooks.length > 0 ? (
            <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4">
              {filteredHooks.map((hook, i) => (
                <HookCard key={hook.id || i} hook={hook} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-neutral-100">
              <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Grid3X3 className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No hooks yet</h3>
              <p className="text-neutral-500 mb-6">This creator hasn't published any {activeFilter !== 'all' ? activeFilter : ''} hooks yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <section className="py-12 bg-gradient-to-br from-purple-50 to-pink-50 border-t border-neutral-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-3">
            Want to be a creator too?
          </h2>
          <p className="text-neutral-500 mb-6">
            Share your links, blogs, and products. No signup needed.
          </p>
          <Link href="/hook/new">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full h-14 px-10 text-lg gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-105">
              <Sparkles className="w-5 h-5" />
              Create a Hook
            </Button>
          </Link>
        </div>
      </section>

      <style jsx global>{`
        @keyframes float {
          0%, 100% {
  transform: translateY(0px);
  opacity: 0.3;
}

50% {
  transform: translateY(-20px);
  opacity: 0.8;
}
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}