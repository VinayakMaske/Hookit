// src/app/hooker/onboarding/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Sparkles, CheckCircle2, ArrowRight, Plane, Palette, Camera, ShoppingBag, Sparkles as SparklesIcon, Utensils, Laptop, Gamepad2, Heart, Music, BookOpen, Dumbbell, Home, Car, Baby, Briefcase, Film, PenTool } from 'lucide-react'

const ALL_CATEGORIES = [
  { name: 'Travel', slug: 'travel', icon: Plane, color: 'from-purple-500 to-indigo-500', bgColor: 'bg-purple-50', borderColor: 'border-purple-200', textColor: 'text-purple-700' },
  { name: 'Art', slug: 'art', icon: Palette, color: 'from-pink-500 to-rose-500', bgColor: 'bg-pink-50', borderColor: 'border-pink-200', textColor: 'text-pink-700' },
  { name: 'Photography', slug: 'photography', icon: Camera, color: 'from-violet-500 to-purple-500', bgColor: 'bg-violet-50', borderColor: 'border-violet-200', textColor: 'text-violet-700' },
  { name: 'Products', slug: 'products', icon: ShoppingBag, color: 'from-fuchsia-500 to-pink-500', bgColor: 'bg-fuchsia-50', borderColor: 'border-fuchsia-200', textColor: 'text-fuchsia-700' },
  { name: 'Fashion', slug: 'fashion', icon: SparklesIcon, color: 'from-purple-600 to-indigo-500', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200', textColor: 'text-indigo-700' },
  { name: 'Food', slug: 'food', icon: Utensils, color: 'from-rose-500 to-orange-500', bgColor: 'bg-rose-50', borderColor: 'border-rose-200', textColor: 'text-rose-700' },
  { name: 'Technology', slug: 'technology', icon: Laptop, color: 'from-indigo-500 to-purple-500', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', textColor: 'text-blue-700' },
  { name: 'Gaming', slug: 'gaming', icon: Gamepad2, color: 'from-violet-600 to-fuchsia-500', bgColor: 'bg-violet-50', borderColor: 'border-violet-200', textColor: 'text-violet-700' },
  { name: 'Music', slug: 'music', icon: Music, color: 'from-amber-500 to-orange-500', bgColor: 'bg-amber-50', borderColor: 'border-amber-200', textColor: 'text-amber-700' },
  { name: 'Books', slug: 'books', icon: BookOpen, color: 'from-emerald-500 to-teal-500', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200', textColor: 'text-emerald-700' },
  { name: 'Fitness', slug: 'fitness', icon: Dumbbell, color: 'from-red-500 to-rose-500', bgColor: 'bg-red-50', borderColor: 'border-red-200', textColor: 'text-red-700' },
  { name: 'Home Decor', slug: 'home-decor', icon: Home, color: 'from-teal-500 to-cyan-500', bgColor: 'bg-teal-50', borderColor: 'border-teal-200', textColor: 'text-teal-700' },
  { name: 'Automotive', slug: 'automotive', icon: Car, color: 'from-slate-500 to-gray-500', bgColor: 'bg-slate-50', borderColor: 'border-slate-200', textColor: 'text-slate-700' },
  { name: 'Parenting', slug: 'parenting', icon: Baby, color: 'from-sky-500 to-blue-500', bgColor: 'bg-sky-50', borderColor: 'border-sky-200', textColor: 'text-sky-700' },
  { name: 'Business', slug: 'business', icon: Briefcase, color: 'from-zinc-500 to-neutral-500', bgColor: 'bg-zinc-50', borderColor: 'border-zinc-200', textColor: 'text-zinc-700' },
  { name: 'Movies', slug: 'movies', icon: Film, color: 'from-red-600 to-rose-600', bgColor: 'bg-red-50', borderColor: 'border-red-200', textColor: 'text-red-700' },
  { name: 'Writing', slug: 'writing', icon: PenTool, color: 'from-stone-500 to-stone-600', bgColor: 'bg-stone-50', borderColor: 'border-stone-200', textColor: 'text-stone-700' },
  { name: 'Lifestyle', slug: 'lifestyle', icon: Heart, color: 'from-pink-400 to-rose-400', bgColor: 'bg-pink-50', borderColor: 'border-pink-200', textColor: 'text-pink-700' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    setIsVisible(true)
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/hooker/login')
        return
      }
      setUser(user)
      
      // Check if user already has preferences
      const { data: prefs } = await supabase
        .from('hooker_preferences')
        .select('categories')
        .eq('user_id', user.id)
        .single()
      
      if (prefs?.categories && prefs.categories.length > 0) {
        router.push('/hooker/home')
      }
    }
    checkAuth()
  }, [router])

  const toggleCategory = (slug: string) => {
    setSelected(prev => 
      prev.includes(slug) 
        ? prev.filter(s => s !== slug)
        : prev.length < 8 ? [...prev, slug] : prev
    )
  }

  const handleContinue = async () => {
    if (selected.length === 0) return
    setLoading(true)
    
    const supabase = createClient()
    const { error } = await supabase
      .from('hooker_preferences')
      .insert({
        user_id: user.id,
        categories: selected,
      })
    
    if (error) {
      console.error(error)
      setLoading(false)
      return
    }
    
    router.push('/hooker/home')
  }

  const handleSkip = () => {
    router.push('/hooker/home')
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className={`max-w-2xl w-full text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          
          {/* Header */}
          <Badge className="mb-6 bg-purple-100 text-purple-700 hover:bg-purple-200 border-0 px-4 py-1.5 text-sm font-medium">
            <Sparkles className="w-3 h-3 mr-1" />
            Personalize Your Feed
          </Badge>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-4 leading-tight">
            What are you <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 bg-clip-text text-transparent">
              into?
            </span>
          </h1>
          
          <p className="text-lg text-neutral-500 mb-2 max-w-md mx-auto">
            Pick at least 3 categories you love. We'll curate your home feed with Hooks you'll enjoy.
          </p>
          
          <p className="text-sm text-neutral-400 mb-10">
            {selected.length}/8 selected {selected.length > 0 && <span className="text-purple-600 font-medium">— {selected.length} more to go!</span>}
          </p>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
            {ALL_CATEGORIES.map((cat, i) => {
              const isSelected = selected.includes(cat.slug)
              return (
                <button
                  key={cat.slug}
                  onClick={() => toggleCategory(cat.slug)}
                  className={`relative group p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                    isSelected 
                      ? `${cat.bgColor} ${cat.borderColor} shadow-lg scale-[1.02]` 
                      : 'bg-white border-neutral-200 hover:border-purple-200 hover:bg-purple-50/50 hover:shadow-md'
                  }`}
                  style={{ transitionDelay: `${i * 30}ms` }}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                    <cat.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className={`font-semibold text-sm ${isSelected ? cat.textColor : 'text-neutral-700'}`}>
                    {cat.name}
                  </p>
                  
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Selected preview */}
          {selected.length > 0 && (
            <div className="mb-8 flex flex-wrap justify-center gap-2">
              {selected.map(slug => {
                const cat = ALL_CATEGORIES.find(c => c.slug === slug)
                return (
                  <Badge 
                    key={slug} 
                    className={`${cat?.bgColor} ${cat?.textColor} ${cat?.borderColor} border gap-1 px-3 py-1.5 cursor-pointer hover:opacity-70 transition-opacity`}
                    onClick={() => toggleCategory(slug)}
                  >
                    {cat?.name} <span className="ml-1">×</span>
                  </Badge>
                )
              })}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button
              onClick={handleContinue}
              disabled={selected.length < 3 || loading}
              className="w-full sm:w-auto h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white text-lg font-medium px-10 gap-2 disabled:opacity-40 shadow-lg shadow-purple-500/20 hover:shadow-xl transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
            
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-neutral-400 hover:text-neutral-600"
            >
              Skip for now
            </Button>
          </div>

          <p className="text-xs text-neutral-400 mt-6">
            You can always change these later in Settings
          </p>
        </div>
      </div>
    </div>
  )
}