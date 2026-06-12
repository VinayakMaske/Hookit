// src/app/(site)/page.tsx
'use client'

import { useState, useEffect } from 'react'
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
  X,
  Upload,
  Type,
  MessageSquare,
  Hash,
  Link2,
  Send,
  Share2,
  Users,
  Clock,
  BarChart3,
  Target,
  Rocket,
  Shield,
  BrainCircuit,
  Bot,
  Search as SearchIcon,
  MapPin,
  Briefcase,
  Home,
  Paintbrush,
  BookOpen,
  Coffee,
  Code2,
  Mountain,
  Gem,
  Lightbulb,
  Megaphone,
  Repeat,
  Workflow,
  ArrowDown,
  ArrowDownToLine,
  CircleDot,
  GitBranch,
  Network,
  Radio,
  ScanLine,
  Telescope,
  Quote,
  BookMarked,
  Landmark,
  Film,
  Dumbbell,
  Wallet,
  GraduationCap,
  Sparkle,
  Infinity,
  TrendingUp as TrendIcon,
  ArrowUpRight as ArrowUpRightIcon
} from 'lucide-react'

// ============================================
// HERO FLOATING CARDS — Creator content examples
// ============================================
const HERO_DISCOVERY = [
  { 
    src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop', 
    title: 'Summer Fashion Collection',
    creator: 'stylestudio',
    category: 'Fashion',
    type: 'link',
    top: 10, left: 20, delay: 0, width: 180, height: 260,
    searchTerms: ['summer fashion', 'outfit ideas', 'style guide']
  },
  { 
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=400&fit=crop', 
    title: 'Hidden Gems of Switzerland',
    creator: 'wanderlust',
    category: 'Travel',
    type: 'blog',
    top: 60, left: 10, delay: 0.15, width: 170, height: 240,
    searchTerms: ['swiss travel guide', 'hidden villages', 'switzerland']
  },
  { 
    src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=350&h=500&fit=crop', 
    title: 'Best Coding Setup 2026',
    creator: 'devlife',
    category: 'Technology',
    type: 'link',
    top: 5, left: 200, delay: 0.3, width: 160, height: 230,
    searchTerms: ['coding setup', 'developer workspace', 'tech gear']
  },
  { 
    src: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=280&h=380&fit=crop', 
    title: 'Minimalist Book Reviews',
    creator: 'bookworm',
    category: 'Books',
    type: 'blog',
    top: 180, left: 60, delay: 0.45, width: 175, height: 250,
    searchTerms: ['book reviews', 'must read books', 'reading list']
  },
  { 
    src: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=320&h=450&fit=crop', 
    title: 'Abstract Digital Art',
    creator: 'artflow',
    category: 'Art',
    type: 'product',
    price: '$49',
    top: 140, left: 220, delay: 0.6, width: 165, height: 235,
    searchTerms: ['abstract art', 'digital prints', 'wall art']
  },
  { 
    src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300&h=420&fit=crop', 
    title: 'Event Photography Tips',
    creator: 'shutterbug',
    category: 'Photography',
    type: 'blog',
    top: 50, left: 360, delay: 0.75, width: 155, height: 220,
    searchTerms: ['photography tips', 'event photos', 'camera settings']
  },
  { 
    src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=280&h=400&fit=crop', 
    title: 'Authentic Pizza Recipe',
    creator: 'chefmike',
    category: 'Food',
    type: 'blog',
    top: 200, left: 340, delay: 0.9, width: 170, height: 240,
    searchTerms: ['pizza recipe', 'homemade pizza', 'italian cooking']
  },
  { 
    src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=440&fit=crop', 
    title: 'Minimal Watch Design',
    creator: 'alexdesign',
    category: 'Products',
    type: 'product',
    price: '$129',
    top: 260, left: 150, delay: 1.05, width: 160, height: 225,
    searchTerms: ['minimal watch', 'modern wristwatch', 'designer watch']
  },
]

// ============================================
// WHY CREATORS USE HOOKIT — Platform comparison
// ============================================
const PLATFORM_COMPARISON = [
  {
    name: 'Social Media',
    icon: Heart,
    color: 'from-pink-500 to-rose-500',
    problem: 'Posts disappear in 24–48 hours. Algorithm decides who sees it.',
    stat: '90% of posts never seen after 2 days',
    hookitCompare: 'Pages compound forever',
  },
  {
    name: 'YouTube',
    icon: Play,
    color: 'from-red-500 to-orange-500',
    problem: 'Requires subscribers and watch time. Hard to get discovered without existing audience.',
    stat: '500+ hours uploaded every minute',
    hookitCompare: 'Search discoverable instantly',
  },
  {
    name: 'Blogs',
    icon: FileText,
    color: 'from-blue-500 to-cyan-500',
    problem: 'Require SEO knowledge, hosting, and months of domain authority building.',
    stat: 'Average blog takes 6+ months to rank',
    hookitCompare: 'SEO-ready from day one',
  },
  {
    name: 'Personal Sites',
    icon: Globe,
    color: 'from-indigo-500 to-violet-500',
    problem: 'Need traffic, technical setup, and ongoing maintenance to stay visible.',
    stat: '97% of websites get zero organic traffic',
    hookitCompare: 'Built-in discovery network',
  },
]

