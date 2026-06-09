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
    .select(`
      username,
      display_name,
      bio,
      avatar_url
    `)
    .eq('username', username)
    .single()

  const creatorName =
    creator?.display_name ||
    creator?.username ||
    username

  const description =
    creator?.bio ||
    `Explore blogs, products and links shared by ${creatorName} on Hookit.`

  const image =
    creator?.avatar_url ||
    'https://hookit.online/og-image.jpg'

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
      images: [image],
      type: 'profile',
    },

    twitter: {
      card: 'summary_large_image',
      title: `${creatorName} - Creator on Hookit`,
      description,
      images: [image],
    },
  }
}

export default function CreatorLayout({
  children,
}: Props) {
  return children
}