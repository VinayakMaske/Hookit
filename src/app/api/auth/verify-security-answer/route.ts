// src/app/api/auth/verify-security-answer/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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
        const { email, answer } = body

        if (!email || !answer) {
            return NextResponse.json(
                { error: 'Email and answer are required' },
                { status: 400 }
            )
        }

        // Find user
        const { data: userData } = await supabaseAdmin.auth.admin.listUsers()
        const user = userData?.users?.find((u: any) => u.email === email)

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        // Get security answer from metadata
        const storedAnswer = user.user_metadata?.security_answer?.toLowerCase().trim()
        const providedAnswer = answer.toLowerCase().trim()

        if (!storedAnswer) {
            return NextResponse.json(
                { error: 'Security question not set up for this account' },
                { status: 400 }
            )
        }

        // Verify answer (simple string comparison, case-insensitive)
        if (storedAnswer !== providedAnswer) {
            return NextResponse.json(
                { error: 'Incorrect answer' },
                { status: 401 }
            )
        }

        // Generate a temporary reset token
        const { data: tokenData, error: tokenError } = await supabaseAdmin
            .from('password_reset_tokens')
            .insert({
                user_id: user.id,
                token_hash: 'security-verified-' + Date.now(),
                expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 min
            })
            .select()
            .single()

        if (tokenError) {
            return NextResponse.json(
                { error: 'Failed to create reset session' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            message: 'Security answer verified',
            resetToken: tokenData.id,
            userId: user.id,
        })

    } catch (error: any) {
        console.error('Verify security answer error:', error)
        return NextResponse.json(
            { error: 'Failed to verify answer' },
            { status: 500 }
        )
    }
}