// ============================================
// HOW IT WORKS STEPS
// ============================================
const HOW_IT_WORKS = [
  {
    step: '01',
    icon: Upload,
    title: 'Create a Hook',
    description: 'Upload an image, title, description and links. First impressions matter.',
    color: 'from-purple-500 to-violet-500',
  },
  {
    step: '02',
    icon: Sparkles,
    title: 'Become Discoverable',
    description: 'Hookit automatically creates an SEO page, category page, creator page and search-intent connections.',
    color: 'from-pink-500 to-rose-500',
  },
  {
    step: '03',
    icon: Globe,
    title: 'Get Found',
    description: 'People discover your content through Google, ChatGPT, Gemini, Claude and Hookit search.',
    color: 'from-orange-500 to-amber-500',
  },
]

// ============================================
// DISCOVERY GRAPH — Visual flow
// ============================================
const DISCOVERY_GRAPH = [
  {
    title: 'Creator Content',
    description: 'Your product, blog, video, art, or idea',
    icon: Upload,
    color: 'from-purple-600 to-pink-500',
    items: ['Product', 'Blog', 'Video', 'Art', 'Guide', 'Portfolio'],
  },
  {
    title: 'Hook Page',
    description: 'A beautiful, dedicated page for your content',
    icon: FileText,
    color: 'from-violet-500 to-purple-500',
    items: ['SEO Optimized', 'AI Readable', 'Mobile Ready'],
  },
  {
    title: 'Category Page',
    description: 'Listed in relevant category directories',
    icon: Layers,
    color: 'from-indigo-500 to-blue-500',
    items: ['Travel', 'Art', 'Tech', 'Food', 'Fashion'],
  },
  {
    title: 'Search Pages',
    description: 'Appears for multiple search intents',
    icon: SearchIcon,
    color: 'from-sky-500 to-cyan-500',
    items: ['Keyword Pages', 'Topic Pages', 'Intent Pages'],
  },
  {
    title: 'Creator Profile',
    description: 'All your hooks in one discoverable place',
    icon: Users,
    color: 'from-teal-500 to-emerald-500',
    items: ['Portfolio View', 'All Hooks', 'Bio & Links'],
  },
  {
    title: 'Discovery Channels',
    description: 'Found through every major discovery platform',
    icon: Globe,
    color: 'from-orange-500 to-amber-500',
    items: ['Google', 'ChatGPT', 'Gemini', 'Claude', 'Perplexity'],
  },
]

// ============================================
// SEARCH INTENT EXAMPLES
// ============================================
const SEARCH_INTENTS = [
  { term: 'best ai tools', category: 'Technology', icon: Bot },
  { term: 'travel guide japan', category: 'Travel', icon: Plane },
  { term: 'best productivity apps', category: 'Productivity', icon: Zap },
  { term: 'minimal wall art', category: 'Art', icon: Palette },
  { term: 'book summaries', category: 'Books', icon: BookOpen },
  { term: 'healthy recipes', category: 'Food', icon: Utensils },
  { term: 'coding setup', category: 'Technology', icon: Code2 },
  { term: 'photography tips', category: 'Photography', icon: Camera },
  { term: 'remote jobs', category: 'Career', icon: Briefcase },
  { term: 'digital products', category: 'Business', icon: ShoppingBag },
  { term: 'best travel backpack', category: 'Travel', icon: MapPin },
  { term: 'interior design ideas', category: 'Design', icon: Home },
  { term: 'architecture inspiration', category: 'Design', icon: Mountain },
  { term: 'cozy home decor', category: 'Lifestyle', icon: Coffee },
  { term: 'ancient roman architecture', category: 'History', icon: Landmark },
  { term: 'golden hour camera settings', category: 'Photography', icon: Camera },
  { term: 'best running shoes beginners', category: 'Fitness', icon: Dumbbell },
  { term: 'personal finance tips', category: 'Finance', icon: Wallet },
]

