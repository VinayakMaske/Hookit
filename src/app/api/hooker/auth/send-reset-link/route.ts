// src/app/api/hooker/auth/send-reset-link/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { sendHookerResetEmail } from '../../../../../lib/hooker-email'

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json()

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            )
        }

        const supabase = await createClient()

        // Verify user exists in hooker_profiles
        const { data: profile, error: profileError } = await supabase
            .from('hooker_profiles')
            .select('user_id, email')
            .eq('email', email)
            .single()

        if (profileError || !profile) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        // Generate a reset token (simple random string)
        const resetToken = crypto.randomUUID()
        const expiresAt = new Date()
        expiresAt.setHours(expiresAt.getHours() + 1) // 1 hour expiry

        // Store token in a reset_tokens table
        const { error: tokenError } = await supabase
            .from('hooker_password_resets')
            .insert({
                user_id: profile.user_id,
                email: email,
                token: resetToken,
                expires_at: expiresAt.toISOString(),
                used: false,
            })

        if (tokenError) {
            return NextResponse.json(
                { error: 'Failed to generate reset token' },
                { status: 500 }
            )
        }

        // Send email with reset link
        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/hooker/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`
        
        await sendHookerResetEmail({
            to: email,
            resetUrl,
        })

        return NextResponse.json(
            { message: 'Password reset link sent to your email' },
            { status: 200 }
        )

    } catch (error: any) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}