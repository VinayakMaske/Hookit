// src/app/(site)/creator/[username]/layout.tsx

import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'

type Props = {
  children: React.ReactNode
  params: Promise<{
    username: string
  }>
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { username } = await params
  const supabase = await createClient()

  const { data: creator } = await supabase
    .from('creators')
    .select('username, display_name, bio, avatar_url, website, location, total_views, total_clicks')
    .eq('username', username)
    .single()

  const creatorName = creator?.display_name || creator?.username || username
  const description = creator?.bio || `Explore blogs, products and links shared by ${creatorName} on Hookit.`
  const image = creator?.avatar_url || 'https://hookit.online/og-image.jpg'

  return {
    title: `${creatorName} - Creator on Hookit`,
    description,
    alternates: {
      canonical: `https://hookit.online/creator/${username}`,
    },
    openGraph: {
      title: `${creatorName} - Creator on Hookit`,
      description,
      url: `https://hookit.online/creator/${username}`,
      siteName: 'Hookit',
      images: [{ url: image, width: 1200, height: 630, alt: creatorName }],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${creatorName} - Creator on Hookit`,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function CreatorLayout({
  children,
  params,
}: Props) {
  return <>{children}</>
}