// ============================================
// CREATOR EXAMPLES
// ============================================
const CREATOR_EXAMPLES = [
  {
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    name: 'Maya Chen',
    role: 'Digital Artist',
    contentTitle: 'Abstract Canvas Collection',
    contentImage: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
    contentType: 'product',
    searches: ['abstract wall art', 'modern canvas painting', 'minimalist artwork', 'digital art prints'],
    discoveryPaths: ['Hook Page', 'Art Category', 'Search: wall art', 'Creator Profile'],
  },
  {
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    name: 'James Wilson',
    role: 'Travel Creator',
    contentTitle: 'Swiss Alps Hidden Guide',
    contentImage: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=300&fit=crop',
    contentType: 'blog',
    searches: ['best places in Switzerland', 'hidden Swiss villages', 'Swiss travel guide', 'alps itinerary'],
    discoveryPaths: ['Hook Page', 'Travel Category', 'Search: Switzerland', 'Creator Profile'],
  },
  {
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    name: 'Alex Rivera',
    role: 'Store Owner',
    contentTitle: 'Minimal Watch Design',
    contentImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    contentType: 'product',
    searches: ['minimal watch', 'best watch under $150', 'modern wristwatch', 'designer timepiece'],
    discoveryPaths: ['Hook Page', 'Products Category', 'Search: minimal watch', 'Creator Profile'],
  },
]

// ============================================
// DISCOVERY PATHS
// ============================================
const DISCOVERY_PATHS = [
  {
    icon: FileText,
    title: 'Hook Page',
    description: 'A dedicated, SEO-optimized page for every piece of content you publish.',
    color: 'bg-purple-500',
    bgLight: 'bg-purple-50',
  },
  {
    icon: Layers,
    title: 'Category Page',
    description: 'Automatically listed in relevant category directories where people browse.',
    color: 'bg-indigo-500',
    bgLight: 'bg-indigo-50',
  },
  {
    icon: SearchIcon,
    title: 'Search Pages',
    description: 'Appears on multiple search-intent pages based on the phrases you add.',
    color: 'bg-sky-500',
    bgLight: 'bg-sky-50',
  },
  {
    icon: Users,
    title: 'Creator Profile',
    description: 'All your content lives on your public profile — a discoverable portfolio.',
    color: 'bg-teal-500',
    bgLight: 'bg-teal-50',
  },
]

// ============================================
// HOOK TYPES
// ============================================
const HOOK_TYPES = [
  {
    title: 'Blog Hooks',
    description: 'Publish articles, insights and knowledge.',
    icon: FileText,
    color: 'from-purple-500 to-violet-500',
    example: 'Atomic Habits Summary',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop',
  },
  {
    title: 'Product Hooks',
    description: 'Showcase products and recommendations.',
    icon: ShoppingBag,
    color: 'from-pink-500 to-rose-500',
    example: 'Best Budget Camera 2026',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
  },
  {
    title: 'Link Hooks',
    description: 'Share websites, tools and resources.',
    icon: Link2,
    color: 'from-orange-500 to-amber-500',
    example: 'Japanese Learning Resources',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
  },
  {
    title: 'Memory Hooks',
    description: 'Travel stories, experiences and discoveries.',
    icon: MapPin,
    color: 'from-emerald-500 to-teal-500',
    example: 'Hidden Waterfall in Manali',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
  },
  {
    title: 'Review Hooks',
    description: 'Share opinions and recommendations.',
    icon: Star,
    color: 'from-sky-500 to-blue-500',
    example: 'Best Running Shoes for Beginners',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=300&fit=crop',
  },
  {
    title: 'Collection Hooks',
    description: 'Curated lists and knowledge collections.',
    icon: Layers,
    color: 'from-indigo-500 to-violet-500',
    example: 'Cozy Home Interior Ideas',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
  },
]

