// src/app/(site)/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowRight,
  Sparkles,
  ExternalLink,
  FileText,
  ShoppingBag,
  Eye,
  Layers,
  CheckCircle2,
  Search,
  Palette,
  Camera,
  Plane,
  Laptop,
  Gamepad2,
  Utensils,
  ArrowUpRight,
  Heart,
  Share2,
  Network,
  Rocket,
  X,
  TrendingUp,
  Users,
  Compass,
  ChevronRight,
} from 'lucide-react'

// ============================================
// DATA
// ============================================

const POPULAR_SEARCHES = [
  'best ai startup tools',
  'cozy tiny house ideas',
  'handmade earrings india',
  'best castles in japan',
  'modern wall art prints',
  'hidden places in switzerland',
  'atomic habits book summary',
  'minimal home decor ideas',
  'event photography tips',
  'authentic pizza recipe',
  'best hiking trails europe',
  'digital nomad gear',
  'minimalist desk setup',
  'indoor plant care guide',
]

const TRENDING_NOW = [
  {
    src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=500&fit=crop',
    title: 'Minimal Watch Design',
    creator: 'alexdesign',
    type: 'product',
    search: 'minimal watch design',
    views: '1.2K',
  },
  {
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
    title: 'Portrait Photography Guide',
    creator: 'sarahclicks',
    type: 'link',
    search: 'portrait photography guide',
    views: '3.4K',
  },
  {
    src: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=550&fit=crop',
    title: 'Swiss Alps Travel Guide',
    creator: 'travelbug',
    type: 'blog',
    search: 'swiss alps travel guide',
    views: '8.9K',
  },
  {
    src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=520&fit=crop',
    title: 'Best AI Startup Tools',
    creator: 'devlife',
    type: 'link',
    search: 'best ai startup tools',
    views: '4.1K',
  },
  {
    src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=500&fit=crop',
    title: 'Retro Gaming Collection',
    creator: 'pixelpro',
    type: 'link',
    search: 'retro gaming collection',
    views: '3.2K',
  },
  {
    src: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=450&fit=crop',
    title: 'The Future of Abstract Art',
    creator: 'mayaarts',
    type: 'blog',
    search: 'future of abstract art',
    views: '5.6K',
  },
  {
    src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=480&fit=crop',
    title: 'Street Fashion Trends',
    creator: 'styleicon',
    type: 'blog',
    search: 'street fashion trends',
    views: '2.8K',
  },
  {
    src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=470&fit=crop',
    title: 'Authentic Pizza Recipe',
    creator: 'chefmike',
    type: 'blog',
    search: 'authentic pizza recipe',
    views: '4.5K',
  },
]

const CATEGORIES = [
  {
    name: 'Travel',
    slug: 'travel',
    icon: Plane,
    color: 'from-sky-400 to-blue-500',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=300&h=400&fit=crop',
    count: '2.4K hooks',
  },
  {
    name: 'Art',
    slug: 'art',
    icon: Palette,
    color: 'from-pink-400 to-rose-500',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=400&fit=crop',
    count: '1.8K hooks',
  },
  {
    name: 'Photography',
    slug: 'photography',
    icon: Camera,
    color: 'from-violet-400 to-purple-500',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
    count: '3.1K hooks',
  },
  {
    name: 'Products',
    slug: 'products',
    icon: ShoppingBag,
    color: 'from-emerald-400 to-teal-500',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=400&fit=crop',
    count: '4.2K hooks',
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    icon: Sparkles,
    color: 'from-fuchsia-400 to-pink-500',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&h=400&fit=crop',
    count: '1.5K hooks',
  },
  {
    name: 'Food',
    slug: 'food',
    icon: Utensils,
    color: 'from-amber-400 to-orange-500',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=400&fit=crop',
    count: '2.9K hooks',
  },
  {
    name: 'Technology',
    slug: 'technology',
    icon: Laptop,
    color: 'from-indigo-400 to-blue-500',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&h=400&fit=crop',
    count: '3.7K hooks',
  },
  {
    name: 'Gaming',
    slug: 'gaming',
    icon: Gamepad2,
    color: 'from-violet-500 to-fuchsia-500',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=400&fit=crop',
    count: '1.2K hooks',
  },
]

