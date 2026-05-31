// src/app/(auth)/login/page.tsx
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
                                Logging in...
                            </>
                        ) : (
                            'Login'
                        )}
                    </Button>

                    <p className="text-center text-sm text-neutral-500">
                        Don't have an account?{' '}
                        <Link href="/signup" className="text-[#7C3AED] hover:underline font-medium">
                            Become a Seller
                        </Link>
                    </p>
                </form>
            </CardContent>
        </Card>
    )
}