    // src/app/api/upload/route.ts
    import { NextResponse } from 'next/server'
    import { uploadToR2 } from '@/lib/r2'

    export async function POST(request: Request) {
        try {
            const formData = await request.formData()
            const file = formData.get('file') as File
            const folder = formData.get('folder') as string || 'products'
            const fileName = formData.get('fileName') as string

            if (!file) {
                return NextResponse.json({ error: 'No file provided' }, { status: 400 })
            }

            // Convert File to Buffer
            const bytes = await file.arrayBuffer()
            const buffer = Buffer.from(bytes)

            // Generate key if not provided
            const key = fileName || `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${file.name.split('.').pop()}`

            // Upload to R2
            const publicUrl = await uploadToR2(buffer, key, file.type)

            return NextResponse.json({
                success: true,
                url: publicUrl,
                key: key,
            })

        } catch (error: any) {
            console.error('R2 upload error:', error)
            return NextResponse.json(
                { error: error.message || 'Failed to upload file' },
                { status: 500 }
            )
        }
    }