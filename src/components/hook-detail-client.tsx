// src/app/(site)/hook/[id]/page.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
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
  Link2,
  X,
  Share2,
  MessageCircle,
  Send,
  Copy,
  Check
} from 'lucide-react'


const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
)

const FbIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

const MessengerIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.744 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.975 12-11.111C24 4.975 18.627 0 12 0zm1.193 14.963l-3.056-3.26-5.963 3.26 6.559-6.963 3.13 3.26 5.889-3.26-6.559 6.963z"/>
  </svg>
)

const CopyLinkIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
)

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
// SHARE POPUP COMPONENT
// ============================================
function SharePopup({ hook, onClose }: { hook: any; onClose: () => void }) {
  const [copied, setCopied] = useState(false)
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/hook/${hook.slug}` : ''
  const shareText = `Check out this hook: ${hook.title}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback
      const textArea = document.createElement('textarea')
      textArea.value = shareUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shareOptions = [
  {
    name: 'Copy link',
    icon: CopyLinkIcon,
    color: 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700',
    action: handleCopy
  },
  {
    name: 'WhatsApp',
    icon: WhatsAppIcon,
    color: 'bg-green-500 hover:bg-green-600 text-white',
    action: () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank')
  },
  {
    name: 'Messenger',
    icon: MessengerIcon,
    color: 'bg-gradient-to-br from-purple-500 to-pink-500 hover:opacity-90 text-white',
    action: () => window.open(`https://www.facebook.com/dialog/send?link=${encodeURIComponent(shareUrl)}`, '_blank')
  },
  {
    name: 'Facebook',
    icon: FbIcon,
    color: 'bg-blue-600 hover:bg-blue-700 text-white',
    action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')
  },
  {
    name: 'X',
    icon: XIcon,
    color: 'bg-black hover:bg-neutral-800 text-white',
    action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank')
  },
]

  return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl p-5 w-80 max-w-[320px] mx-4 animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
                <div className="text-center mb-6">
          <h3 className="text-base font-semibold text-neutral-900">Share</h3>
        </div>

          <div className="grid grid-cols-4 gap-2">
          {shareOptions.map((option) => (
            <button
              key={option.name}
              onClick={option.action}
              className="flex flex-col items-center gap-2 group"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${option.color}`}>
                <option.icon className="w-6 h-6" />
              </div>
              <span className="text-[11px] text-neutral-600 font-medium mt-1">{option.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================
// RELATED HOOK CARD
// ============================================
function RelatedCard({ hook }: { hook: any }) {
  const [isHovered, setIsHovered] = useState(false)
  const hookType = hook.type || 'link'
  const price = hook.price || hook.product_price

  const imageUrl = hook.src || hook.images?.[0] || hook.image_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=500&fit=crop'

  return (
    <Link href={hook.id ? `/hook/${hook.slug}` : '#'} className="block break-inside-avoid mb-4">
      <div
        className="group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
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
  <div className={`absolute bottom-3 left-3 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0 md:opacity-0 md:group-hover:opacity-100'}`}>
    {hook.currency === 'INR' ? '₹' : hook.currency === 'EUR' ? '€' : hook.currency === 'GBP' ? '£' : hook.currency === 'JPY' ? '¥' : hook.currency === 'AUD' ? 'A$' : hook.currency === 'CAD' ? 'C$' : '$'}{price}
  </div>
)}
        </div>

        {/* Card Info - Title only */}
<div className="pt-2 pb-1">
  <h3 className="font-semibold text-neutral-900 text-sm line-clamp-2 leading-tight group-hover:underline decoration-1 underline-offset-2">{hook.title}</h3>
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
export default function HookDetailClient({
    slug,
}: {
  slug: string
}) {
  
  const router = useRouter()


  const [hook, setHook] = useState<any>(null)
  const [related, setRelated] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [showBlogContent, setShowBlogContent] = useState(false)
  const [showSharePopup, setShowSharePopup] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    fetchHook()
  }, [slug])

  const fetchHook = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/hooks/${slug}`)
      if (!res.ok) throw new Error('Hook not found')
      const data = await res.json()
      setHook(data.hook)
      
      // Build related: same category first, then random
      const currentCategory = data.hook?.category
      const allRelated = data.related || []
      
      const sameCategory = allRelated.filter((h: any) => h.category === currentCategory && h.id !== data.hook?.id)
      const otherCategory = allRelated.filter((h: any) => h.category !== currentCategory && h.id !== data.hook?.id)
      
      const combined = [...sameCategory, ...shuffleArray(otherCategory)]
      setRelated(combined)
    } catch (err: any) {
      setError(err.message)
      setRelated(shuffleArray(DEMO_RELATED))
    } finally {
      setLoading(false)
    }
  }

  // Track view on mount
  useEffect(() => {
    if (slug) {
      fetch(`/api/hooks/${slug}/view`, { method: 'POST' }).catch(() => {})
    }
  }, [slug])

  const handleClickAction = () => {
    if (!hook) return

    // Track click
    fetch(`/api/hooks/${slug}/click`, { method: 'POST' }).catch(() => {})

    if (hook.type === 'link' && hook.destination_url) {
      window.open(hook.destination_url, '_blank', 'noopener,noreferrer')
    } else if (hook.type === 'blog') {
      // Toggle blog content inline
      setShowBlogContent(!showBlogContent)
    } else if (hook.type === 'product' && hook.product_details?.external_store_url) {
      window.open(hook.product_details.external_store_url, '_blank', 'noopener,noreferrer')
    }
  }

  // Determine if CTA button should show
  const shouldShowCTA = () => {
    if (!hook) return false
    if (hook.type === 'link') return !!hook.destination_url
    if (hook.type === 'blog') return true // Always show for blog (toggle)
    if (hook.type === 'product') return !!hook.product_details?.external_store_url
    return false
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
      
      {/* MAIN DETAIL SECTION */}
      <section className={`py-8 lg:py-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl shadow-purple-100/20 overflow-hidden border border-neutral-100">
            
            {/* Top: Image + Details Side by Side on Desktop */}
            <div className="grid lg:grid-cols-[1fr_420px]">
              
              {/* LEFT: Image Gallery - Natural Size */}
              <div className="relative bg-neutral-100">
                <div className="relative">
                  <img
                    src={currentImage}
                    alt={hook.title}
                    className="w-full h-auto max-h-[70vh] object-contain"
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

                {hook.category_slug && (
  <div className="absolute top-4 left-28 z-10">
    <Link
      href={`/category/${hook.category_slug}`}
      className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium text-neutral-800 shadow-lg hover:bg-white"
    >
      {hook.category}
    </Link>
  </div>
)}

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
                    <Link
  href={`/creator/${hook.creator_username || hook.creator_name || 'anonymous'}`}
  className="text-neutral-500 text-xs hover:text-purple-600 hover:underline transition-colors"
>
  @{hook.creator_username || hook.creator_name || 'anonymous'}
</Link>
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

                {/* Related Searches */}
{hook.search_queries?.length > 0 && (
  <div className="mb-5">
    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">
      Related Searches
    </p>

    <div className="flex flex-wrap gap-2">
      {hook.search_queries.map((query: string) => (
        <Link
          key={query}
          href={`/search/${query
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')}`}
          className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs hover:bg-blue-100 transition-colors border border-blue-100"
        >
          {query}
        </Link>
      ))}
    </div>
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
                      <span className="text-sm text-purple-700">
                        {showBlogContent ? 'Click to hide article' : 'Full article available on Hookit'}
                      </span>
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

                {/* CTA Buttons */}
                <div className="mt-auto">
                  <div className="flex items-center gap-3">
                    {shouldShowCTA() && (
                      <Button 
                        onClick={handleClickAction}
                        className={`flex-1 h-14 rounded-2xl text-base font-semibold gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] ${
                          hookType === 'link' ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600' :
                          hookType === 'blog' ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' :
                          'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'
                        } text-white`}
                      >
                        {hookType === 'link' && <ExternalLink className="w-5 h-5" />}
                        {hookType === 'blog' && <BookOpen className="w-5 h-5" />}
                        {hookType === 'product' && <ShoppingBag className="w-5 h-5" />}
                        {hookType === 'blog' ? (showBlogContent ? 'Hide Article' : 'Read Article') : typeConfig.actionText}
                        <ArrowUpRight className="w-5 h-5" />
                      </Button>
                    )}

                    {/* Share Button */}
                    <Button
                      onClick={() => setShowSharePopup(true)}
                      variant="outline"
                      className="h-14 w-14 rounded-2xl border-neutral-200 hover:border-purple-300 hover:bg-purple-50 transition-all hover:scale-[1.02] flex-shrink-0"
                    >
                      <Share2 className="w-5 h-5 text-neutral-600" />
                    </Button>
                  </div>
                  <p className="text-center text-xs text-neutral-400 mt-2">
                    {hookType === 'link' && (hook.destination_url ? 'You will be redirected to an external website' : 'No link available for this hook')}
                    {hookType === 'blog' && (showBlogContent ? 'Article expanded below' : 'Click to read the full article')}
                    {hookType === 'product' && (hook.product_details?.external_store_url ? 'View product details or visit store' : 'No store link available')}
                  </p>
                </div>
              </div>
            </div>

            {/* INLINE BLOG CONTENT - appears below image when toggled */}
            {hookType === 'blog' && showBlogContent && hook.blog_content && (
              <div className="border-t border-neutral-100 bg-neutral-50/50">
                <div className="p-6 lg:p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="w-5 h-5 text-purple-500" />
                    <h2 className="text-lg font-bold text-neutral-900">Full Article</h2>
                    <button 
                      onClick={() => setShowBlogContent(false)}
                      className="ml-auto text-xs text-neutral-500 hover:text-purple-600 underline"
                    >
                      Hide
                    </button>
                  </div>
                  <div className="prose prose-neutral max-w-none">
                    <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">
                      {hook.blog_content}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* RELATED HOOKS */}
      <section className="py-8 lg:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {hook.search_queries?.length > 0 && (
  <div className="mb-8">

    <h3 className="text-lg font-bold text-neutral-900 mb-3">
      Explore Related Searches
    </h3>

    <div className="flex flex-wrap gap-2">

      {hook.search_queries.map((query: string) => (
        <Link
          key={query}
          href={`/search/${query
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')}`}
          className="px-4 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-sm transition-colors"
        >
          {query}
        </Link>
      ))}

    </div>

  </div>
)}

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

          {/* Masonry Grid */}
          <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-4">
            {related.map((item, i) => (
              <RelatedCard key={item.id || i} hook={item} />
            ))}
          </div>

          {/* End of Feed */}
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
          <h2 className="text-xl lg:text-3xl font-bold text-neutral-900 mb-3">
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

      {/* Share Popup */}
      {showSharePopup && hook && (
        <SharePopup hook={hook} onClose={() => setShowSharePopup(false)} />
      )}
    </div>
  )
}