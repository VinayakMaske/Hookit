// src/app/api/auth/send-reset-link/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { randomBytes } from 'crypto'
import { sendPasswordResetEmail } from '@/lib/email'

// Service role client for admin operations
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
)

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email } = body

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            )
        }

        // Find user
        const { data: userData } = await supabaseAdmin.auth.admin.listUsers()
        const user = userData?.users?.find((u: any) => u.email === email)

        if (!user) {
            // Don't reveal if email exists or not (security)
            return NextResponse.json({
                success: true,
                message: 'If an account exists with this email, you will receive a reset link shortly.'
            })
        }

        // Generate secure token
        const token = randomBytes(32).toString('hex')
        const tokenHash = Buffer.from(token).toString('base64')

        // Store token in database (expires in 1 hour)
        const expiresAt = new Date()
        expiresAt.setHours(expiresAt.getHours() + 1)

        const { error: tokenError } = await supabaseAdmin
            .from('password_reset_tokens')
            .insert({
                user_id: user.id,
                token_hash: tokenHash,
                expires_at: expiresAt.toISOString(),
            })

        if (tokenError) {
            console.error('Token storage error:', tokenError)
            return NextResponse.json(
                { error: 'Failed to generate reset token' },
                { status: 500 }
            )
        }

        // Build reset link
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://hookit.online'
        const resetLink = `${appUrl}/reset-password?token=${token}&email=${encodeURIComponent(email)}`

        // Send email
        const userName = user.user_metadata?.full_name || 'User'

        await sendPasswordResetEmail(email, {
            resetLink,
            userName,
            expiresIn: '1 hour',
        })

        return NextResponse.json({
            success: true,
            message: 'If an account exists with this email, you will receive a reset link shortly.'
        })

    } catch (error: any) {
        console.error('Send reset link error:', error)
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        )
    }
}