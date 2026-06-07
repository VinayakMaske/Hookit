// src/app/hooker/settings/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  User,
  Mail,
  Phone,
  LogOut,
  Loader2,
  Camera,
  Heart,
  Bookmark,
  Eye,
  Settings,
  ChevronRight,
  Shield,
  Bell,
  Moon,
  Globe,
  Trash2,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react'
import Link from 'next/link'

export default function HookerSettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'preferences'>('profile')
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    bio: '',
    avatar_url: '',
  })

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/hooker/login')
        return
      }
      
      setUser(user)
      setFormData({
        fullName: user.user_metadata?.full_name || '',
        email: user.email || '',
        phone: user.user_metadata?.phone || '',
        bio: '',
        avatar_url: '',
      })

      // Fetch profile
      const { data: profileData } = await supabase
        .from('hooker_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (profileData) {
        setProfile(profileData)
        setFormData(prev => ({
          ...prev,
          bio: profileData.bio || '',
          avatar_url: profileData.avatar_url || '',
        }))
      }

      setLoading(false)
    }

    init()
  }, [router])

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    
    const supabase = createClient()
    
    // Update auth metadata
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        full_name: formData.fullName,
        phone: formData.phone,
      }
    })

    if (authError) {
      setMessage('Failed to update profile')
      setSaving(false)
      return
    }

    // Update profile table
    const { error: profileError } = await supabase
      .from('hooker_profiles')
      .upsert({
        user_id: user.id,
        email: user.email,
        full_name: formData.fullName,
        phone: formData.phone,
        bio: formData.bio,
        avatar_url: formData.avatar_url,
      })

    if (profileError) {
      setMessage('Failed to save profile')
      setSaving(false)
      return
    }

    setMessage('Profile updated!')
    setTimeout(() => setMessage(''), 3000)
    setSaving(false)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure? This will permanently delete your account and all your hooks.')) return
    
    const supabase = createClient()
    await supabase.auth.admin.deleteUser(user.id)
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Settings },
  ]

  const stats = [
    { label: 'Hooks', value: '0', icon: Camera },
    { label: 'Likes', value: '0', icon: Heart },
    { label: 'Saves', value: '0', icon: Bookmark },
    { label: 'Views', value: '0', icon: Eye },
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-100">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/hooker/home">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
                <Settings className="w-4 h-4 text-white" />
              </div>
            </Link>
            <h1 className="text-xl font-bold text-neutral-900">Settings</h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {(formData.fullName || 'U').charAt(0).toUpperCase()}
              </div>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full shadow-md border border-neutral-200 flex items-center justify-center hover:bg-neutral-50">
                <Camera className="w-4 h-4 text-neutral-600" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-neutral-900">{formData.fullName || 'Anonymous'}</h2>
              <p className="text-neutral-500 text-sm">{user?.email}</p>
              <Badge className="mt-2 bg-purple-100 text-purple-700 border-0 text-xs">
                Hooker
              </Badge>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-neutral-100">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-5 h-5 text-neutral-400 mx-auto mb-1" />
                <p className="text-lg font-bold text-neutral-900">{stat.value}</p>
                <p className="text-xs text-neutral-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === item.id
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:border-purple-300'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 space-y-5">
            <h3 className="font-semibold text-neutral-900 mb-4">Edit Profile</h3>
            
            <div className="space-y-2">
              <Label className="text-neutral-700">Full Name</Label>
              <Input
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="h-12 rounded-xl border-neutral-200 focus:border-purple-500"
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-neutral-700">Email</Label>
              <Input
                value={formData.email}
                disabled
                className="h-12 rounded-xl border-neutral-200 bg-neutral-50 text-neutral-400"
              />
              <p className="text-xs text-neutral-400">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label className="text-neutral-700">Phone</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="h-12 rounded-xl border-neutral-200 focus:border-purple-500"
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-neutral-700">Bio</Label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full min-h-[100px] rounded-xl border border-neutral-200 p-3 text-sm focus:border-purple-500 focus:ring-purple-500/20 outline-none resize-none"
                placeholder="Tell us about yourself..."
                maxLength={200}
              />
              <p className="text-xs text-neutral-400 text-right">{formData.bio.length}/200</p>
            </div>

            {message && (
              <div className={`p-3 rounded-xl text-sm flex items-center gap-2 ${
                message.includes('updated') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {message.includes('updated') ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                {message}
              </div>
            )}

            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white text-lg font-medium hover:shadow-lg transition-all"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        )}

        {/* Account Tab */}
        {activeTab === 'account' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
              <h3 className="font-semibold text-neutral-900 mb-4">Security</h3>
              
              <Link href="/hooker/forgot-password">
                <button className="w-full flex items-center justify-between p-4 rounded-xl border border-neutral-200 hover:border-purple-300 hover:bg-purple-50 transition-all text-left group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">Change Password</p>
                      <p className="text-sm text-neutral-400">Update your password</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-purple-600" />
                </button>
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
              <h3 className="font-semibold text-neutral-900 mb-4 text-red-600">Danger Zone</h3>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-neutral-200 hover:border-amber-300 hover:bg-amber-50 transition-all text-left group mb-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <LogOut className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">Log Out</p>
                    <p className="text-sm text-neutral-400">Sign out of your account</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-amber-600" />
              </button>

              <button
                onClick={handleDeleteAccount}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-red-200 hover:bg-red-50 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-red-600">Delete Account</p>
                    <p className="text-sm text-neutral-400">Permanently delete your account</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-red-400" />
              </button>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <h3 className="font-semibold text-neutral-900 mb-4">App Preferences</h3>
            
            <Link href="/hooker/onboarding">
              <button className="w-full flex items-center justify-between p-4 rounded-xl border border-neutral-200 hover:border-purple-300 hover:bg-purple-50 transition-all text-left group mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">Update Interests</p>
                    <p className="text-sm text-neutral-400">Change your category preferences</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-purple-600" />
              </button>
            </Link>

            <div className="flex items-center justify-between p-4 rounded-xl border border-neutral-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-neutral-600" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900">Notifications</p>
                  <p className="text-sm text-neutral-400">Push and email notifications</p>
                </div>
              </div>
              <div className="w-11 h-6 bg-neutral-200 rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}