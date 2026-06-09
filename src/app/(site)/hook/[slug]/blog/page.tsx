// src/app/(site)/hook/[id]/blog/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Eye,
  MousePointerClick,
  Sparkles,
  ArrowUpRight,
  Share2,
  User,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Calendar
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
// DEMO RELATED BLOGS
// ============================================
const DEMO_RELATED_BLOGS = [
  { id: 'b1', type: 'blog', src: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop', title: 'The Future of Abstract Art', creator: 'mayaarts', category: 'Art', views: 891, clicks: 445 },
  { id: 'b2', type: 'blog', src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=300&fit=crop', title: 'Street Fashion Trends 2026', creator: 'styleicon', category: 'Fashion', views: 445, clicks: 234 },
  { id: 'b3', type: 'blog', src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop', title: 'Authentic Pizza Recipe', creator: 'chefmike', category: 'Food', views: 890, clicks: 567 },
  { id: 'b4', type: 'blog', src: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop', title: 'Modern Art Movements', creator: 'galleryx', category: 'Art', views: 334, clicks: 178 },
  { id: 'b5', type: 'blog', src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop', title: 'Mountain Lake Photography', creator: 'naturelover', category: 'Travel', views: 1567, clicks: 789 },
  { id: 'b6', type: 'blog', src: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop', title: 'Healthy Eating Guide', creator: 'fitchef', category: 'Food', views: 876, clicks: 456 },
  { id: 'b7', type: 'blog', src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop', title: 'Event Photography Tips', creator: 'shutterbug', category: 'Photography', views: 445, clicks: 234 },
  { id: 'b8', type: 'blog', src: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop', title: 'Book Design Principles', creator: 'typography', category: 'Art', views: 567, clicks: 298 },
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
// READ TIME ESTIMATOR
// ============================================
function getReadTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}

// ============================================
// RELATED BLOG CARD
// ============================================
function RelatedBlogCard({ blog }: { blog: any }) {
  const [isHovered, setIsHovered] = useState(false)
  const viewCount = blog.views || blog.view_count || 0

  return (
    <Link href={`/hook/${blog.id}/blog`} className="block group">
      <div 
        className="relative rounded-2xl overflow-hidden bg-neutral-100 shadow-sm hover:shadow-xl transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-[16/10]">
          <img
            src={blog.src || blog.images?.[0] || blog.image_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop'}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-3 h-3 text-white" />
                <span className="text-white text-xs">Read Article</span>
              </div>
            </div>
          </div>
          <Badge className={`absolute top-2 left-2 bg-gradient-to-r ${CATEGORY_COLORS[blog.category?.toLowerCase() || 'art']} text-white border-0 text-[10px] shadow-lg`}>
            {blog.category}
          </Badge>
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-neutral-900 text-sm mb-1 line-clamp-2 leading-tight group-hover:text-purple-600 transition-colors">{blog.title}</h3>
          <div className="flex items-center justify-between">
            <span className="text-neutral-500 text-xs">@{blog.creator || blog.creator_name || 'anonymous'}</span>
            <span className="flex items-center gap-1 text-neutral-400 text-[10px]">
              <Eye className="w-3 h-3" />
              {viewCount >= 1000 ? `${(viewCount / 1000).toFixed(1)}K` : viewCount}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

// ============================================
// MAIN BLOG PAGE
// ============================================
export default function BlogArticlePage() {
  const params = useParams()
  const router = useRouter()
  const hookId = params.id as string

  const [hook, setHook] = useState<any>(null)
  const [related, setRelated] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [showShareToast, setShowShareToast] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    fetchBlog()
  }, [hookId])

  // Track view
  useEffect(() => {
    if (hookId) {
      fetch(`/api/hooks/${hookId}/view`, { method: 'POST' }).catch(() => {})
    }
  }, [hookId])

  const fetchBlog = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/hooks/${hookId}`)
      if (!res.ok) throw new Error('Blog not found')
      const data = await res.json()
      
      // Verify it's a blog type
      if (data.hook?.type !== 'blog') {
        // Redirect to main hook page if not a blog
        router.push(`/hook/${hookId}`)
        return
      }
      
      setHook(data.hook)
      setRelated(shuffleArray(data.related?.filter((r: any) => r.type === 'blog') || DEMO_RELATED_BLOGS))
    } catch (err: any) {
      setError(err.message)
      setRelated(shuffleArray(DEMO_RELATED_BLOGS))
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    const url = `https://hookit.online/hook/${hookId}/blog`
    await navigator.clipboard.writeText(url)
    setShowShareToast(true)
    setTimeout(() => setShowShareToast(false), 2000)
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

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-neutral-500">Loading article...</p>
        </div>
      </div>
    )
  }

  // Error
  if (error || !hook) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-neutral-400" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Article not found</h1>
          <p className="text-neutral-500 mb-6">This blog article may have been removed.</p>
          <Link href="/explore">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full px-8">
              Explore Hooks
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const images = hook.images?.length ? hook.images : hook.image_url ? [hook.image_url] : []
  const readTime = getReadTime(hook.blog_content || hook.description || '')
  const viewCount = hook.views || hook.view_count || 0
  const clickCount = hook.clicks || hook.click_count || 0

  return (
    <div className="min-h-screen bg-white">
      {/* Share Toast */}
      {showShareToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <Sparkles className="w-4 h-4 text-green-400" />
          <span className="text-sm font-medium">Link copied to clipboard!</span>
        </div>
      )}

      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-neutral-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
          <Link href={`/hook/${hookId}`} className="flex items-center gap-2 text-neutral-600 hover:text-purple-600 transition-colors group">
            <div className="w-8 h-8 rounded-full bg-neutral-100 group-hover:bg-purple-100 flex items-center justify-center transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium hidden sm:inline">Back to Hook</span>
          </Link>
          <div className="flex-1" />
          <button 
            onClick={handleShare}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-purple-100 flex items-center justify-center transition-colors text-neutral-500 hover:text-purple-600"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div className={`relative w-full max-h-[50vh] overflow-hidden transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white z-10" />
        <img
          src={images[0] || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=600&fit=crop'}
          alt={hook.title}
          className="w-full h-full object-cover max-h-[50vh]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent z-10" />
      </div>

      {/* Article Content */}
      <article className={`max-w-3xl mx-auto px-4 sm:px-6 -mt-20 relative z-20 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Blog Badge */}
        <div className="flex items-center gap-2 mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
            <BookOpen className="w-3.5 h-3.5" />
            Blog Article
          </div>
          <Badge className={`bg-gradient-to-r ${CATEGORY_COLORS[hook.category_slug || hook.category?.toLowerCase() || 'art']} text-white border-0 text-xs`}>
            {hook.category}
          </Badge>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 leading-tight mb-6">
          {hook.title}
        </h1>

        {/* Author + Meta */}
        <div className="flex items-center justify-between py-4 border-y border-neutral-100 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
              {(hook.creator_name || hook.creator || 'A')[0].toUpperCase()}
            </div>
            <div>
              <Link 
  href={`/creator/${hook.creator_username || hook.creator_name || 'anonymous'}`}
  className="font-semibold text-sm text-neutral-900 hover:text-purple-600 transition-colors"
>
  @{hook.creator_name || hook.creator || 'anonymous'}
</Link>
              <p className="text-xs text-neutral-400 flex items-center gap-1">
                <User className="w-3 h-3" />
                Creator on Hookit
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-neutral-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(hook.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {readTime} min read
            </span>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-4 mb-8 text-sm text-neutral-500">
          <span className="flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-purple-400" />
            <span className="font-semibold text-neutral-700">{viewCount.toLocaleString()}</span> views
          </span>
          <span className="flex items-center gap-1.5">
            <MousePointerClick className="w-4 h-4 text-blue-400" />
            <span className="font-semibold text-neutral-700">{clickCount.toLocaleString()}</span> reads
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-400" />
            {timeAgo(hook.created_at)}
          </span>
        </div>

        {/* Blog Content */}
        <div className="prose prose-lg prose-neutral max-w-none mb-12">
          {hook.description && (
            <p className="text-xl text-neutral-600 leading-relaxed mb-8 font-medium italic border-l-4 border-purple-300 pl-4">
              {hook.description}
            </p>
          )}
          
          {hook.blog_content ? (
            <div className="text-neutral-700 leading-relaxed whitespace-pre-wrap text-lg">
              {hook.blog_content}
            </div>
          ) : (
            <p className="text-neutral-500 italic">No content available for this article.</p>
          )}
        </div>

        {/* Tags */}
        {hook.tags && hook.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 py-4 border-t border-neutral-100">
            <span className="text-sm text-neutral-500 mr-2">Tags:</span>
            {hook.tags.map((tag: string) => (
              <Link key={tag} href={`/explore?tag=${tag}`}>
                <span className="text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full hover:bg-purple-100 transition-colors border border-purple-100">
                  #{tag}
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* Creator CTA */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {(hook.creator_name || hook.creator || 'A')[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-bold text-neutral-900">@{hook.creator_name || hook.creator || 'anonymous'}</p>
              <p className="text-sm text-neutral-500">Creator on Hookit</p>
            </div>
            <Link href={`/explore?creator=${hook.creator_email_ref || hook.creator_name}`}>
              <Button className="rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white gap-2">
                <Sparkles className="w-4 h-4" />
                More from this creator
              </Button>
            </Link>
          </div>
        </div>
      </article>

      {/* Related Blog Articles */}
      <section className="py-12 bg-neutral-50 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-500" />
              <h2 className="text-xl lg:text-2xl font-bold text-neutral-900">More Articles to Read</h2>
            </div>
            <Link href="/explore?type=blog">
              <span className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
                View all blogs
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {related.map((blog, i) => (
              <RelatedBlogCard key={blog.id || i} blog={blog} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-3">
            Have something to share?
          </h2>
          <p className="text-neutral-500 mb-6">
            Write your own blog article on Hookit. No signup needed.
          </p>
          <Link href="/hook/new">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full h-14 px-10 text-lg gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-105">
              <Sparkles className="w-5 h-5" />
              Write a Blog
              <ArrowUpRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}