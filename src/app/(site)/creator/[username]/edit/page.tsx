'use client'

import imageCompression from 'browser-image-compression'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft, Trash2, Loader2, Save, Camera, X, AlertCircle,
  Eye, MousePointerClick, Clock, ExternalLink, BookOpen, ShoppingBag,
  Globe, MapPin, CheckCircle2, User
} from 'lucide-react'
import { updateProfile, updateUsername, deleteHook } from '@/app/actions/creator'

const compressImage = async (file: File): Promise<File> => {
  return await imageCompression(file, {
    maxSizeMB: 0.4,
    maxWidthOrHeight: 1200,
    useWebWorker: true,
    fileType: 'image/webp',
  })
}

const HOOK_TYPE_CONFIG: Record<string, { icon: any; label: string; color: string }> = {
  link: { icon: ExternalLink, label: 'Link', color: 'bg-blue-500' },
  blog: { icon: BookOpen, label: 'Blog', color: 'bg-purple-500' },
  product: { icon: ShoppingBag, label: 'Product', color: 'bg-emerald-500' },
}

function formatWebsite(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
}

export default function EditCreatorProfilePage() {
  const params = useParams()
  const router = useRouter()
  const urlUsername = params.username as string

  const [creator, setCreator] = useState<any>(null)
  const [hooks, setHooks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savingUsername, setSavingUsername] = useState(false)
  const [deletingHookId, setDeletingHookId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Editable fields
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')
  const [website, setWebsite] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [bannerUrl, setBannerUrl] = useState('')

  // Username editing
  const [newUsername, setNewUsername] = useState('')
  const [showUsernameEdit, setShowUsernameEdit] = useState(false)

  // Avatar preview (for immediate feedback on upload)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  useEffect(() => {
    fetchProfile()
  }, [urlUsername])

  useEffect(() => {
  if (creator?.avatar_url && creator.avatar_url !== avatarUrl) {
    setAvatarUrl(creator.avatar_url)
    setAvatarPreview(creator.avatar_url)
  }
}, [creator])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setMessage(null)

      const res = await fetch(`/api/creator/${urlUsername}`, { cache: 'no-store' })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Creator not found')
      }

      setCreator(data.creator)
      setHooks(data.hooks || [])

      // Pre-fill form
      setDisplayName(data.creator.display_name || '')
      setBio(data.creator.bio || '')
      setLocation(data.creator.location || '')
      setWebsite(data.creator.website || '')
      setNewUsername(data.creator.username || '')
      const newAvatarUrl = data.creator?.avatar_url || avatarUrl || ''
