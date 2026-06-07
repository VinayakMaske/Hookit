// src/app/hooker/(auth)/reset-password/page.tsx
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

function ResetPasswordForm() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get('token')
    const email = searchParams.get('email')

    const [loading, setLoading] = useState(false)
    const [verifying, setVerifying] = useState(true)
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    // Verify token on mount
    useEffect(() => {
        if (!token || !email) {
            setError('Invalid or expired reset link')
            setVerifying(false)
            return
        }
        setVerifying(false)
    }, [token, email])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        setLoading(true)

        try {
            const response = await fetch('/api/hooker/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    email,
                    newPassword,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || 'Failed to reset password')
                setLoading(false)
                return
            }

            setSuccessMessage(data.message)
            setTimeout(() => {
                router.push('/hooker/login')
            }, 3000)
        } catch (err: any) {
            setError('Failed to reset password. Please try again.')
        }

        setLoading(false)
    }

    if (verifying) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        )
    }

    if (error && !token) {
        return (
            <div className="text-center space-y-6 py-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">Invalid Link</h3>
                    <p className="text-sm text-neutral-600">{error}</p>
                </div>
                <Link href="/hooker/forgot-password">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white">
                        Request New Link
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-neutral-700 font-medium">New Password</Label>
                <Input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="h-12 rounded-xl border-neutral-200 focus:border-purple-500 focus:ring-purple-500/20"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-neutral-700 font-medium">Confirm Password</Label>
                <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="h-12 rounded-xl border-neutral-200 focus:border-purple-500 focus:ring-purple-500/20"
                />
            </div>

            {error && (
                <p className="text-sm text-red-500 bg-red-50 p-3 rounded-xl">{error}</p>
            )}

            {successMessage && (
                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <p className="text-sm font-medium text-green-800">Success!</p>
                    </div>
                    <p className="text-sm text-green-700">{successMessage}</p>
                    <p className="text-sm text-green-600 mt-1">Redirecting to login...</p>
                </div>
            )}

            <Button 
                type="submit" 
                className="w-full h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white text-lg font-medium"
                disabled={loading || !!successMessage}
            >
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                    </>
                ) : (
                    'Reset Password'
                )}
            </Button>

            <p className="text-center text-sm text-neutral-500">
                <Link href="/hooker/login" className="text-purple-600 hover:underline font-medium">
                    Back to Login
                </Link>
            </p>
        </form>
    )
}

export default function HookerResetPasswordPage() {
    return (
        <Card className="w-full max-w-md border-0 shadow-xl rounded-3xl bg-white">
            <CardHeader className="text-center pb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-neutral-900">
                    Reset Password
                </CardTitle>
                <CardDescription className="text-neutral-500 mt-2">
                    Enter your new password below
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Suspense fallback={
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                    </div>
                }>
                    <ResetPasswordForm />
                </Suspense>
            </CardContent>
        </Card>
    )
}