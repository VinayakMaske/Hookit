// src/app/(auth)/signup/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, ChevronRight, ChevronLeft, Shield, Sparkles, TrendingUp, Store, Package } from 'lucide-react'
import Link from 'next/link'

const SECURITY_QUESTIONS = [
    'What is your mother\'s maiden name?',
    'What was the name of your first pet?',
    'What city were you born in?',
    'What is your favorite childhood teacher\'s name?',
    'What was your childhood nickname?',
    'What is the name of your favorite book?',
]

// LOTS of floating business/creator themed images covering the full page
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

const MOTIVATIONAL_QUOTES = [
    { text: "Just hookit.", sub: "Your store, your rules." },
    { text: "Don't think. Just hookit.", sub: "Start selling in 30 seconds." },
    { text: "Turn passion into profit.", sub: "Join 5,000+ creators on Hookit." },
    { text: "Your products deserve eyes.", sub: "Get discovered by thousands." },
]

export default function SignupPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [isVisible, setIsVisible] = useState(false)
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        securityQuestion: '',
        securityAnswer: '',
    })

    useEffect(() => {
        setIsVisible(true)
    }, [])

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        if (!formData.securityQuestion || !formData.securityAnswer.trim()) {
            setError('Please set up a security question for password recovery')
            return
        }

        setLoading(true)

        const supabase = createClient()

        const { data, error: authError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                data: {
                    full_name: formData.fullName,
                    phone: formData.phone,
                    security_question: formData.securityQuestion,
                    security_answer: formData.securityAnswer.trim(),
                },
                emailRedirectTo: undefined,
            },
        })

        if (authError) {
            setError(authError.message)
            setLoading(false)
            return
        }

        // Auto-login after signup
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
        })

        if (signInError) {
            setError('Account created but auto-login failed. Please login manually.')
            setLoading(false)
            return
        }

        router.push('/seller/store/create')
        router.refresh()
        setLoading(false)
    }

    const nextStep = () => {
        if (step === 1) {
            if (!formData.fullName || !formData.email || !formData.phone) {
                setError('Please fill in all fields')
                return
            }
            if (!formData.email.includes('@')) {
                setError('Please enter a valid email')
                return
            }
        }
        if (step === 2) {
            if (!formData.password || !formData.confirmPassword) {
                setError('Please enter and confirm your password')
                return
            }
            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match')
                return
            }
            if (formData.password.length < 6) {
                setError('Password must be at least 6 characters')
                return
            }
        }
        setError('')
        setStep(step + 1)
    }

    const prevStep = () => {
        setError('')
        setStep(step - 1)
    }

    return (
        <div className="min-h-screen bg-neutral-50 relative flex items-center justify-center py-12 px-4">
            {/* Full-page floating image background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {FLOATING_IMAGES.map((img, i) => (
                    <div
                        key={i}
                        className={`absolute rounded-2xl overflow-hidden shadow-lg transition-all duration-1000 ${
                            isVisible ? 'opacity-80' : 'opacity-0'
                        }`}
                        style={{
                            top: img.top,
                            left: img.left,
                            width: img.width,
                            height: img.height,
                            transitionDelay: `${img.delay}s`,
                            animation: `float 6s ease-in-out infinite`,
                            animationDelay: `${i * 0.3}s`,
                        }}
                    >
                        <img 
                            src={img.src} 
                            alt="Business"
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>

            {/* Gradient overlay for readability */}
            <div className="fixed inset-0 bg-white/20 pointer-events-none" />
            
            {/* Background decoration blobs */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-10 left-10 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-100/30 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Motivational Quote Above Card */}
                <div className={`text-center mb-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-3 shadow-sm">
                        <Store className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-700">Business Account</span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 leading-tight drop-shadow-sm">
                        {MOTIVATIONAL_QUOTES[step - 1]?.text || MOTIVATIONAL_QUOTES[0].text}
                    </h2>
                    <p className="text-neutral-600 mt-2 text-lg font-medium">
                        {MOTIVATIONAL_QUOTES[step - 1]?.sub || MOTIVATIONAL_QUOTES[0].sub}
                    </p>
                </div>

                <Card className={`w-full border-0 shadow-2xl rounded-3xl bg-white/90 backdrop-blur-md transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
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
                            {step === 1 && 'Tell us about your business'}
                            {step === 2 && 'Secure your account'}
                            {step === 3 && 'One last step — stay safe'}
                        </CardDescription>
                        
                        {/* Step indicator */}
                        <div className="flex items-center justify-center gap-2 mt-4">
                            {[1, 2, 3].map((s) => (
                                <div 
                                    key={s} 
                                    className={`h-1.5 rounded-full transition-all ${
                                        s === step ? 'w-8 bg-gradient-to-r from-purple-600 to-pink-500' : 
                                        s < step ? 'w-4 bg-purple-400' : 
                                        'w-4 bg-neutral-200'
                                    }`}
                                />
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSignup} className="space-y-4">
                            {/* Step 1: Basic Info */}
                            {step === 1 && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName" className="text-neutral-700 font-medium flex items-center gap-2">
                                            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                                            Full Name
                                        </Label>
                                        <Input
                                            id="fullName"
                                            placeholder="John Doe"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            required
                                            className="h-12 rounded-xl border-neutral-200 focus:border-purple-500 focus:ring-purple-500/20 bg-white/80"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-neutral-700 font-medium flex items-center gap-2">
                                            <TrendingUp className="w-3.5 h-3.5 text-pink-500" />
                                            Business Email
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="john@yourstore.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                            className="h-12 rounded-xl border-neutral-200 focus:border-purple-500 focus:ring-purple-500/20 bg-white/80"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-neutral-700 font-medium flex items-center gap-2">
                                            <Store className="w-3.5 h-3.5 text-violet-500" />
                                            Phone Number
                                        </Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="+91 98765 43210"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="h-12 rounded-xl border-neutral-200 focus:border-purple-500 focus:ring-purple-500/20 bg-white/80"
                                        />
                                    </div>

                                    <Button 
                                        type="button"
                                        onClick={nextStep}
                                        className="w-full h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-lg font-medium gap-2 shadow-lg shadow-purple-200 transition-all hover:shadow-xl hover:shadow-purple-300"
                                    >
                                        Next
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </>
                            )}

                            {/* Step 2: Password */}
                            {step === 2 && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-neutral-700 font-medium">Password</Label>
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

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword" className="text-neutral-700 font-medium">Confirm Password</Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            required
                                            className="h-12 rounded-xl border-neutral-200 focus:border-purple-500 focus:ring-purple-500/20 bg-white/80"
                                        />
                                    </div>

                                    <div className="flex gap-3">
                                        <Button 
                                            type="button"
                                            variant="outline"
                                            onClick={prevStep}
                                            className="flex-1 h-12 rounded-full gap-2 border-neutral-300 hover:border-purple-300 hover:bg-purple-50"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            Back
                                        </Button>
                                        <Button 
                                            type="button"
                                            onClick={nextStep}
                                            className="flex-1 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-lg font-medium gap-2 shadow-lg shadow-purple-200"
                                        >
                                            Next
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </>
                            )}

                            {/* Step 3: Security Question */}
                            {step === 3 && (
                                <>
                                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl mb-4 border border-purple-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Shield className="w-5 h-5 text-purple-600" />
                                            <p className="font-medium text-neutral-900 text-sm">Password Recovery</p>
                                        </div>
                                        <p className="text-xs text-neutral-500">
                                            This helps you reset your password if you forget it. No email confirmation needed.
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="securityQuestion" className="text-neutral-700 font-medium">Security Question</Label>
                                        <select
                                            id="securityQuestion"
                                            value={formData.securityQuestion}
                                            onChange={(e) => setFormData({ ...formData, securityQuestion: e.target.value })}
                                            required
                                            className="h-12 w-full rounded-xl border border-neutral-200 bg-white/80 px-3 text-sm outline-none focus:border-purple-500 focus:ring-purple-500/20"
                                        >
                                            <option value="">Select a question...</option>
                                            {SECURITY_QUESTIONS.map((q) => (
                                                <option key={q} value={q}>{q}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="securityAnswer" className="text-neutral-700 font-medium">Your Answer</Label>
                                        <Input
                                            id="securityAnswer"
                                            type="text"
                                            placeholder="Your answer (case-insensitive)"
                                            value={formData.securityAnswer}
                                            onChange={(e) => setFormData({ ...formData, securityAnswer: e.target.value })}
                                            required
                                            className="h-12 rounded-xl border-neutral-200 focus:border-purple-500 focus:ring-purple-500/20 bg-white/80"
                                        />
                                        <p className="text-xs text-neutral-400">
                                            Remember this answer — you&apos;ll need it to reset your password.
                                        </p>
                                    </div>

                                    <div className="flex gap-3">
                                        <Button 
                                            type="button"
                                            variant="outline"
                                            onClick={prevStep}
                                            className="flex-1 h-12 rounded-full gap-2 border-neutral-300 hover:border-purple-300 hover:bg-purple-50"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            Back
                                        </Button>
                                        <Button 
                                            type="submit" 
                                            className="flex-1 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-lg font-medium shadow-lg shadow-purple-200"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Creating...
                                                </>
                                            ) : (
                                                'Create Account'
                                            )}
                                        </Button>
                                    </div>
                                </>
                            )}

                            {error && (
                                <p className="text-sm text-red-500 bg-red-50 p-3 rounded-xl">{error}</p>
                            )}

                            <p className="text-center text-sm text-neutral-500">
                                Already have an account?{' '}
                                <Link href="/login" className="text-purple-600 hover:text-purple-700 hover:underline font-medium">
                                    Login
                                </Link>
                            </p>
                        </form>
                    </CardContent>
                </Card>

                {/* Trust badges below card */}
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