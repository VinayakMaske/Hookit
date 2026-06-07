// src/app/api/hooker/auth/verify-security-answer/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const { email, answer } = await req.json()

        if (!email || !answer) {
            return NextResponse.json(
                { error: 'Email and answer are required' },
                { status: 400 }
            )
        }

        const supabase = await createClient()

        // Get user's security answer from hooker_profiles
        const { data: profile, error } = await supabase
            .from('hooker_profiles')
            .select('user_id, security_answer')
            .eq('email', email)
            .single()

        if (error || !profile) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        // Compare answers (case-insensitive, trimmed)
        const normalizedInput = answer.trim().toLowerCase()
        const normalizedStored = (profile.security_answer || '').trim().toLowerCase()

        if (normalizedInput !== normalizedStored) {
            return NextResponse.json(
                { error: 'Incorrect answer' },
                { status: 401 }
            )
        }

        // Generate a reset token for immediate password reset
        const resetToken = crypto.randomUUID()
        const expiresAt = new Date()
        expiresAt.setHours(expiresAt.getHours() + 1)

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

        return NextResponse.json(
            { 
                message: 'Security answer verified',
                resetToken: resetToken 
            },
            { status: 200 }
        )

    } catch (error: any) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}