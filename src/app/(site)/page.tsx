// src/app/(site)/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  ArrowRight, 
  Heart, 
  Share2, 
  Bookmark,
  Sparkles,
  Globe,
  Zap,
  TrendingUp,
  Camera,
  Palette,
  Plane,
  ShoppingBag,
  Gamepad2,
  Utensils,
  Laptop,
  PenTool,
  Star,
  CheckCircle2,
  ExternalLink
} from 'lucide-react'

// HERO floating images - diverse creator content
const HERO_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop', alt: 'Fashion', top: '5%', left: '55%', delay: 0, width: 180, height: 260 },
  { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=400&fit=crop', alt: 'Travel', top: '15%', left: '75%', delay: 0.2, width: 160, height: 220 },
  { src: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=350&h=500&fit=crop', alt: 'Books', top: '60%', left: '50%', delay: 0.4, width: 170, height: 240 },
  { src: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=280&h=380&fit=crop', alt: 'Art', top: '70%', left: '72%', delay: 0.6, width: 150, height: 200 },
  { src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=320&h=450&fit=crop', alt: 'Events', top: '40%', left: '85%', delay: 0.8, width: 165, height: 230 },
  { src: 'https://images.unsplash.com/photo-1511376777868-611b54f68947?w=300&h=420&fit=crop', alt: 'Music', top: '25%', left: '90%', delay: 1, width: 155, height: 210 },
]

// MASONRY feed - expanded with more images and categories
const MASONRY_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=500&fit=crop', title: 'Minimal Watch', creator: 'Alex Design', category: 'Products', likes: 234 },
  { src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop', title: 'Portrait Photography', creator: 'Sarah Clicks', category: 'Photography', likes: 567 },
  { src: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=450&fit=crop', title: 'Abstract Art', creator: 'Maya Arts', category: 'Art', likes: 891 },
  { src: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=550&fit=crop', title: 'Swiss Alps', creator: 'Travel Bug', category: 'Travel', likes: 1234 },
  { src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=480&fit=crop', title: 'Street Fashion', creator: 'Style Icon', category: 'Fashion', likes: 445 },
  { src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=520&fit=crop', title: 'Coding Setup', creator: 'Dev Life', category: 'Technology', likes: 678 },
  { src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=470&fit=crop', title: 'Pizza Recipe', creator: 'Chef Mike', category: 'Food', likes: 890 },
  { src: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=580&fit=crop', title: 'Modern Art', creator: 'Gallery X', category: 'Art', likes: 334 },
  { src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=490&fit=crop', title: 'Mountain Lake', creator: 'Nature Lover', category: 'Travel', likes: 1567 },
  { src: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=510&fit=crop', title: 'Polaroid Camera', creator: 'Retro Vibes', category: 'Products', likes: 223 },
  { src: 'https://images.unsplash.com/photo-1472120435266-53107fd0c44a?w=400&h=460&fit=crop', title: 'Sunset Vibes', creator: 'Golden Hour', category: 'Photography', likes: 789 },
  { src: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=400&h=540&fit=crop', title: 'Colorful Art', creator: 'Art Studio', category: 'Art', likes: 556 },
  { src: 'https://images.unsplash.com/photo-1511376777868-611b54f68947?w=400&h=440&fit=crop', title: 'Music Studio', creator: 'Beat Maker', category: 'Music', likes: 432 },
  { src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=500&fit=crop', title: 'Retro Gaming', creator: 'Pixel Pro', category: 'Gaming', likes: 665 },
  { src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=420&fit=crop', title: 'Data Dashboard', creator: 'Tech Ninja', category: 'Technology', likes: 312 },
  { src: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=560&fit=crop', title: 'Healthy Bowl', creator: 'Fit Chef', category: 'Food', likes: 876 },
  { src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=480&fit=crop', title: 'Boutique Store', creator: 'Shop Owner', category: 'Products', likes: 543 },
  { src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=530&fit=crop', title: 'Runway Model', creator: 'Fashion Week', category: 'Fashion', likes: 987 },
  { src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=470&fit=crop', title: 'Foggy Forest', creator: 'Wanderlust', category: 'Travel', likes: 1123 },
  { src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=510&fit=crop', title: 'Model Shoot', creator: 'Lens Master', category: 'Photography', likes: 678 },
]

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

const STEPS = [
  { 
    icon: Camera, 
    title: 'Upload Your Hook', 
    desc: 'Share any image, product, artwork, or memory. Just drag and drop.',
    color: 'bg-purple-100 text-purple-600'
  },
  { 
    icon: PenTool, 
    title: 'Add Your Story', 
    desc: 'Write a title, description, and add tags. Keep it simple.',
    color: 'bg-pink-100 text-pink-600'
  },
  { 
    icon: ExternalLink, 
    title: 'Link Your World', 
    desc: 'Add your Instagram, website, YouTube, or any link you want traffic to.',
    color: 'bg-violet-100 text-violet-600'
  },
  { 
    icon: TrendingUp, 
    title: 'Get Discovered', 
    desc: 'People find your Hook, save it, share it, and visit your links.',
    color: 'bg-fuchsia-100 text-fuchsia-600'
  },
]

// Extra gallery images for the "For Creators" section
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

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Badge className="mb-6 bg-purple-100 text-purple-700 hover:bg-purple-200 border-0 px-4 py-1.5 text-sm font-medium">
                <Sparkles className="w-3 h-3 mr-1" />
                The Creator Discovery Platform
              </Badge>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-neutral-900 leading-[1.1] mb-6">
                Turn any idea into a{' '}
                <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 bg-clip-text text-transparent">
                  discoverable Hook
                </span>
              </h1>

              <p className="text-xl text-neutral-500 mb-8 max-w-lg leading-relaxed">
                Share your products, art, travel, blogs, and creations. 
                Get discovered. Drive traffic to your world.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <Link href="/hook/new">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-full h-14 px-8 text-lg gap-2">
                    <Zap className="w-5 h-5" />
                    Create Your Hook
                  </Button>
                </Link>
                <Link href="/explore">
                  <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-lg border-neutral-300 hover:border-purple-300 hover:bg-purple-50 gap-2">
                    Explore Hooks
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 text-sm text-neutral-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  No sign up required
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Free forever
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  30 seconds to publish
                </div>
              </div>
            </div>

            {/* Right - Floating Images */}
            <div className="relative h-[500px] lg:h-[600px] hidden lg:block">
              {HERO_IMAGES.map((img, i) => (
                <div
                  key={i}
                  className={`absolute rounded-2xl overflow-hidden shadow-2xl transition-all duration-1000 hover:scale-105 hover:z-10 cursor-pointer ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{
                    top: img.top,
                    left: img.left,
                    width: img.width,
                    height: img.height,
                    transitionDelay: `${img.delay}s`,
                    animation: `float 6s ease-in-out infinite`,
                    animationDelay: `${i * 0.5}s`,
                  }}
                  onMouseEnter={() => setHoveredCard(i)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <img 
                    src={img.src} 
                    alt={img.alt}
                    className="w-full h-full object-cover"
                  />
                  {hoveredCard === i && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3">
                      <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-colors">
                        <Heart className="w-5 h-5 text-white" />
                      </button>
                      <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-colors">
                        <Bookmark className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl -z-10" />
      </section>

      {/* Stats Bar */}
      <section className="py-8 border-y border-neutral-100 bg-gradient-to-r from-purple-50/50 to-pink-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '10K+', label: 'Hooks Created' },
              { value: '50K+', label: 'Monthly Visitors' },
              { value: '100K+', label: 'Links Clicked' },
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

      {/* Masonry Feed Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              Discover amazing Hooks
            </h2>
            <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
              From art and photography to products and travel — find inspiration from creators around the world.
            </p>
          </div>

          {/* Masonry Grid */}
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {MASONRY_IMAGES.map((item, i) => (
              <div
                key={i}
                className="break-inside-avoid group relative rounded-2xl overflow-hidden cursor-pointer"
                onMouseEnter={() => setHoveredCard(i + 100)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300 ${
                  hoveredCard === i + 100 ? 'opacity-100' : 'opacity-0'
                }`}>
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-colors">
                      <Bookmark className="w-4 h-4 text-white" />
                    </button>
                    <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-colors">
                      <Share2 className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold text-sm mb-1">{item.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-white/80 text-xs">{item.creator}</span>
                      <div className="flex items-center gap-1 text-white/80 text-xs">
                        <Heart className="w-3 h-3" />
                        {item.likes}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category Badge */}
                <Badge className="absolute top-3 left-3 bg-white/90 text-neutral-700 border-0 text-xs">
                  {item.category}
                </Badge>
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

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-b from-white to-purple-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-700 border-0">
              How It Works
            </Badge>
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              Create your online presence in 4 steps
            </h2>
            <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
              No complex setup. No marketplace jargon. Just create, share, and get discovered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <div key={i} className="relative group">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 hover:shadow-lg hover:border-purple-200 transition-all duration-300 h-full">
                  <div className={`w-12 h-12 rounded-xl ${step.color} flex items-center justify-center mb-4`}>
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
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
            {CATEGORIES.map((cat) => (
              <Link key={cat.name} href={`/category/${cat.name.toLowerCase()}`}>
                <div className="group relative rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-2`}>
                      <cat.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-white font-semibold text-lg">{cat.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* For Creators Section */}
      <section className="py-20 bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-6 bg-white/20 text-white border-0 hover:bg-white/30">
                For Creators
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                Your content deserves to be found
              </h2>
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                Stop fighting algorithms. Create a Hook and let people discover your work organically. 
                Every Hook sends traffic exactly where you want it.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  'Link to your Instagram, YouTube, website, or store',
                  'Get discovered by people searching for your niche',
                  'Track views, saves, and link clicks',
                  'Build a following without algorithm dependency',
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
                <Button size="lg" className="bg-white text-purple-700 hover:bg-white/90 rounded-full h-14 px-8 text-lg gap-2">
                  <Zap className="w-5 h-5" />
                  Start Creating
                </Button>
              </Link>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 mt-8">
                  {CREATOR_IMAGES_LEFT.map((src, i) => (
                    <div key={`left-${i}`} className="rounded-2xl overflow-hidden shadow-2xl">
                      <img src={src} alt="" className="w-full" loading="lazy" />
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  {CREATOR_IMAGES_RIGHT.map((src, i) => (
                    <div key={`right-${i}`} className="rounded-2xl overflow-hidden shadow-2xl">
                      <img src={src} alt="" className="w-full" loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              Loved by creators
            </h2>
            <p className="text-lg text-neutral-500">
              See what people are saying about Hookit.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "I created a Hook for my art portfolio and got 500+ visits to my Instagram in one week. This is exactly what creators need.",
                author: "Priya Sharma",
                role: "Digital Artist",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
              },
              {
                quote: "No sign up, no hassle. I uploaded my product photo, added my Shopify link, and started getting traffic immediately.",
                author: "Rahul Verma",
                role: "Product Designer",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
              },
              {
                quote: "Hookit replaced my Linktree + Pinterest combo. One platform for discovery and traffic. Brilliant.",
                author: "Anita Desai",
                role: "Travel Blogger",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
              },
            ].map((testimonial, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
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

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-4">
              Ready to get discovered?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Create your first Hook in 30 seconds. No account needed. Just your email to publish.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/hook/new">
                <Button size="lg" className="bg-white text-purple-700 hover:bg-white/90 rounded-full h-14 px-10 text-lg gap-2">
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
      </section>

      {/* Floating animation keyframes */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  )
}