const newBannerUrl = data.creator?.banner_url || bannerUrl || ''
setAvatarUrl(newAvatarUrl)
setBannerUrl(newBannerUrl)
setAvatarPreview(newAvatarUrl)
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message })
      console.error('Fetch error:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!creator?.username) {
      setMessage({ type: 'error', text: 'Creator data not loaded' })
      return
    }

    setSaving(true)
    setMessage(null)

    try {
      const result = await updateProfile(creator.username, {
        display_name: displayName,
        bio,
        location,
        website,
        avatar_url: avatarUrl,
        banner_url: bannerUrl,
      })

      setCreator(result.creator)
const newAvatarUrl = result.creator?.avatar_url || avatarUrl || null
setAvatarUrl(newAvatarUrl)
setAvatarPreview(newAvatarUrl)
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateUsername = async () => {
    if (!creator?.username) {
      setMessage({ type: 'error', text: 'Creator data not loaded' })
      return
    }

    if (!newUsername.trim() || newUsername.trim() === creator.username) {
      setShowUsernameEdit(false)
      return
    }

    setSavingUsername(true)
    setMessage(null)

    try {
      const result = await updateUsername(creator.username, newUsername.trim().toLowerCase())

      setMessage({ type: 'success', text: 'Username updated! Redirecting...' })
      setTimeout(() => {
        router.push(`/creator/${result.newUsername}/edit`)
      }, 1500)
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setSavingUsername(false)
    }
  }

  const handleDeleteHook = async (hookId: string) => {
    if (!confirm('Are you sure you want to delete this hook? This cannot be undone.')) return

    setDeletingHookId(hookId)
    try {
      await deleteHook(hookId)
      setHooks(hooks.filter(h => h.id !== hookId))
      setMessage({ type: 'success', text: 'Hook deleted successfully' })
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setDeletingHookId(null)
    }
  }

  const handleImageUpload = async (
    file: File,
    type: 'avatar' | 'banner'
  ) => {
    const compressedFile = await compressImage(file)

    const formData = new FormData()
    formData.append('file', compressedFile)
    formData.append(
      'folder',
      type === 'avatar' ? 'avatars' : 'banners'
    )
    formData.append(
      'fileName',
      `${type}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.webp`
    )

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!res.ok) {
      throw new Error('Upload failed')
    }

    const data = await res.json()

    if (type === 'avatar') {
      setAvatarUrl(data.url)
      setAvatarPreview(data.url)
    } else {
      setBannerUrl(data.url)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-16">
        <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
      </div>
    )
  }

  // Determine avatar display
  const avatarImage = avatarPreview || avatarUrl || creator?.avatar_url || ''
  const displayLetter = (displayName || creator?.username || urlUsername)[0].toUpperCase()

  return (
    <div className="min-h-screen bg-white pt-16">

      {/* Profile Header - Pinterest style, clean and minimal */}
      <section className="pt-8 pb-6 px-4 border-b border-neutral-100">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center">

            {/* Avatar */}
<div className="relative mb-5" style={{ width: '112px', height: '112px' }}>
  <div 
    className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg"
    style={{ 
      borderRadius: '50%',
      overflow: 'hidden'
    }}
  >
    {avatarImage ? (
      <img
        src={avatarImage}
        alt={displayName || creator?.username || urlUsername}
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover'
        }}
      />
    ) : (
      <span style={{ fontSize: '40px' }}>
        {displayLetter}
      </span>
    )}
  </div>
  
  {/* Camera upload button */}
  <label 
    className="absolute cursor-pointer"
    style={{ bottom: '0', right: '0' }}
  >
    <input
      type="file"
      accept="image/*"
      className="hidden"
      onChange={async (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        try {
          await handleImageUpload(file, 'avatar')
        } catch (err: any) {
          setMessage({ type: 'error', text: err.message || 'Image upload failed' })
        }
      }}
    />
    <div 
      className="bg-white shadow-lg flex items-center justify-center hover:bg-neutral-50 transition-colors"
      style={{ 
        borderRadius: '50%',
        width: '36px',
        height: '36px',
        border: '2px solid white'
      }}
    >
      <Camera className="w-4 h-4 text-neutral-600" />
    </div>
  </label>

  {/* Remove avatar button - only show if there's an image */}
  {avatarImage && (
    <button
      onClick={() => {
        setAvatarUrl('')
        setAvatarPreview(null)
      }}
      className="absolute bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
      style={{ 
        borderRadius: '50%',
        width: '28px',
        height: '28px',
        top: '0',
        right: '0',
        border: '2px solid white'
      }}
      title="Remove avatar"
    >
      <X className="w-3.5 h-3.5 text-white" />
    </button>
  )}