const CREATOR_EXAMPLES = [
  {
    title: 'Hidden Villages of Switzerland',
    creator: 'travelwithmaya',
    type: 'Travel Creator',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=500&fit=crop',
    searches: ['hidden places in switzerland', 'best villages in europe'],
    hooks: 47,
    views: '12.5K',
  },
  {
    title: 'Abstract Watercolor Collection',
    creator: 'artflow',
    type: 'Artist',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=500&fit=crop',
    searches: ['watercolor wall art', 'modern watercolor paintings'],
    hooks: 23,
    views: '8.3K',
  },
  {
    title: 'Best AI Tools For Startups',
    creator: 'founderstack',
    type: 'AI Founder',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=500&fit=crop',
    searches: ['ai startup tools', 'tools for ai founders'],
    hooks: 62,
    views: '24.1K',
  },
]

const STATS = [
  {
    value: '12,847',
    label: 'Hooks Created',
    icon: Layers,
  },
  {
    value: '3,291',
    label: 'Active Creators',
    icon: Users,
  },
  {
    value: '2.4M',
    label: 'Total Discovery Views',
    icon: Eye,
  },
  {
    value: '28',
    label: 'Categories',
    icon: Compass,
  },
]

// ============================================
// COMPONENTS
// ============================================

function HookTypeBadge({ type }: { type: string }) {
  const configs = {
    link: {
      icon: ExternalLink,
      label: 'Link',
      color: 'bg-blue-500/15 text-blue-700 border-blue-200',
    },
    blog: {
      icon: FileText,
      label: 'Blog',
      color: 'bg-purple-500/15 text-purple-700 border-purple-200',
    },
    product: {
      icon: ShoppingBag,
      label: 'Product',
      color: 'bg-emerald-500/15 text-emerald-700 border-emerald-200',
    },
  }

  const config = configs[type as keyof typeof configs] || configs.link
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${config.color} backdrop-blur-sm`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  )
}

function SearchSimulation() {
  const [searchText, setSearchText] = useState('')
  const [showResults, setShowResults] = useState(false)
  const fullText = 'best ai startup tools'

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    let intervalId: NodeJS.Timeout

    const startTyping = () => {
      setShowResults(false)
      let i = 0
      intervalId = setInterval(() => {
        if (i <= fullText.length) {
          setSearchText(fullText.slice(0, i))
          i++
        } else {
          clearInterval(intervalId)
          setShowResults(true)
          // Reset after 3 seconds of showing results
          timeoutId = setTimeout(() => {
            setSearchText('')
            setShowResults(false)
            // Start again after a brief pause
            timeoutId = setTimeout(startTyping, 500)
          }, 3000)
        }
      }, 80)
    }

    // Initial delay before first type
    timeoutId = setTimeout(startTyping, 1000)

    return () => {
      clearTimeout(timeoutId)
      clearInterval(intervalId)
    }
  }, [])

  return (
    <div className="w-full max-w-sm mx-auto lg:mx-0">
      <div className="relative">
        <div className="flex items-center gap-3 px-5 py-4 bg-white rounded-2xl border border-neutral-200 shadow-lg shadow-neutral-200/50">
          <Search className="w-5 h-5 text-neutral-400 flex-shrink-0" />
          <span className="text-neutral-800 font-medium text-sm">
            {searchText}
            <span className="animate-pulse">|</span>
          </span>
        </div>

        {showResults && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-neutral-200 shadow-xl overflow-hidden z-20">
            <div className="p-2">
              {[
                { title: 'Best AI Startup Tools 2026', creator: 'devlife', type: 'link' },
                { title: 'AI Tools for SaaS Founders', creator: 'founderstack', type: 'blog' },
                { title: 'Top 10 AI Productivity Tools', creator: 'techdaily', type: 'blog' },
              ].map((result, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-50 transition-colors"
                >
                  <Search className="w-4 h-4 text-purple-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-800 truncate">{result.title}</p>
                    <p className="text-xs text-neutral-500">by @{result.creator}</p>
                  </div>
                  <HookTypeBadge type={result.type} />
                </div>
              ))}
            </div>
            <div className="px-4 py-2.5 bg-neutral-50 border-t border-neutral-100 text-xs text-neutral-500 text-center">
              Powered by Hookit Discoverability Engine
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StepCard({
  number,
  icon: Icon,
  title,
  description,
  color,
  isLast,
}: {
  number: number
  icon: any
  title: string
  description: string
  color: string
  isLast: boolean
}) {
  return (
    <div className="relative flex flex-col items-center text-center">
      {/* Connector Line - positioned from right edge of icon to left edge of next */}
      {!isLast && (
        <div className="hidden lg:block absolute top-7 left-[60%] w-[80%] h-[2px] bg-neutral-200" />
      )}

      <div className="relative z-10 mb-5">
        <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center shadow-lg`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-neutral-900 text-white text-xs font-bold flex items-center justify-center border-2 border-white">
          {number}
        </div>
      </div>

      <h3 className="text-lg font-bold text-neutral-900 mb-2">{title}</h3>
      <p className="text-sm text-neutral-600 leading-relaxed max-w-[220px]">{description}</p>
    </div>
  )
}

