// src/app/hooker/hook/[id]/page.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
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
  AlertTriangle,
  Copy
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

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

function MessengerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.744 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.975 12-11.111C24 4.975 18.627 0 12 0zm1.193 14.963l-3.056-3.26-5.963 3.26 6.559-6.963 3.13 3.26 5.889-3.26-6.559 6.963z"/>
    </svg>
  )
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
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
  user_name: string
  user_email: string
  content: string
  created_at: string
  user_id: string | null
}

export default function HookDetailPage() {
  const params = useParams()
  const router = useRouter()
  const hookId = params.id as string
  const supabase = createClient()
  const commentsScrollRef = useRef<HTMLDivElement>(null)

  const [hook, setHook] = useState<Hook | null>(null)
  const [related, setRelated] = useState<RelatedHook[]>([])
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
  const [imageBlurred, setImageBlurred] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [loginPromptAction, setLoginPromptAction] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showMobileComments, setShowMobileComments] = useState(false)

  useEffect(() => {
    fetchHook()
    checkAuthStatus()
  }, [hookId])

  const checkAuthStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setCurrentUser(user)
    if (user) {
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
      setRelated(data.related || [])
      setComments(data.comments || [])
      setLikeCount(data.hook.likes || 0)
      setSaveCount(data.hook.saves || 0)

      const { data: { user } } = await supabase.auth.getUser()
      if (user && data.hook.user_id === user.id) {
        setIsOwner(true)
      }

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

  const handleShare = () => {
    setShowShareModal(true)
  }

  const shareOptions = [
    { name: 'Copy Link', icon: Copy, color: 'bg-neutral-100 text-neutral-700', action: () => {
      navigator.clipboard.writeText(`https://hookit.online/hook/${hookId}`)
      setShowShareToast(true)
      setTimeout(() => setShowShareToast(false), 2000)
      setShowShareModal(false)
    }},
    { name: 'WhatsApp', icon: WhatsAppIcon, color: 'bg-green-500 text-white', action: () => {
      window.open(`https://wa.me/?text=${encodeURIComponent(`Check out this hook on Hookit: https://hookit.online/hook/${hookId}`)}`, '_blank')
      setShowShareModal(false)
    }},
    { name: 'Instagram', icon: InstagramIcon, color: 'bg-gradient-to-br from-purple-500 to-pink-500 text-white', action: () => {
      navigator.clipboard.writeText(`https://hookit.online/hook/${hookId}`)
      setShowShareToast(true)
      setTimeout(() => setShowShareToast(false), 2000)
      setShowShareModal(false)
    }},
    { name: 'Twitter', icon: TwitterIcon, color: 'bg-sky-500 text-white', action: () => {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this hook on Hookit!`)}&url=${encodeURIComponent(`https://hookit.online/hook/${hookId}`)}`, '_blank')
      setShowShareModal(false)
    }},
    { name: 'Messenger', icon: MessengerIcon, color: 'bg-blue-600 text-white', action: () => {
      window.open(`https://www.facebook.com/dialog/send?link=${encodeURIComponent(`https://hookit.online/hook/${hookId}`)}&app_id=YOUR_APP_ID&redirect_uri=${encodeURIComponent(window.location.href)}`, '_blank')
      setShowShareModal(false)
    }},
  ]

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

  const knowMoreLink = hook?.external_links?.find(link => link.icon === 'know_more' || link.label === 'Know More')

  const handleImageClick = () => {
    if (knowMoreLink) {
      setImageBlurred(true)
    }
  }

  const handleKnowMoreClick = () => {
    if (knowMoreLink?.url) {
      window.open(knowMoreLink.url, '_blank', 'noopener,noreferrer')
      setImageBlurred(false)
    }
  }

  const images = hook?.images?.length ? hook.images : hook?.image_url ? [hook.image_url] : []
  const currentImage = images[currentImageIndex] || ''

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
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
              <Button variant="outline" onClick={() => setShowLoginPrompt(false)} className="flex-1 rounded-full border-neutral-300">
                Cancel
              </Button>
              <Button onClick={redirectToLogin} className="flex-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white gap-2">
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
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} className="flex-1 rounded-full border-neutral-300">
                Cancel
              </Button>
              <Button onClick={handleDelete} disabled={deleting} className="flex-1 rounded-full bg-red-500 hover:bg-red-600 text-white gap-2">
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowShareModal(false)}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-md mx-auto shadow-2xl animate-in slide-in-from-bottom-10 duration-300" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1.5 bg-neutral-200 rounded-full mx-auto mb-6 sm:hidden" />
            <h3 className="text-lg font-bold text-neutral-900 text-center mb-6">Share to</h3>
            <div className="grid grid-cols-5 gap-3 mb-6">
              {shareOptions.map((option) => (
                <button key={option.name} onClick={option.action} className="flex flex-col items-center gap-2 group">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${option.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <option.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-neutral-600 text-center">{option.name}</span>
                </button>
              ))}
            </div>
            <Button variant="outline" onClick={() => setShowShareModal(false)} className="w-full rounded-full border-neutral-300">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Comments Bottom Sheet */}
      {showMobileComments && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:hidden" onClick={() => setShowMobileComments(false)}>
          <div className="bg-white rounded-t-3xl w-full max-h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 duration-300" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-neutral-100">
              <div className="w-8" />
              <h3 className="font-bold text-neutral-900">Comments ({comments.length})</h3>
              <button onClick={() => setShowMobileComments(false)} className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {comments.length === 0 ? (
                <div className="text-center py-8 text-neutral-400">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No comments yet. Be the first!</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-xs shrink-0">
                      {(comment.user_name || 'A')[0].toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-0.5">
                        <span className="font-semibold text-sm text-neutral-900">{comment.user_name}</span>
                        <span className="text-xs text-neutral-400">{timeAgo(comment.created_at)}</span>
                      </div>
                      <p className="text-sm text-neutral-700 leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            {currentUser ? (
              <div className="p-4 border-t border-neutral-100">
                <form onSubmit={handleSubmitComment} className="flex gap-2">
                  <Input
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-1 rounded-full border-neutral-200 h-10 text-sm"
                  />
                  <Button type="submit" disabled={submittingComment || !commentText.trim()} className="rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white h-10 w-10 p-0 disabled:opacity-40">
                    {submittingComment ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </form>
              </div>
            ) : (
              <div className="p-4 border-t border-neutral-100 text-center">
                <Button onClick={() => { setShowMobileComments(false); redirectToLogin() }} className="rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white gap-2">
                  <LogIn className="w-4 h-4" />
                  Log In to Comment
                </Button>
              </div>
            )}
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
              <button onClick={() => setShowDeleteConfirm(true)} className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-red-100 flex items-center justify-center transition-colors group">
                <Trash2 className="w-4 h-4 text-neutral-600 group-hover:text-red-600" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        <div className="grid lg:grid-cols-[1fr_420px] gap-6 lg:gap-10">
          
          {/* LEFT: Image Gallery */}
          <div className="space-y-4">
            <div className="relative rounded-3xl overflow-hidden bg-neutral-100 group cursor-pointer" onClick={handleImageClick}>
              <img
                src={currentImage}
                alt={hook.title}
                className={`w-full h-auto object-cover transition-all duration-500 ${imageBlurred ? 'blur-xl scale-105' : ''}`}
              />

              {imageBlurred && knowMoreLink && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20 animate-in fade-in duration-300">
                  <p className="text-white/80 text-sm mb-4">Want to see more?</p>
                  <button onClick={(e) => { e.stopPropagation(); handleKnowMoreClick() }} className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2">
                    <ExternalLink className="w-5 h-5" />
                    Know More
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setImageBlurred(false) }} className="mt-4 text-white/60 hover:text-white text-sm flex items-center gap-1 transition-colors">
                    <X className="w-4 h-4" />
                    Close
                  </button>
                </div>
              )}

              {images.length > 1 && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev: number) => prev === 0 ? images.length - 1 : prev - 1); setImageBlurred(false) }} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 z-10">
                    <ChevronLeft className="w-5 h-5 text-neutral-700" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev: number) => prev === images.length - 1 ? 0 : prev + 1); setImageBlurred(false) }} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 z-10">
                    <ChevronRight className="w-5 h-5 text-neutral-700" />
                  </button>
                </>
              )}

              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full z-10">
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}

              <Badge className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-neutral-700 border-0 shadow-lg text-xs font-medium z-10">
                {hook.category}
              </Badge>

              {!imageBlurred && knowMoreLink && (
                <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  Click to reveal
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, i) => (
                  <button key={i} onClick={() => { setCurrentImageIndex(i); setImageBlurred(false) }} className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden transition-all ${i === currentImageIndex ? 'ring-2 ring-purple-500 ring-offset-2' : 'opacity-60 hover:opacity-100'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Details Panel - Pinterest Style */}
<div className="space-y-4 lg:pt-2">

  {/* Creator Info - Instagram style, compact */}
  <div className="flex items-center gap-2.5">
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
      {(hook.creator_name || 'A')[0].toUpperCase()}
    </div>
    <div>
      <p className="font-semibold text-m text-neutral-900 leading-tight">{hook.creator_name || 'Anonymous'}</p>
      <p className="text-sm text-neutral-500">Creator</p>
    </div>
    {isOwner && (
      <Badge className="bg-purple-100 text-purple-700 border-0 text-xs ml-auto">You</Badge>
    )}
  </div>

  {/* Title + Action Icons Row */}
  <div className="flex items-start justify-between gap-3">
    <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 leading-tight flex-1">
      {hook.title}
    </h1>
    <div className="flex items-center gap-1 shrink-0 pt-1">
      <button onClick={handleLike} className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${liked ? 'text-red-500' : 'text-neutral-500 hover:text-red-500 hover:bg-red-50'}`}>
        <Heart className={`w-5.5 h-5.5 ${liked ? 'fill-current' : ''}`} />
      </button>
      <button onClick={handleSave} className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${saved ? 'text-neutral-900' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'}`}>
        <Bookmark className={`w-5.5 h-5.5 ${saved ? 'fill-current' : ''}`} />
      </button>
      <button onClick={handleShare} className="w-9 h-9 rounded-full flex items-center justify-center transition-all text-neutral-500 hover:text-purple-600 hover:bg-purple-50">
        <Share2 className="w-5.5 h-5.5" />
      </button>
    </div>
  </div>

  {/* Description */}
  {hook.description && (
    <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">
      {hook.description}
    </p>
  )}

  {/* Tags */}
  {hook.tags && hook.tags.length > 0 && (
    <div className="flex flex-wrap gap-1.5">
      {hook.tags.map((tag) => (
        <Link key={tag} href={`/hooker/explore?tag=${tag}`}>
          <span className="text-m text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full hover:bg-purple-100 transition-colors">
            #{tag}
          </span>
        </Link>
      ))}
    </div>
  )}

  {/* Stats Row - Compact */}
  <div className="flex items-center gap-4 text-m text-neutral-500">
    <span className="flex items-center gap-1">
      <Heart className="w-5.5 h-5.5" />
      <span className="font-medium text-neutral-700">{likeCount.toLocaleString()}</span> likes
    </span>
    <span className="flex items-center gap-1">
      <Bookmark className="w-5.5 h-5.5" />
      <span className="font-medium text-neutral-700">{saveCount.toLocaleString()}</span> saves
    </span>
    <span className="flex items-center gap-1">
      <Eye className="w-5.5 h-5.5" />
      <span className="font-medium text-neutral-700">{(hook.views || 0).toLocaleString()}</span> views
    </span>
    <span className="flex items-center gap-1">
      <Clock className="w-5.5 h-5.5" />
      {timeAgo(hook.created_at)}
    </span>
  </div>

  {/* External Links */}
  {hook.external_links && hook.external_links.length > 0 && (
    <div className="flex flex-wrap gap-2">
      {hook.external_links.map((link, i) => {
        const Icon = LINK_ICONS[link.icon] || ExternalLink
        const color = LINK_COLORS[link.icon] || 'from-neutral-500 to-neutral-600'
        return (
          <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-m font-medium text-white bg-gradient-to-r ${color} shadow-sm hover:shadow-md transition-shadow`}>
            <Icon className="w-5.5 h-5.5" />
          </a>
        )
      })}
    </div>
  )}

  {/* Desktop Comments Section - Instagram style */}
  <div className="hidden sm:block border-t border-neutral-100 pt-4">
    <div className="flex items-center gap-2 mb-3">
      <MessageCircle className="w-4 h-4 text-purple-500" />
      <h3 className="text-sm font-semibold text-neutral-900">Comments ({comments.length})</h3>
    </div>

    {currentUser ? (
      <form onSubmit={handleSubmitComment} className="mb-4">
        <div className="flex gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-xs shrink-0">
            {(currentUserName || 'U')[0].toUpperCase()}
          </div>
          <div className="flex-1 flex gap-2">
            <Input
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 rounded-full border-neutral-200 h-9 text-sm"
            />
            <Button type="submit" disabled={submittingComment || !commentText.trim()} className="rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white h-9 w-9 p-0 disabled:opacity-40">
              {submittingComment ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </form>
    ) : (
      <div className="mb-4 p-3 bg-neutral-50 rounded-xl text-center">
        <p className="text-xs text-neutral-500 mb-2">Log in to comment</p>
        <Button onClick={redirectToLogin} size="sm" className="rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white h-8 text-xs">
          Log In
        </Button>
      </div>
    )}

    <div ref={commentsScrollRef} className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
      {comments.length === 0 && (
        <div className="text-center py-6 text-neutral-400">
          <MessageCircle className="w-6 h-6 mx-auto mb-1 opacity-50" />
          <p className="text-xs">No comments yet. Be the first!</p>
        </div>
      )}
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-xs shrink-0">
            {(comment.user_name || 'A')[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-1.5 mb-0.5">
              <span className="font-semibold text-xs text-neutral-900">{comment.user_name}</span>
              <span className="text-[10px] text-neutral-400">{timeAgo(comment.created_at)}</span>
            </div>
            <p className="text-xs text-neutral-700 leading-relaxed">{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  </div>

            {/* Mobile Comments Trigger */}
            <button onClick={() => setShowMobileComments(true)} className="sm:hidden flex items-center justify-between w-full py-3 border-t border-neutral-100">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-semibold text-neutral-900">Comments ({comments.length})</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Related Hooks - Masonry Grid (fills the page) */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h2 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            More to explore
          </h2>
          <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
            {related.map((item) => (
              <Link key={item.id} href={`/hooker/hook/${item.id}`} className="block break-inside-avoid">
                <div
                  className="group relative rounded-2xl overflow-hidden cursor-pointer bg-neutral-100"
                  onMouseEnter={() => setHoveredRelated(item.id)}
                  onMouseLeave={() => setHoveredRelated(null)}
                >
                  <img
                    src={item.image_url || (item.images?.[0]) || ''}
                    alt={item.title}
                    className="w-full h-auto object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300 ${hoveredRelated === item.id ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-white font-semibold text-xs mb-1 line-clamp-2">{item.title}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-white/80 text-[10px]">{item.creator_name}</span>
                        <div className="flex items-center gap-1 text-white/80 text-[10px]">
                          <Heart className="w-3 h-3" />
                          {item.likes || 0}
                        </div>
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
        </section>
      )}
    </div>
  )
}