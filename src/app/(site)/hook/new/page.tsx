// src/app/(site)/hook/new/page.tsx
'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Camera,
  Upload,
  X,
  Plus,
  Link2,
  Globe,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Trash2,
  GripVertical,
  AlertCircle,
  Zap,
  TrendingUp,
  Heart,
  Eye,
  Star,
  Flame,
  Rocket,
  Crown,
  Gem,
  ArrowUpRight,
  Palette,
  Plane,
  Laptop,
  Gamepad2,
  Utensils,
  MousePointerClick,
  Lock,
  User
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

// Floating background images
const FLOATING_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop', top: '8%', left: '2%', delay: 0, size: 140, rotate: -5 },
  { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=250&h=350&fit=crop', top: '5%', left: '88%', delay: 0.5, size: 120, rotate: 3 },
  { src: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=280&h=380&fit=crop', top: '25%', left: '5%', delay: 1, size: 130, rotate: -3 },
  { src: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=260&h=360&fit=crop', top: '35%', left: '92%', delay: 1.5, size: 125, rotate: 5 },
  { src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=270&h=370&fit=crop', top: '55%', left: '3%', delay: 2, size: 135, rotate: -2 },
  { src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=290&h=390&fit=crop', top: '65%', left: '90%', delay: 0.3, size: 145, rotate: 4 },
  { src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&h=340&fit=crop', top: '15%', left: '15%', delay: 0.8, size: 115, rotate: -4 },
  { src: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=300&h=400&fit=crop', top: '75%', left: '8%', delay: 1.2, size: 150, rotate: 2 },
  { src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=250&h=350&fit=crop', top: '45%', left: '95%', delay: 1.8, size: 120, rotate: -6 },
  { src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=280&h=380&fit=crop', top: '85%', left: '20%', delay: 0.6, size: 135, rotate: 3 },
  { src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=260&h=360&fit=crop', top: '20%', left: '80%', delay: 1.4, size: 125, rotate: -5 },
  { src: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=290&h=390&fit=crop', top: '60%', left: '12%', delay: 2.2, size: 145, rotate: 4 },
  { src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=240&h=340&fit=crop', top: '40%', left: '85%', delay: 0.9, size: 115, rotate: -3 },
  { src: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=270&h=370&fit=crop', top: '70%', left: '75%', delay: 1.6, size: 130, rotate: 5 },
  { src: 'https://images.unsplash.com/photo-1472120435266-53107fd0c44a?w=300&h=400&fit=crop', top: '10%', left: '50%', delay: 0.2, size: 140, rotate: -2 },
  { src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=250&h=350&fit=crop', top: '50%', left: '5%', delay: 1, size: 120, rotate: 6 },
  { src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=280&h=380&fit=crop', top: '80%', left: '85%', delay: 1.9, size: 135, rotate: -4 },
  { src: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=260&h=360&fit=crop', top: '30%', left: '25%', delay: 0.7, size: 125, rotate: 3 },
  { src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=290&h=390&fit=crop', top: '90%', left: '55%', delay: 2.4, size: 145, rotate: -5 },
  { src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=240&h=340&fit=crop', top: '5%', left: '35%', delay: 1.1, size: 115, rotate: 2 },
]

// Motivational quotes
const QUOTES = [
  { text: "Just Hookit.", position: "top-[12%] left-[28%]", icon: Zap, color: "text-purple-600" },
  { text: "Don't think. Just Hookit.", position: "top-[22%] right-[18%]", icon: Flame, color: "text-pink-600" },
  { text: "Increase your presence.", position: "bottom-[25%] left-[18%]", icon: TrendingUp, color: "text-violet-600" },
  { text: "Your creativity deserves to be found.", position: "top-[55%] right-[10%]", icon: Star, color: "text-amber-600" },
  { text: "One Hook. Infinite reach.", position: "bottom-[35%] right-[22%]", icon: Rocket, color: "text-rose-600" },
  { text: "Share what you love.", position: "top-[40%] left-[8%]", icon: Heart, color: "text-fuchsia-600" },
  { text: "Be seen. Be discovered.", position: "bottom-[15%] right-[35%]", icon: Eye, color: "text-indigo-600" },
  { text: "Your story starts here.", position: "top-[8%] right-[40%]", icon: Crown, color: "text-purple-500" },
  { text: "Make it unforgettable.", position: "bottom-[20%] left-[38%]", icon: Gem, color: "text-pink-500" },
]

// Link types - know_more is free, others require login (only for guests)
const LINK_TYPES = [
  { id: 'know_more', label: 'Know More', icon: Link2, placeholder: 'https://anylink.com/your-page', color: 'from-purple-500 to-pink-500', requiresLogin: false },
  { id: 'instagram', label: 'Instagram', icon: InstagramIcon, placeholder: 'https://instagram.com/yourhandle', color: 'from-purple-500 to-pink-500', requiresLogin: true },
  { id: 'youtube', label: 'YouTube', icon: YoutubeIcon, placeholder: 'https://youtube.com/@yourchannel', color: 'from-red-500 to-red-600', requiresLogin: true },
  { id: 'website', label: 'Website', icon: Globe, placeholder: 'https://yourwebsite.com', color: 'from-blue-500 to-indigo-500', requiresLogin: true },
  { id: 'store', label: 'Store', icon: ShoppingBag, placeholder: 'https://yourstore.com', color: 'from-emerald-500 to-teal-500', requiresLogin: true },
]

// Categories
const CATEGORIES = [
  { name: 'Travel', slug: 'travel', icon: Plane, color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { name: 'Art', slug: 'art', icon: Palette, color: 'bg-pink-100 text-pink-700 border-pink-200' },
  { name: 'Photography', slug: 'photography', icon: Camera, color: 'bg-violet-100 text-violet-700 border-violet-200' },
  { name: 'Products', slug: 'products', icon: ShoppingBag, color: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200' },
  { name: 'Fashion', slug: 'fashion', icon: Sparkles, color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  { name: 'Food', slug: 'food', icon: Utensils, color: 'bg-rose-100 text-rose-700 border-rose-200' },
  { name: 'Technology', slug: 'technology', icon: Laptop, color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { name: 'Gaming', slug: 'gaming', icon: Gamepad2, color: 'bg-violet-100 text-violet-700 border-violet-200' },
]

const POPULAR_TAGS = ['portfolio', 'art', 'design', 'photography', 'travel', 'fashion', 'food', 'tech', 'gaming', 'minimal', 'vintage', 'modern', 'creative', 'inspiration', 'diy']

// Generate unique Hooker ID for guests
function generateHookerId(): string {
  return 'Hooker' + Math.floor(1000 + Math.random() * 9000)
}

export default function CreateHookPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // ===== AUTH STATE =====
  const [user, setUser] = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(true)
  
  // ===== FORM STATE =====
  const [images, setImages] = useState<{ preview: string; uploading: boolean; url?: string }[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [links, setLinks] = useState<{ type: string; url: string }[]>([])
  const [creatorEmail, setCreatorEmail] = useState('')
  const [hookerId] = useState(() => generateHookerId())
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState(1)
  const [publishedHookId, setPublishedHookId] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState<string | null>(null)

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setAuthLoading(false)
      
      // Pre-fill email if logged in
      if (user?.email) {
        setCreatorEmail(user.email)
      }
    }
    checkAuth()
    setIsVisible(true)
  }, [])

  // Is user logged in?
  const isLoggedIn = !!user

  const uploadImageToR2 = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'hooks')
    formData.append('fileName', `hooks/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${file.name.split('.').pop()}`)

    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    if (!res.ok) throw new Error('Upload failed')
    const data = await res.json()
    return data.url
  }

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true) }, [])
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false) }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    setUploadError(null)
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
    if (files.length + images.length > 5) { setUploadError('Max 5 images'); return }
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) { setUploadError('Max 5MB per image'); continue }
      const preview = URL.createObjectURL(file)
      setImages(prev => [...prev, { preview, uploading: true }])
      try {
        const url = await uploadImageToR2(file)
        setImages(prev => prev.map(img => img.preview === preview ? { ...img, uploading: false, url } : img))
      } catch (err: any) {
        setImages(prev => prev.filter(img => img.preview !== preview))
        setUploadError(err.message || 'Upload failed')
      }
    }
  }, [images.length])

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null)
    const files = Array.from(e.target.files || []).filter(f => f.type.startsWith('image/'))
    if (files.length + images.length > 5) { setUploadError('Max 5 images'); return }
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) { setUploadError('Max 5MB per image'); continue }
      const preview = URL.createObjectURL(file)
      setImages(prev => [...prev, { preview, uploading: true }])
      try {
        const url = await uploadImageToR2(file)
        setImages(prev => prev.map(img => img.preview === preview ? { ...img, uploading: false, url } : img))
      } catch (err: any) {
        setImages(prev => prev.filter(img => img.preview !== preview))
        setUploadError(err.message || 'Upload failed')
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeImage = (index: number) => setImages(prev => prev.filter((_, i) => i !== index))

  const addTag = (tag: string) => { if (tag && !tags.includes(tag) && tags.length < 10) { setTags([...tags, tag]); setTagInput('') } }
  const removeTag = (tag: string) => setTags(tags.filter(t => t !== tag))

  // ===== UPDATED: Handle link click with auth check =====
  const handleLinkClick = (linkType: typeof LINK_TYPES[0]) => {
    // If logged in, ALL links are free
    if (isLoggedIn) {
      if (!links.find(l => l.type === linkType.id)) {
        setLinks([...links, { type: linkType.id, url: '' }])
      }
      return
    }
    
    // Guest mode - only "know_more" is free
    if (linkType.requiresLogin) {
      setShowLoginPrompt(linkType.id)
      setTimeout(() => {
        router.push('/hooker/login?redirect=' + encodeURIComponent('/hook/new'))
      }, 1500)
      return
    }
    
    if (!links.find(l => l.type === linkType.id)) {
      setLinks([...links, { type: linkType.id, url: '' }])
    }
  }

  const addLink = (type: string) => { if (!links.find(l => l.type === type)) setLinks([...links, { type, url: '' }]) }
  const updateLink = (type: string, url: string) => setLinks(links.map(l => l.type === type ? { ...l, url } : l))
  const removeLink = (type: string) => setLinks(links.filter(l => l.type !== type))

  // ===== UPDATED: Publish with user_id if logged in =====
  const handlePublish = async () => {
    if (!title || !category || images.length === 0) return
    if (!isLoggedIn && !creatorEmail) return
    if (images.some(img => img.uploading)) { setUploadError('Wait for uploads'); return }
    
    setIsSubmitting(true)
    setUploadError(null)
    
    const uploadedUrls = images.map(img => img.url).filter(Boolean) as string[]
    
    try {
      const payload: any = {
        title,
        description,
        images: uploadedUrls,
        image_url: uploadedUrls[0],
        category,
        category_slug: category.toLowerCase(),
        tags,
        external_links: links.filter(l => l.url).map(l => ({
          label: LINK_TYPES.find(t => t.id === l.type)?.label || l.type,
          url: l.url,
          icon: l.type
        })),
        creator_name: isLoggedIn ? (user.user_metadata?.full_name || 'Anonymous') : hookerId,
        creator_email: isLoggedIn ? user.email : creatorEmail,
        is_published: true,
      }
      
      // Add user_id if logged in
      if (isLoggedIn && user.id) {
        payload.user_id = user.id
      }
      
      const res = await fetch('/api/hooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      if (!res.ok) throw new Error('Failed to publish')
      const data = await res.json()
      setPublishedHookId(data.id)
      setIsSubmitting(false)
      setStep(4)
    } catch (err: any) {
      setUploadError(err.message || 'Failed to publish')
      setIsSubmitting(false)
    }
  }

  const progress = [
    images.length > 0 && !images.some(img => img.uploading),
    title.length > 0,
    category.length > 0,
    isLoggedIn ? true : (creatorEmail.length > 0 && creatorEmail.includes('@')),
  ].filter(Boolean).length

  // ===== UPDATED: Success screen shows user name if logged in =====
  if (step === 4 && publishedHookId) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center px-4 py-20">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {FLOATING_IMAGES.slice(0, 10).map((img, i) => (
            <div key={i} className="absolute rounded-2xl overflow-hidden shadow-lg opacity-40" style={{ 
              top: img.top, left: img.left, width: img.size, height: img.size * 1.3, 
              animation: `float ${6 + i * 0.5}s ease-in-out infinite`, 
              animationDelay: `${img.delay}s`,
              transform: `rotate(${img.rotate}deg)`
            }}>
              <img src={img.src} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-purple-50/80 to-pink-50/90" />
        
        <div className={`relative z-10 max-w-md w-full text-center transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="w-24 h-24 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-500/20 animate-pulse">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-neutral-900 mb-3">Hook Published!</h1>
          <p className="text-lg text-neutral-500 mb-2">Your creativity is now discoverable.</p>
          <p className="text-purple-600 font-medium mb-2">"One Hook. Infinite reach."</p>
          <p className="text-sm text-neutral-400 mb-10">
            Posted by {isLoggedIn ? (user.user_metadata?.full_name || 'You') : hookerId}
          </p>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-neutral-100 mb-8">
            <p className="text-sm text-neutral-400 mb-3 uppercase tracking-wider font-medium">Your Hook URL</p>
            <div className="flex items-center gap-2 bg-neutral-50 rounded-xl p-4 border border-neutral-200">
              <code className="text-sm text-neutral-700 flex-1 truncate">hookit.online/hook/{publishedHookId}</code>
              <Button variant="ghost" size="sm" className="shrink-0 text-neutral-500 hover:text-purple-600" onClick={() => navigator.clipboard.writeText(`https://hookit.online/hook/${publishedHookId}`)}>
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Link href={`/hook/${publishedHookId}`}>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full h-14 px-8 text-lg gap-2 shadow-lg shadow-purple-500/20 hover:shadow-xl transition-shadow">
                View Your Hook <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/explore">
              <Button variant="outline" className="rounded-full h-14 px-6 gap-2 border-neutral-300 hover:border-purple-300 hover:bg-purple-50">
                Explore More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Floating Background Images */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {FLOATING_IMAGES.map((img, i) => (
          <div
            key={i}
            className={`absolute rounded-2xl overflow-hidden shadow-xl transition-all duration-1000 ${isVisible ? 'opacity-60' : 'opacity-0'}`}
            style={{
              top: img.top, left: img.left, width: img.size, height: img.size * 1.3,
              transitionDelay: `${img.delay}s`,
              animation: `float ${6 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${img.delay}s`,
              transform: `rotate(${img.rotate}deg)`,
              zIndex: 1
            }}
          >
            <img src={img.src} alt="" className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-white/30" />
          </div>
        ))}
      </div>

      <div className="fixed inset-0 bg-gradient-to-br from-white/70 via-purple-50/40 to-pink-50/50 pointer-events-none" style={{ zIndex: 2 }} />

      {/* Motivational Quotes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 3 }}>
        {QUOTES.map((quote, i) => (
          <div
            key={i}
            className={`absolute ${quote.position} transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: `${1 + i * 0.3}s` }}
          >
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md rounded-full px-4 py-2 border border-purple-100 shadow-lg shadow-purple-500/5">
              <quote.icon className={`w-4 h-4 ${quote.color}`} />
              <span className="text-sm text-neutral-700 font-medium whitespace-nowrap">{quote.text}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8 pt-24">
          <div className={`w-full max-w-2xl transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            
            {/* Glass Card */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl shadow-purple-500/10 overflow-hidden">
              
              {/* Card Header */}
              <div className="p-8 pb-0">
                <div className="text-center mb-6">
                  <Badge className="mb-3 bg-purple-100 text-purple-700 hover:bg-purple-200 border-0 px-4 py-1.5 text-sm font-medium">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {step === 1 ? 'Create Your Hook' : step === 2 ? 'Tell Your Story' : 'Preview & Publish'}
                  </Badge>
                  <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 leading-tight mb-2">
                    {step === 1 ? 'Upload your' : step === 2 ? 'Tell your' : 'Preview your'}{' '}
                    <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 bg-clip-text text-transparent">
                      {step === 1 ? 'visuals' : step === 2 ? 'story' : 'creation'}
                    </span>
                  </h1>
                  <p className="text-neutral-500">
                    {step === 1 ? 'Drag & drop your images. No sign-up needed.' : 
                     step === 2 ? 'Add details that make your Hook shine.' : 
                     'Review before sharing with the world.'}
                  </p>
                </div>

                {/* Step Progress */}
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="flex gap-1.5">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`w-10 h-2.5 rounded-full transition-all duration-500 ${i <= step ? 'bg-gradient-to-r from-purple-600 to-pink-500 shadow-md shadow-purple-500/20' : 'bg-neutral-200'}`} />
                    ))}
                  </div>
                  <span className="text-sm text-neutral-400 ml-2 font-medium">Step {step} of 3</span>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-neutral-700">{progress}/4 required</span>
                    <span className="text-neutral-400">{Math.round((progress / 4) * 100)}%</span>
                  </div>
                  <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 rounded-full transition-all duration-700 shadow-sm" style={{ width: `${(progress / 4) * 100}%` }} />
                  </div>
                </div>
              </div>

              {/* Error Banner */}
              {uploadError && (
                <div className="mx-8 mb-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                  <p className="text-sm text-red-700">{uploadError}</p>
                  <button onClick={() => setUploadError(null)} className="ml-auto hover:bg-red-100 rounded-lg p-1 transition-colors">
                    <X className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              )}

              {/* Login Prompt Banner */}
              {showLoginPrompt && (
                <div className="mx-8 mb-4 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
                  <Lock className="w-5 h-5 text-amber-500 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-amber-700 font-medium">Login Required</p>
                    <p className="text-xs text-amber-600">Redirecting you to login page to add {LINK_TYPES.find(t => t.id === showLoginPrompt)?.label}...</p>
                  </div>
                  <button onClick={() => setShowLoginPrompt(null)} className="ml-auto hover:bg-amber-100 rounded-lg p-1 transition-colors">
                    <X className="w-4 h-4 text-amber-400" />
                  </button>
                </div>
              )}

              {/* STEP 1: Upload */}
              {step === 1 && (
                <div className="p-8 pt-2 space-y-6">
                  {images.length < 5 && (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-500 group overflow-hidden ${isDragging ? 'border-purple-500 bg-purple-50/80 scale-[1.01] shadow-lg shadow-purple-500/20' : 'border-neutral-300 hover:border-purple-400 hover:bg-purple-50/50'}`}
                    >
                      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-purple-500/5" />
                      <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileInput} />
                      <div className="relative z-10">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-purple-500/10">
                          <Upload className="w-10 h-10 text-purple-600 group-hover:text-pink-600 transition-colors" />
                        </div>
                        <p className="text-xl font-semibold text-neutral-800 mb-2">Drop your images here</p>
                        <p className="text-sm text-neutral-400 mb-1">or click to browse from your device</p>
                        <p className="text-xs text-neutral-300">PNG, JPG, GIF • Up to 5MB each • Max 5 images</p>
                      </div>
                    </div>
                  )}

                  {images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {images.map((img, i) => (
                        <div key={i} className="relative group rounded-2xl overflow-hidden aspect-square bg-neutral-100 border border-neutral-200 shadow-sm">
                          <img src={img.preview} alt="" className="w-full h-full object-cover" />
                          {img.uploading && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                              <Loader2 className="w-8 h-8 text-white animate-spin" />
                            </div>
                          )}
                          {!img.uploading && (
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                              {i > 0 && (
                                <button onClick={(e) => { e.stopPropagation(); const newImages = [...images]; [newImages[i], newImages[i-1]] = [newImages[i-1], newImages[i]]; setImages(newImages) }} className="p-2.5 bg-white/20 rounded-full hover:bg-white/40 transition-colors backdrop-blur-md">
                                  <GripVertical className="w-4 h-4 text-white" />
                                </button>
                              )}
                              <button onClick={(e) => { e.stopPropagation(); removeImage(i) }} className="p-2.5 bg-white/20 rounded-full hover:bg-red-500/80 transition-colors backdrop-blur-md">
                                <Trash2 className="w-4 h-4 text-white" />
                              </button>
                            </div>
                          )}
                          {i === 0 && !img.uploading && (
                            <Badge className="absolute top-2 left-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white border-0 text-xs shadow-lg">
                              <Crown className="w-3 h-3 mr-1" /> Cover
                            </Badge>
                          )}
                        </div>
                      ))}
                      {images.length < 5 && (
                        <button onClick={() => fileInputRef.current?.click()} className="aspect-square rounded-2xl border-2 border-dashed border-neutral-300 flex items-center justify-center hover:border-purple-400 hover:bg-purple-50 transition-all group">
                          <Plus className="w-8 h-8 text-neutral-400 group-hover:text-purple-500 transition-colors" />
                        </button>
                      )}
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <Button onClick={() => setStep(2)} disabled={images.length === 0 || images.some(img => img.uploading)} className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full h-12 px-8 gap-2 disabled:opacity-40 hover:shadow-lg hover:shadow-purple-500/20 transition-all">
                      Next Step <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 2: Details */}
              {step === 2 && (
                <div className="p-8 pt-2 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                  {/* Title */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 flex items-center gap-2">
                      <MousePointerClick className="w-4 h-4 text-purple-500" /> Hook Title *
                    </label>
                    <Input placeholder="e.g., My Minimalist Art Collection, Sunset in Bali..." value={title} onChange={(e) => setTitle(e.target.value)} className="h-14 rounded-xl border-neutral-200 focus:border-purple-300 focus:ring-purple-500/20 text-lg" maxLength={100} />
                    <p className="text-xs text-neutral-400 text-right">{title.length}/100</p>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-pink-500" /> Description
                    </label>
                    <Textarea placeholder="Tell the world what makes your Hook special..." value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-[120px] rounded-xl border-neutral-200 focus:border-purple-300 focus:ring-purple-500/20 resize-none" maxLength={500} />
                    <p className="text-xs text-neutral-400 text-right">{description.length}/500</p>
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" /> Category *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map((cat) => (
                        <button key={cat.slug} onClick={() => setCategory(cat.name)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${category === cat.name ? `${cat.color} border-current scale-105 shadow-md` : 'bg-white text-neutral-600 border-neutral-200 hover:border-purple-300 hover:bg-purple-50'}`}>
                          <cat.icon className="w-4 h-4" /> {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-rose-500" /> Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tags.map(tag => (
                        <Badge key={tag} className="bg-purple-100 text-purple-700 border-purple-200 gap-1 pl-3 pr-2 py-1.5 hover:bg-purple-200 cursor-pointer transition-colors" onClick={() => removeTag(tag)}>
                          #{tag} <X className="w-3 h-3" />
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input placeholder="Add tag + Enter" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag(tagInput))} className="rounded-xl border-neutral-200 focus:border-purple-300" />
                      <Button type="button" variant="outline" onClick={() => addTag(tagInput)} className="rounded-xl border-neutral-200 hover:bg-purple-50 hover:border-purple-300">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {POPULAR_TAGS.filter(t => !tags.includes(t)).map(tag => (
                        <button key={tag} onClick={() => addTag(tag)} className="text-xs px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-500 hover:bg-purple-100 hover:text-purple-600 transition-colors">
                          + {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Links */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 flex items-center gap-2">
                      <Link2 className="w-4 h-4 text-blue-500" /> Link Your World
                    </label>
                    
                    {/* Free links */}
                    <div className="mb-3">
                      <p className="text-xs text-neutral-400 mb-2">
                        {isLoggedIn ? 'All links unlocked' : 'Free link (no login needed)'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {LINK_TYPES.filter(l => !l.requiresLogin).map((linkType) => {
                          const isAdded = links.find(l => l.type === linkType.id)
                          return (
                            <button key={linkType.id} onClick={() => isAdded ? removeLink(linkType.id) : addLink(linkType.id)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${isAdded ? 'bg-gradient-to-r ' + linkType.color + ' text-white border-transparent shadow-md' : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'}`}>
                              <linkType.icon className="w-4 h-4" /> {linkType.label} {isAdded && <X className="w-3 h-3 ml-1" />}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Social/Store links */}
                    <div>
                      <p className="text-xs text-neutral-400 mb-2 flex items-center gap-1">
                        {isLoggedIn ? (
                          <><Sparkles className="w-3 h-3 text-purple-500" /> Social & Store links (unlocked)</>
                        ) : (
                          <><Lock className="w-3 h-3" /> Social & Store links (login required)</>
                        )}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {LINK_TYPES.filter(l => l.requiresLogin).map((linkType) => {
                          const isAdded = links.find(l => l.type === linkType.id)
                          return (
                            <button 
                              key={linkType.id} 
                              onClick={() => isAdded ? removeLink(linkType.id) : handleLinkClick(linkType)} 
                              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${isAdded ? 'bg-gradient-to-r ' + linkType.color + ' text-white border-transparent shadow-md' : isLoggedIn ? 'bg-white text-neutral-600 border-neutral-200 hover:border-purple-300 hover:bg-purple-50' : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'}`}
                            >
                              <linkType.icon className="w-4 h-4" /> 
                              {linkType.label} 
                              {!isLoggedIn && !isAdded && <Lock className="w-3 h-3 text-neutral-400" />}
                              {isAdded && <X className="w-3 h-3 ml-1" />}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {links.map((link) => {
                      const linkType = LINK_TYPES.find(t => t.id === link.type)
                      return (
                        <div key={link.type} className="flex gap-2">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${linkType?.color} flex items-center justify-center shrink-0 shadow-md`}>
                            {linkType && <linkType.icon className="w-5 h-5 text-white" />}
                          </div>
                          <Input placeholder={linkType?.placeholder} value={link.url} onChange={(e) => updateLink(link.type, e.target.value)} className="rounded-xl border-neutral-200 focus:border-purple-300" />
                          <button onClick={() => removeLink(link.type)} className="p-2 hover:bg-red-50 rounded-xl transition-colors">
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      )
                    })}
                  </div>

                  {/* Creator Info */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-100">
                    <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600" /> Who created this?
                    </h3>
                    
                    {/* ===== UPDATED: Show user info if logged in ===== */}
                    {isLoggedIn ? (
                      <div className="bg-white rounded-xl p-4 border border-purple-100">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-md text-lg">
                            {(user.user_metadata?.full_name || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-neutral-900">{user.user_metadata?.full_name || 'You'}</p>
                            <p className="text-sm text-neutral-400">{user.email}</p>
                          </div>
                          <Badge className="ml-auto bg-green-100 text-green-700 border-0">
                            <User className="w-3 h-3 mr-1" /> Logged In
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="bg-white rounded-xl p-4 border border-purple-100 mb-4">
                          <label className="text-xs text-neutral-500 mb-1 block">Your Creator ID</label>
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-md text-sm">
                              {hookerId.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-neutral-900 text-lg">{hookerId}</p>
                              <p className="text-xs text-neutral-400">This unique ID will be shown on your Hook</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-xs text-neutral-500 mb-1 block">Email * <span className="text-neutral-400">(to manage your Hook)</span></label>
                          <Input type="email" placeholder="you@example.com" value={creatorEmail} onChange={(e) => setCreatorEmail(e.target.value)} className="rounded-xl border-neutral-200 bg-white focus:border-purple-300" required />
                          <p className="text-xs text-neutral-400 mt-1">We'll send you a magic link to edit or delete your Hook.</p>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setStep(1)} className="rounded-full gap-2 border-neutral-200 hover:bg-neutral-50">
                      Back
                    </Button>
                    <Button onClick={() => setStep(3)} disabled={!title || !category || (!isLoggedIn && !creatorEmail.includes('@'))} className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full h-12 px-8 gap-2 disabled:opacity-40 hover:shadow-lg hover:shadow-purple-500/20 transition-all">
                      Preview <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 3: Preview */}
              {step === 3 && (
                <div className="p-8 pt-2 space-y-6">
                  <div className="bg-white rounded-3xl shadow-lg border border-neutral-200 overflow-hidden">
                    <div className="relative aspect-[16/10] bg-neutral-100">
                      <img src={images[0]?.url || images[0]?.preview} alt={title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <Badge className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white border-0 shadow-lg">
                        <Sparkles className="w-3 h-3 mr-1" /> {category}
                      </Badge>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
                        <p className="text-white/80 text-sm line-clamp-2">{description || 'No description'}</p>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {tags.map(tag => <span key={tag} className="text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">#{tag}</span>)}
                        </div>
                      )}
                      {links.filter(l => l.url).length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {links.filter(l => l.url).map(link => {
                            const linkType = LINK_TYPES.find(t => t.id === link.type)
                            return (
                              <a key={link.type} href={link.url} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm text-white bg-gradient-to-r ${linkType?.color} shadow-md hover:shadow-lg transition-shadow`}>
                                {linkType && <linkType.icon className="w-4 h-4" />} {linkType?.label}
                              </a>
                            )
                          })}
                        </div>
                      )}
                      <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-md text-sm">
                          {isLoggedIn ? (user.user_metadata?.full_name || 'U').charAt(0).toUpperCase() : hookerId.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900">
                            {isLoggedIn ? (user.user_metadata?.full_name || 'You') : hookerId}
                          </p>
                          <p className="text-sm text-neutral-400">
                            {isLoggedIn ? user.email : creatorEmail}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-center">
                    <Button variant="outline" onClick={() => setStep(2)} className="rounded-full h-12 px-6 border-neutral-200 hover:bg-neutral-50">
                      Edit
                    </Button>
                    <Button onClick={handlePublish} disabled={isSubmitting} className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full h-12 px-8 text-lg gap-2 shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 transition-all">
                      {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Publishing...</> : <><Sparkles className="w-5 h-5" /> Publish Hook</>}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="text-center mt-8">
              <p className="text-neutral-400 text-sm font-medium tracking-wide">"Don't think. Just Hookit."</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(var(--rotate, 0deg)); }
          50% { transform: translateY(-20px) rotate(calc(var(--rotate, 0deg) + 3deg)); }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(168, 85, 247, 0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(168, 85, 247, 0.5); }
      `}</style>
    </div>
  )
}