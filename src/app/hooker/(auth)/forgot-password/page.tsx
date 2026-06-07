// src/app/hooker/(auth)/forgot-password/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, ArrowLeft, Mail, HelpCircle, Shield, CheckCircle } from 'lucide-react'
import Link from 'next/link'

type Step = 'email' | 'choose-method' | 'security-question' | 'email-sent' | 'reset-password'

export default function HookerForgotPasswordPage() {
    const router = useRouter()
    const [step, setStep] = useState<Step>('email')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [email, setEmail] = useState('')
    const [securityQuestion, setSecurityQuestion] = useState('')
    const [securityAnswer, setSecurityAnswer] = useState('')
    const [resetToken, setResetToken] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    // Step 1: Submit email and check if user exists
    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await fetch('/api/hooker/auth/check-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || 'User not found')
                setLoading(false)
                return
            }

            if (data.hasSecurityQuestion) {
                setSecurityQuestion(data.securityQuestion)
                setStep('choose-method')
            } else {
                await sendResetLink()
            }
        } catch (err: any) {
            setError('Something went wrong. Please try again.')
        }

        setLoading(false)
    }

    // Send email reset link
    const sendResetLink = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/hooker/auth/send-reset-link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })

            const data = await response.json()
            setSuccessMessage(data.message)
            setStep('email-sent')
        } catch (err: any) {
            setError('Failed to send reset link. Please try again.')
        }
        setLoading(false)
    }

    // Verify security answer
    const handleSecurityAnswer = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await fetch('/api/hooker/auth/verify-security-answer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, answer: securityAnswer }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || 'Incorrect answer')
                setLoading(false)
                return
            }

            setResetToken(data.resetToken)
            setStep('reset-password')
        } catch (err: any) {
            setError('Failed to verify answer. Please try again.')
        }

        setLoading(false)
    }

    // Reset password (security question method)
    const handleResetPassword = async (e: React.FormEvent) => {
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
                    resetToken,
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

    return (
        <Card className="w-full max-w-md border-0 shadow-xl rounded-3xl bg-white">
            <CardHeader className="text-center pb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-neutral-900">
                    Forgot Password?
                </CardTitle>
                <CardDescription className="text-neutral-500 mt-2">
                    {step === 'email' && "Enter your email to reset your password"}
                    {step === 'choose-method' && "Choose how you want to reset"}
                    {step === 'security-question' && "Answer your security question"}
                    {step === 'email-sent' && "Check your email"}
                    {step === 'reset-password' && "Set your new password"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* Step 1: Enter Email */}
                {step === 'email' && (
                    <form onSubmit={handleEmailSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-neutral-700 font-medium">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="john@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                    Checking...
                                </>
                            ) : (
                                'Continue'
                            )}
                        </Button>

                        <p className="text-center text-sm text-neutral-500">
                            <Link href="/hooker/login" className="text-purple-600 hover:underline font-medium inline-flex items-center gap-1">
                                <ArrowLeft className="w-3 h-3" />
                                Back to Login
                            </Link>
                        </p>
                    </form>
                )}

                {/* Step 2: Choose Method */}
                {step === 'choose-method' && (
                    <div className="space-y-4">
                        <div className="p-4 bg-purple-50 rounded-xl">
                            <p className="text-sm text-neutral-600 mb-1">Security Question Set:</p>
                            <p className="font-medium text-neutral-900">{securityQuestion}</p>
                        </div>

                        <button
                            onClick={() => setStep('security-question')}
                            className="w-full p-4 border-2 border-neutral-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all text-left group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                                    <HelpCircle className="w-5 h-5 text-purple-600 group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <p className="font-medium text-neutral-900">Answer Security Question</p>
                                    <p className="text-sm text-neutral-500">Instant reset, no waiting</p>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={sendResetLink}
                            disabled={loading}
                            className="w-full p-4 border-2 border-neutral-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all text-left group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                                    <Mail className="w-5 h-5 text-blue-500 group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <p className="font-medium text-neutral-900">Send Email Link</p>
                                    <p className="text-sm text-neutral-500">Check your inbox for a reset link</p>
                                </div>
                            </div>
                        </button>

                        {loading && (
                            <div className="flex items-center justify-center py-4">
                                <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                            </div>
                        )}

                        {error && (
                            <p className="text-sm text-red-500 bg-red-50 p-3 rounded-xl">{error}</p>
                        )}

                        <p className="text-center text-sm text-neutral-500">
                            <button 
                                onClick={() => setStep('email')} 
                                className="text-purple-600 hover:underline font-medium inline-flex items-center gap-1"
                            >
                                <ArrowLeft className="w-3 h-3" />
                                Use different email
                            </button>
                        </p>
                    </div>
                )}

                {/* Step 3: Security Question */}
                {step === 'security-question' && (
                    <form onSubmit={handleSecurityAnswer} className="space-y-5">
                        <div className="p-4 bg-purple-50 rounded-xl">
                            <p className="text-sm text-neutral-600 mb-1">Question:</p>
                            <p className="font-medium text-neutral-900">{securityQuestion}</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="answer" className="text-neutral-700 font-medium">Your Answer</Label>
                            <Input
                                id="answer"
                                type="text"
                                placeholder="Type your answer..."
                                value={securityAnswer}
                                onChange={(e) => setSecurityAnswer(e.target.value)}
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
                                    Verifying...
                                </>
                            ) : (
                                'Verify Answer'
                            )}
                        </Button>

                        <p className="text-center text-sm text-neutral-500">
                            <button 
                                type="button"
                                onClick={() => setStep('choose-method')} 
                                className="text-purple-600 hover:underline font-medium inline-flex items-center gap-1"
                            >
                                <ArrowLeft className="w-3 h-3" />
                                Back to options
                            </button>
                        </p>
                    </form>
                )}

                {/* Step 4: Email Sent */}
                {step === 'email-sent' && (
                    <div className="text-center space-y-6 py-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <Mail className="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Reset Link Sent!</h3>
                            <p className="text-sm text-neutral-600">
                                We&apos;ve sent a password reset link to<br/>
                                <strong className="text-neutral-900">{email}</strong>
                            </p>
                            <p className="text-sm text-neutral-500 mt-2">
                                The link expires in 1 hour. Check your inbox and spam folder.
                            </p>
                        </div>
                        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                            <p className="text-sm text-amber-800">
                                <strong>Tip:</strong> If you don&apos;t receive the email within 5 minutes, try the security question method or contact support.
                            </p>
                        </div>
                        <Link href="/hooker/login">
                            <Button variant="outline" className="w-full h-12 rounded-full">
                                Back to Login
                            </Button>
                        </Link>
                    </div>
                )}

                {/* Step 5: Reset Password (Security Question Success) */}
                {step === 'reset-password' && (
                    <form onSubmit={handleResetPassword} className="space-y-5">
                        <div className="p-4 bg-green-50 rounded-xl border border-green-200 flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                            <p className="text-sm text-green-800">Security answer verified! Set your new password.</p>
                        </div>

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
                                <p className="text-sm text-green-800">{successMessage}</p>
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
                    </form>
                )}
            </CardContent>
        </Card>
    )
}