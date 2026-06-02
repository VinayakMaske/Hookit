// src/app/api/auth/reset-password/route.ts
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
        const { token, email, newPassword, resetToken } = body

        if (!newPassword || newPassword.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            )
        }

        let userId: string = ''

        // Method 1: Email link token
        if (token && email) {
            // Find user by email first
            const { data: userData } = await supabaseAdmin.auth.admin.listUsers()
            const user = userData?.users?.find((u: any) => u.email === email)

            if (!user) {
                return NextResponse.json(
                    { error: 'Invalid reset link' },
                    { status: 400 }
                )
            }

            userId = user.id

            // Verify token exists and is valid
            const tokenHash = Buffer.from(token).toString('base64')

            const { data: tokenRecord, error: tokenError } = await supabaseAdmin
                .from('password_reset_tokens')
                .select('*')
                .eq('user_id', userId)
                .eq('token_hash', tokenHash)
                .is('used_at', null)
                .gt('expires_at', new Date().toISOString())
                .order('created_at', { ascending: false })
                .limit(1)
                .single()

            if (tokenError || !tokenRecord) {
                return NextResponse.json(
                    { error: 'Invalid or expired reset link' },
                    { status: 400 }
                )
            }

            // Mark token as used
            await supabaseAdmin
                .from('password_reset_tokens')
                .update({ used_at: new Date().toISOString() })
                .eq('id', tokenRecord.id)

        // Method 2: Security question reset token
        } else if (resetToken) {
            const { data: tokenRecord, error: tokenError } = await supabaseAdmin
                .from('password_reset_tokens')
                .select('*')
                .eq('id', resetToken)
                .is('used_at', null)
                .gt('expires_at', new Date().toISOString())
                .single()

            if (tokenError || !tokenRecord) {
                return NextResponse.json(
                    { error: 'Invalid or expired reset session' },
                    { status: 400 }
                )
            }

            userId = tokenRecord.user_id

            // Mark token as used
            await supabaseAdmin
                .from('password_reset_tokens')
                .update({ used_at: new Date().toISOString() })
                .eq('id', tokenRecord.id)
        } else {
            return NextResponse.json(
                { error: 'Invalid request' },
                { status: 400 }
            )
        }

        // Update password using admin API
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            userId,
            { password: newPassword }
        )

        if (updateError) {
            return NextResponse.json(
                { error: 'Failed to update password: ' + updateError.message },
                { status: 500 }
            )
        }

        // Clean up old tokens for this user
        await supabaseAdmin
            .from('password_reset_tokens')
            .delete()
            .eq('user_id', userId)

        return NextResponse.json({
            success: true,
            message: 'Password updated successfully. You can now log in with your new password.'
        })

    } catch (error: any) {
        console.error('Reset password error:', error)
        return NextResponse.json(
            { error: 'Failed to reset password' },
            { status: 500 }
        )
    }
}