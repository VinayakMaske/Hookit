// src/app/(auth)/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Package, Store } from 'lucide-react'
import Link from 'next/link'

// Floating business-themed images covering full page
const FLOATING_IMAGES = [
    { src: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=400&fit=crop', top: '5%', left: '3%', width: 200, height: 260 },
    { src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=280&h=380&fit=crop', top: '15%', left: '85%', width: 180, height: 240 },
    { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=260&h=360&fit=crop', top: '60%', left: '2%', width: 170, height: 230 },
    { src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=290&h=390&fit=crop', top: '75%', left: '88%', width: 190, height: 250 },
    { src: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=270&h=370&fit=crop', top: '35%', left: '92%', width: 175, height: 235 },
    { src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=250&h=340&fit=crop', top: '88%', left: '5%', width: 160, height: 215 },
    { src: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?w=300&h=400&fit=crop', top: '8%', left: '78%', width: 200, height: 265 },
    { src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=270&h=350&fit=crop', top: '45%', left: '80%', width: 175, height: 225 },
    { src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=290&h=380&fit=crop', top: '70%', left: '82%', width: 190, height: 250 },
    { src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=260&h=340&fit=crop', top: '20%', left: '10%', width: 170, height: 220 },
    { src: 'https://images.unsplash.com/photo-1511376777868-611b54f68947?w=280&h=360&fit=crop', top: '50%', left: '8%', width: 180, height: 240 },
    { src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=320&h=420&fit=crop', top: '2%', left: '25%', width: 210, height: 270 },
    { src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=260&h=340&fit=crop', top: '85%', left: '30%', width: 170, height: 220 },
    { src: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=280&h=360&fit=crop', top: '90%', left: '65%', width: 185, height: 235 },
    { src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=290&h=380&fit=crop', top: '82%', left: '45%', width: 190, height: 250 },
    { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=270&h=350&fit=crop', top: '10%', left: '55%', width: 175, height: 225 },
    { src: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=260&h=330&fit=crop', top: '92%', left: '55%', width: 165, height: 210 },
    { src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=250&h=320&fit=crop', top: '30%', left: '18%', width: 160, height: 200 },
    { src: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=240&h=310&fit=crop', top: '55%', left: '15%', width: 155, height: 195 },
    { src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=260&h=330&fit=crop', top: '25%', left: '75%', width: 170, height: 215 },
    { src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=280&h=360&fit=crop', top: '65%', left: '72%', width: 185, height: 235 },
]

export default function LoginPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

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

        // Check if store exists
        const { data: storeData } = await supabase
            .from('stores')
            .select('id')
            .eq('owner_id', data.user.id)
            .single()

        if (storeData) {
            router.push('/seller/dashboard')
        } else {
            router.push('/seller/store/create')
        }

        router.refresh()
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-neutral-50 relative flex items-center justify-center py-12 px-4">
            {/* Full-page floating image background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                {FLOATING_IMAGES.map((img, i) => (
                    <div
                        key={i}
                        className="absolute rounded-2xl overflow-hidden shadow-lg opacity-70"
                        style={{
                            top: img.top,
                            left: img.left,
                            width: img.width,
                            height: img.height,
                            animation: `float 6s ease-in-out infinite`,
                            animationDelay: `${i * 0.3}s`,
                        }}
                    >
                        <img src={img.src} alt="Business" className="w-full h-full object-cover" />
                    </div>
                ))}
            </div>

            {/* Light overlay */}
            <div className="fixed inset-0 bg-white/20 pointer-events-none z-0" />

            {/* Blur blobs */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-10 left-10 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Motivational Quote */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-3 shadow-sm">
                        <Store className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-700">Business Account</span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 leading-tight">
                        Welcome back.
                    </h2>
                    <p className="text-neutral-600 mt-2 text-lg font-medium">
                        Your store is waiting for you.
                    </p>
                </div>

                <Card className="w-full border-0 shadow-2xl rounded-3xl bg-white/90 backdrop-blur-md">
                    <CardHeader className="text-center pb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-purple-200">
                            <Package className="w-7 h-7 text-white" />
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
                        <CardDescription className="text-neutral-500 mt-1">
                            Welcome back, seller
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
                                    className="h-12 rounded-xl border-neutral-200 focus:border-purple-500 focus:ring-purple-500/20 bg-white/80"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-neutral-700 font-medium">Password</Label>
                                    <Link 
                                        href="/forgot-password" 
                                        className="text-sm text-purple-600 hover:text-purple-700 hover:underline font-medium"
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
                                    className="h-12 rounded-xl border-neutral-200 focus:border-purple-500 focus:ring-purple-500/20 bg-white/80"
                                />
                            </div>

                            {error && (
                                <p className="text-sm text-red-500 bg-red-50 p-3 rounded-xl">{error}</p>
                            )}

                            <Button 
                                type="submit" 
                                className="w-full h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-lg font-medium shadow-lg shadow-purple-200"
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
                                <Link href="/signup" className="text-purple-600 hover:text-purple-700 hover:underline font-medium">
                                    Become a Seller
                                </Link>
                            </p>
                        </form>
                    </CardContent>
                </Card>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-6 mt-6 text-xs text-neutral-500">
                    <div className="flex items-center gap-1.5">
                        <CheckIcon />
                        <span>Free forever</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <CheckIcon />
                        <span>No credit card</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <CheckIcon />
                        <span>Instant setup</span>
                    </div>
                </div>
            </div>

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

function CheckIcon() {
    return (
        <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    )
}