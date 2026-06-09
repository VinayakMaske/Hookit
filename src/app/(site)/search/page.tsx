// src/app/(site)/search/page.tsx
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Search,
  ArrowRight,
  Sparkles,
  ExternalLink,
  BookOpen,
  ShoppingBag,
  X,
  Eye,
  MousePointerClick,
  Loader2,
  User,
  Clock,
  Layers,
  Grid3X3,
  Users,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react'

// ============================================
// CATEGORY COLORS
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
// TYPE CONFIG
// ============================================
const TYPE_CONFIG: Record<string, { icon: React.ElementType; label: string; color: string; bgColor: string; textColor: string }> = {
  link: { icon: ExternalLink, label: 'Link', color: 'bg-blue-500', bgColor: 'bg-blue-50', textColor: 'text-blue-700' },
  blog: { icon: BookOpen, label: 'Blog', color: 'bg-purple-500', bgColor: 'bg-purple-50', textColor: 'text-purple-700' },
  product: { icon: ShoppingBag, label: 'Product', color: 'bg-emerald-500', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700' },
}

// ============================================
// FILTER TABS
// ============================================
const RESULT_TABS = [
  { id: 'all', label: 'All', icon: Layers },
  { id: 'hooks', label: 'Hooks', icon: Grid3X3 },
  { id: 'creators', label: 'Creators', icon: Users },
]

const TYPE_FILTERS = [
  { id: 'all', label: 'All Types', icon: Layers },
  { id: 'link', label: 'Links', icon: ExternalLink },
  { id: 'blog', label: 'Blogs', icon: BookOpen },
  { id: 'product', label: 'Products', icon: ShoppingBag },
]

// ============================================
// HOOK CARD
// ============================================
function HookCard({ hook }: { hook: any }) {
  const [isHovered, setIsHovered] = useState(false)
  const hookType = hook.type || 'link'
  const price = hook.price || hook.product_price
  const viewCount = hook.views || hook.view_count || 0
  const clickCount = hook.clicks || hook.click_count || 0
  const typeConfig = TYPE_CONFIG[hookType]
  const TypeIcon = typeConfig.icon

  const imageUrl = hook.images?.[0] || hook.image_url || hook.src || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=500&fit=crop'

  return (
    <Link href={`/hook/${hook.slug}`} className="block break-inside-avoid mb-4">
      <div
        className="group relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          <img
            src={imageUrl}
            alt={hook.title}
            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          <div className="absolute top-2 right-2">
            <div className={`p-1.5 ${typeConfig.color} backdrop-blur-sm rounded-full shadow-lg`}>
              <TypeIcon className="w-3 h-3 text-white" />
            </div>
          </div>

          <Badge className={`absolute top-2 left-2 bg-gradient-to-r ${CATEGORY_COLORS[hook.category?.toLowerCase() || 'art']} text-white border-0 text-[10px] backdrop-blur-sm shadow-lg px-2 py-0.5`}>
            {hook.category}
          </Badge>

          {price && (
            <div className="absolute bottom-2 left-2 bg-emerald-500 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-lg">
              ${price}
            </div>
          )}
        </div>

        <div className="p-3">
          <h3 className="font-semibold text-neutral-900 text-sm mb-1 line-clamp-2 leading-tight group-hover:text-purple-600 transition-colors">{hook.title}</h3>
          <div className="flex items-center justify-between">
            <span className="text-neutral-500 text-xs">@{hook.creator_name || hook.creator || 'anonymous'}</span>
            <div className="flex items-center gap-2 text-neutral-400 text-[10px]">
              <span className="flex items-center gap-0.5">
                <Eye className="w-3 h-3" />
                {viewCount >= 1000 ? `${(viewCount / 1000).toFixed(1)}K` : viewCount}
              </span>
              <span className="flex items-center gap-0.5">
                <MousePointerClick className="w-3 h-3" />
                {clickCount >= 1000 ? `${(clickCount / 1000).toFixed(1)}K` : clickCount}
              </span>
            </div>
          </div>
        </div>

        <div className={`absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent transition-opacity duration-300 pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${typeConfig.bgColor} ${typeConfig.textColor}`}>
              <TypeIcon className="w-3 h-3" />
              {typeConfig.label}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

// ============================================
// CREATOR CARD
// ============================================
function CreatorCard({ creator }: { creator: any }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link href={`/creator/${creator.username}`} className="block">
      <div
        className="group bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
            {(creator.display_name || creator.username || 'A')[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-neutral-900 truncate group-hover:text-purple-600 transition-colors">
                {creator.display_name || creator.username}
              </h3>
              {creator.is_verified && (
                <Badge className="bg-blue-100 text-blue-700 border-0 text-[10px] px-1.5 py-0">
                  ✓
                </Badge>
              )}
            </div>
            <p className="text-sm text-neutral-500">@{creator.username}</p>
          </div>
          <div className={`transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}>
            <ChevronRight className="w-5 h-5 text-neutral-300 group-hover:text-purple-500" />
          </div>
        </div>

        {creator.bio && (
          <p className="text-sm text-neutral-600 mt-3 line-clamp-2 leading-relaxed">
            {creator.bio}
          </p>
        )}

        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-neutral-100 text-xs text-neutral-500">
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-semibold text-neutral-700">{(creator.total_views || 0).toLocaleString()}</span> views
          </span>
          <span className="flex items-center gap-1">
            <MousePointerClick className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-semibold text-neutral-700">{(creator.total_clicks || 0).toLocaleString()}</span> clicks
          </span>
        </div>
      </div>
    </Link>
  )
}

// ============================================
// SEARCH CONTENT
// ============================================
function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get('q') || ''

  const [query, setQuery] = useState(initialQuery)
  const [searchInput, setSearchInput] = useState(initialQuery)
  const [activeTab, setActiveTab] = useState<'all' | 'hooks' | 'creators'>('all')
  const [activeType, setActiveType] = useState<'all' | 'link' | 'blog' | 'product'>('all')
  const [hooks, setHooks] = useState<any[]>([])
  const [creators, setCreators] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    if (initialQuery) {
      performSearch(initialQuery)
    }
  }, [])

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim() && activeType === 'all') {
      setHooks([])
      setCreators([])
      setSearched(true)
      return
    }

    setLoading(true)
    setSearched(true)

    try {
      const params = new URLSearchParams()
      if (searchQuery.trim()) params.set('q', searchQuery.trim())
      if (activeType !== 'all') params.set('type', activeType)

      const res = await fetch(`/api/search?${params.toString()}`)
      if (!res.ok) throw new Error('Search failed')
      const data = await res.json()
      setHooks(data.hooks || [])
      setCreators(data.creators || [])
    } catch (err) {
      setHooks([])
      setCreators([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setQuery(searchInput)
    router.push(`/search?q=${encodeURIComponent(searchInput)}`, { scroll: false })
    performSearch(searchInput)
  }

  const clearSearch = () => {
    setSearchInput('')
    setQuery('')
    setHooks([])
    setCreators([])
    setSearched(false)
    router.push('/search', { scroll: false })
  }

  // Re-search when type filter changes
  useEffect(() => {
    if (searched && (query || activeType !== 'all')) {
      performSearch(query)
    }
  }, [activeType])

  const filteredHooks = activeTab === 'creators' ? [] : hooks
  const filteredCreators = activeTab === 'hooks' ? [] : creators

  const totalResults = filteredHooks.length + filteredCreators.length

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Search Section */}
      <section className="relative pt-24 pb-8 lg:pt-32 lg:pb-12 overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Badge className="mb-4 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-0 px-4 py-1.5 text-sm font-medium">
              <Sparkles className="w-3 h-3 mr-1" />
              Discover Everything
            </Badge>

            <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 leading-tight mb-4">
              Search{' '}
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 bg-clip-text text-transparent">
                Every Hook
              </span>
            </h1>

            <p className="text-lg text-neutral-500 mb-8">
              Find hooks, creators, and ideas in one search.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <Input
                  placeholder="Search hooks, creators, topics..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-14 pr-14 h-16 bg-white border-neutral-200 text-lg rounded-2xl shadow-lg shadow-purple-100/50 focus:ring-2 focus:ring-purple-500/20"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-5 top-1/2 -translate-y-1/2 p-1.5 hover:bg-neutral-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-neutral-400" />
                  </button>
                )}
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="mt-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full h-12 px-8 gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </form>

            {/* Quick Suggestions */}
            {!searched && (
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {['Art', 'Photography', 'Travel', 'Technology', 'Fashion', 'Food', 'Gaming'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSearchInput(tag)
                      setQuery(tag)
                      router.push(`/search?q=${encodeURIComponent(tag)}`, { scroll: false })
                      performSearch(tag)
                    }}
                    className="px-4 py-2 rounded-full bg-white text-neutral-600 text-sm border border-neutral-200 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 transition-all shadow-sm"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="absolute top-20 left-0 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-200/20 rounded-full blur-3xl -z-10" />
      </section>

      {/* Results Section */}
      {searched && (
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Result Tabs */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {RESULT_TABS.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  const count = tab.id === 'all' ? totalResults : tab.id === 'hooks' ? filteredHooks.length : filteredCreators.length
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md shadow-purple-200'
                          : 'bg-white text-neutral-600 border border-neutral-200 hover:border-purple-300 hover:text-purple-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                      <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${isActive ? 'bg-white/20' : 'bg-neutral-100 text-neutral-500'}`}>
                        {count}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Type Filter (only for hooks tab) */}
            {(activeTab === 'all' || activeTab === 'hooks') && filteredHooks.length > 0 && (
              <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                {TYPE_FILTERS.map((filter) => {
                  const Icon = filter.icon
                  const isActive = activeType === filter.id
                  return (
                    <button
                      key={filter.id}
                      onClick={() => setActiveType(filter.id as any)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                        isActive
                          ? 'bg-neutral-900 text-white shadow-md'
                          : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {filter.label}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Results Count */}
            {totalResults > 0 && (
              <p className="text-sm text-neutral-500 mb-6">
                Found <span className="font-semibold text-neutral-900">{totalResults}</span> results for "{query}"
              </p>
            )}

            {/* Loading */}
            {loading && (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
              </div>
            )}

            {/* No Results */}
            {!loading && searched && totalResults === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-lg font-medium text-neutral-900 mb-2">No results found</h3>
                <p className="text-neutral-500 mb-6">Try a different search term or browse explore</p>
                <Link href="/explore">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full px-8 gap-2">
                    Explore Hooks
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            )}

            {/* Results Grid */}
            {!loading && totalResults > 0 && (
              <div>
                {/* Creators Section */}
                {filteredCreators.length > 0 && (activeTab === 'all' || activeTab === 'creators') && (
                  <div className="mb-10">
                    <h2 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-500" />
                      Creators
                      <span className="text-sm font-normal text-neutral-500">({filteredCreators.length})</span>
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredCreators.map((creator) => (
                        <CreatorCard key={creator.id} creator={creator} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Hooks Section */}
                {filteredHooks.length > 0 && (activeTab === 'all' || activeTab === 'hooks') && (
                  <div>
                    <h2 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                      <Grid3X3 className="w-5 h-5 text-purple-500" />
                      Hooks
                      <span className="text-sm font-normal text-neutral-500">({filteredHooks.length})</span>
                    </h2>
                    <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4">
                      {filteredHooks.map((hook) => (
                        <HookCard key={hook.id} hook={hook} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA */}
      {!searched && (
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-10 md:p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

              <h2 className="text-2xl md:text-3xl font-bold mb-4 relative z-10">
                Can't find what you need?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto relative z-10">
                Create your own Hook and share it with the world. No signup needed at all.
              </p>
              <Link href="/hook/new" className="relative z-10 inline-block">
                <Button size="lg" className="bg-white text-purple-700 hover:bg-white/90 rounded-full h-14 px-10 text-lg gap-2 shadow-xl">
                  <Sparkles className="w-5 h-5" />
                  Create a Hook
                  <ArrowUpRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}