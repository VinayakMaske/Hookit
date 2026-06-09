'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Mail, KeyRound, Loader2, AlertCircle } from 'lucide-react'

export default function EditProfileModal({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [passkey, setPasskey] = useState('')
  const [step, setStep] = useState<'email' | 'passkey' | 'verifying'>('email')
  const [creator, setCreator] = useState<any>(null)
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
      if (!data.exists) throw new Error('No creator found with this email')

      setCreator(data.creator)
      setStep('passkey')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Verify passkey
  const handleVerifyPasskey = async () => {
    if (!passkey.trim()) {
      setError('Enter your passkey')
      return
    }
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/creator/verify-passkey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, passkey })
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      // Success! Redirect to edit page
      onClose()
      router.push(`/creator/${data.creator.username}/edit`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
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

        {step === 'email' && (
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
            <Button
              onClick={handleCheckEmail}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl h-12"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Continue'}
            </Button>
          </div>
        )}

        {step === 'passkey' && (
          <div className="space-y-4">
            <div className="bg-purple-50 rounded-xl p-3 mb-4">
              <p className="text-sm text-purple-700">Welcome back, <strong>@{creator?.username}</strong></p>
            </div>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                placeholder="HK-XXXXXX"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value.toUpperCase())}
                className="h-12 rounded-xl pl-10 font-mono tracking-wider uppercase"
              />
            </div>
            <Button
              onClick={handleVerifyPasskey}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl h-12"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify & Edit Profile'}
            </Button>
            <button
              onClick={() => setStep('email')}
              className="text-sm text-purple-600 hover:text-purple-700 w-full text-center"
            >
              Use different email
            </button>
          </div>
        )}
      </div>
    </div>
  )
}