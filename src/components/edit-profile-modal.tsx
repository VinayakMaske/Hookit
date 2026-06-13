'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Mail, Lock, Loader2, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react'

type CreatorFlow = 'email' | 'checking' | 'new_otp_sent' | 'create_passcode' | 'returning_show' | 'forgot_passcode' | 'reset_otp_sent' | 'verified'

export default function EditProfileModal({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [passcode, setPasscode] = useState('')
  const [newPasscode, setNewPasscode] = useState('')
  const [confirmPasscode, setConfirmPasscode] = useState('')
  const [creatorFlow, setCreatorFlow] = useState<CreatorFlow>('email')
  const [creatorProfile, setCreatorProfile] = useState<any>(null)
  const [suggestedUsername, setSuggestedUsername] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Step 1: Check email
  const handleCheckEmail = async () => {
    if (!email.includes('@')) {
      setError('Please enter a valid email')
      return
    }
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/creator/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      if (data.exists && data.creator) {
        // Returning creator - show username, ask for passcode
        setCreatorProfile(data.creator)
        setSuggestedUsername(data.creator.username)
        setCreatorFlow('returning_show')
      } else {
        // New creator - send OTP
        const otpRes = await fetch('/api/creator/otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, isReturning: false })
        })
        const otpData = await otpRes.json()

        if (!otpRes.ok) throw new Error(otpData.error)
        setSuggestedUsername(otpData.suggestedUsername)
        setCreatorFlow('new_otp_sent')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Step 2a: New creator - verify OTP
  const handleVerifyNewOTP = async () => {
    if (otp.length !== 6) {
      setError('Enter 6-digit OTP')
      return
    }
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/creator/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      // OTP verified, now create passcode
      setCreatorFlow('create_passcode')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Step 2b: Create 4-digit passcode
  const handleSetPasscode = async () => {
    if (newPasscode !== confirmPasscode) {
      setError("Passcodes don't match")
      return
    }
    if (newPasscode.length !== 4) {
      setError('Passcode must be 4 digits')
      return
    }
    if (!otp || otp.length !== 6) {
      setError('OTP is missing. Please verify your email again.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/creator/set-passcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          passcode: newPasscode,
          otp 
        })
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      // Success! Redirect to edit page
      const username = data.creator?.username || data.username
      if (!username) {
        throw new Error('Username not found in response')
      }
      router.push(`/creator/${username}/edit`)
      onClose()

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Step 3a: Returning creator - verify passcode
  const handleVerifyPasscode = async () => {
    if (!passcode.trim() || passcode.length !== 4) {
      setError('Enter your 4-digit passcode')
      return
    }
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/creator/verify-passcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, passcode })
      })
      const data = await res.json()

      if (!res.ok) {
        if (data.needsNewPasskey) {
          setCreatorFlow('forgot_passcode')
          setLoading(false)
          return  // Don't throw, just show forgot passcode UI
        }
        throw new Error(data.error)
      }

      // Success! Redirect to edit pagg
  const username = data.creator?.username || data.username
  if (!username) {
    throw new Error('Username not found in response')
  }
  router.push(`/creator/${username}/edit`)
  onClose()  // Close modal AFTER starting navigation

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Step 3b: Forgot passcode - request reset OTP
  const handleRequestReset = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/creator/reset-passcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)
      setCreatorFlow('reset_otp_sent')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Step 3c: Verify reset OTP
  const handleVerifyResetOTP = async () => {
    if (otp.length !== 6) {
      setError('Enter 6-digit OTP')
      return
    }
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/creator/verify-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      setCreatorProfile({ username: data.username, email })
      setCreatorFlow('create_passcode')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-neutral-100 rounded-full transition-colors">
          <X className="w-5 h-5 text-neutral-400" />
        </button>

        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Edit Your Profile</h2>
        <p className="text-neutral-500 mb-6">Verify your identity to manage your hooks and profile.</p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* FLOW: ENTER EMAIL */}
        {creatorFlow === 'email' && (
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl pl-10"
              />
            </div>
            <p className="text-xs text-neutral-500">
              New creators create a 4-digit passcode. Returning creators use their existing one.
            </p>
            <Button
              onClick={handleCheckEmail}
              disabled={loading || !email.includes('@')}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl h-12"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Continue'}
            </Button>
          </div>
        )}

        {/* FLOW: CHECKING */}
        {creatorFlow === 'checking' && (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-3" />
            <p className="text-neutral-600">Checking your email...</p>
          </div>
        )}

        {/* FLOW: NEW CREATOR - OTP SENT */}
        {creatorFlow === 'new_otp_sent' && (
          <div className="space-y-4">
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100 mb-4">
              <p className="text-sm text-neutral-600 mb-1">New Creator</p>
              <p className="font-medium text-neutral-900">{email}</p>
              <p className="text-xs text-purple-600 mt-1">Suggested username: @{suggestedUsername}</p>
            </div>
            <p className="text-sm text-neutral-600">We sent a 6-digit code to your email. Enter it below:</p>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                placeholder="000000"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="h-12 rounded-xl pl-10 text-center text-lg tracking-[0.5em] font-mono"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleCheckEmail}
                className="flex-1 rounded-xl border-neutral-200"
              >
                Resend
              </Button>
              <Button
                onClick={handleVerifyNewOTP}
                disabled={otp.length !== 6 || loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl h-12"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
              </Button>
            </div>
          </div>
        )}

        {/* FLOW: CREATE 4-DIGIT PASSCODE */}
        {creatorFlow === 'create_passcode' && (
          <div className="space-y-4">
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                <div>
                  <p className="font-semibold text-green-800">Email Verified!</p>
                  <p className="text-sm text-green-600">@{suggestedUsername}</p>
                </div>
              </div>
            </div>

            <p className="text-sm text-neutral-600 font-medium">Create a 4-digit passcode for future logins:</p>

            <div className="space-y-3">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="••••"
                  value={newPasscode}
                  onChange={(e) => setNewPasscode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="h-12 rounded-xl pl-10 text-center text-2xl tracking-[0.5em] font-mono"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="Confirm ••••"
                  value={confirmPasscode}
                  onChange={(e) => setConfirmPasscode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="h-12 rounded-xl pl-10 text-center text-2xl tracking-[0.5em] font-mono"
                />
              </div>
            </div>

            <Button
              onClick={handleSetPasscode}
              disabled={newPasscode.length !== 4 || newPasscode !== confirmPasscode || loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl h-12 gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              Set Passcode & Continue
            </Button>
          </div>
        )}

        {/* FLOW: RETURNING - SHOW USERNAME, ASK FOR PASSCODE */}
        {creatorFlow === 'returning_show' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 border border-purple-100 mb-4">
              <p className="text-sm text-neutral-600 mb-1">Welcome back</p>
              <p className="font-bold text-lg text-neutral-900">@{creatorProfile?.username}</p>
              <p className="text-xs text-neutral-400">{email}</p>
            </div>
            <p className="text-sm text-neutral-600">Enter your 4-digit passcode:</p>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                type="password"
                inputMode="numeric"
                maxLength={4}
                placeholder="••••"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="h-12 rounded-xl pl-10 text-center text-2xl tracking-[0.5em] font-mono"
              />
            </div>
            <Button
              onClick={handleVerifyPasscode}
              disabled={passcode.length !== 4 || loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl h-12"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify & Edit Profile'}
            </Button>
            <button
              onClick={() => setCreatorFlow('forgot_passcode')}
              className="text-xs text-purple-600 hover:text-purple-700 text-center w-full"
            >
              Forgot your passcode? Request a new one
            </button>
          </div>
        )}

        {/* FLOW: FORGOT PASSCODE */}
        {creatorFlow === 'forgot_passcode' && (
          <div className="space-y-4">
            <div className="bg-red-50 rounded-xl p-4 border border-red-100">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Forgot your passcode?</p>
                  <p className="text-xs text-red-600 mt-1">
                    We will send an OTP to {email}. You will create a new 4-digit passcode.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCreatorFlow('returning_show')}
                className="flex-1 rounded-xl border-neutral-200"
              >
                Go Back
              </Button>
              <Button
                onClick={handleRequestReset}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl h-12"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Request Reset'}
              </Button>
            </div>
          </div>
        )}

        {/* FLOW: RESET OTP SENT */}
        {creatorFlow === 'reset_otp_sent' && (
          <div className="space-y-4">
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <p className="text-sm font-medium text-amber-800">OTP sent!</p>
              <p className="text-xs text-amber-600 mt-1">
                Enter the 6-digit OTP below. After verification, you will create a new 4-digit passcode.
              </p>
            </div>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                placeholder="000000"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="h-12 rounded-xl pl-10 text-center text-lg tracking-[0.5em] font-mono"
              />
            </div>
            <Button
              onClick={handleVerifyResetOTP}
              disabled={otp.length !== 6 || loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl h-12"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify & Create Passcode'}
            </Button>
          </div>
        )}

        {/* FLOW: VERIFIED */}
        {creatorFlow === 'verified' && (
          <div className="bg-green-50 rounded-2xl p-6 border border-green-100 text-center">
            <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="font-semibold text-green-800">Verified!</p>
            <p className="text-sm text-green-600">Redirecting to your profile...</p>
          </div>
        )}
      </div>
    </div>
  )
}