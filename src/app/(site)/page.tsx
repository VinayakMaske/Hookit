// src/app/(site)/page.tsx
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, 
  Sparkles,
  Globe,
  Zap,
  TrendingUp,
  ExternalLink,
  FileText,
  ShoppingBag,
  Eye,
  MousePointerClick,
  Layers,
  CheckCircle2,
  Bookmark,
  Search,
  Play,
  Newspaper,
  Palette,
  Camera,
  Plane,
  Laptop,
  Gamepad2,
  Utensils,
  Star,
  ChevronRight,
  Heart,
  Flame,
  Compass,
  ArrowUpRight,
  X
} from 'lucide-react'

// ============================================
// HERO DISCOVERY FEED — Clean scattered collage layout
// ============================================
const HERO_DISCOVERY = [
  { 
    src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop', 
    title: 'Summer Fashion Collection',
    creator: 'stylestudio',
    category: 'Fashion',
    type: 'link',
    top: 10, left: 20, delay: 0, width: 180, height: 260,
    likes: 234, views: '1.2K'
  },
  { 
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=400&fit=crop', 
    title: 'Hidden Gems of Switzerland',
    creator: 'wanderlust',
    category: 'Travel',
    type: 'blog',
    top: 60, left: 10, delay: 0.15, width: 170, height: 240,
    likes: 567, views: '3.4K'
  },
  { 
    src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=350&h=500&fit=crop', 
    title: 'Best Coding Setup 2026',
    creator: 'devlife',
    category: 'Technology',
    type: 'link',
    top: 5, left: 200, delay: 0.3, width: 160, height: 230,
    likes: 678, views: '4.1K'
  },
  { 
    src: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=280&h=380&fit=crop', 
    title: 'Minimalist Book Reviews',
    creator: 'bookworm',
    category: 'Books',
    type: 'blog',
    top: 180, left: 60, delay: 0.45, width: 175, height: 250,
    likes: 189, views: '890'
  },
  { 
    src: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=320&h=450&fit=crop', 
    title: 'Abstract Digital Art',
    creator: 'artflow',
    category: 'Art',
    type: 'product',
    price: '$49',
    top: 140, left: 220, delay: 0.6, width: 165, height: 235,
    likes: 445, views: '2.1K'
  },
  { 
    src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300&h=420&fit=crop', 
    title: 'Event Photography Tips',
    creator: 'shutterbug',
    category: 'Photography',
    type: 'blog',
    top: 50, left: 360, delay: 0.75, width: 155, height: 220,
    likes: 312, views: '1.5K'
  },
  { 
    src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=280&h=400&fit=crop', 
    title: 'Authentic Pizza Recipe',
    creator: 'chefmike',
    category: 'Food',
    type: 'blog',
    top: 200, left: 340, delay: 0.9, width: 170, height: 240,
    likes: 892, views: '4.5K'
  },
  { 
    src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=440&fit=crop', 
    title: 'Minimal Watch Design',
    creator: 'alexdesign',
    category: 'Products',
    type: 'product',
    price: '$129',
    top: 260, left: 150, delay: 1.05, width: 160, height: 225,
    likes: 156, views: '678'
  },
]

