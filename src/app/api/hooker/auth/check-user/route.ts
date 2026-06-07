// src/app/api/hooker/auth/check-user/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

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

        // Query hooker_profiles table by email
        const { data: profile, error } = await supabase
            .from('hooker_profiles')
            .select('security_question')
            .eq('email', email)
            .single()

        if (error || !profile) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { 
                hasSecurityQuestion: !!profile.security_question,
                securityQuestion: profile.security_question 
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