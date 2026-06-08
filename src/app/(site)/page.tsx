// src/app/(site)/page.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
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
  ArrowUpRight,
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
  ChevronRight
} from 'lucide-react'

// ============================================
// HERO FLOATING HOOKS - Visual Discovery Showcase
// ============================================
const HERO_HOOKS = [
  { 
    src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop', 
    title: 'Summer Fashion Collection',
    creator: 'stylestudio',
    category: 'Fashion',
    type: 'link',
    top: '5%', left: '55%', delay: 0, width: 180, height: 260 
  },
  { 
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=400&fit=crop', 
    title: 'Hidden Gems of Switzerland',
    creator: 'wanderlust',
    category: 'Travel',
    type: 'blog',
    top: '15%', left: '75%', delay: 0.2, width: 160, height: 220 
  },
  { 
    src: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=350&h=500&fit=crop', 
    title: 'Minimalist Book Reviews',
    creator: 'bookworm',
    category: 'Books',
    type: 'blog',
    top: '60%', left: '50%', delay: 0.4, width: 170, height: 240 
  },
  { 
    src: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=280&h=380&fit=crop', 
    title: 'Abstract Digital Art',
    creator: 'artflow',
    category: 'Art',
    type: 'product',
    price: '$49',
    top: '70%', left: '72%', delay: 0.6, width: 150, height: 200 
  },
  { 
    src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=320&h=450&fit=crop', 
    title: 'Event Photography Tips',
    creator: 'shutterbug',
    category: 'Photography',
    type: 'blog',
    top: '40%', left: '85%', delay: 0.8, width: 165, height: 230 
  },
  { 
    src: 'https://images.unsplash.com/photo-1511376777868-611b54f68947?w=300&h=420&fit=crop', 
    title: 'Home Studio Setup',
    creator: 'beatmaker',
    category: 'Music',
    type: 'link',
    top: '25%', left: '90%', delay: 1, width: 155, height: 210 
  },
]