function ComparisonCard({
  title,
  items,
  variant,
}: {
  title: string
  items: { text: string }[]
  variant: 'negative' | 'neutral' | 'positive'
}) {
  const styles = {
    negative: 'bg-white border-neutral-200',
    neutral: 'bg-white border-neutral-200',
    positive: 'bg-gradient-to-br from-purple-600 to-pink-600 border-transparent text-white',
  }

  return (
    <div className={`rounded-3xl border p-8 ${styles[variant]}`}>
      <h3 className={`text-xl font-bold mb-8 ${variant === 'positive' ? 'text-white' : 'text-neutral-900'}`}>
        {title}
      </h3>
      <div className="space-y-5">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-3.5">
            {variant === 'positive' ? (
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle2 className="w-3 h-3 text-white" />
              </div>
            ) : (
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${variant === 'negative' ? 'bg-red-50' : 'bg-amber-50'}`}>
                <X className={`w-3 h-3 ${variant === 'negative' ? 'text-red-500' : 'text-amber-500'}`} />
              </div>
            )}
            <span className={`text-sm ${variant === 'positive' ? 'text-white/90' : 'text-neutral-600'}`}>
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TrendingCard({ item }: { item: typeof TRENDING_NOW[0] }) {
  return (
    <Link
      href={`/search/${item.search.replace(/\s+/g, '-')}`}
      className="group block"
    >
      <div className="rounded-2xl overflow-hidden bg-white border border-neutral-200 hover:shadow-xl hover:shadow-neutral-200/50 hover:border-neutral-300 transition-all duration-500 hover:-translate-y-1">
        <div className="relative overflow-hidden">
          <img
            src={item.src}
            alt={item.title}
            className="w-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-3 left-3">
            <HookTypeBadge type={item.type} />
          </div>
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-neutral-800" />
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-base text-neutral-900 mb-1 group-hover:text-purple-600 transition-colors line-clamp-1">
            {item.title}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500">@{item.creator}</span>
            <div className="flex items-center gap-1 text-xs text-neutral-400">
              <Eye className="w-3 h-3" />
              {item.views}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

// ============================================
// MAIN PAGE
// ============================================

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-white">

      {/* ============================================ */}
      {/* HERO SECTION */}
      {/* ============================================ */}

      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/80 via-white to-pink-50/80" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '48px 48px' }} />
        <div className="absolute top-20 right-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-200/20 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex mb-6">
                <Badge className="bg-purple-100 text-purple-700 border-0 px-4 py-1.5 text-sm font-medium">
                  <Rocket className="w-3.5 h-3.5 mr-1.5" />
                  Post Once. Become Discoverable Everywhere.
                </Badge>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight text-neutral-900 leading-[1.08] mb-6">
                <span className="block">Turn Anything</span>
                <span className="block">Into A{' '}</span>
                <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                  Discoverable Page
                </span>
              </h1>

              <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-lg mb-8 mx-auto lg:mx-0">
                Upload a product, blog, video, research article, artwork, travel guide, 
                or any resource. Hookit transforms it into a searchable page 
                discoverable through Google, ChatGPT, Gemini, and AI search engines.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8 justify-center lg:justify-start">
                <Button
                  asChild
                  size="lg"
                  className="h-28 px-8 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-semibold shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all"
                >
                  <Link href="/hook/new">
                    Create A Hook
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 rounded-xl border-neutral-300 hover:border-purple-300 hover:bg-purple-50 font-semibold transition-all"
                >
                  <Link href="/explore">Explore Hooks</Link>
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-x-12 gap-y-6 justify-center lg:justify-start max-w-3xl mx-auto lg:mx-0 mb-4">
  {[
    'No website required',
    'No SEO knowledge needed',
    'No followers required',
    'Works for any content type',
  ].map((item) => (
    <div key={item} className="flex items-center gap-4">
      <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
      <span className="text-base md:text-lg text-neutral-700 font-medium">
        {item}
      </span>
    </div>
  ))}
</div>
            </div>

            {/* Right - Search Simulation + Featured Cards */}
            <div className="relative lg:pl-8">
              <SearchSimulation />

              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=300&fit=crop', title: 'Summer Fashion Collection', creator: 'stylestudio', type: 'product', delay: 0 },
                  { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', title: 'Hidden Villages of Switzerland', creator: 'wanderlust', type: 'blog', delay: 0.2 },
                  { src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop', title: 'Best AI Startup Tools', creator: 'devlife', type: 'link', delay: 0.4 },
                  { src: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop', title: 'Abstract Digital Art Prints', creator: 'artflow', type: 'product', delay: 0.6 },
                ].map((card) => (
                  <div
                    key={card.title}
                    className="rounded-xl overflow-hidden bg-white border border-neutral-200 shadow-md hover:shadow-lg transition-all duration-500 hover:-translate-y-1 cursor-pointer group"
                    style={{
  animationName: mounted ? 'floatHero' : undefined,
  animationDuration: '5s',
  animationTimingFunction: 'ease-in-out',
  animationIterationCount: 'infinite',
  animationDelay: `${card.delay}s`,
}}
                  >
                    <div className="relative h-28 sm:h-32 overflow-hidden">
                      <img src={card.src} alt={card.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute top-2 left-2">
                        <HookTypeBadge type={card.type} />
                      </div>
                    </div>
                    <div className="p-2.5">
                      <h4 className="font-semibold text-xs text-neutral-900 line-clamp-1">{card.title}</h4>
                      <p className="text-[10px] text-neutral-500">@{card.creator}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-neutral-900">
  <div className="max-w-7xl mx-auto px-6">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
      {STATS.map((stat) => {
        const Icon = stat.icon

        return (
          <div key={stat.label} className="text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mx-auto mb-6">
              <Icon className="w-8 h-8 text-purple-400" />
            </div>

            <div className="text-4xl md:text-5xl font-black text-white mb-3">
              {stat.value}
            </div>

            <div className="text-base text-neutral-400">
              {stat.label}
            </div>
          </div>
        )
      })}
    </div>
  </div>
</section>

      {/* ============================================ */}
      {/* WHY HOOKIT EXISTS */}
      {/* ============================================ */}

      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="inline-flex mb-5">
              <Badge className="bg-purple-100 text-purple-700 border-0 px-4 py-1.5 text-sm font-medium">
                Why Hookit Exists
              </Badge>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 mb-5">
              Instagram Posts Disappear.
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Hooks Keep Getting Discovered.
              </span>
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 max-w-xl mx-auto mb-5">
              Most content depends on algorithms. Hookit focuses on lasting discoverability.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-6">
            <ComparisonCard
              title="Social Media"
              variant="negative"
              items={[
                { text: 'Algorithm decides who sees it' },
                { text: 'Requires followers to reach anyone' },
                { text: 'Posts disappear within 48 hours' },
                { text: 'No search engine visibility' },
              ]}
            />
            <ComparisonCard
              title="Traditional SEO"
              variant="neutral"
              items={[
                { text: 'Needs a website or blog' },
                { text: 'Requires SEO expertise' },
                { text: 'Takes months to see results' },
                { text: 'Ongoing maintenance needed' },
              ]}
            />
            <ComparisonCard
              title="Hookit"
              variant="positive"
              items={[
                { text: 'Upload once, discoverable forever' },
                { text: 'No followers or website needed' },
                { text: 'AI-optimized for search engines' },
                { text: 'Works across all platforms' },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* HOW IT WORKS */}
      {/* ============================================ */}

      <section className="py-20 lg:py-28 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex mb-5">
              <Badge className="bg-purple-100 text-purple-700 border-0 px-4 py-1.5 text-sm font-medium">
                How It Works
              </Badge>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 mb-5">
              From Idea To Discovery
              <br />
              <span className="text-neutral-400">In Minutes</span>
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 max-w-xl mx-auto">
              No SEO expertise. No website. No complicated setup. Just four simple steps.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
            <StepCard number={1} icon={Share2} title="Upload Your Content" description="Add an image, title, category and destination link. Takes less than a minute." color="bg-gradient-to-br from-purple-500 to-purple-600" isLast={false} />
            <StepCard number={2} icon={Heart} title="Explain Why It Matters" description="Tell people why they should care. This helps AI understand and recommend your content." color="bg-gradient-to-br from-pink-500 to-rose-500" isLast={false} />
            <StepCard number={3} icon={Search} title="Add Search Queries" description="Add what people would search to discover it. We optimize the rest automatically." color="bg-gradient-to-br from-blue-500 to-indigo-500" isLast={false} />
            <StepCard number={4} icon={Rocket} title="Publish & Get Discovered" description="Hookit creates optimized pages that rank on Google, ChatGPT, Gemini, and more." color="bg-gradient-to-br from-emerald-500 to-teal-500" isLast={true} />
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* CATEGORIES */}
      {/* ============================================ */}

      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="inline-flex mb-5">
              <Badge className="bg-purple-100 text-purple-700 border-0 px-4 py-1.5 text-sm font-medium">
                Unlimited Possibilities
              </Badge>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 mb-5">
              Anything Can Become
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                A Hook
              </span>
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 max-w-xl mx-auto mb-5">
              If someone might search for it, it belongs on Hookit.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {CATEGORIES.map((category) => {
              const Icon = category.icon
              return (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  className="group relative rounded-2xl overflow-hidden border border-neutral-200 hover:border-neutral-300 hover:shadow-xl hover:shadow-neutral-200/50 transition-all duration-500"
                  style={{ paddingBottom: '125%' }}
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5">
                    <div className={`w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center mb-3 shadow-lg`}>
                      <Icon className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-lg lg:text-xl text-white mb-0.5">{category.name}</h3>
                    <p className="text-xs lg:text-sm text-white/70">{category.count}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* POPULAR SEARCHES */}
      {/* ============================================ */}

      <section className="py-20 lg:py-28 bg-neutral-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="inline-flex mb-5">
              <Badge className="bg-purple-100 text-purple-700 border-0 px-4 py-1.5 text-sm font-medium">
                Discoverability Engine
              </Badge>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 mb-5">
              Popular Searches
              <br />
              <span className="text-neutral-400">On Hookit</span>
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 max-w-xl mx-auto mb-5">
              Every search below is a real query that leads to discoverable Hooks.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2.5 lg:gap-3">
            {POPULAR_SEARCHES.map((search) => (
              <Link
                key={search}
                href={`/search/${search.replace(/\s+/g, '-')}`}
                className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-neutral-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 hover:shadow-md"
              >
                <Search className="w-3.5 h-3.5 text-neutral-400 group-hover:text-purple-500 transition-colors" />
                <span className="text-sm text-neutral-700 group-hover:text-purple-700 font-medium transition-colors">{search}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-purple-400 opacity-0 group-hover:opacity-100 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* DISCOVERY PATHS */}
      {/* ============================================ */}

      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex mb-5">
              <Badge className="bg-purple-100 text-purple-700 border-0 px-4 py-1.5 text-sm font-medium">
                The Hookit Graph
              </Badge>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 mb-5">
              One Hook.
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Multiple Discovery Paths.
              </span>
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 max-w-xl mx-auto">
              A single submission creates multiple ways for people to find your content.
            </p>
          </div>

          <div className="mb-14">
            <div className="flex flex-col md:flex-row items-stretch justify-center gap-4 md:gap-5 mb-5">
              <div className="flex-1 md:max-w-[220px] p-6 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 text-white text-center shadow-xl shadow-purple-500/20 flex flex-col items-center justify-center">
                <FileText className="w-8 h-8 mb-3" />
                <h3 className="font-bold text-lg">Your Hook</h3>
                <p className="text-sm text-white/80 mt-1">One upload</p>
              </div>

              <div className="flex items-center justify-center md:px-1">
                <ArrowRight className="w-6 h-6 text-neutral-300 hidden md:block" />
                <ChevronRight className="w-6 h-6 text-neutral-300 md:hidden" />
              </div>

              <div className="flex-1 md:max-w-[220px] p-6 rounded-2xl bg-blue-50 border-2 border-blue-200 text-center flex flex-col items-center justify-center">
                <Search className="w-8 h-8 mb-3 text-blue-600" />
                <h3 className="font-bold text-lg text-neutral-900">Search Pages</h3>
                <p className="text-sm text-neutral-500 mt-1">Optimized queries</p>
              </div>

              <div className="flex items-center justify-center md:px-1">
                <ArrowRight className="w-6 h-6 text-neutral-300 hidden md:block" />
                <ChevronRight className="w-6 h-6 text-neutral-300 md:hidden" />
              </div>

              <div className="flex-1 md:max-w-[220px] p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-center flex flex-col items-center justify-center">
                <Network className="w-8 h-8 mb-3 text-emerald-600" />
                <h3 className="font-bold text-lg text-neutral-900">Categories & Profiles</h3>
                <p className="text-sm text-neutral-500 mt-1">Organized discovery</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-6">Discovered On</p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: 'Google', color: 'bg-blue-50 border-blue-200 text-blue-700' },
                { name: 'ChatGPT', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
                { name: 'Gemini', color: 'bg-amber-50 border-amber-200 text-amber-700' },
                { name: 'Claude', color: 'bg-orange-50 border-orange-200 text-orange-700' },
                { name: 'Perplexity', color: 'bg-teal-50 border-teal-200 text-teal-700' },
              ].map((platform) => (
                <div key={platform.name} className={`py-3 px-6 rounded-xl border ${platform.color} font-semibold text-sm`}>
                  {platform.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* TRENDING FEED */}
      {/* ============================================ */}

      <section className="py-20 lg:py-28 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div className="mb-6 md:mb-0">
              <div className="inline-flex mb-5">
                <Badge className="bg-purple-100 text-purple-700 border-0 px-4 py-1.5 text-sm font-medium">
                  <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
                  Trending Now
                </Badge>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 mb-4">
                Discover What's
                <br />
                <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  Getting Attention
                </span>
              </h2>
              <p className="text-base sm:text-lg text-neutral-600 max-w-xl">
                Every item below is a discoverable Hook getting real views.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {TRENDING_NOW.map((item) => (
              <TrendingCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* CREATOR STORIES */}
      {/* ============================================ */}

      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="inline-flex mb-5">
              <Badge className="bg-purple-100 text-purple-700 border-0 px-4 py-1.5 text-sm font-medium">
                Creator Examples
              </Badge>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 mb-5">
              Creators Are Building
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Discoverability
              </span>
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 max-w-xl mx-auto mb-5">
              See how creators across different niches use Hookit to get discovered.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {CREATOR_EXAMPLES.map((creator) => (
              <div key={creator.title} className="rounded-3xl overflow-hidden border border-neutral-200 bg-white hover:shadow-xl hover:shadow-neutral-200/50 hover:border-neutral-300 transition-all duration-500 group">
                <div className="relative h-52 sm:h-56 overflow-hidden">
                  <img src={creator.image} alt={creator.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <img src={creator.avatar} alt={creator.creator} className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                    <div>
                      <p className="text-white font-semibold text-sm">@{creator.creator}</p>
                      <p className="text-white/70 text-xs">{creator.type}</p>
                    </div>
                  </div>
                </div>
                <div className="p-5 lg:p-6">
                  <h3 className="text-lg font-bold text-neutral-900 mb-4">{creator.title}</h3>
                  <div className="flex items-center gap-5 mb-5">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-semibold text-neutral-700">{creator.hooks} Hooks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-semibold text-neutral-700">{creator.views} Views</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {creator.searches.map((search) => (
                      <div key={search} className="flex items-center gap-2.5 text-sm px-3 py-2 rounded-lg bg-neutral-50 hover:bg-purple-50 transition-colors cursor-pointer">
                        <Search className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
                        <span className="text-neutral-600 text-sm">{search}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}