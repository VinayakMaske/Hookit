// src/app/(site)/hook/new/page.tsx
'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Camera, Upload, X, Plus, Link2, Globe, ShoppingBag, Sparkles,
  ArrowRight, CheckCircle2, Loader2, Trash2, GripVertical, AlertCircle,
  Zap, TrendingUp, Heart, Eye, Star, Flame, Rocket, Crown, Gem,
  ArrowUpRight, Palette, Plane, Laptop, Gamepad2, Utensils,
  MousePointerClick, Lock, Tag, DollarSign, ExternalLink, BookOpen,
  Mail, KeyRound, ArrowLeft
} from 'lucide-react'

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

// Hook Types
const HOOK_TYPES = [
  { id: 'link', label: 'Link Hook', description: 'Share any external link', icon: ExternalLink, color: 'from-purple-500 to-pink-500', bgColor: 'bg-purple-50', borderColor: 'border-purple-200', textColor: 'text-purple-700', examples: 'YouTube, Instagram, Portfolio, News, Affiliate links' },
  { id: 'blog', label: 'Blog Hook', description: 'Write an article on Hookit', icon: BookOpen, color: 'from-blue-500 to-indigo-500', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', textColor: 'text-blue-700', examples: 'Stories, Tutorials, Guides, Reviews' },
  { id: 'product', label: 'Product Hook', description: 'Showcase something to sell', icon: ShoppingBag, color: 'from-emerald-500 to-teal-500', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200', textColor: 'text-emerald-700', examples: 'Physical products, Digital goods, Services' },
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

// Creator flow states
type CreatorFlow = 'enter_email' | 'checking' | 'new_otp_sent' | 'new_verified' | 'returning_show' | 'returning_otp' | 'forgot_passkey' | 'reset_otp_sent' | 'verified'

export default function CreateHookPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ===== FORM STATE =====
  const [images, setImages] = useState<{ preview: string; uploading: boolean; url?: string }[]>([])
  const [hookType, setHookType] = useState<'link' | 'blog' | 'product'>('link')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  // Type-specific fields
  const [destinationUrl, setDestinationUrl] = useState('')
  const [blogContent, setBlogContent] = useState('')
  const [productPrice, setProductPrice] = useState('')
  const [externalStoreUrl, setExternalStoreUrl] = useState('')

  // Creator verification state
  const [creatorFlow, setCreatorFlow] = useState<CreatorFlow>('enter_email')
  const [creatorEmail, setCreatorEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [passkey, setPasskey] = useState('')
  const [creatorProfile, setCreatorProfile] = useState<any>(null)
  const [suggestedUsername, setSuggestedUsername] = useState('')
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)

  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState(1)
  const [publishedHookId, setPublishedHookId] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

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

  // ===== CREATOR VERIFICATION FLOW =====

  const handleCheckEmail = async () => {
    if (!creatorEmail.includes('@')) {
      setUploadError('Please enter a valid email')
      return
    }
    setIsCheckingEmail(true)
    setUploadError(null)

    try {
      const res = await fetch('/api/creator/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: creatorEmail })
      })
      const data = await res.json()

      if (data.exists && data.creator) {
        setCreatorProfile(data.creator)
        setSuggestedUsername(data.creator.username)
        setCreatorFlow('returning_show')
      } else {
        const otpRes = await fetch('/api/creator/otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: creatorEmail, isReturning: false })
        })
        const otpData = await otpRes.json()

        if (!otpRes.ok) throw new Error(otpData.error)
        setSuggestedUsername(otpData.suggestedUsername)
        setCreatorFlow('new_otp_sent')
      }
    } catch (err: any) {
      setUploadError(err.message || 'Failed to check email')
    } finally {
      setIsCheckingEmail(false)
    }
  }

  const handleVerifyNewOTP = async () => {
    if (otp.length !== 6) {
      setUploadError('Enter 6-digit OTP')
      return
    }
    setIsSubmitting(true)
    setUploadError(null)

    try {
      const res = await fetch('/api/creator/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: creatorEmail, otp })
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      setCreatorProfile(data.creator)
      setCreatorFlow('new_verified')
    } catch (err: any) {
      setUploadError(err.message || 'Invalid OTP')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifyPasskeyQuick = async () => {
    if (!passkey.trim()) {
      setUploadError('Enter your Creator Passkey')
      return
    }
    setIsSubmitting(true)
    setUploadError(null)

    try {
      const res = await fetch('/api/creator/verify-passkey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: creatorEmail, passkey })
      })
      const data = await res.json()

      if (!res.ok) {
        if (data.needsNewPasskey) {
          setCreatorFlow('forgot_passkey')
        }
        throw new Error(data.error)
      }

      setCreatorProfile(data.creator)
      setCreatorFlow('verified')
      // Auto-publish after verification
      await handlePublishAfterVerify(data.creator)
    } catch (err: any) {
      setUploadError(err.message || 'Verification failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePublishAfterVerify = async (creatorData: any) => {
    if (!title || !category || images.length === 0) return
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
  type: hookType,
  creator_name: creatorData?.username || creatorEmail.split('@')[0],
  creator_username: creatorData?.username || creatorEmail.split('@')[0], // ← ADD THIS
  creator_email_ref: creatorEmail,
  is_published: true,
}

      if (hookType === 'link') {
        payload.destination_url = destinationUrl
      } else if (hookType === 'blog') {
        payload.blog_content = blogContent
      } else if (hookType === 'product') {
        payload.product_price = parseFloat(productPrice) || 0
        payload.product_details = {
          external_store_url: externalStoreUrl,
          currency: 'USD'
        }
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
      setStep(5)
    } catch (err: any) {
      setUploadError(err.message || 'Failed to publish')
      setIsSubmitting(false)
    }
  }


  const handleVerifyReturning = async () => {
    if (otp.length !== 6) {
      setUploadError('Enter 6-digit OTP')
      return
    }
    if (!passkey.trim()) {
      setUploadError('Enter your Creator Passkey')
      return
    }
    setIsSubmitting(true)
    setUploadError(null)

    try {
      const res = await fetch('/api/creator/verify-passkey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: creatorEmail, passkey, otp })
      })
      const data = await res.json()

      if (!res.ok) {
        if (data.needsNewPasskey) {
          setCreatorFlow('forgot_passkey')
        }
        throw new Error(data.error)
      }

      setCreatorProfile(data.creator)
      setCreatorFlow('verified')
    } catch (err: any) {
      setUploadError(err.message || 'Verification failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRequestNewPasskey = async () => {
    setIsSubmitting(true)
    setUploadError(null)

    try {
      const res = await fetch('/api/creator/reset-passkey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: creatorEmail })
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)
      setCreatorFlow('reset_otp_sent')
    } catch (err: any) {
      setUploadError(err.message || 'Failed to request new passkey')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifyResetOTP = async () => {
    if (otp.length !== 6) {
      setUploadError('Enter 6-digit OTP')
      return
    }
    setIsSubmitting(true)
    setUploadError(null)

    try {
      const res = await fetch('/api/creator/verify-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: creatorEmail, otp })
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      setCreatorProfile(data.creator)
      setPasskey(data.newPasskey)
      setCreatorFlow('verified')
    } catch (err: any) {
      setUploadError(err.message || 'Invalid OTP')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ===== PUBLISH =====
  const handlePublish = async () => {
    if (!title || !category || images.length === 0) return
    if (images.some(img => img.uploading)) { setUploadError('Wait for uploads'); return }
    if (creatorFlow !== 'verified') { setUploadError('Please verify your email first'); return }

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
        type: hookType,
        creator_name: creatorProfile?.username || creatorEmail.split('@')[0],
        creator_email_ref: creatorEmail,
        is_published: true,
      }

      if (hookType === 'link') {
        payload.destination_url = destinationUrl
      } else if (hookType === 'blog') {
        payload.blog_content = blogContent
      } else if (hookType === 'product') {
        payload.product_price = parseFloat(productPrice) || 0
        payload.product_details = {
          external_store_url: externalStoreUrl,
          currency: 'USD'
        }
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
      setStep(5)
    } catch (err: any) {
      setUploadError(err.message || 'Failed to publish')
      setIsSubmitting(false)
    }
  }

  // Progress calculation
  const getProgress = () => {
    let completed = 0
    if (images.length > 0 && !images.some(img => img.uploading)) completed++
    if (title.length > 0) completed++
    if (category.length > 0) completed++
    if (hookType === 'link' && destinationUrl.length > 0) completed++
    if (hookType === 'blog' && blogContent.length > 50) completed++
    if (hookType === 'product' && productPrice.length > 0) completed++
    if (creatorFlow === 'verified') completed++
    return completed
  }

  const progress = getProgress()
  const totalSteps = 7

  // ===== SUCCESS SCREEN =====
  if (step === 5 && publishedHookId) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center px-4 py-20">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {FLOATING_IMAGES.slice(0, 10).map((img, i) => (
            <div key={i} className="absolute rounded-2xl overflow-hidden shadow-lg opacity-80" style={{ 
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
          <p className="text-purple-600 font-medium mb-2">&quot;One Hook. Infinite reach.&quot;</p>
          <p className="text-sm text-neutral-400 mb-10">
            Posted by <span className="font-semibold text-neutral-600">@{creatorProfile?.username || creatorEmail.split('@')[0]}</span>
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

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-left">
            <div className="flex items-start gap-3">
              <KeyRound className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">Save your Creator Passkey</p>
                <p className="text-xs text-amber-600 mt-1">
                  Passkey sent to <strong>{creatorEmail}</strong>. Use it to publish more Hooks under the same profile.
                </p>
              </div>
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
                    {step === 1 ? 'Upload Visuals' : step === 2 ? 'Choose Hook Type' : step === 3 ? 'Fill Details' : 'Verify & Publish'}
                  </Badge>
                  <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 leading-tight mb-2">
                    {step === 1 ? 'Upload your' : step === 2 ? 'What type of' : step === 3 ? 'Tell your' : 'Ready to'}{' '}
                    <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 bg-clip-text text-transparent">
                      {step === 1 ? 'visuals' : step === 2 ? 'Hook' : step === 3 ? 'story' : 'publish'}
                    </span>
                  </h1>
                  <p className="text-neutral-500">
                    {step === 1 ? 'Drag & drop your images. No sign-up needed.' : 
                     step === 2 ? 'Select what your Hook represents.' : 
                     step === 3 ? 'Add details that make your Hook shine.' : 
                     'Verify your email and publish to the world.'}
                  </p>
                </div>

                {/* Step Progress */}
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className={`w-10 h-2.5 rounded-full transition-all duration-500 ${i <= step ? 'bg-gradient-to-r from-purple-600 to-pink-500 shadow-md shadow-purple-500/20' : 'bg-neutral-200'}`} />
                    ))}
                  </div>
                  <span className="text-sm text-neutral-400 ml-2 font-medium">Step {step} of 4</span>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-neutral-700">{progress}/{totalSteps} completed</span>
                    <span className="text-neutral-400">{Math.round((progress / totalSteps) * 100)}%</span>
                  </div>
                  <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 rounded-full transition-all duration-700 shadow-sm" style={{ width: `${(progress / totalSteps) * 100}%` }} />
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

              {/* STEP 1: Upload Images */}
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

              {/* STEP 2: Choose Hook Type */}
              {step === 2 && (
                <div className="p-8 pt-2 space-y-6">
                  <div className="grid gap-4">
                    {HOOK_TYPES.map((type) => {
                      const isSelected = hookType === type.id
                      const Icon = type.icon
                      return (
                        <button
                          key={type.id}
                          onClick={() => setHookType(type.id as 'link' | 'blog' | 'product')}
                          className={`relative flex items-start gap-4 p-6 rounded-2xl border-2 transition-all duration-300 text-left group ${
                            isSelected 
                              ? `${type.bgColor} ${type.borderColor} shadow-lg scale-[1.02]` 
                              : 'bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                          }`}
                        >
                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${type.color} flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
                            <Icon className="w-7 h-7 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`font-bold text-lg ${isSelected ? type.textColor : 'text-neutral-900'}`}>{type.label}</h3>
                              {isSelected && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                            </div>
                            <p className="text-sm text-neutral-500 mb-2">{type.description}</p>
                            <p className="text-xs text-neutral-400">Examples: {type.examples}</p>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${isSelected ? `border-current ${type.textColor}` : 'border-neutral-300'}`}>
                            {isSelected && <div className={`w-3 h-3 rounded-full bg-current ${type.textColor}`} />}
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setStep(1)} className="rounded-full gap-2 border-neutral-200 hover:bg-neutral-50">
                      <ArrowLeft className="w-4 h-4" /> Back
                    </Button>
                    <Button onClick={() => setStep(3)} className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full h-12 px-8 gap-2 hover:shadow-lg hover:shadow-purple-500/20 transition-all">
                      Next Step <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 3: Fill Details */}
              {step === 3 && (
                <div className="p-8 pt-2 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                  {/* Title */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 flex items-center gap-2">
                      <MousePointerClick className="w-4 h-4 text-purple-500" /> Hook Title *
                    </label>
                    <Input 
                      placeholder="e.g., My Minimalist Art Collection, Sunset in Bali..." 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                      className="h-14 rounded-xl border-neutral-200 focus:border-purple-300 focus:ring-purple-500/20 text-lg" 
                      maxLength={100} 
                    />
                    <p className="text-xs text-neutral-400 text-right">{title.length}/100</p>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-pink-500" /> Description
                    </label>
                    <Textarea 
                      placeholder="Tell the world what makes your Hook special..." 
                      value={description} 
                      onChange={(e) => setDescription(e.target.value)} 
                      className="min-h-[100px] rounded-xl border-neutral-200 focus:border-purple-300 focus:ring-purple-500/20 resize-none" 
                      maxLength={500} 
                    />
                    <p className="text-xs text-neutral-400 text-right">{description.length}/500</p>
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" /> Category *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map((cat) => (
                        <button 
                          key={cat.slug} 
                          onClick={() => setCategory(cat.name)} 
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${category === cat.name ? `${cat.color} border-current scale-105 shadow-md` : 'bg-white text-neutral-600 border-neutral-200 hover:border-purple-300 hover:bg-purple-50'}`}
                        >
                          <cat.icon className="w-4 h-4" /> {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-rose-500" /> Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tags.map(tag => (
                        <Badge key={tag} className="bg-purple-100 text-purple-700 border-purple-200 gap-1 pl-3 pr-2 py-1.5 hover:bg-purple-200 cursor-pointer transition-colors" onClick={() => removeTag(tag)}>
                          #{tag} <X className="w-3 h-3" />
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Add tag + Enter" 
                        value={tagInput} 
                        onChange={(e) => setTagInput(e.target.value)} 
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag(tagInput))} 
                        className="rounded-xl border-neutral-200 focus:border-purple-300" 
                      />
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

                  {/* TYPE-SPECIFIC FIELDS */}

                  {/* Link Hook: Destination URL */}
                  {hookType === 'link' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-700 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-blue-500" /> Destination URL *
                      </label>
                      <div className="relative">
                        <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <Input 
                          placeholder="https://youtube.com/watch?v=..., https://yourportfolio.com" 
                          value={destinationUrl} 
                          onChange={(e) => setDestinationUrl(e.target.value)} 
                          className="h-12 rounded-xl border-neutral-200 focus:border-purple-300 pl-10" 
                        />
                      </div>
                      <p className="text-xs text-neutral-400">Users will be redirected to this URL when they click your Hook.</p>
                    </div>
                  )}

                  {/* Blog Hook: Blog Content */}
                  {hookType === 'blog' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-700 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-blue-500" /> Blog Content *
                      </label>
                      <Textarea 
                        placeholder="Write your full article here. This will be displayed when users click your Hook..." 
                        value={blogContent} 
                        onChange={(e) => setBlogContent(e.target.value)} 
                        className="min-h-[200px] rounded-xl border-neutral-200 focus:border-purple-300 focus:ring-purple-500/20 resize-none" 
                      />
                      <p className="text-xs text-neutral-400">{blogContent.length} characters. Write at least 50 characters.</p>
                    </div>
                  )}

                  {/* Product Hook: Price & Store URL */}
                  {hookType === 'product' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-700 flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-emerald-500" /> Price (USD) *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-medium">$</span>
                          <Input 
                            type="number" 
                            step="0.01" 
                            min="0" 
                            placeholder="29.99" 
                            value={productPrice} 
                            onChange={(e) => setProductPrice(e.target.value)} 
                            className="h-12 rounded-xl border-neutral-200 focus:border-purple-300 pl-8" 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-700 flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4 text-emerald-500" /> Store URL
                        </label>
                        <div className="relative">
                          <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                          <Input 
                            placeholder="https://yourstore.com/product/..." 
                            value={externalStoreUrl} 
                            onChange={(e) => setExternalStoreUrl(e.target.value)} 
                            className="h-12 rounded-xl border-neutral-200 focus:border-purple-300 pl-10" 
                          />
                        </div>
                        <p className="text-xs text-neutral-400">Optional. Users will be redirected here to purchase. Native checkout coming soon.</p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setStep(2)} className="rounded-full gap-2 border-neutral-200 hover:bg-neutral-50">
                      <ArrowLeft className="w-4 h-4" /> Back
                    </Button>
                    <Button 
                      onClick={() => setStep(4)} 
                      disabled={!title || !category || (hookType === 'link' && !destinationUrl) || (hookType === 'blog' && blogContent.length < 50) || (hookType === 'product' && !productPrice)} 
                      className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full h-12 px-8 gap-2 disabled:opacity-40 hover:shadow-lg hover:shadow-purple-500/20 transition-all"
                    >
                      Preview & Publish <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 4: Verify Email & Publish */}
              {step === 4 && (
                <div className="p-8 pt-2 space-y-6">
                  {/* Preview Card */}
                  <div className="bg-white rounded-3xl shadow-lg border border-neutral-200 overflow-hidden mb-6">
                    <div className="relative aspect-[16/10] bg-neutral-100">
                      <img src={images[0]?.url || images[0]?.preview} alt={title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <Badge className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white border-0 shadow-lg">
                        <Sparkles className="w-3 h-3 mr-1" /> {category}
                      </Badge>
                      <Badge className="absolute top-4 right-4 bg-white/90 text-neutral-700 border-0 shadow-lg">
                        {HOOK_TYPES.find(t => t.id === hookType)?.label}
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

                      {hookType === 'link' && destinationUrl && (
                        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
                          <Globe className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-blue-700 truncate flex-1">{destinationUrl}</span>
                          <span className="text-xs text-blue-400">External Link</span>
                        </div>
                      )}
                      {hookType === 'blog' && blogContent && (
                        <div className="flex items-center gap-2 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                          <BookOpen className="w-4 h-4 text-indigo-500" />
                          <span className="text-sm text-indigo-700 flex-1">{blogContent.length} characters</span>
                          <span className="text-xs text-indigo-400">Blog Article</span>
                        </div>
                      )}
                      {hookType === 'product' && productPrice && (
                        <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                          <DollarSign className="w-4 h-4 text-emerald-500" />
                          <span className="text-sm text-emerald-700 font-bold">${productPrice}</span>
                          {externalStoreUrl && <span className="text-xs text-emerald-400 truncate flex-1 ml-2">{externalStoreUrl}</span>}
                          <span className="text-xs text-emerald-400">Product</span>
                        </div>
                      )}

                      <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-md text-sm">
                          {creatorProfile?.username?.charAt(0)?.toUpperCase() || creatorEmail.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900">
                            @{creatorProfile?.username || creatorEmail.split('@')[0]}
                          </p>
                          <p className="text-sm text-neutral-400">{creatorEmail}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ===== CREATOR VERIFICATION FLOW UI ===== */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">

                    {/* FLOW: ENTER EMAIL */}
                    {creatorFlow === 'enter_email' && (
                      <div className="space-y-4">
                        <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                          <Mail className="w-5 h-5 text-purple-600" /> 
                          Enter your email to publish
                        </h3>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                          <Input 
                            type="email" 
                            placeholder="you@example.com" 
                            value={creatorEmail} 
                            onChange={(e) => setCreatorEmail(e.target.value)} 
                            className="h-12 rounded-xl border-neutral-200 bg-white focus:border-purple-300 pl-10" 
                          />
                        </div>
                        <p className="text-xs text-neutral-500">
                          New creators get a unique passkey. Returning creators use their existing one.
                        </p>
                        <Button 
                          onClick={handleCheckEmail} 
                          disabled={isCheckingEmail || !creatorEmail.includes('@')}
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl h-12 gap-2 disabled:opacity-40"
                        >
                          {isCheckingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                          {isCheckingEmail ? 'Checking...' : 'Continue'}
                        </Button>
                      </div>
                    )}

                    {/* FLOW: CHECKING */}
                    {creatorFlow === 'checking' && (
                      <div className="text-center py-8">
                        <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-3" />
                        <p className="text-neutral-600">Checking your email...</p>
                      </div>
                    )}

                    {/* FLOW: NEW CREATOR - OTP SENT */}
                    {creatorFlow === 'new_otp_sent' && (
                      <div className="space-y-4">
                        <div className="bg-white rounded-xl p-4 border border-purple-100 mb-4">
                          <p className="text-sm text-neutral-600 mb-1">New Creator</p>
                          <p className="font-medium text-neutral-900">{creatorEmail}</p>
                          <p className="text-xs text-purple-600 mt-1">Suggested username: @{suggestedUsername}</p>
                        </div>
                        <p className="text-sm text-neutral-600">We sent a 6-digit code to your email. Enter it below:</p>
                        <div className="relative">
                          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                          <Input 
                            placeholder="000000" 
                            maxLength={6}
                            value={otp} 
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
                            className="h-12 rounded-xl border-neutral-200 bg-white focus:border-purple-300 pl-10 text-center text-lg tracking-[0.5em] font-mono" 
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            onClick={handleCheckEmail} 
                            className="flex-1 rounded-xl border-neutral-200"
                          >
                            Resend Code
                          </Button>
                          <Button 
                            onClick={handleVerifyNewOTP} 
                            disabled={otp.length !== 6 || isSubmitting}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl h-12 gap-2 disabled:opacity-40"
                          >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                            Verify
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* FLOW: NEW CREATOR - VERIFIED, SHOW PASSKEY INFO */}
                    {creatorFlow === 'new_verified' && (
                      <div className="space-y-4">
                        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                          <div className="flex items-center gap-3 mb-2">
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                            <div>
                              <p className="font-semibold text-green-800">Email Verified!</p>
                              <p className="text-sm text-green-600">@{creatorProfile?.username}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            <KeyRound className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-amber-800">Check your email for your Creator Passkey</p>
                              <p className="text-xs text-amber-600 mt-1">
                                A unique passkey (like <strong>HK-XXXXXX</strong>) has been sent to <strong>{creatorEmail}</strong>. 
                                Save it — you will need it every time you publish.
                              </p>
                            </div>
                          </div>
                        </div>
                        <Button 
                          onClick={() => setCreatorFlow('verified')}
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl h-12 gap-2"
                        >
                          <Sparkles className="w-4 h-4" /> I am Ready to Publish
                        </Button>
                      </div>
                    )}

                                        {/* FLOW: RETURNING - SHOW USERNAME, ASK FOR PASSKEY */}
                    {creatorFlow === 'returning_show' && (
                      <div className="space-y-4">
                        <div className="bg-white rounded-xl p-4 border border-purple-100 mb-4">
                          <p className="text-sm text-neutral-600 mb-1">Welcome back</p>
                          <p className="font-bold text-lg text-neutral-900">@{creatorProfile?.username}</p>
                          <p className="text-xs text-neutral-400">{creatorEmail}</p>
                        </div>
                        <p className="text-sm text-neutral-600">Enter your Creator Passkey to publish:</p>
                        <div className="relative">
                          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                          <Input 
                            placeholder="HK-XXXXXX" 
                            value={passkey} 
                            onChange={(e) => setPasskey(e.target.value.toUpperCase())} 
                            className="h-12 rounded-xl border-neutral-200 bg-white focus:border-purple-300 pl-10 font-mono tracking-wider uppercase" 
                          />
                        </div>
                        <button 
                          onClick={() => setCreatorFlow('forgot_passkey')}
                          className="text-xs text-purple-600 hover:text-purple-700 text-center w-full"
                        >
                          Forgot your passkey? Request a new one
                        </button>
                      </div>
                    )}

                    {/* FLOW: FORGOT PASSKEY */}
                    {creatorFlow === 'forgot_passkey' && (
                      <div className="space-y-4">
                        <div className="bg-red-50 rounded-xl p-4 border border-red-100 mb-4">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-red-800">Forgot your passkey?</p>
                              <p className="text-xs text-red-600 mt-1">
                                We will send a new passkey + OTP to {creatorEmail}. Your old passkey will no longer work.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            onClick={() => setCreatorFlow('returning_show')}
                            className="flex-1 rounded-xl border-neutral-200"
                          >
                            Go Back
                          </Button>
                          <Button 
                            onClick={handleRequestNewPasskey} 
                            disabled={isSubmitting}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl h-12 gap-2 disabled:opacity-40"
                          >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                            Request New Passkey
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* FLOW: RESET OTP SENT */}
                    {creatorFlow === 'reset_otp_sent' && (
                      <div className="space-y-4">
                        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 mb-4">
                          <p className="text-sm font-medium text-amber-800">New passkey sent!</p>
                          <p className="text-xs text-amber-600 mt-1">
                            Check your email for a new passkey and 6-digit OTP. Enter the OTP below to activate it.
                          </p>
                        </div>
                        <div className="relative">
                          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                          <Input 
                            placeholder="000000" 
                            maxLength={6}
                            value={otp} 
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
                            className="h-12 rounded-xl border-neutral-200 bg-white focus:border-purple-300 pl-10 text-center text-lg tracking-[0.5em] font-mono" 
                          />
                        </div>
                        <Button 
                          onClick={handleVerifyResetOTP} 
                          disabled={otp.length !== 6 || isSubmitting}
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl h-12 gap-2 disabled:opacity-40"
                        >
                          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                          Activate New Passkey
                        </Button>
                      </div>
                    )}

                    {/* FLOW: VERIFIED - READY TO PUBLISH */}
                    {creatorFlow === 'verified' && (
                      <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                        <div className="flex items-center gap-3 mb-4">
                          <CheckCircle2 className="w-6 h-6 text-green-500" />
                          <div>
                            <p className="font-semibold text-green-800">Creator Verified</p>
                            <p className="text-sm text-green-600">@{creatorProfile?.username} • {creatorEmail}</p>
                          </div>
                        </div>
                        <p className="text-xs text-green-600">
                          Your Creator Passkey is saved. Use it to publish more Hooks under this profile.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 justify-center">
                    <Button variant="outline" onClick={() => setStep(3)} className="rounded-full h-12 px-6 border-neutral-200 hover:bg-neutral-50">
                      <ArrowLeft className="w-4 h-4 mr-2" /> Edit
                    </Button>
                                        <Button 
                      onClick={creatorFlow === 'returning_show' ? handleVerifyPasskeyQuick : handlePublish} 
                      disabled={isSubmitting || (creatorFlow !== 'verified' && creatorFlow !== 'returning_show')}
                      className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full h-12 px-8 text-lg gap-2 shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 transition-all disabled:opacity-40"
                    >
                      {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Publishing...</> : <><Sparkles className="w-5 h-5" /> Publish Hook</>}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="text-center mt-8">
              <p className="text-neutral-400 text-sm font-medium tracking-wide">&quot;Do not think. Just Hookit.&quot;</p>
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