// ============================================
// UNIFIED FEED - All Hook Types Mixed Together
// ============================================
const UNIFIED_FEED = [
  // Link Hooks (External destinations)
  { src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=500&fit=crop', title: 'Minimal Watch Design', creator: 'alexdesign', category: 'Products', type: 'link', views: 234, clicks: 89 },
  { src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop', title: 'Portrait Photography Guide', creator: 'sarahclicks', category: 'Photography', type: 'link', views: 567, clicks: 234 },
  { src: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=550&fit=crop', title: 'Swiss Alps Travel Guide', creator: 'travelbug', category: 'Travel', type: 'link', views: 1234, clicks: 567 },
  { src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=520&fit=crop', title: 'Best Coding Setup 2026', creator: 'devlife', category: 'Technology', type: 'link', views: 678, clicks: 345 },
  { src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=500&fit=crop', title: 'Retro Gaming Collection', creator: 'pixelpro', category: 'Gaming', type: 'link', views: 665, clicks: 289 },
  { src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=420&fit=crop', title: 'Analytics Dashboard UI', creator: 'techninja', category: 'Technology', type: 'link', views: 312, clicks: 156 },

  // Blog Hooks (Content on Hookit)
  { src: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=450&fit=crop', title: 'The Future of Abstract Art', creator: 'mayaarts', category: 'Art', type: 'blog', views: 891, clicks: 445 },
  { src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=480&fit=crop', title: 'Street Fashion Trends 2026', creator: 'styleicon', category: 'Fashion', type: 'blog', views: 445, clicks: 234 },
  { src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=470&fit=crop', title: 'Authentic Pizza Recipe', creator: 'chefmike', category: 'Food', type: 'blog', views: 890, clicks: 567 },
  { src: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=580&fit=crop', title: 'Modern Art Movements', creator: 'galleryx', category: 'Art', type: 'blog', views: 334, clicks: 178 },
  { src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=490&fit=crop', title: 'Mountain Lake Photography', creator: 'naturelover', category: 'Travel', type: 'blog', views: 1567, clicks: 789 },
  { src: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=560&fit=crop', title: 'Healthy Eating Guide', creator: 'fitchef', category: 'Food', type: 'blog', views: 876, clicks: 456 },

  // Product Hooks (With prices)
  { src: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=510&fit=crop', title: 'Vintage Polaroid Camera', creator: 'retrovibes', category: 'Products', type: 'product', price: '$129', views: 223, clicks: 98 },
  { src: 'https://images.unsplash.com/photo-1472120435266-53107fd0c44a?w=400&h=460&fit=crop', title: 'Sunset Photography Prints', creator: 'goldenhour', category: 'Photography', type: 'product', price: '$35', views: 789, clicks: 345 },
  { src: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=400&h=540&fit=crop', title: 'Colorful Art Prints Set', creator: 'artstudio', category: 'Art', type: 'product', price: '$59', views: 556, clicks: 234 },
  { src: 'https://images.unsplash.com/photo-1511376777868-611b54f68947?w=400&h=440&fit=crop', title: 'Music Production Kit', creator: 'beatmaker', category: 'Music', type: 'product', price: '$199', views: 432, clicks: 189 },
  { src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=480&fit=crop', title: 'Handmade Jewelry Collection', creator: 'shopowner', category: 'Products', type: 'product', price: '$45', views: 543, clicks: 267 },
  { src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=530&fit=crop', title: 'Designer Fashion Pieces', creator: 'fashionweek', category: 'Fashion', type: 'product', price: '$299', views: 987, clicks: 456 },
  { src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=470&fit=crop', title: 'Nature Photography Book', creator: 'wanderlust', category: 'Travel', type: 'product', price: '$24', views: 1123, clicks: 678 },
  { src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=510&fit=crop', title: 'Portrait Photography Course', creator: 'lensmaster', category: 'Photography', type: 'product', price: '$79', views: 678, clicks: 345 },
]

// ============================================
// CATEGORIES
// ============================================
const CATEGORIES = [
  { name: 'Travel', icon: Plane, color: 'from-purple-500 to-pink-500', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=300&h=400&fit=crop' },
  { name: 'Art', icon: Palette, color: 'from-pink-500 to-rose-500', image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=400&fit=crop' },
  { name: 'Photography', icon: Camera, color: 'from-violet-500 to-purple-500', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop' },
  { name: 'Products', icon: ShoppingBag, color: 'from-fuchsia-500 to-pink-500', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=400&fit=crop' },
  { name: 'Fashion', icon: Sparkles, color: 'from-purple-600 to-indigo-500', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&h=400&fit=crop' },
  { name: 'Food', icon: Utensils, color: 'from-rose-500 to-orange-500', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=400&fit=crop' },
  { name: 'Technology', icon: Laptop, color: 'from-indigo-500 to-purple-500', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&h=400&fit=crop' },
  { name: 'Gaming', icon: Gamepad2, color: 'from-violet-600 to-fuchsia-500', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=400&fit=crop' },
]

// ============================================
// HOW IT WORKS - 3 Hook Types
// ============================================
const HOOK_TYPES = [
  { 
    icon: ExternalLink,
    title: 'Link Hook',
    subtitle: 'Redirect Anywhere',
    desc: 'Share YouTube videos, Instagram, portfolios, news articles, affiliate links, or any external URL. One click sends visitors exactly where you want.',
    color: 'from-blue-500 to-cyan-400',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    examples: ['YouTube Videos', 'Instagram Pages', 'News Articles', 'AI Tools', 'Portfolios', 'Affiliate Links']
  },
  { 
    icon: FileText,
    title: 'Blog Hook',
    subtitle: 'Write on Hookit',
    desc: 'Upload a cover image, write your full article, and publish. Your Hook becomes the preview card that opens your blog post directly on Hookit.',
    color: 'from-purple-500 to-pink-400',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    examples: ['Travel Stories', 'Tutorials', 'Reviews', 'Opinion Pieces', 'How-To Guides', 'Case Studies']
  },
  { 
    icon: ShoppingBag,
    title: 'Product Hook',
    subtitle: 'Sell Anything',
    desc: 'Showcase products with images, descriptions, and pricing. Currently redirects to your store. Soon: native checkout directly on Hookit.',
    color: 'from-emerald-500 to-teal-400',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    examples: ['Digital Products', 'Physical Goods', 'Art Prints', 'Courses', 'Templates', 'Merchandise']
  },
]

// ============================================
// CREATOR SHOWCASE IMAGES
// ============================================
const CREATOR_IMAGES_LEFT = [
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=350&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=380&fit=crop',
]

const CREATOR_IMAGES_RIGHT = [
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=350&fit=crop',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300&h=400&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300&h=360&fit=crop',
]

// ============================================
// TESTIMONIALS
// ============================================
const TESTIMONIALS = [
  {
    quote: "I created a Link Hook for my YouTube channel and got 500+ visits in one week. No signup, no hassle. Just upload and share.",
    author: "Priya Sharma",
    role: "YouTube Creator",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    hookType: "Link Hook"
  },
  {
    quote: "I write travel blogs directly on Hookit. My Blog Hooks get discovered by people searching for destinations. Pure organic traffic.",
    author: "Rahul Verma",
    role: "Travel Blogger",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    hookType: "Blog Hook"
  },
  {
    quote: "I sell my digital art prints as Product Hooks. People discover them visually and click through to my store. Simple and effective.",
    author: "Anita Desai",
    role: "Digital Artist",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    hookType: "Product Hook"
  },
]

// ============================================
// COMPONENT: Hook Type Badge
// ============================================
function HookTypeBadge({ type }: { type: string }) {
  const configs = {
    link: { icon: ExternalLink, label: 'Link', color: 'bg-blue-100 text-blue-700' },
    blog: { icon: FileText, label: 'Blog', color: 'bg-purple-100 text-purple-700' },
    product: { icon: ShoppingBag, label: 'Product', color: 'bg-emerald-100 text-emerald-700' },
  }
  const config = configs[type as keyof typeof configs] || configs.link
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [activeType, setActiveType] = useState<string>('all')
  const feedRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const filteredFeed = activeType === 'all' 
    ? UNIFIED_FEED 
    : UNIFIED_FEED.filter(hook => hook.type === activeType)

  return (
    <div className="min-h-screen bg-white">
      {/* ============================================ */}
      {/* HERO SECTION */}
      {/* ============================================ */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Badge className="mb-6 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 hover:from-purple-200 hover:to-pink-200 border-0 px-4 py-1.5 text-sm font-medium">
                <Sparkles className="w-3 h-3 mr-1" />
                Pinterest + Medium + Product Hunt = One Platform
              </Badge>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-neutral-900 leading-[1.1] mb-6">
                Everything is a{' '}
                <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 bg-clip-text text-transparent">
                  Hook
                </span>
              </h1>

              <p className="text-xl text-neutral-500 mb-8 max-w-lg leading-relaxed">
                Blogs, products, links, videos, portfolios — all in one visual feed. 
                No signup. No algorithms. Just create and get discovered.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <Link href="/hook/new">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-full h-14 px-8 text-lg gap-2 shadow-lg shadow-purple-200">
                    <Zap className="w-5 h-5" />
                    Create Your Hook
                  </Button>
                </Link>
                <Link href="/explore">
                  <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-lg border-neutral-300 hover:border-purple-300 hover:bg-purple-50 gap-2">
                    Explore Feed
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  No signup required
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  3 Hook types
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  One unified feed
                </div>
              </div>
            </div>

            {/* Right - Floating Hooks */}
            <div className="relative h-[500px] lg:h-[600px] hidden lg:block">
              {HERO_HOOKS.map((hook, i) => (
                <div
                  key={i}
                  className={`absolute rounded-2xl overflow-hidden shadow-2xl transition-all duration-1000 hover:scale-105 hover:z-10 cursor-pointer group ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{
                    top: hook.top,
                    left: hook.left,
                    width: hook.width,
                    height: hook.height,
                    transitionDelay: `${hook.delay}s`,
                    animation: `float 6s ease-in-out infinite`,
                    animationDelay: `${i * 0.5}s`,
                  }}
                  onMouseEnter={() => setHoveredCard(i)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <img 
                    src={hook.src} 
                    alt={hook.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Hover Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 flex flex-col justify-end p-3 ${
                    hoveredCard === i ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <p className="text-white font-semibold text-sm leading-tight mb-1">{hook.title}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-xs">@{hook.creator}</span>
                      <HookTypeBadge type={hook.type} />
                    </div>
                    {hook.price && (
                      <span className="text-emerald-400 text-sm font-bold mt-1">{hook.price}</span>
                    )}
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

        {/* Background decoration */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl -z-10" />
      </section>

      {/* ============================================ */}
      {/* STATS BAR */}
      {/* ============================================ */}
      <section className="py-8 border-y border-neutral-100 bg-gradient-to-r from-purple-50/50 to-pink-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '10K+', label: 'Hooks Created' },
              { value: '50K+', label: 'Monthly Discovery' },
              { value: '100K+', label: 'Clicks to Destinations' },
              { value: '5K+', label: 'Creators' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-sm text-neutral-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* UNIFIED FEED PREVIEW */}
      {/* ============================================ */}
      <section className="py-20" ref={feedRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-0">
              <Layers className="w-3 h-3 mr-1" />
              One Feed. Every Type.
            </Badge>
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              Discover everything visually
            </h2>
            <p className="text-lg text-neutral-500 max-w-2xl mx-auto mb-8">
              Blogs, products, links, videos, art — all appear as Hooks. 
              You never know what you will discover next.
            </p>

            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {[
                { key: 'all', label: 'All Hooks', icon: Layers },
                { key: 'link', label: 'Links', icon: ExternalLink },
                { key: 'blog', label: 'Blogs', icon: FileText },
                { key: 'product', label: 'Products', icon: ShoppingBag },
              ].map((tab) => {
                const Icon = tab.icon
                const isActive = activeType === tab.key
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveType(tab.key)}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      isActive 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md shadow-purple-200' 
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Masonry Grid */}
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {filteredFeed.map((hook, i) => (
              <div
                key={`${activeType}-${i}`}
                className="break-inside-avoid group relative rounded-2xl overflow-hidden cursor-pointer bg-white shadow-sm hover:shadow-xl transition-all duration-300"
                onMouseEnter={() => setHoveredCard(i + 1000)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="relative">
                  <img
                    src={hook.src}
                    alt={hook.title}
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Type Icon (top right) */}
                  <div className="absolute top-3 right-3">
                    {hook.type === 'link' && (
                      <div className="p-2 bg-blue-500/90 backdrop-blur-sm rounded-full shadow-lg">
                        <ExternalLink className="w-4 h-4 text-white" />
                      </div>
                    )}
                    {hook.type === 'blog' && (
                      <div className="p-2 bg-purple-500/90 backdrop-blur-sm rounded-full shadow-lg">
                        <FileText className="w-4 h-4 text-white" />
                      </div>
                    )}
                    {hook.type === 'product' && (
                      <div className="p-2 bg-emerald-500/90 backdrop-blur-sm rounded-full shadow-lg">
                        <ShoppingBag className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Category Badge */}
                  <Badge className="absolute top-3 left-3 bg-white/90 text-neutral-700 border-0 text-xs backdrop-blur-sm">
                    {hook.category}
                  </Badge>

                  {/* Price badge for products */}
                  {hook.price && (
                    <div className="absolute bottom-3 left-3 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      {hook.price}
                    </div>
                  )}
                </div>

                {/* Card Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-neutral-900 text-sm mb-1 line-clamp-2 leading-tight">{hook.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500 text-xs">@{hook.creator}</span>
                    <div className="flex items-center gap-3 text-neutral-400 text-xs">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {hook.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <MousePointerClick className="w-3 h-3" />
                        {hook.clicks}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300 pointer-events-none ${
                  hoveredCard === i + 1000 ? 'opacity-100' : 'opacity-0'
                }`}>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <HookTypeBadge type={hook.type} />
                      {hook.price && <span className="text-emerald-400 font-bold text-sm">{hook.price}</span>}
                    </div>
                    <p className="text-white/90 text-xs">
                      {hook.type === 'link' && 'Opens external link'}
                      {hook.type === 'blog' && 'Read full article on Hookit'}
                      {hook.type === 'product' && 'View product details'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
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
      {/* THE 3 HOOK TYPES */}
      {/* ============================================ */}
      <section className="py-20 bg-gradient-to-b from-white via-purple-50/20 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-0">
              <Layers className="w-3 h-3 mr-1" />
              Three Types. One Feed.
            </Badge>
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              Create any Hook in seconds
            </h2>
            <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
              Link to anything. Write blogs. Sell products. All appear as beautiful visual cards in the same feed.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {HOOK_TYPES.map((type, i) => {
              const Icon = type.icon
              return (
                <div key={i} className="relative group">
                  <div className={`${type.bgColor} rounded-3xl p-8 border border-neutral-100 hover:shadow-xl transition-all duration-300 h-full`}>
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-6 shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-neutral-900 mb-1">{type.title}</h3>
                    <p className={`text-sm font-medium ${type.textColor} mb-4`}>{type.subtitle}</p>

                    {/* Description */}
                    <p className="text-neutral-600 mb-6 leading-relaxed">{type.desc}</p>

                    {/* Examples */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Perfect for</p>
                      <div className="flex flex-wrap gap-2">
                        {type.examples.map((example, j) => (
                          <span key={j} className={`px-3 py-1 rounded-full text-xs font-medium ${type.bgColor} ${type.textColor} border border-current/20`}>
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Step Number */}
                    <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white flex items-center justify-center text-lg font-bold shadow-lg">
                      {i + 1}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* HOW IT WORKS - PUBLISHING FLOW */}
      {/* ============================================ */
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-0">
              <Zap className="w-3 h-3 mr-1" />
              No Signup. No Password. Just Email.
            </Badge>
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              Publish in 30 seconds
            </h2>
            <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
              Enter your email once. Get a Creator Passcode. Publish forever under your auto-generated profile.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: Layers,
                title: 'Create Your Hook', 
                desc: 'Upload image, add title, description, and category. Choose Link, Blog, or Product.',
                color: 'bg-purple-100 text-purple-600'
              },
              { 
                icon: Globe,
                title: 'Enter Your Email', 
                desc: 'No signup forms. No passwords. Just your email address to claim your content.',
                color: 'bg-pink-100 text-pink-600'
              },
              { 
                icon: Zap,
                title: 'Get Creator Passcode', 
                desc: 'We send a 6-digit passcode to your email. This is your key to publish forever.',
                color: 'bg-violet-100 text-violet-600'
              },
              { 
                icon: TrendingUp,
                title: 'Get Discovered', 
                desc: 'Your Hook appears in the unified feed. Track views and clicks. Build your presence.',
                color: 'bg-fuchsia-100 text-fuchsia-600'
              },
            ].map((step, i) => {
              const Icon = step.icon
              return (
                <div key={i} className="relative group text-center">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 hover:shadow-lg hover:border-purple-200 transition-all duration-300 h-full">
                    <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center mb-4 mx-auto`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white flex items-center justify-center text-sm font-bold mx-auto mb-4">
                      {i + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-neutral-500 leading-relaxed">{step.desc}</p>
                  </div>

                  {/* Connector line */}
                  {i < 3 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-purple-300 to-pink-300" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      
      /* CATEGORIES */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              Find your niche
            </h2>
            <p className="text-lg text-neutral-500">
              Whatever you create, there is a category for it.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon
              return (
                <Link key={cat.name} href={`/category/${cat.name.toLowerCase()}`}>
                  <div className="group relative rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-2 shadow-lg`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-white font-semibold text-lg">{cat.name}</h3>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* FOR CREATORS */}
      {/* ============================================ */}
      <section className="py-20 bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-6 bg-white/20 text-white border-0 hover:bg-white/30 backdrop-blur-sm">
                <Star className="w-3 h-3 mr-1" />
                For Creators
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                Your content deserves to be found
              </h2>
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                Stop fighting algorithms. Create a Hook and let people discover your work organically. 
                Every Hook sends traffic exactly where you want it — whether that is a blog, a product, or an external link.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  'Link to your YouTube, Instagram, website, or store',
                  'Write blogs that get discovered by search',
                  'Showcase products with pricing and details',
                  'Track views and link clicks in real-time',
                  'No followers needed. No likes. Just discovery.',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white/90">{item}</span>
                  </div>
                ))}
              </div>

              <Link href="/hook/new">
                <Button size="lg" className="bg-white text-purple-700 hover:bg-white/90 rounded-full h-14 px-8 text-lg gap-2 shadow-lg">
                  <Zap className="w-5 h-5" />
                  Start Creating
                </Button>
              </Link>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 mt-8">
                  {CREATOR_IMAGES_LEFT.map((src, i) => (
                    <div key={`left-${i}`} className="rounded-2xl overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-300">
                      <img src={src} alt="" className="w-full" loading="lazy" />
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  {CREATOR_IMAGES_RIGHT.map((src, i) => (
                    <div key={`right-${i}`} className="rounded-2xl overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-300">
                      <img src={src} alt="" className="w-full" loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* TESTIMONIALS */}
      {/* ============================================ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              Loved by creators
            </h2>
            <p className="text-lg text-neutral-500">
              See how creators use different Hook types to grow their presence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 hover:shadow-lg transition-shadow duration-300">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                {/* Hook Type Badge */}
                <div className="mb-3">
                  <HookTypeBadge type={testimonial.hookType.toLowerCase().replace(' hook', '')} />
                </div>

                <p className="text-neutral-700 mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-10 h-10 rounded-full object-cover"
                    loading="lazy"
                  />
                  <div>
                    <p className="font-semibold text-neutral-900 text-sm">{testimonial.author}</p>
                    <p className="text-neutral-500 text-xs">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* MONETIZATION ROADMAP */}
      {/* ============================================ */}
      <section className="py-20 bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-0">
              <TrendingUp className="w-3 h-3 mr-1" />
              Monetization Roadmap
            </Badge>
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              Grow with Hookit
            </h2>
            <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
              We are building tools to help creators monetize their presence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                phase: 'Phase 1',
                title: 'Featured Hooks',
                desc: 'Get your Hook featured at the top of the feed. Boost discovery and drive more traffic to your links, blogs, and products.',
                features: ['Featured Hooks', 'Featured Creators', 'Priority Placement'],
                color: 'from-purple-500 to-pink-500',
                available: true
              },
              { 
                phase: 'Phase 2',
                title: 'Blog Tools',
                desc: 'Advanced blogging features with SEO optimization, analytics dashboard, and subscriber management for your Blog Hooks.',
                features: ['SEO Tools', 'Analytics Dashboard', 'Subscriber Base'],
                color: 'from-violet-500 to-purple-500',
                available: false
              },
              { 
                phase: 'Phase 3',
                title: 'Native Checkout',
                desc: 'Sell products directly on Hookit. No external store needed. Native payment processing for your Product Hooks.',
                features: ['Native Payments', 'Order Management', 'Revenue Analytics'],
                color: 'from-pink-500 to-rose-500',
                available: false
              },
            ].map((phase, i) => (
              <div key={i} className={`relative rounded-2xl p-8 border transition-all duration-300 ${
                phase.available 
                  ? 'bg-white border-purple-200 shadow-lg shadow-purple-100' 
                  : 'bg-white/50 border-neutral-200'
              }`}>
                {phase.available && (
                  <div className="absolute -top-3 left-6 px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-bold rounded-full">
                    Available Now
                  </div>
                )}

                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${phase.color} flex items-center justify-center mb-4`}>
                  <span className="text-white font-bold text-sm">{i + 1}</span>
                </div>

                <p className="text-sm font-medium text-neutral-400 mb-1">{phase.phase}</p>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">{phase.title}</h3>
                <p className="text-neutral-600 mb-6 text-sm leading-relaxed">{phase.desc}</p>

                <div className="space-y-2">
                  {phase.features.map((feature, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm text-neutral-600">
                      <CheckCircle2 className={`w-4 h-4 ${phase.available ? 'text-green-500' : 'text-neutral-300'}`} />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* CTA SECTION */}
      {/* ============================================ */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-12 text-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4">
                Ready to get discovered?
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Create your first Hook in 30 seconds. No account needed. Just your email to publish.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/hook/new">
                  <Button size="lg" className="bg-white text-purple-700 hover:bg-white/90 rounded-full h-14 px-10 text-lg gap-2 shadow-lg">
                    <Zap className="w-5 h-5" />
                    Create a Hook
                  </Button>
                </Link>
                <Link href="/explore">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full h-14 px-10 text-lg">
                    Explore First
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* FOOTER NOTE */}
      {/* ============================================ */}
      <section className="py-8 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-neutral-400">
            Hookit — The Universal Visual Discovery Platform. Everything is a Hook.
          </p>
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