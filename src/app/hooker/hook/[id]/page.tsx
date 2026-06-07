// src/app/hooker/hook/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Heart,
  Bookmark,
  Share2,
  ArrowLeft,
  ExternalLink,
  MessageCircle,
  Eye,
  Send,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Loader2,
  X,
  Lock,
  LogIn,
  Link2,
  Clock,
  ShoppingBag,
  Trash2,
  Pencil,
  AlertTriangle
} from 'lucide-react'

// Custom SVG Icons
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.06c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  )
}

// Link icon mapping
const LINK_ICONS: Record<string, React.ElementType> = {
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
  website: ExternalLink,
  store: ShoppingBag,
  know_more: ExternalLink,
}

const LINK_COLORS: Record<string, string> = {
  instagram: 'from-purple-500 to-pink-500',
  youtube: 'from-red-500 to-red-600',
  website: 'from-blue-500 to-indigo-500',
  store: 'from-emerald-500 to-teal-500',
  know_more: 'from-purple-500 to-pink-500',
}

const LINK_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  youtube: 'YouTube',
  website: 'Website',
  store: 'Store',
  know_more: 'Know More',
}

interface Hook {
  id: string
  title: string
  description: string | null
  images: string[] | null
  image_url: string | null
  category: string
  category_slug: string
  tags: string[] | null
  external_links: { label: string; url: string; icon: string }[] | null
  creator_name: string
  creator_email: string
  user_id: string | null
  likes: number
  views: number
  saves: number
  created_at: string
}

interface RelatedHook {
  id: string
  title: string
  images: string[] | null
  image_url: string | null
  creator_name: string
  category: string
  likes: number
  views: number
}

interface Comment {
  id: string
  hook_id: string
  author_name: string
  author_email: string
  content: string
  created_at: string
  user_id: string | null
}

