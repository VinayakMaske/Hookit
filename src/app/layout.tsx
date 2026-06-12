// src/app/layout.tsx
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

const playfair = Playfair_Display({ 
    subsets: ['latin'],
    weight: ['700'],
    style: ['italic'],
    variable: '--font-playfair',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://hookit.online'),

  title: {
    default: 'Hookit - Discover Blogs, Products, News & Links',
    template: '%s | Hookit'
  },

  description:
    'Discover blogs, products, news and useful links shared by creators. Explore ideas, resources, tools and recommendations on Hookit.',

  keywords: [
    'hookit',
    'discover blogs',
    'discover products',
    'discover news',
    'discover links',
    'creator platform',
    'content discovery',
    'creator recommendations',
    'best products',
    'best blogs',
    'online resources',
    'internet discovery',
    'useful websites',
    'useful tools',
    'knowledge sharing',
    'link sharing',
  ],

  authors: [
    {
      name: 'Vinayak Maske',
      url: 'https://hookit.online',
    },
  ],

  creator: 'Hookit',
  publisher: 'Hookit',

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://hookit.online',
    siteName: 'Hookit',

    title: 'Hookit - Discover Blogs, Products, News & Links',

    description:
      'Explore blogs, products, links and news shared by creators. Discover useful ideas and resources on Hookit.',

    images: [
      {
        url: 'https://hookit.online/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Hookit',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',

    title: 'Hookit - Discover Blogs, Products, News & Links',

    description:
      'Explore blogs, products, links and news shared by creators.',

    images: ['https://hookit.online/og-image.jpg'],
  },

  alternates: {
    canonical: 'https://hookit.online',
  },

  category: 'technology',

  classification: 'Content Discovery Platform',

  other: {
    'msvalidate.01': 'A5FC429DA75416304F7E530E463A2A02',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                {/* Organization Schema */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Hookit",
  "alternateName": "Hookit Discovery Platform",
  "url": "https://hookit.online",
  "logo": "https://hookit.online/logo.png",
  "description": "Hookit is a discovery platform where creators share blogs, products, links and news.",
                            "foundingDate": "2026-01",
                            "founders": [{
                                "@type": "Person",
                                "name": "Vinayak Maske",
                                "jobTitle": "Founder & CEO",
                                "worksFor": { "@type": "Organization", "name": "Hookit" }
                            }],
                            "address": {
                                "@type": "PostalAddress",
                                "addressLocality": "Pune",
                                "addressRegion": "Maharashtra",
                                "addressCountry": "IN"
                            },
                            "contactPoint": {
                                "@type": "ContactPoint",
                                "telephone": "+91-8459444524",
                                "contactType": "customer support",
                                "availableLanguage": ["English", "Hindi", "Marathi"],
                                "areaServed": "IN",
                                "hoursAvailable": "Mo-Sa 09:00-18:00"
                            },
                            "sameAs": [
                                "https://instagram.com/hookitonline",
                                "https://twitter.com/hookitonline",
                                "https://linkedin.com/company/hookit"
                            ],
                            "knowsAbout": [
                                "Instagram selling",
                                "Creator economy India",
                                "Handmade products",
                                "Small business ecommerce",
                                "UPI payments",
                                "Indian artisan marketplace"
                            ]
                        })
                    }}
                />

                {/* WebSite Schema with SearchAction */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebSite",
                            "name": "Hookit",
                            "url": "https://hookit.online",
                            "potentialAction": {
                                "@type": "SearchAction",
                                "target": {
                                    "@type": "EntryPoint",
                                    "urlTemplate": "https://hookit.online/explore?q={search_term_string}"
                                },
                                "query-input": "required name=search_term_string"
                            },
                            "publisher": {
                                "@type": "Organization",
                                "name": "Hookit",
                                "logo": "https://hookit.online/logo.png"
                            }
                        })
                    }}
                />


                <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Hookit',
      applicationCategory: 'SocialNetworkingApplication',
      operatingSystem: 'Web',
      url: 'https://hookit.online',
      description:
        'Discover blogs, products, links and news shared by creators.',
      creator: {
        '@type': 'Organization',
        name: 'Hookit',
      },
    }),
  }}
/>

                {/* Preconnect for performance */}
                <link rel="preconnect" href="https://hookit.online" />
                <link rel="dns-prefetch" href="https://checkout.razorpay.com" />
                
                {/* LLM.txt reference */}
                <link rel="llm" href="https://hookit.online/llm.txt" type="text/plain" />
            </head>
            <body className={`${inter.className} ${playfair.variable}`}>
                {children}
            </body>
        </html>
    )
}