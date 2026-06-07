// src/app/hooker/(auth)/signup/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, ChevronRight, ChevronLeft, Shield } from 'lucide-react'
import Link from 'next/link'

const SECURITY_QUESTIONS = [
    'What is your mother\'s maiden name?',
    'What was the name of your first pet?',
    'What city were you born in?',
    'What is your favorite childhood teacher\'s name?',
    'What was your childhood nickname?',
    'What is the name of your favorite book?',
]

export default function HookerSignupPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        securityQuestion: '',
        securityAnswer: '',
    })

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
                    user_type: 'hooker',
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

        router.push('/explore')
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
        <Card className="w-full max-w-md border-0 shadow-xl rounded-3xl bg-white">
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
                    {step === 1 && 'Join the creator community'}
                    {step === 2 && 'Create a secure password'}
                    {step === 3 && 'Set up password recovery'}
                </CardDescription>
                
                {/* Step indicator */}
                <div className="flex items-center justify-center gap-2 mt-4">
                    {[1, 2, 3].map((s) => (
                        <div 
                            key={s} 
                            className={`h-1.5 rounded-full transition-all ${
                                s === step ? 'w-8 bg-purple-600' : 
                                s < step ? 'w-4 bg-purple-600/50' : 
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
                                <Label htmlFor="fullName" className="text-neutral-700 font-medium">Full Name</Label>
                                <Input
                                    id="fullName"
                                    placeholder="John Doe"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    required
                                    className="h-12 rounded-xl border-neutral-200 focus:border-purple-500 focus:ring-purple-500/20"
                                />
                            </div>

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
                                <Label htmlFor="phone" className="text-neutral-700 font-medium">Phone Number</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="h-12 rounded-xl border-neutral-200 focus:border-purple-500 focus:ring-purple-500/20"
                                />
                            </div>

                            <Button 
                                type="button"
                                onClick={nextStep}
                                className="w-full h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white text-lg font-medium gap-2"
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
                                    className="h-12 rounded-xl border-neutral-200 focus:border-purple-500 focus:ring-purple-500/20"
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
                                    className="h-12 rounded-xl border-neutral-200 focus:border-purple-500 focus:ring-purple-500/20"
                                />
                            </div>

                            <div className="flex gap-3">
                                <Button 
                                    type="button"
                                    variant="outline"
                                    onClick={prevStep}
                                    className="flex-1 h-12 rounded-full gap-2"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Back
                                </Button>
                                <Button 
                                    type="button"
                                    onClick={nextStep}
                                    className="flex-1 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white text-lg font-medium gap-2"
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
                            <div className="p-4 bg-purple-50 rounded-xl mb-4">
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
                                    className="h-12 w-full rounded-xl border border-neutral-200 bg-transparent px-3 text-sm outline-none focus:border-purple-500 focus:ring-purple-500/20"
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
                                    className="h-12 rounded-xl border-neutral-200 focus:border-purple-500 focus:ring-purple-500/20"
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
                                    className="flex-1 h-12 rounded-full gap-2"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Back
                                </Button>
                                <Button 
                                    type="submit" 
                                    className="flex-1 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white text-lg font-medium"
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
                        <Link href="/hooker/login" className="text-purple-600 hover:underline font-medium">
                            Login
                        </Link>
                    </p>
                </form>
            </CardContent>
        </Card>
    )
}