// ============================================
// TRENDING NOW — Live discovery feed
// ============================================
const TRENDING_NOW = [
  { src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=500&fit=crop', title: 'Minimal Watch Design', creator: 'alexdesign', category: 'Products', type: 'link', likes: 234, views: '1.2K', trending: true },
  { src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop', title: 'Portrait Photography Guide', creator: 'sarahclicks', category: 'Photography', type: 'link', likes: 567, views: '3.4K', trending: true },
  { src: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=550&fit=crop', title: 'Swiss Alps Travel Guide', creator: 'travelbug', category: 'Travel', type: 'link', likes: 1234, views: '8.9K', trending: true },
  { src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=520&fit=crop', title: 'Best Coding Setup 2026', creator: 'devlife', category: 'Technology', type: 'link', likes: 678, views: '4.1K', trending: false },
  { src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=500&fit=crop', title: 'Retro Gaming Collection', creator: 'pixelpro', category: 'Gaming', type: 'link', likes: 665, views: '3.2K', trending: true },
  { src: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=450&fit=crop', title: 'The Future of Abstract Art', creator: 'mayaarts', category: 'Art', type: 'blog', likes: 891, views: '5.6K', trending: true },
  { src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=480&fit=crop', title: 'Street Fashion Trends 2026', creator: 'styleicon', category: 'Fashion', type: 'blog', likes: 445, views: '2.8K', trending: false },
  { src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=470&fit=crop', title: 'Authentic Pizza Recipe', creator: 'chefmike', category: 'Food', type: 'blog', likes: 890, views: '4.5K', trending: true },
  { src: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=510&fit=crop', title: 'Vintage Polaroid Camera', creator: 'retrovibes', category: 'Products', type: 'product', price: '$129', likes: 223, views: '1.1K', trending: false },
  { src: 'https://images.unsplash.com/photo-1472120435266-53107fd0c44a?w=400&h=460&fit=crop', title: 'Sunset Photography Prints', creator: 'goldenhour', category: 'Photography', type: 'product', price: '$35', likes: 789, views: '3.9K', trending: true },
  { src: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=400&h=540&fit=crop', title: 'Colorful Art Prints Set', creator: 'artstudio', category: 'Art', type: 'product', price: '$59', likes: 556, views: '2.7K', trending: false },
  { src: 'https://images.unsplash.com/photo-1511376777868-611b54f68947?w=400&h=440&fit=crop', title: 'Music Production Kit', creator: 'beatmaker', category: 'Music', type: 'product', price: '$199', likes: 432, views: '2.1K', trending: true },
]

// ============================================
// CATEGORIES — For discovery browsing
// ============================================
const CATEGORIES = [
  { name: 'Trending', icon: Flame, color: 'from-orange-500 to-red-500', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300&h=400&fit=crop', count: '2.4K' },
  { name: 'Travel', icon: Plane, color: 'from-sky-500 to-blue-500', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=300&h=400&fit=crop', count: '1.8K' },
  { name: 'Art', icon: Palette, color: 'from-pink-500 to-rose-500', image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=400&fit=crop', count: '3.1K' },
  { name: 'Photography', icon: Camera, color: 'from-violet-500 to-purple-500', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop', count: '2.7K' },
  { name: 'Products', icon: ShoppingBag, color: 'from-emerald-500 to-teal-500', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=400&fit=crop', count: '1.5K' },
  { name: 'Fashion', icon: Sparkles, color: 'from-fuchsia-500 to-pink-500', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&h=400&fit=crop', count: '2.2K' },
  { name: 'Food', icon: Utensils, color: 'from-amber-500 to-orange-500', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=400&fit=crop', count: '1.9K' },
  { name: 'Technology', icon: Laptop, color: 'from-indigo-500 to-blue-500', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&h=400&fit=crop', count: '2.5K' },
  { name: 'Gaming', icon: Gamepad2, color: 'from-violet-600 to-fuchsia-500', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=400&fit=crop', count: '1.3K' },
  { name: 'Music', icon: Play, color: 'from-cyan-500 to-blue-500', image: 'https://images.unsplash.com/photo-1511376777868-611b54f68947?w=300&h=400&fit=crop', count: '1.6K' },
]

// ============================================
// DISCOVERY STORIES — Real content people found
// ============================================
const DISCOVERY_STORIES = [
  {
    quote: "I was browsing Hookit for travel inspiration and stumbled upon a blog about hidden Swiss villages. Ended up planning my entire trip around it.",
    author: "Priya Sharma",
    role: "Travel Enthusiast",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    discovered: "Swiss Alps Travel Guide",
    hookType: "blog"
  },
  {
    quote: "Found a digital art print I absolutely loved. Clicked through, bought it, and now it's hanging in my living room. Discovery at its finest.",
    author: "Rahul Verma",
    role: "Art Collector",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    discovered: "Abstract Digital Art Print",
    hookType: "product"
  },
  {
    quote: "I use Hookit to find the best coding tutorials and tech setups. It's like a visual bookmarking tool that actually works.",
    author: "Anita Desai",
    role: "Software Developer",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    discovered: "Best Coding Setup 2026",
    hookType: "link"
  },
]

// ============================================
// COMPONENT: Hook Type Badge
// ============================================
function HookTypeBadge({ type }: { type: string }) {
  const configs = {
    link: { icon: ExternalLink, label: 'Link', color: 'bg-blue-100/90 text-blue-700 backdrop-blur-sm' },
    blog: { icon: FileText, label: 'Blog', color: 'bg-purple-100/90 text-purple-700 backdrop-blur-sm' },
    product: { icon: ShoppingBag, label: 'Product', color: 'bg-emerald-100/90 text-emerald-700 backdrop-blur-sm' },
  }
  const config = configs[type as keyof typeof configs] || configs.link
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${config.color}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  )
}

// ============================================
// COMPONENT: Trending Badge
// ============================================
function TrendingBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white">
      <Flame className="w-3 h-3" />
      Trending
    </span>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const feedRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const filteredTrending = activeCategory === 'all' 
    ? TRENDING_NOW 
    : TRENDING_NOW.filter(hook => hook.category.toLowerCase() === activeCategory.toLowerCase() || (activeCategory === 'Trending' && hook.trending))

  return (
    <div className="min-h-screen bg-white">

            {/* ============================================ */}
      {/* HERO SECTION — "What will you discover?" */}
      {/* ============================================ */}
            {/* ============================================ */}
      {/* HERO SECTION — "What will you discover?" */}
      {/* ============================================ */}
      <section className="relative pt-20 pb-8 lg:pt-28 lg:pb-12 overflow-hidden">
        {/* Background gradient blobs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-100/50 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-pink-100/50 rounded-full blur-3xl -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-50/30 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left: Headline + Discovery CTA */}
            <div className={`transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-neutral-900 leading-[1.05] mb-5">
                What will you{' '}
                <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 bg-clip-text text-transparent">
                  discover
                </span>{' '}
                today?
              </h1>

              <p className="text-lg sm:text-xl text-neutral-500 mb-6 max-w-lg leading-relaxed">
                Blogs, products, links, videos, art — all in one beautiful visual feed. 
                Scroll, explore, and find your next obsession.
              </p>

              {/* Quick category pills */}
              <div className="flex flex-wrap gap-2.5 mb-6">
                {[
                  { name: 'Travel', icon: Plane, color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-200', hoverBg: 'hover:bg-sky-100' },
                  { name: 'Art', icon: Palette, color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-200', hoverBg: 'hover:bg-pink-100' },
                  { name: 'Tech', icon: Laptop, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200', hoverBg: 'hover:bg-indigo-100' },
                  { name: 'Fashion', icon: Sparkles, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', hoverBg: 'hover:bg-purple-100' },
                  { name: 'Food', icon: Utensils, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', hoverBg: 'hover:bg-orange-100' },
                  { name: 'Photography', icon: Camera, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200', hoverBg: 'hover:bg-violet-100' },
                ].map((cat) => {
                  const Icon = cat.icon
                  return (
                    <Link key={cat.name} href={`/explore?category=${cat.name.toLowerCase()}`}>
                      <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full ${cat.bg} ${cat.color} ${cat.border} border text-sm font-medium transition-all duration-200 ${cat.hoverBg} hover:shadow-sm`}>
                        <Icon className="w-3.5 h-3.5" />
                        {cat.name}
                      </span>
                    </Link>
                  )
                })}
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/explore">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-full h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg gap-2 shadow-lg shadow-purple-200/50">
                    <Compass className="w-5 h-5" />
                    Start Exploring
                  </Button>
                </Link>
                <Link href="/hook/new">
                  <Button size="lg" variant="outline" className="rounded-full h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg border-neutral-300 hover:border-purple-300 hover:bg-purple-50 gap-2">
                    <Zap className="w-5 h-5" />
                    Create a Hook
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-neutral-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  No signup to browse
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  10K+ Hooks
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  New daily
                </div>
              </div>
            </div>

                        {/* Right: Floating Discovery Cards — Pinterest-style scattered collage */}
            <div className="relative h-[500px] lg:h-[560px] hidden sm:block w-full max-w-[520px] mx-auto lg:mx-0">
              {HERO_DISCOVERY.map((hook, i) => (
                <div
                  key={i}
                  className={`absolute rounded-2xl overflow-hidden shadow-xl transition-all duration-700 hover:scale-105 hover:z-50 cursor-pointer group ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{
                    top: `${hook.top}px`,
                    left: `${hook.left}px`,
                    width: `${hook.width}px`,
                    height: `${hook.height}px`,
                    transitionDelay: `${hook.delay}s`,
                    animation: `float 6s ease-in-out infinite`,
                    animationDelay: `${i * 0.5}s`,
                    zIndex: hoveredCard === i ? 50 : 10 - i,
                  }}
                  onMouseEnter={() => setHoveredCard(i)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <img 
                    src={hook.src} 
                    alt={hook.title}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />

                  {/* Hover Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 flex flex-col justify-end p-3 ${
                    hoveredCard === i ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <p className="text-white font-semibold text-sm leading-tight mb-1.5">{hook.title}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-xs">@{hook.creator}</span>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-white/80 text-xs">
                          <Heart className="w-3 h-3" /> {hook.likes}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <HookTypeBadge type={hook.type} />
                      {hook.price && (
                        <span className="text-emerald-400 text-sm font-bold">{hook.price}</span>
                      )}
                    </div>
                  </div>

                  {/* Type indicator (always visible corner) */}
                  <div className="absolute top-2 right-2">
                    {hook.type === 'link' && <div className="p-1.5 bg-blue-500/80 backdrop-blur-sm rounded-lg"><ExternalLink className="w-3 h-3 text-white" /></div>}
                    {hook.type === 'blog' && <div className="p-1.5 bg-purple-500/80 backdrop-blur-sm rounded-lg"><FileText className="w-3 h-3 text-white" /></div>}
                    {hook.type === 'product' && <div className="p-1.5 bg-emerald-500/80 backdrop-blur-sm rounded-lg"><ShoppingBag className="w-3 h-3 text-white" /></div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

            {/* ============================================ */}
      {/* CATEGORIES — Browse by Interest */}
      {/* ============================================ */}
      <section className="py-10 sm:py-14 border-y border-neutral-100 bg-gradient-to-r from-purple-50/30 via-white to-pink-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">Browse by category</h2>
              <p className="text-sm text-neutral-500 mt-1">Find exactly what you are looking for</p>
            </div>
            <Link href="/explore" className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon
              return (
                <Link key={cat.name} href={`/explore?category=${cat.name.toLowerCase()}`}>
                  <div className="group relative rounded-2xl overflow-hidden aspect-[4/5] cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    
                    {/* Icon + Name */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-2 shadow-lg`}>
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <h3 className="text-white font-bold text-sm sm:text-base">{cat.name}</h3>
                      <p className="text-white/60 text-xs mt-0.5">{cat.count} hooks</p>
                    </div>

                    {/* Hover arrow */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <ArrowUpRight className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* WHAT YOU CAN FIND — Content Type Showcase */}
      {/* ============================================ */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <Badge className="mb-4 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-0 px-4 py-1.5">
              <Layers className="w-3.5 h-3.5 mr-1.5" />
              Three types of content. One beautiful feed.
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-3">
              Everything you love to discover
            </h2>
            <p className="text-base sm:text-lg text-neutral-500 max-w-2xl mx-auto">
              Whether you are looking for a great read, a cool product, or an interesting link — 
              it is all here, visually.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* Link Hook */}
            <div className="group relative bg-gradient-to-br from-blue-50/50 to-white rounded-3xl p-6 sm:p-8 border border-blue-100/50 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mb-5 shadow-lg shadow-blue-200">
                <ExternalLink className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-2">Links</h3>
              <p className="text-sm font-semibold text-blue-600 mb-4">Discover anything on the web</p>
              <p className="text-neutral-600 text-sm leading-relaxed mb-6">
                YouTube videos, Instagram profiles, portfolios, news articles, AI tools, affiliate links — 
                all curated and visually presented.
              </p>
              
              {/* Example cards */}
              <div className="space-y-3">
                {[
                  { title: 'Best Coding Setup 2026', creator: 'devlife', icon: Laptop },
                  { title: 'Hidden Gems of Switzerland', creator: 'wanderlust', icon: Plane },
                  { title: 'Retro Gaming Collection', creator: 'pixelpro', icon: Gamepad2 },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-blue-100/50 hover:border-blue-200 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-neutral-800 truncate">{item.title}</p>
                      <p className="text-xs text-neutral-400">@{item.creator}</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-blue-100/50">
                <Link href="/explore?type=link">
                  <span className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
                    Explore links <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </div>
            </div>

            {/* Blog Hook */}
            <div className="group relative bg-gradient-to-br from-purple-50/50 to-white rounded-3xl p-6 sm:p-8 border border-purple-100/50 hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center mb-5 shadow-lg shadow-purple-200">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-2">Blogs</h3>
              <p className="text-sm font-semibold text-purple-600 mb-4">Read stories & articles</p>
              <p className="text-neutral-600 text-sm leading-relaxed mb-6">
                Travel stories, tutorials, reviews, opinion pieces, how-to guides — 
                all written and published directly on Hookit by creators.
              </p>
              
              {/* Example cards */}
              <div className="space-y-3">
                {[
                  { title: 'Swiss Alps Travel Guide', creator: 'travelbug', icon: Plane, readTime: '5 min' },
                  { title: 'Street Fashion Trends 2026', creator: 'styleicon', icon: Sparkles, readTime: '3 min' },
                  { title: 'Authentic Pizza Recipe', creator: 'chefmike', icon: Utensils, readTime: '8 min' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-purple-100/50 hover:border-purple-200 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-purple-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-neutral-800 truncate">{item.title}</p>
                      <p className="text-xs text-neutral-400">@{item.creator} · {item.readTime} read</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-purple-100/50">
                <Link href="/explore?type=blog">
                  <span className="text-sm font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1 transition-colors">
                    Explore blogs <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </div>
            </div>

            {/* Product Hook */}
            <div className="group relative bg-gradient-to-br from-emerald-50/50 to-white rounded-3xl p-6 sm:p-8 border border-emerald-100/50 hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center mb-5 shadow-lg shadow-emerald-200">
                <ShoppingBag className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-2">Products</h3>
              <p className="text-sm font-semibold text-emerald-600 mb-4">Shop unique finds</p>
              <p className="text-neutral-600 text-sm leading-relaxed mb-6">
                Digital products, physical goods, art prints, courses, templates, merchandise — 
                visually showcased with pricing and details.
              </p>
              
              {/* Example cards */}
              <div className="space-y-3">
                {[
                  { title: 'Vintage Polaroid Camera', creator: 'retrovibes', price: '$129', icon: Camera },
                  { title: 'Colorful Art Prints Set', creator: 'artstudio', price: '$59', icon: Palette },
                  { title: 'Music Production Kit', creator: 'beatmaker', price: '$199', icon: Play },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-emerald-100/50 hover:border-emerald-200 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-neutral-800 truncate">{item.title}</p>
                      <p className="text-xs text-neutral-400">@{item.creator}</p>
                    </div>
                    <span className="text-sm font-bold text-emerald-600">{item.price}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-emerald-100/50">
                <Link href="/explore?type=product">
                  <span className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors">
                    Explore products <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

            {/* ============================================ */}
      {/* TRENDING NOW — Live Discovery Feed */}
      {/* ============================================ */}
      <section className="py-16 sm:py-20 bg-white" ref={feedRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900">
                What people are discovering
              </h2>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {['all', 'Trending', 'Travel', 'Art', 'Photography', 'Products'].map((cat) => {
                const isActive = activeCategory === cat
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                      isActive 
                        ? 'bg-neutral-900 text-white' 
                        : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
                    }`}
                  >
                    {cat === 'all' ? 'All' : cat}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Masonry Grid */}
          <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3">
            {filteredTrending.map((hook, i) => {
              const categoryColors: Record<string, string> = {
                'Fashion': 'bg-purple-500',
                'Travel': 'bg-sky-500',
                'Gaming': 'bg-indigo-500',
                'Art': 'bg-pink-500',
                'Music': 'bg-violet-500',
                'Food': 'bg-red-500',
                'Products': 'bg-fuchsia-500',
                'Technology': 'bg-blue-500',
                'Photography': 'bg-teal-500',
                'Books': 'bg-amber-500',
              }
              const catColor = categoryColors[hook.category] || 'bg-purple-500'

              return (
                <div
                  key={`${activeCategory}-${i}`}
                  className="break-inside-avoid mb-3 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative" onMouseEnter={() => setHoveredCard(i + 2000)} onMouseLeave={() => setHoveredCard(null)}>
                    <img
                      src={hook.src}
                      alt={hook.title}
                      className="w-full object-cover"
                      loading="lazy"
                    />

                    {/* Category Badge — always visible, top left */}
                    <span className={`absolute top-2 left-2 inline-flex items-center px-2 py-0.5 rounded-md ${catColor} text-white text-[10px] sm:text-xs font-bold uppercase tracking-wide`}>
                      {hook.category}
                    </span>

                    {/* Type Icon — always visible, top right */}
                    <div className="absolute top-2 right-2">
                      {hook.type === 'link' && (
                        <div className="w-6 h-6 flex items-center justify-center bg-blue-500 rounded-full">
                          <ExternalLink className="w-3 h-3 text-white" />
                        </div>
                      )}
                      {hook.type === 'blog' && (
                        <div className="w-6 h-6 flex items-center justify-center bg-purple-500 rounded-full">
                          <FileText className="w-3 h-3 text-white" />
                        </div>
                      )}
                      {hook.type === 'product' && (
                        <div className="w-6 h-6 flex items-center justify-center bg-emerald-500 rounded-full">
                          <ShoppingBag className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Price — always visible, bottom left */}
                    {hook.price && (
                      <span className="absolute bottom-2 left-2 inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-500 text-white text-xs font-bold">
                        {hook.price}
                      </span>
                    )}

                    {/* Hover Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 flex flex-col justify-end p-3 ${
                      hoveredCard === i + 2000 ? 'opacity-100' : 'opacity-0'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        {hook.type === 'product' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                            <ShoppingBag className="w-3 h-3" />
                            Product
                          </span>
                        )}
                        {hook.type === 'blog' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                            <FileText className="w-3 h-3" />
                            Blog
                          </span>
                        )}
                        {hook.type === 'link' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                            <ExternalLink className="w-3 h-3" />
                            Link
                          </span>
                        )}
                      </div>
                      
                      {/* Click icon */}
                      <div className="absolute bottom-3 right-3">
                        <div className="w-8 h-8 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full">
                          <MousePointerClick className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Info below image */}
                  <div className="p-2.5">
                    <h3 className="font-semibold text-neutral-900 text-sm leading-tight mb-2">{hook.title}</h3>
                    <div className="flex items-center justify-between text-xs text-neutral-400">
                      <span>@{hook.creator}</span>
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-0.5">
                          <Eye className="w-3 h-3" />
                          {hook.views}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <MousePointerClick className="w-4 h-4" />
                          {hook.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="text-center mt-10">
            <Link href="/explore">
              <Button variant="outline" className="rounded-full h-12 px-8 border-neutral-300 hover:border-purple-300 hover:bg-purple-50 gap-2">
                Explore All Hooks
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* DISCOVERY STORIES — Real people, real finds */}
      {/* ============================================ */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-0 px-4 py-1.5">
              <Heart className="w-3.5 h-3.5 mr-1.5" />
              Discovery Stories
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-3">
              People love what they find here
            </h2>
            <p className="text-base sm:text-lg text-neutral-500 max-w-2xl mx-auto">
              Real stories from real people who discovered something amazing on Hookit.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {DISCOVERY_STORIES.map((story, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-neutral-100 hover:shadow-lg hover:border-purple-100 transition-all duration-300 relative">
                {/* Quote mark */}
                <div className="absolute top-4 right-4 text-6xl font-serif text-purple-100 leading-none">"</div>
                
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                {/* What they discovered */}
                <div className="mb-4">
                  <p className="text-xs text-neutral-400 uppercase tracking-wider font-semibold mb-1.5">Discovered</p>
                  <div className="flex items-center gap-2">
                    <HookTypeBadge type={story.hookType} />
                    <span className="text-sm font-semibold text-neutral-700">{story.discovered}</span>
                  </div>
                </div>

                <p className="text-neutral-700 mb-6 leading-relaxed text-sm sm:text-base relative z-10">"{story.quote}"</p>
                
                <div className="flex items-center gap-3">
                  <img
                    src={story.avatar}
                    alt={story.author}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-100"
                    loading="lazy"
                  />
                  <div>
                    <p className="font-semibold text-neutral-900 text-sm">{story.author}</p>
                    <p className="text-neutral-500 text-xs">{story.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

            {/* ============================================ */}
      {/* CREATOR CTA — "Love what you see? Create your own" */}
      {/* ============================================ */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <Badge className="mb-6 bg-white/15 text-white border-0 hover:bg-white/20 backdrop-blur-sm px-4 py-1.5">
                <Zap className="w-3.5 h-3.5 mr-1.5" />
                For Creators
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 leading-tight">
                Love what you see?{' '}
                <span className="text-purple-200">Create your own.</span>
              </h2>
              <p className="text-lg sm:text-xl text-white/70 mb-8 leading-relaxed">
                Every Hook you discovered was created by someone just like you. 
                Share your blog, link, or product — and let others discover it too.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  'Share your YouTube, Instagram, website, or store',
                  'Write blogs that get discovered by people searching',
                  'Showcase products with pricing and details',
                  'Track views and link clicks in real-time',
                  'No followers needed. No likes. Just discovery.',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white/80 text-sm sm:text-base">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/hook/new">
                  <Button size="lg" className="bg-white text-purple-700 hover:bg-white/90 rounded-full h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg gap-2 shadow-lg">
                    <Zap className="w-5 h-5" />
                    Create Your First Hook
                  </Button>
                </Link>
                <Link href="/explore">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg">
                    Keep Exploring
                  </Button>
                </Link>
              </div>
            </div>

            {/* Visual: Creator preview cards */}
            <div className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 mt-8">
                  {[
                    { src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop', title: 'Summer Fashion', type: 'link' },
                    { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=350&fit=crop', title: 'Swiss Travel', type: 'blog' },
                    { src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=380&fit=crop', title: 'Portrait Tips', type: 'product' },
                  ].map((item, i) => (
                    <div key={`left-${i}`} className="rounded-2xl overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-300 relative group">
                      <img src={item.src} alt="" className="w-full" loading="lazy" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                        <div className="flex items-center justify-between">
                          <span className="text-white text-sm font-semibold">{item.title}</span>
                          <HookTypeBadge type={item.type} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  {[
                    { src: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=350&fit=crop', title: 'Book Reviews', type: 'blog' },
                    { src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300&h=400&fit=crop', title: 'Photo Guide', type: 'link' },
                    { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300&h=360&fit=crop', title: 'Art Prints', type: 'product' },
                  ].map((item, i) => (
                    <div key={`right-${i}`} className="rounded-2xl overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-300 relative group">
                      <img src={item.src} alt="" className="w-full" loading="lazy" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                        <div className="flex items-center justify-between">
                          <span className="text-white text-sm font-semibold">{item.title}</span>
                          <HookTypeBadge type={item.type} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* FINAL CTA — Simple & Clean */}
      {/* ============================================ */}
      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <h2 className="text-2xl sm:text-4xl font-bold mb-3">
                Start your discovery journey
              </h2>
              <p className="text-base sm:text-xl text-white/80 mb-8 max-w-xl mx-auto">
                No account needed to browse. Find your next favorite blog, product, or link — right now.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/explore">
                  <Button size="lg" className="bg-white text-purple-700 hover:bg-white/90 rounded-full h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg gap-2 shadow-lg">
                    <Compass className="w-5 h-5" />
                    Explore Now
                  </Button>
                </Link>
                <Link href="/hook/new">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg">
                    Create a Hook
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* FOOTER */}
      {/* ============================================ */}
      <section className="py-6 sm:py-8 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-neutral-400">
              Hookit — The Universal Visual Discovery Platform. Everything is a Hook.
            </p>
            <div className="flex items-center gap-4 text-sm text-neutral-400">
              <Link href="/explore" className="hover:text-purple-600 transition-colors">Explore</Link>
              <Link href="/hook/new" className="hover:text-purple-600 transition-colors">Create</Link>
              <Link href="/about" className="hover:text-purple-600 transition-colors">About</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* ANIMATIONS */}
      {/* ============================================ */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  )
}

