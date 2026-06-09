'use client'

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
  Globe, MapPin
} from 'lucide-react'
import { updateProfile, updateUsername, deleteHook } from '@/app/actions/creator'

const HOOK_TYPE_CONFIG: Record<string, { icon: any; label: string; color: string }> = {
  link: { icon: ExternalLink, label: 'Link', color: 'bg-blue-500' },
  blog: { icon: BookOpen, label: 'Blog', color: 'bg-purple-500' },
  product: { icon: ShoppingBag, label: 'Product', color: 'bg-emerald-500' },
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

  useEffect(() => {
    fetchProfile()
  }, [urlUsername])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setMessage(null)
      
      const res = await fetch(`/api/creator/${urlUsername}`)
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
      setAvatarUrl(data.creator.avatar_url || '')
      setBannerUrl(data.creator.banner_url || '')
      setNewUsername(data.creator.username || '')
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

  const handleImageUpload = async (file: File, type: 'avatar' | 'banner') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', type === 'avatar' ? 'avatars' : 'banners')

    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    if (!res.ok) throw new Error('Upload failed')
    const data = await res.json()

    if (type === 'avatar') setAvatarUrl(data.url)
    else setBannerUrl(data.url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center pt-16">
        <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-16">
      {/* Banner */}
      <div className="relative h-48 sm:h-64 bg-gradient-to-br from-purple-600 via-pink-500 to-rose-500 overflow-hidden">
        {bannerUrl ? (
          <img src={bannerUrl} alt="" className="w-full h-full object-cover opacity-60" />
        ) : (
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1920&h=400&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        
        <label className="absolute bottom-4 right-4 cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'banner')}
          />
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-lg hover:bg-white transition-colors">
            <Camera className="w-4 h-4 text-neutral-700" />
          </div>
        </label>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-16 relative z-10 pb-20">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-neutral-100 p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 flex items-center justify-center text-white text-4xl font-bold shadow-xl border-4 border-white overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  (displayName || creator?.username || urlUsername)[0].toUpperCase()
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'avatar')}
                />
                <div className="bg-white rounded-full p-1.5 shadow-lg border border-neutral-200">
                  <Camera className="w-3.5 h-3.5 text-neutral-600" />
                </div>
              </label>
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-neutral-900 mb-1">Edit Profile</h1>
              
              {/* Username with edit option */}
              <div className="flex items-center gap-2 mb-4">
                {!showUsernameEdit ? (
                  <>
                    <p className="text-neutral-500">@{creator?.username || urlUsername}</p>
                    <button 
                      onClick={() => setShowUsernameEdit(true)}
                      className="text-xs text-purple-600 hover:text-purple-700 underline"
                    >
                      Change
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-neutral-500">@</span>
                    <Input
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase())}
                      className="h-8 rounded-lg text-sm w-48"
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

              {message && (
                <div className={`rounded-xl p-3 flex items-center gap-2 mb-4 ${message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  {message.type === 'success' ? <Save className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
                  <p className={`text-sm ${message.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>{message.text}</p>
                  <button onClick={() => setMessage(null)} className="ml-auto"><X className="w-4 h-4 text-neutral-400" /></button>
                </div>
              )}

              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium text-neutral-700 mb-1 block">Display Name</label>
                  <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="rounded-xl" placeholder="Your display name" />
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700 mb-1 block">Bio</label>
                  <Textarea value={bio} onChange={(e) => setBio(e.target.value)} className="rounded-xl min-h-[80px]" placeholder="Tell us about yourself..." maxLength={200} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-neutral-700 mb-1 block flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Location</label>
                    <Input value={location} onChange={(e) => setLocation(e.target.value)} className="rounded-xl" placeholder="City, Country" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-700 mb-1 block flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> Website</label>
                    <Input value={website} onChange={(e) => setWebsite(e.target.value)} className="rounded-xl" placeholder="https://yourwebsite.com" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Link href={`/creator/${creator?.username || urlUsername}`}>
                  <Button variant="outline" className="rounded-full gap-2">
                    <ArrowLeft className="w-4 h-4" /> View Profile
                  </Button>
                </Link>
                <Button
                  onClick={handleSaveProfile}
                  disabled={saving || !creator}
                  className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Hooks Management */}
        <div className="bg-white rounded-3xl shadow-xl border border-neutral-100 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-rose-500" />
            Manage Your Hooks
          </h2>

          {hooks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-neutral-500">No hooks yet. <Link href="/hook/new" className="text-purple-600 hover:underline">Create your first hook</Link></p>
            </div>
          ) : (
            <div className="space-y-4">
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
                        <h3 className="font-semibold text-neutral-900 truncate">{hook.title}</h3>
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
                    <div className="flex items-center gap-2">
                      <Link href={`/hook/${hook.id}`}>
                        <Button variant="ghost" size="sm" className="rounded-full text-neutral-500 hover:text-purple-600">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        onClick={() => handleDeleteHook(hook.id)}
                        disabled={deletingHookId === hook.id}
                        variant="ghost"
                        size="sm"
                        className="rounded-full text-neutral-500 hover:text-red-600 hover:bg-red-50"
                      >
                        {deletingHookId === hook.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}