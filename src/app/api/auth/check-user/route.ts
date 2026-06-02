// src/app/api/auth/check-user/route.ts
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
            // Don't reveal if user exists
            return NextResponse.json({
                hasSecurityQuestion: false,
            })
        }

        const hasSecurityQuestion = !!user.user_metadata?.security_question
        const securityQuestion = user.user_metadata?.security_question || null

        return NextResponse.json({
            hasSecurityQuestion,
            securityQuestion,
        })

    } catch (error: any) {
        console.error('Check user error:', error)
        return NextResponse.json(
            { error: 'Failed to check user' },
            { status: 500 }
        )
    }
}