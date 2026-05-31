// src/app/(auth)/signup/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function SignupPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
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

        setLoading(true)

        const supabase = createClient()

        const { data, error: authError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                data: {
                    full_name: formData.fullName,
                    phone: formData.phone,
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

    return (
        <Card className="w-full max-w-md border-0 shadow-xl rounded-3xl bg-white">
            <CardHeader className="text-center pb-6">
                <div className="w-12 h-12 bg-[#7C3AED] rounded-2xl flex items-center justify-center mx-auto mb-4">
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
                    Start selling your creations
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-neutral-700 font-medium">Full Name</Label>
                        <Input
                            id="fullName"
                            placeholder="John Doe"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            required
                            className="h-12 rounded-xl border-neutral-200 focus:border-[#7C3AED] focus:ring-[#7C3AED]/20"
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
                            className="h-12 rounded-xl border-neutral-200 focus:border-[#7C3AED] focus:ring-[#7C3AED]/20"
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
                            required
                            className="h-12 rounded-xl border-neutral-200 focus:border-[#7C3AED] focus:ring-[#7C3AED]/20"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-neutral-700 font-medium">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            className="h-12 rounded-xl border-neutral-200 focus:border-[#7C3AED] focus:ring-[#7C3AED]/20"
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
                            className="h-12 rounded-xl border-neutral-200 focus:border-[#7C3AED] focus:ring-[#7C3AED]/20"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 bg-red-50 p-3 rounded-xl">{error}</p>
                    )}

                    <Button 
                        type="submit" 
                        className="w-full h-12 rounded-full bg-[#7C3AED] hover:bg-[#6d28d9] text-lg font-medium"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating account...
                            </>
                        ) : (
                            'Create Account'
                        )}
                    </Button>

                    <p className="text-center text-sm text-neutral-500">
                        Already have an account?{' '}
                        <Link href="/login" className="text-[#7C3AED] hover:underline font-medium">
                            Login
                        </Link>
                    </p>
                </form>
            </CardContent>
        </Card>
    )
}