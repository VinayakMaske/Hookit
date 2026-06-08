// src/app/hooker/(auth)/login/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Zap, Flame, TrendingUp, Star, Rocket, Heart, Eye, Crown, Gem } from 'lucide-react'
import Link from 'next/link'

// Floating background images
const FLOATING_IMAGES = [
    // Left side images
    { src: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=400&fit=crop', top: '2%', left: '2%', delay: 0, width: 200, height: 260 },
    { src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=280&h=380&fit=crop', top: '18%', left: '5%', delay: 0.3, width: 180, height: 240 },
    { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=260&h=360&fit=crop', top: '40%', left: '1%', delay: 0.6, width: 170, height: 230 },
    { src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=290&h=390&fit=crop', top: '58%', left: '6%', delay: 0.9, width: 190, height: 250 },
    { src: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=270&h=370&fit=crop', top: '75%', left: '3%', delay: 1.2, width: 175, height: 235 },
    { src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=250&h=340&fit=crop', top: '88%', left: '8%', delay: 1.5, width: 160, height: 215 },
    
    // Right side images
    { src: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?w=300&h=400&fit=crop', top: '3%', left: '78%', delay: 0.2, width: 200, height: 265 },
    { src: 'https://images.unsplash.com/photo-1556742045-256ecb78f8a0?w=280&h=370&fit=crop', top: '20%', left: '85%', delay: 0.5, width: 185, height: 245 },
    { src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=270&h=350&fit=crop', top: '38%', left: '80%', delay: 0.8, width: 175, height: 225 },
    { src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=290&h=380&fit=crop', top: '55%', left: '88%', delay: 1.1, width: 190, height: 250 },
    { src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=260&h=340&fit=crop', top: '72%', left: '82%', delay: 1.4, width: 170, height: 220 },
    { src: 'https://images.unsplash.com/photo-1511376777868-611b54f68947?w=280&h=360&fit=crop', top: '85%', left: '90%', delay: 1.7, width: 180, height: 240 },
    
    // Top edge images
    { src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=320&h=420&fit=crop', top: '1%', left: '25%', delay: 0.4, width: 210, height: 270 },
    { src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=260&h=340&fit=crop', top: '4%', left: '50%', delay: 0.7, width: 170, height: 220 },
    { src: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=280&h=360&fit=crop', top: '2%', left: '62%', delay: 1.0, width: 185, height: 235 },
    
    // Bottom edge images
    { src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=290&h=380&fit=crop', top: '82%', left: '30%', delay: 0.6, width: 190, height: 250 },
    { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=270&h=350&fit=crop', top: '88%', left: '55%', delay: 0.9, width: 175, height: 225 },
    { src: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=260&h=330&fit=crop', top: '85%', left: '70%', delay: 1.2, width: 165, height: 210 },
    
    // Scattered middle images (behind card area but visible at edges)
    { src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=250&h=320&fit=crop', top: '30%', left: '15%', delay: 0.3, width: 160, height: 200 },
    { src: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=240&h=310&fit=crop', top: '50%', left: '12%', delay: 0.8, width: 155, height: 195 },
    { src: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=270&h=350&fit=crop', top: '65%', left: '18%', delay: 1.3, width: 175, height: 225 },
    { src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=260&h=330&fit=crop', top: '25%', left: '75%', delay: 0.5, width: 170, height: 215 },
    { src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=280&h=360&fit=crop', top: '48%', left: '72%', delay: 1.0, width: 185, height: 235 },
    { src: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=250&h=320&fit=crop', top: '68%', left: '78%', delay: 1.5, width: 165, height: 205 },
]

// Motivational quotes
const QUOTES = [
  { text: "Just Hookit.", position: "top-[10%] left-[28%]", icon: Zap, color: "text-purple-600" },
  { text: "Don't think. Just Hookit.", position: "top-[20%] right-[15%]", icon: Flame, color: "text-pink-600" },
  { text: "Increase your presence.", position: "bottom-[22%] left-[15%]", icon: TrendingUp, color: "text-violet-600" },
  { text: "Your creativity deserves to be found.", position: "top-[50%] right-[8%]", icon: Star, color: "text-amber-600" },
  { text: "One Hook. Infinite reach.", position: "bottom-[32%] right-[20%]", icon: Rocket, color: "text-rose-600" },
  { text: "Share what you love.", position: "top-[35%] left-[5%]", icon: Heart, color: "text-fuchsia-600" },
  { text: "Be seen. Be discovered.", position: "bottom-[12%] right-[38%]", icon: Eye, color: "text-indigo-600" },
  { text: "Your story starts here.", position: "top-[6%] right-[42%]", icon: Crown, color: "text-purple-500" },
  { text: "Make it unforgettable.", position: "bottom-[18%] left-[35%]", icon: Gem, color: "text-pink-500" },
]

export default function HookerLoginPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [isVisible, setIsVisible] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    useEffect(() => {
        setIsVisible(true)
    }, [])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const supabase = createClient()

        const { data, error: authError } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
        })

        if (authError) {
            setError(authError.message)
            setLoading(false)
            return
        }

        router.push('/hooker/home')
        router.refresh()
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center px-4 py-12">
            {/* Floating Background Images */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {FLOATING_IMAGES.map((img, i) => (
                    <div
                        key={i}
                        className={`absolute rounded-2xl overflow-hidden shadow-xl transition-all duration-1000 ${isVisible ? 'opacity-90' : 'opacity-90'}`}
                        style={{
                            top: img.top,
                            left: img.left,
                            transitionDelay: `${img.delay}s`,
                            animation: `float ${6 + i * 0.5}s ease-in-out infinite`,
                            animationDelay: `${img.delay}s`,
                            zIndex: 1
                        }}
                    >
                        <img src={img.src} alt="" className="w-full h-full object-cover" loading="lazy" />
                        <div className="absolute inset-0 bg-white/30" />
                    </div>
                ))}
            </div>

            <div className="fixed inset-0 bg-gradient-to-br from-white/70 via-purple-50/40 to-pink-50/50 pointer-events-none" style={{ zIndex: 2 }} />

            {/* Motivational Quotes */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 3 }}>
                {QUOTES.map((quote, i) => (
                    <div
                        key={i}
                        className={`absolute ${quote.position} transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                        style={{ transitionDelay: `${1 + i * 0.3}s` }}
                    >
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md rounded-full px-4 py-2 border border-purple-100 shadow-lg shadow-purple-500/5">
                            <quote.icon className={`w-4 h-4 ${quote.color}`} />
                            <span className="text-sm text-neutral-700 font-medium whitespace-nowrap">{quote.text}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Login Card */}
            <div className={`relative z-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <Card className="w-full max-w-md border-0 shadow-xl rounded-3xl bg-white/90 backdrop-blur-xl">
                    <CardHeader className="text-center pb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-white font-bold text-lg">H</span>
                        </div>
                        <CardTitle 
                            className="text-3xl font-bold text-neutral-900"
                            style={{ 
                                fontFamily: 'var(--font-playfair), Georgia, serif',
                                fontStyle: 'italic',
                            }}
                        >
                            hookit
                        </CardTitle>
                        <CardDescription className="text-neutral-500 mt-2">
                            Welcome back, creator
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-neutral-700 font-medium">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="h-12 rounded-xl border-neutral-200 focus:border-purple-500 focus:ring-purple-500/20"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-neutral-700 font-medium">Password</Label>
                                    <Link 
                                        href="/hooker/forgot-password" 
                                        className="text-sm text-purple-600 hover:underline font-medium"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    className="h-12 rounded-xl border-neutral-200 focus:border-purple-500 focus:ring-purple-500/20"
                                />
                            </div>

                            {error && (
                                <p className="text-sm text-red-500 bg-red-50 p-3 rounded-xl">{error}</p>
                            )}

                            <Button 
                                type="submit" 
                                className="w-full h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white text-lg font-medium"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Logging in...
                                    </>
                                ) : (
                                    'Login'
                                )}
                            </Button>

                            <p className="text-center text-sm text-neutral-500">
                                Don&apos;t have an account?{' '}
                                <Link href="/hooker/signup" className="text-purple-600 hover:underline font-medium">
                                    Create Account
                                </Link>
                            </p>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <style jsx global>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(var(--rotate, 0deg)); }
                    50% { transform: translateY(-20px) rotate(calc(var(--rotate, 0deg) + 3deg)); }
                }
            `}</style>
        </div>
    )
}