</div>

            {/* Name & Username */}
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">
              {displayName || creator?.display_name || creator?.username || urlUsername}
            </h1>

            {/* Username with edit option */}
            <div className="flex items-center justify-center gap-2 mt-1">
              {!showUsernameEdit ? (
                <>
                  <p className="text-neutral-500 font-medium">@{creator?.username || urlUsername}</p>
                  <button 
                    onClick={() => setShowUsernameEdit(true)}
                    className="text-xs text-purple-600 hover:text-purple-700 underline font-medium"
                  >
                    Change
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500">@</span>
                  <Input
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase())}
                    className="h-8 rounded-lg text-sm w-40"
                    placeholder="newusername"
                  />
                  <Button 
                    size="sm" 
                    onClick={handleUpdateUsername}
                    disabled={savingUsername}
                    className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg h-8 px-3 text-xs"
                  >
                    {savingUsername ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Save'}
                  </Button>
                  <button 
                    onClick={() => {
                      setShowUsernameEdit(false)
                      setNewUsername(creator?.username || urlUsername)
                    }}
                    className="text-xs text-neutral-400 hover:text-neutral-600"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Bio preview */}
            {bio && (
              <p className="text-neutral-600 mt-3 max-w-lg leading-relaxed text-sm">
                {bio}
              </p>
            )}

            {/* Location & Website preview */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-2 text-sm text-neutral-500">
              {location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {location}
                </span>
              )}
              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-purple-600 hover:text-purple-700 hover:underline"
                >
                  <Globe className="w-3.5 h-3.5" />
                  {formatWebsite(website)}
                </a>
              )}
            </div>

            {/* Stats preview */}
            <div className="flex items-center justify-center gap-6 md:gap-10 mt-5">
              <div className="text-center">
                <p className="text-xl md:text-2xl font-bold text-neutral-900">{hooks.length}</p>
                <p className="text-xs text-neutral-500 mt-0.5">Hooks</p>
              </div>
              <div className="w-px h-10 bg-neutral-200" />
              <div className="text-center">
                <p className="text-xl md:text-2xl font-bold text-neutral-900">
                  {hooks.reduce((sum, h) => sum + (h.views || h.view_count || 0), 0)}
                </p>
                <p className="text-xs text-neutral-500 mt-0.5">Views</p>
              </div>
              <div className="w-px h-10 bg-neutral-200" />
              <div className="text-center">
                <p className="text-xl md:text-2xl font-bold text-neutral-900">
                  {hooks.reduce((sum, h) => sum + (h.clicks || 0), 0)}
                </p>
                <p className="text-xs text-neutral-500 mt-0.5">Clicks</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Edit Form Section */}
      <section className="py-8 px-4">
        <div className="max-w-2xl mx-auto">

          {/* Message */}
          {message && (
            <div className={`rounded-xl p-3 flex items-center gap-2 mb-6 ${message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
              <p className={`text-sm ${message.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>{message.text}</p>
              <button onClick={() => setMessage(null)} className="ml-auto"><X className="w-4 h-4 text-neutral-400" /></button>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-neutral-100 p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-purple-600" />
              Edit Profile Details
            </h2>

            <div className="space-y-5">
              {/* Display Name */}
              <div>
                <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Display Name</label>
                <Input 
                  value={displayName} 
                  onChange={(e) => setDisplayName(e.target.value)} 
                  className="rounded-xl h-11" 
                  placeholder="Your display name" 
                />
              </div>

              {/* Bio */}
              <div>
                <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Bio</label>
                <Textarea 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)} 
                  className="rounded-xl min-h-[100px] resize-none" 
                  placeholder="Tell us about yourself..." 
                  maxLength={200} 
                />
                <p className="text-xs text-neutral-400 mt-1 text-right">{bio.length}/200</p>
              </div>

              {/* Location & Website */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-neutral-700 mb-1.5 block flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" /> 
                    Location
                  </label>
                  <Input 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)} 
                    className="rounded-xl h-11" 
                    placeholder="City, Country" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700 mb-1.5 block flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-neutral-400" /> 
                    Website
                  </label>
                  <Input 
                    value={website} 
                    onChange={(e) => setWebsite(e.target.value)} 
                    className="rounded-xl h-11" 
                    placeholder="https://yourwebsite.com" 
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-neutral-100">
              <Link href={`/creator/${creator?.username || urlUsername}`}>
                <Button variant="outline" className="rounded-full gap-2 h-11 px-6">
                  <ArrowLeft className="w-4 h-4" /> View Profile
                </Button>
              </Link>
              <Button
                onClick={handleSaveProfile}
                disabled={saving || !creator}
                className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-full gap-2 h-11 px-6"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Hooks Management */}
      <section className="py-8 px-4 bg-neutral-50/50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-neutral-100 p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-rose-500" />
              Manage Your Hooks
            </h2>

            {hooks.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                  <ExternalLink className="w-8 h-8 text-neutral-300" />
                </div>
                <p className="text-neutral-500 text-sm">
                  No hooks yet.{' '}
                  <Link href="/hook/new" className="text-purple-600 hover:underline font-medium">
                    Create your first hook
                  </Link>
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {hooks.map((hook) => {
                  const typeConfig = HOOK_TYPE_CONFIG[hook.type || 'link']
                  const TypeIcon = typeConfig.icon

                  return (
                    <div key={hook.id} className="flex items-center gap-4 p-4 rounded-2xl border border-neutral-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all group">
                      <img
                        src={hook.image_url || hook.images?.[0]}
                        alt={hook.title}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-neutral-900 truncate text-sm">{hook.title}</h3>
                          <Badge className={`${typeConfig.color} text-white border-0 text-[10px]`}>
                            <TypeIcon className="w-3 h-3 mr-1" />
                            {typeConfig.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-neutral-400">
                          <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {hook.views || hook.view_count || 0}</span>
                          <span className="flex items-center gap-1"><MousePointerClick className="w-3 h-3" /> {hook.clicks || 0}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(hook.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Link href={`/hook/${hook.slug}`}>
                          <Button variant="ghost" size="sm" className="rounded-full text-neutral-500 hover:text-purple-600 h-9 w-9 p-0">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          onClick={() => handleDeleteHook(hook.slug)}
                          disabled={deletingHookId === hook.slug}
                          variant="ghost"
                          size="sm"
                          className="rounded-full text-neutral-500 hover:text-red-600 hover:bg-red-50 h-9 w-9 p-0"
                        >
                          {deletingHookId === hook.slug ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}