// ============================================
// CATEGORIES
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
  { name: 'Books', icon: BookOpen, color: 'from-amber-600 to-orange-500', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop', count: '1.4K' },
  { name: 'Movies', icon: Film, color: 'from-red-500 to-pink-500', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=400&fit=crop', count: '1.2K' },
  { name: 'History', icon: Landmark, color: 'from-stone-500 to-neutral-500', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=300&h=400&fit=crop', count: '980' },
  { name: 'Architecture', icon: Mountain, color: 'from-slate-500 to-gray-500', image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=300&h=400&fit=crop', count: '850' },
  { name: 'Fitness', icon: Dumbbell, color: 'from-green-500 to-emerald-500', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300&h=400&fit=crop', count: '1.1K' },
  { name: 'Business', icon: Briefcase, color: 'from-blue-600 to-indigo-500', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=400&fit=crop', count: '1.7K' },
  { name: 'Health', icon: Heart, color: 'from-rose-500 to-red-500', image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=300&h=400&fit=crop', count: '1.3K' },
  { name: 'Self Improvement', icon: Lightbulb, color: 'from-yellow-500 to-amber-500', image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=300&h=400&fit=crop', count: '1.5K' },
  { name: 'Interior Design', icon: Home, color: 'from-teal-500 to-cyan-500', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=300&h=400&fit=crop', count: '920' },
  { name: 'Learning', icon: GraduationCap, color: 'from-violet-500 to-purple-500', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=400&fit=crop', count: '1.1K' },
]

// ============================================
// TESTIMONIALS
// ============================================
const TESTIMONIALS = [
  {
    quote: "My travel guides went from 50 views to 5,000+ monthly searches. Hookit turned my content into a discovery engine.",
    name: "Sarah Mitchell",
    role: "Travel Blogger",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    metric: "5,000+ monthly searches",
  },
  {
    quote: "I published a product review and within a week it was ranking on Google. No SEO knowledge required.",
    name: "David Chen",
    role: "Tech Reviewer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    metric: "Ranked on Google in 7 days",
  },
  {
    quote: "As an artist, I needed people to find my work without fighting algorithms. Hookit made my portfolio discoverable.",
    name: "Elena Rodriguez",
    role: "Digital Artist",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    metric: "Portfolio fully indexed",
  },
]

// ============================================
// STATS
// ============================================
const STATS = [
  { icon: FileText, value: '10K+', label: 'Discoverable Hooks' },
  { icon: Users, value: '500+', label: 'Active Creators' },
  { icon: Layers, value: '100+', label: 'Categories' },
  { icon: SearchIcon, value: '50K+', label: 'Search Queries' },
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
// COMPONENT: Search Term Badge
// ============================================
function SearchTermBadge({ term }: { term: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-medium border border-purple-100">
      <SearchIcon className="w-3 h-3" />
      {term}
    </span>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-white">

      {/* ============================================ */}
      {/* HERO SECTION — "Create Once. Get Discovered Everywhere." */}
      {/* ============================================ */}
      <section className="relative pt-20 pb-8 lg:pt-28 lg:pb-12 overflow-hidden">
        {/* Background gradient blobs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-100/50 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-pink-100/50 rounded-full blur-3xl -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-50/30 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left: Headline + Creator CTA */}
            <div className={`transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Badge className="mb-5 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-0 px-4 py-1.5 text-sm">
                <Rocket className="w-3.5 h-3.5 mr-1.5" />
                The Search Discovery Engine for Creators
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-neutral-900 leading-[1.05] mb-5">
                Create Once.
                <br />
                <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 bg-clip-text text-transparent">
                  Get Discovered
                </span>
                <br />
                Everywhere.
              </h1>

              <p className="text-lg sm:text-xl text-neutral-500 mb-6 max-w-lg leading-relaxed">
                Turn any idea, product, blog, recommendation, travel discovery, resource, review or memory into 
                <span className="text-neutral-700 font-semibold"> searchable pages</span> that get discovered 
                through Google, ChatGPT, Gemini, Claude and AI search engines.
              </p>

              <div className="flex flex-wrap gap-3 mb-6">
                <Link href="/hook/new">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-full h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg gap-2 shadow-lg shadow-purple-200/50">
                    <Zap className="w-5 h-5" />
                    Create a Hook
                  </Button>
                </Link>
                <Link href="/explore">
                  <Button size="lg" variant="outline" className="rounded-full h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg border-neutral-300 hover:border-purple-300 hover:bg-purple-50 gap-2">
                    <Eye className="w-5 h-5" />
                    Explore Hooks
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-neutral-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  No website required
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  No SEO knowledge required
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  No followers required
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Free to publish
                </div>
              </div>
            </div>

            {/* Right: Floating Discovery Cards */}
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
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/70 text-xs">@{hook.creator}</span>
                      <HookTypeBadge type={hook.type} />
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {hook.searchTerms?.slice(0, 2).map((term, j) => (
                        <span key={j} className="text-[10px] bg-white/20 text-white/90 px-1.5 py-0.5 rounded">
                          {term}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Type indicator */}
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
      {/* DISCOVERY STATS SECTION */}
      {/* ============================================ */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-white via-purple-50/30 to-white border-y border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {STATS.map((stat, i) => {
              const Icon = stat.icon
              return (
                <div key={i} className="text-center p-6 rounded-2xl bg-white border border-neutral-100 hover:border-purple-200 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">{stat.value}</p>
                  <p className="text-sm text-neutral-500 mt-2 font-medium">{stat.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* HOW IT WORKS — 3 Step Process */}
      {/* ============================================ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <Badge className="mb-4 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-0 px-4 py-1.5">
              <Workflow className="w-3.5 h-3.5 mr-1.5" />
              How It Works
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-3">
              Publish in 3 simple steps
            </h2>
            <p className="text-base sm:text-lg text-neutral-500 max-w-2xl mx-auto">
              Hookit automatically creates discoverable pages. You just create the content.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-24 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200" />

            {HOW_IT_WORKS.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={i} className="group relative bg-white rounded-2xl p-6 sm:p-8 border border-neutral-100 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300 text-center">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 mx-auto`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">{step.step}</span>
                    <h3 className="text-xl font-bold text-neutral-900">{step.title}</h3>
                  </div>
                  <p className="text-neutral-500 text-sm leading-relaxed">{step.description}</p>
                </div>
              )
            })}
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-neutral-400 inline-flex items-center gap-2 bg-neutral-50 px-4 py-2 rounded-full">
              <Sparkles className="w-4 h-4 text-purple-500" />
              Hookit automatically generates SEO metadata, structured data, and AI-friendly content
            </p>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* HOOK TYPES SECTION */}
      {/* ============================================ */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-purple-50/30 via-white to-pink-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <Badge className="mb-4 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-0 px-4 py-1.5">
              <Layers className="w-3.5 h-3.5 mr-1.5" />
              Hook Types
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-3">
              Every idea deserves a Hook
            </h2>
            <p className="text-base sm:text-lg text-neutral-500 max-w-2xl mx-auto">
              Publish articles, showcase products, share resources, tell stories, write reviews, or curate collections.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {HOOK_TYPES.map((hookType, i) => {
              const Icon = hookType.icon
              return (
                <div key={i} className="group relative bg-white rounded-2xl border border-neutral-100 hover:border-purple-200 hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img 
                      src={hookType.image} 
                      alt={hookType.example}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <span className="text-white/80 text-xs font-medium">Example:</span>
                      <p className="text-white font-semibold text-sm">{hookType.example}</p>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${hookType.color} flex items-center justify-center mb-3 shadow-md`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900 mb-1">{hookType.title}</h3>
                    <p className="text-sm text-neutral-500">{hookType.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* THE DISCOVERY GRAPH — Visual Flow */}
      {/* ============================================ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <Badge className="mb-4 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-0 px-4 py-1.5">
              <GitBranch className="w-3.5 h-3.5 mr-1.5" />
              The Discovery Graph
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-3">
              One upload. Many discovery paths.
            </h2>
            <p className="text-base sm:text-lg text-neutral-500 max-w-2xl mx-auto">
              Hookit does not just host your content — it multiplies your chances of being found.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {DISCOVERY_GRAPH.map((node, i) => {
              const Icon = node.icon
              return (
                <div key={i} className="relative">
                  <div className="bg-white rounded-2xl p-6 border border-neutral-100 hover:border-purple-200 hover:shadow-lg transition-all duration-300 group">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${node.color} flex items-center justify-center mb-4 shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900 mb-1">{node.title}</h3>
                    <p className="text-sm text-neutral-500 mb-4">{node.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {node.items.map((item, j) => (
                        <span key={j} className="px-2 py-1 rounded-md bg-neutral-50 text-neutral-600 text-xs font-medium">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Connector */}
                  {i < DISCOVERY_GRAPH.length - 1 && i !== 2 && (
                    <div className="hidden sm:flex justify-center my-2">
                      <ArrowDown className="w-5 h-5 text-neutral-300" />
                    </div>
                  )}
                  {i === 2 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2">
                      <ArrowRight className="w-5 h-5 text-neutral-300" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SEARCH INTENT EXAMPLES — People Search. Hookit Connects. */}
      {/* ============================================ */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-purple-50/30 via-white to-pink-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <Badge className="mb-4 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-0 px-4 py-1.5">
              <SearchIcon className="w-3.5 h-3.5 mr-1.5" />
              Search Intent
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-3">
              People Search.
              <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent"> Hookit Connects.</span>
            </h2>
            <p className="text-base sm:text-lg text-neutral-500 max-w-2xl mx-auto">
              Every search phrase can become a discoverable page. Here is what people are searching for right now.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {SEARCH_INTENTS.map((intent, i) => {
              const Icon = intent.icon
              return (
                <div 
                  key={i} 
                  className={`group flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-200 cursor-default ${
                    i % 3 === 0 
                      ? 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100 hover:shadow-md hover:shadow-purple-100' 
                      : i % 3 === 1 
                        ? 'bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100 hover:shadow-md hover:shadow-pink-100'
                        : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:shadow-md hover:shadow-blue-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 opacity-60" />
                  <span className="text-sm font-medium">{intent.term}</span>
                  <span className="text-[10px] opacity-50 ml-1">{intent.category}</span>
                </div>
              )
            })}
          </div>

          <div className="mt-10 text-center">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-3 rounded-2xl border border-purple-100">
              <BrainCircuit className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-neutral-600">
                When someone searches any of these, your Hook can appear in results — 
                <span className="font-semibold text-purple-700"> automatically</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* CREATOR EXAMPLES — Real Discovery Stories */}
      {/* ============================================ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <Badge className="mb-4 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-0 px-4 py-1.5">
              <Users className="w-3.5 h-3.5 mr-1.5" />
              Creator Examples
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-3">
              How creators get discovered
            </h2>
            <p className="text-base sm:text-lg text-neutral-500 max-w-2xl mx-auto">
              See how different creators use Hookit to turn their content into searchable discovery pages.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {CREATOR_EXAMPLES.map((creator, i) => (
              <div key={i} className="bg-white rounded-2xl border border-neutral-100 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-100/30 transition-all duration-300 overflow-hidden group">
                {/* Content Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={creator.contentImage} 
                    alt={creator.contentTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <HookTypeBadge type={creator.contentType} />
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  {/* Creator Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <img 
                      src={creator.avatar} 
                      alt={creator.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-100"
                    />
                    <div>
                      <p className="font-semibold text-sm text-neutral-900">{creator.name}</p>
                      <p className="text-xs text-neutral-400">{creator.role}</p>
                    </div>
                  </div>

                  <h3 className="font-bold text-neutral-900 mb-3">{creator.contentTitle}</h3>

                  {/* Search Terms */}
                  <div className="mb-4">
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 mb-2">People search for</p>
                    <div className="flex flex-wrap gap-1.5">
                      {creator.searches.map((search, j) => (
                        <span key={j} className="px-2 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-medium border border-purple-100">
                          {search}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Discovery Paths */}
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 mb-2">Appears on</p>
                    <div className="flex flex-wrap gap-1.5">
                      {creator.discoveryPaths.map((path, j) => (
                        <span key={j} className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">
                          {path}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* WHY HOOKIT IS DIFFERENT — Comparison Table */}
      {/* ============================================ */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-purple-50/30 via-white to-pink-50/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <Badge className="mb-4 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-0 px-4 py-1.5">
              <Target className="w-3.5 h-3.5 mr-1.5" />
              Why Hookit Is Different
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-3">
              Stop fighting algorithms. Start building discoverability.
            </h2>
            <p className="text-base sm:text-lg text-neutral-500 max-w-2xl mx-auto">
              Social media buries content. Hookit makes it discoverable forever.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
            {/* Header */}
            <div className="grid grid-cols-3 gap-4 p-4 sm:p-6 bg-neutral-50 border-b border-neutral-200">
              <div className="text-sm font-semibold text-neutral-500">Platform</div>
              <div className="text-sm font-semibold text-neutral-500 text-center">The Problem</div>
              <div className="text-sm font-semibold text-purple-700 text-center">Hookit</div>
            </div>

            {/* Rows */}
            {[
              { platform: 'Social Media', problem: 'Posts disappear in 24–48 hours', hookit: 'Pages compound forever', icon: Heart },
              { platform: 'YouTube', problem: 'Algorithm dependent on subscribers', hookit: 'Search discoverable instantly', icon: Play },
              { platform: 'Blogs', problem: 'Content lifespan is hours', hookit: 'Content lifespan is years', icon: FileText },
              { platform: 'Personal Sites', problem: 'Followers required', hookit: 'Search intent required', icon: Globe },
            ].map((row, i) => {
              const Icon = row.icon
              return (
                <div key={i} className={`grid grid-cols-3 gap-4 p-4 sm:p-6 items-center ${i !== 3 ? 'border-b border-neutral-100' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-neutral-500" />
                    </div>
                    <span className="font-semibold text-sm text-neutral-900">{row.platform}</span>
                  </div>
                  <div className="text-center text-sm text-neutral-500">{row.problem}</div>
                  <div className="text-center text-sm font-semibold text-purple-700 bg-purple-50 py-2 rounded-lg">{row.hookit}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* AI DISCOVERY SECTION */}
      {/* ============================================ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <Badge className="mb-4 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-0 px-4 py-1.5">
              <Bot className="w-3.5 h-3.5 mr-1.5" />
              Built For The AI Search Era
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-3">
              Every Hook is AI-ready
            </h2>
            <p className="text-base sm:text-lg text-neutral-500 max-w-2xl mx-auto">
              Structured data, semantic content, and LLM-readable summaries make your Hooks discoverable by AI search tools.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Structured Data', desc: 'Schema.org markup for every Hook page', icon: FileText, color: 'from-purple-500 to-violet-500' },
              { title: 'Semantic Content', desc: 'Context-rich content AI can understand', icon: BrainCircuit, color: 'from-pink-500 to-rose-500' },
              { title: 'Search Intent', desc: 'Mapped to real user search queries', icon: SearchIcon, color: 'from-orange-500 to-amber-500' },
              { title: 'Category Context', desc: 'Organized in topic hierarchies', icon: Layers, color: 'from-emerald-500 to-teal-500' },
              { title: 'Creator Context', desc: 'Author profiles with authority signals', icon: Users, color: 'from-sky-500 to-blue-500' },
              { title: 'LLM Summaries', desc: 'Auto-generated concise descriptions', icon: Sparkles, color: 'from-indigo-500 to-violet-500' },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className="group bg-white rounded-2xl p-6 border border-neutral-100 hover:border-purple-200 hover:shadow-lg transition-all duration-300">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-neutral-500">{item.desc}</p>
                </div>
              )
            })}
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {['ChatGPT', 'Gemini', 'Claude', 'Perplexity', 'Grok', 'Google'].map((ai, i) => (
              <span key={i} className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 text-sm font-medium text-purple-700">
                {ai}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* TESTIMONIALS SECTION */}
      {/* ============================================ */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-purple-50/30 via-white to-pink-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <Badge className="mb-4 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-0 px-4 py-1.5">
              <Quote className="w-3.5 h-3.5 mr-1.5" />
              Creator Stories
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-3">
              Discoverability that drives growth
            </h2>
            <p className="text-base sm:text-lg text-neutral-500 max-w-2xl mx-auto">
              Real creators using Hookit to get discovered through search.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-100 hover:border-purple-200 hover:shadow-xl transition-all duration-300">
                <Quote className="w-8 h-8 text-purple-200 mb-4" />
                <p className="text-neutral-700 text-sm leading-relaxed mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3 mb-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-100" />
                  <div>
                    <p className="font-semibold text-sm text-neutral-900">{t.name}</p>
                    <p className="text-xs text-neutral-400">{t.role}</p>
                  </div>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                  <TrendIcon className="w-3 h-3" />
                  {t.metric}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* ONE HOOK, MANY DISCOVERY PATHS */}
      {/* ============================================ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <Badge className="mb-4 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-0 px-4 py-1.5">
              <Network className="w-3.5 h-3.5 mr-1.5" />
              Multi-Path Discovery
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-3">
              One Hook. Many Discovery Paths.
            </h2>
            <p className="text-base sm:text-lg text-neutral-500 max-w-2xl mx-auto">
              Every time you publish, Hookit creates multiple discovery opportunities automatically.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DISCOVERY_PATHS.map((path, i) => {
              const Icon = path.icon
              return (
                <div key={i} className="group relative bg-white rounded-2xl p-6 border border-neutral-100 hover:border-purple-200 hover:shadow-xl transition-all duration-300 text-center">
                  <div className={`w-14 h-14 rounded-2xl ${path.color} flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">{path.title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{path.description}</p>
                </div>
              )
            })}
          </div>

          {/* Visual connector */}
          <div className="mt-12 flex flex-col items-center">
            <div className="w-px h-8 bg-gradient-to-b from-purple-300 to-transparent" />
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl p-6 sm:p-8 text-white max-w-2xl w-full text-center shadow-xl shadow-purple-200/50">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Bot className="w-5 h-5" />
                <span className="font-semibold">AI & Search Ready</span>
              </div>
              <p className="text-white/80 text-sm sm:text-base">
                Every Hook page is structured for AI search tools like ChatGPT, Gemini, Claude, and Perplexity 
                to understand and surface your content when people ask relevant questions.
              </p>
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
              <p className="text-sm text-neutral-500 mt-1">Every category is a discovery directory</p>
            </div>
            <Link href="/explore" className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
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

                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-2 shadow-lg`}>
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <h3 className="text-white font-bold text-sm sm:text-base">{cat.name}</h3>
                      <p className="text-white/60 text-xs mt-0.5">{cat.count} hooks</p>
                    </div>

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
      {/* CREATOR PROFILE SECTION */}
      {/* ============================================ */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-purple-50/30 via-white to-pink-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <Badge className="mb-4 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-0 px-4 py-1.5">
                <Users className="w-3.5 h-3.5 mr-1.5" />
                Creator Profiles
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
                Build Your Discoverable Creator Profile
              </h2>
              <p className="text-base sm:text-lg text-neutral-500 mb-8 leading-relaxed">
                Every creator gets a public, SEO-optimized profile page. All your Hooks in one place, 
                discoverable through search and AI.
              </p>

              <div className="space-y-4">
                {[
                  { icon: Globe, title: 'Public creator profile', desc: 'Your own discoverable page on Hookit' },
                  { icon: SearchIcon, title: 'SEO optimized creator pages', desc: 'Rank for your name and niche' },
                  { icon: Bot, title: 'AI discoverability', desc: 'LLMs can find and reference your work' },
                  { icon: Target, title: 'Category authority', desc: 'Build topical authority over time' },
                  { icon: TrendIcon, title: 'Search visibility', desc: 'Appear in Google and AI search results' },
                ].map((feature, i) => {
                  const Icon = feature.icon
                  return (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white border border-neutral-100 hover:border-purple-200 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-neutral-900 text-sm">{feature.title}</h4>
                        <p className="text-neutral-500 text-sm mt-0.5">{feature.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Creator Profile Mockup */}
            <div className="relative hidden lg:block">
              <div className="bg-white rounded-3xl border border-neutral-200 shadow-xl overflow-hidden">
                {/* Profile Header */}
                <div className="h-24 bg-gradient-to-r from-purple-600 to-pink-500" />
                <div className="px-6 pb-6">
                  <div className="relative -mt-10 mb-4">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face" 
                      alt="Creator" 
                      className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-lg"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900">Maya Chen</h3>
                  <p className="text-sm text-neutral-500 mb-4">Digital Artist & Designer</p>

                  <div className="flex gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-medium">Art</span>
                    <span className="px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-medium">Design</span>
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">Photography</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[1,2,3].map((n) => (
                      <div key={n} className="aspect-square rounded-xl bg-neutral-100 overflow-hidden">
                        <img 
                          src={`https://images.unsplash.com/photo-${n === 1 ? '1541961017774-22349e4a1262' : n === 2 ? '1515886657613-9f3515b0c78f' : '1523275335684-37898b6baf30'}?w=200&h=200&fit=crop`}
                          alt="Hook"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* FINAL CTA — "Your Next Discovery Starts With One Hook" */}
      {/* ============================================ */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <Badge className="mb-6 bg-white/15 text-white border-0 hover:bg-white/20 backdrop-blur-sm px-4 py-1.5">
                <Megaphone className="w-3.5 h-3.5 mr-1.5" />
                Start Creating
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 leading-tight">
                Your Next Discovery
                <br />
                <span className="text-purple-200">Starts With One Hook.</span>
              </h2>
              <p className="text-lg sm:text-xl text-white/70 mb-8 leading-relaxed">
                Create a Hook and make your knowledge discoverable across the internet. 
                No followers. No algorithms. Just search.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  'Every Hook gets its own SEO-optimized page',
                  'Indexed for search phrases you choose',
                  'Discovered through Google, ChatGPT, Perplexity & more',
                  'Listed in categories where people browse',
                  'All your content lives on your public profile',
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
                    Explore Discoveries
                  </Button>
                </Link>
              </div>
            </div>

            {/* Visual: Discovery paths preview */}
            <div className="relative hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Your Hook</p>
                    <p className="text-white/60 text-sm">Minimal Watch Design</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'Hook Page', desc: 'SEO-optimized dedicated page', icon: FileText },
                    { label: 'Category: Products', desc: 'Listed in product category', icon: Layers },
                    { label: 'Search: minimal watch', desc: 'Indexed for search term', icon: SearchIcon },
                    { label: 'Search: best watch under $150', desc: 'Indexed for search term', icon: SearchIcon },
                    { label: 'Creator Profile', desc: 'All hooks in one place', icon: Users },
                  ].map((path, i) => {
                    const Icon = path.icon
                    return (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/15 transition-colors">
                        <Icon className="w-5 h-5 text-purple-300 shrink-0" />
                        <div>
                          <p className="text-white text-sm font-medium">{path.label}</p>
                          <p className="text-white/50 text-xs">{path.desc}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-white/60 text-xs text-center">+ Discovered via Google, ChatGPT, Gemini, Claude, Perplexity</p>
                </div>
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
              Hookit — The Search Discovery Engine for Creators. Create once. Get discovered anywhere and everywhere.
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