export default function HookDetailPage() {
  const params = useParams()
  const router = useRouter()
  const hookId = params.id as string
  const supabase = createClient()

  const [hook, setHook] = useState<Hook | null>(null)
  const [related, setRelated] = useState<RelatedHook[]>([])
  const [moreFromCreator, setMoreFromCreator] = useState<RelatedHook[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Auth state
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [currentUserName, setCurrentUserName] = useState<string>('')
  const [isOwner, setIsOwner] = useState(false)

  // UI states
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [saveCount, setSaveCount] = useState(0)
  const [showShareToast, setShowShareToast] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [hoveredRelated, setHoveredRelated] = useState<string | null>(null)

  // Image blur state
  const [imageBlurred, setImageBlurred] = useState(false)

  // Login prompt modal
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [loginPromptAction, setLoginPromptAction] = useState('')

  // Delete confirm
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Related hooks in same category (below comments)
  const [categoryRelatedHooks, setCategoryRelatedHooks] = useState<RelatedHook[]>([])

  useEffect(() => {
    fetchHook()
    checkAuthStatus()
  }, [hookId])

  const checkAuthStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setCurrentUser(user)
    if (user) {
      // Fetch user profile name from hooker_profiles or user_metadata
      const { data: profile } = await supabase
        .from('hooker_profiles')
        .select('full_name')
        .eq('user_id', user.id)
        .single()
      
      const name = profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous'
      setCurrentUserName(name)
    }
  }

  const requireAuth = (action: string) => {
    if (!currentUser) {
      setLoginPromptAction(action)
      setShowLoginPrompt(true)
      return false
    }
    return true
  }

  const redirectToLogin = () => {
    setShowLoginPrompt(false)
    router.push('/hooker/login?redirect=' + encodeURIComponent(`/hooker/hook/${hookId}`))
  }

  const fetchHook = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/hooks/${hookId}`)
      if (!res.ok) throw new Error('Hook not found')
      const data = await res.json()
      setHook(data.hook)
      setRelated(data.related)
      setMoreFromCreator(data.moreFromCreator)
      setComments(data.comments)
      setLikeCount(data.hook.likes || 0)
      setSaveCount(data.hook.saves || 0)

      // Check ownership
      const { data: { user } } = await supabase.auth.getUser()
      if (user && data.hook.user_id === user.id) {
        setIsOwner(true)
      }

      // Check if user has liked/saved
      if (user) {
        const { data: likeData } = await supabase
          .from('hook_likes')
          .select('id')
          .eq('hook_id', hookId)
          .eq('user_id', user.id)
          .single()

        const { data: saveData } = await supabase
          .from('hook_saves')
          .select('id')
          .eq('hook_id', hookId)
          .eq('user_id', user.id)
          .single()

        setLiked(!!likeData)
        setSaved(!!saveData)
      }

      // Fetch related hooks in same category (excluding current hook)
      if (data.hook.category || data.hook.category_slug) {
        const { data: catRelated } = await supabase
          .from('hooks')
          .select('id, title, images, image_url, creator_name, category, likes, views')
          .eq('is_published', true)
          .or(`category.eq.${data.hook.category},category_slug.eq.${data.hook.category_slug}`)
          .neq('id', hookId)
          .order('created_at', { ascending: false })
          .limit(8)

        setCategoryRelatedHooks(catRelated || [])
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    if (!requireAuth('like')) return
    if (!hook) return
    const newLiked = !liked
    setLiked(newLiked)
    setLikeCount((prev: number) => newLiked ? prev + 1 : prev - 1)

    if (newLiked) {
      await supabase.from('hook_likes').insert({ hook_id: hookId, user_id: currentUser.id })
    } else {
      await supabase.from('hook_likes').delete().eq('hook_id', hookId).eq('user_id', currentUser.id)
    }
  }

  const handleSave = async () => {
    if (!requireAuth('save')) return
    if (!hook) return
    const newSaved = !saved
    setSaved(newSaved)
    setSaveCount((prev: number) => newSaved ? prev + 1 : prev - 1)

    if (newSaved) {
      await supabase.from('hook_saves').insert({ hook_id: hookId, user_id: currentUser.id })
    } else {
      await supabase.from('hook_saves').delete().eq('hook_id', hookId).eq('user_id', currentUser.id)
    }
  }

  const handleShare = async () => {
    const url = `https://hookit.online/hook/${hookId}`
    try {
      if (navigator.share) {
        await navigator.share({ title: hook?.title, url })
      } else {
        await navigator.clipboard.writeText(url)
        setShowShareToast(true)
        setTimeout(() => setShowShareToast(false), 2000)
      }
    } catch {
      // ignore
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!requireAuth('comment')) return
    if (!commentText.trim() || !hook) return
    setSubmittingComment(true)
    try {
      const res = await fetch(`/api/hooks/${hookId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: commentText.trim(),
          author_name: currentUserName,
          author_email: currentUser?.email || 'anonymous@hookit.online',
          user_id: currentUser?.id,
        }),
      })
      if (res.ok) {
        const newComment = await res.json()
        setComments((prev: Comment[]) => [newComment, ...prev])
        setCommentText('')
      }
    } catch {
      // ignore
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleDelete = async () => {
    if (!isOwner || !hook) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/hooks/${hookId}`, { method: 'DELETE' })
      if (res.ok) {
        router.push('/hooker/explore')
      }
    } catch {
      setDeleting(false)
    }
  }

  // Get know_more link
  const knowMoreLink = hook?.external_links?.find(link => link.icon === 'know_more' || link.label === 'Know More')

  // Handle image click - blur and show know more
  const handleImageClick = () => {
    if (knowMoreLink) {
      setImageBlurred(true)
    }
  }

  // Handle know more click
  const handleKnowMoreClick = () => {
    if (knowMoreLink?.url) {
      window.open(knowMoreLink.url, '_blank', 'noopener,noreferrer')
      setImageBlurred(false)
    }
  }

  const images = hook?.images?.length ? hook.images : hook?.image_url ? [hook.image_url] : []
  const currentImage = images[currentImageIndex] || ''

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // Time ago
  const timeAgo = (dateStr: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000)
    if (seconds < 60) return 'Just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 30) return `${days}d ago`
    return formatDate(dateStr)
  }

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

  if (error || !hook) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-neutral-400" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Hook not found</h1>
          <p className="text-neutral-500 mb-6">This Hook may have been removed or the link is incorrect.</p>
          <Link href="/hooker/explore">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full px-8">
              Explore Hooks
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">Login Required</h3>
            <p className="text-neutral-500 mb-6">
              You need to be logged in to {loginPromptAction}. Join the community to interact with hooks!
            </p>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowLoginPrompt(false)}
                className="flex-1 rounded-full border-neutral-300"
              >
                Cancel
              </Button>
              <Button 
                onClick={redirectToLogin}
                className="flex-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white gap-2"
              >
                <LogIn className="w-4 h-4" />
                Log In
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">Delete Hook?</h3>
            <p className="text-neutral-500 mb-6">
              This action cannot be undone. Your Hook will be permanently removed.
            </p>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 rounded-full border-neutral-300"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 rounded-full bg-red-500 hover:bg-red-600 text-white gap-2"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Share Toast */}
      {showShareToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-4 h-4 text-green-400" />
          <span className="text-sm font-medium">Link copied to clipboard!</span>
        </div>
      )}

      {/* Back Button */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-4">
          <Link href="/hooker/explore" className="flex items-center gap-2 text-neutral-600 hover:text-purple-600 transition-colors group">
            <div className="w-8 h-8 rounded-full bg-neutral-100 group-hover:bg-purple-100 flex items-center justify-center transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium hidden sm:inline">Back to Explore</span>
          </Link>
          <div className="flex-1" />

          {/* Owner Actions */}
          {isOwner && (
            <>
              <Link href={`/hooker/hook/${hookId}/edit`}>
                <button className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-purple-100 flex items-center justify-center transition-colors group">
                  <Pencil className="w-4 h-4 text-neutral-600 group-hover:text-purple-600" />
                </button>
              </Link>
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-red-100 flex items-center justify-center transition-colors group"
              >
                <Trash2 className="w-4 h-4 text-neutral-600 group-hover:text-red-600" />
              </button>
            </>
          )}

          <button onClick={handleShare} className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-purple-100 flex items-center justify-center transition-colors group">
            <Share2 className="w-4 h-4 text-neutral-600 group-hover:text-purple-600" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10">

          {/* LEFT: Image Gallery */}
          <div className="space-y-4">
            {/* Main Image with Blur Overlay */}
            <div 
              className="relative rounded-3xl overflow-hidden bg-neutral-100 group cursor-pointer"
              onClick={handleImageClick}
            >
              <img
                src={currentImage}
                alt={hook.title}
                className={`w-full h-full object-cover transition-all duration-500 ${imageBlurred ? 'blur-xl scale-105' : ''}`}
              />

              {/* Blur Overlay with Know More Button */}
              {imageBlurred && knowMoreLink && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20 animate-in fade-in duration-300">
                  <p className="text-white/80 text-sm mb-4">Want to see more?</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleKnowMoreClick()
                    }}
                    className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Know More
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setImageBlurred(false)
                    }}
                    className="mt-4 text-white/60 hover:text-white text-sm flex items-center gap-1 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Close
                  </button>
                </div>
              )}

              {/* Image Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setCurrentImageIndex((prev: number) => prev === 0 ? images.length - 1 : prev - 1)
                      setImageBlurred(false)
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 z-10"
                  >
                    <ChevronLeft className="w-5 h-5 text-neutral-700" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setCurrentImageIndex((prev: number) => prev === images.length - 1 ? 0 : prev + 1)
                      setImageBlurred(false)
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 z-10"
                  >
                    <ChevronRight className="w-5 h-5 text-neutral-700" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full z-10">
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}

              {/* Category Badge */}
              <Badge className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-neutral-700 border-0 shadow-lg text-xs font-medium z-10">
                {hook.category}
              </Badge>

              {/* Click hint */}
              {!imageBlurred && knowMoreLink && (
                <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  Click to reveal
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentImageIndex(i)
                      setImageBlurred(false)
                    }}
                    className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden transition-all ${
                      i === currentImageIndex 
                        ? 'ring-2 ring-purple-500 ring-offset-2' 
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Details Panel */}
          <div className="space-y-6 lg:pt-4">

            {/* Title & Actions Row */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 leading-tight">
                  {hook.title}
                </h1>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleSave}
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-sm ${
                    saved 
                      ? 'bg-neutral-900 text-white' 
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleLike}
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-sm ${
                    liked 
                      ? 'bg-red-500 text-white' 
                      : 'bg-neutral-100 text-neutral-600 hover:bg-red-50 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-6 text-sm text-neutral-500">
              <div className="flex items-center gap-1.5">
                <Heart className="w-4 h-4" />
                <span className="font-medium text-neutral-700">{likeCount.toLocaleString()}</span>
                <span>likes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Bookmark className="w-4 h-4" />
                <span className="font-medium text-neutral-700">{saveCount.toLocaleString()}</span>
                <span>saves</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                <span className="font-medium text-neutral-700">{(hook.views || 0).toLocaleString()}</span>
                <span>views</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{timeAgo(hook.created_at)}</span>
              </div>
            </div>

            {/* Creator Card */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                {(hook.creator_name || 'A')[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-neutral-900">{hook.creator_name || 'Anonymous'}</p>
                <p className="text-sm text-neutral-500">Creator</p>
              </div>
              {isOwner && (
                <Badge className="bg-purple-100 text-purple-700 border-0">You</Badge>
              )}
            </div>

            {/* Description */}
            {hook.description && (
              <div>
                <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">
                  {hook.description}
                </p>
              </div>
            )}

            {/* Tags */}
            {hook.tags && hook.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {hook.tags.map((tag) => (
                  <Link key={tag} href={`/hooker/explore?tag=${tag}`}>
                    <span className="text-sm text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full border border-purple-100 hover:bg-purple-100 transition-colors">
                      #{tag}
                    </span>
                  </Link>
                ))}
              </div>
            )}

            {/* External Links */}
            {hook.external_links && hook.external_links.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-purple-500" />
                  Links
                </h3>
                <div className="flex flex-wrap gap-2">
                  {hook.external_links.map((link, i) => {
                    const Icon = LINK_ICONS[link.icon] || ExternalLink
                    const color = LINK_COLORS[link.icon] || 'from-neutral-500 to-neutral-600'
                    return (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r ${color} shadow-md hover:shadow-lg transition-shadow`}
                      >
                        <Icon className="w-4 h-4" />
                        {link.label}
                        <ExternalLink className="w-3 h-3 opacity-70" />
                      </a>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleLike}
                className={`flex-1 rounded-full h-12 gap-2 text-base transition-all ${
                  liked
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-neutral-100 hover:bg-red-50 text-neutral-700 hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                {liked ? 'Liked' : 'Like'}
              </Button>
              <Button
                onClick={handleSave}
                className={`flex-1 rounded-full h-12 gap-2 text-base transition-all ${
                  saved
                    ? 'bg-neutral-900 hover:bg-neutral-800 text-white'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
                {saved ? 'Saved' : 'Save'}
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                className="rounded-full h-12 px-6 border-neutral-300 hover:border-purple-300 hover:bg-purple-50 gap-2"
              >
                <Share2 className="w-5 h-5" />
                Share
              </Button>
            </div>

            {/* Comments Section */}
            <div className="border-t border-neutral-100 pt-6 space-y-6">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-purple-500" />
                <h3 className="text-lg font-semibold text-neutral-900">
                  Comments ({comments.length})
                </h3>
              </div>

              {/* Comment Form */}
              {currentUser ? (
                <form onSubmit={handleSubmitComment} className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold shrink-0">
                      {(currentUserName || 'U')[0].toUpperCase()}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-neutral-900">{currentUserName}</p>
                        <p className="text-xs text-neutral-400">Posting as verified user</p>
                      </div>
                      <div className="flex gap-2">
                        <Textarea
                          placeholder="Add a comment..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          className="rounded-xl border-neutral-200 focus:border-purple-300 min-h-[80px] resize-none text-sm"
                          required
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          disabled={submittingComment || !commentText.trim()}
                          className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full h-9 px-6 gap-2 disabled:opacity-40"
                        >
                          {submittingComment ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                          Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="bg-neutral-50 rounded-2xl p-6 text-center border border-neutral-100">
                  <Lock className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
                  <p className="text-neutral-600 font-medium mb-1">Want to join the conversation?</p>
                  <p className="text-neutral-400 text-sm mb-4">Log in to leave a comment</p>
                  <Button 
                    onClick={() => redirectToLogin()}
                    className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    Log In to Comment
                  </Button>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length === 0 && (
                  <div className="text-center py-8 text-neutral-400">
                    <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No comments yet. Be the first!</p>
                  </div>
                )}
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {(comment.author_name || 'A')[0].toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-neutral-900">{comment.author_name}</span>
                        <span className="text-xs text-neutral-400">{timeAgo(comment.created_at)}</span>
                      </div>
                      <p className="text-sm text-neutral-700 leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Hooks Section - Below Comments */}
            {categoryRelatedHooks.length > 0 && (
              <div className="border-t border-neutral-100 pt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                  <h3 className="text-lg font-semibold text-neutral-900">
                    Related Hooks in {hook.category}
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {categoryRelatedHooks.map((item) => (
                    <Link key={item.id} href={`/hooker/hook/${item.id}`}>
                      <div
                        className="group relative rounded-2xl overflow-hidden bg-neutral-100 cursor-pointer"
                        onMouseEnter={() => setHoveredRelated(item.id)}
                        onMouseLeave={() => setHoveredRelated(null)}
                      >
                        <img
                          src={item.image_url || (item.images?.[0]) || ''}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300 ${
                          hoveredRelated === item.id ? 'opacity-100' : 'opacity-0'
                        }`}>
                          <div className="absolute bottom-3 left-3 right-3">
                            <p className="text-white font-medium text-sm line-clamp-2">{item.title}</p>
                            <div className="flex items-center gap-3 mt-1 text-white/80 text-xs">
                              <span className="flex items-center gap-1">
                                <Heart className="w-3 h-3" /> {item.likes || 0}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" /> {item.views || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge className="absolute top-2 left-2 bg-white/90 text-neutral-700 border-0 text-[10px]">
                          {item.category}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="text-center pt-2">
                  <Link href={`/hooker/explore?category=${hook.category_slug || hook.category.toLowerCase()}`}>
                    <Button variant="outline" className="rounded-full gap-2 border-neutral-200 hover:border-purple-300 hover:bg-purple-50 text-sm">
                      View All in {hook.category}
                      <ArrowLeft className="w-3 h-3 rotate-180" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* More From This Creator */}
      {moreFromCreator.length > 0 && (
        <section className="border-t border-neutral-100 bg-neutral-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                {(hook.creator_name || 'A')[0].toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-neutral-900">
                More from {hook.creator_name || 'this creator'}
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {moreFromCreator.map((item) => (
                <Link key={item.id} href={`/hooker/hook/${item.id}`}>
                  <div
                    className="group relative rounded-2xl overflow-hidden bg-neutral-100 cursor-pointer"
                    onMouseEnter={() => setHoveredRelated(item.id)}
                    onMouseLeave={() => setHoveredRelated(null)}
                  >
                    <img
                      src={item.image_url || (item.images?.[0]) || ''}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300 ${
                      hoveredRelated === item.id ? 'opacity-100' : 'opacity-0'
                    }`}>
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-white font-medium text-sm line-clamp-2">{item.title}</p>
                        <div className="flex items-center gap-3 mt-1 text-white/80 text-xs">
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" /> {item.likes || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" /> {item.views || 0}
                          </span>
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

      {/* Related Hooks - Masonry */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            More to explore
          </h2>
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {related.map((item) => (
              <Link key={item.id} href={`/hooker/hook/${item.id}`} className="block break-inside-avoid">
                <div
                  className="group relative rounded-2xl overflow-hidden cursor-pointer"
                  onMouseEnter={() => setHoveredRelated(item.id)}
                  onMouseLeave={() => setHoveredRelated(null)}
                >
                  <img
                    src={item.image_url || (item.images?.[0]) || ''}
                    alt={item.title}
                    className="w-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300 ${
                    hoveredRelated === item.id ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">{item.title}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-white/80 text-xs">{item.creator_name}</span>
                        <div className="flex items-center gap-1 text-white/80 text-xs">
                          <Heart className="w-3 h-3" />
                          {item.likes || 0}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge className="absolute top-3 left-3 bg-white/90 text-neutral-700 border-0 text-xs">
                    {item.category}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}