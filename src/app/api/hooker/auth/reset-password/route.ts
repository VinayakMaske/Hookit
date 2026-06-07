// src/app/api/hooker/auth/reset-password/route.ts
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '../../../../../lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { token, email, newPassword, resetToken } = body

        const resetTokenValue = token || resetToken

        if (!resetTokenValue || !newPassword) {
            return NextResponse.json(
                { error: 'Token and new password are required' },
                { status: 400 }
            )
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            )
        }

        // Regular client for reading reset tokens (uses anon key + cookies)
        const supabase = await createClient()

        // Find the reset token
        const { data: resetRecord, error: resetError } = await supabase
            .from('hooker_password_resets')
            .select('user_id, email, expires_at, used')
            .eq('token', resetTokenValue)
            .single()

        if (resetError || !resetRecord) {
            return NextResponse.json(
                { error: 'Invalid or expired reset token' },
                { status: 400 }
            )
        }

        if (resetRecord.used) {
            return NextResponse.json(
                { error: 'This reset link has already been used' },
                { status: 400 }
            )
        }

        const now = new Date()
        const expiresAt = new Date(resetRecord.expires_at)
        if (now > expiresAt) {
            return NextResponse.json(
                { error: 'Reset token has expired' },
                { status: 400 }
            )
        }

        // Admin client for updating password (uses service role key)
        const adminSupabase = createAdminClient()

        const { error: updateError } = await adminSupabase.auth.admin.updateUserById(
            resetRecord.user_id,
            { password: newPassword }
        )

        if (updateError) {
            return NextResponse.json(
                { error: 'Failed to update password' },
                { status: 500 }
            )
        }

        // Mark token as used
        await supabase
            .from('hooker_password_resets')
            .update({ used: true })
            .eq('token', resetTokenValue)

        return NextResponse.json(
            { message: 'Password reset successfully' },
            { status: 200 }
        )

    } catch (error: any) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}